import { test, expect } from '@playwright/test'

const publicRoutes = [
  '/', '/landing', '/marketplace', '/consultores', '/educacion', '/campanas',
  '/membresias', '/tecnologia', '/contact', '/login', '/registro',
  '/forgot-password', '/reset-password', '/privacy', '/terms',
  '/landing/privacity', '/landing/terms',
]

const protectedRoutes = [
  '/dashboard', '/perfil', '/perfil/profesional', '/perfil/seguridad',
  '/perfil/notificaciones', '/mis-publicaciones',
]

async function assertNoNotFound(page, route) {
  const response = await page.goto(route, { waitUntil: 'domcontentloaded' })
  expect(response, `Sin respuesta para ${route}`).not.toBeNull()
  expect(response.status(), `${route} respondió HTTP ${response.status()}`).toBeLessThan(400)
  await expect(page.locator('body')).not.toContainText('This page could not be found')
}

test.describe('Rutas y enlaces internos', () => {
  for (const route of publicRoutes) {
    test(`ruta pública ${route} existe`, async ({ page }) => {
      await assertNoNotFound(page, route)
    })
  }

  for (const route of protectedRoutes) {
    test(`ruta protegida ${route} existe o redirige de forma válida`, async ({ page }) => {
      await assertNoNotFound(page, route)
    })
  }

  test('los enlaces internos visibles desde páginas públicas no terminan en 404', async ({ page, request }) => {
    const discovered = new Set()
    const seedRoutes = ['/', '/landing', '/marketplace', '/consultores', '/educacion', '/campanas', '/membresias', '/tecnologia']

    for (const route of seedRoutes) {
      await page.goto(route, { waitUntil: 'domcontentloaded' })
      const hrefs = await page.locator('a[href]').evaluateAll((links) =>
        links.map((link) => link.getAttribute('href')).filter(Boolean)
      )
      for (const href of hrefs) {
        if (href.startsWith('/') && !href.startsWith('//')) {
          discovered.add(href.split('#')[0].split('?')[0] || '/')
        }
      }
    }

    for (const href of [...discovered].sort()) {
      const response = await request.get(href, { maxRedirects: 5 })
      expect(response.status(), `Enlace interno roto: ${href}`).toBeLessThan(400)
    }
  })
})
