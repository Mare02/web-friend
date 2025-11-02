import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// Create a client for image URL building (doesn't need auth)
const imageClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(imageClient)

export function sanityImageUrlBuilder(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source)
}
