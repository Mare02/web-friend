import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity/client'

interface SitemapArticle {
  slug: {
    current: string
  }
  publishedAt: string
}

/**
 * Fetch all articles for sitemap generation
 */
async function getAllArticlesForSitemap(): Promise<SitemapArticle[]> {
  try {
    const query = `*[_type == 'article'] | order(publishedAt desc) {
      slug,
      publishedAt
    }`
    return await client.fetch(query)
  } catch (error) {
    console.error('Failed to fetch articles for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://web-friend.vercel.app'

  // Fetch articles dynamically from Sanity
  const allArticles = await getAllArticlesForSitemap()

  // Generate sitemap entries for blog posts
  const blogEntries = allArticles.map((article) => ({
    url: `${baseUrl}/blogs/${article.slug.current}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/tools/website-analyzer`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools/text-analyzer`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/api-tester`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/color-palette-generator`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/qr-code-generator`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...blogEntries,
  ]
}
