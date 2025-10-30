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
  charset: z.string().optional(),
  viewport: z.string().optional(),
  robots: z.string().optional(),
  canonical: z.string().optional(),
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
    details: z.array(z.object({
      src: z.string(),
      alt: z.string().optional(),
      title: z.string().optional(),
    })),
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
      url: z.string().optional(),
      siteName: z.string().optional(),
    })
    .optional(),
  twitterCard: z
    .object({
      card: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      site: z.string().optional(),
      creator: z.string().optional(),
    })
    .optional(),
  structuredData: z.array(z.object({
    type: z.string(),
    data: z.any(),
  })).optional(),
  linkTags: z.array(z.object({
    rel: z.string(),
    href: z.string(),
    type: z.string().optional(),
    hreflang: z.string().optional(),
  })),
  metaTags: z.array(z.object({
    name: z.string().optional(),
    property: z.string().optional(),
    content: z.string(),
    httpEquiv: z.string().optional(),
  })),
});

/**
 * Schema for Lighthouse analytics data
 */
export const lighthouseDataSchema = z.object({
  performance: z.number(),
  accessibility: z.number(),
  seo: z.number(),
  bestPractices: z.number(),
  coreWebVitals: z.object({
    largestContentfulPaint: z.number(),
    firstInputDelay: z.number(),
    cumulativeLayoutShift: z.number(),
  }),
  loadingMetrics: z.object({
    firstContentfulPaint: z.number(),
    speedIndex: z.number(),
    timeToInteractive: z.number(),
    totalBlockingTime: z.number(),
  }),
  resourceMetrics: z.object({
    totalSize: z.number(),
    requestCount: z.number(),
  }),
  analyzedAt: z.number(),
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
      lighthouseData: lighthouseDataSchema.optional(),
      analysisId: z.string().optional(),
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
 * Action plan with optional ID (for saved plans)
 */
export const actionPlanWithIdSchema = actionPlanSchema.extend({
  id: z.string().optional(),
});

/**
 * Action plan API response schema
 */
export const actionPlanResponseSchema = z.object({
  success: z.boolean(),
  data: actionPlanWithIdSchema.optional(),
  error: z.string().optional(),
});

/**
 * Database schemas for saved analyses
 */
export const savedAnalysisSchema = z.object({
  id: z.string(),
  user_id: z.string().nullable(),
  url: z.string(),
  website_data: z.string(), // JSON string
  analysis_result: z.string(), // JSON string
  lighthouse_data: z.string().nullable(), // JSON string
  action_plan_summary: z.string().nullable(),
  action_plan_timeline: z.string().nullable(),
  quick_wins: z.string().nullable(), // JSON array string
  analyzed_at: z.number(),
  created_at: z.number(),
});

/**
 * Database schema for saved tasks
 */
export const savedTaskSchema = z.object({
  id: z.string(),
  analysis_id: z.string(),
  user_id: z.string().nullable(),
  category: z.enum(['seo', 'content', 'performance', 'accessibility']),
  priority: z.enum(['high', 'medium', 'low']),
  title: z.string(),
  description: z.string(),
  effort: z.enum(['quick', 'moderate', 'significant']),
  impact: z.enum(['low', 'medium', 'high']),
  estimated_time: z.string().nullable(),
  status: z.enum(['pending', 'in_progress', 'completed', 'skipped']),
  completed_at: z.number().nullable(),
  started_at: z.number().nullable(),
  notes: z.string().nullable(),
  task_order: z.number(),
  created_at: z.number(),
  updated_at: z.number().nullable(),
  last_reanalysis: z.string().nullable(), // JSON string with reanalysis data
  last_reanalysis_at: z.number().nullable(),
});

/**
 * User profile schema
 */
export const userProfileSchema = z.object({
  user_id: z.string(),
  email: z.string().nullable(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  profile_image_url: z.string().nullable(),
  created_at: z.number(),
  updated_at: z.number(),
});

/**
 * Analysis history item schema (grouped by URL)
 */
export const analysisHistoryItemSchema = z.object({
  url: z.string(),
  latest_analysis_date: z.number(),
  total_count: z.number(),
  latest_analysis_id: z.string(),
  preview_data: z.string(), // JSON string with website data
});

/**
 * Task update request schema
 */
export const taskUpdateSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'skipped']).optional(),
  notes: z.string().optional(),
});

/**
 * Task with tracking info (extends SavedTask with UI state)
 */
export const taskWithTrackingSchema = savedTaskSchema.extend({
  url: z.string().optional(),
  analyzed_at: z.number().optional(),
});

/**
 * Task reanalysis result schema
 */
export const taskReanalysisSchema = z.object({
  status: z.enum(['resolved', 'partially_resolved', 'not_resolved']),
  score: z.number().min(0).max(100), // 0-100 score
  feedback: z.string(),
  suggestions: z.array(z.string()),
  checked_at: z.number(),
});

/**
 * Task reanalysis request schema
 */
export const taskReanalysisRequestSchema = z.object({
  taskId: z.string(),
});

/**
 * Task reanalysis response schema
 */
export const taskReanalysisResponseSchema = z.object({
  success: z.boolean(),
  data: taskReanalysisSchema.optional(),
  error: z.string().optional(),
});

// Export inferred types for TypeScript
export type UrlInput = z.infer<typeof urlSchema>;
export type WebsiteData = z.infer<typeof websiteDataSchema>;
export type LighthouseData = z.infer<typeof lighthouseDataSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
export type AnalyzeResponse = z.infer<typeof analyzeResponseSchema>;
export type ActionPlanTask = z.infer<typeof actionPlanTaskSchema>;
export type ActionPlan = z.infer<typeof actionPlanSchema>;
export type ActionPlanResponse = z.infer<typeof actionPlanResponseSchema>;
export type SavedAnalysis = z.infer<typeof savedAnalysisSchema>;
export type SavedTask = z.infer<typeof savedTaskSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type AnalysisHistoryItem = z.infer<typeof analysisHistoryItemSchema>;
export type TaskUpdate = z.infer<typeof taskUpdateSchema>;
export type TaskWithTracking = z.infer<typeof taskWithTrackingSchema>;
export type TaskReanalysis = z.infer<typeof taskReanalysisSchema>;
export type TaskReanalysisRequest = z.infer<typeof taskReanalysisRequestSchema>;
export type TaskReanalysisResponse = z.infer<typeof taskReanalysisResponseSchema>;

