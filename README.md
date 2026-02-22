# RendezVous Québec — Studio Sanity

## 🚀 Démarrage en 3 étapes

### Étape 1 — Créer un projet Sanity gratuit
1. Allez sur **https://www.sanity.io** → Start for free
2. Créez un projet → copiez votre **Project ID** (ex: `abc12345`)

### Étape 2 — Mettez votre Project ID dans `sanity.config.ts`
Ligne 10 du fichier :
```ts
projectId: 'abc12345',   // ← remplacez YOUR_PROJECT_ID
```

### Étape 3 — Installez, importez et lancez
```bash
npm install
npm run import-all    # importe 9 villes + 6 catégories + 36 profils
npm run dev           # ouvre http://localhost:3333
```

---

## Ajouter des profils

### Via le Studio (manuel)
Ouvrez http://localhost:3333 → 👤 Profils → **+ Create new document**

**Photo :** collez un lien URL dans le champ "🌐 Photo principale — Lien URL"
**Ou :** uploadez depuis votre ordinateur dans "💻 Photo principale — Upload"

### Via JSON (en masse)
Ajoutez vos profils dans `data/profiles.json` puis :
```bash
npm run import-all
```

**Format JSON d'un profil :**
```json
{
  "_type": "profile",
  "_id": "profile-marie-montreal-001",
  "slug": { "_type": "slug", "current": "marie-montreal-001" },
  "nom": "Marie",
  "age": 28,
  "tagline": "Votre slogan ici",
  "bio": "Bio complète...",
  "photoUrl": "https://lien-photo.jpg",
  "photosUrls": [
    { "_key": "p1", "url": "https://photo1.jpg" },
    { "_key": "p2", "url": "https://photo2.jpg" }
  ],
  "tags": ["Yoga", "Voyage", "Cuisine"],
  "verifie": { "photo": true, "email": true, "telephone": false, "premium": false },
  "online": true,
  "vedette": false,
  "membreDepuis": "jan. 2025",
  "derniereActivite": "1 h",
  "affiliateUrl": "https://votre-lien.com/?ref=marie",
  "ville":     { "_type": "reference", "_ref": "ville-montreal" },
  "categorie": { "_type": "reference", "_ref": "categorie-serieux" }
}
```

### IDs des villes
| Ville | `_ref` |
|-------|--------|
| Montréal | `ville-montreal` |
| Québec | `ville-quebec` |
| Laval | `ville-laval` |
| Longueuil | `ville-longueuil` |
| Gatineau | `ville-gatineau` |
| Sherbrooke | `ville-sherbrooke` |
| Trois-Rivières | `ville-trois-rivieres` |
| Lévis | `ville-levis` |
| Saguenay | `ville-saguenay` |

### IDs des catégories
| Catégorie | `_ref` |
|-----------|--------|
| Relation sérieuse | `categorie-serieux` |
| Aventure et passion | `categorie-aventure` |
| Amitié et complicité | `categorie-amitie` |
| Rencontre décontractée | `categorie-rencontre` |
| Partenaire de voyage | `categorie-voyage` |
| Sport et activités | `categorie-sport` |

---

## Déployer le Studio en ligne (optionnel)
```bash
npm run deploy
# → accessible sur https://rendezvous-qc.sanity.studio
```
