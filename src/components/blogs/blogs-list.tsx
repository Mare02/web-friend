import Link from 'next/link'
import { BlogListItem, BlogFilters } from '@/lib/validators/schema'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { BlogCard } from './blog-card'

interface BlogsListProps {
  articles: BlogListItem[]
  total: number
  currentPage: number
  hasNextPage: boolean
  basePath: string
  filters: BlogFilters
}

export function BlogsList({
  articles,
  total,
  currentPage,
  hasNextPage,
  basePath,
  filters,
}: BlogsListProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No blogs found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or check back later for new content.
        </p>
      </div>
    )
  }

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams()

    if (filters.category) params.set('category', filters.category)
    if (filters.tag) params.set('tag', filters.tag)
    if (page > 1) params.set('page', page.toString())

    const queryString = params.toString()
    return queryString ? `${basePath}?${queryString}` : basePath
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Articles grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <BlogCard key={article._id} article={article} />
        ))}
      </div>

      {/* Pagination */}
      {(currentPage > 1 || hasNextPage) && (
        <div className="flex justify-center items-center gap-2">
          {currentPage > 1 && (
            <Link href={buildPageUrl(currentPage - 1)}>
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
            </Link>
          )}

          <span className="text-sm text-muted-foreground px-4">
            Page {currentPage}
          </span>

          {hasNextPage && (
            <Link href={buildPageUrl(currentPage + 1)}>
              <Button variant="outline" size="sm">
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

