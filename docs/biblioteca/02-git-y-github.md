# Git y GitHub — Biblioteca de Referencia

## ¿Qué es Git?
Git es un sistema de control de versiones. Registra todos los cambios
realizados en los archivos de un proyecto, permite volver a versiones
anteriores y facilita el trabajo en equipo.

**Dato importante:** Git corre en tu computador. GitHub es el servidor
en internet donde se almacena una copia del repositorio.

---

## Conceptos fundamentales

### Repositorio (*repository*)
Carpeta del proyecto bajo control de Git. Contiene todo el historial de cambios.
En este proyecto: `C:\Users\Usuario\Desktop\Biodiversidad de Chile`

### Working tree (árbol de trabajo)
Los archivos reales en el disco, tal como están en este momento.
Es lo que ves en el explorador de archivos o en el editor.

### Staging area (área de preparación)
Zona intermedia donde Git acumula los cambios antes de confirmarlos.
Se agregan con `git add`. Puedes pensar en ella como el "sobre" antes de cerrar la carta.

### Commit
Punto guardado en el historial. Una vez creado, los cambios quedan
registrados permanentemente con fecha, autor y mensaje.

### Rama (*branch*)
Línea de trabajo paralela. La rama `main` es la principal y estable.
Las ramas de trabajo (`qa-automation-course`, `qa/03-cypress-basico`, etc.)
permiten experimentar sin afectar `main`.

### Remoto (*remote*)
Copia del repositorio en un servidor externo. En este proyecto: GitHub.
El nombre del remoto configurado es `origin`.

---

## Flujo de trabajo básico

```
Working tree → Staging area → Commit → Push al remoto
   (editar)     (git add)    (git commit)  (git push)
```

---

## Estrategia de ramas de este proyecto

```
main                          ← versión estable del producto
└── qa-automation-course      ← todo el trabajo del curso QA
     ├── qa/03-cypress-basico ← módulo 4 (se crea al iniciar)
     ├── qa/04-cypress-avanzado
     └── ...
```

**Regla:** ningún cambio de código o pruebas va directamente a `main`
durante el curso. Todo pasa primero por `qa-automation-course`.

---

## Comandos de referencia rápida

| Comando | Qué hace |
|---|---|
| `git status` | Estado actual del repositorio |
| `git branch -a` | Listar todas las ramas |
| `git switch nombre` | Cambiar a una rama existente |
| `git switch -c nombre` | Crear y cambiar a una nueva rama |
| `git add ruta/` | Agregar al staging area |
| `git diff --cached` | Ver qué está en el staging antes de commit |
| `git commit -m "msg"` | Crear un commit con mensaje |
| `git push -u origin rama` | Subir rama al remoto por primera vez |
| `git push` | Subir commits posteriores (ya configurado) |
| `git log --oneline` | Historial compacto |
| `git remote -v` | Ver remotos configurados |
