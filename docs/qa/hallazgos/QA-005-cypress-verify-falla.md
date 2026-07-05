# QA-005 — Verificación del binario de Cypress falla al ejecutar

| Campo | Valor |
|---|---|
| ID | QA-005 |
| Fecha de detección | 2026-07-05 |
| Fecha de resolución | 2026-07-05 |
| Entorno | Desarrollo local — Windows 10 Pro 10.0.19045 |
| Fase interna del proyecto | Módulo 4 — Cypress básico |
| Módulo oficial relacionado | Módulo 4 — Cypress básico |
| Severidad | Alta |
| Prioridad | Alta |
| Estado | **Resuelto — workaround aplicado** |

## Descripción
Al intentar ejecutar cualquier prueba con Cypress desde dentro de VSCode
(o Claude Code, que corre sobre VSCode), el proceso fallaba antes de
cargar cualquier spec file. `npx cypress verify` reportaba que el binario
no podía iniciarse.

## Síntomas observados

- `Cypress.exe --version` devolvía `v22.19.0` (versión de Node.js, no de Cypress)
- `npx cypress verify` fallaba con:
  ```
  bad option: --smoke-test
  bad option: --ping=N
  ```
- `npx cypress run` fallaba antes de cargar cualquier spec file
- Una instalación limpia (`npx cypress cache clear` + `npx cypress install`)
  producía exactamente el mismo error

## Datos de diagnóstico

**`npx cypress version`** (tras resolver)
```
Cypress package version: 15.17.0
Cypress binary version:  15.17.0
Electron version:        37.6.0
Bundled Node version:    22.19.0
```

**`npx cypress cache path`**
```
C:\Users\Usuario\AppData\Local\Cypress\Cache
```

**`npx cypress cache list --size`**
```
┌─────────┬───────────────┬─────────┐
│ version │ last used     │ size    │
├─────────┼───────────────┼─────────┤
│ 15.17.0 │ last used     │ 748.7MB │
└─────────┴───────────────┴─────────┘
```

**`npx cypress verify` — mensaje exacto antes de resolver**
```
> Verifying Cypress can run
  C:\Users\Usuario\AppData\Local\Cypress\Cache\15.17.0\Cypress

× [FAILED: Cypress failed to start.

This may be due to a missing library or dependency.
https://on.cypress.io/required-dependencies

----------
C:\Users\Usuario\AppData\Local\Cypress\Cache\15.17.0\Cypress\Cypress.exe: bad option: --smoke-test
C:\Users\Usuario\AppData\Local\Cypress\Cache\15.17.0\Cypress\Cypress.exe: bad option: --ping=723
----------

Platform: win32-x64 (Microsoft Windows 10 Pro - 10.0.19045)
Cypress Version: 15.17.0
```

**`npx cypress verify` — mensaje tras aplicar workaround**
```
> Verifying Cypress can run
  C:\Users\Usuario\AppData\Local\Cypress\Cache\15.17.0\Cypress

√ Verified Cypress!
  C:\Users\Usuario\AppData\Local\Cypress\Cache\15.17.0\Cypress
```

## Hipótesis descartadas

1. **Discrepancia de versiones entre paquete npm y binario:** descartada.
   Ambas versiones son `15.17.0` según `npx cypress version`.
2. **Binario corrupto o descarga incompleta:** descartada. La secuencia
   `npx cypress cache clear` + `npx cypress install` descargó un binario
   nuevo que produjo exactamente el mismo error.
3. **Dependencia del sistema operativo faltante (Visual C++, WebView2):**
   no fue necesario verificarla. El problema se resolvió antes de llegar
   a este diagnóstico.

## Causa raíz confirmada

**Variable de entorno `ELECTRON_RUN_AS_NODE=1` heredada del proceso padre.**

