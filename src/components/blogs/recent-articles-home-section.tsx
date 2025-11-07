import Link from 'next/link'
import { BlogListItem } from '@/lib/validators/schema'
import { Button } from '@/components/ui/button'
import { ArrowRight, Newspaper } from 'lucide-react'

import { BlogCard } from './blog-card'

interface RecentBlogsHomeSectionProps {
  articles: BlogListItem[]
}

export function RecentArticlesHomeSection({ articles }: RecentBlogsHomeSectionProps) {
  if (articles.length === 0) {
    return null
  }

  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Newspaper className="h-8 w-8 text-primary" />
          Latest Blogs
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Stay updated with our latest insights on digital tools, online strategies, best practices, and trending topics.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <BlogCard key={article._id} article={article} />
        ))}
      </div>

      {/* See More Blogs CTA */}
      <div className="text-center mt-12">
        <Link href="/blogs">
          <Button size="lg" variant="outline" className="gap-2">
            See More Blogs
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

