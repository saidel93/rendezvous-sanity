import { useState } from 'react'
import { useClient } from 'sanity'

const VILLE_IDS = [
  ['ville-montreal',       'Montréal'],
  ['ville-quebec',         'Québec'],
  ['ville-laval',          'Laval'],
  ['ville-longueuil',      'Longueuil'],
  ['ville-gatineau',       'Gatineau'],
  ['ville-sherbrooke',     'Sherbrooke'],
  ['ville-trois-rivieres', 'Trois-Rivières'],
  ['ville-levis',          'Lévis'],
  ['ville-saguenay',       'Saguenay'],
]
const CAT_IDS = [
  ['categorie-serieux',    'Relation sérieuse ❤️'],
  ['categorie-aventure',   'Aventure 🌿'],
  ['categorie-amitie',     'Amitié 🤝'],
  ['categorie-rencontre',  'Rencontre décontractée 😊'],
  ['categorie-voyage',     'Voyage ✈️'],
  ['categorie-sport',      'Sport 🏃'],
]

const TEMPLATES: Record<string, object[]> = {
  profile: [
    {
      _type: 'profile',
      _id: 'profile-prenom-ville-001',
      nom: 'Sophie',
      age: 27,
      tagline: 'Votre slogan accrocheur ici (max 120 caractères)',
      bio: 'Votre bio complète ici...',
      photoUrl: 'https://lien-vers-votre-photo.jpg',
      photosUrls: [
        { _key: 'p1', url: 'https://lien-photo-2.jpg' },
        { _key: 'p2', url: 'https://lien-photo-3.jpg' },
      ],
      tags: ['Yoga', 'Voyage', 'Cuisine'],
      verifie: { photo: true, email: true, telephone: false, premium: false },
      online: true,
      vedette: false,
      membreDepuis: 'jan. 2025',
      derniereActivite: '1 h',
      affiliateUrl: 'https://votre-lien-affiliation.com/?ref=sophie',
      ville:     { _type: 'reference', _ref: 'ville-montreal' },
      categorie: { _type: 'reference', _ref: 'categorie-serieux' },
    },
  ],
  ville: [
    {
      _type: 'ville',
      _id: 'ville-nomville',
      nom: 'Nom de la ville',
      region: 'Région',
      slug: { _type: 'slug', current: 'nom-de-la-ville' },
    },
  ],
  categorie: [
    {
      _type: 'categorie',
      _id: 'categorie-nomcat',
      nom: 'Nom de la catégorie',
      emoji: '❤️',
      description: 'Description courte de la catégorie.',
      slug: { _type: 'slug', current: 'nom-de-la-categorie' },
    },
  ],
}

