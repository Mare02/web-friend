import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getArticleBySlug } from '@/lib/services/article-service'
import { BlogDetail } from '@/lib/validators/schema'
import { client } from '@/lib/sanity/client'
import { logger } from '@/lib/logger'
import { Badge } from '@/components/ui/badge'
import { urlFor } from '@/lib/sanity/client'
import { format } from 'date-fns'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PortableTextRenderer } from '@/components/portable-text'
import Image from 'next/image'
import { getBaseUrl } from '@/lib/config'

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

// Enable Incremental Static Regeneration
export const revalidate = 3600 // Revalidate every hour

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const query = `*[_type == 'article'] { slug }`
    const articles = await client.fetch(query)

    return articles.map((article: { slug: { current: string } }) => ({
      slug: article.slug.current,
    }))
  } catch (error) {
    console.error('Failed to generate static params for blog posts:', error)
    return []
  }
}

// Generate structured data for Article/BlogPosting
function generateArticleStructuredData(article: BlogDetail, baseUrl: string) {
  const canonicalUrl = `${baseUrl}/blogs/${article.slug.current}`

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.coverImage ? urlFor(article.coverImage).url() : undefined,
    "datePublished": article.publishedAt,
    "dateModified": article.publishedAt, // Could add lastModified field to schema if needed
    "author": {
      "@type": "Organization",
      "name": "Web Friend Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Web Friend",
      "url": baseUrl
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "articleSection": article.categories.map(cat => cat.title).join(", "),
    "keywords": article.tags?.map(tag => tag.title).join(", "),
    "url": canonicalUrl,
    "wordCount": article.body.length, // Approximate word count
    "timeRequired": `PT${Math.max(1, Math.ceil(article.body.length / 200))}M` // Estimated reading time in ISO 8601 duration format
  }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Blog Not Found | Web Friend',
    }
  }

  const title = article.metaTitle || article.title
  const description = article.metaDescription || article.excerpt
  const baseUrl = getBaseUrl()
  const canonicalUrl = `${baseUrl}/blogs/${article.slug.current}`

  return {
    title: `${title} | Web Friend`,
    description,
    openGraph: {
      title: article.ogTitle || title,
      description: article.ogDescription || description,
      images: article.ogImage ? [{ url: urlFor(article.ogImage).url() }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.ogTitle || title,
      description: article.ogDescription || description,
      images: article.ogImage ? [urlFor(article.ogImage).url()] : [],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

function ArticleDetail({ article }: { article: BlogDetail }) {
  const publishedDate = new Date(article.publishedAt)
  const readingTime = Math.ceil(article.body.length / 200) // Rough estimate: 200 words per minute

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Article header */}
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {article.categories.map((category) => (
            <Link key={category._id} href={`/blogs?category=${category.slug.current}`}>
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
              <Link key={tag._id} href={`/blogs?tag=${tag.slug.current}`}>
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
        <p className="text-muted-foreground leading-relaxed mb-4">
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
        </div>
      </footer>
    </article>
  )
}

export default async function BlogPage({ params }: BlogPageProps) {
  const fallbackSlug = 'unknown'
  const paramsData = await params
  const slug = paramsData.slug ?? fallbackSlug

  let article: BlogDetail | null = null
  let loadError: unknown = null

  try {
    article = await getArticleBySlug(slug)
  } catch (error) {
    loadError = error
  }

  if (loadError) {
    logger.error(
      'Error loading blog post page',
      loadError instanceof Error ? loadError : new Error(String(loadError)),
      {
        operation: 'BlogPage',
        slug: slug || fallbackSlug
      }
    )

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Unavailable</h1>
          <p className="text-muted-foreground mb-6">
            We encountered an error loading this blog post. Please try again later.
          </p>
          <Link href="/blogs">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!article) {
    notFound()
  }

  const baseUrl = getBaseUrl()
  const structuredData = generateArticleStructuredData(article, baseUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ArticleDetail article={article} />
    </>
  )
}
