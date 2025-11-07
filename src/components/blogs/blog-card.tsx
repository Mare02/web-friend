import Link from 'next/link'
import Image from 'next/image'
import { BlogListItem } from '@/lib/validators/schema'
import { urlFor } from '@/lib/sanity/client'
import { format } from 'date-fns'
import { Clock } from 'lucide-react'

interface BlogCardProps {
  article: BlogListItem
}

export function BlogCard({ article }: BlogCardProps) {
  const publishedDate = new Date(article.publishedAt)

  // Estimate reading time (roughly 200 words per minute)
  const wordCount = article.excerpt.split(' ').length + (article.title.split(' ').length * 2)
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <Link href={`/blogs/${article.slug.current}`}>
      <article className="group h-full bg-card border-2 border-border rounded-lg p-6 hover:shadow-md hover:border-border transition-all duration-200 cursor-pointer hover:bg-accent/20">
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
