'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useContactAccess } from './useContactAccess'

export function usePrivateContact(kind: 'offer' | 'consultant', id?: string) {
  const access = useContactAccess()
  const [result, setResult] = useState<{ id: string; contact: string } | null>(null)
  useEffect(() => {
    let alive = true
    setResult(null)
    if (!id || access !== 'allowed') return
    async function load() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return
        const response = await fetch(`/api/contacts?kind=${kind}&id=${encodeURIComponent(id!)}`, {
          headers: { Authorization: `Bearer ${session.access_token}` }, cache: 'no-store'
        })
        const data = await response.json()
        if (alive && response.ok) setResult({ id: id!, contact: data.contact || '' })
      } catch { /* Fail closed: never fall back to public props. */ }
    }
    void load()
    return () => { alive = false }
  }, [kind, id, access])
  return access === 'allowed' && result && result.id === id ? result.contact : ''
}
