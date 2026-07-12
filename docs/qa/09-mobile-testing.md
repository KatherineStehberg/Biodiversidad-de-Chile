# 09 — Mobile Testing

## Objetivo del módulo

Este módulo introduce testing móvil, Appium, Detox y mobile web testing como disciplinas
dentro del ecosistema QA.

Se busca:

- entender cuándo usar Appium y qué requisitos implica
- entender cuándo usar Detox y para qué tipo de proyecto aplica
- diferenciar app nativa, app híbrida y web móvil
- auditar si el proyecto bajo prueba tiene app móvil real
- auditar si el entorno local tiene los requisitos para ejecutar Appium
- tomar una decisión QA correcta según el contexto del proyecto
- implementar una prueba mobile web con Playwright cuando no existe app nativa

---

## Auditoría del proyecto

Se revisaron los siguientes indicadores de presencia de app móvil:

**Directorios:**
- `android/`
- `ios/`
- `app/`
- `mobile/`

**Archivos de configuración:**
- `react-native.config.js`
- `metro.config.js`
- `app.json` / `app.config.js`
- `eas.json`
- `capacitor.config.ts` / `capacitor.config.js`
- `ionic.config.json`

**Dependencias en `package.json`:**
- `react-native`, `expo`, `detox`, `appium`, `webdriverio`
- `capacitor`, `ionic`, `@wdio/*`

**Binarios móviles:**
- `*.apk`, `*.aab`, `*.ipa`

**Resultado:**

| ¿Existe? | Diagnóstico |
|---|---|
| App móvil nativa | No |
| React Native | No |
| Expo | No |
| Ionic / Capacitor | No |
| APK / AAB / IPA | No |
| Android SDK local | No (`C:\Users\Usuario\AppData\Local\Android\Sdk` no existe) |

El proyecto es 100% web Next.js. No existe ningún componente móvil nativo, híbrido ni React Native.

---

## Auditoría del entorno local

Se verificó el estado del entorno sin instalar ninguna herramienta:

| Herramienta | Estado |
|---|---|
| Node.js | disponible — v22.21.1 |
| npm | disponible — 10.9.4 |
| Java JDK (`java`) | **no disponible** |
| Java Compiler (`javac`) | **no disponible** |
| `ANDROID_HOME` | **vacío** |
| `ANDROID_SDK_ROOT` | **vacío** |
| `JAVA_HOME` | **vacío** |
| `adb` | **no disponible** |
| `emulator` | **no disponible** |
| Appium | **no instalado en el proyecto** |

> **Nota:** `npx appium -v` puede devolver una versión porque `npx` descarga el paquete
> temporalmente al vuelo para responder la consulta. Eso no significa que Appium esté instalado
> como dependencia del proyecto ni en `node_modules`. La versión reportada (3.5.2) fue una
> descarga temporal de `npx` — el proyecto no tiene `appium` en `package.json`.

---

## Decisión técnica

**Se eligió Mobile Web Testing con Playwright.**

| Herramienta | Decisión | Motivo |
|---|---|---|
| Appium | No instalado | Sin app móvil, sin APK/IPA, sin Android SDK, sin emulador — no hay target real |
| Detox | No instalado | Sin app React Native |
| Playwright mobile | Implementado | Ya instalado, permite emular dispositivos móviles, genera evidencia inmediata |

Playwright ya estaba disponible en el proyecto (instalado en Módulo 7). La emulación de
dispositivos móviles es una funcionalidad integrada en `@playwright/test` que no requiere
instalar herramientas adicionales.

---

## Archivo creado

**`tests/playwright/mobile-home.spec.js`**

```js
import { test, expect, devices } from '@playwright/test'

const iPhone = devices['iPhone 12']

// devices['iPhone 12'] incluye defaultBrowserType: 'webkit', que no está instalado.
// Se aplican solo las propiedades de viewport/UA para emulación en Chromium.
const { defaultBrowserType: _unused, ...iPhoneOptions } = iPhone

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
```

**Ajustes técnicos aplicados:**

