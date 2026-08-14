# Mejoras recomendadas para desarrolladores — Biodiversidad de Chile

## Propósito del documento

Este documento reúne recomendaciones técnicas detectadas durante el curso QA/Test Automation
sobre el proyecto Biodiversidad de Chile.

No son tareas del curso inmediato. Son un **backlog futuro** para mejorar la seguridad,
estabilidad, mantenibilidad, testabilidad, experiencia móvil, accesibilidad y CI/CD de la
aplicación.

Estas mejoras deberían abordarse después de terminar los módulos del curso.

---

## Resumen ejecutivo

La app Biodiversidad de Chile ya cuenta con una base de pruebas E2E, API, BDD y mobile web.
Sin embargo, durante el proceso QA se detectaron oportunidades reales de mejora en seguridad
de endpoints, manejo de APIs externas, testabilidad del frontend, accesibilidad, responsive
mobile, scripts de testing y automatización CI/CD.

**Prioridades principales:**

1. Seguridad de endpoints que modifican datos.
2. Estabilidad de APIs externas.
3. Selectores estables para automatización.
4. Responsive mobile.
5. Accesibilidad.
6. Scripts de testing.
7. CI/CD.

---

## Prioridad 1 — Seguridad de endpoints

### Problema detectado

Algunos endpoints que escriben, actualizan o eliminan datos requieren revisión de
autenticación y autorización. Durante las pruebas QA se identificaron rutas que podrían
estar expuestas sin validación de identidad.

Endpoints a revisar:

- `/api/seed`
- `/api/products/[id]` con métodos `PUT` y `DELETE`
- `/api/subscriptions/webhook`
- Otros endpoints `POST`/`PUT`/`DELETE` que escriban en base de datos

### Riesgo

- Inserción de datos no autorizada desde el exterior.
- Eliminación o modificación de productos sin autenticación.
- Manipulación de suscripciones.
- Exposición de operaciones administrativas.
- Riesgo en producción si estos endpoints quedan abiertos.

### To-do list

- [ ] Auditar todos los endpoints en `src/app/api/`.
- [ ] Clasificar endpoints por método: `GET`, `POST`, `PUT`, `DELETE`.
- [ ] Identificar cuáles escriben o modifican datos.
- [ ] Exigir autenticación en endpoints sensibles.
- [ ] Agregar autorización por rol cuando corresponda.
- [ ] Proteger `/api/seed` o deshabilitarlo en producción.
- [ ] Proteger `PUT`/`DELETE` de `/api/products/[id]`.
- [ ] Validar firma o secret en `/api/subscriptions/webhook`.
- [ ] Estandarizar respuestas `401` y `403`.
- [ ] Agregar tests negativos para endpoints protegidos.
- [ ] Documentar política de seguridad de API.

### Recomendación técnica

- Usar middleware de autenticación en el nivel de route handler.
- Validar sesión o token antes de cualquier operación sobre base de datos.
- Validar permisos por rol (usuario vs. administrador).
- Nunca confiar solo en el frontend para restringir acceso.
- Devolver errores controlados: nunca exponer stack traces ni detalles de base de datos.

---

## Prioridad 2 — Manejo de APIs externas

### Problema detectado

La app consume APIs externas para clima, sismos, biodiversidad y otros datos ambientales.
Estas dependencias pueden fallar por latencia, rate limits, caída del proveedor o respuestas
inesperadas.

### Riesgo

- Tests flaky por inestabilidad del proveedor externo.
- Errores 500 visibles al usuario cuando el servicio externo falla.
- Pantallas rotas o vacías sin feedback al usuario.
- Mala experiencia de usuario en condiciones de red degradada.
- Dependencia excesiva de servicios fuera del control del equipo.

### To-do list

- [ ] Identificar todos los endpoints que dependen de APIs externas.
- [ ] Agregar timeout controlado a cada llamada externa.
- [ ] Implementar fallback si un proveedor falla.
- [ ] Agregar cache donde tenga sentido (datos que cambian poco).
- [ ] Estandarizar errores de servicio externo con mensaje amigable.
- [ ] Evitar que errores externos rompan la página completa.
- [ ] Agregar logs controlados para debugging en producción.
- [ ] Crear fixtures/mocks para pruebas automatizadas.
- [ ] Separar tests de contrato interno de tests contra servicios reales.

### Ejemplo de respuesta recomendada

```json
{
  "error": "external_service_unavailable",
  "message": "No se pudo obtener información externa en este momento."
}
```

---

## Prioridad 3 — Testabilidad del frontend

### Problema detectado

Las pruebas actuales validan elementos como `<header>` o estructura general, pero para una
suite robusta se necesitan selectores estables que sobrevivan cambios de diseño sin romper
los tests.

### Riesgo

- Tests frágiles que fallan por cambios visuales menores.
- Fallos por renombrar clases CSS o cambiar texto visible.
- Dependencia de selectores inestables.
- Dificultad para automatizar flujos complejos como formularios, filtros y navegación.

