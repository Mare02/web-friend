// Load environment variables FIRST before any other imports
import { config } from 'dotenv'
import { join } from 'path'
config({ path: join(process.cwd(), '.env.local') })

// Now import Sanity directly
import { createClient } from 'next-sanity'
import { writeFileSync } from 'fs'

interface SitemapArticle {
  slug: string
  publishedAt: string
}

interface SanityArticle {
  slug: {
    current: string
  }
  publishedAt: string
}

// Create Sanity client directly
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  useCdn: true, // Use CDN for faster reads
})

const ARTICLES_PER_PAGE = 12

async function generateSitemapData() {
  console.log('Generating sitemap data...')

  const allArticles: SitemapArticle[] = []

  // Get all articles (handle pagination)
  let currentPage = 1
  let hasMore = true

  while (hasMore) {
    const skip = (currentPage - 1) * ARTICLES_PER_PAGE
    const end = skip + ARTICLES_PER_PAGE

    const query = `*[_type == 'article'] | order(publishedAt desc)[$skip...$end]{ slug, publishedAt }`
    const articles = await client.fetch(query, { skip, end }) as SanityArticle[]

    if (articles.length === 0) {
      hasMore = false
    } else {
      const mappedArticles = articles.map((article: SanityArticle) => ({
        slug: article.slug.current,
        publishedAt: article.publishedAt,
      }))
      allArticles.push(...mappedArticles)
      hasMore = articles.length === ARTICLES_PER_PAGE
      currentPage++

      console.log(`Fetched page ${currentPage - 1}, total articles: ${allArticles.length}`)
    }
  }

  // Write to JSON file
  const outputPath = join(process.cwd(), 'public', 'sitemap-data.json')
  writeFileSync(outputPath, JSON.stringify(allArticles, null, 2))

  console.log(`Generated sitemap data for ${allArticles.length} articles at ${outputPath}`)
}

// Run the script
generateSitemapData()
  .then(() => {
    console.log('✅ Sitemap data generation completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error generating sitemap data:', error)
    process.exit(1)
  })
