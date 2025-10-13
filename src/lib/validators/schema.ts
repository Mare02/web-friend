import { z } from "zod";

/**
 * Validation schema for URL input
 */
export const urlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

/**
 * Schema for extracted website data
 */
export const websiteDataSchema = z.object({
  url: z.string(),
  title: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  headings: z.object({
    h1: z.array(z.string()),
    h2: z.array(z.string()),
    h3: z.array(z.string()),
    h4: z.array(z.string()),
    h5: z.array(z.string()),
    h6: z.array(z.string()),
  }),
  images: z.object({
    total: z.number(),
    withAlt: z.number(),
    withoutAlt: z.number(),
  }),
  scripts: z.number(),
  stylesheets: z.number(),
  wordCount: z.number(),
  framework: z.string().optional(),
  openGraph: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      type: z.string().optional(),
    })
    .optional(),
});

/**
 * Schema for AI analysis results
 */
export const analysisResultSchema = z.object({
  content: z.string(),
  seo: z.string(),
  performance: z.string(),
  accessibility: z.string(),
});

/**
 * Complete API response schema
 */
export const analyzeResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      websiteData: websiteDataSchema,
      analysis: analysisResultSchema,
    })
    .optional(),
  error: z.string().optional(),
});

/**
 * Schema for action plan tasks
 */
export const actionPlanTaskSchema = z.object({
  id: z.string(),
  category: z.enum(["seo", "content", "performance", "accessibility"]),
  priority: z.enum(["high", "medium", "low"]),
  title: z.string(),
  description: z.string(),
  effort: z.enum(["quick", "moderate", "significant"]),
  impact: z.enum(["low", "medium", "high"]),
  estimatedTime: z.string().optional(),
});

/**
 * Schema for complete action plan
 */
export const actionPlanSchema = z.object({
  summary: z.string(),
  tasks: z.array(actionPlanTaskSchema),
  quickWins: z.array(z.string()),
  timeline: z.string().optional(),
});

/**
 * Action plan API response schema
 */
export const actionPlanResponseSchema = z.object({
  success: z.boolean(),
  data: actionPlanSchema.optional(),
  error: z.string().optional(),
});

// Export inferred types for TypeScript
export type UrlInput = z.infer<typeof urlSchema>;
export type WebsiteData = z.infer<typeof websiteDataSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
export type AnalyzeResponse = z.infer<typeof analyzeResponseSchema>;
export type ActionPlanTask = z.infer<typeof actionPlanTaskSchema>;
export type ActionPlan = z.infer<typeof actionPlanSchema>;
export type ActionPlanResponse = z.infer<typeof actionPlanResponseSchema>;

