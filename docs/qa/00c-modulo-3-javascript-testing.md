# Módulo 3 — JavaScript Aplicado al Testing

## Objetivo
Identificar los patrones de JavaScript y TypeScript presentes en el proyecto
Biodiversidad de Chile que son relevantes para escribir pruebas automatizadas,
y documentar cómo el conocimiento de JS/TS se aplica directamente al trabajo
con Cypress, Supertest y Playwright.

## Estado inicial
El proyecto está escrito en TypeScript (Next.js 15, React 19). Los archivos
de prueba existentes (`home.cy.js`, `api-usuarios.cy.js`) están en JavaScript
puro. No existe configuración de TypeScript para Cypress.

## Problema detectado
- Los archivos de prueba usan `.cy.js` (JavaScript) mientras que el proyecto
  principal usa TypeScript. Esto genera inconsistencia y no aprovecha el
  tipado estático.
- `api-usuarios.cy.js` usa una callback arrow function y `cy.wait().then()`,
  patrones asíncronos que requieren comprensión de promesas en JS.
- Los API routes usan `async/await` con `try/catch`, patrón que los tests
  de Supertest también deben manejar.

## Decisión tomada
Documentar los patrones JS/TS del proyecto que impactan directamente en
cómo se escriben las pruebas. No modificar archivos en esta fase.

## Cambios realizados
Ninguno. Módulo de análisis aplicado.

## Archivos modificados
Ninguno.

## Comandos ejecutados
Ninguno.

## Resultado obtenido

### Patrones JavaScript/TypeScript relevantes para testing

#### 1. `async/await` con `try/catch` — presente en todos los API routes

```typescript
// Patrón real de src/app/api/consultants/route.ts
export async function GET(request: NextRequest) {
  try {
    const supabase = await dbConnect()
    const { data, error } = await supabase.from('consultores').select('*')
    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

**Impacto en testing:** los tests de Supertest y Postman deben contemplar
tanto respuestas exitosas como el manejo de errores en el bloque `catch`.

#### 2. Encadenamiento de promesas con `.then()` — presente en Cypress existente

```javascript
// Patrón real de cypress/e2e/api-usuarios.cy.js
cy.wait('@getUsuarios').then((interception) => {
  expect(interception.response.statusCode).to.eq(200)
})
```

**Impacto en testing:** Cypress permite tanto `.then()` como `async/await`
en los comandos. Conocer la diferencia evita errores de sincronización.

#### 3. Desestructuración de objetos — usado en hooks y componentes

```typescript
// Patrón real de src/lib/db.ts
const { data: { user }, error } = await supabase.auth.getUser(token)
```

**Impacto en testing:** los assertions sobre respuestas JSON de API requieren
desestructuración para acceder a propiedades anidadas.

#### 4. Template literals — usado en middleware y API routes

```typescript
// Patrón real de src/middleware.ts
const connectSrc = "connect-src 'self' https://*.supabase.co" +
  (isDev ? " ws://127.0.0.1:*" : "") + ";"
```

**Impacto en testing:** útil para construir URLs dinámicas en tests con
variables de entorno.

#### 5. Módulos ES y exportaciones nombradas — estructura del proyecto

```typescript
// Patrón real de src/lib/mock-data/index.ts
export const MOCK_AUTH_USERS = [...]
export const MOCK_CONSULTORES = [...]
```

**Impacto en testing:** los datos mock pueden importarse directamente en
tests de Supertest o en fixtures de Cypress.

#### 6. Interfaces TypeScript — tipado de respuestas API

```typescript
// Patrón real de src/app/api/biodiversity/route.ts
interface GBIFOccurrence {
  key: number
  scientificName: string
  species?: string
}
```

**Impacto en testing:** las interfaces documentan la estructura esperada
de las respuestas, lo que facilita escribir assertions precisos.

### Correspondencia JS/TS → herramientas de testing

| Concepto JS/TS | Dónde aparece en el proyecto | Cómo aplica en testing |
|---|---|---|
| `async/await` | Todos los API routes | Supertest, Cypress `cy.request()` |
| Promesas `.then()` | `api-usuarios.cy.js` | Cypress encadenado |
| Desestructuración | `db.ts`, `auth-helper.ts` | Assertions sobre JSON |
| Arrow functions | `mock-data/index.ts`, tests Cypress | Callbacks en `it()`, `describe()` |
| Módulos `export/import` | `lib/*.ts` | Importar fixtures en tests |
| Template literals | `middleware.ts` | URLs dinámicas en tests |
| Interfaces TS | Todos los API routes | Tipos de respuesta en Supertest |
| `?.` optional chaining | `wordpress.ts` | Assertions defensivos |

### Estado de TypeScript en Cypress

Cypress 15 tiene soporte nativo para TypeScript. Los archivos actuales son `.cy.js`.
La migración a `.cy.ts` es posible sin cambiar la lógica, solo el tipado.

## Evidencias
- Lectura directa de: `src/app/api/consultants/route.ts`,
  `src/app/api/biodiversity/route.ts`, `src/middleware.ts`,
  `src/lib/db.ts`, `src/lib/auth-helper.ts`, `src/lib/mock-data/index.ts`,
  `cypress/e2e/api-usuarios.cy.js`, `cypress/e2e/home.cy.js`.

## Errores encontrados
No aplica en este módulo (no se ejecutó código).

## Cómo se resolvieron
No aplica.

## Aprendizajes
- TypeScript ya presente en el proyecto facilita la migración de tests a `.cy.ts`:
  el tipado reduce errores en los assertions.
- Los datos mock (`MOCK_CONSULTORES`, `MOCK_PRODUCTS`, etc.) son arrays de
  objetos JavaScript reutilizables directamente como fixtures de Cypress.
- El patrón `async/await` con `try/catch` de los API routes define
  exactamente qué casos de prueba hay que cubrir: éxito y cada tipo de error.

## Pendientes
- Evaluar migración de `home.cy.js` y futuros tests a TypeScript (`.cy.ts`).
- Crear `cypress/tsconfig.json` para habilitar tipado en los tests,
  previa aprobación.
- Usar `MOCK_CONSULTORES` y `MOCK_PRODUCTS` como fixtures en tests de Cypress
  avanzado (módulo 04).

## Relación con el módulo del curso
**Módulo 3 del curso.** JavaScript aplicado al testing — `async/await`,
promesas, desestructuración, módulos ES, arrow functions y TypeScript básico
aplicados directamente a la escritura de pruebas automatizadas con Cypress,
Supertest y Playwright.
