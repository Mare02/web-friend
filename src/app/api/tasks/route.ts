import { NextRequest, NextResponse } from 'next/server';
import { getUserTasks } from '@/lib/services/task-db';
import { auth } from '@clerk/nextjs/server';

/**
 * GET /api/tasks
 * Returns tasks for authenticated users, optionally filtered by status
 */
export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const status = request.nextUrl.searchParams.get('status') || undefined;
    const tasks = await getUserTasks(userId, status);

    return NextResponse.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
      },
      { status: 500 }
    );
  }
}

