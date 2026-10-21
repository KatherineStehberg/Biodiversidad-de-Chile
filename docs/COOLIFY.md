# Despliegue de Biodiversidad.cl

El despliegue oficial usa **Node.js 22 / Next.js, sin Docker**. Esta página sustituye las instrucciones antiguas de Coolify/Docker. No existe Dockerfile ni salida standalone requerida.

Repositorio: `KatherineStehberg/Biodiversidad-de-Chile`, rama de producción `main`.
Instalación: `npm ci`. Compilación: `npm run build`. Inicio: `npm run start`. Puerto: `3000` (o `PORT` del proveedor). Mantener el proceso con el gestor del hosting y HTTPS en el proxy.

Las variables `NEXT_PUBLIC_*` deben configurarse antes del build. Dominio definitivo del sitio completo, confirmado por Katherine: `https://portal.biodiversidad.cl`. Configurar `NEXT_PUBLIC_SITE_URL` con ese origen, sin rutas, y alinear hosting y Supabase Auth. Diagnóstico Express es una sección del portal. Esta confirmación no autoriza cambiar DNS ni reemplazar el sitio principal.

Consultar [preparación de pagos y acceso](RELEASE_MEMBERSHIPS.md) antes de habilitar cobros. No copiar `.env.example` a producción sin reemplazar sus valores; el ejemplo local habilita mocks.

Estado al 21 de octubre de 2026: **no listo para deploy**. El código del PR #17 necesita las vistas/RPC de las migraciones propuestas, todavía no aplicadas. Se requiere inspección administrativa del esquema/RLS/ACL real, resolver drift de offers/resources, revisar ambas migraciones y verificar configuración del hosting para el dominio confirmado, Supabase Auth y Flow. La presencia de variables locales no acredita configuración remota. No se ejecutaron build ni verificaciones operativas en esta preparación.
