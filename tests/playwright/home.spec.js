import { test, expect } from '@playwright/test'

test.describe('Página principal del proyecto', () => {
  test('Debe cargar y mostrar el header', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('header')).toBeVisible()
  })

  test('Debe tener un título no vacío', async ({ page }) => {
    await page.goto('/')
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)
  })

  test('Debe validar la URL', async ({ page }) => {
    await page.goto('/')
    expect(page.url()).toContain('localhost:3000')
  })
})
