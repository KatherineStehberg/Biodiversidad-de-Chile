# 06 — API Testing

## Objetivo del módulo

Este módulo profundiza el testing de APIs usando `cy.request()` sobre endpoints reales del proyecto.
El foco no está en mockear respuestas sino en validar que los contratos reales de la aplicación
se cumplan: status codes correctos, headers esperados, estructura mínima del body y comportamiento
ante condiciones negativas.

Se validan:
- **Status codes** — el servidor responde con el código esperado (200, 401, 404, etc.)
- **Headers** — especialmente `Content-Type: application/json`
- **Content-Type** — confirmación de que la respuesta es JSON
- **Body** — existencia de claves esperadas y tipos de datos
- **Contratos mínimos de respuesta** — forma del body sin comparar valores exactos
- **Casos positivos** — el endpoint responde correctamente cuando se usa bien
- **Casos negativos seguros** — el endpoint rechaza solicitudes mal formadas o sin autenticación

---

## Auditoría de endpoints

Se auditaron los **19 endpoints** del proyecto ubicados en `src/app/api/`.

### Criterios de selección

| Criterio | Justificación |
|---|---|
| Preferir GET | No modifica datos; es seguro repetirlo |
| Evitar endpoints destructivos | POST/PUT/DELETE que escriben datos pueden romper el entorno |
| Evitar login real | Crear sesiones reales en pruebas genera dependencias y complejidad |
| Evitar datos sensibles | Las pruebas no deben operar sobre datos personales reales |
| POST/PUT/DELETE solo en casos negativos seguros | Solo si la autenticación falla ANTES de tocar la base de datos |
| Evitar APIs externas inestables | Si una API externa puede tardar o caer, el test se vuelve flaky |

### Resultado de la auditoría

| Endpoint | Métodos | ¿Auth? | ¿Ext? | ¿Escribe datos? | Decisión |
|---|---|---|---|---|---|
| `/api/consultants` | GET, POST | GET: no / POST: sí | No | POST: sí | **Usar GET** |
| `/api/climate` | GET | No | Sí (global-warming.org) | No | **Usar** — caché 24h |
| `/api/weather` | GET | No | Sí (Open-Meteo + Nominatim) | No | **Usar** — con coords fijas |
| `/api/earthquakes` | GET | No | Sí (USGS) | No | **Usar** — caché 5 min |
| `/api/biodiversity` | GET | No | Sí (GBIF + NASA EONET) | No | **Pendiente** — latencia conocida |
| `/api/diagnostic` | POST | No (sin n8n inútil) | Sí (n8n) | No | No usar |
| `/api/offers` | POST | Sí | No | Sí (insert) | Solo negativo 401 |
| `/api/products` | POST | Sí | No | Sí (insert) | No usar |
| `/api/products/[id]` | GET, PUT, DELETE | ⚠️ Ninguno | No | PUT/DELETE: sí | Pendiente |
| `/api/resources` | POST | Sí | No | Sí (insert) | No usar |
| `/api/moderation/approve` | POST | Sí (secret) | No | Sí (aprueba registros) | No usar |
| `/api/moderation/reject` | POST | Sí (secret) | No | Sí (elimina registros) | No usar |
| `/api/seed` | POST | ⚠️ Ninguno | No | Sí (inserta datos masivos) | No usar — sin auth |
| `/api/subscriptions/create` | POST | Sí | Sí (Flow) | Sí (insert) | No usar |
| `/api/subscriptions/me` | GET | Sí | No | No | No usar |
| `/api/subscriptions/webhook` | POST | ⚠️ Ninguno | No | Sí (update) | No usar — sin auth |
| `/api/user/profile` | POST | Sí | No | Sí (upsert) | No usar |
| `/api/user/avatar` | POST | Sí | No | Sí (storage + DB) | No usar |
| `/api/revalidate-news` | GET, POST | Sí (secret) | No | No | No usar |

---

## Endpoints probados

| Endpoint | Caso | Status esperado | Qué valida | Spec |
|---|---|---|---|---|
| `GET /api/consultants` | Positivo | 200 | body.consultants es array, estructura de contrato | `api/consultants.cy.js` |
| `GET /api/climate` | Positivo | 200 | body.co2 y body.temperature con claves esperadas | `api/climate.cy.js` |
| `GET /api/weather?lat=-33.45&lon=-70.66` | Positivo | 200 | body.temperature, humidity, windSpeed son numbers | `api/climate.cy.js` |
| `GET /api/earthquakes` | Positivo | 200 | body.chile y body.world son arrays | `api/earthquakes.cy.js` |
| `GET /api/earthquakes` (campos) | Positivo | 200 | si hay eventos en chile, valida id, magnitude, place, time, depth | `api/earthquakes.cy.js` |
| `GET /api/ruta-que-no-existe` | Negativo | 404 | Next.js devuelve 404 ante rutas inexistentes | `api/negative-cases.cy.js` |
| `POST /api/consultants` sin auth | Negativo | 401 | auth falla antes de tocar la DB, body tiene clave `error` | `api/negative-cases.cy.js` |
| `POST /api/offers` sin auth | Negativo | 401 | auth falla antes de tocar la DB, body tiene clave `error` | `api/negative-cases.cy.js` |

