import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'categorie',
  title: '💝 Catégories',
  type: 'document',
  groups: [
    { name: 'base', title: '📋 Infos', default: true },
    { name: 'seo',  title: '🔍 SEO' },
  ],
  fields: [
    defineField({ name: 'nom', title: 'Nom', type: 'string', group: 'base', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'Identifiant URL', type: 'slug', group: 'base', options: { source: 'nom' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'emoji', title: 'Emoji', type: 'string', group: 'base' }),
    defineField({ name: 'description', title: 'Description courte', type: 'text', rows: 2, group: 'base' }),
    defineField({
      name: 'seoTitle', title: '🔍 Titre SEO', type: 'string', group: 'seo',
      description: 'Ex: "Relation sérieuse au Québec – Rencontres ❤️". Si vide, titre généré automatiquement.',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'seoDescription', title: '📝 Description SEO', type: 'text', rows: 2, group: 'seo',
      description: 'Si vide, la description est utilisée. Maximum 160 caractères.',
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: {
    select: { title: 'nom', emoji: 'emoji' },
    prepare: ({ title, emoji }: any) => ({ title: `${emoji || ''} ${title}` })
  }
})