import { createClient } from 'next-sanity'
import { sanityImageUrlBuilder } from './utils'

// Validate required environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!projectId) {
  throw new Error(
    'NEXT_PUBLIC_SANITY_PROJECT_ID is required. Please check your environment variables.'
  )
}

if (!dataset) {
  throw new Error(
    'NEXT_PUBLIC_SANITY_DATASET is required. Please check your environment variables.'
  )
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  useCdn: process.env.SANITY_USE_CDN !== 'false', // defaults to true
})

export { sanityImageUrlBuilder as urlFor }

