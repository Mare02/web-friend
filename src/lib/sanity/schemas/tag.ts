import type { Rule } from "sanity"

const tagSchema = {
  name: 'tag',
  type: 'document',
  title: 'Tag',
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
  ],
}

export default tagSchema
