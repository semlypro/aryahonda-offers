/**
 * Single source of truth for the deployment sub-path. Imported by
 * next.config.ts so the config and the markup can never disagree.
 *
 * Next's basePath rewrites its own asset URLs, next/image and next/link —
 * but NOT raw <img src> or <form action>. Anything hand-written goes
 * through asset() or url().
 */
export const BASE_PATH = '/offers'

/** Prefix a file in public/ — e.g. '/images/city-hero.jpg'. */
export const asset = (path: string) => `${BASE_PATH}${path}`

/** Prefix an in-site route — e.g. '/honda-city/'. */
export const url = (path: string) => `${BASE_PATH}${path}`
