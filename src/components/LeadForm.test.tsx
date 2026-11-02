import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { getModel } from '../content/models'
import { LEAD_ENDPOINT, LEAD_MODEL_OPTIONS, LeadForm } from './LeadForm'

const html = (slug: string) => renderToStaticMarkup(<LeadForm model={getModel(slug)!} />)

describe('LeadForm', () => {
  it('posts to the existing PHP endpoint', () => {
    const out = html('honda-city')
    expect(out).toContain(`action="${LEAD_ENDPOINT}"`)
    expect(out).toContain('method="post"')
  })

  it('posts to save_lead on aryahonda.com, which this subdomain does not host', () => {
    expect(LEAD_ENDPOINT).toBe('https://aryahonda.com/home/save_lead')
  })

  it('sends exactly the five fields PHP reads', () => {
    const out = html('honda-amaze')
    for (const field of ['name', 'mobile', 'email', 'model', 'url']) {
      expect(out, field).toContain(`name="${field}"`)
    }
  })

  it('carries an absolute thank-you redirect back to this subdomain', () => {
    expect(html('honda-amaze')).toContain(
      'name="url" value="https://offers.aryahonda.com/honda-amaze/thank-you/"',
    )
  })

  it('offers a Select Car Model dropdown, like the main site', () => {
    const out = html('honda-city')
    expect(out).toContain('name="model"')
    expect(out).toContain('<select')
    expect(out).toContain('Select Car Model')
    for (const opt of LEAD_MODEL_OPTIONS) {
      expect(out, opt).toContain(`value="${opt}"`)
    }
  })

  it('preselects the model whose landing page this is', () => {
    expect(html('honda-city')).toMatch(/<option[^>]*value="Honda City"[^>]*selected/)
    expect(html('honda-zrv')).toMatch(/<option[^>]*value="Honda ZR-V"[^>]*selected/)
    expect(html('honda-amaze')).toMatch(/<option[^>]*value="Honda Amaze"[^>]*selected/)
  })

  it('offers exactly the models that have an offers page, in lineup order', () => {
    expect(LEAD_MODEL_OPTIONS).toEqual([
      'Honda City',
      'Honda Amaze',
      'Honda Elevate',
      'Honda ZR-V',
    ])
  })

  it('requires the three fields a usable lead needs', () => {
    const out = html('honda-city')
    expect((out.match(/required/g) ?? []).length).toBeGreaterThanOrEqual(3)
  })
})
