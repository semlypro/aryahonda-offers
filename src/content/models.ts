import type { Model } from './types'

const HONDA_TERMS = [
  'Offers are Variant, Grade & Location specific. Speak to Arya Honda for complete details.',
  'Additional Offers for selected Corporates for all models.',
  'All Offers valid till 31st October 2026. *T&C Apply.',
]

const SENSING_FULL = [
  'Collision Mitigation Braking System (CMBS)',
  'Adaptive Cruise Control with Low Speed Follow',
  'Lane Keeping Assist System (LKAS)',
  'Road Departure Mitigation System',
  'Auto High-Beam',
  'Lead Car Departure Notification System',
]

export const models: Model[] = [
  {
    slug: 'honda-city',
    displayName: 'New City',
    name: 'Honda City',
    leadModelValue: 'Honda City',
    metaTitle: 'Honda City Offers in Mumbai | Arya Honda',
    metaDescription:
      'Benefits up to ₹1,70,900 on the New Honda City at Arya Honda Mumbai. Book a test drive today.',
    priceLabel: 'Starts from',
    price: '₹ 11 99 900',
    tagline: 'Feel the All New Vibe',
    heroImage: '/images/city-hero.jpg',
    lineupImage: '/images/lineup-city.jpg',
    renderImage: '/images/render-city.png',
    // Verified 2026-10-10 from hondacarindia.com/honda-city.
    stats: [
      { label: 'Mileage (km/L)', value: '27.26', note: 'e:HEV (Strong Hybrid)' },
      { label: 'Max Torque (Nm)', value: '253', note: 'e:HEV (Strong Hybrid)' },
      { label: 'Fuel Tank Capacity (Litres)', value: '40' },
    ],
    features: [
      {
        title: 'Sharp Front Design with Blade-Eye Signature LED Lighting System',
        image: '/images/city-front.jpg',
      },
      { title: 'Aero-Blade Diamond Cut Alloy Wheels', image: '/images/city-alloys.jpg' },
      {
        title: 'Signature Z-Edge Wrap LED Tail Lamps with Clear Lens',
        image: '/images/city-taillamps.jpg',
      },
      { title: 'Sporty Trunk Lip Spoiler', image: '/images/city-spoiler.jpg' },
    ],
    sensing: SENSING_FULL,
    offer: {
      benefitsUpto: '₹ 1 70 900',
      validTill: '31st October 2026',
      validTillISO: '2026-10-31',
      terms: HONDA_TERMS,
    },
  },
  {
    slug: 'honda-amaze',
    displayName: 'New Amaze',
    name: 'Honda Amaze',
    leadModelValue: 'Honda Amaze',
    metaTitle: 'Honda Amaze Offers in Mumbai | Arya Honda',
    metaDescription:
      'Benefits up to ₹66,800 on the New Honda Amaze at Arya Honda Mumbai. Book a test drive today.',
    priceLabel: 'Starts from',
    price: '₹ 7 65 400',
    tagline: 'Big on comfort, big on value',
    heroImage: '/images/amaze-hero.jpg',
    lineupImage: '/images/lineup-amaze.jpg',
    renderImage: '/images/render-amaze.png',
    // Verified 2026-10-10 from hondacarindia.com/honda-amaze.
    stats: [
      { label: 'Engine Capacity', value: '1199 cc' },
      { label: 'Mileage (km/l)', value: '19.46', note: 'Petrol' },
      { label: 'Transmission (Speed)', value: '5/7MT (Manual) / CVT (Automatic)' },
    ],
    features: [
      { title: 'Bold Signature Front Grille', image: '/images/amaze-grille.jpg' },
      { title: 'Signature LED Front Lighting', image: '/images/amaze-headlamps.jpg' },
      { title: 'Honda SENSING Advanced Driver Assistance', image: '/images/amaze-sensing.jpg' },
      {
        title: 'Wireless Apple CarPlay & Android Auto',
        image: '/images/amaze-carplay.jpg',
      },
    ],
    sensing: SENSING_FULL,
    offer: {
      benefitsUpto: '₹ 66 800',
      validTill: '31st October 2026',
      validTillISO: '2026-10-31',
      terms: HONDA_TERMS,
    },
  },
  {
    slug: 'honda-elevate',
    displayName: 'New Elevate',
    name: 'Honda Elevate',
    leadModelValue: 'Honda Elevate',
    metaTitle: 'Honda Elevate in Mumbai | Price & Test Drive | Arya Honda',
    metaDescription:
      'The New Honda Elevate from ₹11,80,000 at Arya Honda Mumbai. Book a test drive today.',
    priceLabel: 'Starts from',
    price: '₹ 11 80 000',
    tagline: 'All New. All Bold.',
    heroImage: '/images/elevate-hero.jpg',
    lineupImage: '/images/lineup-elevate.jpg',
    renderImage: '/images/render-elevate.png',
    // Verified 2026-10-10 from hondacarindia.com/honda-elevate.
    stats: [
      { label: 'Engine Capacity', value: '1498 cc' },
      { label: 'Mileage (km/l)', value: '16.61', note: 'Petrol (CVT)' },
      { label: 'Transmission (Speed)', value: '6/7MT (Manual) / CVT (Automatic)' },
    ],
    features: [
      { title: 'Bold Mesh Grille', image: '/images/elevate-grille.jpg' },
      { title: 'Connected Signature LED Tail Lamps', image: '/images/elevate-taillamps.jpg' },
      {
        title: 'LED Projector Headlamps with Integrated LED DRLs & Turn Indicators',
        image: '/images/elevate-headlamps.jpg',
      },
      {
        title: 'R17 Dual-Tone Diamond-Cut Alloys with Dark Clear Finish',
        image: '/images/elevate-alloys.jpg',
      },
      { title: 'Ultra-High Ground Clearance', image: '/images/elevate-clearance.jpg' },
    ],
    sensing: SENSING_FULL.slice(0, 3),
    offer: null,
  },
  {
    slug: 'honda-zrv',
    displayName: 'All New ZR-V',
    name: 'Honda ZR-V',
    leadModelValue: 'Honda ZR-V',
    metaTitle: 'All New Honda ZR-V in Mumbai | Arya Honda',
    metaDescription:
      'The All New Honda ZR-V Sports e:HEV hybrid at ₹49,99,900. Book a test drive at Arya Honda Mumbai.',
    priceLabel: 'Priced at',
    price: '₹ 49 99 900',
    tagline: 'A Distinct Presence',
    heroImage: '/images/zrv-front.jpg',
    lineupImage: '/images/lineup-zrv.jpg',
    renderImage: '/images/render-zrv.png',
    // Verified 2026-10-10 from hondacarindia.com/honda-zrv.
    stats: [
      { label: 'Engine', value: '2L Direct Injection e:HEV' },
      { label: 'Drive Modes', value: 'ECON / NORMAL / SPORT' },
      { label: 'Alloy Wheels', value: 'R18 Diamond Cut' },
    ],
    features: [
      {
        title: 'LED Headlamps with Integrated LED DRLs & Sequential Turn Signals',
        image: '/images/zrv-headlamps.jpg',
      },
      { title: 'Sleek LED Tail Lamps', image: '/images/zrv-taillamps.jpg' },
      { title: 'Vertical Front Grille', image: '/images/zrv-grille.jpg' },
      { title: '2L Direct Injection e:HEV Engine', image: '/images/zrv-engine.jpg' },
    ],
    sensing: SENSING_FULL,
    offer: null,
  },
]

export function getModel(slug: string): Model | undefined {
  return models.find((m) => m.slug === slug)
}
