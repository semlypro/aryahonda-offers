import type { NextConfig } from 'next'
import { BASE_PATH } from './src/lib/paths'

const nextConfig: NextConfig = {
  // Full Next.js deployment with Node.js runtime (not static export)
  // Deployed to subdomain: offers.aryahonda.com
  basePath: BASE_PATH,
  trailingSlash: true,
  // Enable image optimization for production
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
