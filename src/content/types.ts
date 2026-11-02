export type Stat = {
  label: string
  value: string
  /**
   * Variant qualifier shown beside the figure, e.g. "e:HEV (Strong Hybrid)".
   * Honda quotes headline mileage and torque for a specific variant; printing
   * the number without this qualifier would be misleading.
   */
  note?: string
}

export type Feature = { title: string; image: string }

export type Offer = {
  benefitsUpto: string
  validTill: string
  validTillISO: string
  terms: string[]
}

export type Model = {
  slug: string
  name: string
  /** How Honda names it in their own lineup, e.g. "All New ZR-V". */
  displayName: string
  /** Exact string POSTed as the `model` field to /home/save_lead. */
  leadModelValue: string
  metaTitle: string
  metaDescription: string
  priceLabel: string
  price: string
  tagline: string
  heroImage: string
  /** Studio render on white, as used in Honda's homepage lineup grid. */
  lineupImage: string
  /** Same render with transparency, so it can sit on a dark background. */
  renderImage: string
  stats: Stat[]
  features: Feature[]
  sensing: string[]
  offer: Offer | null
}
