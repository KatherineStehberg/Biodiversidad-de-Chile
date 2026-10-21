'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
export type ContactAccess = 'loading' | 'no-session' | 'no-membership' | 'allowed'
export function useContactAccess(): ContactAccess {
  const [access, setAccess] = useState<ContactAccess>('loading')
  useEffect(() => {
    let alive = true
    async function check() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { if (alive) setAccess('no-session'); return }
        const response = await fetch('/api/subscriptions/me', {
          headers: { Authorization: `Bearer ${session.access_token}` }, cache: 'no-store'
        })
        const data = await response.json()
        if (alive) setAccess(response.ok && data.subscription ? 'allowed' : 'no-membership')
      } catch { if (alive) setAccess('no-membership') }
    }
    void check()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { setTimeout(() => { void check() }, 0) })
    const timer = setInterval(() => { void check() }, 60000)
    return () => { alive = false; subscription.unsubscribe(); clearInterval(timer) }
  }, [])
  return access
}
