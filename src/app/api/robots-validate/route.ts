import { NextRequest, NextResponse } from "next/server";
import { robotsValidateRequestSchema, robotsValidateResponseSchema } from "@/lib/validators/schema";
import { analyzeRobotsAndIndexability } from "@/lib/services/robots-validator";

/**
 * POST /api/robots-validate
 * Analyzes robots.txt and indexability configuration for a website
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = robotsValidateRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid input",
        },
        { status: 400 }
      );
    }

    const { url } = validation.data;

    // Analyze robots.txt and indexability
    let analysisResult;
    try {
      analysisResult = await analyzeRobotsAndIndexability(url);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to analyze robots.txt and indexability",
        },
        { status: 500 }
      );
    }

    // Validate that we have complete data before responding
    if (!analysisResult) {
      return NextResponse.json(
        {
          success: false,
          error: "Incomplete analysis data generated",
        },
        { status: 500 }
      );
    }

    // Return successful response
    const response = robotsValidateResponseSchema.parse({
      success: true,
      data: analysisResult,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