export function JsonImportTool() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [docType, setDocType] = useState('profile')
  const [json, setJson] = useState('')
  const [logs, setLogs] = useState<{ text: string; color: string }[]>([])
  const [busy, setBusy] = useState(false)
  const [showRef, setShowRef] = useState(false)

  function addLog(text: string, color = '#94a3b8') {
    setLogs(p => [...p, { text, color }])
  }

  function loadTemplate() {
    setJson(JSON.stringify(TEMPLATES[docType], null, 2))
    setLogs([])
  }

  async function runImport() {
    setLogs([])
    let docs: any[]
    try {
      const parsed = JSON.parse(json)
      docs = Array.isArray(parsed) ? parsed : [parsed]
    } catch (e: any) {
      addLog('❌ JSON invalide : ' + e.message, '#f87171')
      return
    }

    setBusy(true)
    addLog(`📥 Import de ${docs.length} document(s)...`)
    let ok = 0, fail = 0

    for (const doc of docs) {
      const d = { ...doc, _type: doc._type || docType }
      if (!d._id) d._id = `${d._type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      try {
        await client.createOrReplace(d)
        addLog(`✅  ${d._id}  (${d.nom || d._id})`, '#4ade80')
        ok++
      } catch (e: any) {
        addLog(`❌  ${d._id}  →  ${e.message}`, '#f87171')
        fail++
      }
    }

    addLog('')
    addLog(fail === 0
      ? `🎉 Terminé : ${ok} document(s) importé(s) avec succès !`
      : `⚠️  Terminé : ${ok} ok, ${fail} erreur(s).`,
      fail === 0 ? '#4ade80' : '#fb923c')
    setBusy(false)
  }

  const btn = (disabled = false): React.CSSProperties => ({
    padding: '9px 20px', borderRadius: 7, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 700, fontSize: 14, fontFamily: 'inherit',
    background: disabled ? '#cbd5e1' : '#e11d48', color: '#fff',
  })
  const btnGhost: React.CSSProperties = {
    padding: '9px 20px', borderRadius: 7, border: '1px solid #e2e8f0', cursor: 'pointer',
    fontWeight: 600, fontSize: 14, fontFamily: 'inherit', background: '#fff', color: '#374151',
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 860, margin: '0 auto', fontFamily: 'system-ui,sans-serif' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>📥 Import JSON</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 28 }}>
        Collez du JSON pour ajouter ou mettre à jour des profils, villes ou catégories directement dans Sanity.
      </p>

      {/* ── Type + actions ── */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Type de document</label>
            <select
              value={docType}
              onChange={e => { setDocType(e.target.value); setJson(''); setLogs([]) }}
              style={{ padding: '9px 14px', borderRadius: 7, border: '1px solid #d1d5db', fontSize: 14, fontFamily: 'inherit', background: '#fff' }}
            >
              <option value="profile">👤 Profil</option>
              <option value="ville">🏙️ Ville</option>
              <option value="categorie">💝 Catégorie</option>
            </select>
          </div>
          <button style={btnGhost} onClick={loadTemplate}>📋 Charger template vide</button>
          <button style={btnGhost} onClick={() => setShowRef(v => !v)}>
            {showRef ? '🙈 Masquer' : '📖 Voir les IDs de référence'}
          </button>
        </div>

        {/* Reference IDs */}
        {showRef && (
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#6b7280', marginBottom: 8 }}>🏙️ Villes — valeur de _ref</p>
              {VILLE_IDS.map(([id, nom]) => (
                <div key={id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
                  <span style={{ color: '#374151' }}>{nom}</span>
                  <code style={{ color: '#e11d48', fontSize: 12 }}>{id}</code>
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#6b7280', marginBottom: 8 }}>💝 Catégories — valeur de _ref</p>
              {CAT_IDS.map(([id, nom]) => (
                <div key={id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
                  <span style={{ color: '#374151' }}>{nom}</span>
                  <code style={{ color: '#e11d48', fontSize: 12 }}>{id}</code>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── JSON textarea ── */}
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
        JSON à importer <span style={{ color: '#9ca3af', fontWeight: 400 }}>(un objet ou un tableau de plusieurs objets)</span>
      </label>
      <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#92400e', marginBottom: 10 }}>
        💡 Chaque document doit avoir un <code>_id</code> unique. Si vous réimportez un <code>_id</code> existant, le document sera <strong>mis à jour</strong>.
      </div>
      <textarea
        value={json}
        onChange={e => setJson(e.target.value)}
        spellCheck={false}
        placeholder={`Collez votre JSON ici, par exemple :\n[\n  { "_id": "profile-marie-001", "nom": "Marie", "age": 27, ... },\n  { "_id": "profile-sophie-001", "nom": "Sophie", "age": 31, ... }\n]`}
        style={{
          width: '100%', minHeight: 300, fontFamily: 'monospace', fontSize: 13,
          border: '1px solid #d1d5db', borderRadius: 8, padding: 14,
          resize: 'vertical', outline: 'none', lineHeight: 1.65,
          background: '#0f172a', color: '#e2e8f0',
        }}
      />

      {/* ── Buttons ── */}
      <div style={{ display: 'flex', gap: 10, margin: '14px 0 24px' }}>
        <button style={btn(busy || !json.trim())} disabled={busy || !json.trim()} onClick={runImport}>
          {busy ? '⏳ Import en cours...' : '🚀 Importer dans Sanity'}
        </button>
        <button style={btnGhost} onClick={() => { setJson(''); setLogs([]) }}>🗑️ Effacer</button>
      </div>

      {/* ── Logs ── */}
      {logs.length > 0 && (
        <>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Journal d'import</label>
          <div style={{ background: '#0f172a', borderRadius: 10, padding: '14px 18px', minHeight: 80, maxHeight: 300, overflowY: 'auto', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.7 }}>
            {logs.map((l, i) => (
              <div key={i} style={{ color: l.color }}>{l.text || '\u00A0'}</div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
