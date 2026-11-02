import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import sharp from 'sharp'
import manifest from './image-manifest.json' with { type: 'json' }

const PUBLIC = join(process.cwd(), 'public')

/**
 * Honda ships hero renders at 5833px and 6-8 MB. Shipping those on a paid ad
 * landing page would wreck load time and Quality Score, so every asset is
 * resized and re-encoded on the way in.
 */
const MAX_WIDTH = 1600
const QUALITY = 78

let failed = 0
for (const [dest, url] of Object.entries(manifest)) {
  const target = join(PUBLIC, dest)
  try {
    // Honda's paths contain spaces and ampersands; encodeURI escapes the
    // spaces and leaves an already-valid URL intact.
    const res = await fetch(encodeURI(url))
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const raw = Buffer.from(await res.arrayBuffer())
    if (raw.length === 0) throw new Error('empty response')

    const img = sharp(raw)
    const { width, height } = await img.metadata()
    if (!width || !height) throw new Error('not a decodable image')
    // A swatch chip is not a photograph; catch manifest mistakes early.
    if (width < 400) throw new Error(`suspiciously small (${width}x${height}) — wrong asset?`)

    // A .png destination keeps its alpha, so the render can sit on any
    // background. A .jpg destination is flattened onto white first, because
    // JPEG has no alpha and would otherwise composite onto black.
    const resized = img.resize({
      width: Math.min(width, MAX_WIDTH),
      withoutEnlargement: true,
    })
    const out = dest.endsWith('.png')
      ? await resized.png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer()
      : await resized
          .flatten({ background: '#ffffff' })
          .jpeg({ quality: QUALITY, mozjpeg: true })
          .toBuffer()

    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, out)
    console.log(
      `ok   ${dest.padEnd(30)} ${width}x${height} ${Math.round(raw.length / 1024)}KB ` +
      `-> ${Math.min(width, MAX_WIDTH)}px ${Math.round(out.length / 1024)}KB`,
    )
  } catch (err) {
    failed++
    console.error(`FAIL ${dest} <- ${url}: ${err.message}`)
  }
}

if (failed > 0) {
  console.error(`\n${failed} image(s) failed.`)
  process.exit(1)
}
console.log(`\nAll ${Object.keys(manifest).length} images downloaded and optimised.`)
