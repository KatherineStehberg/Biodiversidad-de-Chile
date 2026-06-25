import Link from 'next/link'
import { ReactNode } from 'react'

interface ButtonProps {
  href: string
  variant: 'primary' | 'secondary'
  children: ReactNode
  className?: string
}

const Button = ({ href, variant, children, className = '' }: ButtonProps) => {
  const variants = {
    primary: 'bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-900/30',
    secondary: 'border border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/30',
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center px-7 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  )
}

export default Button
