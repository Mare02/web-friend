/**
 * GET /api/history
 * Fetches analysis history for authenticated user
 * Returns analyses grouped by URL
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAnalysisHistory } from "@/lib/services/analysis-service";

export async function GET(): Promise<Response> {
  try {
    // Require authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch analysis history
    const history = await getAnalysisHistory(userId);

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch analysis history",
      },
      { status: 500 }
    );
  }
}

