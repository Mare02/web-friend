import Link from 'next/link'
import Image from 'next/image'
import { BlogListItem } from '@/lib/validators/schema'
import { Button } from '@/components/ui/button'
import { urlFor } from '@/lib/sanity/client'
import { format } from 'date-fns'
import { ArrowRight, Newspaper, Clock } from 'lucide-react'

interface RecentArticlesHomeSectionProps {
  articles: BlogListItem[]
}

export function RecentArticlesHomeSection({ articles }: RecentArticlesHomeSectionProps) {
  if (articles.length === 0) {
    return null
  }

  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Newspaper className="h-8 w-8 text-primary" />
          Latest Articles
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Stay updated with our latest insights on digital tools, online strategies, best practices, and trending topics.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>

      {/* See More Articles CTA */}
      <div className="text-center mt-12">
        <Link href="/articles">
          <Button size="lg" className="gap-2">
            See More Articles
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

interface ArticleCardProps {
  article: BlogListItem
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
          <h4 className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h4>

          {/* Excerpt */}
          <p className="text-muted-foreground leading-relaxed line-clamp-3 text-sm">
            {article.excerpt}
          </p>

          {/* Image */}
          {article.coverImage && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-muted">
              <Image
                src={urlFor(article.coverImage).url()}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
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
                {article.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag._id}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
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
