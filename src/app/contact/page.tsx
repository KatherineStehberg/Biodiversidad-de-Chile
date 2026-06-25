'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiMail, FiMapPin, FiGlobe, FiArrowLeft, FiSend } from 'react-icons/fi'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_Completo: form.name,
          email: form.email,
          rubro: form.subject,
          comentarios: form.message,
          pais: '',
          ciudad: '',
          telefono: '',
          fiscalizacion: 'Otro',
          necesidad: 'Otro',
        })
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors duration-200">
            <FiArrowLeft size={14} />
            Volver al inicio
          </Link>
        </div>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-800/40 bg-green-900/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-400 mb-4">
            Contáctanos
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">¿En qué podemos ayudarte?</h1>
          <p className="text-gray-400">¿Tienes preguntas o quieres colaborar? Escríbenos.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: FiMail, label: 'Email', value: 'contacto@biodiversidad.cl', href: 'mailto:contacto@biodiversidad.cl', link: true },
            { icon: FiMapPin, label: 'Ubicación', value: 'Santiago, Chile', href: null, link: false },
            { icon: FiGlobe, label: 'Web', value: 'biodiversidad.cl', href: 'https://biodiversidad.cl', link: true },
          ].map(({ icon: Icon, label, value, href, link }) => (
            <div key={label} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 flex flex-col gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-900/30 border border-green-800/30">
                <Icon size={15} className="text-green-400" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">{label}</div>
              {link ? (
                <a href={href!} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-sm text-green-400 hover:text-green-300 transition-colors duration-200 break-all">
                  {value}
                </a>
              ) : (
                <span className="text-sm text-white">{value}</span>
              )}
            </div>
          ))}
        </div>

        {status === 'sent' ? (
          <div className="bg-green-900/30 border border-green-600 rounded-xl p-8 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-white font-semibold text-xl mb-2">Mensaje enviado</h2>
            <p className="text-gray-300 mb-4">Te responderemos a la brevedad.</p>
            <button onClick={() => setStatus('idle')} className="text-sm text-green-400 hover:text-green-300">Enviar otro mensaje</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-500"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-500"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Asunto</label>
              <input
                required
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-500"
                placeholder="¿En qué podemos ayudarte?"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Mensaje</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-500 resize-none"
                placeholder="Cuéntanos más..."
              />
            </div>
            {status === 'error' && (
              <p className="text-red-400 text-sm">Error al enviar. Intenta nuevamente o escríbenos directamente al correo.</p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-xl transition-colors duration-200 disabled:opacity-50"
            >
              {status === 'sending' ? 'Enviando...' : (
                <>
                  Enviar mensaje
                  <FiSend size={15} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
