'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FaHome, FaUserTie, FaShoppingCart, FaBook, FaIdBadge, FaHandsHelping,
} from 'react-icons/fa'
import { FiCpu } from 'react-icons/fi'

const navItems = [
  { label: 'Inicio',      href: '/',            icon: <FaHome className="size-3.5" /> },
  { label: 'Consultores', href: '/consultores', icon: <FaUserTie className="size-3.5" /> },
  { label: 'Marketplace', href: '/marketplace', icon: <FaShoppingCart className="size-3.5" /> },
  { label: 'Educación',   href: '/educacion',   icon: <FaBook className="size-3.5" /> },
  { label: 'Campañas',    href: '/campanas',    icon: <FaHandsHelping className="size-3.5" /> },
  { label: 'Membresías',  href: '/membresias',  icon: <FaIdBadge className="size-3.5" /> },
  { label: 'Tecnología',  href: '/tecnologia',  icon: <FiCpu className="size-3.5" />, tech: true },
]

export default function NavbarLinks() {
  const pathname = usePathname()

  return (
    <ul className="flex items-center gap-0.5">
      {navItems.map((item: any) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/' && pathname.startsWith(item.href))

        if (item.tech) {
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? 'bg-gradient-to-r from-green-600/25 to-blue-600/20 text-blue-300 border-blue-600/40'
                    : 'text-blue-300 bg-blue-600/8 hover:bg-blue-600/15 border-blue-600/20 hover:border-blue-500/40'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          )
        }

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-green-600/20 text-green-400'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
