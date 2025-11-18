import { z } from 'zod';

/**
 * Common favicon sizes used in web development
 */
export const FAVICON_SIZES = [
  16, 32, 48, 64, 96, 128, 152, 167, 180, 192, 256, 384, 512
] as const;

export type FaviconSize = typeof FAVICON_SIZES[number];

/**
 * Schema for favicon generator options
 */
export const faviconGeneratorOptionsSchema = z.object({
  sizes: z
    .array(z.number().refine((size) => FAVICON_SIZES.includes(size as FaviconSize), {
      message: 'Invalid favicon size'
    }))
    .min(1, 'At least one size must be selected')
    .max(13, 'Too many sizes selected')
    .default([16, 32, 48, 64, 96, 128, 152, 180, 192, 256]),
  includeIco: z.boolean().default(true),
  backgroundColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color format')
    .default('#FFFFFF'),
  quality: z.number().min(1).max(100).default(90)
});

/**
 * Schema for favicon generator request
 */
export const faviconGeneratorRequestSchema = z.object({
  image: z.string().min(1, 'Image data is required'), // Base64 encoded image
  options: faviconGeneratorOptionsSchema.default({
    sizes: [16, 32, 48, 64, 96, 128, 152, 180, 192, 256],
    includeIco: true,
    backgroundColor: '#FFFFFF',
    quality: 90
  })
});

/**
 * Schema for individual favicon result
 */
export const faviconResultSchema = z.object({
  size: z.number(),
  dataUrl: z.string(),
  mimeType: z.string(),
  filename: z.string()
});

/**
 * Schema for favicon generator response
 */
export const faviconGeneratorResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      favicons: z.array(faviconResultSchema),
      icoDataUrl: z.string().optional(),
      htmlSnippet: z.string(),
      generatedAt: z.date()
    })
    .optional(),
  error: z.string().optional()
});

// Schema for favicon pack result
export const faviconPackSchema = z.object({
  favicons: z.array(faviconResultSchema),
  icoDataUrl: z.string().optional(),
  htmlSnippet: z.string(),
  generatedAt: z.date()
});

// Export inferred types for TypeScript
export type FaviconGeneratorOptions = z.infer<typeof faviconGeneratorOptionsSchema>;
export type FaviconGeneratorRequest = z.infer<typeof faviconGeneratorRequestSchema>;
export type FaviconResult = z.infer<typeof faviconResultSchema>;
export type FaviconPack = z.infer<typeof faviconPackSchema>;
export type FaviconGeneratorResponse = z.infer<typeof faviconGeneratorResponseSchema>;