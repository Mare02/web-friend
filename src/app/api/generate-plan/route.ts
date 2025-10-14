import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { actionPlanResponseSchema } from "@/lib/validators/schema";
import { generateActionPlan } from "@/lib/services/action-planner";
import { saveAnalysis, updateAnalysisWithActionPlan, getLatestAnalysisByUrl } from "@/lib/services/analysis-db";
import { createAIProvider } from "@/lib/ai";
import { getUserById, syncUserFromClerk } from "@/lib/services/user-service";

/**
 * POST /api/generate-plan
 * Generates an actionable improvement plan based on website analysis
 * and saves the complete analysis to the database
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

    // Get authenticated user and ensure they exist in database
    const { userId } = await auth();

    if (userId) {
      try {
        // Ensure user profile exists in database before saving analysis
        const existingUser = await getUserById(userId);

        if (!existingUser) {
          // User not synced yet - fetch from Clerk and sync
          console.log(`User ${userId} not found in DB, syncing from Clerk...`);
          const client = await clerkClient();
          const clerkUser = await client.users.getUser(userId);

          await syncUserFromClerk(
            userId,
            clerkUser.emailAddresses[0]?.emailAddress || null,
            clerkUser.firstName || null,
            clerkUser.lastName || null,
            clerkUser.imageUrl || null
          );
          console.log(`User ${userId} synced successfully`);
        }
      } catch (syncError) {
        console.error("Failed to sync user:", syncError);
        // Continue - will try to save without user ID if sync fails
      }
    }

    try {
      // Try to find the most recent analysis for this user+URL to update it
      const existingAnalysis = await getLatestAnalysisByUrl(userId || null, websiteData.url);
      
      let analysisId: string;

      if (existingAnalysis) {
        // Update existing analysis with action plan
        console.log(`Updating existing analysis ${existingAnalysis.id} with action plan`);
        await updateAnalysisWithActionPlan(existingAnalysis.id, actionPlan);
        analysisId = existingAnalysis.id;
      } else {
        // No existing analysis found - create new one (fallback for edge cases)
        console.log('No existing analysis found, creating new one with action plan');
        analysisId = await saveAnalysis({
          userId: userId || null,
          url: websiteData.url,
          websiteData,
          analysisResult: analysis,
          actionPlan,
        });
      }

      // Return successful response with analysis ID
      const response = actionPlanResponseSchema.parse({
        success: true,
        data: {
          ...actionPlan,
          id: analysisId,
        },
      });

      return NextResponse.json(response);
    } catch (dbError) {
      console.error("Database error (non-fatal):", dbError);
      // Continue even if database save fails (for development)
      const response = actionPlanResponseSchema.parse({
        success: true,
        data: actionPlan,
      });
      return NextResponse.json(response);
    }
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

