import { execSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'

if (!existsSync('out')) {
  console.error('No out/ directory. Run `npm run build` first.')
  process.exit(1)
}

rmSync('offers-upload.zip', { force: true })
// Zip from inside out/ so the archive root is honda-city/, honda-amaze/, ...
// If it were zipped from the parent, extracting on cPanel would produce
// public_html/offers/out/... and every URL would 404.
// Exclude macOS junk only — .htaccess must ship.
execSync(
  'cd out && zip -rq ../offers-upload.zip . -x ".DS_Store" -x "._*" -x "__MACOSX/*"',
  { stdio: 'inherit' },
)
console.log('Created offers-upload.zip — extract its CONTENTS into public_html/offers/')