- `devices['iPhone 12']` incluye `defaultBrowserType: 'webkit'`, que activa WebKit al
  ejecutar. Como WebKit no está instalado en este proyecto (solo Chromium), la propiedad
  se excluyó con destructuring: `const { defaultBrowserType: _unused, ...iPhoneOptions } = iPhone`.
  Los tests corren en Chromium con viewport 390×844, user agent de iPhone 12 e `isMobile: true`.

- `timeout: 60000` en `test.use()` — Next.js 15 en modo desarrollo compila cada ruta JIT
  en la primera solicitud. El primer test en mobile activa una compilación de la ruta para
  el user agent móvil y supera el timeout de 30s por defecto. Se extiende a 60s, consistente
  con el patrón ya aplicado en Cucumber (`setDefaultTimeout(60 * 1000)`).

---

## Tests implementados

| # | Test | Validación |
|---|---|---|
| 1 | Debe cargar la Home en viewport móvil | `page.goto('/')` + `header` visible |
| 2 | Debe tener un título no vacío en móvil | `page.title()` con `length > 0` |
| 3 | No debe tener scroll horizontal | `scrollWidth > clientWidth` debe ser `false` |
| 4 | Debe validar la URL en móvil | `page.url()` contiene `localhost:3000` |

El test 3 valida responsive design: si algún elemento genera desbordamiento horizontal, la
página tiene un problema de layout en mobile. Este es uno de los casos de regresión más
comunes al adaptar diseños desktop a pantallas pequeñas.

---

## Conceptos aprendidos

### Appium
Herramienta open source basada en el protocolo WebDriver para automatizar apps nativas,
híbridas y web mobile en Android e iOS. Requiere JDK, Android SDK (para Android) o Xcode
(para iOS), un emulador o dispositivo real, y el APK/IPA de la app bajo prueba. Es el
estándar de facto para testing de apps móviles reales.

### Detox
Framework de testing E2E específicamente diseñado para apps React Native, desarrollado por
Wix. Se integra con el runtime de React Native para sincronización automática con el ciclo
de vida de la app — elimina la necesidad de `waitFor` y `sleep` explícitos. Solo aplica
a proyectos React Native.

### Mobile web testing
Pruebas sobre una aplicación web vista desde un viewport y user agent móvil. No prueba una
app de Play Store o App Store — prueba la versión web del sistema en navegador móvil.
Playwright y Cypress pueden emular dispositivos con viewport, densidad de píxeles, user
agent y modo táctil.

### App nativa
Aplicación compilada para Android (APK/AAB) o iOS (IPA). Accede a APIs del sistema operativo:
cámara, GPS, notificaciones push, biometría. Requiere distribución a través de tiendas.

### App híbrida
Aplicación móvil que usa un WebView interno para renderizar HTML/CSS/JS, con una capa nativa
que expone APIs del dispositivo. Ejemplos: Ionic, Capacitor, Cordova. Appium puede
automatizarlas usando el driver de Chromedriver o SafariDriver para el WebView.

### Web móvil
Sitio web responsive abierto desde el navegador de un dispositivo móvil (Chrome, Safari).
No requiere instalación. Es el caso de "Biodiversidad de Chile" — una aplicación Next.js
accedida desde mobile browser.

### Emulador
Entorno virtual que simula el hardware de un dispositivo Android. Requiere Android SDK y
un AVD (Android Virtual Device). Más lento que hardware real. Solo disponible en macOS/Windows
con Android Studio instalado.

### Dispositivo real
Hardware físico conectado vía USB o en red. Más fiel al comportamiento real del usuario.
Necesario para pruebas de performance, gesturas complejas y APIs nativas. Más difícil de
integrar en CI/CD.

### accessibilityId / testID
Atributos especiales que se agregan al código fuente para que los tests de automatización
localicen elementos de forma estable, independiente del texto visible o la posición en
pantalla. En React Native: `testID="loginButton"`. En Appium: `driver.findElement(By.accessibilityId('loginButton'))`.
Equivalente al `data-cy` de Cypress en el ecosistema mobile.

### Responsive testing
Validación de que la interfaz se adapta correctamente a distintos tamaños de pantalla y
orientaciones. Incluye comprobar que no hay overflow horizontal, que los elementos son
accesibles sin zoom, y que el contenido no se superpone en viewports pequeños.

