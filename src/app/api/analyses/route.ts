import { NextRequest, NextResponse } from 'next/server';
import { getUserAnalyses } from '@/lib/services/analysis-db';

/**
 * GET /api/analyses
 * Returns analysis history for authenticated users
 */
export async function GET(request: NextRequest) {
  // TODO: Replace with actual Clerk auth when available
  // const { userId } = auth();

  // For now, get userId from query params or header for testing
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const analyses = await getUserAnalyses(userId, limit);

    return NextResponse.json({
      success: true,
      data: analyses,
    });
  } catch (error) {
    console.error('Error fetching analyses:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch analyses',
      },
      { status: 500 }
    );
  }
}

