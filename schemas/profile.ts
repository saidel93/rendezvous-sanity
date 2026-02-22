import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'profile',
  title: '👤 Profils',
  type: 'document',
  groups: [
    { name: 'base',    title: '📋 Infos de base', default: true },
    { name: 'photos',  title: '📸 Photos' },
    { name: 'details', title: '🏷️ Détails' },
    { name: 'status',  title: '⚙️ Statut' },
  ],
  fields: [
    // ── BASE ──────────────────────────────────────────────────────────────
    defineField({ name: 'nom', title: 'Prénom', type: 'string', group: 'base', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug', title: 'URL du profil', type: 'slug', group: 'base',
      options: { source: 'nom' },
      description: '👉 Cliquez "Generate" pour créer automatiquement',
      validation: (Rule) => Rule.required()
    }),
    defineField({ name: 'age', title: 'Âge', type: 'number', group: 'base', validation: (Rule) => Rule.required().min(18).max(99) }),
    defineField({ name: 'ville', title: 'Ville', type: 'reference', to: [{ type: 'ville' }], group: 'base', validation: (Rule) => Rule.required() }),
    defineField({ name: 'categorie', title: 'Catégorie', type: 'reference', to: [{ type: 'categorie' }], group: 'base', validation: (Rule) => Rule.required() }),
    defineField({ name: 'tagline', title: 'Slogan (1 phrase)', type: 'string', group: 'base', validation: (Rule) => Rule.required().max(120) }),
    defineField({ name: 'bio', title: 'Bio complète', type: 'text', rows: 8, group: 'base' }),
    defineField({ name: 'affiliateUrl', title: '🔗 Lien d\'affiliation', type: 'url', group: 'base', validation: (Rule) => Rule.required() }),

    // ── PHOTOS ─────────────────────────────────────────────────────────────
    defineField({
      name: 'photoUrl', title: '🌐 Photo principale — Lien URL (recommandé)', type: 'url', group: 'photos',
      description: 'Collez un lien direct vers une image (https://...)'
    }),
    defineField({
      name: 'photo', title: '💻 Photo principale — Upload', type: 'image',
      options: { hotspot: true }, group: 'photos',
      description: 'Si les deux sont remplis, le lien URL est utilisé en priorité'
    }),
    defineField({
      name: 'photosUrls', title: '🌐 Galerie — Liens URL', type: 'array', group: 'photos',
      of: [{
        type: 'object',
        fields: [
          { name: 'url', title: 'Lien (https://...)', type: 'url' },
          { name: 'alt', title: 'Description', type: 'string' }
        ],
        preview: { select: { title: 'url' } }
      }]
    }),
    defineField({
      name: 'photos', title: '💻 Galerie — Upload', type: 'array', group: 'photos',
      of: [{ type: 'image', options: { hotspot: true } }]
    }),

    // ── DÉTAILS ────────────────────────────────────────────────────────────
    defineField({
      name: 'tags', title: 'Intérêts / Tags', type: 'array', group: 'details',
      of: [{ type: 'string' }], options: { layout: 'tags' }
    }),
    defineField({
      name: 'verifie', title: 'Badges de vérification', type: 'object', group: 'details',
      fields: [
        { name: 'photo',     title: '📸 Photo vérifiée',    type: 'boolean', initialValue: false },
        { name: 'email',     title: '📧 Email vérifié',     type: 'boolean', initialValue: false },
        { name: 'telephone', title: '📱 Téléphone vérifié', type: 'boolean', initialValue: false },
        { name: 'premium',   title: '⭐ Membre premium',    type: 'boolean', initialValue: false },
      ]
    }),

    // ── STATUT ─────────────────────────────────────────────────────────────
    defineField({ name: 'online',  title: '🟢 En ligne maintenant', type: 'boolean', group: 'status', initialValue: false }),
    defineField({ name: 'vedette', title: '⭐ Profil en vedette (page d\'accueil)', type: 'boolean', group: 'status', initialValue: false }),
    defineField({ name: 'membreDepuis',     title: 'Membre depuis',     type: 'string', group: 'status' }),
    defineField({ name: 'derniereActivite', title: 'Dernière activité', type: 'string', group: 'status' }),
  ],
  preview: {
    select: { title: 'nom', subtitle: 'tagline', media: 'photo', age: 'age', online: 'online', vedette: 'vedette' },
    prepare: ({ title, subtitle, media, age, online, vedette }: any) => ({
      title: `${vedette ? '⭐ ' : ''}${online ? '🟢 ' : ''}${title || '?'}, ${age || '?'} ans`,
      subtitle: subtitle || '',
      media
    })
  }
})
