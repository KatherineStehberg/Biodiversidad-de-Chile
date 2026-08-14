import { test, expect, devices } from '@playwright/test'

const iPhone = devices['iPhone 12']

// devices['iPhone 12'] incluye defaultBrowserType: 'webkit', que no está instalado.
// Se aplican solo las propiedades de viewport/UA para emulación en Chromium.
const { defaultBrowserType: _unused, ...iPhoneOptions } = iPhone
void _unused

test.use({
  ...iPhoneOptions,
  // Next.js JIT compila la ruta la primera vez — el primer test necesita más tiempo.
  timeout: 60000,
})

test.describe('Página principal — emulación móvil (iPhone 12)', () => {
  test('Debe cargar la Home en viewport móvil', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('header')).toBeVisible()
  })

  test('Debe tener un título no vacío en móvil', async ({ page }) => {
    await page.goto('/')
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)
  })

  test('No debe tener scroll horizontal', async ({ page }) => {
    await page.goto('/')
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(hasHorizontalScroll).toBe(false)
  })

  test('Debe validar la URL en móvil', async ({ page }) => {
    await page.goto('/')
    expect(page.url()).toContain('localhost:3000')
  })
})
