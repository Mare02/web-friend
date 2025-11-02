import { client } from '@/lib/sanity/client'
import {
  categorySchema,
  tagSchema,
  articleListItemSchema,
  articleDetailSchema,
  articleListResponseSchema,
  recentArticlesByCategorySchema,
  type Category,
  type Tag,
  type BlogListItem,
  type BlogDetail,
  type BlogFilters,
  type BlogListResponse,
  type RecentBlogsByCategory,
} from '@/lib/validators/schema'

const ARTICLES_PER_PAGE = 12

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  const query = `*[_type == 'category'] | order(title asc){_id, _type, title, slug, description}`
  const result = await client.fetch(query)

  // Validate and return
  return result.map((category: unknown) => categorySchema.parse(category))
}

/**
 * Get all tags
 */
export async function getTags(): Promise<Tag[]> {
  const query = `*[_type == 'tag'] | order(title asc){_id, _type, title, slug}`
  const result = await client.fetch(query)

  // Validate and return
  return result.map((tag: unknown) => tagSchema.parse(tag))
}

/**
 * Get filtered blogs with pagination
 */
export async function getArticles(filters: Partial<BlogFilters> = {}): Promise<BlogListResponse> {
  const { category, tag, page = 1 } = filters

  const skip = (page - 1) * ARTICLES_PER_PAGE
  const end = skip + ARTICLES_PER_PAGE

  // Build GROQ query with conditional filters
  const query = `*[_type == 'article'
    ${category ? `&& $categorySlug in categories[]->slug.current` : ''}
    ${tag ? `&& $tagSlug in tags[]->slug.current` : ''}
  ]
  | order(publishedAt desc)
  [$skip...$end]
  {
    _id, _type, title, slug, excerpt, publishedAt, coverImage,
    'categories': categories[]->{_id, title, slug},
    'tags': coalesce(tags[]->{_id, title, slug}, [])
  }`

  // Get articles
  const articles = await client.fetch(query, {
    categorySlug: category || '',
    tagSlug: tag || '',
    skip,
    end,
  })

  // Get total count for pagination
  const countQuery = `count(*[_type == 'article'
    ${category ? `&& $categorySlug in categories[]->slug.current` : ''}
    ${tag ? `&& $tagSlug in tags[]->slug.current` : ''}
  ])`

  const total = await client.fetch(countQuery, {
    categorySlug: category || '',
    tagSlug: tag || '',
  })

  const validatedArticles = articles.map((article: unknown) =>
    articleListItemSchema.parse(article)
  )

  const response = {
    articles: validatedArticles,
    total,
    hasNextPage: skip + ARTICLES_PER_PAGE < total,
    currentPage: page,
  }

  return articleListResponseSchema.parse(response) as BlogListResponse
}

/**
 * Get single blog by slug
 */
export async function getArticleBySlug(slug: string): Promise<BlogDetail | null> {
  const query = `*[_type == 'article' && slug.current == $slug][0]{
    ...,
    'categories': categories[]->{_id, title, slug},
    'tags': coalesce(tags[]->{_id, title, slug}, [])
  }`

  const result = await client.fetch(query, { slug })

  if (!result) {
    return null
  }

  return articleDetailSchema.parse(result)
}

/**
 * Get recent blogs by category (for homepage)
 */
export async function getRecentArticlesByCategory(
  categoryId: string,
  limit = 3
): Promise<RecentBlogsByCategory | null> {
  // First get the category
  const categoryQuery = `*[_type == 'category' && _id == $categoryId][0]{_id, _type, title, slug, description}`
  const category = await client.fetch(categoryQuery, { categoryId })

  if (!category) {
    return null
  }

  // Then get recent blogs for that category
  const articlesQuery = `*[_type == 'article' && $categoryId in categories[]->_id]
    | order(publishedAt desc)[0...$limit]
    {
      _id, _type, title, slug, excerpt, publishedAt, coverImage,
      'categories': categories[]->{_id, title, slug},
      'tags': coalesce(tags[]->{_id, title, slug}, [])
    }`

  const articles = await client.fetch(articlesQuery, { categoryId, limit })

  const result = {
    category: categorySchema.parse(category),
    articles: articles.map((article: unknown) => articleListItemSchema.parse(article)),
  }

  return recentArticlesByCategorySchema.parse(result)
}

/**
 * Get the most recent blogs across all categories (for homepage)
 */
export async function getRecentArticles(limit = 3): Promise<BlogListItem[]> {
  const query = `*[_type == 'article']
    | order(publishedAt desc)[0...$limit]
    {
      _id, _type, title, slug, excerpt, publishedAt, coverImage,
      'categories': categories[]->{_id, title, slug},
      'tags': coalesce(tags[]->{_id, title, slug}, [])
    }`

  const articles = await client.fetch(query, { limit })

  return articles.map((article: unknown) => articleListItemSchema.parse(article))
}

/**
 * Get all categories with their recent blogs (for homepage)
 */
export async function getAllCategoriesWithRecentArticles(limit = 3): Promise<RecentBlogsByCategory[]> {
  const categories = await getCategories()
  const results: RecentBlogsByCategory[] = []

  for (const category of categories) {
    const categoryWithArticles = await getRecentArticlesByCategory(category._id, limit)
    if (categoryWithArticles) {
      results.push(categoryWithArticles)
    }
  }

  return results
}

/**
 * Search blogs (basic title/excerpt search)
 */
export async function searchArticles(query: string, filters: Partial<BlogFilters> = {}): Promise<BlogListItem[]> {
  const { category, tag } = filters

  const searchQuery = `*[_type == 'article' &&
    (title match $searchQuery || excerpt match $searchQuery)
    ${category ? `&& $categorySlug in categories[]->slug.current` : ''}
    ${tag ? `&& $tagSlug in tags[]->slug.current` : ''}
  ]
  | order(publishedAt desc)[0...50]
  {
    _id, _type, title, slug, excerpt, publishedAt, coverImage,
    'categories': categories[]->{_id, title, slug},
    'tags': coalesce(tags[]->{_id, title, slug}, [])
  }`

  const result = await client.fetch(searchQuery, {
    searchQuery: `*${query}*`,
    categorySlug: category || '',
    tagSlug: tag || '',
  })

  return result.map((article: unknown) => articleListItemSchema.parse(article))
}
