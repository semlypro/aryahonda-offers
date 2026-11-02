import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { models } from '../content/models'

const ZIP = join(process.cwd(), 'offers-upload.zip')

/**
 * The deployable artifact is the zip, not out/. A stale zip next to a fresh
 * out/ is the one mistake that ships broken pages while the suite is green.
 */
describe('deployable archive', () => {
  it('exists', () => {
    expect(existsSync(ZIP), 'run `npm run package`').toBe(true)
  })

  it('has model pages at the archive root, not nested under out/', () => {
    const list = execSync(`unzip -Z1 ${JSON.stringify(ZIP)}`).toString()
    expect(list).not.toMatch(/^out\//m)
    for (const m of models) {
      expect(list, m.slug).toMatch(new RegExp(`^${m.slug}/index\\.html$`, 'm'))
      expect(list, `${m.slug} thank-you`).toMatch(
        new RegExp(`^${m.slug}/thank-you/index\\.html$`, 'm'),
      )
    }
  })

  // Without it the folder depends on the server's DirectoryIndex listing
  // index.html, and /offers/ could 404 or show a file listing.
  it('ships the .htaccess that guarantees DirectoryIndex', () => {
    const list = execSync(`unzip -Z1 ${JSON.stringify(ZIP)}`).toString()
    expect(list).toMatch(/^\.htaccess$/m)
    const htaccess = execSync(`unzip -p ${JSON.stringify(ZIP)} .htaccess`).toString()
    expect(htaccess).toContain('DirectoryIndex index.html')
  })

  it('ships basePath-prefixed images, not root-relative ones', () => {
    for (const m of models) {
      const html = execSync(
        `unzip -p ${JSON.stringify(ZIP)} ${JSON.stringify(`${m.slug}/index.html`)}`,
      ).toString()
      expect(html, `${m.slug} zip has unprefixed image`).not.toMatch(/"\/images\//)
      expect(html, `${m.slug} zip missing /offers/images/`).toContain('/offers/images/')
    }
  })

  it('is not stale — matches the current build output', () => {
    for (const m of models) {
      const fromZip = execSync(
        `unzip -p ${JSON.stringify(ZIP)} ${JSON.stringify(`${m.slug}/index.html`)}`,
      ).toString()
      const fromOut = readFileSync(join(process.cwd(), 'out', m.slug, 'index.html'), 'utf8')
      expect(fromZip, `${m.slug}: offers-upload.zip is stale — re-run \`npm run package\``)
        .toBe(fromOut)
    }
  })
})
