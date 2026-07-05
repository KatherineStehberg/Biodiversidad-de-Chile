# Cypress — Biblioteca de Referencia

## ¿Qué es Cypress?
Cypress es una herramienta de pruebas E2E (de extremo a extremo) para
aplicaciones web. Simula el comportamiento de un usuario real en el navegador:
visitar páginas, hacer clic, rellenar formularios, interceptar solicitudes de red.

**Versión en este proyecto:** 15.17.0

---

## Configuración del proyecto (`cypress.config.ts`)

```typescript
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
})
```

- `baseUrl`: URL base de la aplicación. Cypress usará esta URL cuando
  se llame a `cy.visit('/')` sin URL completa.
- `specPattern`: patrón que define dónde buscar archivos de prueba.

---

## Estructura de un archivo de prueba

```javascript
describe('Nombre del grupo de pruebas', () => {
  it('descripción del test individual', () => {
    cy.visit('/')
    cy.get('body').should('be.visible')
  })
})
```

- `describe()` — agrupa varios tests relacionados (suite)
- `it()` — define un test individual
- `cy.visit()` — navegar a una URL
- `cy.get()` — seleccionar un elemento del DOM
- `.should()` — comprobación (assertion)

---

## Comandos usados en este proyecto

### cy.visit(url)
Navega a una URL.
```javascript
cy.visit('http://localhost:3000')
cy.visit('/')  // usa baseUrl configurado
```

### cy.url()
Obtiene la URL actual del navegador.
```javascript
cy.url().should('include', 'localhost:3000')
```

### cy.title()
Obtiene el título de la página (etiqueta `<title>`).
```javascript
cy.title().should('not.be.empty')
```

### cy.get(selector)
Selecciona elementos del DOM usando selectores CSS.
```javascript
cy.get('body').should('be.visible')
cy.get('nav').should('exist')
```

### cy.screenshot(nombre)
Toma una captura de pantalla y la guarda en `cypress/screenshots/`.
```javascript
cy.screenshot('pagina-principal')
```

### cy.intercept(método, url)
Intercepta solicitudes HTTP que hace la aplicación.
```javascript
cy.intercept('GET', '/api/products').as('getProducts')
cy.wait('@getProducts')
```

### cy.request(método, url)
Hace una solicitud HTTP directamente desde el test (sin pasar por el navegador).
Útil para probar API Routes.
```javascript
cy.request('GET', '/api/products').then((response) => {
  expect(response.status).to.eq(200)
})
```

---

## Archivos de prueba en este proyecto

| Archivo | Estado | Tests |
|---|---|---|
| `cypress/e2e/home.cy.js` | ✅ Operativo | 4 tests aprobados |
| `cypress/e2e/api-usuarios.cy.js` | ⚠️ No aplicable | Endpoint inexistente (QA-001) |

---

## Fixtures
Archivos de datos de prueba en `cypress/fixtures/`.
Se cargan con `cy.fixture('nombre-archivo')`.
En este proyecto: `example.json` existe pero no tiene uso activo aún.

---

## Modos de ejecución

| Modo | Comando | Descripción |
|---|---|---|
| Visual | `npx cypress open` | Abre el navegador de Cypress con interfaz gráfica |
| Headless | `npx cypress run` | Corre las pruebas en terminal, sin interfaz gráfica |

**Nota:** estos scripts aún no están registrados en `package.json`.
Se agregarán en el módulo 4 (pendiente de aprobación).

---

## Consideraciones para este proyecto

- Cypress necesita que `npm run dev` esté corriendo antes de ejecutar pruebas.
- La primera compilación de ruta tarda ~4 s. Si aparece un error de timeout,
  antes de cambiar cualquier configuración se debe determinar su origen:
  ¿afecta a `cy.visit()` (controlado por `pageLoadTimeout`), a la compilación
  inicial de Next.js, o a un selector dentro de la página
  (controlado por `defaultCommandTimeout`)? No se cambia ningún timeout
  en esta fase.
- El modo mock está activo (`NEXT_PUBLIC_USE_MOCK_DATA=true`), por lo que
  las pruebas usan datos ficticios.
