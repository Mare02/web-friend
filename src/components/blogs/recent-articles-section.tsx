import Link from 'next/link'
import { RecentBlogsByCategory } from '@/lib/validators/schema'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Newspaper } from 'lucide-react'

import { BlogCard } from './blog-card'

interface RecentBlogsSectionProps {
  categoriesWithArticles: RecentBlogsByCategory[]
}

export function RecentArticlesSection({ categoriesWithArticles }: RecentBlogsSectionProps) {
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

      <div className="space-y-12">
        {categoriesWithArticles.map(({ category, articles }) => (
          <CategoryBlogs
            key={category._id}
            category={category}
            articles={articles}
          />
        ))}
      </div>

      {/* View All Blogs CTA */}
      <div className="text-center mt-12">
        <Link href="/blogs">
          <Button size="lg" className="gap-2">
            View All Blogs
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

interface CategoryBlogsProps {
  category: RecentBlogsByCategory['category']
  articles: RecentBlogsByCategory['articles']
}

function CategoryBlogs({ category, articles }: CategoryBlogsProps) {
  if (articles.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold">{category.title}</h3>
          <Badge variant="outline">{articles.length} blogs</Badge>
        </div>
        <Link href={`/blogs?category=${category.slug.current}`}>
          <Button variant="ghost" className="gap-2">
            View all
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <BlogCard key={article._id} article={article} />
        ))}
      </div>
    </div>
  )
}

