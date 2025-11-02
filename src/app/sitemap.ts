import { MetadataRoute } from 'next'
import { readFileSync } from 'fs'
import { join } from 'path'

interface SitemapArticle {
  slug: string
  publishedAt: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://web-friend.vercel.app'

  // Read pre-generated sitemap data
  let allArticles: SitemapArticle[] = []
  try {
    const sitemapDataPath = join(process.cwd(), 'public', 'sitemap-data.json')
    const sitemapData = readFileSync(sitemapDataPath, 'utf-8')
    allArticles = JSON.parse(sitemapData)
  } catch (error) {
    console.warn('Could not read sitemap data file, falling back to empty array:', error)
  }

  // Generate sitemap entries for blog posts
  const blogEntries = allArticles.map((article) => ({
    url: `${baseUrl}/blogs/${article.slug}`,
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
