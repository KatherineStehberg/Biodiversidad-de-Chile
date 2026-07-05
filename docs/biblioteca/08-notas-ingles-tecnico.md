# Notas de Inglés Técnico — Biblioteca de Referencia

Vocabulario técnico en inglés que aparece en el trabajo diario de QA
y desarrollo web. Las notas son breves: solo el término, su traducción
y un contexto de uso.

No es un curso de inglés. Es una referencia para entender la documentación,
los mensajes de error y las herramientas del curso.

---

## Términos del flujo de trabajo

| Inglés | Español | Contexto de uso |
|---|---|---|
| *build* | compilación / construcción | `npm run build` genera el build de producción |
| *branch* | rama | Una branch de Git es una línea de trabajo paralela |
| *commit* | confirmación / registro | Un commit guarda cambios en el historial de Git |
| *merge* | fusión | Integrar los cambios de una branch en otra |
| *push* | empujar / subir | `git push` sube commits al repositorio remoto |
| *pull* | jalar / bajar | `git pull` baja cambios del repositorio remoto |
| *staging* | preparación | El staging area es la zona previa al commit |
| *working tree* | árbol de trabajo | Los archivos reales en el disco |

---

## Términos de pruebas

| Inglés | Español | Contexto de uso |
|---|---|---|
| *assertion* | comprobación / verificación | `should('be.visible')` es una assertion de Cypress |
| *fixture* | dato de prueba fijo | Archivo JSON con datos predefinidos para tests |
| *mock* | simulación / imitación | Datos ficticios que reemplazan una dependencia real |
| *suite* | conjunto de pruebas | El `describe()` de Cypress agrupa un suite |
| *spec* | especificación de prueba | Un archivo `.cy.js` es un spec file |
| *headless* | sin interfaz gráfica | `cypress run` ejecuta pruebas headless |
| *timeout* | tiempo de espera agotado | Error cuando una operación tarda más de lo permitido |
| *intercept* | interceptar | Capturar una solicitud HTTP antes de que llegue al servidor |

---

## Términos de HTTP y APIs

| Inglés | Español | Contexto de uso |
|---|---|---|
| *request* | solicitud | El navegador hace un request al servidor |
| *response* | respuesta | El servidor devuelve una response con código y datos |
| *endpoint* | punto de conexión | `GET /api/products` es un endpoint |
| *payload* | carga útil / datos | El body de un POST es el payload |
| *header* | encabezado | `Content-Type` es un header HTTP |
| *status code* | código de estado | 200 = OK, 404 = no encontrado |
| *token* | ficha / credencial | El token de autenticación identifica al usuario |

---

## Términos de Next.js y React

| Inglés | Español | Contexto de uso |
|---|---|---|
| *render* | renderizar | Convertir código en HTML visible en el navegador |
| *hydration* | hidratación | Activar JavaScript en una página ya renderizada en servidor |
| *middleware* | intermediario | Código que se ejecuta entre la solicitud y la respuesta |
| *route* | ruta | Una URL que corresponde a una página o endpoint |
| *layout* | diseño estructural | Componente que envuelve varias páginas |
| *static* | estático | Página generada una sola vez durante el build |
| *dynamic* | dinámico | Página generada bajo demanda en cada solicitud |

---

## Términos de Git

| Inglés | Español | Contexto de uso |
|---|---|---|
| *repository* | repositorio | Carpeta del proyecto bajo control de Git |
| *remote* | remoto | Copia del repositorio en un servidor (GitHub) |
| *origin* | origen | Nombre por defecto del remoto principal |
| *untracked* | sin seguimiento | Archivo que Git aún no registra |
| *cached* | en caché | En `git diff --cached`: cambios en el staging area |
| *upstream* | corriente arriba | La rama remota a la que apunta una rama local |
