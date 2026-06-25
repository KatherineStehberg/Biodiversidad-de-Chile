'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="relative w-full h-[92vh] min-h-[560px] overflow-hidden bg-neutral-950">
      {/* Images */}
      {[0, 1, 2, 3].map((num) => (
        <div
          key={num}
          className={`absolute inset-0 transition-opacity duration-700 ${
            currentSlide === num ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={`/assets/slider/biodiversidad${num}.jpg`}
            alt={`Biodiversidad ${num}`}
            fill
            className="object-cover"
            priority={num === 0}
          />
        </div>
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/50 via-transparent to-transparent" />

      {/* Ambient accent — green/blue glow at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[800px] rounded-full bg-green-700/15 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-48 w-64 rounded-full bg-blue-700/10 blur-[60px] pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 backdrop-blur px-4 py-1.5 text-sm font-medium text-green-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
          GreenTech · IA · ESG · Sostenibilidad
        </div>

        <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-green-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
            Conectamos personas
          </span>{' '}
          con la biodiversidad
        </h1>

        <p className="mt-5 max-w-2xl text-lg text-gray-300 md:text-xl leading-relaxed">
          Una plataforma sustentable, abierta y humana para el ecosistema verde. Ahora con
          tecnología, IA y datos ambientales.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/marketplace"
            className="group inline-flex items-center gap-2 rounded-xl bg-green-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-green-900/40 transition-all duration-300 hover:bg-green-500 hover:-translate-y-0.5 hover:shadow-green-800/50"
          >
            Explorar plataforma
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={16} />
          </Link>
          <Link
            href="/tecnologia"
            className="inline-flex items-center gap-2 rounded-xl border border-blue-600/40 bg-blue-600/10 backdrop-blur px-7 py-3.5 font-medium text-blue-300 transition-all duration-300 hover:bg-blue-600/20 hover:border-blue-500/60 hover:-translate-y-0.5"
          >
            Ver soluciones tech
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur px-7 py-3.5 font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white"
          >
            Ingresar
          </Link>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5">
          {[0, 1, 2, 3].map((num) => (
            <button
              key={num}
              className={`rounded-full transition-all duration-300 ${
                currentSlide === num
                  ? 'bg-green-400 w-6 h-2'
                  : 'bg-white/30 hover:bg-white/50 w-2 h-2'
              }`}
              onClick={() => setCurrentSlide(num)}
              aria-label={`Ir a diapositiva ${num + 1}`}
            />
          ))}
        </div>
      </div>
    </header>
  )
}

export default Slider
