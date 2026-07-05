# QA-002 — TypeScript desactivado durante el build

| Campo | Valor |
|---|---|
| ID | QA-002 |
| Fecha | 2026-07-05 |
| Entorno | Build de producción local |
| Fase interna del proyecto | Estabilización |
| Módulo oficial relacionado | Módulo 10 — CI/CD |
| Severidad | Media |
| Prioridad | Media |
| Estado | Abierto |

## Descripción
En `next.config.ts` está configurada la opción
`typescript: { ignoreBuildErrors: true }`. Esto hace que `npm run build`
complete exitosamente aunque existan errores de tipos en el código TypeScript.
Durante el build, el output confirma: "Skipping validation of types".

## Pasos para reproducir
1. Revisar `next.config.ts` líneas 7–9.
2. Ejecutar `npm run build`.
3. Observar la línea "Skipping validation of types" en el output.

## Resultado esperado
El build valida los tipos TypeScript y falla si hay errores de tipo en el código.

## Resultado real
El build omite completamente la validación de tipos.

## Evidencia
- `next.config.ts`: `typescript: { ignoreBuildErrors: true }`
- Output de `npm run build`: "Skipping validation of types"
- Documentado en: `docs/qa/02-estabilizacion-del-proyecto.md`

## Impacto
El pipeline CI/CD pasará el paso de build aunque el código contenga errores
de tipos TypeScript. Las pruebas automatizadas podrían ejecutarse sobre
código con inconsistencias de tipos no detectadas.

## Decisión
Pendiente de aprobación.

## Acción propuesta
Agregar `tsc --noEmit` como paso separado y explícito en el pipeline CI/CD
(módulo 10). Esto valida los tipos sin afectar la configuración de build actual
de Next.js, que puede tener su propia razón para estar configurada así.

> No se modifica `next.config.ts` en esta fase.

## Rama de corrección
`qa/10-ci-cd` (a crear al iniciar el módulo 10)

## Resultado de la corrección
Pendiente.
