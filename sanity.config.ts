import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/lib/sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Web Friend CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: '/admin/studio',
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: '2025‑08‑19' /* adjust as needed */ }),
  ],
  schema: {
    types: schemaTypes,
  },
})
