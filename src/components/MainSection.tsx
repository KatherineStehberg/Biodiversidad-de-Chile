import Link from 'next/link'
import Image from 'next/image'
import { FiArrowRight } from 'react-icons/fi'

const sections = [
  {
    image: '/assets/category/MarketplaceVerde.png',
    alt: 'Marketplace Verde',
    title: 'Marketplace Verde',
    description: 'Compra y vende productos ecológicos en un solo lugar.',
    href: '/marketplace',
    badge: 'Marketplace',
    accent: 'from-green-600/80 to-emerald-700/80',
  },
  {
    image: '/assets/category/RedDeConsultores.png',
    alt: 'Red de Consultores',
    title: 'Red de Consultores',
    description: 'Encuentra profesionales del área ambiental y publica tus proyectos.',
    href: '/consultores',
    badge: 'Consultores',
    accent: 'from-teal-600/80 to-green-700/80',
  },
  {
    image: '/assets/category/EducacionAmbiental.png',
    alt: 'Educación Ambiental',
    title: 'Educación Ambiental',
    description: 'Aprende, enseña y comparte conocimientos sobre sostenibilidad.',
    href: '/educacion',
    badge: 'Educación',
    accent: 'from-emerald-600/80 to-teal-700/80',
  },
  {
    image: '/assets/category/CampannasDeApoyo.png',
    alt: 'Campañas de Apoyo',
    title: 'Campañas de Apoyo',
    description: 'Contribuye con proyectos verdes y causas ambientales.',
    href: '/campanas',
    badge: 'Campañas',
    accent: 'from-green-700/80 to-emerald-600/80',
  },
]

const MainSection = () => {
  return (
    <section className="bg-neutral-950 px-4 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Section header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Todo el ecosistema{' '}
            <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
              ambiental
            </span>
          </h2>
          <p className="mt-2 text-gray-500 text-sm">
            Plataforma integrada de sostenibilidad, consultoría y tecnología verde
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 transition-all duration-300 hover:border-neutral-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30"
            >
              {/* Image */}
              <div className="relative h-52 bg-neutral-900 overflow-hidden">
                <Image
                  src={section.image}
                  alt={section.alt}
                  fill
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${section.accent} opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
              </div>

              {/* Content */}
              <div className="p-4 flex items-center justify-between border-t border-neutral-800">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-green-500/70 mb-1 block">
                    {section.badge}
                  </span>
                  <h3 className="text-base font-semibold text-white group-hover:text-green-300 transition-colors duration-200">
                    {section.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500 leading-snug">{section.description}</p>
                </div>
                <FiArrowRight
                  className="ml-4 shrink-0 text-gray-600 transition-all duration-300 group-hover:text-green-400 group-hover:translate-x-1"
                  size={18}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Technology CTA strip */}
        <Link
          href="/tecnologia"
          className="group mt-4 flex items-center justify-between rounded-2xl border border-blue-800/30 bg-gradient-to-r from-blue-950/50 to-neutral-900/50 px-6 py-4 transition-all duration-300 hover:border-blue-700/50 hover:from-blue-950/70"
        >
          <div className="flex items-center gap-4">
            <div className="shrink-0 rounded-xl bg-white p-1.5 shadow-md shadow-black/20">
              <Image
                src="/assets/partnerships/aleph-server-logo.svg"
                alt="Aleph Server"
                width={92}
                height={92}
                className="h-7 w-7 object-cover object-left"
              />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-400/70">
                Alianza con Aleph Server
              </span>
              <p className="text-sm font-semibold text-white group-hover:text-blue-200 transition-colors duration-200">
                Tecnología para la Sostenibilidad →
              </p>
              <p className="text-xs text-gray-600">
                APIs ambientales · IA · Dashboards ESG · Automatización
              </p>
            </div>
          </div>
          <FiArrowRight
            className="shrink-0 text-blue-500 transition-transform duration-300 group-hover:translate-x-1"
            size={20}
          />
        </Link>
      </div>
    </section>
  )
}

export default MainSection
