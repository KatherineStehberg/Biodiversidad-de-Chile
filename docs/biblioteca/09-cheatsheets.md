# Cheatsheets — Referencia Rápida

Comandos agrupados por herramienta para consulta rápida.
Sin explicaciones extensas — para eso están los archivos individuales.

---

## Git

```bash
git status                        # estado del repositorio
git branch -a                     # listar todas las ramas
git log --oneline -5              # últimos 5 commits
git switch nombre-rama            # cambiar a una rama existente
git switch -c nueva-rama          # crear y cambiar a nueva rama
git add docs/                     # agregar carpeta al staging
git diff --cached                 # ver staging antes de commit
git commit -m "tipo: mensaje"     # crear commit
git push -u origin nombre-rama    # subir rama nueva al remoto
git push                          # subir commits posteriores
git remote -v                     # ver remotos configurados
```

---

## npm

```bash
node -v                           # versión de Node.js
npm -v                            # versión de npm
npm run dev                       # servidor de desarrollo
npm run build                     # compilar para producción
npm run start                     # servidor de producción
npm run lint                      # validar con ESLint
```

---

## Cypress

```bash
npx cypress open                  # abrir modo visual
npx cypress run                   # modo headless (terminal)
npx cypress run --spec "ruta"     # ejecutar un spec específico
```

---

## Comandos de verificación del entorno

```bash
node -v && npm -v                 # versiones del entorno
git remote -v                     # remoto configurado
git status                        # estado del repo
```

---

## Convención de mensajes de commit

```
tipo(alcance): descripción breve

Tipos:
  feat     → nueva funcionalidad
  fix      → corrección de bug
  docs     → documentación
  test     → pruebas
  chore    → mantenimiento
  refactor → refactorización sin cambio funcional

Ejemplos:
  docs(qa): estructura documental inicial del curso
  test(cypress): pruebas básicas de carga de página
  fix(api): corregir endpoint de consultores
```

---

## Estructura de carpetas del proyecto QA

```
docs/
├── qa/
│   ├── 00-plan-general.md
│   ├── 00a-modulo-1-fundamentos.md
│   ├── 00b-modulo-2-git-entorno.md
│   ├── 00c-modulo-3-javascript-testing.md
│   ├── 01-auditoria-inicial.md
│   ├── 02-estabilizacion-del-proyecto.md
│   ├── 03-cypress-basico.md
│   ├── ...
│   └── hallazgos/
│       ├── indice-hallazgos.md
│       └── QA-00X-nombre.md
├── biblioteca/
│   ├── 00-glosario-tecnico.md
│   ├── 01-comandos-terminal.md
│   └── ...
└── curso-qa/
    └── 01-bitacora-de-aprendizaje.md
```
