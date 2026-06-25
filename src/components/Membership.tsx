'use client'

import Link from 'next/link'
import { HiCheck, HiX } from 'react-icons/hi'
import { LuSprout, LuTrees } from 'react-icons/lu'

type Feature = { label: string; available: boolean }
type Plan = {
  id: string
  title: string
  subtitle?: string
  price: string
  period: string
  cta: string
  highlight?: boolean
  icon?: 'seed' | 'sprout' | 'forest'
  features: Feature[]
}

const plans: Plan[] = [
  {
    id: 'semilla',
    title: 'Semilla',
    subtitle: 'Para entusiastas que comienzan su viaje.',
    price: 'Gratis',
    period: '/siempre',
    cta: 'Empezar Ahora',
    icon: 'seed',
    features: [
      { label: 'Acceso a mapas de distribución básicos', available: true },
      { label: 'Boletín mensual de descubrimientos', available: true },
      { label: 'Acceso a la comunidad pública', available: false },
      { label: 'Sin acceso a datos crudos', available: false },
    ],
  },
  {
    id: 'brote',
    title: 'Brote',
    subtitle: 'Herramientas avanzadas para colaboradores activos.',
    price: '$5.700',
    period: '/mes',
    cta: 'Seleccionar Brote',
    highlight: true,
    icon: 'sprout',
    features: [
      { label: 'Todo lo incluido en Semilla', available: true },
      { label: 'Descarga de datos avanzados (CSV/JSON)', available: true },
      { label: 'Navegación sin publicidad', available: true },
      { label: 'Insignia de colaborador verificada', available: true },
      { label: 'Soporte técnico prioritario', available: true },
    ],
  },
  {
    id: 'bosque',
    title: 'Bosque',
    subtitle: 'Para organizaciones y patrocinadores serios.',
    price: '$10.000',
    period: '/mes',
    cta: 'Contribuir',
    icon: 'forest',
    features: [
      { label: 'Acceso completo a API REST', available: true },
      { label: 'Reportes de impacto exclusivos', available: true },
      { label: 'Contacto directo con investigadores', available: true },
      { label: 'Menciones en publicaciones anuales', available: true },
      { label: 'Licencia para uso comercial de datos', available: true },
    ],
  },
]

function PlanIcon({ type }: { type?: 'seed' | 'sprout' | 'forest' }) {
  if (type === 'forest') return <LuTrees className="text-green-400" size={18} />
  return <LuSprout className="text-green-400" size={18} />
}

function Membership() {
  return (
    <section className="py-20 bg-neutral-950">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-800/40 bg-green-900/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-400 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Membresías
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Elige tu impacto en la{' '}
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              biodiversidad
            </span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Desde estudiantes curiosos hasta grandes instituciones, tenemos un plan para potenciar tu contribución.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map(p => (
            <div
              key={p.id}
              className={`relative rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 ${
                p.highlight
                  ? 'border-green-600/60 bg-neutral-900 shadow-lg shadow-green-900/10'
                  : 'border-neutral-800 bg-neutral-900'
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-green-600 px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-green-900/40">
                    Recomendado
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2.5 mb-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-900/30 border border-green-800/30">
                  <PlanIcon type={p.icon} />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest text-white">{p.title}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1 mb-4">{p.subtitle}</div>

              <div className="flex items-baseline gap-1.5 mb-5">
                <span className="text-4xl font-extrabold text-white">{p.price}</span>
                <span className="text-sm text-gray-500">{p.period}</span>
              </div>

              <Link
                href="/membresias"
                className={`block w-full text-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  p.highlight
                    ? 'bg-green-600 hover:bg-green-500 text-white'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-gray-200 border border-neutral-700'
                }`}
              >
                {p.cta}
              </Link>

              <ul className="mt-6 space-y-3">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {f.available ? (
                      <div className="shrink-0 w-5 h-5 rounded-full bg-green-600/20 border border-green-600/30 grid place-items-center">
                        <HiCheck className="text-green-400" size={12} />
                      </div>
                    ) : (
                      <div className="shrink-0 w-5 h-5 rounded-full bg-neutral-800 grid place-items-center">
                        <HiX className="text-neutral-600" size={12} />
                      </div>
                    )}
                    <span className={`text-sm ${f.available ? 'text-gray-300' : 'text-gray-600'}`}>{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Membership
