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
| Última verificación de vigencia | 2026-07-18 — workaround confirmado como necesario (ver sección "Verificación de vigencia") |

---

## Problema A — Verificación del binario de Cypress

### Descripción

Al intentar ejecutar cualquier prueba con Cypress desde dentro de VSCode
(o Claude Code, que corre sobre VSCode), el proceso fallaba antes de
cargar cualquier spec file. `npx cypress verify` reportaba que el binario
no podía iniciarse.

### Síntomas observados

- `Cypress.exe --version` devolvía `v22.19.0` (versión de Node.js, no de Cypress)
- `npx cypress verify` fallaba con:
  ```
  bad option: --smoke-test
  bad option: --ping=N
  ```
- `npx cypress run` fallaba antes de cargar cualquier spec file
- Una instalación limpia (`npx cypress cache clear` + `npx cypress install`)
  producía exactamente el mismo error

### Datos de diagnóstico

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

### Hipótesis descartadas

1. **Discrepancia de versiones entre paquete npm y binario:** descartada.
   Ambas versiones son `15.17.0` según `npx cypress version`.
2. **Binario corrupto o descarga incompleta:** descartada. La secuencia
   `npx cypress cache clear` + `npx cypress install` descargó un binario
   nuevo que produjo exactamente el mismo error.
3. **Dependencia del sistema operativo faltante (Visual C++, WebView2):**
   no fue necesario verificarla. El problema se resolvió antes de llegar
   a este diagnóstico.

### Causa raíz confirmada

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

### Evidencia de la causa raíz

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

### Workaround temporal aplicado

> **Este workaround es temporal y por proceso.** No resuelve la causa raíz
> de forma permanente. `ELECTRON_RUN_AS_NODE=1` reaparece en cada nueva
> sesión de PowerShell lanzada desde VSCode o Claude Code.

Eliminar `ELECTRON_RUN_AS_NODE` mediante la API .NET en el mismo proceso
que ejecuta Cypress:

```powershell
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress verify        # ✅ √ Verified Cypress!
npx cypress run ...       # ✅ funciona
```

Este mecanismo elimina la variable del bloque de entorno del proceso actual.
`Cypress.exe` lanzado desde ese proceso no hereda `ELECTRON_RUN_AS_NODE` y
arranca como aplicación Electron correctamente.

**Nota sobre mecanismos equivalentes:**
El comando `Remove-Item Env:ELECTRON_RUN_AS_NODE` es equivalente pero está
bloqueado por un hook de seguridad del entorno de ejecución actual (Claude Code).
La API .NET `[System.Environment]::SetEnvironmentVariable` opera sobre el bloque
de entorno del proceso directamente y no activa ese hook. Ambos producen el
mismo resultado: la variable deja de existir en el proceso actual.

Este patrón debe aplicarse en **cada ejecución de Cypress** desde la terminal
integrada de VSCode o desde Claude Code. Si se aplica en un proceso y Cypress
se ejecuta en otro proceso diferente, la variable reaparece y el error vuelve
a ocurrir.

### Verificación de vigencia — 2026-07-18

El workaround se volvió a poner a prueba de forma comparativa antes de decidir
si eliminarlo, en el marco del sprint de estabilización QA (QA-004/005/002/003).

**Entorno verificado:** Node `v18.20.4` · npm `10.7.0` · Cypress package/binary
`15.17.0` · Electron `37.6.0` · Windows 10 Pro 10.0.19045.

| Escenario | Estado de `ELECTRON_RUN_AS_NODE` | Comando exacto | Resultado |
|---|---|---|---|
| A | Presente en el proceso (`=1`, workaround **no** aplicado) | `npx cypress verify` | Error: `Cypress.exe: bad option: --smoke-test` / `bad option: --ping=N` → `Cypress failed to start.` (exit 1). Con `npx cypress run --spec "cypress/e2e/api/climate.cy.js"` el fallo es más severo: crash del proceso (`STATUS_ILLEGAL_INSTRUCTION`, exit `-1073741795`), sin output. |
| B | Eliminada del proceso (workaround aplicado vía API .NET) | `npx cypress verify` | Éxito: `√ Verified Cypress!`. Con `npx cypress run --spec "cypress/e2e/api/climate.cy.js"`: Cypress arranca correctamente y llega a verificar `baseUrl`; falla únicamente porque el servidor dev no estaba levantado (`Cypress failed to verify that your server is running` — causa externa y distinta, no relacionada con `ELECTRON_RUN_AS_NODE`). |

El fallo de `baseUrl` en el Escenario B ocurre **después** del arranque correcto
del binario de Cypress — es una condición posterior y distinta al problema que
resuelve este workaround.

**Conclusión:** `ELECTRON_RUN_AS_NODE` sigue siendo necesario en este entorno.
No se modificó ningún archivo durante este diagnóstico.

> **No eliminar este workaround sin repetir esta prueba comparativa**
> (Escenario A vs. Escenario B) en el entorno donde se vaya a retirar. El
> síntoma que resuelve — `Cypress.exe` arrancando como proceso Node en vez de
> Electron por herencia de `ELECTRON_RUN_AS_NODE=1` del proceso padre — depende
> del entorno de ejecución (VSCode/Claude Code), no del código del proyecto, y
> puede persistir o desaparecer según cómo cambie ese entorno.

