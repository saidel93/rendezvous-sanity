import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'blog',
  title: '📝 Articles de blog',
  type: 'document',
  groups: [
    { name: 'base', title: '📋 Contenu', default: true },
    { name: 'seo',  title: '🔍 SEO' },
  ],
  fields: [
    defineField({ name: 'titre', title: 'Titre', type: 'string', group: 'base', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'URL', type: 'slug', group: 'base', options: { source: 'titre' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'extrait', title: 'Extrait', type: 'text', rows: 2, group: 'base' }),
    defineField({ name: 'contenu', title: 'Contenu', type: 'array', group: 'base', of: [{ type: 'block' }] }),
    defineField({ name: 'imageUrl', title: 'Image URL', type: 'url', group: 'base' }),
    defineField({ name: 'image', title: 'Image upload', type: 'image', group: 'base', options: { hotspot: true } }),
    defineField({ name: 'datePublication', title: 'Date', type: 'date', group: 'base' }),
    defineField({ name: 'publie', title: 'Publié ?', type: 'boolean', group: 'base', initialValue: true }),
    defineField({ name: 'seoTitle', title: 'Titre SEO', type: 'string', group: 'seo', validation: (Rule) => Rule.max(70) }),
    defineField({ name: 'seoDescription', title: 'Description SEO', type: 'text', rows: 2, group: 'seo', validation: (Rule) => Rule.max(160) }),
  ],
  preview: {
    select: { title: 'titre', publie: 'publie', date: 'datePublication' },
    prepare: ({ title, publie, date }: any) => ({ title: `${publie ? '✅' : '⏸'} ${title}`, subtitle: date || 'Pas de date' }),
  },
})
