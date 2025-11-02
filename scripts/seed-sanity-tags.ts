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

const tags = [
  {
    _type: 'tag',
    title: 'SEO',
    slug: { _type: 'slug', current: 'seo' },
  },
  {
    _type: 'tag',
    title: 'Performance',
    slug: { _type: 'slug', current: 'performance' },
  },
  {
    _type: 'tag',
    title: 'Accessibility',
    slug: { _type: 'slug', current: 'accessibility' },
  },
  {
    _type: 'tag',
    title: 'React',
    slug: { _type: 'slug', current: 'react' },
  },
  {
    _type: 'tag',
    title: 'Next.js',
    slug: { _type: 'slug', current: 'nextjs' },
  },
  {
    _type: 'tag',
    title: 'TypeScript',
    slug: { _type: 'slug', current: 'typescript' },
  },
  {
    _type: 'tag',
    title: 'JavaScript',
    slug: { _type: 'slug', current: 'javascript' },
  },
  {
    _type: 'tag',
    title: 'CSS',
    slug: { _type: 'slug', current: 'css' },
  },
  {
    _type: 'tag',
    title: 'HTML',
    slug: { _type: 'slug', current: 'html' },
  },
  {
    _type: 'tag',
    title: 'Analytics',
    slug: { _type: 'slug', current: 'analytics' },
  },
  {
    _type: 'tag',
    title: 'Web Development',
    slug: { _type: 'slug', current: 'web-development' },
  },
  {
    _type: 'tag',
    title: 'Frontend',
    slug: { _type: 'slug', current: 'frontend' },
  },
  {
    _type: 'tag',
    title: 'Backend',
    slug: { _type: 'slug', current: 'backend' },
  },
  {
    _type: 'tag',
    title: 'API',
    slug: { _type: 'slug', current: 'api' },
  },
  {
    _type: 'tag',
    title: 'Database',
    slug: { _type: 'slug', current: 'database' },
  },
  {
    _type: 'tag',
    title: 'Security',
    slug: { _type: 'slug', current: 'security' },
  },
  {
    _type: 'tag',
    title: 'Testing',
    slug: { _type: 'slug', current: 'testing' },
  },
  {
    _type: 'tag',
    title: 'DevOps',
    slug: { _type: 'slug', current: 'devops' },
  },
  {
    _type: 'tag',
    title: 'UX/UI',
    slug: { _type: 'slug', current: 'ux-ui' },
  },
  {
    _type: 'tag',
    title: 'Mobile',
    slug: { _type: 'slug', current: 'mobile' },
  },
]

async function seedTags() {
  console.log('🌱 Seeding Sanity tags...')

  try {
    for (const tag of tags) {
      console.log(`Creating/updating tag: ${tag.title}`)

      // Use upsert pattern - create if doesn't exist, update if exists
      const result = await client.createOrReplace({
        ...tag,
        _id: tag.slug.current, // Use slug as ID for consistency
      })

      console.log(`✅ Created/updated tag: ${result.title}`)
    }

    console.log('🎉 All tags seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding tags:', error)
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

seedTags()
