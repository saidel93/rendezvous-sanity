import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'ville',
  title: '🏙️ Villes',
  type: 'document',
  fields: [
    defineField({ name: 'nom', title: 'Nom de la ville', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'Identifiant URL', type: 'slug', options: { source: 'nom' }, validation: (Rule) => Rule.required() }),
    defineField({
      name: 'region', title: 'Région administrative', type: 'string',
      options: {
        list: [
          'Montréal', 'Capitale-Nationale', 'Laval', 'Montérégie',
          'Outaouais', 'Estrie', 'Mauricie', 'Chaudière-Appalaches', 'Saguenay–Lac-Saint-Jean'
        ]
      }
    }),
  ],
  preview: { select: { title: 'nom', subtitle: 'region' } }
})
