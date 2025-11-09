import { z } from "zod";


/**
 * Schema for color information
 */
export const colorInfoSchema = z.object({
  hex: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color format"),
  rgb: z.object({
    r: z.number().min(0).max(255),
    g: z.number().min(0).max(255),
    b: z.number().min(0).max(255),
  }),
  hsl: z.object({
    h: z.number().min(0).max(360),
    s: z.number().min(0).max(100),
    l: z.number().min(0).max(100),
  }),
  name: z.string().optional(),
});

/**
 * Schema for color palette
 */
export const colorPaletteSchema = z.object({
  baseColor: colorInfoSchema,
  colors: z.array(colorInfoSchema),
  type: z.enum(['monochromatic', 'analogous', 'complementary', 'triadic', 'tetradic', 'split-complementary', 'random']),
  name: z.string(),
});

/**
 * Schema for color palette generation result
 */
export const colorPaletteResultSchema = z.object({
  palettes: z.array(colorPaletteSchema),
  generatedAt: z.date(),
});

/**
 * Schema for color palette generation input
 */
export const colorPaletteInputSchema = z.object({
  baseColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Please enter a valid hex color (e.g., #FF5733)"),
});

// Export inferred types for TypeScript
export type ColorInfo = z.infer<typeof colorInfoSchema>;
export type ColorPalette = z.infer<typeof colorPaletteSchema>;
export type ColorPaletteResult = z.infer<typeof colorPaletteResultSchema>;
export type ColorPaletteInput = z.infer<typeof colorPaletteInputSchema>;

/**
 * Schema for QR code generation options
 */
export const qrCodeSchema = z.object({
  text: z.string().min(1, "Text is required").max(2000, "Text too long for QR code"),
  size: z.number().min(128).max(1024).default(256),
  errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']).default('M'),
  format: z.enum(['png', 'svg', 'jpeg']).default('png'),
  margin: z.number().min(0).max(10).default(4),
  color: z.object({
    dark: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color").default('#000000'),
    light: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color").default('#FFFFFF'),
  }).default({
    dark: '#000000',
    light: '#FFFFFF',
  }),
});

// Export inferred types for TypeScript
export type QRCodeOptions = z.infer<typeof qrCodeSchema>;

/**
 * Schema for Sanity Category
 */
export const categorySchema = z.object({
  _id: z.string(),
  _type: z.literal('category'),
  title: z.string(),
  slug: z.object({
    _type: z.literal('slug'),
    current: z.string(),
  }),
  description: z.string().optional(),
});

/**
 * Schema for Sanity Tag
 */
export const tagSchema = z.object({
  _id: z.string(),
  _type: z.literal('tag'),
  title: z.string(),
  slug: z.object({
    _type: z.literal('slug'),
    current: z.string(),
  }),
});

/**
 * Schema for Sanity Article (base fields)
 */
export const articleSchema = z.object({
  _id: z.string(),
  _type: z.literal('article'),
  title: z.string(),
  slug: z.object({
    _type: z.literal('slug'),
    current: z.string(),
  }),
  excerpt: z.string(),
  body: z.array(z.any()), // Portable Text blocks
  publishedAt: z.string(), // ISO datetime string
  categories: z.array(z.object({
    _id: z.string(),
    title: z.string(),
    slug: z.object({
      _type: z.literal('slug'),
      current: z.string(),
    }),
  })),
  tags: z.array(z.object({
    _id: z.string(),
    title: z.string(),
    slug: z.object({
      _type: z.literal('slug'),
      current: z.string(),
    }),
  })).optional(),
  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.any().optional(), // Sanity image object
  coverImage: z.any(), // Sanity image object
});

/**
 * Schema for Article List Item (projection for listings)
 */
export const articleListItemSchema = articleSchema.omit({
  body: true,
  metaTitle: true,
  metaDescription: true,
  ogTitle: true,
  ogDescription: true,
  ogImage: true,
});

/**
 * Schema for Article Detail (full projection)
 */
export const articleDetailSchema = articleSchema;

/**
 * Schema for Article Filters
 */
export const articleFiltersSchema = z.object({
  category: z.string().optional(),
  tag: z.string().optional(),
  page: z.number().min(1).default(1),
});

/**
 * Schema for Article List Response
 */
export const articleListResponseSchema = z.object({
  articles: z.array(articleListItemSchema),
  total: z.number(),
  hasNextPage: z.boolean(),
  currentPage: z.number(),
});

/**
 * Schema for Recent Articles by Category
 */
export const recentArticlesByCategorySchema = z.object({
  category: categorySchema,
  articles: z.array(articleListItemSchema),
});

// Export inferred types for TypeScript
export type Category = z.infer<typeof categorySchema>;
export type Tag = z.infer<typeof tagSchema>;
export type Blog = z.infer<typeof articleSchema>;
export type BlogListItem = z.infer<typeof articleListItemSchema>;
export type BlogDetail = z.infer<typeof articleDetailSchema>;
export type BlogFilters = z.infer<typeof articleFiltersSchema>;
export type BlogListResponse = z.infer<typeof articleListResponseSchema>;
export type RecentBlogsByCategory = z.infer<typeof recentArticlesByCategorySchema>;

/**
 * Schema for tool definition
 */
export const toolSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.any(), // Lucide icon component
  href: z.string(),
  badges: z.array(z.string()),
  color: z.string(),
  features: z.array(z.string()),
});

