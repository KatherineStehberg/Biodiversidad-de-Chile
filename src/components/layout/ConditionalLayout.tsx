'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import HomeNavbar from './HomeNavbar'
import LandingNavbar from './LandingNavbar'
import Footer from './Footer'
import Breadcrumb from '@/components/ui/Breadcrumb'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Páginas donde no queremos mostrar navbar y footer
  const authPages = ['/login', '/registro', '/forgot-password', '/reset-password']
  const isAuthPage = authPages.includes(pathname)

  if (isAuthPage) {
    return <>{children}</>
  }

  // Usar diferentes navbars según la ruta
  const isLandingPage = pathname === '/landing' || pathname.startsWith('/landing/')
  let NavbarComponent;
  
  if (isLandingPage) {
    NavbarComponent = LandingNavbar;
  } else if (pathname === '/') {
    NavbarComponent = HomeNavbar;
  } else {
    NavbarComponent = Navbar;
  }

  return (
    <>
      <NavbarComponent />
      <Breadcrumb />
      {children}
      <Footer />
    </>
  )
}
