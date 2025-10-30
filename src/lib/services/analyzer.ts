import { AIProvider } from "../ai";
import { WebsiteData, AnalysisResult, LighthouseData } from "../validators/schema";

/**
 * Orchestrates AI analysis of website data with real analytics
 * Generates structured prompts for different analysis categories
 * Combines AI insights with real Lighthouse performance data
 */
export async function analyzeWebsite(
  websiteData: WebsiteData,
  aiProvider: AIProvider
): Promise<{ analysis: AnalysisResult; lighthouseData?: LighthouseData }> {
  // Run AI analysis and Lighthouse metrics in parallel for better performance
  const [content, seo, performance, accessibility, lighthouseResponse] = await Promise.all([
    analyzeContent(websiteData, aiProvider),
    analyzeSEO(websiteData, aiProvider),
    analyzePerformance(websiteData, aiProvider),
    analyzeAccessibility(websiteData, aiProvider),
    // Fetch real analytics data from Lighthouse API
    fetchLighthouseData(websiteData.url),
  ]);

  // Enhance AI analysis with real metrics if available
  const enhancedResults = {
    content,
    seo: lighthouseResponse.success
      ? enhanceSEOAnalysis(seo, lighthouseResponse.data!)
      : seo,
    performance: lighthouseResponse.success
      ? enhancePerformanceAnalysis(performance, lighthouseResponse.data!)
      : performance,
    accessibility: lighthouseResponse.success
      ? enhanceAccessibilityAnalysis(accessibility, lighthouseResponse.data!)
      : accessibility,
  };

  return {
    analysis: enhancedResults,
    lighthouseData: lighthouseResponse.success ? lighthouseResponse.data : undefined,
  };
}

/**
 * Fetch Lighthouse analytics data from our API
 */
async function fetchLighthouseData(url: string): Promise<{ success: boolean; data?: LighthouseData; error?: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/lighthouse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to fetch Lighthouse data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Enhance SEO analysis with real Lighthouse SEO score
 */
function enhanceSEOAnalysis(aiAnalysis: string, lighthouseData: LighthouseData): string {
  const realScore = lighthouseData.seo;
  const scoreColor = realScore >= 90 ? '🟢' : realScore >= 70 ? '🟡' : '🔴';

  return `${aiAnalysis}

## 📊 Real SEO Metrics
${scoreColor} **SEO Score: ${realScore}/100**

This score is calculated by Google's Lighthouse using real website data, measuring technical SEO factors like meta tags, heading structure, and mobile-friendliness.`;
}

/**
 * Enhance performance analysis with real Core Web Vitals
 */
function enhancePerformanceAnalysis(aiAnalysis: string, lighthouseData: LighthouseData): string {
  const { performance, coreWebVitals, loadingMetrics } = lighthouseData;
  const scoreColor = performance >= 90 ? '🟢' : performance >= 70 ? '🟡' : '🔴';

  const lcpStatus = coreWebVitals.largestContentfulPaint <= 2500 ? '🟢 Good' :
                   coreWebVitals.largestContentfulPaint <= 4000 ? '🟡 Needs improvement' : '🔴 Poor';

  const fidStatus = coreWebVitals.firstInputDelay <= 100 ? '🟢 Good' :
                   coreWebVitals.firstInputDelay <= 300 ? '🟡 Needs improvement' : '🔴 Poor';

  const clsStatus = coreWebVitals.cumulativeLayoutShift <= 0.1 ? '🟢 Good' :
                   coreWebVitals.cumulativeLayoutShift <= 0.25 ? '🟡 Needs improvement' : '🔴 Poor';

  return `${aiAnalysis}

## 📊 Real Performance Metrics
${scoreColor} **Performance Score: ${performance}/100**

### Core Web Vitals
- **Largest Contentful Paint (LCP):** ${coreWebVitals.largestContentfulPaint}ms ${lcpStatus}
- **First Input Delay (FID):** ${coreWebVitals.firstInputDelay}ms ${fidStatus}
- **Cumulative Layout Shift (CLS):** ${coreWebVitals.cumulativeLayoutShift} ${clsStatus}

### Loading Metrics
- **First Contentful Paint:** ${loadingMetrics.firstContentfulPaint}ms
- **Speed Index:** ${loadingMetrics.speedIndex}ms
- **Time to Interactive:** ${loadingMetrics.timeToInteractive}ms
- **Total Blocking Time:** ${loadingMetrics.totalBlockingTime}ms

*These metrics are measured on real devices and provide accurate performance data.*`;
}

/**
 * Enhance accessibility analysis with real Lighthouse accessibility score
 */
function enhanceAccessibilityAnalysis(aiAnalysis: string, lighthouseData: LighthouseData): string {
  const realScore = lighthouseData.accessibility;
  const scoreColor = realScore >= 90 ? '🟢' : realScore >= 70 ? '🟡' : '🔴';

  return `${aiAnalysis}

## 📊 Real Accessibility Metrics
${scoreColor} **Accessibility Score: ${realScore}/100**

This automated accessibility audit checks for common issues like missing alt text, insufficient color contrast, missing form labels, and proper heading structure. The score reflects actual technical accessibility compliance.`;
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

