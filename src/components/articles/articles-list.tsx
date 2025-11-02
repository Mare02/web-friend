import Link from 'next/link'
import Image from 'next/image'
import { ArticleListItem, ArticleFilters } from '@/lib/validators/schema'
import { Button } from '@/components/ui/button'
import { urlFor } from '@/lib/sanity/client'
import { format } from 'date-fns'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'

interface ArticlesListProps {
  articles: ArticleListItem[]
  total: number
  currentPage: number
  hasNextPage: boolean
  basePath: string
  filters: ArticleFilters
}

export function ArticlesList({
  articles,
  total,
  currentPage,
  hasNextPage,
  basePath,
  filters,
}: ArticlesListProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No articles found</h3>
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
      {/* Results summary */}
      <div className="text-sm text-muted-foreground">
        Showing {articles.length} of {total} articles
      </div>

      {/* Articles grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
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

interface ArticleCardProps {
  article: ArticleListItem
}

function ArticleCard({ article }: ArticleCardProps) {
  const publishedDate = new Date(article.publishedAt)

  // Estimate reading time (roughly 200 words per minute)
  const wordCount = article.excerpt.split(' ').length + (article.title.split(' ').length * 2)
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <Link href={`/articles/${article.slug.current}`}>
      <article className="group h-full bg-card border border-border rounded-lg p-6 hover:shadow-md hover:border-border transition-all duration-200 cursor-pointer hover:bg-accent/20">
        <div className="flex flex-col space-y-4">
          {/* Category */}
          {article.categories.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                {article.categories[0].title}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-muted-foreground leading-relaxed line-clamp-3 text-sm">
            {article.excerpt}
          </p>

          {/* Image */}
          {article.coverImage && (
            <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
              <Image
                src={urlFor(article.coverImage).width(400).height(225).url()}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col gap-4 pt-2 border-t border-border/40">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <time dateTime={article.publishedAt}>
                {format(publishedDate, 'MMM d, yyyy')}
              </time>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{readingTime} min read</span>
              </div>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag._id}
                    className="text-xs text-muted-foreground transition-colors"
                  >
                    #{tag.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
