'use client'

import { useState } from 'react'
import ProductSkeleton from './ProductSkeleton'
import ProductSidePanel from './ProductSidePanel'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'

interface Product {
  _id: string
  title: string
  description: string
  price: number
  category: string
  images: string[]
  seller: {
    _id: string
    name: string
    avatar?: string
  }
  location: {
    country: string
    city: string
  }
  createdAt: string
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalProducts: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface ProductGridProps {
  productos: Product[]
  isLoading: boolean
  pagination?: Pagination
}

const ProductGrid = ({ productos, isLoading, pagination }: ProductGridProps) => {
  const [selected, setSelected] = useState<Product | null>(null)

  return (
    <>
      <div className="space-y-6">
        {pagination && (
          <div className="text-sm text-gray-500">
            Mostrando <span className="text-white font-medium">{productos.length}</span> de{' '}
            <span className="text-white font-medium">{pagination.totalProducts}</span> productos
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
            : productos.length === 0
              ? (
                <div className="col-span-3 text-center py-20 rounded-2xl border border-neutral-800 bg-neutral-900">
                  <div className="text-5xl mb-4">🌿</div>
                  <p className="text-lg font-semibold text-white">No hay productos disponibles aún</p>
                  <p className="text-sm mt-2 text-gray-500">Sé el primero en publicar un producto ecológico</p>
                </div>
              )
              : productos.map((producto) => (
                <article
                  key={producto._id}
                  className="group rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden transition-all duration-300 hover:border-neutral-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 cursor-pointer"
                  onClick={() => setSelected(producto)}
                >
                  <div className="relative w-full h-44 bg-neutral-800 overflow-hidden">
                    {producto.images?.[0] ? (
                      <img
                        src={producto.images[0]}
                        alt={producto.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-neutral-600 text-sm">Sin imagen</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-4">
                    <span className="inline-block rounded-full bg-green-900/20 border border-green-800/30 px-2.5 py-0.5 text-xs font-medium text-green-400">{producto.category}</span>
                    <h4 className="mt-2 text-base font-semibold text-white group-hover:text-green-300 transition-colors duration-200 line-clamp-1">{producto.title}</h4>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-snug">{producto.description}</p>
                    <p className="text-green-400 font-bold text-lg mt-3">${producto.price.toLocaleString('es-CL')} CLP</p>
                    <div className="mt-3 pt-3 border-t border-neutral-800">
                      <p className="text-xs text-gray-500">Por: <span className="text-gray-400">{producto.seller.name}</span></p>
                      <p className="text-xs text-gray-600">{producto.location.city}, {producto.location.country}</p>
                    </div>
                    <button className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-500 text-white px-4 py-2 text-sm font-semibold transition-colors duration-200">
                      Ver detalles
                      <FiArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </article>
              ))}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {pagination.hasPrevPage && (
              <a
                href={`?page=${pagination.currentPage - 1}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-700 bg-neutral-800 text-gray-300 hover:border-neutral-600 hover:text-white transition-all duration-200 text-sm font-medium"
              >
                <FiArrowLeft size={14} />
                Anterior
              </a>
            )}
            <span className="px-4 py-2 text-sm text-gray-500">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            {pagination.hasNextPage && (
              <a
                href={`?page=${pagination.currentPage + 1}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-700 bg-neutral-800 text-gray-300 hover:border-neutral-600 hover:text-white transition-all duration-200 text-sm font-medium"
              >
                Siguiente
                <FiArrowRight size={14} />
              </a>
            )}
          </div>
        )}
      </div>

      <ProductSidePanel product={selected} onClose={() => setSelected(null)} />
    </>
  )
}

export default ProductGrid
