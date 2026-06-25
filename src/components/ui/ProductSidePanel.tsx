'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import ContactGate from '@/components/ui/ContactGate'

interface Product {
  _id: string
  title: string
  description: string
  price: number
  category: string
  images: string[]
  seller: { _id: string; name: string; avatar?: string }
  location: { country: string; city: string }
  createdAt: string
}

interface Props {
  product: Product | null
  onClose: () => void
}

export default function ProductSidePanel({ product, onClose }: Props) {
  const [visible, setVisible] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!product) return
    setImgIdx(0)
    setTimeout(() => setVisible(true), 10)
    const timer = setTimeout(() => closeRef.current?.focus(), 50)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => { clearTimeout(timer); document.removeEventListener('keydown', onKey) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

  if (!product) return null

  function handleClose() { setVisible(false); setTimeout(() => onClose(), 200) }

  const images = product.images?.filter(Boolean) || []
  const currentImg = images[imgIdx]

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
        aria-hidden
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={`fixed right-0 top-0 h-full w-full md:w-[420px] bg-neutral-900 text-white shadow-2xl z-50 transform transition-transform duration-200 overflow-y-auto ${visible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 flex flex-col gap-5">
          {/* Header */}
          <div className="flex justify-between items-start">
            <span className="text-xs bg-green-700/30 text-green-300 px-2 py-1 rounded-full">{product.category}</span>
            <button ref={closeRef} onClick={handleClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
          </div>

          {/* Imagen */}
          {images.length > 0 ? (
            <div className="space-y-2">
              <div className="relative w-full h-56 rounded-xl overflow-hidden bg-neutral-800">
                <Image src={currentImg} alt={product.title} fill className="object-cover" />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setImgIdx(i)} className={`relative w-14 h-14 rounded overflow-hidden border-2 transition ${i === imgIdx ? 'border-green-500' : 'border-neutral-700'}`}>
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-48 bg-neutral-800 rounded-xl flex items-center justify-center text-gray-500">Sin imagen</div>
          )}

          {/* Info */}
          <div>
            <h2 className="text-2xl font-bold">{product.title}</h2>
            <p className="text-3xl font-extrabold text-green-400 mt-2">${product.price.toLocaleString('es-CL')} CLP</p>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed">{product.description}</p>

          {/* Detalles */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-neutral-800 rounded-lg p-3">
              <span className="text-xs text-gray-400 block mb-1">Ubicación</span>
              <span className="text-white">{product.location.city}, {product.location.country}</span>
            </div>
            <div className="bg-neutral-800 rounded-lg p-3">
              <span className="text-xs text-gray-400 block mb-1">Vendido por</span>
              <span className="text-white">{product.seller.name}</span>
            </div>
          </div>

          {/* Contacto con gate de membresía */}
          <ContactGate>
            <p className="text-xs text-gray-400 mb-3">Vendedor: <span className="text-white">{product.seller.name}</span></p>
            <a
              href={`mailto:?subject=Consulta sobre: ${encodeURIComponent(product.title)}`}
              className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
            >
              ✉️ Contactar vendedor
            </a>
          </ContactGate>

          <button onClick={handleClose} className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-sm transition">
            Cerrar
          </button>
        </div>
      </aside>
    </>
  )
}
