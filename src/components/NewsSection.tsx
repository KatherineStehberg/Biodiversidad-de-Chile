import Image from 'next/image'
import Link from 'next/link'
import { getWordPressPosts, WPPost } from '@/lib/wordpress'

function PostCard({ post }: { post: WPPost }) {
  const dateLabel = new Date(post.date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="relative w-full h-48 bg-gray-200">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-50">
            <span className="text-green-400 text-4xl">🌿</span>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {post.category}
        </span>
      </div>
      <div className="p-6">
        <p className="text-xs text-gray-400 mb-1">{dateLabel}</p>
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        <Link
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300 text-sm"
        >
          Leer artículo
        </Link>
      </div>
    </article>
  )
}

export default async function NewsSection() {
  const posts = await getWordPressPosts(6)

  const left = posts.slice(0, Math.ceil(posts.length / 2))
  const right = posts.slice(Math.ceil(posts.length / 2))

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Noticias y Blog</h2>
          <p className="text-gray-500 text-sm">
            Contenido actualizado desde{' '}
            <a
              href="https://biodiversidad.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              biodiversidad.cl
            </a>
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-400">No hay publicaciones disponibles por ahora.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              {left.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <div className="space-y-8">
              {right.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
