import type { Rule } from "sanity"

const articleSchema = {
  name: 'article',
  type: 'document',
  title: 'Article',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'excerpt',
      type: 'text',
      title: 'Excerpt',
      rows: 3,
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'body',
      type: 'array',
      title: 'Body',
      of: [{ type: 'block' }],
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'categories',
      type: 'array',
      title: 'Categories',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      validation: (rule: Rule) => rule.required().min(1),
    },
    {
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
      validation: (rule: Rule) => rule.required().min(1),
    },
    // SEO fields
    {
      name: 'metaTitle',
      type: 'string',
      title: 'Meta Title',
      description: 'Title for SEO (defaults to article title if empty)',
    },
    {
      name: 'metaDescription',
      type: 'text',
      title: 'Meta Description',
      rows: 2,
      description: 'Description for SEO (recommended 150-160 characters)',
    },
    {
      name: 'ogTitle',
      type: 'string',
      title: 'Open Graph Title',
      description: 'Title for social media sharing (defaults to meta title)',
    },
    {
      name: 'ogDescription',
      type: 'text',
      title: 'Open Graph Description',
      rows: 2,
      description: 'Description for social media sharing',
    },
    {
      name: 'ogImage',
      type: 'image',
      title: 'Open Graph Image',
      description: 'Image for social media sharing (1200x630 recommended)',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'coverImage',
      type: 'image',
      title: 'Cover Image',
      description: 'Cover image for the article',
      options: {
        hotspot: true,
      },
      validation: (rule: Rule) => rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'excerpt',
      media: 'coverImage',
    },
  },
}

export default articleSchema
