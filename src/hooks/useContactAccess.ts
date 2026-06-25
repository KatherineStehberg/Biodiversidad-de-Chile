'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type ContactAccess = 'loading' | 'no-session' | 'no-membership' | 'allowed'

export function useContactAccess(): ContactAccess {
  const [access, setAccess] = useState<ContactAccess>('loading')

  useEffect(() => {
    async function check() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { setAccess('no-session'); return }

        const { data } = await supabase
          .from('usuarios')
          .select('membresia_activa')
          .eq('id', session.user.id)
          .single()

        setAccess(data?.membresia_activa ? 'allowed' : 'no-membership')
      } catch {
        setAccess('no-session')
      }
    }
    check()
  }, [])

  return access
}