---

## Appium vs Detox vs Playwright Mobile

| Herramienta | Objetivo | Requisitos | Cuándo usar |
|---|---|---|---|
| **Appium** | Apps nativas, híbridas y web mobile | JDK, Android SDK, emulador/dispositivo, APK/IPA | Existe app móvil real en Android o iOS |
| **Detox** | Apps React Native | App React Native instalada, iOS/Android | Proyecto React Native, se busca sincronización automática |
| **Playwright mobile** | Web móvil / responsive | Browser Playwright ya instalado | Proyecto web, validar responsive, sin app nativa |

---

## Resultado de validación

### Playwright mobile

```bash
npx playwright test tests/playwright/mobile-home.spec.js
```

```
Running 4 tests using 1 worker

  ok 1 [chromium] › mobile-home.spec.js › ... › Debe cargar la Home en viewport móvil (16.9s)
  ok 2 [chromium] › mobile-home.spec.js › ... › Debe tener un título no vacío en móvil (9.2s)
  ok 3 [chromium] › mobile-home.spec.js › ... › No debe tener scroll horizontal (13.2s)
  ok 4 [chromium] › mobile-home.spec.js › ... › Debe validar la URL en móvil (10.6s)

  4 passed (53.8s)
```

- Tests: 4, Passing: 4, Failing: 0, Exit code: 0

### Playwright completo

```bash
npx playwright test
```

```
Running 7 tests using 1 worker

  ok 1–3  home.spec.js (desktop)
  ok 4–7  mobile-home.spec.js (iPhone 12)

  7 passed (1.3m)
```

- Tests: 7, Passing: 7, Failing: 0, Exit code: 0

### Cypress

```bash
npx cypress run
```

```
  √  api/climate.cy.js          2/2
  √  api/consultants.cy.js      1/1
  √  api/earthquakes.cy.js      2/2
  √  api/negative-cases.cy.js   3/3
  √  ui/home.cy.js              4/4
  √  All specs passed!         12/12
```

- Specs: 5, Tests: 12, Passing: 12, Failing: 0, Exit code: 0

### Cucumber

```bash
npx cucumber-js
```

```
.....

1 scenario (1 passed)
5 steps (5 passed)
0m 4.127s
```

- Scenarios: 1, Steps: 5, Passing: 5, Exit code: 0

---

## Riesgos y pendientes

| Riesgo / Pendiente | Descripción |
|---|---|
| Emulación ≠ dispositivo real | Playwright valida viewport, user agent e `isMobile`, pero no APIs nativas del SO ni gesturas táctiles físicas. |
| Chromium en lugar de WebKit | Para Safari móvil realista habría que instalar WebKit: `npx playwright install webkit` |
| Scroll horizontal asíncrono | El test 3 evalúa el DOM al momento del `goto`. Contenido que carga muy tarde puede no ser capturado. |
| App móvil futura | Si el proyecto evoluciona a React Native o app nativa, se debe reevaluar Appium o Detox. |
| Más dispositivos | Pendiente: agregar Pixel 5 (Android) u otro descriptor de `devices` para ampliar cobertura. |
| WebKit | Pendiente evaluar `npx playwright install webkit` si se requiere cobertura Safari real. |
| CI/CD mobile | Pendiente integrar los tests mobile a pipeline de integración continua (Módulo 10). |
| Estrategia Appium | Pendiente documentar ruta de adopción de Appium si en el futuro aparece APK o app nativa. |

---

## Cierre del módulo

El Módulo 9 queda cubierto con:

- auditoría del proyecto — confirmado como web Next.js sin componente móvil
- auditoría del entorno — confirmado sin JDK, Android SDK, adb ni emulador
- decisión técnica justificada — Mobile Web Testing con Playwright en lugar de Appium
- prueba mobile web implementada — 4 tests con emulación iPhone 12 en Chromium
- validación cruzada sin regresiones — Playwright 7/7, Cypress 12/12, Cucumber 1/1
- documentación conceptual — Appium, Detox, tipos de app, emuladores, accessibilityId

**Commit técnico:**
`e6a05f9 test(mobile): agregar spec Playwright con emulación móvil iPhone 12`
