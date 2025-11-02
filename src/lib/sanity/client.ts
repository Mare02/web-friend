import { createClient } from 'next-sanity'
import { sanityImageUrlBuilder } from './utils'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  useCdn: process.env.SANITY_USE_CDN !== 'false', // defaults to true
})

export { sanityImageUrlBuilder as urlFor }

