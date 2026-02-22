import { defineConfig, definePlugin } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { JsonImportTool } from './plugins/JsonImportTool'

const jsonImportPlugin = definePlugin({
  name: 'json-import',
  tools: [
    {
      name: 'json-import',
      title: '📥 Import JSON',
      icon: () => '📥' as any,
      component: JsonImportTool,
    },
  ],
})

export default defineConfig({
  name: 'rendezvous-quebec',
  title: 'RendezVous Québec — Admin',

  // ─────────────────────────────────────────────────────────────────────────
  // 👉 Remplacez par votre Project ID (sanity.io/manage)
  projectId: 'YOUR_PROJECT_ID',
  // ─────────────────────────────────────────────────────────────────────────

  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('RendezVous Québec')
          .items([
            // ── Profils ─────────────────────────────────────────────────
            S.listItem()
              .title('👤 Profils')
              .child(
                S.documentTypeList('profile')
                  .title('Tous les profils')
                  .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
              ),
            S.divider(),
            // ── Données de référence ────────────────────────────────────
            S.listItem()
              .title('🏙️ Villes')
              .child(S.documentTypeList('ville').title('Villes')),
            S.listItem()
              .title('💝 Catégories')
              .child(S.documentTypeList('categorie').title('Catégories')),
            S.divider(),
            // ── Paramètres ──────────────────────────────────────────────
            S.listItem()
              .title('⚙️ Paramètres du site')
              .child(
                S.editor()
                  .id('settings')
                  .schemaType('settings')
                  .documentId('site-settings')
              ),
          ]),
    }),
    visionTool(),
    jsonImportPlugin(),
  ],

  schema: { types: schemaTypes },
})
