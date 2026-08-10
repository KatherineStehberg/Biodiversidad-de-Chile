import type { MetadataRoute } from 'next'

const siteUrl = 'https://consultores.biodiversidad.cl'

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
