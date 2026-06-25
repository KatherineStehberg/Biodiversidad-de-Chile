const WP_API = 'https://biodiversidad.cl/wp-json/wp/v2'

export interface WPPost {
  id: number
  title: string
  excerpt: string
  link: string
  date: string
  image: string | null
  category: string
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8230;/g, '...')
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8216;|&#8217;/g, "'")
    .trim()
}

function truncate(text: string, max = 130): string {
  if (text.length <= max) return text
  return text.slice(0, max).replace(/\s+\S*$/, '') + '...'
}

export async function getWordPressPosts(count = 6): Promise<WPPost[]> {
  try {
    const res = await fetch(
      `${WP_API}/posts?per_page=${count}&_embed&orderby=date&order=desc`,
      {
        next: {
          revalidate: 86400, // 24 hours
          tags: ['biodiversidad-posts'],
        },
      }
    )

    if (!res.ok) return fallbackPosts

    const raw = await res.json()

    return raw.map((post: any) => {
      const media = post._embedded?.['wp:featuredmedia']
      const image: string | null = media?.[0]?.source_url ?? null

      const categories = post._embedded?.['wp:term']?.[0] ?? []
      const category: string = categories[0]?.name ?? 'Blog'

      return {
        id: post.id,
        title: stripHtml(post.title?.rendered ?? ''),
        excerpt: truncate(stripHtml(post.excerpt?.rendered ?? '')),
        link: post.link,
        date: post.date,
        image,
        category,
      }
    })
  } catch {
    return fallbackPosts
  }
}

const fallbackPosts: WPPost[] = [
  {
    id: 1,
    title: 'Gestionando el fuego',
    excerpt: 'Análisis crítico sobre la gestión ambiental en Chile frente a la crisis de los incendios forestales.',
    link: 'https://biodiversidad.cl/gestionando-el-fuego/',
    date: '2024-01-01T00:00:00',
    image: null,
    category: 'Blog',
  },
  {
    id: 2,
    title: 'Reforestación en la Patagonia',
    excerpt: 'Iniciativa para plantar 1 millón de árboles nativos en la región de Aysén.',
    link: 'https://biodiversidad.cl/',
    date: '2024-01-01T00:00:00',
    image: 'https://images.unsplash.com/photo-1643730484055-abc29f2de73c?q=80&w=1171',
    category: 'Noticias',
  },
]
