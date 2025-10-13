import { NextRequest, NextResponse } from "next/server";
import { actionPlanResponseSchema } from "@/lib/validators/schema";
import { generateActionPlan } from "@/lib/services/action-planner";
import { createAIProvider } from "@/lib/ai";

/**
 * POST /api/generate-plan
 * Generates an actionable improvement plan based on website analysis
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { analysis, websiteData } = body;

    // Validate that we have the required data
    if (!analysis || !websiteData) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required data: analysis and websiteData are required",
        },
        { status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GROQ_API_KEY is not configured. Please add it to your .env.local file.",
        },
        { status: 500 }
      );
    }

    // Create AI provider and generate action plan
    // Use llama model which has higher token limits than gpt-oss-120b
    let actionPlan;
    try {
      const aiProvider = createAIProvider("groq", {
        apiKey,
        model: "llama-3.3-70b-versatile"
      });
      actionPlan = await generateActionPlan(analysis, websiteData, aiProvider);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to generate action plan",
        },
        { status: 500 }
      );
    }

    // Return successful response
    const response = actionPlanResponseSchema.parse({
      success: true,
      data: actionPlan,
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

