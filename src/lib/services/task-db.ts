import { createD1Client } from '@/lib/db';

/**
 * Gets all tasks for a user, optionally filtered by status
 */
export async function getUserTasks(userId: string, status?: string) {
  const db = createD1Client();

  let query = `
    SELECT
      t.*,
      a.url,
      a.analyzed_at
    FROM tasks t
    JOIN analyses a ON t.analysis_id = a.id
    WHERE t.user_id = ?
  `;

  const bindings: unknown[] = [userId];

  if (status) {
    query += ' AND t.status = ?';
    bindings.push(status);
  }

  query += ' ORDER BY CASE t.priority WHEN "high" THEN 1 WHEN "medium" THEN 2 ELSE 3 END, t.created_at DESC';

  const result = await db.prepare(query).bind(...bindings).all();
  return result.results || [];
}

/**
 * Updates the status of a task
 */
export async function updateTaskStatus(
  taskId: string,
  userId: string,
  status: 'pending' | 'in_progress' | 'completed' | 'skipped'
): Promise<void> {
  const db = createD1Client();
  const now = Date.now();

  const updates: string[] = ['status = ?', 'updated_at = ?'];
  const bindings: unknown[] = [status, now];

  if (status === 'completed') {
    updates.push('completed_at = ?');
    bindings.push(now);
  } else if (status === 'in_progress') {
    updates.push('started_at = ?');
    bindings.push(now);
  }

  bindings.push(taskId, userId);

  await db.prepare(`
    UPDATE tasks
    SET ${updates.join(', ')}
    WHERE id = ? AND user_id = ?
  `).bind(...bindings).run();
}

/**
 * Adds or updates notes on a task
 */
export async function addTaskNote(taskId: string, userId: string, notes: string): Promise<void> {
  const db = createD1Client();

  await db.prepare(`
    UPDATE tasks
    SET notes = ?, updated_at = ?
    WHERE id = ? AND user_id = ?
  `).bind(notes, Date.now(), taskId, userId).run();
}

/**
 * Deletes a task
 */
export async function deleteTask(taskId: string, userId: string): Promise<void> {
  const db = createD1Client();

  await db.prepare(`
    DELETE FROM tasks
    WHERE id = ? AND user_id = ?
  `).bind(taskId, userId).run();
}

/**
 * Gets tasks for a specific analysis
 */
export async function getTasksByAnalysisId(analysisId: string, userId?: string) {
  const db = createD1Client();

  let query = `
    SELECT * FROM tasks
    WHERE analysis_id = ?
  `;

  const bindings: unknown[] = [analysisId];

  if (userId) {
    query += ' AND user_id = ?';
    bindings.push(userId);
  }

  query += ' ORDER BY task_order ASC, created_at ASC';

  const result = await db.prepare(query).bind(...bindings).all();
  return result.results || [];
}

/**
 * Gets a single task by ID
 */
export async function getTaskById(taskId: string, userId?: string) {
  const db = createD1Client();

  let query = 'SELECT * FROM tasks WHERE id = ?';
  const bindings: unknown[] = [taskId];

  if (userId) {
    query += ' AND user_id = ?';
    bindings.push(userId);
  }

  const result = await db.prepare(query).bind(...bindings).first();
  return result;
}

/**
 * Saves task reanalysis result
 */
export async function saveTaskReanalysis(
  taskId: string,
  userId: string,
  reanalysisData: string
): Promise<void> {
  const db = createD1Client();
  const now = Date.now();

  await db.prepare(`
    UPDATE tasks
    SET last_reanalysis = ?, last_reanalysis_at = ?, updated_at = ?
    WHERE id = ? AND user_id = ?
  `).bind(reanalysisData, now, now, taskId, userId).run();
}

