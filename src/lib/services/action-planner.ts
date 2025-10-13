import { AIProvider } from "../ai";
import {
  AnalysisResult,
  WebsiteData,
  ActionPlan,
  actionPlanSchema,
} from "../validators/schema";

/**
 * Extracts key points from analysis text (first 400 characters of each section)
 */
function summarizeAnalysis(text: string): string {
  // Take first 400 chars and add ellipsis if truncated
  const summary = text.substring(0, 400);
  return text.length > 400 ? summary + "..." : summary;
}

/**
 * Generates an actionable improvement plan based on website analysis
 */
export async function generateActionPlan(
  analysis: AnalysisResult,
  websiteData: WebsiteData,
  aiProvider: AIProvider
): Promise<ActionPlan> {
  const prompt = `You are a web optimization consultant. Your response must be valid JSON only.

Create an actionable improvement plan with 6-10 specific, prioritized tasks.

Each task object must have:
- id (string): unique identifier like "seo-1" or "perf-1"
- category (string): must be exactly "seo", "content", "performance", or "accessibility"
- priority (string): must be exactly "high", "medium", or "low"
- title (string): Clear action like "Add meta description"
- description (string): What needs to be done
- effort (string): must be exactly "quick", "moderate", or "significant"
- impact (string): must be exactly "low", "medium", or "high"
- estimatedTime (string, optional): like "30 minutes"

Include 3-5 quick wins (high-impact, low-effort items as strings).

Response must be valid JSON with this structure:
{
  "summary": "string (2-3 sentences)",
  "tasks": [array of task objects],
  "quickWins": [array of strings],
  "timeline": "string (2-3 sentences)"
}`;

  const context = `
Website: ${websiteData.url}

METRICS:
- Title: ${websiteData.title || "Missing"} (${websiteData.title?.length || 0} chars)
- Meta Description: ${websiteData.metaDescription ? "Present" : "Missing"} (${websiteData.metaDescription?.length || 0} chars)
- H1 Count: ${websiteData.headings.h1.length}
- Images: ${websiteData.images.total} (${websiteData.images.withoutAlt} missing alt text)
- Scripts: ${websiteData.scripts}, Stylesheets: ${websiteData.stylesheets}
- Word Count: ${websiteData.wordCount}

CONTENT:
${summarizeAnalysis(analysis.content)}

SEO:
${summarizeAnalysis(analysis.seo)}

PERFORMANCE:
${summarizeAnalysis(analysis.performance)}

ACCESSIBILITY:
${summarizeAnalysis(analysis.accessibility)}
`;

  try {
    const result = await aiProvider.analyze(prompt, context, { jsonMode: true });

    // Clean up the response - remove markdown code blocks and extra text
    let cleanedResult = result.trim();

    // Remove markdown code blocks
    if (cleanedResult.startsWith("```json")) {
      cleanedResult = cleanedResult.replace(/^```json\s*/, "").replace(/```\s*$/, "");
    } else if (cleanedResult.startsWith("```")) {
      cleanedResult = cleanedResult.replace(/^```\s*/, "").replace(/```\s*$/, "");
    }

    // Find JSON object boundaries (handle text before/after JSON)
    const jsonStart = cleanedResult.indexOf('{');
    const jsonEnd = cleanedResult.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1) {
      cleanedResult = cleanedResult.substring(jsonStart, jsonEnd + 1);
    }

    // Fix common JSON issues
    cleanedResult = cleanedResult
      .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' '); // Normalize whitespace

    // Parse and validate the JSON response
    const parsedResult = JSON.parse(cleanedResult);
    const validatedPlan = actionPlanSchema.parse(parsedResult);

    return validatedPlan;
  } catch (error) {
    // Log the actual response for debugging
    console.error("Error generating action plan:", error);
    console.error("AI Response might be malformed. Please try again.");

    throw new Error(
      error instanceof Error
        ? `Failed to generate action plan: ${error.message}`
        : "Failed to generate action plan"
    );
  }
}

