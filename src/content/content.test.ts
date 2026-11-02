import { describe, expect, it } from 'vitest'
import { LEAD_MODEL_OPTIONS } from '../components/LeadForm'
import { getModel, models } from './models'

describe('content model', () => {
  it('has exactly the four requested models', () => {
    expect(models.map((m) => m.slug).sort()).toEqual(
      ['honda-amaze', 'honda-city', 'honda-elevate', 'honda-zrv'].sort(),
    )
  })

  it('gives every model the fields a page needs', () => {
    for (const m of models) {
      expect(m.name, m.slug).toBeTruthy()
      expect(m.leadModelValue, m.slug).toBeTruthy()
      expect(m.price, m.slug).toMatch(/₹/)
      expect(m.heroImage, m.slug).toMatch(/^\/images\//)
      expect(m.stats.length, m.slug).toBeGreaterThan(0)
      expect(m.features.length, m.slug).toBeGreaterThan(0)
    }
  })

  it('allows per-model stat labels to differ', () => {
    const city = getModel('honda-city')!
    const elevate = getModel('honda-elevate')!
    expect(city.stats.map((s) => s.label)).not.toEqual(elevate.stats.map((s) => s.label))
  })

  it('carries an offer only for models Honda actually discounts', () => {
    expect(getModel('honda-city')!.offer).not.toBeNull()
    expect(getModel('honda-amaze')!.offer).not.toBeNull()
    expect(getModel('honda-zrv')!.offer).toBeNull()
    expect(getModel('honda-elevate')!.offer).toBeNull()
  })

  it('fails if any offer validTill date has already passed', () => {
    for (const m of models) {
      if (!m.offer) continue
      // Valid THROUGH that date in India, so compare against 23:59:59 IST —
      // a bare ISO date parses as UTC midnight and would expire the offer
      // 05:30 IST on its own last valid day.
      const expiresAt = new Date(`${m.offer.validTillISO}T23:59:59+05:30`)
      expect(
        expiresAt.getTime(),
        `${m.slug} offer expired on ${m.offer.validTillISO} — refresh before building`,
      ).toBeGreaterThan(Date.now())
    }
  })

  it('reproduces Honda terms verbatim on every offer', () => {
    for (const m of models) {
      if (!m.offer) continue
      expect(m.offer.terms).toContain(
        'Offers are Variant, Grade & Location specific. Speak to Arya Honda for complete details.',
      )
    }
  })

  it('qualifies every mileage and torque figure with its variant', () => {
    for (const m of models) {
      for (const s of m.stats) {
        if (!/mileage|torque/i.test(s.label)) continue
        expect(s.note, `${m.slug} → ${s.label} needs a variant qualifier`).toBeTruthy()
      }
    }
  })

  it('names each model in the dropdown exactly as its page does', () => {
    for (const m of models) {
      expect(LEAD_MODEL_OPTIONS, m.slug).toContain(m.leadModelValue)
      expect(m.leadModelValue, `${m.slug} dropdown name differs from page name`).toBe(m.name)
    }
  })

  it('returns undefined for an unknown slug', () => {
    expect(getModel('honda-civic')).toBeUndefined()
  })
})
