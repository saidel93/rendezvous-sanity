import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'settings',
  title: '⚙️ Paramètres du site',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'affiliateUrl',
      title: '🔗 Lien d\'affiliation global',
      type: 'url',
      description: 'Ce lien est utilisé pour TOUS les profils qui n\'ont pas leur propre lien. Mettez ici votre lien principal.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'siteName',
      title: 'Nom du site',
      type: 'string',
      initialValue: 'RendezVous Québec',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Description du site (meta description globale)',
      type: 'text',
      rows: 2,
      initialValue: 'Des milliers de profils vérifiés à travers le Québec. Trouvez votre partenaire idéal à Montréal, Québec, Laval et partout au Québec.',
    }),
  ],
  preview: {
    prepare: () => ({ title: '⚙️ Paramètres du site' }),
  },
})
