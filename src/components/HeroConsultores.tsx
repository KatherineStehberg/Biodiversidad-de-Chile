'use client'

interface Filters {
  specialty: string
  modality: string
}

interface Props {
  filters?: Filters
  onFilterChange?: (f: Filters) => void
}

const SPECIALTIES = ['Impacto Ambiental', 'Educación', 'Normativa', 'Biodiversidad', 'Residuos']
const MODALITIES = [
  { value: 'presencial', label: 'Presencial' },
  { value: 'remoto', label: 'Online' },
]

export default function HeroConsultores({ filters, onFilterChange }: Props) {
  const current: Filters = filters ?? { specialty: '', modality: '' }

  function update(key: keyof Filters, value: string) {
    const next = { ...current, [key]: current[key] === value ? '' : value }
    onFilterChange?.(next)
  }

  const hasFilters = current.specialty || current.modality

  return (
    <section className="relative min-h-[460px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('/assets/hero/hero-consultores.jpg')] bg-cover bg-center opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/40 via-neutral-950/30 to-neutral-950" />
      <div className="absolute top-16 left-1/3 h-64 w-64 rounded-full bg-teal-600/10 blur-[90px]" />
      <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-green-500/8 blur-[70px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-green-800/40 bg-green-900/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-400 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          Red de Consultores
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
          Encuentra al{' '}
          <span className="bg-gradient-to-r from-green-400 to-teal-300 bg-clip-text text-transparent">
            consultor ideal
          </span>
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Profesionales ambientales verificados para proyectos, estudios técnicos y asesoría normativa
        </p>

        {/* Especialidad */}
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Especialidad</p>
          <div className="flex flex-wrap justify-center gap-2">
            {SPECIALTIES.map(s => (
              <button
                key={s}
                onClick={() => update('specialty', s)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                  current.specialty === s
                    ? 'bg-green-600 text-white'
                    : 'border border-neutral-700 bg-neutral-900/80 backdrop-blur-sm text-gray-300 hover:border-green-700 hover:text-green-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Modalidad */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Modalidad</p>
          <div className="flex justify-center gap-2">
            {MODALITIES.map(m => (
              <button
                key={m.value}
                onClick={() => update('modality', m.value)}
                className={`rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  current.modality === m.value
                    ? 'bg-green-600 text-white'
                    : 'border border-neutral-700 bg-neutral-900/80 backdrop-blur-sm text-gray-300 hover:border-green-700 hover:text-green-300'
                }`}
              >
                {m.label}
              </button>
            ))}
            {hasFilters && (
              <button
                onClick={() => onFilterChange?.({ specialty: '', modality: '' })}
                className="rounded-full px-4 py-1.5 text-sm text-gray-500 hover:text-white border border-neutral-700 bg-neutral-900/80 transition-all duration-200"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