/**
 * Schema for tool collection
 */
export const toolsCollectionSchema = z.array(toolSchema);

// Export inferred types for TypeScript
export type Tool = z.infer<typeof toolSchema>;

/**
 * Schema for user profile
 */
export const userProfileSchema = z.object({
  user_id: z.string(),
  email: z.string().email().nullable(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  profile_image_url: z.string().url().nullable(),
  created_at: z.number(),
  updated_at: z.number(),
});

// Export inferred types for TypeScript
export type UserProfile = z.infer<typeof userProfileSchema>;

/**
 * Schema for robots.txt validation request
 */
export const robotsValidateRequestSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

/**
 * Schema for robots.txt validation response
 */
export const robotsValidateResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    url: z.string(),
    robotsTxt: z.object({
      exists: z.boolean(),
      content: z.string(),
      isValid: z.boolean(),
      errors: z.array(z.string()),
      rules: z.array(z.object({
        userAgent: z.string(),
        disallow: z.array(z.string()),
        allow: z.array(z.string()),
        crawlDelay: z.number().optional(),
        sitemap: z.array(z.string()).optional(),
      })),
      sitemaps: z.array(z.string()),
      applicableRules: z.object({
        userAgent: z.string(),
        disallow: z.array(z.string()),
        allow: z.array(z.string()),
        crawlDelay: z.number().optional(),
        sitemap: z.array(z.string()).optional(),
      }),
    }),
    indexability: z.object({
      url: z.string(),
      isIndexable: z.boolean(),
      blockingFactors: z.object({
        robotsTxt: z.boolean(),
        metaRobots: z.boolean(),
        canonical: z.boolean(),
        nofollow: z.boolean(),
      }),
      metaRobots: z.object({
        noindex: z.boolean(),
        nofollow: z.boolean(),
        noarchive: z.boolean(),
        nosnippet: z.boolean(),
      }),
      canonicalUrl: z.string().optional(),
      recommendations: z.array(z.string()),
    }),
    sitemaps: z.object({
      discovered: z.array(z.string()),
      valid: z.array(z.string()),
      invalid: z.array(z.string()),
      urls: z.array(z.object({
        loc: z.string(),
        lastmod: z.string().optional(),
        changefreq: z.string().optional(),
        priority: z.string().optional(),
      })),
      errors: z.array(z.string()),
    }),
    overallIndexable: z.boolean(),
    crawlabilityScore: z.number(),
    recommendations: z.array(z.string()),
    analyzedAt: z.number(),
  }).optional(),
  error: z.string().optional(),
});

// Export inferred types for TypeScript
export type RobotsValidateRequest = z.infer<typeof robotsValidateRequestSchema>;
export type RobotsValidateResponse = z.infer<typeof robotsValidateResponseSchema>;

