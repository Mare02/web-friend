import { NextRequest, NextResponse } from "next/server";
import { urlSchema, analyzeResponseSchema } from "@/lib/validators/schema";
import { fetchWebsiteData } from "@/lib/services/website-fetcher";
import { analyzeWebsite } from "@/lib/services/analyzer";
import { createAIProvider } from "@/lib/ai";

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
    let analysis;
    try {
      const aiProvider = createAIProvider("groq", { apiKey });
      analysis = await analyzeWebsite(websiteData, aiProvider);
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

    // Return successful response
    const response = analyzeResponseSchema.parse({
      success: true,
      data: {
        websiteData,
        analysis,
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

