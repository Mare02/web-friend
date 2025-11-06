import { Suspense } from 'react'
import { Metadata } from 'next'
import { getArticles, getCategories, getTags } from '@/lib/services/article-service'
import { BlogsList } from '@/components/blogs/blogs-list'
import { BlogsFilters } from '@/components/blogs/blogs-filters'
import { BlogFilters } from '@/lib/validators/schema'
import { Skeleton } from '@/components/ui/skeleton'
import { logger } from '@/lib/logger'
import { getCanonicalUrl } from '@/lib/config'

interface BlogsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Enable Incremental Static Regeneration
export const revalidate = 3600 // Revalidate every hour

export async function generateMetadata({ searchParams }: BlogsPageProps): Promise<Metadata> {
  const params = await searchParams

  // Parse filters from search params
  const filters: BlogFilters = {
    category: typeof params.category === 'string' ? params.category : undefined,
    tag: typeof params.tag === 'string' ? params.tag : undefined,
    page: typeof params.page === 'string' ? parseInt(params.page, 10) || 1 : 1,
  }

  let title = 'Blogs | Web Friend'
  let description = 'Explore our collection of blogs on digital tools, online strategies, SEO, best practices, and more.'

  // Customize metadata based on filters
  if (filters.category) {
    const categories = await getCategories()
    const category = categories.find(c => c.slug.current === filters.category)
    if (category) {
      title = `${category.title} Blogs | Web Friend`
      description = `Read our blogs about ${category.title.toLowerCase()}. ${category.description || 'Explore digital tools insights and best practices.'}`
    }
  }

  if (filters.tag) {
    const tags = await getTags()
    const tag = tags.find(t => t.slug.current === filters.tag)
    if (tag) {
      title = `${tag.title} Blogs | Web Friend`
      description = `Blogs tagged with ${tag.title}. Explore our collection of digital tools and online insights.`
    }
  }

  if (filters.page && filters.page > 1) {
    title = `${title} - Page ${filters.page}`
  }

  // Build canonical URL with filters
  let canonicalPath = '/blogs'
  const queryParams = []
  if (filters.category) queryParams.push(`category=${filters.category}`)
  if (filters.tag) queryParams.push(`tag=${filters.tag}`)
  if (filters.page && filters.page > 1) queryParams.push(`page=${filters.page}`)
  if (queryParams.length > 0) canonicalPath += `?${queryParams.join('&')}`

  return {
    title,
    description,
    robots: 'index, follow',
    alternates: {
      canonical: getCanonicalUrl(canonicalPath),
    },
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

async function BlogsContent({ searchParams }: BlogsPageProps) {
  try {
    const params = await searchParams

    // Parse filters from search params
    const filters: BlogFilters = {
      category: typeof params.category === 'string' ? params.category : undefined,
      tag: typeof params.tag === 'string' ? params.tag : undefined,
      page: typeof params.page === 'string' ? parseInt(params.page, 10) || 1 : 1,
    }

    // Fetch data in parallel
    const [articlesResponse, categories, tags] = await Promise.all([
      getArticles(filters),
      getCategories(),
      getTags(),
    ])

    return (
      <div>
        <div className="container mx-auto px-4 py-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blogs</h1>
            <p className="text-base text-muted-foreground">
              Explore our collection of blogs on digital tools, online strategies, SEO, best practices, and more.
            </p>
          </div>
        </div>

        <BlogsFilters
          categories={categories}
          tags={tags}
          currentFilters={filters}
        />

        <div className="container mx-auto px-4 py-6">
          <BlogsList
            articles={articlesResponse.articles}
            total={articlesResponse.total}
            currentPage={articlesResponse.currentPage}
            hasNextPage={articlesResponse.hasNextPage}
            basePath="/blogs"
            filters={filters}
          />
        </div>
      </div>
    )
  } catch (error) {
    logger.error('Error loading blogs listing page', error instanceof Error ? error : new Error(String(error)), {
      operation: 'BlogsPage',
      searchParams
    })

    // Return error state
    return (
      <div>
        <div className="container mx-auto px-4 py-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blogs</h1>
            <p className="text-base text-muted-foreground">
              Explore our collection of blogs on digital tools, online strategies, SEO, best practices, and more.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Unable to Load Blogs</h2>
            <p className="text-muted-foreground mb-6">
              We&apos;re experiencing issues loading the blog content. Please try again later.
            </p>
          </div>
        </div>
      </div>
    )
  }
}

function BlogsSkeleton() {
  return (
    <div>
      <div className="container mx-auto px-4 py-4">
        <div className="mb-6">
          <Skeleton className="h-9 w-40 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
      </div>

      <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-9 w-40" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function BlogsPage({ searchParams }: BlogsPageProps) {
  return (
    <Suspense fallback={<BlogsSkeleton />}>
      <BlogsContent searchParams={searchParams} />
    </Suspense>
  )
}

