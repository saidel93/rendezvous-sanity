const { execSync } = require('child_process')
const path = require('path')

const dataDir = path.join(__dirname, '../data')

const files = [
  { file: 'villes.json',     label: '🏙️  Villes' },
  { file: 'categories.json', label: '💝 Catégories' },
  { file: 'profiles.json',   label: '👤 Profils (36)' },
]

console.log('\n📥 Import des données dans Sanity...\n')

for (const { file, label } of files) {
  const filePath = path.join(dataDir, file)
  console.log(`  Importing ${label}...`)
  try {
    execSync(`npx sanity dataset import ${filePath} production --replace`, { stdio: 'inherit' })
    console.log(`  ✅ ${label} importé\n`)
  } catch (e) {
    console.error(`  ❌ Erreur avec ${file}`)
  }
}

console.log('✅ Import complet!\n')
