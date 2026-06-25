import { FiMapPin, FiDollarSign, FiMail, FiTag } from 'react-icons/fi'

interface OfferCardProps {
  title: string
  description?: string
  location?: { country?: string; city?: string }
  salaryMin?: number
  salaryMax?: number
  contact?: string
  tags?: string[]
}

export default function OfferCard({ title, description, location, salaryMin, salaryMax, contact, tags }: OfferCardProps) {
  const locationText = [location?.city, location?.country].filter(Boolean).join(', ')
  const salaryText = salaryMin
    ? `${salaryMin.toLocaleString('es-CL')}${salaryMax ? ` – ${salaryMax.toLocaleString('es-CL')}` : ''} CLP`
    : null

  return (
    <div className="group rounded-2xl border border-neutral-800 bg-neutral-900 p-5 transition-all duration-300 hover:border-neutral-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">
      <h4 className="text-base font-semibold text-white group-hover:text-green-300 transition-colors duration-200 leading-snug">{title}</h4>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-green-900/20 border border-green-800/30 px-2.5 py-0.5 text-xs font-medium text-green-400">
              <FiTag size={10} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {description && (
        <p className="text-sm text-gray-400 mt-3 line-clamp-3 leading-relaxed">{description}</p>
      )}

      <div className="mt-4 space-y-1.5">
        {locationText && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiMapPin size={12} className="text-gray-600 shrink-0" />
            {locationText}
          </div>
        )}
        {salaryText ? (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiDollarSign size={12} className="text-gray-600 shrink-0" />
            {salaryText}
          </div>
        ) : (
          <div className="text-xs text-gray-600">Salario a convenir</div>
        )}
      </div>

      {contact && (
        <div className="mt-4 pt-4 border-t border-neutral-800">
          <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600/15 border border-green-800/30 px-4 py-2 text-sm font-semibold text-green-400 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-200">
            <FiMail size={14} />
            Contactar
          </button>
        </div>
      )}
    </div>
  )
}