### To-do list

- [ ] Agregar `data-testid` o `data-cy` en elementos críticos.
- [ ] Definir convención única: `data-testid` o `data-cy` — no mezclar.
- [ ] Agregar selectores a header, navegación y menú móvil.
- [ ] Agregar selectores a botones CTA (call-to-action).
- [ ] Agregar selectores a cards de productos y servicios.
- [ ] Agregar selectores a formularios y campos de entrada.
- [ ] Agregar selectores a filtros y búsqueda.
- [ ] Agregar selectores a mensajes de loading.
- [ ] Agregar selectores a mensajes de error.
- [ ] Agregar selectores a estados vacíos.
- [ ] Documentar la convención para futuros componentes.

### Ejemplos

```html
<header data-testid="main-header">

<button data-testid="open-menu-button">

<section data-testid="products-list">
```

---

## Prioridad 4 — Responsive mobile

### Problema detectado

El proyecto es una aplicación web Next.js — no tiene app móvil nativa. Por lo tanto, la
estrategia correcta es fortalecer el mobile web/responsive testing para garantizar que la
experiencia desde celulares sea correcta.

### Riesgo

- Scroll horizontal en pantallas pequeñas.
- Menú móvil roto o inaccesible.
- Cards desalineadas en viewport angosto.
- Botones demasiado pequeños para tocar con el dedo.
- Formularios difíciles de usar en móvil.
- Mala experiencia de usuario desde dispositivos móviles reales.

### To-do list

- [ ] Revisar Home completa en viewport móvil (390px).
- [ ] Validar apertura y cierre del menú móvil.
- [ ] Validar formularios en móvil (campos, labels, botones).
- [ ] Validar cards en pantallas pequeñas (alineación, overflow).
- [ ] Validar filtros y búsqueda en móvil.
- [ ] Validar que no exista scroll horizontal en ninguna ruta.
- [ ] Probar con al menos iPhone 12 y Pixel 5 emulado con Playwright.
- [ ] Evaluar instalación de WebKit si se necesita mayor fidelidad Safari/iOS.
- [ ] Agregar pruebas responsive por rutas críticas.

### Recomendación

Mantener Playwright mobile para mobile web testing. No instalar Appium hasta que exista app
móvil real — APK, React Native, Expo, Ionic o Capacitor. Para el proyecto actual, Playwright
con `devices` es suficiente.

---

## Prioridad 5 — Accesibilidad

### Problema detectado

La automatización moderna funciona mejor cuando la interfaz usa HTML semántico y roles
accesibles. Además, mejora la experiencia de usuarios reales con tecnologías asistivas.

### Riesgo

- Botones no detectables por lectores de pantalla.
- Formularios sin labels asociados.
- Mala navegación por teclado.
- Bajo cumplimiento de estándares de accesibilidad (WCAG).
- Tests menos robustos porque los selectores por rol no funcionan si no hay roles definidos.

### To-do list

- [ ] Revisar jerarquía de headings: `h1`, `h2`, `h3` en orden lógico.
- [ ] Usar `<button>` real para acciones clickeables (no `<div>` con onClick).
- [ ] Evitar elementos `div` o `span` clickeables sin rol explícito.
- [ ] Asociar `<label>` con `<input>` en todos los formularios.
- [ ] Agregar `aria-label` cuando el texto visible no describe suficientemente el elemento.
- [ ] Validar que el foco sea visible al navegar con teclado.
- [ ] Validar contraste básico entre texto y fondo.
- [ ] Usar selectores por rol en Playwright cuando sea posible (`getByRole('button')`).
- [ ] Agregar revisión automatizada con Lighthouse o axe en etapa futura.

### Ejemplo

```html
<button aria-label="Abrir menú principal">
```

---

## Prioridad 6 — Scripts de testing

### Problema detectado

Los comandos de prueba son funcionales, pero conviene formalizar scripts `npm` para facilitar
la ejecución local y la futura integración en CI/CD.

### To-do list

- [ ] Agregar script dedicado para Playwright.
- [ ] Agregar script dedicado para Cypress.
- [ ] Agregar script dedicado para Cucumber.
- [ ] Agregar script QA unificado que ejecute los tres en secuencia.
- [ ] Documentar el orden recomendado de ejecución.
- [ ] Separar tests rápidos de tests lentos si la suite crece.

### Propuesta futura

> Esta propuesta debe implementarse durante el Módulo 10 — CI/CD, no antes.

```json
{
  "scripts": {
    "test:playwright": "playwright test",
    "test:cypress": "cypress run",
    "test:cucumber": "cucumber-js",
    "test:qa": "npm run test:playwright && npm run test:cypress && npm run test:cucumber"
  }
}
```

---

## Prioridad 7 — CI/CD

### Problema detectado

Las pruebas existen y pasan localmente, pero deben ejecutarse automáticamente en cada push
o pull request para aportar valor continuo y detectar regresiones sin intervención manual.

