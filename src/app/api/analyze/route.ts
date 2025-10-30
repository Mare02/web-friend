import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { urlSchema, analyzeResponseSchema } from "@/lib/validators/schema";
import { fetchWebsiteData } from "@/lib/services/website-fetcher";
import { analyzeWebsite } from "@/lib/services/analyzer";
import { createAIProvider } from "@/lib/ai";
import { saveAnalysis } from "@/lib/services/analysis-service";
import { getUserById, syncUserFromClerk } from "@/lib/services/user-service";

/**
 * POST /api/analyze
 * Analyzes a website URL for SEO, content, performance, and accessibility
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = urlSchema.safeParse(body);

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

    // Fetch website data
    let websiteData;
    try {
      websiteData = await fetchWebsiteData(url);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch website data",
        },
        { status: 500 }
      );
    }

    // Create AI provider and analyze
    let analysisResult;
    try {
      const aiProvider = createAIProvider("groq", { apiKey });
      analysisResult = await analyzeWebsite(websiteData, aiProvider);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to analyze website",
        },
        { status: 500 }
      );
    }

    const { analysis, lighthouseData } = analysisResult;

    // Save analysis for authenticated users
    let analysisId: string | undefined;
    try {
      const { userId } = await auth();
      if (userId) {
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

        analysisId = await saveAnalysis(userId, url, websiteData, analysis, lighthouseData);
      }
    } catch (error) {
      // Log error but don't fail the request
      console.error("Failed to save analysis:", error);
    }

    // Validate that we have complete data before responding
    if (!websiteData || !analysis) {
      return NextResponse.json(
        {
          success: false,
          error: "Incomplete analysis data generated",
        },
        { status: 500 }
      );
    }

    // Return successful response
    const response = analyzeResponseSchema.parse({
      success: true,
      data: {
        websiteData,
        analysis,
        lighthouseData,
        analysisId,
      },
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

