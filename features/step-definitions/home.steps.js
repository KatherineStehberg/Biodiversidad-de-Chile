const { Given, Then, Before, After, setDefaultTimeout } = require('@cucumber/cucumber')
const { chromium, expect } = require('@playwright/test')

setDefaultTimeout(60 * 1000)

let browser
let context
let page

Before(async function () {
  browser = await chromium.launch({ headless: true })
  context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    baseURL: 'http://localhost:3000'
  })
  page = await context.newPage()
})

After(async function () {
  await context.close()
  await browser.close()
})

Given('el usuario abre la página principal', async function () {
  await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 30000 })
})

Then('debe ver el encabezado principal', async function () {
  await page.locator('header').waitFor({ state: 'visible', timeout: 20000 })
})

Then('el título de la página no debe estar vacío', async function () {
  const title = await page.title()
  expect(title.length).toBeGreaterThan(0)
})
