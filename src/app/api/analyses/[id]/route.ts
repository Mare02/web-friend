import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAnalysis, deleteAnalysis } from '@/lib/services/analysis-db';

/**
 * GET /api/analyses/[id]
 * Returns a single analysis with all details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const analysis = await getAnalysis(id);

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: 'Analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch analysis',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/analyses/[id]
 * Deletes an analysis and all associated tasks
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Delete the analysis (tasks will cascade delete)
    await deleteAnalysis(id, userId);

    return NextResponse.json({
      success: true,
      message: 'Analysis deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting analysis:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete analysis',
      },
      { status: 500 }
    );
  }
}

