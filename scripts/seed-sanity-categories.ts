import { config } from 'dotenv'
config({ path: '.env.local' })
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  token: process.env.SANITY_API_TOKEN, // Required for write operations
  useCdn: false, // Use false for write operations
})

const categories = [
  {
    _type: 'category',
    title: 'Trending Topics',
    slug: { _type: 'slug', current: 'trending-topics' },
    description: 'Latest trends and hot topics in web development and analysis',
  },
  {
    _type: 'category',
    title: 'Case Studies',
    slug: { _type: 'slug', current: 'case-studies' },
    description: 'Real-world examples and success stories',
  },
  {
    _type: 'category',
    title: 'Best Practices',
    slug: { _type: 'slug', current: 'best-practices' },
    description: 'Industry standards and recommended approaches',
  },
  {
    _type: 'category',
    title: 'Tips & Tricks',
    slug: { _type: 'slug', current: 'tips-tricks' },
    description: 'Quick tips and helpful techniques',
  },
  {
    _type: 'category',
    title: 'Tutorials',
    slug: { _type: 'slug', current: 'tutorials' },
    description: 'Step-by-step guides and tutorials',
  },
  {
    _type: 'category',
    title: 'AI & Machine Learning',
    slug: { _type: 'slug', current: 'ai-machine-learning' },
    description: 'Artificial intelligence, machine learning, and emerging AI technologies',
  },
  {
    _type: 'category',
    title: 'Industry News',
    slug: { _type: 'slug', current: 'industry-news' },
    description: 'Latest news and updates from the tech industry',
  },
  {
    _type: 'category',
    title: 'Product Updates',
    slug: { _type: 'slug', current: 'product-updates' },
    description: 'New features, tools, and product announcements',
  },
  {
    _type: 'category',
    title: 'Business & Strategy',
    slug: { _type: 'slug', current: 'business-strategy' },
    description: 'Business insights, growth strategies, and entrepreneurship',
  },
  {
    _type: 'category',
    title: 'Digital Marketing',
    slug: { _type: 'slug', current: 'digital-marketing' },
    description: 'Marketing strategies, content creation, and online growth',
  },
  {
    _type: 'category',
    title: 'Software Development',
    slug: { _type: 'slug', current: 'software-dev' },
    description: 'General software development practices, methodologies, and processes',
  },
  {
    _type: 'category',
    title: 'Backend Development',
    slug: { _type: 'slug', current: 'backend-dev' },
    description: 'Server-side development, APIs, databases, and infrastructure',
  },
  {
    _type: 'category',
    title: 'Frontend Development',
    slug: { _type: 'slug', current: 'frontend-dev' },
    description: 'Client-side development, UI/UX, and user-facing technologies',
  },
  {
    _type: 'category',
    title: 'DevOps',
    slug: { _type: 'slug', current: 'devops-cat' },
    description: 'Development operations, CI/CD, deployment, and automation',
  },
  {
    _type: 'category',
    title: 'Software Architecture',
    slug: { _type: 'slug', current: 'architecture' },
    description: 'System design, architectural patterns, and scalable solutions',
  },
  {
    _type: 'category',
    title: 'Code Quality',
    slug: { _type: 'slug', current: 'code-quality-cat' },
    description: 'Testing, refactoring, performance optimization, and best practices',
  },
]

async function seedCategories() {
  console.log('🌱 Seeding Sanity categories...')

  try {
    for (const category of categories) {
      console.log(`Creating/updating category: ${category.title}`)

      // Use upsert pattern - create if doesn't exist, update if exists
      const result = await client.createOrReplace({
        ...category,
        _id: category.slug.current, // Use slug as ID for consistency
      })

      console.log(`✅ Created/updated category: ${result.title}`)
    }

    console.log('🎉 All categories seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding categories:', error)
    process.exit(1)
  }
}

// Check for required environment variables
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error('❌ NEXT_PUBLIC_SANITY_PROJECT_ID is required')
  process.exit(1)
}

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  console.error('❌ NEXT_PUBLIC_SANITY_DATASET is required')
  process.exit(1)
}

if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN is required')
  console.log('💡 Get your token from: https://sanity.io/manage')
  console.log('💡 Make sure it has Editor or Admin permissions')
  process.exit(1)
}

seedCategories()

