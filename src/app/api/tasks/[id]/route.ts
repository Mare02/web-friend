import { NextRequest, NextResponse } from 'next/server';
import { updateTaskStatus, addTaskNote, deleteTask } from '@/lib/services/task-db';
import { auth } from '@clerk/nextjs/server';

/**
 * PATCH /api/tasks/[id]
 * Updates task status or adds notes
 */
export async function PATCH(
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
    const { id } = await params;
    const body = await request.json();

    if (body.status) {
      await updateTaskStatus(id, userId, body.status);
    }

    if (body.notes !== undefined) {
      await addTaskNote(id, userId, body.notes);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update task',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tasks/[id]
 * Deletes a task
 */
export async function DELETE(
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
    const { id } = await params;
    await deleteTask(id, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete task',
      },
      { status: 500 }
    );
  }
}

