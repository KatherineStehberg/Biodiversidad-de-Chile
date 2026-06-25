'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import JobOfferForm from './JobOfferForm'

export default function PublicarOfertaSection() {
  const [open, setOpen] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  function handleClick() {
    if (!session) {
      router.push('/login')
    } else {
      setOpen(true)
    }
  }

  return (
    <>
      <section className="bg-green-700 py-16 text-white text-center">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          <div className="text-5xl">💼</div>
          <h3 className="text-2xl md:text-3xl font-bold">¿Representas una empresa o institución?</h3>
          <p className="text-green-100 text-lg">
            Publica una oferta laboral o convocatoria para conectar con consultores ambientales especializados.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={handleClick}
              disabled={loading}
              className="bg-white text-green-700 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition text-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? '...' : '+ Publicar oferta'}
            </button>
            {!loading && !session && (
              <p className="text-green-100 text-sm self-center">
                (Necesitas una cuenta para publicar)
              </p>
            )}
          </div>
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div className="bg-neutral-900 text-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
              <div>
                <h2 className="text-xl font-bold">Publicar oferta laboral</h2>
                <p className="text-sm text-gray-400">Para consultores ambientales</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white text-3xl leading-none w-9 h-9 flex items-center justify-center rounded-lg hover:bg-neutral-800 transition"
              >
                &times;
              </button>
            </div>
            <div className="px-6 py-5">
              <JobOfferForm onCreated={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
