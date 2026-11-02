/**
 * Single source of truth for the deployment sub-path. Imported by
 * next.config.ts so the config and the markup can never disagree.
 *
 * Next's basePath rewrites its own asset URLs, next/image and next/link —
 * but NOT raw <img src> or <form action>. Anything hand-written goes
 * through asset() or url().
 *
 * NOTE: Empty string for subdomain deployment (offers.aryahonda.com)
 * Previously was '/offers' for subpath deployment (aryahonda.com/offers/)
 */
export const BASE_PATH = ''

/** Prefix a file in public/ — e.g. '/images/city-hero.jpg'. */
export const asset = (path: string) => `${BASE_PATH}${path}`

/** Prefix an in-site route — e.g. '/honda-city/'. */
export const url = (path: string) => `${BASE_PATH}${path}`

/**
 * Origin this site is served from. Empty by default so a local or e2e build
 * stays relative and cannot reach production; the deploy sets it.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? ''

/**
 * Absolute form of url(). Needed wherever a URL leaves this origin and comes
 * back: canonicals, and the `url` field save_lead redirects to after posting
 * to aryahonda.com — a relative value there would resolve against that host.
 */
export const absoluteUrl = (path: string) => `${SITE_URL}${url(path)}`
