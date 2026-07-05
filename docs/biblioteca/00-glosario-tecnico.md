# Glosario Técnico — Proyecto QA Biodiversidad de Chile

Términos organizados alfabéticamente. Se amplía a medida que avanza el curso.

---

## A

**API** (*Application Programming Interface* — Interfaz de Programación de Aplicaciones)
Conjunto de reglas que permite a dos programas comunicarse entre sí.
En este proyecto, las API Routes de Next.js permiten al navegador pedir datos al servidor.

**Assertion** (comprobación)
Verificación dentro de un test que confirma que algo es verdadero.
Ejemplo: comprobar que el código HTTP de una respuesta es 200.

**Autenticación**
Proceso de verificar la identidad de un usuario. En este proyecto se usa NextAuth.js.

---

## B

**Branch** (rama)
Línea de trabajo paralela dentro del mismo repositorio Git.
Permite trabajar en cambios sin afectar el código principal (`main`).

**Build** (compilación o construcción)
Proceso de transformar el código fuente en una versión lista para producción.
En este proyecto se ejecuta con `npm run build`.

---

## C

**CI/CD** (*Continuous Integration / Continuous Deployment*)
Integración continua / Despliegue continuo.
Práctica de ejecutar pruebas y desplegar automáticamente cada vez que se registra un cambio en el repositorio.

**Commit**
Registro de cambios guardado en el historial de Git. Cada commit tiene un identificador único y un mensaje descriptivo.

**Cypress**
Herramienta de pruebas E2E (de extremo a extremo) para aplicaciones web.
Permite simular el comportamiento de un usuario real en el navegador.

---

## D

**Dependencia**
Biblioteca externa que el proyecto necesita para funcionar.
Se declaran en `package.json` y se instalan con `npm install`.

**devDependency**
Dependencia que solo se necesita durante el desarrollo y las pruebas, no en producción.
Cypress es una devDependency de este proyecto.

---

## E

**E2E** (*End-to-End* — de extremo a extremo)
Tipo de prueba que simula el recorrido completo de un usuario: desde la interfaz hasta el servidor y la base de datos.

**Endpoint**
Punto de conexión de una API. Una URL específica que acepta solicitudes HTTP.
Ejemplo: `GET /api/products` devuelve la lista de productos del marketplace.

**Entorno** (*environment*)
Configuración específica donde corre la aplicación: desarrollo local, staging o producción.

---

## F

**Fixture**
Datos de prueba predefinidos, guardados en archivos, que se cargan durante los tests.
Cypress los almacena en `cypress/fixtures/`.

---

## H

**Hallazgo**
En QA: cualquier discrepancia entre el comportamiento esperado y el real.
No siempre es un bug; puede ser una configuración incompleta, documentación faltante o un riesgo identificado.

**HTTP** (*HyperText Transfer Protocol*)
Protocolo de comunicación entre el navegador y el servidor web.
Define métodos (GET, POST, PUT, DELETE) y códigos de respuesta (200, 401, 404, 500).

---

## M

**Middleware**
Código que se ejecuta entre la solicitud del navegador y la respuesta del servidor.
En este proyecto, el middleware aplica headers de seguridad a todas las rutas.

**Mock** (simulación)
Imitación de un componente real para pruebas. En este proyecto, el modo mock reemplaza la base de datos Supabase con datos ficticios predefinidos.

**Módulo** (en el contexto del curso)
Unidad de aprendizaje del curso Test Automation Engineer. Cada módulo cubre una herramienta o práctica específica.

---

## N

**node_modules**
Carpeta donde npm instala todas las dependencias del proyecto.
No se versiona en Git (está en `.gitignore`).

---

## P

**Pipeline**
Secuencia automatizada de pasos que se ejecutan al registrar cambios en el repositorio.
Típicamente: lint → build → pruebas → despliegue.

**Pull Request** (solicitud de fusión)
Propuesta para incorporar los cambios de una rama en otra dentro de GitHub.

---

## R

**Request** (solicitud)
Mensaje que envía el navegador o un test al servidor pidiendo datos o una acción.

**Response** (respuesta)
Mensaje que devuelve el servidor al navegador o al test, con un código HTTP y datos.

**Rama** → ver *Branch*

---

## S

**Staging area** (área de preparación)
Zona intermedia en Git donde se acumulan los cambios antes de crear un commit.
Se agregan archivos con `git add`.

**Suite de pruebas**
Conjunto de tests agrupados bajo un mismo `describe()` en Cypress.

---

## T

**Test** (prueba)
Verificación automatizada de que una parte del sistema se comporta como se espera.

**TypeScript**
Superconjunto de JavaScript que agrega tipado estático.
Ayuda a detectar errores antes de ejecutar el código.

---

## U

**Untracked** (sin seguimiento)
Archivo que existe en el disco pero que Git aún no registra en el historial.
Aparece en `git status` bajo "Untracked files".
