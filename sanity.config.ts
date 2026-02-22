import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'rendezvous-quebec',
  title: 'RendezVous Québec — Admin',

  // ─────────────────────────────────────────────────────────────────────────
  // 👉 ÉTAPE 1 : Remplacez par votre Project ID (sanity.io/manage)
  projectId: 'e8skho1c',
  // ─────────────────────────────────────────────────────────────────────────

  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('RendezVous Québec')
          .items([
            S.listItem()
              .title('👤 Profils')
              .child(
                S.documentTypeList('profile')
                  .title('Tous les profils')
                  .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
              ),
            S.divider(),
            S.listItem()
              .title('🏙️ Villes')
              .child(S.documentTypeList('ville').title('Villes')),
            S.listItem()
              .title('💝 Catégories')
              .child(S.documentTypeList('categorie').title('Catégories')),
          ])
    }),
    visionTool(),
  ],

  schema: { types: schemaTypes },
})
