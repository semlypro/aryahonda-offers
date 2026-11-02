import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { models } from '../content/models'

const out = (slug: string) => join(process.cwd(), 'out', slug, 'index.html')
const read = (slug: string) => readFileSync(out(slug), 'utf8')

describe('built pages', () => {
  it('emits a page for every model', () => {
    for (const m of models) {
      expect(existsSync(out(m.slug)), m.slug).toBe(true)
    }
  })

  it('shows the offer block only where an offer exists', () => {
    expect(read('honda-city')).toContain('1 70 900')
    expect(read('honda-amaze')).toContain('66 800')
    expect(read('honda-zrv')).not.toContain('data-testid="offer-block"')
    expect(read('honda-elevate')).not.toContain('data-testid="offer-block"')
  })

  it('reproduces Honda terms wherever an offer is shown', () => {
    expect(read('honda-city')).toContain('All Offers valid till 31st October 2026')
  })

  it('carries an absolute https canonical without www', () => {
    for (const m of models) {
      expect(read(m.slug), m.slug).toContain(
        `href="https://aryahonda.com/offers/${m.slug}/"`,
      )
    }
  })

  it('never references hondacarindia.com in shipped output', () => {
    for (const m of models) {
      expect(read(m.slug), m.slug).not.toMatch(/hondacarindia\.com/)
    }
  })

  it('points every form at the PHP endpoint', () => {
    for (const m of models) {
      expect(read(m.slug), m.slug).toContain('action="/home/save_lead"')
    }
  })

  // basePath does not rewrite raw <img src>; without the prefix every image 404s.
  it('prefixes every image with the basePath so it actually resolves', () => {
    for (const m of models) {
      const html = read(m.slug)
      expect(html, `${m.slug} has an unprefixed image src`).not.toMatch(/src="\/images\//)
      expect(html, `${m.slug} missing /offers/images/`).toContain('src="/offers/images/')
    }
  })

  // Ads Quality Score: the hero is a CSS background and is preloaded; every
  // <img> on a model page is below the fold, so all of them must be lazy.
  it('lazy-loads every below-fold image and preloads only the hero', () => {
    for (const m of models) {
      const html = read(m.slug)
      const imgs = (html.match(/<img/g) ?? []).length
      const lazy = (html.match(/loading="lazy"/g) ?? []).length
      expect(imgs, `${m.slug} has no images`).toBeGreaterThan(0)
      // The header logo is the only image above the fold.
      expect(lazy, `${m.slug}: ${imgs} images but only ${lazy} lazy`).toBe(imgs - 1)

      expect(html, `${m.slug} hero not preloaded`).toMatch(
        new RegExp(`rel="preload"[^>]*href="/offers${m.heroImage}"`),
      )
      expect(html, `${m.slug} hero background missing`).toContain(
        `url(/offers${m.heroImage})`,
      )
    }
  })

  it('renders the variant qualifier next to headline figures', () => {
    const city = read('honda-city')
    expect(city).toContain('27.26')
    expect(city).toContain('e:HEV (Strong Hybrid)')
  })
})

describe('Arya Honda branding', () => {
  const pages = [
    'index.html',
    ...models.map((m) => `${m.slug}/index.html`),
    ...models.map((m) => `${m.slug}/thank-you/index.html`),
    'thank-you/index.html',
  ]

  // Client rule: these are Arya Honda's pages, not a generic Honda microsite.
  it('names Arya Honda on every page', () => {
    for (const rel of pages) {
      const html = readFileSync(join(process.cwd(), 'out', rel), 'utf8')
      expect(html, rel).toContain('Arya Honda')
    }
  })

  it('gives every page a callable Arya Honda number', () => {
    for (const rel of pages) {
      const html = readFileSync(join(process.cwd(), 'out', rel), 'utf8')
      expect(html, rel).toMatch(/href="tel:\+91\d{10}"/)
    }
  })

  // Client rule: never send the visitor to "your nearest dealer" — the
  // nearest dealer is meant to be Arya Honda.
  it('never says nearest dealer', () => {
    for (const rel of pages) {
      const html = readFileSync(join(process.cwd(), 'out', rel), 'utf8')
      expect(html.toLowerCase(), rel).not.toContain('nearest dealer')
    }
  })

  it('shows the Arya Honda logo, not a text wordmark', () => {
    for (const rel of pages) {
      const html = readFileSync(join(process.cwd(), 'out', rel), 'utf8')
      expect(html, rel).toContain('/offers/brand/arya-honda-logo.png')
    }
  })

  it('shows 9167199829 in the header', () => {
    for (const rel of pages) {
      const html = readFileSync(join(process.cwd(), 'out', rel), 'utf8')
      expect(html, rel).toContain('tel:+919167199829')
      expect(html, rel).toContain('Call 9167199829')
    }
  })

  // Client rule: list the showrooms, never an individual's name.
  it('names no individual contact', () => {
    for (const rel of pages) {
      const html = readFileSync(join(process.cwd(), 'out', rel), 'utf8')
      for (const n of ['Pravin', 'Shetty', 'Ajinkya', 'Pasilkar', 'Sunitha', 'Faizan']) {
        expect(html, `${rel} mentions ${n}`).not.toContain(n)
      }
    }
  })

  it('reproduces the supplied showroom details exactly', () => {
    const html = readFileSync(join(process.cwd(), 'out', 'index.html'), 'utf8')
    expect(html).toContain('Honda Car Showrooms in Mumbai')
    expect(html).toContain(
      'Madhukunj, Sayani Marg, Prabhadevi, Mumbai 400025 (Landmark: Next to Ravindra Natya Mandir)',
    )
    expect(html).toContain(
      'No 99/100 LBS Marg, Bhandup West Near ST Xaviers High School, Mumbai, Maharashtra 400078',
    )
    expect(html).toContain('Marketing@Aryahonda.Com')
    expect(html).toContain('tel:+919167108475')
  })

  it('loads Google Tag Manager on every page', () => {
    for (const rel of pages) {
      const html = readFileSync(join(process.cwd(), 'out', rel), 'utf8')
      expect(html, rel).toContain('GTM-MLNTG8PF')
      expect(html, rel).toContain('googletagmanager.com/ns.html')
    }
  })

  it('puts a transparent car render in each page CTA', () => {
    for (const m of models) {
      const html = read(m.slug)
      // PNG, not the white-flattened lineup JPEG: it sits on the dark hero.
      expect(html, m.slug).toContain(`/offers${m.renderImage}`)
      expect(m.renderImage, m.slug).toMatch(/\.png$/)
    }
  })

  it('shows the other three models on every model page', () => {
    for (const m of models) {
      const html = read(m.slug)
      const others = models.filter((o) => o.slug !== m.slug)
      expect(html, m.slug).toContain('Other Honda models at Arya Honda')
      for (const o of others) {
        expect(html, `${m.slug} should link to ${o.slug}`).toContain(
          `href="/offers/${o.slug}/"`,
        )
      }
      // and must not link to itself in that band
      expect(html, `${m.slug} links to itself`).not.toContain(`href="/offers/${m.slug}/"`)
    }
  })

  it('gives the other-models band its own call to action', () => {
    for (const m of models) {
      const html = read(m.slug)
      expect(html, m.slug).toContain('Request a callback')
      expect(html, m.slug).toContain('href="#enquire"')
    }
  })

  it('shows the Honda lineup renders on the index', () => {
    const html = readFileSync(join(process.cwd(), 'out', 'index.html'), 'utf8')
    for (const m of models) {
      expect(html, m.slug).toContain(`/offers${m.lineupImage}`)
    }
  })
})

describe('thank-you pages', () => {
  it('exists at exactly the path the form redirects to', () => {
    for (const m of models) {
      const p = join(process.cwd(), 'out', m.slug, 'thank-you', 'index.html')
      expect(existsSync(p), `${m.slug} thank-you`).toBe(true)
    }
  })

  it('is excluded from search indexing', () => {
    const html = readFileSync(
      join(process.cwd(), 'out', 'honda-city', 'thank-you', 'index.html'),
      'utf8',
    )
    expect(html).toMatch(/noindex/)
  })
})
