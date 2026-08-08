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

La Flat Config no contenía los ignores recomendados para artefactos generados ni
los overrides históricos de `.eslintrc.json`. `eslint .` analizaba `.next/` y
reportaba 286 problemas, la mayoría dentro de archivos generados. Tras migrar los
ignores y overrides existentes, sólo quedaron incompatibilidades acotadas de las
herramientas: declaration merging de Cypress (`namespace`) y step definitions
CommonJS de Cucumber (`require`). Se añadieron overrides sólo para esas rutas.

`.eslintrc.json` se conserva sin cambios como deuda histórica; su eventual retiro
debe tratarse por separado en el issue QA-003/#5.

## Cambios realizados

- `package.json`: `lint` ahora ejecuta `eslint .`; se agregó `type-check` con
  `tsc --noEmit`.
- `eslint.config.mjs`: ignores de artefactos, migración de reglas históricas y
  overrides acotados para Cypress/Cucumber.
- `next.config.ts`: se preservó `ignoreBuildErrors: false` y se desactivó el worker
  experimental de webpack.
- `.github/workflows/qa.yml`: type-check y lint se ejecutan antes del build; las
  suites existentes permanecen después del servidor.

No se cambiaron dependencias, lockfile, tests ni funcionalidad de dominio.

## Comandos y resultados

| Comando | Resultado | Evidencia |
|---|---|---|
| `npm run type-check` | PASS | `tsc --noEmit`, exit code 0 |
| `npm run lint` | PASS | 0 errores, 3 warnings preexistentes, exit code 0 |
| `next build --experimental-debug-memory-usage` | PASS | 47/47 páginas, tipos válidos, exit code 0 |
| `npm run type-check && npm run lint && npm run build` | PASS | tres gates consecutivos; build 47/47, exit code 0 |
| `npx playwright test` | FAIL inicial | 6/7; timeout del primer `page.goto('/')` |
| calentamiento + `npx playwright test` | PASS | 7/7; cold-start conocido confirmado |
| `npx cypress run` con workaround QA-005 | FAIL ambiental | intento local terminó por timeout del ejecutor sin salida |
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
- Quedan tres warnings de lint no bloqueantes: dos usos de `<img>` y una directiva
  ESLint innecesaria.
- Cypress mantiene el workaround ambiental QA-005 y puede exceder el timeout local.
- Playwright conserva flakiness de cold-start; con servidor calentado pasa 7/7.

## Deuda pendiente

- Resolver y cerrar la deuda ESLint histórica en #5 sin mezclarla con este ticket.
- Evaluar en un ticket posterior si `.eslintrc.json` puede retirarse.
- Mejorar la reproducibilidad de arranque/calientamiento de las suites E2E.
