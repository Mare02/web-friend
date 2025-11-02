'use client'

import { ArticleDetail } from '@/lib/validators/schema'
import { Badge } from '@/components/ui/badge'
import { urlFor } from '@/lib/sanity/client'
import { format } from 'date-fns'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PortableTextRenderer } from '@/components/portable-text'
import Image from 'next/image'

interface ArticleDetailClientProps {
  article: ArticleDetail
}


export function ArticleDetailClient({ article }: ArticleDetailClientProps) {
  const publishedDate = new Date(article.publishedAt)
  const readingTime = Math.ceil(article.body.length / 200) // Rough estimate: 200 words per minute

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/articles">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Button>
        </Link>
      </div>

      {/* Article header */}
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {article.categories.map((category) => (
            <Link key={category._id} href={`/articles?category=${category.slug.current}`}>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                {category.title}
              </Badge>
            </Link>
          ))}
        </div>

        <h1 className="text-4xl font-bold mb-4 leading-tight">{article.title}</h1>

        <div className="flex items-center gap-4 text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <time dateTime={article.publishedAt}>
              {format(publishedDate, 'MMMM d, yyyy')}
            </time>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{readingTime} min read</span>
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag) => (
              <Link key={tag._id} href={`/articles?tag=${tag.slug.current}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  #{tag.title}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Cover image */}
      {article.coverImage && (
        <div className="mb-8">
          <Image
            src={urlFor(article.coverImage).width(1200).height(600).url()}
            alt={article.title}
            width={1200}
            height={600}
            className="w-full h-auto rounded-lg shadow-md"
            priority
          />
        </div>
      )}

      {/* Article content */}
      <div>
        <p className="text-xl text-muted-foreground leading-relaxed">
          {article.excerpt}
        </p>
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <PortableTextRenderer value={article.body} />
        </div>
      </div>

      {/* Article footer */}
      <footer className="mt-12 pt-8 border-t">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Published on {format(publishedDate, 'PPP')}
          </div>

          {/* TODO: Add social sharing buttons */}
          {/* <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Share
            </Button>
          </div> */}
        </div>
      </footer>
    </article>
  )
}
