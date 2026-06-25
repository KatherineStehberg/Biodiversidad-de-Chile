'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FaHome, FaUserTie, FaShoppingCart, FaBook, FaIdBadge, FaHandsHelping,
} from 'react-icons/fa'
import { FiCpu } from 'react-icons/fi'
import UserMenu from './UserMenu'

const navItems = [
  { label: 'Inicio',      href: '/',            icon: <FaHome className="size-4" /> },
  { label: 'Consultores', href: '/consultores', icon: <FaUserTie className="size-4" /> },
  { label: 'Marketplace', href: '/marketplace', icon: <FaShoppingCart className="size-4" /> },
  { label: 'Educación',   href: '/educacion',   icon: <FaBook className="size-4" /> },
  { label: 'Campañas',    href: '/campanas',    icon: <FaHandsHelping className="size-4" /> },
  { label: 'Membresías',  href: '/membresias',  icon: <FaIdBadge className="size-4" /> },
  { label: 'Tecnología',  href: '/tecnologia',  icon: <FiCpu className="size-4" />, tech: true },
]

export default function MobileMenu({ onClose }: { onClose: () => void }) {
  const pathname = usePathname()

  return (
    <div className="absolute top-full left-0 w-full bg-neutral-950/98 border-t border-neutral-800 backdrop-blur-xl text-white flex flex-col p-4 gap-1 z-40 shadow-2xl">
      {navItems.map((item: any) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/' && pathname.startsWith(item.href))

        if (item.tech) {
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                isActive
                  ? 'bg-gradient-to-r from-green-600/20 to-blue-600/15 text-blue-300 border-blue-600/30'
                  : 'text-blue-300 bg-blue-600/8 border-blue-600/20 hover:bg-blue-600/15'
              }`}
            >
              {item.icon}
              {item.label}
              <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-blue-400/70 bg-blue-500/10 px-1.5 py-0.5 rounded">
                Nuevo
              </span>
            </Link>
          )
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-green-600/20 text-green-400'
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        )
      })}

      <div className="mt-3 border-t border-neutral-800 pt-3">
        <UserMenu />
      </div>
    </div>
  )
}