### To-do list

- [ ] Crear workflow GitHub Actions en `.github/workflows/qa.yml`.
- [ ] Ejecutar `npm ci` para instalar dependencias de forma limpia.
- [ ] Ejecutar `npm run build` para validar que el proyecto compila.
- [ ] Instalar browsers Playwright (`npx playwright install --with-deps chromium`).
- [ ] Levantar servidor Next.js en background (`npm run dev &`).
- [ ] Esperar que `http://localhost:3000` responda antes de ejecutar tests.
- [ ] Ejecutar Playwright (`npx playwright test`).
- [ ] Ejecutar Cypress (`npx cypress run`).
- [ ] Ejecutar Cucumber (`npx cucumber-js`).
- [ ] Guardar artefactos de fallo (screenshots, traces, videos).
- [ ] Publicar reportes cuando corresponda.
- [ ] Ejecutar workflow en `push` y `pull_request` sobre `qa-automation-course`.
- [ ] Evaluar activarlo en `main` cuando la rama QA esté estable.

---

## Prioridad 8 — Datos de prueba y ambientes

### Problema detectado

Algunos tests dependen de endpoints reales y datos reales o dinámicos, lo que puede
generar resultados inconsistentes o modificar datos de producción accidentalmente.

### To-do list

- [ ] Definir un ambiente de testing separado de producción.
- [ ] Separar datos seed de producción.
- [ ] Crear datos de prueba controlados y reproducibles.
- [ ] Evitar que los tests modifiquen datos reales.
- [ ] Definir estrategia de limpieza después de cada ciclo de prueba.
- [ ] Crear fixtures para respuestas de APIs externas.
- [ ] Documentar qué tests son seguros para ejecutar en CI.

---

## Prioridad 9 — Observabilidad y debugging

### Problema detectado

Cuando una prueba falla, el equipo necesita evidencia clara para diagnosticar el problema
rápidamente, especialmente en CI donde no hay sesión visual.

### To-do list

- [ ] Mantener screenshots y videos fuera de Git (ya está en `.gitignore`).
- [ ] Guardar artefactos en CI cuando fallen tests (upload-artifact en GitHub Actions).
- [ ] Revisar traces de Playwright con `npx playwright show-trace`.
- [ ] Capturar logs del servidor durante ejecución CI.
- [ ] Documentar errores conocidos y sus workarounds.
- [ ] Crear checklist de debugging para el equipo.

---

## Backlog priorizado

| Prioridad | Área | Tarea | Impacto | Esfuerzo | Responsable sugerido | Estado |
|---|---|---|---|---|---|---|
| 1 | Seguridad | Proteger `/api/seed` | Alto | Medio | Backend | Pendiente |
| 2 | Seguridad | Proteger `PUT`/`DELETE` `/api/products/[id]` | Alto | Medio | Backend | Pendiente |
| 3 | Seguridad | Validar webhook de suscripciones | Alto | Medio | Backend | Pendiente |
| 4 | APIs externas | Agregar timeouts y fallbacks | Alto | Medio | Backend | Pendiente |
| 5 | Frontend | Agregar `data-testid`/`data-cy` | Medio | Bajo | Frontend | Pendiente |
| 6 | Mobile | Revisar menú móvil | Medio | Bajo | Frontend | Pendiente |
| 7 | Accesibilidad | Labels y roles semánticos | Medio | Medio | Frontend | Pendiente |
| 8 | Testing | Agregar scripts npm QA | Medio | Bajo | QA/DevOps | Pendiente |
| 9 | CI/CD | Crear workflow GitHub Actions | Alto | Medio | DevOps/QA | Pendiente |
| 10 | Datos | Definir ambiente de testing | Alto | Alto | Equipo | Pendiente |

---

## Criterio de cierre del proyecto de mejoras

- [ ] Endpoints sensibles protegidos con autenticación y autorización.
- [ ] Errores de APIs externas controlados con fallbacks y mensajes amigables.
- [ ] Selectores estables (`data-testid`/`data-cy`) incorporados al código fuente.
- [ ] Mobile responsive validado en viewports críticos sin scroll horizontal.
- [ ] Accesibilidad básica revisada: headings, labels, roles, contraste.
- [ ] Scripts QA disponibles en `package.json`.
- [ ] CI/CD ejecutando pruebas automáticamente en cada push/PR.
- [ ] Documentación actualizada y accesible para el equipo.
- [ ] Evidencia de pruebas guardada y accesible en CI.

---

## Nota final

Este documento debe retomarse después de terminar el curso QA. No reemplaza la documentación
de módulos, sino que transforma los hallazgos del proceso de testing en un backlog accionable
para el equipo de desarrollo.

Las mejoras aquí listadas no son opcionales a largo plazo — son la diferencia entre una app
con cobertura de pruebas y una app realmente mantenible, segura y testeable en producción.