VSCode es una aplicación Electron. Al ejecutar procesos hijos (terminal
integrada, extensiones), establece la variable `ELECTRON_RUN_AS_NODE=1`
para evitar que esos procesos también se comporten como aplicaciones Electron.
Claude Code corre dentro de VSCode y propaga esa variable a cada proceso
PowerShell que lanza.

Cuando `ELECTRON_RUN_AS_NODE=1` está activa, `Cypress.exe` (que también
es Electron) arranca como un proceso Node.js ordinario en lugar de como
una aplicación Electron. Node.js no entiende los flags `--smoke-test` ni
`--ping=N`, que son parte del protocolo interno de verificación de Cypress,
y los rechaza con `bad option`.

## Evidencia de la causa raíz

```powershell
# Valor en la sesión actual (heredado del proceso padre — VSCode/Claude Code)
Get-ChildItem Env:ELECTRON_RUN_AS_NODE
→ ELECTRON_RUN_AS_NODE = 1

# En el perfil del usuario (persistente)
[Environment]::GetEnvironmentVariable("ELECTRON_RUN_AS_NODE", "User")
→ (vacío — no definida)

# En el sistema operativo (persistente)
[Environment]::GetEnvironmentVariable("ELECTRON_RUN_AS_NODE", "Machine")
→ (vacío — no definida)
```

La variable NO es persistente — es solo parte de la sesión heredada del
proceso padre. Eliminarla en un comando y ejecutarla en otro no sirve,
porque cada nuevo proceso la recibe nuevamente del padre.

## Workaround temporal aplicado

> **Este workaround es temporal y por sesión.** No resuelve la causa raíz
> de forma permanente. `ELECTRON_RUN_AS_NODE=1` reaparece en cada nueva
> sesión de PowerShell lanzada desde VSCode o Claude Code.

Eliminar `ELECTRON_RUN_AS_NODE` en el **mismo proceso** que ejecuta Cypress:

```powershell
Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue
npx cypress verify        # ✅ √ Verified Cypress!
npx cypress run ...       # ✅ funciona
```

Este patrón debe aplicarse en **cada comando de Cypress** ejecutado
desde la terminal integrada de VSCode o desde Claude Code. Si se ejecuta
en un proceso separado del que elimina la variable, la variable reaparece
y el error vuelve a ocurrir.

## Impacto

- **Antes del workaround:** bloqueaba completamente cualquier ejecución de Cypress
- **Después del workaround (temporal):** Cypress funciona en la sesión actual
- **Persistencia:** la variable reaparece en cada nueva sesión. El workaround
  debe repetirse en cada ejecución desde este entorno.

## Solución permanente pendiente

Opciones evaluadas, pendientes de aprobación:

1. **Script npm `cypress:run` en `package.json`:** agregar un script que
   incluya la eliminación de la variable antes de ejecutar Cypress.
   Requiere modificación de `package.json` — pendiente de aprobación.

   ```json
   "cypress:run": "npx cross-env-shell \"Remove-Item Env:ELECTRON_RUN_AS_NODE & cypress run\""
   ```
   (o equivalente multiplataforma)

2. **Configuración del terminal de VSCode:** editar `.vscode/settings.json`
   para que el terminal integrado no herede `ELECTRON_RUN_AS_NODE`.
   Requiere crear o modificar configuración de VSCode — pendiente de aprobación.

3. **Script auxiliar de ejecución:** crear un archivo `.ps1` o `.sh` en el
   repositorio que envuelva cada ejecución de Cypress con la eliminación previa
   de la variable. No modifica `package.json`.

Ninguna de estas opciones se implementa hasta recibir aprobación.

## Decisión

Workaround temporal documentado y aplicado por sesión. La solución permanente
está pendiente de aprobación. No se modifica ninguna variable de entorno del
sistema ni del perfil del usuario.

## Rama
`qa-automation-course` (problema de entorno, no de código de la aplicación)

## Resultado
✅ Resuelto con workaround. `npx cypress verify` pasa correctamente.
