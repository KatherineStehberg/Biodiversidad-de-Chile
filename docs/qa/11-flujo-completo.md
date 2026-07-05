# 11 — Flujo Completo

## Objetivo
Integrar las capas de prueba web y API dentro del pipeline CI/CD ejecutándose
en Docker: E2E con Cypress y Playwright, pruebas de API con Supertest y
BDD con Cucumber.

## Estado inicial
Pendiente. Requiere completar los módulos 03 al 10.

## Problema detectado
Pendiente.

## Decisión tomada
Pendiente.

## Cambios realizados
Ninguno aún.

## Archivos modificados
Ninguno aún.

## Comandos ejecutados
Ninguno aún.

## Resultado obtenido
Pendiente.

## Evidencias
Pendiente.

## Errores encontrados
Pendiente.

## Cómo se resolvieron
Pendiente.

## Aprendizajes
Pendiente.

## Alcance del flujo principal

El pipeline final integra las siguientes capas:

| Capa | Herramienta | Incluida en pipeline |
|---|---|---|
| E2E web | Cypress | Sí |
| E2E cross-browser | Playwright | Sí |
| Pruebas de API | Supertest + Postman/Newman | Sí |
| BDD | Cucumber | Sí |
| CI/CD | GitHub Actions | Sí |
| Contenerización | Docker | Sí |
| Pruebas móviles | Appium | No — práctica independiente (Módulo 9) |

> Appium no forma parte del pipeline principal porque Biodiversidad de Chile
> es una aplicación web, no una aplicación móvil nativa. Las pruebas de
> Appium se documentan por separado en `08-appium.md`.

## Pendientes
- Validar que todos los módulos anteriores están operativos.
- Ejecutar el flujo completo de principio a fin.
- Documentar tiempos de ejecución totales.
- Medir la cobertura alcanzada por cada capa.

## Relación con el módulo del curso
**Módulo 12 del curso.** Integración final — pirámide de pruebas completa
(Web + API + CI/CD), estrategia de QA end-to-end en un proyecto real.
