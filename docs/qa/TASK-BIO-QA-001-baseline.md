# TASK-BIO-QA-001 — Baseline Build, Lint, TypeScript y CI

## Problema original

La auditoría inicial encontró que `npm run build` terminaba sin diagnóstico útil,
`npm run lint` usaba `next lint` y no completaba, no existía un script explícito de
type-check y el workflow QA no ejecutaba TypeScript ni ESLint como gates separados.

Se preservaron el cambio local previo de `next.config.ts`
(`ignoreBuildErrors: true` a `false`) y la carpeta untracked `Microsoft/`.

## Causa raíz del build

Clasificación: `ENVIRONMENT_FAILURE` con mitigación de configuración.

Con el worker de webpack predeterminado, Next.js 15.5.18 llegaba a
`Creating an optimized production build` y el proceso terminaba abruptamente con
código `-1`, sin excepción, archivo o stack. Windows no registró un crash de
`node.exe` en el log de aplicación.

Al configurar `experimental.webpackBuildWorker: false`, la compilación dejó de
terminar abruptamente. La ejecución diagnóstica de Next.js completó las 47 páginas,
validó TypeScript y terminó con exit code 0. El consumo máximo observado fue menor
al 20 % del heap disponible, por lo que no fue un agotamiento de memoria.

La configuración no omite errores ni reduce gates; ejecuta webpack en el proceso
principal para evitar el fallo del worker observado en este entorno Windows.

## Causa raíz de lint

`package.json` llamaba a `next lint`, comando deprecado desde Next.js 15.5. ESLint 9
usa `eslint.config.mjs` (Flat Config), por lo que `.eslintrc.json` no era la
configuración activa al ejecutar ESLint directamente.

La Flat Config no contenía los ignores recomendados para artefactos generados.
`eslint .` analizaba `.next/` y reportaba 286 problemas, la mayoría dentro de
archivos generados. Tras agregar los ignores quedaron visibles 80 errores reales
del código fuente: 59 `no-explicit-any`, 17 `no-unused-vars` y 4
`react/no-unescaped-entities`, además de 2 warnings `no-img-element`.

Las incompatibilidades propias de herramientas se resolvieron con overrides
acotados por archivo: declaration merging de Cypress (`namespace`) y step
definitions CommonJS de Cucumber (`require`). No hay reglas globales desactivadas.

`.eslintrc.json` se conserva sin cambios como deuda histórica; su eventual retiro
debe tratarse por separado en el issue QA-003/#5.

## Cambios realizados

- `package.json`: `lint` ahora ejecuta `eslint .`; se agregó `type-check` con
  `tsc --noEmit`.
- `eslint.config.mjs`: ignores de artefactos y overrides acotados para
  Cypress/Cucumber, sin desactivar reglas globalmente.
- `next.config.ts`: se preservó `ignoreBuildErrors: false` y se desactivó el worker
  experimental de webpack.
- `.github/workflows/qa.yml`: type-check y lint se ejecutan antes del build; las
  suites existentes permanecen después del servidor.

No se cambiaron dependencias, lockfile, tests ni funcionalidad de dominio.

## Comandos y resultados

| Comando | Resultado | Evidencia |
|---|---|---|
| `npm run type-check` | PASS | `tsc --noEmit`, exit code 0 |
| `npm run lint` | FAIL — deuda #5 | 80 errores y 2 warnings; sin reglas globales desactivadas |
| `next build --experimental-debug-memory-usage` | PASS | 47/47 páginas, tipos válidos, exit code 0 |
| `npm run type-check` | PASS | exit code 0 |
| `npm run build` | PASS | 47/47 páginas, exit code 0 |
| `npx playwright test` | FAIL inicial | 6/7; timeout del primer `page.goto('/')` |
| calentamiento + `npx playwright test` | PASS | 7/7; cold-start conocido confirmado; segunda validación 7/7 |
| `npx cypress run` con workaround QA-005 | PASS | 5 specs, 12/12 tests, exit code 0 |
| `npm run cucumber` | PASS | 1 escenario, 5 pasos, exit code 0 |

Todas las ejecuciones de aplicación usaron variables mock equivalentes a CI. No se
usaron credenciales reales ni se escribieron datos en Supabase real.

## CI

El orden del workflow queda: `npm ci`, instalación de Chromium, `npm run
type-check`, `npm run lint`, `npm run build`, servidor, Playwright, Cypress y
Cucumber. No se cambió la estrategia de mocks ni se agregaron secrets.

## Riesgos

- El build de Windows es lento con el worker desactivado; debe compararse con el
  runner Ubuntu de GitHub Actions.
- Lint permanece bloqueado por 80 errores reales registrados en #5. El gate falla
  de forma intencional en vez de ocultar la deuda con reglas globales `off`.
- Cypress mantiene el workaround ambiental QA-005 y tarda en emitir salida local,
  aunque la ejecución final pasó 12/12.
- Playwright conserva flakiness de cold-start; con servidor calentado pasa 7/7.

## Deuda pendiente

- Resolver y cerrar la deuda ESLint histórica en #5 sin mezclarla con este ticket.
- Evaluar en un ticket posterior si `.eslintrc.json` puede retirarse.
- Mejorar la reproducibilidad de arranque/calientamiento de las suites E2E.

## Revisión del Orquestador

El review posterior del PR #7 detectó que la primera versión había migrado tres
reglas históricas como `off` globales. Se retiraron por completo
`@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-unused-vars` y
`react/no-unescaped-entities` del Flat Config. La medición posterior dejó visible
la deuda real de 80 errores en 32 archivos, vinculada al issue #5.

Resultados posteriores al cambio solicitado:

- type-check: PASS;
- lint: FAIL esperado por deuda #5 — 80 errores, 2 warnings;
- build: PASS — 47/47 páginas;
- Playwright: PASS — 7/7;
- Cypress: PASS — 12/12;
- Cucumber: PASS — 1 escenario, 5 pasos.
