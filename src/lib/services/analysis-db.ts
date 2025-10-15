import { createD1Client } from '@/lib/db';
import { WebsiteData, AnalysisResult, ActionPlan, SavedTask } from '@/lib/validators/schema';

/**
 * Generates a unique ID for database records
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Saves a complete website analysis to the database
 */
export async function saveAnalysis(params: {
  userId: string | null;
  url: string;
  websiteData: WebsiteData;
  analysisResult: AnalysisResult;
  actionPlan: ActionPlan;
}): Promise<string> {
  const db = createD1Client();
  const analysisId = generateId('analysis');
  const now = Date.now();

  // Save analysis
  await db.prepare(`
    INSERT INTO analyses (
      id, user_id, url, website_data, analysis_result,
      action_plan_summary, action_plan_timeline, quick_wins,
      analyzed_at, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    analysisId,
    params.userId,
    params.url,
    JSON.stringify(params.websiteData),
    JSON.stringify(params.analysisResult),
    params.actionPlan.summary,
    params.actionPlan.timeline || null,
    JSON.stringify(params.actionPlan.quickWins),
    now,
    now
  ).run();

  // Save tasks
  for (let i = 0; i < params.actionPlan.tasks.length; i++) {
    const task = params.actionPlan.tasks[i];

    await db.prepare(`
      INSERT INTO tasks (
        id, analysis_id, user_id, category, priority,
        title, description, effort, impact, estimated_time,
        status, task_order, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      task.id,
      analysisId,
      params.userId,
      task.category,
      task.priority,
      task.title,
      task.description,
      task.effort,
      task.impact,
      task.estimatedTime || null,
      'pending',
      i,
      now
    ).run();
  }

  return analysisId;
}

/**
 * Retrieves a single analysis by ID with all associated tasks
 */
export async function getAnalysis(analysisId: string) {
  const db = createD1Client();

  // Get analysis
  const analysis = await db.prepare('SELECT * FROM analyses WHERE id = ?')
    .bind(analysisId)
    .first<{
      id: string;
      url: string;
      website_data: string;
      analysis_result: string;
      action_plan_summary: string;
      action_plan_timeline: string | null;
      quick_wins: string;
      analyzed_at: number;
    }>();

  if (!analysis) return null;

  // Get tasks
  const tasksResult = await db.prepare(
    'SELECT * FROM tasks WHERE analysis_id = ? ORDER BY task_order'
  ).bind(analysisId).all();

  return {
    id: analysis.id,
    url: analysis.url,
    websiteData: JSON.parse(analysis.website_data),
    analysisResult: JSON.parse(analysis.analysis_result),
    actionPlan: {
      summary: analysis.action_plan_summary,
      timeline: analysis.action_plan_timeline,
      quickWins: JSON.parse(analysis.quick_wins || '[]'),
      tasks: (tasksResult.results || []) as SavedTask[],
    },
    analyzedAt: analysis.analyzed_at,
  };
}

/**
 * Updates an existing analysis with action plan data
 */
export async function updateAnalysisWithActionPlan(
  analysisId: string,
  actionPlan: ActionPlan
): Promise<void> {
  const db = createD1Client();
  const now = Date.now();

  // Update analysis with action plan
  await db.prepare(`
    UPDATE analyses SET
      action_plan_summary = ?,
      action_plan_timeline = ?,
      quick_wins = ?
    WHERE id = ?
  `).bind(
    actionPlan.summary,
    actionPlan.timeline || null,
    JSON.stringify(actionPlan.quickWins),
    analysisId
  ).run();

  // Delete old tasks if any (in case of regeneration)
  await db.prepare('DELETE FROM tasks WHERE analysis_id = ?')
    .bind(analysisId)
    .run();

  // Insert new tasks
  for (let i = 0; i < actionPlan.tasks.length; i++) {
    const task = actionPlan.tasks[i];

    await db.prepare(`
      INSERT INTO tasks (
        id, analysis_id, user_id, category, priority,
        title, description, effort, impact, estimated_time,
        status, task_order, created_at
      ) VALUES (?, ?, (SELECT user_id FROM analyses WHERE id = ?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      task.id,
      analysisId,
      analysisId, // Subquery to get user_id from analysis
      task.category,
      task.priority,
      task.title,
      task.description,
      task.effort,
      task.impact,
      task.estimatedTime || null,
      'pending',
      i,
      now
    ).run();
  }
}

/**
 * Gets the most recent analysis for a specific user and URL
 */
export async function getLatestAnalysisByUrl(userId: string | null, url: string) {
  const db = createD1Client();

  const result = await db.prepare(`
    SELECT id FROM analyses
    WHERE user_id ${userId ? '= ?' : 'IS NULL'} AND url = ?
    ORDER BY analyzed_at DESC
    LIMIT 1
  `);

  const analysis = userId 
    ? await result.bind(userId, url).first<{ id: string }>()
    : await result.bind(url).first<{ id: string }>();

  return analysis;
}

/**
 * Gets all analyses for a specific user
 */
export async function getUserAnalyses(userId: string, limit = 10) {
  const db = createD1Client();

  const result = await db.prepare(`
    SELECT id, url, action_plan_summary, analyzed_at, created_at
    FROM analyses
    WHERE user_id = ?
    ORDER BY analyzed_at DESC
    LIMIT ?
  `).bind(userId, limit).all();

  return result.results || [];
}

/**
 * Deletes an analysis and all associated tasks (cascade)
 */
export async function deleteAnalysis(analysisId: string, userId: string): Promise<void> {
  const db = createD1Client();

  // Tasks cascade delete automatically
  await db.prepare('DELETE FROM analyses WHERE id = ? AND user_id = ?')
    .bind(analysisId, userId)
    .run();
}

/**
 * Deletes all analyses for a specific URL and user, along with all associated tasks
 */
export async function deleteAllAnalysesByUrl(analysisId: string, userId: string): Promise<{ deletedCount: number; url: string }> {
  const db = createD1Client();

  // First, get the URL from the analysis we're deleting
  const analysis = await db.prepare('SELECT url FROM analyses WHERE id = ? AND user_id = ?')
    .bind(analysisId, userId)
    .first<{ url: string }>();

  if (!analysis) {
    throw new Error('Analysis not found');
  }

  // Get count of analyses to be deleted for the response
  const countResult = await db.prepare('SELECT COUNT(*) as count FROM analyses WHERE url = ? AND user_id = ?')
    .bind(analysis.url, userId)
    .first<{ count: number }>();

  const deletedCount = countResult?.count || 0;

  // Delete all analyses for this URL (tasks will cascade delete automatically)
  await db.prepare('DELETE FROM analyses WHERE url = ? AND user_id = ?')
    .bind(analysis.url, userId)
    .run();

  return { deletedCount, url: analysis.url };
}

