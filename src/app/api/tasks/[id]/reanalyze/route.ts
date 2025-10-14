import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getTaskById, saveTaskReanalysis } from '@/lib/services/task-db';
import { getAnalysis } from '@/lib/services/analysis-db';
import { fetchWebsiteData } from '@/lib/services/website-fetcher';
import { reanalyzeTask } from '@/lib/services/task-reanalyzer';
import { createAIProvider } from '@/lib/ai';
import { SavedTask, taskReanalysisSchema } from '@/lib/validators/schema';

/**
 * POST /api/tasks/[id]/reanalyze
 * Reanalyzes a task to check if it has been resolved
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const { id: taskId } = await params;

    // Get the task
    const task = await getTaskById(taskId, userId);
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    // Get the associated analysis to get the URL
    const analysis = await getAnalysis((task as SavedTask).analysis_id);
    if (!analysis) {
      return NextResponse.json(
        { success: false, error: 'Associated analysis not found' },
        { status: 404 }
      );
    }

    // Fetch current website data
    let currentWebsiteData;
    try {
      currentWebsiteData = await fetchWebsiteData(analysis.url);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch website data: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        },
        { status: 400 }
      );
    }

    // Get API key from request body or environment
    const body = await request.json().catch(() => ({}));
    const apiKey = body.apiKey || process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'API key is required. Please provide it in the request or set GROQ_API_KEY environment variable.',
        },
        { status: 400 }
      );
    }

    // Create AI provider
    const aiProvider = createAIProvider('groq', apiKey);

    // Perform reanalysis
    const reanalysisResult = await reanalyzeTask(
      task as SavedTask,
      currentWebsiteData,
      aiProvider
    );

    // Validate the result
    const validatedResult = taskReanalysisSchema.parse(reanalysisResult);

    // Save the reanalysis result
    await saveTaskReanalysis(
      taskId,
      userId,
      JSON.stringify(validatedResult)
    );

    return NextResponse.json({
      success: true,
      data: validatedResult,
    });
  } catch (error) {
    console.error('Error reanalyzing task:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reanalyze task',
      },
      { status: 500 }
    );
  }
}

