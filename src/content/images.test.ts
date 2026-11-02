import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { models } from './models'

const PUBLIC = join(process.cwd(), 'public')

describe('imagery', () => {
  it('has every referenced image present on disk', () => {
    const missing: string[] = []
    for (const m of models) {
      for (const path of [m.heroImage, ...m.features.map((f) => f.image)]) {
        if (!existsSync(join(PUBLIC, path))) missing.push(`${m.slug}: ${path}`)
      }
    }
    expect(missing, `missing image files:\n${missing.join('\n')}`).toEqual([])
  })

  it('references only local paths, never hondacarindia.com', () => {
    for (const m of models) {
      for (const path of [m.heroImage, ...m.features.map((f) => f.image)]) {
        expect(path, m.slug).not.toMatch(/hondacarindia|^https?:/)
      }
    }
  })
})
