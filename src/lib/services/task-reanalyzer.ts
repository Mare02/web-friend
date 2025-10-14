import { AIProvider } from "../ai";
import { WebsiteData, SavedTask, TaskReanalysis } from "../validators/schema";

/**
 * Reanalyzes a specific task to check if it has been resolved
 * Fetches current website data and compares against task requirements
 */
export async function reanalyzeTask(
  task: SavedTask,
  currentWebsiteData: WebsiteData,
  aiProvider: AIProvider
): Promise<TaskReanalysis> {
  const prompt = `You are a website optimization expert. A user was given a specific task to improve their website, and now they want to verify if they've successfully resolved it.

Your job is to analyze the current state of the website and determine:
1. Whether the task has been resolved (resolved, partially_resolved, or not_resolved)
2. A score from 0-100 indicating how well the task was completed
3. Detailed feedback on what was done well and what still needs work
4. Specific suggestions for further improvements (if any)

Be thorough, fair, and constructive in your assessment.

TASK DETAILS:
Category: ${task.category}
Priority: ${task.priority}
Title: ${task.title}
Description: ${task.description}
Expected Impact: ${task.impact}
Expected Effort: ${task.effort}

Respond in the following JSON format:
{
  "status": "resolved" | "partially_resolved" | "not_resolved",
  "score": <number 0-100>,
  "feedback": "<detailed feedback string>",
  "suggestions": ["<suggestion 1>", "<suggestion 2>", ...]
}

Guidelines for scoring:
- 90-100: Excellent implementation, task fully resolved
- 70-89: Good implementation, minor improvements possible
- 50-69: Partial implementation, significant work still needed
- 30-49: Minimal progress, most work still required
- 0-29: Little to no progress on the task

IMPORTANT: 
- Return ONLY valid JSON, no additional text
- Be specific in your feedback, referencing actual data from the website
- If the task is about something that cannot be verified from the HTML (like server-side performance), mention this in feedback
- Consider the task category when evaluating (SEO, content, performance, accessibility)`;

  const context = formatWebsiteContext(currentWebsiteData, task.category);

  try {
    const response = await aiProvider.analyze(prompt, context);
    
    // Parse the JSON response
    const cleanedResponse = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const parsed = JSON.parse(cleanedResponse);

    // Validate and structure the response
    const reanalysis: TaskReanalysis = {
      status: parsed.status || 'not_resolved',
      score: Math.min(100, Math.max(0, parsed.score || 0)),
      feedback: parsed.feedback || 'Unable to generate feedback',
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      checked_at: Date.now(),
    };

    return reanalysis;
  } catch (error) {
    console.error('Error parsing reanalysis response:', error);
    
    // Return a fallback response
    return {
      status: 'not_resolved',
      score: 0,
      feedback: 'Unable to analyze task completion. Please try again.',
      suggestions: ['Ensure the website is accessible and try reanalyzing'],
      checked_at: Date.now(),
    };
  }
}

/**
 * Formats website data into context string based on task category
 * Focuses on relevant data for the specific category
 */
function formatWebsiteContext(data: WebsiteData, category: string): string {
  const baseContext = `
Current Website State:
URL: ${data.url}
Title: ${data.title || "No title"}
Meta Description: ${data.metaDescription || "No meta description"}
Framework: ${data.framework || "Unknown"}
Word Count: ${data.wordCount}
`;

  // Add category-specific context
  let categoryContext = '';

  switch (category) {
    case 'seo':
      categoryContext = `
SEO-Specific Data:
Title Length: ${data.title?.length || 0} characters
Meta Description Length: ${data.metaDescription?.length || 0} characters
Meta Keywords: ${data.metaKeywords || "None"}

Headings Structure:
${formatHeadings(data.headings)}

Open Graph Tags:
- OG Title: ${data.openGraph?.title || "Missing"}
- OG Description: ${data.openGraph?.description || "Missing"}
- OG Image: ${data.openGraph?.image || "Missing"}
- OG Type: ${data.openGraph?.type || "Missing"}
`;
      break;

    case 'content':
      categoryContext = `
Content-Specific Data:
Word Count: ${data.wordCount}

Headings Structure:
${formatHeadings(data.headings)}

Content Organization:
- Total Headings: ${Object.values(data.headings).flat().length}
- H1 Count: ${data.headings.h1.length}
- H2 Count: ${data.headings.h2.length}
- H3 Count: ${data.headings.h3.length}
`;
      break;

    case 'performance':
      categoryContext = `
Performance-Specific Data:
Resources:
- Scripts: ${data.scripts}
- Stylesheets: ${data.stylesheets}

Images:
- Total: ${data.images.total}
- With alt text: ${data.images.withAlt}
- Without alt text: ${data.images.withoutAlt}

Framework: ${data.framework || "Unknown"}
`;
      break;

    case 'accessibility':
      categoryContext = `
Accessibility-Specific Data:
Headings Structure:
${formatHeadings(data.headings)}

Images:
- Total images: ${data.images.total}
- Images with alt text: ${data.images.withAlt} (${
        data.images.total > 0
          ? Math.round((data.images.withAlt / data.images.total) * 100)
          : 0
      }%)
- Images without alt text: ${data.images.withoutAlt}

Page Title: ${data.title || "MISSING - Critical for screen readers"}
Meta Description: ${data.metaDescription || "MISSING"}
`;
      break;
  }

  return baseContext + categoryContext;
}

/**
 * Format headings for display in prompts
 */
function formatHeadings(headings: WebsiteData["headings"]): string {
  const parts: string[] = [];

  if (headings.h1.length > 0) {
    parts.push(`H1 (${headings.h1.length}): ${headings.h1.join(", ")}`);
  } else {
    parts.push("H1: MISSING");
  }

  if (headings.h2.length > 0) {
    parts.push(
      `H2 (${headings.h2.length}): ${headings.h2.slice(0, 5).join(", ")}${
        headings.h2.length > 5 ? "..." : ""
      }`
    );
  }

  if (headings.h3.length > 0) {
    parts.push(`H3 (${headings.h3.length})`);
  }

  if (headings.h4.length > 0) {
    parts.push(`H4 (${headings.h4.length})`);
  }

  if (headings.h5.length > 0) {
    parts.push(`H5 (${headings.h5.length})`);
  }

  if (headings.h6.length > 0) {
    parts.push(`H6 (${headings.h6.length})`);
  }

  return parts.join("\n");
}

