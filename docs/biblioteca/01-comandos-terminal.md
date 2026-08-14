# Comandos de Terminal — Proyecto QA Biodiversidad de Chile

Cada comando se documenta cuando se usa por primera vez en el curso.
Se amplía módulo a módulo.

---

## node -v

**¿Qué hace?**
Muestra la versión de Node.js instalada en el sistema.

**¿Cuándo se usa?**
Al verificar que el entorno de desarrollo tiene la versión correcta de Node.js
antes de instalar dependencias o ejecutar el proyecto.

**Partes del comando**
- `node` — el entorno de ejecución de JavaScript fuera del navegador
- `-v` — flag para mostrar la versión (*version*)

**Resultado esperado**
```
v22.21.1
```

**Errores frecuentes**
- `command not found: node` — Node.js no está instalado

**Explicación simple**
Como preguntar "¿qué versión de Excel tienes instalada?" antes de abrir un archivo.

**Nota técnica en inglés**
*Node.js* viene de *Node* (nodo) porque permite crear redes de servidores conectados.

---

## npm -v

**¿Qué hace?**
Muestra la versión de npm instalada. npm es el gestor de paquetes de Node.js.

**¿Cuándo se usa?**
Junto con `node -v` al verificar el entorno.

**Partes del comando**
- `npm` — Node Package Manager (Gestor de Paquetes de Node)
- `-v` — versión

**Resultado esperado**
```
10.9.4
```

**Explicación simple**
npm es la "tienda de herramientas" de Node.js. Con npm se instalan las
bibliotecas que necesita el proyecto.

---

## npm run dev

**¿Qué hace?**
Inicia la aplicación en modo de desarrollo local.

**¿Cuándo se usa?**
Antes de ejecutar pruebas Cypress o verificar cambios en el navegador.
El servidor debe estar corriendo para que Cypress pueda visitar páginas.

**Requisitos**
- Node.js instalado
- Carpeta `node_modules` presente
- Archivo `.env.local` con las variables requeridas

**Partes del comando**
- `npm` — el gestor de paquetes
- `run` — indica que se ejecutará un script definido en `package.json`
- `dev` — nombre del script; en este proyecto ejecuta `next dev`

**Resultado esperado**
```
✓ Next.js 15.5.18
✓ Ready in 3.8s
- Local: http://localhost:3000
```

**Errores frecuentes**
- `EADDRINUSE` — el puerto 3000 ya está ocupado; otro proceso lo está usando
- Variables de entorno faltantes — la app arranca pero algunos endpoints fallan

**Explicación simple**
Es como encender el motor del proyecto para verlo funcionar en tu computador,
sin publicarlo en internet.

**Nota técnica en inglés**
*dev* es abreviatura de *development* (desarrollo).

---

## npm run build

**¿Qué hace?**
Compila y optimiza el proyecto para producción. Genera la carpeta `.next/`
con todos los archivos listos para desplegarse en un servidor real.

**¿Cuándo se usa?**
Para verificar que el proyecto no tiene errores que impidan el despliegue,
y antes de ejecutar pruebas sobre la versión de producción.

**Partes del comando**
- `npm` — el gestor de paquetes
- `run` — ejecutar un script
- `build` — nombre del script; ejecuta `next build`

**Resultado esperado**
```
✓ Compiled successfully
✓ Generating static pages (47/47)
```
Exit code 0 (sin errores).

**Errores frecuentes**
- Errores de importación de módulos
- Rutas de imágenes incorrectas

**Resultado en este proyecto**
Build exitoso en ~59 s, 47 páginas generadas.
Advertencia: TypeScript y ESLint omitidos (ver QA-002 y QA-003).

**Nota técnica en inglés**
*build* = construcción o compilación.

---

## git status

**¿Qué hace?**
Muestra el estado actual del repositorio: qué archivos fueron modificados,
cuáles están en el staging area y cuáles no tienen seguimiento.

**¿Cuándo se usa?**
Antes de hacer cualquier operación de Git para entender exactamente
qué hay pendiente.

**Partes del comando**
- `git` — el sistema de control de versiones
- `status` — mostrar el estado

**Resultado esperado**
```
On branch main
Your branch is up to date with 'origin/main'.
Untracked files:
  docs/qa/
```

**Explicación simple**
Como revisar qué papeles tienes sobre el escritorio antes de archivar.

---

## git branch -a

**¿Qué hace?**
Lista todas las ramas del repositorio: locales y remotas.

**Partes del comando**
- `git` — control de versiones
- `branch` — gestión de ramas
- `-a` — mostrar todas (*all*): locales y remotas

**Resultado esperado**
```
* main
  remotes/origin/main
```
El asterisco `*` indica la rama activa.

---

## git remote -v

**¿Qué hace?**
Muestra los repositorios remotos configurados y sus URLs.

**Partes del comando**
- `git` — control de versiones
- `remote` — gestión de remotos
- `-v` — modo detallado (*verbose*), muestra las URLs

**Resultado esperado**
```
origin  https://github.com/KatherineStehberg/Biodiversidad-de-Chile.git (fetch)
origin  https://github.com/KatherineStehberg/Biodiversidad-de-Chile.git (push)
```

---

## git log --oneline

**¿Qué hace?**
Muestra el historial de commits en formato compacto: una línea por commit.

**Partes del comando**
- `git log` — historial de commits
- `--oneline` — formato de una línea por commit

**Resultado esperado**
```
c977093 Initial commit: proyecto Biodiversidad de Chile
```

**Nota técnica en inglés**
*log* = registro. En Git, el log es el historial de todos los cambios guardados.

---

## git switch -c

**¿Qué hace?**
Crea una nueva rama y cambia a ella en un solo comando.

**Partes del comando**
- `git` — control de versiones
- `switch` — comando moderno para cambiar de rama
- `-c` — crear la rama antes de cambiar (*create*)
- `nombre-de-rama` — el nombre que tendrá la nueva rama

**Ejemplo**
```bash
git switch -c qa-automation-course
```

**Resultado esperado**
```
Switched to a new branch 'qa-automation-course'
```

**Diferencia con `git checkout -b`**
`git switch` es el comando moderno introducido en Git 2.23 específicamente
para cambiar ramas. `git checkout` hacía demasiadas cosas distintas.
Ambos funcionan; `switch` es más claro en su propósito.

---

## git add

**¿Qué hace?**
Agrega archivos al staging area (área de preparación) para incluirlos en
el próximo commit.

**Ejemplo**
```bash
git add docs/
```

**Partes del comando**
- `git add` — agregar al staging
- `docs/` — la carpeta a agregar (con todo su contenido)

**Nota**
`git add .` agrega TODOS los archivos modificados. Es preferible ser
específico para evitar incluir archivos no deseados.

---

## git diff --cached

**¿Qué hace?**
Muestra exactamente qué cambios están en el staging area, listos para
el próximo commit. Permite revisar antes de confirmar.

**Partes del comando**
- `git diff` — mostrar diferencias
- `--cached` — solo los cambios en el staging area (sinónimo: `--staged`)

**¿Cuándo se usa?**
Inmediatamente después de `git add` y antes de `git commit`, para
verificar que solo se incluirán los cambios deseados.

**Nota técnica en inglés**
*cached* = en caché, guardado temporalmente. En Git se refiere a lo que
está en el staging area esperando ser confirmado.
