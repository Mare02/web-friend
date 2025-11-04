import { z } from "zod";

/**
 * Validation schemas for robots.txt and indexability analysis
 */

/**
 * Schema for robots.txt rule
 */
export const robotsRuleSchema = z.object({
  userAgent: z.string(),
  disallow: z.array(z.string()),
  allow: z.array(z.string()),
  crawlDelay: z.number().optional(),
  sitemap: z.array(z.string()).optional(),
});

/**
 * Schema for robots.txt analysis
 */
export const robotsTxtAnalysisSchema = z.object({
  exists: z.boolean(),
  content: z.string(),
  isValid: z.boolean(),
  errors: z.array(z.string()),
  rules: z.array(robotsRuleSchema),
  sitemaps: z.array(z.string()),
  applicableRules: robotsRuleSchema,
});

/**
 * Schema for indexability blocking factors
 */
export const blockingFactorsSchema = z.object({
  robotsTxt: z.boolean(),
  metaRobots: z.boolean(),
  canonical: z.boolean(),
  nofollow: z.boolean(),
});

/**
 * Schema for meta robots directives
 */
export const metaRobotsSchema = z.object({
  noindex: z.boolean(),
  nofollow: z.boolean(),
  noarchive: z.boolean(),
  nosnippet: z.boolean(),
});

/**
 * Schema for indexability result
 */
export const indexabilityResultSchema = z.object({
  url: z.string(),
  isIndexable: z.boolean(),
  blockingFactors: blockingFactorsSchema,
  metaRobots: metaRobotsSchema,
  canonicalUrl: z.string().optional(),
  recommendations: z.array(z.string()),
});

/**
 * Schema for sitemap URL entry
 */
export const sitemapUrlSchema = z.object({
  loc: z.string(),
  lastmod: z.string().optional(),
  changefreq: z.string().optional(),
  priority: z.string().optional(),
});

/**
 * Schema for sitemap analysis
 */
export const sitemapAnalysisSchema = z.object({
  discovered: z.array(z.string()),
  valid: z.array(z.string()),
  invalid: z.array(z.string()),
  urls: z.array(sitemapUrlSchema),
  errors: z.array(z.string()),
});

/**
 * Schema for complete robots and indexability analysis result
 */
export const robotsAnalysisResultSchema = z.object({
  url: z.string(),
  robotsTxt: robotsTxtAnalysisSchema,
  indexability: indexabilityResultSchema,
  sitemaps: sitemapAnalysisSchema,
  overallIndexable: z.boolean(),
  crawlabilityScore: z.number(),
  recommendations: z.array(z.string()),
  analyzedAt: z.number(),
});

/**
 * Schema for API request
 */
export const robotsValidateRequestSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

/**
 * Schema for API response
 */
export const robotsValidateResponseSchema = z.object({
  success: z.boolean(),
  data: robotsAnalysisResultSchema.optional(),
  error: z.string().optional(),
});

/**
 * Type exports
 */
export type RobotsRule = z.infer<typeof robotsRuleSchema>;
export type RobotsTxtAnalysis = z.infer<typeof robotsTxtAnalysisSchema>;
export type BlockingFactors = z.infer<typeof blockingFactorsSchema>;
export type MetaRobots = z.infer<typeof metaRobotsSchema>;
export type IndexabilityResult = z.infer<typeof indexabilityResultSchema>;
export type SitemapUrl = z.infer<typeof sitemapUrlSchema>;
export type SitemapAnalysis = z.infer<typeof sitemapAnalysisSchema>;
export type RobotsAnalysisResult = z.infer<typeof robotsAnalysisResultSchema>;
export type RobotsValidateRequest = z.infer<typeof robotsValidateRequestSchema>;
export type RobotsValidateResponse = z.infer<typeof robotsValidateResponseSchema>;
