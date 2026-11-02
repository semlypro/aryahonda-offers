/**
 * Arya Honda's own details. The showroom entries are reproduced exactly as
 * the client supplied them — do not paraphrase the addresses, re-case the
 * email, or add contact names.
 */

export const DEALER = {
  name: 'Arya Honda',
  tagline: 'Authorised Honda dealership in Mumbai since 2005',
  since: 2005,
  /** Google Tag Manager container used across aryahonda.com. */
  gtmId: 'GTM-MLNTG8PF',
  /** The Honda + Arya Honda lockup used in the header on aryahonda.com. */
  logo: '/brand/arya-honda-logo.png', // outside /images, which fetch-images.mjs may wipe
  /** Number shown in the page header. */
  phone: '9167199829',
  phoneHref: '+919167199829',
} as const

export type Showroom = {
  name: string
  email: string
  address: string
  phone: string
  /** E.164, for tel: links. */
  phoneHref: string
}

export const SHOWROOMS: Showroom[] = [
  {
    name: 'Arya Honda Prabhadevi',
    email: 'Marketing@Aryahonda.Com',
    address:
      'Madhukunj, Sayani Marg, Prabhadevi, Mumbai 400025 (Landmark: Next to Ravindra Natya Mandir)',
    phone: '9167108475',
    phoneHref: '+919167108475',
  },
  {
    name: 'Arya Honda Bhandup',
    email: 'Marketing@Aryahonda.Com',
    address:
      'No 99/100 LBS Marg, Bhandup West Near ST Xaviers High School, Mumbai, Maharashtra 400078',
    phone: '9167199829',
    phoneHref: '+919167199829',
  },
]

export const SHOWROOMS_HEADING = 'Honda Car Showrooms in Mumbai'
