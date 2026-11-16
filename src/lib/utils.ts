export const PORTAL_URL = 'https://portal.biodiversidad.cl'

export const getURL = () => {
  const url = typeof window === 'undefined' ? PORTAL_URL : window.location.origin
  return new URL('/', url).href
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback
}
