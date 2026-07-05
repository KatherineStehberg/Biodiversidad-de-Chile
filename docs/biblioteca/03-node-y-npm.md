# Node.js y npm — Biblioteca de Referencia

## ¿Qué es Node.js?
Node.js es un entorno de ejecución que permite correr JavaScript fuera
del navegador, directamente en el servidor o en la terminal.
Next.js, Cypress y todas las herramientas del curso funcionan sobre Node.js.

**Versión en este proyecto:** v22.21.1

## ¿Qué es npm?
npm (Node Package Manager) es el gestor de paquetes de Node.js.
Permite instalar, actualizar y eliminar bibliotecas externas (dependencias).

**Versión en este proyecto:** 10.9.4

---

## package.json

Archivo de configuración del proyecto. Define:
- nombre y versión del proyecto
- scripts disponibles
- dependencias de producción
- dependencias de desarrollo (devDependencies)

**Scripts de este proyecto:**

| Script | Comando real | Propósito |
|---|---|---|
| `npm run dev` | `next dev` | Iniciar servidor de desarrollo |
| `npm run build` | `next build` | Compilar para producción |
| `npm run start` | `next start` | Iniciar servidor de producción |
| `npm run lint` | `next lint` | Ejecutar ESLint |

**Scripts pendientes de agregar** (requieren aprobación):

| Script | Comando propuesto | Propósito |
|---|---|---|
| `npm run cypress:open` | `cypress open` | Abrir Cypress en modo visual |
| `npm run cypress:run` | `cypress run` | Ejecutar Cypress en modo headless |

---

## Dependencias del proyecto

### Producción (dependencies)

| Paquete | Versión | Propósito |
|---|---|---|
| next | ^15.5.18 | Framework web |
| react / react-dom | ^19.0.0 | Interfaz de usuario |
| @supabase/supabase-js | ^2.48.1 | Base de datos y autenticación |
| next-auth | ^4.24.7 | Gestión de sesiones |
| @mui/material | ^7.1.1 | Componentes UI |
| nodemailer | ^7.0.11 | Envío de correos |

### Desarrollo (devDependencies)

| Paquete | Versión | Propósito |
|---|---|---|
| cypress | ^15.17.0 | Pruebas E2E |
| typescript | ^5 | Tipado estático |
| tailwindcss | ^4 | Estilos CSS |
| eslint | ^9 | Calidad de código |

---

## node_modules

Carpeta donde npm instala todas las dependencias.
- **No se versiona** en Git (`.gitignore` la excluye).
- En este proyecto: 444 paquetes instalados de primer nivel.
- Si no existe, se crea con `npm install`.

---

## Nota sobre versiones
El símbolo `^` en las versiones significa "compatible con esta versión
mayor". Por ejemplo, `^15.5.18` instalará hasta la última versión
`15.x.x`, pero no `16.x.x`.
