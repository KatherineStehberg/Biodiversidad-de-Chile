# QA-003 — ESLint desactivado durante el build

| Campo | Valor |
|---|---|
| ID | QA-003 |
| Fecha | 2026-07-05 |
| Entorno | Build de producción local |
| Fase interna del proyecto | Estabilización |
| Módulo oficial relacionado | Módulo 10 — CI/CD |
| Severidad | Baja |
| Prioridad | Baja |
| Estado | Abierto |

## Descripción
En `next.config.ts` está configurada la opción
`eslint: { ignoreDuringBuilds: true }`. ESLint es la herramienta que detecta
patrones de código problemáticos, errores de estilo y posibles bugs estáticos.
Con esta configuración, no se ejecuta durante `npm run build`.
El output confirma: "Skipping linting".

## Pasos para reproducir
1. Revisar `next.config.ts` líneas 3–5.
2. Ejecutar `npm run build`.
3. Observar la línea "Skipping linting" en el output.

## Resultado esperado
El build ejecuta ESLint y falla si hay errores de calidad de código.

## Resultado real
El build omite ESLint completamente.

## Evidencia
- `next.config.ts`: `eslint: { ignoreDuringBuilds: true }`
- Output de `npm run build`: "Skipping linting"
- Documentado en: `docs/qa/02-estabilizacion-del-proyecto.md`

## Impacto
Menor que QA-002. El linting verifica estilo y patrones, no correctitud
funcional. Sin embargo, su ausencia en el pipeline puede permitir que
problemas de calidad de código pasen desapercibidos.

## Decisión
Pendiente de aprobación.

## Acción propuesta
Agregar `npm run lint` como paso separado en el pipeline CI/CD (módulo 10).

> No se modifica `next.config.ts` en esta fase.

## Rama de corrección
`qa/10-ci-cd` (a crear al iniciar el módulo 10)

## Resultado de la corrección
Pendiente.
