# Despliegue de Biodiversidad.cl

El despliegue oficial usa **Node.js 22 / Next.js, sin Docker**. Esta página sustituye las instrucciones antiguas de Coolify/Docker. No existe Dockerfile ni salida standalone requerida.

Repositorio: `KatherineStehberg/Biodiversidad-de-Chile`, rama de producción `main`.
Instalación: `npm ci`. Compilación: `npm run build`. Inicio: `npm run start`. Puerto: `3000` (o `PORT` del proveedor). Mantener el proceso con el gestor del hosting y HTTPS en el proxy.

Las variables `NEXT_PUBLIC_*` deben configurarse antes del build. El dominio del portal se configura en `NEXT_PUBLIC_SITE_URL`; el README identifica `https://consultores.biodiversidad.cl`. Confirmar el dominio final en hosting y en Supabase Auth; no asumir que el WordPress principal se reemplaza.

Consultar [preparación de pagos y acceso](RELEASE_MEMBERSHIPS.md) antes de habilitar cobros. No copiar `.env.example` a producción sin reemplazar sus valores; el ejemplo local habilita mocks.

Estado al 21 de octubre de 2026: **no listo para deploy**. El código del PR #17 necesita las vistas/RPC de las migraciones propuestas, todavía no aplicadas. Se requiere inspección administrativa del esquema/RLS/ACL real, resolver drift de offers/resources, revisar ambas migraciones y confirmar configuración del hosting, dominio, Supabase Auth y Flow. La presencia de variables locales no acredita configuración remota. No se ejecutaron build ni verificaciones operativas en esta preparación.
