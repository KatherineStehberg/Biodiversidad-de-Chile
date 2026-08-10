import type { MetadataRoute } from 'next'

const siteUrl = 'https://consultores.biodiversidad.cl'

const publicRoutes = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/consultores', changeFrequency: 'daily', priority: 0.9 },
  { path: '/landing', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/educacion', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/marketplace', changeFrequency: 'daily', priority: 0.8 },
  { path: '/campanas', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/membresias', changeFrequency: 'monthly', priority: 0.6 },
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path}`,
    changeFrequency,
    priority,
  }))
}