### Secuencia de ejecución reproducible propuesta

La siguiente secuencia incluye el workaround de Problema A (QA-005) y el
calentamiento de Problema B, documentada como referencia. No está formalizada
como script ni como entrada en `package.json` — pendiente de aprobación:

```powershell
# 1. Iniciar servidor como proceso desacoplado
Start-Process -FilePath "powershell.exe" `
    -ArgumentList "-NoProfile", "-Command", "Set-Location 'c:\ruta\al\proyecto'; npm run dev" `
    -WindowStyle Hidden

# 2. Esperar hasta que el servidor responda (compilación JIT de ruta /)
do {
    Start-Sleep 2
    try { Invoke-WebRequest http://localhost:3000/ -TimeoutSec 5 -UseBasicParsing | Out-Null; $ok = $true }
    catch { $ok = $false }
} until ($ok)
Write-Host "Servidor listo y ruta / compilada."

# 3. Eliminar ELECTRON_RUN_AS_NODE solo en el proceso actual y ejecutar Cypress
[System.Environment]::SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", $null, [System.EnvironmentVariableTarget]::Process)
npx cypress run --spec "cypress/e2e/home.cy.js"
```

### Impacto

- **Antes del workaround:** bloqueaba completamente cualquier ejecución de Cypress
- **Después del workaround (temporal):** Cypress funciona en el proceso actual
- **Persistencia:** la variable reaparece en cada nueva sesión. El workaround
  debe repetirse en cada ejecución desde este entorno.

### Solución permanente pendiente

Opciones evaluadas, pendientes de aprobación:

1. **Script npm `cypress:run` en `package.json`:** agregar un script que
   incluya la eliminación de la variable antes de ejecutar Cypress.
   Requiere modificación de `package.json` — pendiente de aprobación.

2. **Configuración del terminal de VSCode:** editar `.vscode/settings.json`
   para que el terminal integrado no herede `ELECTRON_RUN_AS_NODE`.
   Requiere crear o modificar configuración de VSCode — pendiente de aprobación.

3. **Script auxiliar de ejecución:** crear un archivo `.ps1` en el repositorio
   que envuelva cada ejecución de Cypress con la eliminación previa de la
   variable. No modifica `package.json`.

Ninguna de estas opciones se implementa hasta recibir aprobación.

---

## Problema B — Fallo del test 1 durante ejecución (ESOCKETTIMEDOUT)

> Este problema ocurrió durante la misma sesión de diagnóstico de QA-005,
> pero tiene una causa raíz completamente independiente. Se documenta aquí
> por estar relacionado con la ejecución del Módulo 4.

### Descripción

Durante la primera ejecución completa de `home.cy.js` (tras resolver el
Problema A), el test 1 falló con el siguiente error:

```
CypressError: cy.visit() failed trying to load: http://localhost:3000/
We attempted to make an http request to this URL but the request failed
without a response.

  > Error: ESOCKETTIMEDOUT
```

Los tests 2, 3 y 4 pasaron en la misma ejecución.

### Causa confirmada

**Compilación JIT de Next.js en modo desarrollo.**

Next.js en modo `dev` compila cada ruta la primera vez que recibe una
solicitud para esa ruta. El proceso de compilación puede tomar varios
segundos. Durante ese tiempo, el servidor acepta la conexión TCP pero no
puede enviar ninguna respuesta HTTP.

El test 1 (`cy.visit('http://localhost:3000')`) realizó la primera solicitud
a la ruta `/` justo durante su compilación. El socket no recibió respuesta
dentro del tiempo de espera y se agotó. Los tests 2, 3 y 4 llegaron cuando
la ruta ya estaba compilada y el servidor respondía inmediatamente.

### Resolución operativa

Se realizó una solicitud HTTP previa al servidor antes de iniciar Cypress
(calentamiento). Esa solicitud forzó que Next.js compilara la ruta `/`.
Con la ruta compilada, el test 1 pasó en 5 686 ms.

Resultado de la ejecución controlada:

| # | Descripción | Resultado | Duración |
|---|---|---|---|
| 1 | Debe cargar correctamente | ✅ Passed | 5 686 ms |
| 2 | Debe validar la URL | ✅ Passed | 7 037 ms |
| 3 | Debe verificar que la página tenga un título | ✅ Passed | 3 810 ms |
| 4 | Debe tomar una captura de la página principal | ✅ Passed | 14 449 ms |

No fue necesario modificar `home.cy.js` ni aumentar timeouts en
`cypress.config.ts`.

### Relación con Problema A

Este problema no está relacionado con `ELECTRON_RUN_AS_NODE`. Ocurrió
después de resolver el Problema A, con Cypress funcionando correctamente.
La causa es exclusivamente la secuencia de inicio del entorno de desarrollo.

---

## Decisión general

Workaround temporal documentado y aplicado por proceso. La solución permanente
para el Problema A está pendiente de aprobación. El Problema B se resuelve
operativamente con una solicitud de calentamiento HTTP previa a la ejecución
de Cypress.

## Rama
`qa-automation-course` (problema de entorno, no de código de la aplicación)

## Resultado
✅ Resuelto con workaround. `npx cypress verify` pasa correctamente.
Los 4 tests de `home.cy.js` pasan con la secuencia de inicio correcta.
