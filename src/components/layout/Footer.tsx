import Image from 'next/image'
import Link from 'next/link'

const platformLinks = [
  { label: 'Marketplace Verde', href: '/marketplace' },
  { label: 'Red de Consultores', href: '/consultores' },
  { label: 'Educación Ambiental', href: '/educacion' },
  { label: 'Campañas', href: '/campanas' },
  { label: 'Membresías', href: '/membresias' },
]

const techLinks = [
  { label: 'Tecnología para la Sostenibilidad', href: '/tecnologia' },
  { label: 'APIs Ambientales', href: '/tecnologia#servicios' },
  { label: 'Dashboards ESG', href: '/tecnologia#servicios' },
  { label: 'IA Aplicada', href: '/tecnologia#servicios' },
]

const legalLinks = [
  { label: 'Política de Privacidad', href: '/landing/privacity' },
  { label: 'Términos de Uso', href: '/landing/terms' },
  { label: 'Contacto', href: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800/60 text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">

          {/* Brand */}
          <div className="md:col-span-1">
            <Image
              src="/assets/Isotipo.png"
              alt="Biodiversidad.cl"
              width={48}
              height={48}
              className="mb-4 h-10 w-auto"
            />
            <p className="text-sm leading-relaxed text-gray-500 mb-4">
              Plataforma GreenTech para conectar personas, empresas e instituciones con la
              sostenibilidad ambiental.
            </p>
            {/* Aleph alliance mark */}
            <div className="inline-block rounded-xl bg-white px-3 py-2 shadow-md shadow-black/20">
              <Image
                src="/assets/partnerships/aleph-server-logo.svg"
                alt="Aleph Server"
                width={120}
                height={39}
                className="h-7 w-auto"
              />
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Plataforma
            </h3>
            <ul className="space-y-2.5">
              {platformLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-500 transition-colors duration-200 hover:text-green-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Tecnología
            </h3>
            <ul className="space-y-2.5">
              {techLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-500 transition-colors duration-200 hover:text-blue-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & CTA */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Legal
            </h3>
            <ul className="space-y-2.5 mb-6">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-500 transition-colors duration-200 hover:text-green-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/tecnologia"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-green-700 to-teal-700 px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:from-green-600 hover:to-teal-600"
            >
              🌿 Solicitar asesoría tech
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-neutral-800/60 pt-6 flex flex-col items-center justify-between gap-3 text-xs text-gray-600 sm:flex-row">
          <p>&copy; 2026 Biodiversidad.cl. Todos los derechos reservados.</p>
          <p>
            Desarrollo web por{' '}
            <span className="text-orange-500">Language Center Chile Tech</span>
            {' · '}
            Tech por{' '}
            <span className="text-blue-400">Aleph Server</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
