import { useState } from 'react'
import { useClient } from 'sanity'

// ─── Helpers ────────────────────────────────────────────────────────────────

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function buildDoc(raw: any, type: string) {
  if (type === 'profile') {
    // build slug from nom if missing
    const current = raw.slug?.current || slugify(raw.nom || 'profil')
    return {
      ...raw,
      _type: 'profile',
      _id: raw._id || `profile-${current}-${Date.now()}`,
      slug: { _type: 'slug', current },
    }
  }
  if (type === 'ville') {
    const current = raw.slug?.current || slugify(raw.nom || 'ville')
    return {
      ...raw,
      _type: 'ville',
      _id: raw._id || `ville-${current}`,
      slug: { _type: 'slug', current },
    }
  }
  if (type === 'categorie') {
    const current = raw.slug?.current || slugify(raw.nom || 'cat')
    return {
      ...raw,
      _type: 'categorie',
      _id: raw._id || `categorie-${current}`,
      slug: { _type: 'slug', current },
    }
  }
  return raw
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  wrap:   { padding: 32, maxWidth: 900, margin: '0 auto', fontFamily: 'system-ui, sans-serif' },
  h1:     { fontSize: 22, fontWeight: 700, marginBottom: 6 },
  sub:    { color: '#666', fontSize: 14, marginBottom: 28 },
  row:    { display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' as const },
  btn:    { padding: '8px 18px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, background: '#e11d48', color: '#fff' },
  btnSec: { padding: '8px 18px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer', fontWeight: 600, fontSize: 14, background: '#fff', color: '#333' },
  btnDis: { padding: '8px 18px', borderRadius: 6, border: 'none', cursor: 'not-allowed', fontWeight: 600, fontSize: 14, background: '#ccc', color: '#fff' },
  ta:     { width: '100%', minHeight: 280, fontFamily: 'monospace', fontSize: 13, border: '1px solid #ddd', borderRadius: 8, padding: 14, resize: 'vertical' as const, outline: 'none', lineHeight: 1.6 },
  tpl:    { width: '100%', minHeight: 160, fontFamily: 'monospace', fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: '#f9fafb', resize: 'vertical' as const, outline: 'none', lineHeight: 1.5 },
  log:    { background: '#0f172a', color: '#94a3b8', fontFamily: 'monospace', fontSize: 13, borderRadius: 8, padding: 16, minHeight: 100, maxHeight: 260, overflowY: 'auto' as const, whiteSpace: 'pre-wrap' as const, wordBreak: 'break-all' as const },
  ok:     { color: '#4ade80' },
  err:    { color: '#f87171' },
  warn:   { color: '#fb923c' },
  label:  { fontWeight: 600, fontSize: 13, marginBottom: 6, display: 'block' },
  select: { padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', fontSize: 14, background: '#fff' },
  card:   { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 20, marginBottom: 20 },
  tip:    { background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#92400e', marginBottom: 16 },
}

// ─── Templates ───────────────────────────────────────────────────────────────

const TEMPLATES: Record<string, string> = {
  profile: JSON.stringify([
    {
      "_type": "profile",
      "_id": "profile-marie-montreal-001",
      "nom": "Marie",
      "age": 27,
      "tagline": "Votre slogan accrocheur ici",
      "bio": "Votre bio complète ici...",
      "photoUrl": "https://lien-vers-photo.jpg",
      "photosUrls": [
        { "_key": "p1", "url": "https://lien-photo-2.jpg" },
        { "_key": "p2", "url": "https://lien-photo-3.jpg" }
      ],
      "tags": ["Yoga", "Voyage", "Cuisine"],
      "verifie": { "photo": true, "email": true, "telephone": false, "premium": false },
      "online": true,
      "vedette": false,
      "membreDepuis": "jan. 2025",
      "derniereActivite": "1 h",
      "affiliateUrl": "https://votre-lien-affiliation.com/?ref=marie",
      "ville":     { "_type": "reference", "_ref": "ville-montreal" },
      "categorie": { "_type": "reference", "_ref": "categorie-serieux" }
    }
  ], null, 2),

  ville: JSON.stringify([
    {
      "_type": "ville",
      "_id": "ville-montreal",
      "nom": "Montréal",
      "region": "Montréal"
    }
  ], null, 2),

  categorie: JSON.stringify([
    {
      "_type": "categorie",
      "_id": "categorie-serieux",
      "nom": "Relation sérieuse",
      "emoji": "❤️",
      "description": "Pour ceux qui cherchent une relation durable et sincère."
    }
  ], null, 2),
}

// ─── IDs helpers ─────────────────────────────────────────────────────────────

const VILLES = [
  ['ville-montreal', 'Montréal'], ['ville-quebec', 'Québec'],
  ['ville-laval', 'Laval'], ['ville-longueuil', 'Longueuil'],
  ['ville-gatineau', 'Gatineau'], ['ville-sherbrooke', 'Sherbrooke'],
  ['ville-trois-rivieres', 'Trois-Rivières'], ['ville-levis', 'Lévis'],
  ['ville-saguenay', 'Saguenay'],
]
const CATS = [
  ['categorie-serieux', 'Relation sérieuse'], ['categorie-aventure', 'Aventure'],
  ['categorie-amitie', 'Amitié'], ['categorie-rencontre', 'Rencontre décontractée'],
  ['categorie-voyage', 'Voyage'], ['categorie-sport', 'Sport'],
]

// ─── Component ───────────────────────────────────────────────────────────────

export function JsonImportTool() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [docType, setDocType] = useState('profile')
  const [json, setJson] = useState('')
  const [logs, setLogs] = useState<{ msg: string; type: 'ok' | 'err' | 'warn' | 'info' }[]>([])
  const [loading, setLoading] = useState(false)
  const [showRef, setShowRef] = useState(false)

  function log(msg: string, type: 'ok' | 'err' | 'warn' | 'info' = 'info') {
    setLogs(prev => [...prev, { msg, type }])
  }

  function loadTemplate() {
    setJson(TEMPLATES[docType] || '')
    setLogs([])
  }

  function clearAll() { setJson(''); setLogs([]) }

  async function handleImport() {
    setLogs([])
    let parsed: any
    try {
      parsed = JSON.parse(json)
      if (!Array.isArray(parsed)) parsed = [parsed]
    } catch (e: any) {
      log('❌ JSON invalide : ' + e.message, 'err')
      return
    }

    setLoading(true)
    log(`📥 Import de ${parsed.length} document(s) de type "${docType}"...`, 'info')

    let ok = 0, fail = 0
    for (const raw of parsed) {
      const doc = buildDoc(raw, docType)
      try {
        await client.createOrReplace(doc)
        log(`✅ ${doc._id} — ${doc.nom || doc._id}`, 'ok')
        ok++
      } catch (e: any) {
        log(`❌ ${doc._id} — ${e.message}`, 'err')
        fail++
      }
    }

    log('', 'info')
    log(`─── Terminé : ${ok} importé(s), ${fail} erreur(s) ───`, fail ? 'warn' : 'ok')
    setLoading(false)
  }

  return (
    <div style={s.wrap}>
      <h1 style={s.h1}>📥 Import JSON</h1>
      <p style={s.sub}>Ajoutez des profils, villes ou catégories en collant du JSON directement ici.</p>

      {/* Type selector */}
      <div style={s.card}>
        <div style={s.row}>
          <div>
            <label style={s.label}>Type de document</label>
            <select style={s.select} value={docType} onChange={e => { setDocType(e.target.value); setLogs([]) }}>
              <option value="profile">👤 Profil</option>
              <option value="ville">🏙️ Ville</option>
              <option value="categorie">💝 Catégorie</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <button style={s.btnSec} onClick={loadTemplate}>📋 Charger un template</button>
            <button style={s.btnSec} onClick={() => setShowRef(!showRef)}>
              {showRef ? '🙈 Masquer' : '📖 Voir les IDs de référence'}
            </button>
          </div>
        </div>

        {showRef && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>🏙️ Villes (_ref)</div>
              {VILLES.map(([id, nom]) => (
                <div key={id} style={{ fontSize: 12, color: '#555', padding: '2px 0', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
                  <span>{nom}</span><code style={{ color: '#e11d48', fontSize: 11 }}>{id}</code>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>💝 Catégories (_ref)</div>
              {CATS.map(([id, nom]) => (
                <div key={id} style={{ fontSize: 12, color: '#555', padding: '2px 0', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
                  <span>{nom}</span><code style={{ color: '#e11d48', fontSize: 11 }}>{id}</code>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* JSON input */}
      <div style={{ marginBottom: 16 }}>
        <label style={s.label}>Collez votre JSON ici (un objet ou un tableau)</label>
        <div style={s.tip}>
          💡 Le JSON doit être un tableau <code>[ ]</code> ou un objet <code>{'{ }'}</code>. Vous pouvez importer 1 ou 100 documents à la fois.
        </div>
        <textarea
          style={s.ta}
          value={json}
          onChange={e => setJson(e.target.value)}
          placeholder={`Collez votre JSON ici...\n\nExemple :\n[\n  {\n    "_id": "profile-sophie-montreal-001",\n    "nom": "Sophie",\n    "age": 28,\n    ...\n  }\n]`}
          spellCheck={false}
        />
      </div>

      {/* Actions */}
      <div style={{ ...s.row, marginBottom: 24 }}>
        <button
          style={loading || !json.trim() ? s.btnDis : s.btn}
          onClick={handleImport}
          disabled={loading || !json.trim()}
        >
          {loading ? '⏳ Import en cours...' : '🚀 Importer dans Sanity'}
        </button>
        <button style={s.btnSec} onClick={clearAll}>🗑️ Effacer</button>
      </div>

      {/* Logs */}
      {logs.length > 0 && (
        <div>
          <label style={s.label}>Journal d'import</label>
          <div style={s.log}>
            {logs.map((l, i) => (
              <div key={i} style={l.type !== 'info' ? s[l.type] : {}}>{l.msg || '\u00A0'}</div>
            ))}
            {loading && <div style={{ color: '#94a3b8' }}>⏳ En cours...</div>}
          </div>
        </div>
      )}
    </div>
  )
}
