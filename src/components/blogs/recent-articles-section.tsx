import Link from 'next/link'
import { BlogListItem } from '@/lib/validators/schema'
import { Button } from '@/components/ui/button'
import { ArrowRight, Newspaper } from 'lucide-react'

import { BlogCard } from './blog-card'

interface RecentBlogsSectionProps {
  articles: BlogListItem[]
}

export function RecentArticlesSection({ articles }: RecentBlogsSectionProps) {
  if (articles.length === 0) {
    return null
  }

  return (
    <div className="mb-20 relative">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Newspaper className="h-8 w-8 text-primary" />
          Latest Blogs
        </h2>
        <p className="text-lg max-w-2xl mx-auto">
          Stay updated with our latest insights on digital tools, online strategies, best practices, and trending topics.
        </p>
      </div>

      <div className="absolute left-1/4 top-1/4 w-1/2 h-1/2 bg-cyan-200 dark:bg-cyan-900 blur-3xl rounded-full opacity-60 z-0 pointer-events-none"></div>

      <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-3 z-10">
        {articles.map((article) => (
          <div
            key={article._id}
          >
            <BlogCard article={article} />
          </div>
        ))}
      </div>

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

