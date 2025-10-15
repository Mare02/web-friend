import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAnalysis, deleteAllAnalysesByUrl } from '@/lib/services/analysis-db';

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
 * Deletes all analyses for the same URL and all associated tasks
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

    // Delete all analyses for the same URL (tasks will cascade delete)
    const result = await deleteAllAnalysesByUrl(id, userId);

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} analysis${result.deletedCount === 1 ? '' : 'es'} for ${result.url}`,
      data: {
        deletedCount: result.deletedCount,
        url: result.url,
      },
    });
  } catch (error) {
    console.error('Error deleting analyses:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete analyses',
      },
      { status: 500 }
    );
  }
}

