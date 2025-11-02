import { Suspense } from 'react'
import { Metadata } from 'next'
import { getArticles, getCategories, getTags } from '@/lib/services/article-service'
import { BlogsList } from '@/components/blogs/blogs-list'
import { BlogsFilters } from '@/components/blogs/blogs-filters'
import { BlogFilters } from '@/lib/validators/schema'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Blogs | Web Friend',
  description: 'Explore our collection of blogs on web development, SEO, best practices, and more.',
}

interface BlogsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function BlogsContent({ searchParams }: BlogsPageProps) {
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
            Explore our collection of blogs on web development, SEO, best practices, and more.
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