---

## Specs creados

### `cypress/e2e/api/climate.cy.js`

Prueba los endpoints de datos ambientales globales:

- `GET /api/climate` — valida status 200, content-type JSON, presencia de claves `co2` y `temperature` del contrato, y que `co2.value` sea un string numérico mayor a 0
- `GET /api/weather?lat=-33.45&lon=-70.66` — usa coordenadas fijas de Santiago para hacerlo determinista; valida status 200, content-type JSON, y que `temperature`, `humidity`, `windSpeed` sean números

### `cypress/e2e/api/earthquakes.cy.js`

Prueba el endpoint de actividad sísmica:

- `GET /api/earthquakes` — valida status 200, content-type JSON, y que `body.chile` y `body.world` sean arrays
- Segundo test valida campos requeridos (`id`, `magnitude`, `place`, `time`, `depth`) en el primer evento de Chile, **solo si el array tiene elementos** — evita falso negativo cuando no hay sismos registrados

### `cypress/e2e/api/negative-cases.cy.js`

Prueba comportamiento ante condiciones inválidas:

- `GET /api/ruta-que-no-existe` — valida que el servidor responde 404 ante una ruta inexistente; usa `failOnStatusCode: false` para que Cypress no falle antes de la assertion
- `POST /api/consultants` sin autenticación — valida que el endpoint rechaza con 401 antes de acceder a la base de datos
- `POST /api/offers` sin autenticación — mismo patrón, confirma que la protección es consistente entre endpoints

### `cypress/e2e/api/consultants.cy.js`

Se mantiene como prueba base de contrato de consultores, sin cambios respecto al Módulo 5:

- Carga el fixture `api/consultants-response.json` como contrato mínimo
- Llama al endpoint real con `cy.request()`
- Valida status 200, content-type, claves del contrato y que `consultants` sea array

---

## Fixtures de contrato

### `cypress/fixtures/api/climate-response.json`

```json
{
  "co2": {
    "value": "",
    "year": "",
    "month": "",
    "abovePreIndustrial": ""
  },
  "temperature": {
    "anomaly": "",
    "year": "",
    "trend10y": ""
  }
}
```

### `cypress/fixtures/api/weather-response.json`

```json
{
  "temperature": 0,
  "humidity": 0,
  "windSpeed": 0,
  "condition": "",
  "icon": "",
  "city": "",
  "country": ""
}
```

Los fixtures se usan como **contrato mínimo de estructura**, no como respuesta exacta rígida.
El test no compara `deep.equal` contra el fixture — solo verifica que cada clave del fixture
existe en la respuesta real. Esto garantiza que el test sigue pasando cuando el servidor
devuelva datos diferentes pero con la misma forma.

---

## Conceptos aprendidos

### Endpoint
URL específica de una API que acepta solicitudes HTTP y devuelve una respuesta.
Cada endpoint puede soportar uno o más métodos HTTP.

### Método HTTP
Verbo que indica la intención de la solicitud: `GET` (leer), `POST` (crear),
`PUT` (actualizar), `DELETE` (eliminar). Un mismo endpoint puede tener handlers
distintos para cada método.

### Status code
Código numérico en la respuesta HTTP que indica el resultado de la operación.
Ejemplos: `200` (OK), `201` (Created), `400` (Bad Request), `401` (Unauthorized),
`404` (Not Found), `500` (Internal Server Error).

### Header
Metadato que acompaña la solicitud o la respuesta HTTP. No es el contenido — es
información sobre el contenido o el protocolo. Ejemplo: `Content-Type: application/json`.

### Content-Type
Header que indica el formato del body. En APIs modernas, `application/json` indica
que el cuerpo es un objeto JSON serializado.

### Body
Cuerpo de la respuesta — el contenido real. En APIs REST JSON, es un objeto JavaScript
serializado. Se accede con `response.body` en Cypress.

### Contrato de API
Especificación mínima que un endpoint debe cumplir: qué método acepta, qué status devuelve,
qué Content-Type usa, y qué estructura tiene el body. Verificar el contrato no requiere
comparar valores exactos — solo la forma y los tipos.

