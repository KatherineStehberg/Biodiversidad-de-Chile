# QA-004 — Archivo .env.example ausente

| Campo | Valor |
|---|---|
| ID | QA-004 |
| Fecha | 2026-07-05 |
| Entorno | Repositorio Git |
| Fase interna del proyecto | Estabilización |
| Módulo oficial relacionado | — (no aplica a módulo específico) |
| Severidad | Baja |
| Prioridad | Baja |
| Estado | Abierto |

## Descripción
El archivo `.env.local` existe localmente y contiene las variables de entorno
del proyecto. Por seguridad, está correctamente excluido del repositorio
mediante `.gitignore`. Sin embargo, no existe un archivo `.env.example`
que documente los nombres de las variables sin exponer sus valores.

Se identificaron **16 variables en total**:
- **13 presentes en `.env.local`**: detectadas por inspección directa del archivo
  (solo nombres, sin valores).
- **3 adicionales utilizadas en el código** fuente pero ausentes en `.env.local`:
  `N8N_DIAGNOSTIC_WEBHOOK_URL`, `FLOW_CHECKOUT_URL`, `OFFERS_ENFORCE_SMTP`.

No todas estas variables son obligatorias para iniciar la aplicación.
Algunas tienen valores de fallback o se usan de forma condicional en el código.
Cualquier persona que clone el repositorio no sabrá cuáles necesita configurar
ni cuáles son opcionales.

## Pasos para reproducir
1. Buscar `.env.example` en la raíz del repositorio.
2. Confirmar que no existe.
3. Clonar el repositorio en una máquina diferente e intentar ejecutar
   `npm run dev` sin configurar variables de entorno.

## Resultado esperado
Existe un `.env.example` con los nombres de todas las variables requeridas
(sin valores reales), como guía para nuevos colaboradores o para configurar
entornos CI/CD.

## Resultado real
No existe `.env.example`. Las 16 variables identificadas (13 en `.env.local`
más 3 en el código fuente) solo están documentadas en
`docs/qa/02-estabilizacion-del-proyecto.md`.

## Evidencia
- Búsqueda en el repositorio: archivo `.env.example` no encontrado
- Variables identificadas por inspección de código fuente
- Documentado en: `docs/qa/02-estabilizacion-del-proyecto.md`

## Impacto
Bajo en desarrollo individual con acceso al `.env.local` original.
Medio si el proyecto se configura en un entorno CI/CD nuevo o se
comparte con otro colaborador.

## Decisión
Pendiente de aprobación.

## Acción propuesta
Crear `.env.example` en la raíz del repositorio con las 16 variables
identificadas, sin ningún valor real, e indicando cuáles son opcionales
o tienen fallback en el código.

## Rama de corrección
`qa-automation-course`

## Resultado de la corrección
Pendiente.
