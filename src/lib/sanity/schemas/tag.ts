/* eslint-disable @typescript-eslint/no-explicit-any */

const tagSchema = {
  name: 'tag',
  type: 'document',
  title: 'Tag',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule: { required: () => any }) => Rule.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: { required: () => any }) => Rule.required(),
    },
  ],
}

export default tagSchema
