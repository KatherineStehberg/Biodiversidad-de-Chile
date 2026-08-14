# Errores Frecuentes — Biblioteca de Referencia

Registro de errores reales encontrados durante el curso, con su diagnóstico
y resolución. Se amplía módulo a módulo.

---

## E-001 — Cypress: "no spec files were found"

**¿Cuándo aparece?**
Al ejecutar `npx cypress run` o al abrir Cypress, cuando no encuentra
archivos de prueba con el patrón configurado.

**Mensaje exacto**
```
Can't run because no spec files were found.
```

**Causa en este proyecto**
La configuración de `cypress.config.ts` no tenía `defineConfig` ni
`specPattern` explícito que cubriera archivos `.cy.js`.

**Resolución aplicada**
Se agregó `defineConfig` y se definió explícitamente:
```typescript
specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'
```

**Módulo:** 4 — Cypress básico
**Documentado en:** `docs/qa/03-cypress-basico.md`

---

## E-002 — npm run dev: primera respuesta lenta (~4 s)

**¿Cuándo aparece?**
En la primera visita a cualquier ruta después de iniciar el servidor.
Next.js compila la ruta bajo demanda (*Just-In-Time*).

**Mensaje en el servidor**
```
⚙ Compiling / ...
✓ Compiled / in 2.7s (838 modules)
GET / 200 in 4242ms
```

**Causa**
Next.js en modo desarrollo compila cada ruta la primera vez que se visita.
Las visitas posteriores son mucho más rápidas.

**Impacto en pruebas**
Si Cypress falla por timeout durante la primera visita, puede deberse a
la compilación inicial de Next.js y no necesariamente a un problema del test.

**Acción recomendada**
Si aparece un error de timeout, primero determinar su origen exacto:
- ¿Afecta a `cy.visit()`? → revisar `pageLoadTimeout`
- ¿Afecta a un selector dentro de la página? → revisar `defaultCommandTimeout`
- ¿Es la compilación inicial de Next.js? → el servidor puede necesitar
  más tiempo antes de recibir la primera solicitud

No se modifica ningún timeout en esta fase sin haber identificado primero
cuál es el responsable.

**Módulo:** 4 — Cypress básico
**Documentado en:** `docs/qa/02-estabilizacion-del-proyecto.md`

---

## E-003 — HTTP timeout al hacer request a localhost

**¿Cuándo aparece?**
Al hacer una solicitud HTTP a `http://localhost:3000` justo después de que
el servidor reporta "Ready", pero antes de que haya compilado alguna ruta.

**Causa**
El servidor está listo para recibir solicitudes, pero aún no ha compilado
ninguna ruta. La primera compilación tarda varios segundos.

**Resolución aplicada**
Esperar 10 segundos adicionales después del mensaje "Ready in" antes
de hacer la solicitud HTTP, con un timeout de 40 segundos en la petición.

**Módulo:** Fase de estabilización
**Documentado en:** `docs/qa/02-estabilizacion-del-proyecto.md`

---

*Se agregarán nuevos errores a medida que avance el curso.*
