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
    title: 'Vue',
    slug: { _type: 'slug', current: 'vue' },
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
    title: 'UX/UI',
    slug: { _type: 'slug', current: 'ux-ui' },
  },
  {
    _type: 'tag',
    title: 'Mobile',
    slug: { _type: 'slug', current: 'mobile' },
  },
  // AI & Tech Tags
  {
    _type: 'tag',
    title: 'AI',
    slug: { _type: 'slug', current: 'ai' },
  },
  {
    _type: 'tag',
    title: 'ChatGPT',
    slug: { _type: 'slug', current: 'chatgpt' },
  },
  {
    _type: 'tag',
    title: 'Machine Learning',
    slug: { _type: 'slug', current: 'machine-learning' },
  },
  {
    _type: 'tag',
    title: 'Automation',
    slug: { _type: 'slug', current: 'automation' },
  },
  {
    _type: 'tag',
    title: 'Tools',
    slug: { _type: 'slug', current: 'tools' },
  },
  {
    _type: 'tag',
    title: 'Productivity',
    slug: { _type: 'slug', current: 'productivity' },
  },
  // Marketing & Business Tags
  {
    _type: 'tag',
    title: 'Content Marketing',
    slug: { _type: 'slug', current: 'content-marketing' },
  },
  {
    _type: 'tag',
    title: 'Social Media',
    slug: { _type: 'slug', current: 'social-media' },
  },
  {
    _type: 'tag',
    title: 'Branding',
    slug: { _type: 'slug', current: 'branding' },
  },
  {
    _type: 'tag',
    title: 'Growth Hacking',
    slug: { _type: 'slug', current: 'growth-hacking' },
  },
  {
    _type: 'tag',
    title: 'Startups',
    slug: { _type: 'slug', current: 'startups' },
  },
  {
    _type: 'tag',
    title: 'E-commerce',
    slug: { _type: 'slug', current: 'ecommerce' },
  },
  // General Tech Tags
  {
    _type: 'tag',
    title: 'Cloud Computing',
    slug: { _type: 'slug', current: 'cloud-computing' },
  },
  {
    _type: 'tag',
    title: 'No-Code',
    slug: { _type: 'slug', current: 'no-code' },
  },
  {
    _type: 'tag',
    title: 'SaaS',
    slug: { _type: 'slug', current: 'saas' },
  },
  {
    _type: 'tag',
    title: 'Remote Work',
    slug: { _type: 'slug', current: 'remote-work' },
  },
  {
    _type: 'tag',
    title: 'Data Privacy',
    slug: { _type: 'slug', current: 'data-privacy' },
  },
  {
    _type: 'tag',
    title: 'Web3',
    slug: { _type: 'slug', current: 'web3' },
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
