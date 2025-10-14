import { AIProvider } from "../ai";
import { WebsiteData, AnalysisResult } from "../validators/schema";

/**
 * Orchestrates AI analysis of website data
 * Generates structured prompts for different analysis categories
 */
export async function analyzeWebsite(
  websiteData: WebsiteData,
  aiProvider: AIProvider
): Promise<AnalysisResult> {
  // Run all analyses in parallel for better performance
  const [content, seo, performance, accessibility] = await Promise.all([
    analyzeContent(websiteData, aiProvider),
    analyzeSEO(websiteData, aiProvider),
    analyzePerformance(websiteData, aiProvider),
    analyzeAccessibility(websiteData, aiProvider),
  ]);

  return {
    content,
    seo,
    performance,
    accessibility,
  };
}

/**
 * Analyze content quality and provide insights
 */
async function analyzeContent(
  data: WebsiteData,
  ai: AIProvider
): Promise<string> {
  const prompt = `You are a content quality expert. Analyze and assess the website's content quality.

Focus on:
- Content clarity and readability assessment
- Heading structure and hierarchy evaluation
- Content depth and value analysis
- Writing style and tone observations
- Engagement potential and user experience

Provide a comprehensive assessment with key findings and insights. Focus on what you observe rather than prescriptive action items.

IMPORTANT: Do NOT include any URLs, links, or web addresses in your response. Focus only on analysis and insights without referencing external resources.`;

  const context = `
Website: ${data.url}
Title: ${data.title || "No title"}
Meta Description: ${data.metaDescription || "No meta description"}

Headings:
${formatHeadings(data.headings)}

Word Count: ${data.wordCount}

Framework: ${data.framework || "Unknown"}
`;

  return ai.analyze(prompt, context);
}

/**
 * Analyze SEO aspects
 */
async function analyzeSEO(data: WebsiteData, ai: AIProvider): Promise<string> {
  const prompt = `You are an SEO expert. Analyze and evaluate the website's SEO implementation.

Focus on:
- Title tag analysis (ideal: 50-60 characters)
- Meta description evaluation (ideal: 150-160 characters)
- Heading hierarchy assessment (H1, H2, H3 structure)
- Keyword usage patterns
- Open Graph tags for social sharing
- Overall SEO health assessment

Provide a comprehensive SEO evaluation with key findings, strengths, and areas for improvement. Focus on insights and assessment.

IMPORTANT: Do NOT include any URLs, links, or web addresses in your response. Focus only on analysis and insights without referencing external resources.`;

  const context = `
Website: ${data.url}

Title: ${data.title || "MISSING"}
Title Length: ${data.title?.length || 0} characters

Meta Description: ${data.metaDescription || "MISSING"}
Meta Description Length: ${data.metaDescription?.length || 0} characters

Meta Keywords: ${data.metaKeywords || "None"}

Headings:
${formatHeadings(data.headings)}

Open Graph:
- OG Title: ${data.openGraph?.title || "Missing"}
- OG Description: ${data.openGraph?.description || "Missing"}
- OG Image: ${data.openGraph?.image || "Missing"}
- OG Type: ${data.openGraph?.type || "Missing"}
`;

  return ai.analyze(prompt, context);
}

/**
 * Analyze performance indicators
 */
async function analyzePerformance(
  data: WebsiteData,
  ai: AIProvider
): Promise<string> {
  const prompt = `You are a web performance expert. Analyze and assess the website's performance indicators.

Focus on:
- Script and stylesheet count analysis
- Image optimization status
- Resource loading patterns
- Framework-specific considerations
- Performance characteristics and potential bottlenecks

Provide a thorough performance assessment with observations about what could impact load times and user experience. Focus on analysis and insights.

IMPORTANT: Do NOT include any URLs, links, or web addresses in your response. Focus only on analysis and insights without referencing external resources.`;

  const context = `
Website: ${data.url}
Framework: ${data.framework || "Unknown"}

Resources:
- Scripts: ${data.scripts}
- Stylesheets: ${data.stylesheets}

Images:
- Total: ${data.images.total}
- With alt text: ${data.images.withAlt}
- Without alt text: ${data.images.withoutAlt}

Word Count: ${data.wordCount}
`;

  return ai.analyze(prompt, context);
}

/**
 * Analyze accessibility
 */
async function analyzeAccessibility(
  data: WebsiteData,
  ai: AIProvider
): Promise<string> {
  const prompt = `You are a web accessibility (a11y) expert. Analyze and evaluate the website's accessibility implementation.

Focus on:
- Image alt text coverage assessment
- Heading hierarchy evaluation (should have one H1, proper nesting)
- Semantic HTML usage patterns
- ARIA compliance status
- Screen reader compatibility considerations
- Keyboard navigation accessibility

Provide a comprehensive accessibility assessment with key findings about what works well and what could be improved. Focus on insights and evaluation.

IMPORTANT: Do NOT include any URLs, links, or web addresses in your response. Focus only on analysis and insights without referencing external resources.`;

  const context = `
Website: ${data.url}

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

Title: ${data.title || "MISSING - Critical for screen readers"}
`;

  return ai.analyze(prompt, context);
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
    parts.push(`H2 (${headings.h2.length}): ${headings.h2.slice(0, 5).join(", ")}${headings.h2.length > 5 ? "..." : ""}`);
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

