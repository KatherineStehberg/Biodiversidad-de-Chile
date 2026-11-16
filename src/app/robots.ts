import type { MetadataRoute } from 'next'

import { PORTAL_URL as siteUrl } from '@/lib/utils'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard',
        '/forgot-password',
        '/login',
        '/membresias/pago/',
        '/mis-publicaciones',
        '/perfil/',
        '/registro',
        '/reset-password',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
