'use client'

import { useEffect, useRef, useState } from 'react'
import ContactGate from '@/components/ui/ContactGate'

interface Offer {
  id: string
  title: string
  description?: string
  location?: { city?: string; country?: string }
  contact?: string
  salaryMin?: number
  salaryMax?: number
  modality?: string
  employmentType?: string
  tags?: string[]
}

interface Props {
  offer: Offer | null
  onClose: () => void
}

export default function OfferSidePanel({ offer, onClose }: Props) {
  const [visible, setVisible] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!offer) return
    previouslyFocused.current = document.activeElement as HTMLElement | null
    setTimeout(() => setVisible(true), 10)
    const timer = setTimeout(() => closeButtonRef.current?.focus(), 50)

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { e.preventDefault(); handleClose(); return }
      if (e.key === 'Tab') {
        const container = panelRef.current
        if (!container) return
        const focusable = Array.from(container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )).filter(el => el.offsetParent !== null)
        if (focusable.length === 0) return
        const first = focusable[0], last = focusable[focusable.length - 1]
        if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus() } }
        else { if (document.activeElement === last) { e.preventDefault(); first.focus() } }
      }
    }

    document.addEventListener('keydown', onKey)
    return () => { clearTimeout(timer); document.removeEventListener('keydown', onKey); previouslyFocused.current?.focus() }
  }, [offer]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!offer) return null

  function handleClose() { setVisible(false); setTimeout(() => onClose(), 300) }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
        aria-hidden="true"
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`offer-${offer.id}-title`}
        className={`fixed right-0 top-0 h-full w-full md:w-1/3 bg-neutral-900 text-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${visible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="px-6 py-6 flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h2 id={`offer-${offer.id}-title`} className="text-lg font-semibold text-white leading-6 pr-4">
              {offer.title}
            </h2>
            <button
              ref={closeButtonRef}
              onClick={handleClose}
              className="shrink-0 rounded-md bg-neutral-800 text-gray-400 hover:text-white p-1.5 transition"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Descripción */}
          <div>
            <h4 className="text-xs font-bold text-green-400 uppercase tracking-wide mb-2">Descripción</h4>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {offer.description || 'Sin descripción disponible.'}
            </p>
          </div>

          {/* Ubicación */}
          {offer.location && (
            <div>
              <h4 className="text-xs font-bold text-green-400 uppercase tracking-wide mb-2">Ubicación</h4>
              <p className="text-gray-300 text-sm">
                {[offer.location.city, offer.location.country].filter(Boolean).join(', ') || 'No especificada'}
              </p>
            </div>
          )}

          {/* Salario */}
          {(offer.salaryMin || offer.salaryMax) && (
            <div>
              <h4 className="text-xs font-bold text-green-400 uppercase tracking-wide mb-2">Salario</h4>
              <p className="text-gray-300 text-sm font-medium">
                {[
                  offer.salaryMin ? `$${offer.salaryMin.toLocaleString('es-CL')}` : null,
                  offer.salaryMax ? `$${offer.salaryMax.toLocaleString('es-CL')}` : null,
                ].filter(Boolean).join(' – ')}
              </p>
            </div>
          )}

          {/* Modalidad / Tipo */}
          <div className="grid grid-cols-2 gap-3">
            {offer.modality && (
              <div>
                <h4 className="text-xs font-bold text-green-400 uppercase tracking-wide mb-2">Modalidad</h4>
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-900/50 text-blue-200">{offer.modality}</span>
              </div>
            )}
            {offer.employmentType && (
              <div>
                <h4 className="text-xs font-bold text-green-400 uppercase tracking-wide mb-2">Tipo</h4>
                <span className="text-xs px-2.5 py-1 rounded-full bg-purple-900/50 text-purple-200">{offer.employmentType}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {offer.tags && offer.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-green-400 uppercase tracking-wide mb-2">Etiquetas</h4>
              <div className="flex flex-wrap gap-2">
                {offer.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-gray-300">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Contacto con gate de membresía */}
          <ContactGate>
            {offer.contact ? (
              offer.contact.includes('@') ? (
                <a
                  href={`mailto:${offer.contact}?subject=Postulación: ${encodeURIComponent(offer.title)}`}
                  className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
                >
                  ✉️ Postular por correo
                </a>
              ) : (
                <div className="bg-neutral-800 rounded-xl p-4 text-sm">
                  <span className="block text-xs text-gray-400 mb-1">Contacto directo:</span>
                  <span className="text-white font-medium">{offer.contact}</span>
                </div>
              )
            ) : (
              <p className="text-sm text-gray-400 text-center py-2">Sin información de contacto disponible</p>
            )}
          </ContactGate>

          <button onClick={handleClose} className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-sm transition">
            Cerrar
          </button>
        </div>
      </aside>
    </>
  )
}
