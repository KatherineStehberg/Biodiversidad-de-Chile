# Despliegue de Biodiversidad.cl

El despliegue oficial usa **Node.js 22 / Next.js, sin Docker**. Esta página sustituye las instrucciones antiguas de Coolify/Docker. No existe Dockerfile ni salida standalone requerida.

Repositorio: `KatherineStehberg/Biodiversidad-de-Chile`, rama de producción `main`.
Instalación: `npm ci`. Compilación: `npm run build`. Inicio: `npm run start`. Puerto: `3000` (o `PORT` del proveedor). Mantener el proceso con el gestor del hosting y HTTPS en el proxy.

Las variables `NEXT_PUBLIC_*` deben configurarse antes del build. El dominio del portal se configura en `NEXT_PUBLIC_SITE_URL`; el README identifica `https://consultores.biodiversidad.cl`. Confirmar el dominio final en hosting y en Supabase Auth; no asumir que el WordPress principal se reemplaza.

Consultar [preparación de pagos y acceso](RELEASE_MEMBERSHIPS.md) antes de habilitar cobros. No copiar `.env.example` a producción sin reemplazar sus valores; el ejemplo local habilita mocks.
