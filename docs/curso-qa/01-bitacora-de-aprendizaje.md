# Bitácora de Aprendizaje — Test Automation Engineer
## Proyecto: Biodiversidad de Chile

---

## Sesión 1 — Auditoría inicial del proyecto

**Fecha:** 2026-07-04

**¿Qué aprendimos?**
Que un proyecto puede estar funcionando correctamente y tener cero cobertura
de pruebas automatizadas al mismo tiempo. "Funciona" y "está probado" son
cosas distintas. La auditoría previa a cualquier cambio evita decisiones
basadas en suposiciones.

**Conceptos nuevos**
- Auditoría de proyecto: revisar el estado real antes de modificar nada
- Modo mock: usar datos ficticios para no depender de una base de datos real
- API Route: función del servidor que responde a solicitudes HTTP
- Endpoint: URL específica que acepta solicitudes y devuelve datos
- Suite de pruebas: conjunto de tests agrupados bajo un mismo `describe()`

**Comandos utilizados**
- `git remote -v` — verificar a qué repositorio remoto está conectado el proyecto
- `git branch -a` — ver todas las ramas locales y remotas
- `git log --oneline -5` — historial de commits en formato compacto

**Resultado obtenido**
Inventario completo del proyecto: 25 páginas, 19 endpoints, tecnologías
identificadas, modo mock disponible, 2 archivos Cypress (1 no aplicable al
proyecto actual).

**Errores encontrados**
`api-usuarios.cy.js` referencia un endpoint que no existe en el proyecto.
Registrado como hallazgo QA-001.

**¿Cómo se interpretó?**
No es un error de Cypress sino un problema de coherencia: existe un test
para un endpoint que no fue implementado, o el endpoint existió y fue eliminado
sin actualizar el test correspondiente.

**¿Cómo lo explicaría una persona principiante?**
Es como tener una llave que no abre ninguna puerta del edificio. La llave
existe en el llavero, pero la puerta para la que fue diseñada no está ahí.

**Vocabulario técnico (inglés)**
- *endpoint* = punto de conexión de una API
- *mock* = simulación o imitación de datos reales
- *untracked* = archivo que Git aún no registra en el historial

**Evidencia**
- Lectura directa de más de 20 archivos del proyecto
- Salida confirmada de comandos Git

**Pendientes**
- Verificar que el proyecto compila y corre (`npm run dev`, `npm run build`)

---

## Sesión 2 — Estabilización del proyecto

**Fecha:** 2026-07-05

**¿Qué aprendimos?**
Que verificar el entorno antes de escribir pruebas evita perder tiempo
depurando problemas de infraestructura durante los tests.
También aprendimos que un build puede completar sin errores aunque el código
tenga problemas de tipos o de calidad, si las validaciones están desactivadas
en la configuración.

**Conceptos nuevos**
- Build (compilación): proceso de transformar el código fuente en una versión
  optimizada para producción
- Exit code 0: código de salida que indica que un proceso terminó sin errores
- Staging area: zona intermedia donde Git guarda los cambios antes de un commit
- Hot reload: capacidad del servidor de desarrollo de actualizar la página
  automáticamente cuando se modifica un archivo
- JIT (Just-In-Time): compilación bajo demanda — Next.js compila cada ruta
  la primera vez que se visita

**Comandos utilizados**
- `node -v` — verificar versión de Node.js
- `npm -v` — verificar versión de npm
- `npm run dev` — iniciar servidor de desarrollo
- `npm run build` — compilar el proyecto para producción
- `git status` — verificar el estado del repositorio

**Resultado obtenido**
- `npm run dev`: ✅ listo en 3.8 s, puerto 3000, sin errores
- HTTP 200 OK confirmado en `http://localhost:3000`
- `npm run build`: ✅ exit code 0, 47 páginas generadas, duración ~59 s

**Errores encontrados**
Ningún error que bloquee la ejecución ni el build.
Se detectaron 4 hallazgos de riesgo (QA-001 a QA-004), ninguno crítico.

**¿Cómo se interpretaron los hallazgos?**
QA-002 y QA-003 detectaron que TypeScript y ESLint están desactivados durante
el build. Son configuraciones que reducen las validaciones automáticas del
proceso de compilación. Aún no se sabe si fueron configuradas de forma
deliberada, si son temporales, o si representan deuda técnica acumulada.
Se documentan para decidir cómo abordarlos en la fase de CI/CD (módulo 10).

**¿Cómo lo explicaría una persona principiante?**
Antes de empezar a probar si un auto funciona bien, primero hay que verificar
que enciende, que las ruedas están puestas y que tiene combustible.
Si el auto arranca pero el tablero tiene las luces de advertencia apagadas
aunque haya problemas, eso también es algo que hay que documentar, aunque
el auto "funcione".

**Vocabulario técnico (inglés)**
- *build* = compilación o construcción del proyecto
- *exit code* = código de salida de un proceso (0 = sin errores)
- *middleware* = código intermediario entre la solicitud y la respuesta
- *hot reload* = recarga automática al modificar archivos

**Evidencia**
- Output de `npm run dev`: "Ready in 3.8s", puerto 3000
- HTTP Status 200 en `http://localhost:3000`
- Output de `npm run build`: exit code 0, "Generating static pages (47/47)"

**Pendientes**
- Crear la rama `qa-automation-course`
- Versionar `docs/` con el primer commit documental
- Abordar los hallazgos QA-001 a QA-004 en sus módulos correspondientes

---

*Se agregarán nuevas sesiones a medida que avance el curso.*
