export const getURL = () => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL
  if (!configured && process.env.NODE_ENV === 'production') {
    throw new Error('Falta configurar la URL del portal')
  }
  const url = new URL(configured || 'http://localhost:3000')
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      url.pathname !== '/' || url.search || url.hash ||
      (process.env.NODE_ENV === 'production' && url.protocol !== 'https:')) {
    throw new Error('La URL del portal debe ser un origen HTTPS sin rutas')
  }
  return `${url.origin}/`
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback
}
