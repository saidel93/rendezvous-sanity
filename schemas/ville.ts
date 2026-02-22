import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'ville',
  title: '🏙️ Villes',
  type: 'document',
  groups: [
    { name: 'base', title: '📋 Infos', default: true },
    { name: 'seo',  title: '🔍 SEO' },
  ],
  fields: [
    defineField({ name: 'nom', title: 'Nom de la ville', type: 'string', group: 'base', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'Identifiant URL', type: 'slug', group: 'base', options: { source: 'nom' }, validation: (Rule) => Rule.required() }),
    defineField({
      name: 'region', title: 'Région administrative', type: 'string', group: 'base',
      options: {
        list: [
          'Montréal', 'Capitale-Nationale', 'Laval', 'Montérégie',
          'Outaouais', 'Estrie', 'Mauricie', 'Chaudière-Appalaches', 'Saguenay–Lac-Saint-Jean'
        ]
      }
    }),
    defineField({
      name: 'seoTitle', title: '🔍 Titre SEO', type: 'string', group: 'seo',
      description: 'Ex: "Rencontres à Montréal – Célibataires Montréal, Québec". Si vide, titre généré automatiquement.',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'seoDescription', title: '📝 Description SEO', type: 'text', rows: 2, group: 'seo',
      description: 'Si vide, description générée automatiquement. Maximum 160 caractères.',
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: { select: { title: 'nom', subtitle: 'region' } }
})