### Caso positivo
Test que verifica que el endpoint funciona correctamente ante una solicitud válida.
El servidor debe responder con el status esperado y la estructura prometida.

### Caso negativo
Test que verifica que el endpoint responde correctamente ante una solicitud inválida.
El servidor debe rechazar con el status adecuado (401, 404, 400, etc.) en lugar de
procesar la solicitud o devolver un error 500.

### `failOnStatusCode: false`
Opción de `cy.request()` que evita que Cypress falle automáticamente cuando el servidor
responde con un status de error (4xx o 5xx). Necesario en casos negativos donde se espera
un status de error — sin esta opción, Cypress fallaría antes de llegar a la assertion.

### `cy.request()`
Comando de Cypress que emite una solicitud HTTP directamente desde el proceso de prueba,
sin el navegador. Ideal para probar contratos de API de forma aislada. El test mismo es
el cliente — no depende de que la aplicación haga la solicitud.

### Fixture de contrato
Archivo JSON en `cypress/fixtures/` que define la forma mínima esperada de una respuesta.
No reemplaza al servidor — el servidor responde con datos reales. El fixture actúa como
referencia para validar que la respuesta tiene las claves correctas.

### Flakiness por APIs externas
Un test que depende de una API externa puede pasar en un momento y fallar en otro, sin
cambios en el código. Causas: latencia, rate limiting, caída del servicio externo.
La solución a largo plazo es usar stubs (`cy.intercept()` con fixture) para desacoplar
el test de la disponibilidad del servicio externo.

---

## Resultado de validación

**Comando ejecutado:**
```powershell
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run
```

**Resultado:**

| Spec | Tests | Passing | Failing |
|---|---|---|---|
| `api/climate.cy.js` | 2 | 2 | 0 |
| `api/consultants.cy.js` | 1 | 1 | 0 |
| `api/earthquakes.cy.js` | 2 | 2 | 0 |
| `api/negative-cases.cy.js` | 3 | 3 | 0 |
| `ui/home.cy.js` | 4 | 4 | 0 |
| **Total** | **12** | **12** | **0** |

- Specs encontrados: 5
- Tests ejecutados: 12
- Passing: 12
- Failing: 0
- Exit code: 0

---

## Riesgos y pendientes

### Riesgos activos

- **`/api/weather`** depende de dos APIs externas (Open-Meteo + Nominatim/OpenStreetMap).
  Si alguno de los dos servicios falla o rate-limita, el test puede devolver 500 y fallar.

- **`/api/earthquakes`** depende de USGS. Aunque tiene caché de 5 minutos, la primera
  llamada sin caché puede tardar varios segundos o fallar si USGS no responde.

- **`GET /api/ruta-que-no-existe`** tardó aproximadamente 12 segundos en la primera ejecución.
  Causa: Next.js en modo desarrollo compila la ruta antes de responder 404. En la segunda
  ejecución el tiempo se reduce significativamente.

### Endpoints excluidos con hallazgos de seguridad

- **`/api/seed`** — no requiere autenticación y escribe datos masivos en la base de datos.
  Cualquier cliente puede invocar `POST /api/seed` sin credenciales. Hallazgo para Módulo 10.

- **`/api/subscriptions/webhook`** — no requiere autenticación. Un cliente externo podría
  enviar eventos falsos y modificar el estado de suscripciones. Hallazgo para Módulo 10.

- **`/api/products/[id]`** (PUT y DELETE) — no requieren autenticación. Cualquier cliente
  puede actualizar o eliminar productos sin credenciales. Hallazgo para Módulo 10.

### Pendientes para módulos posteriores

- Implementar `cy.intercept()` con stubbing de fixtures para desacoplar las pruebas de
  `/api/climate`, `/api/weather`, `/api/earthquakes` y `/api/biodiversity` de sus APIs externas.
- Cobertura de `GET /api/products/[id]` cuando haya IDs de prueba controlados.
- Documentar formalmente los hallazgos de seguridad en Módulo 10.
- `/api/biodiversity` excluida por latencia conocida desde Módulo 5 — incorporar en Módulo futuro con stub.

---

## Cierre del módulo

El Módulo 6 queda técnicamente cubierto con:

- Pruebas API positivas sobre endpoints reales del proyecto
- Pruebas API negativas seguras validando comportamiento de autenticación
- Contratos mínimos documentados como fixtures reutilizables
- Validación de status codes, headers y estructura de body
- Suite completa: **12/12 passing — exit code 0**

Commit técnico: `bc26e65 test(api): ampliar cobertura de pruebas API con cy.request`
