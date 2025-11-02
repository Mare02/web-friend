import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getArticleBySlug } from '@/lib/services/article-service'
import { ArticleDetailClient } from './article-detail-client'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Article Not Found | Web Friend',
    }
  }

  const title = article.metaTitle || article.title
  const description = article.metaDescription || article.excerpt

  return {
    title: `${title} | Web Friend`,
    description,
    openGraph: {
      title: article.ogTitle || title,
      description: article.ogDescription || description,
      images: article.ogImage ? [{ url: article.ogImage }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.ogTitle || title,
      description: article.ogDescription || description,
      images: article.ogImage ? [article.ogImage] : [],
    },
    alternates: {
      canonical: article.canonicalUrl,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  return <ArticleDetailClient article={article} />
}
