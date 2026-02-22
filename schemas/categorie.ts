import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'categorie',
  title: '💝 Catégories',
  type: 'document',
  fields: [
    defineField({ name: 'nom', title: 'Nom', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'Identifiant URL', type: 'slug', options: { source: 'nom' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'emoji', title: 'Emoji', type: 'string' }),
    defineField({ name: 'description', title: 'Description courte', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'nom', emoji: 'emoji' },
    prepare: ({ title, emoji }: any) => ({ title: `${emoji || ''} ${title}` })
  }
})
