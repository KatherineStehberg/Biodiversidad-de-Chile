import Image from 'next/image'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

interface ContentCardProps {
  image: string
  alt: string
  title: string
  description: string
  link: string
}

const ContentCard = ({ image, alt, title, description, link }: ContentCardProps) => {
  return (
    <article className="group rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden transition-all duration-300 hover:border-neutral-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="rounded-full bg-green-600/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">Noticia</span>
          <span className="rounded-full bg-neutral-900/80 backdrop-blur-sm border border-neutral-700 px-3 py-1 text-xs font-semibold text-gray-300">Medioambiente</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-white group-hover:text-green-300 transition-colors duration-200 leading-snug mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-3 leading-relaxed line-clamp-2">{description}</p>
        <Link
          href={link}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-green-400 hover:text-green-300 transition-colors duration-200"
        >
          Leer más
          <FiArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}

export default ContentCard
