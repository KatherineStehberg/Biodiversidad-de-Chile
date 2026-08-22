# Deploy en Coolify

Repositorio canónico: `KatherineStehberg/Biodiversidad-de-Chile`

## Runtime
- Next.js 15 con `output: 'standalone'`
- Node.js 22
- Puerto: `3000`
- Dockerfile incluido en el repositorio

## Variables de entorno mínimas
Configurar en Coolify tomando `.env.example` como plantilla y usando valores reales sólo en el panel de secretos/variables de entorno:

- `NEXT_PUBLIC_SITE_URL=https://biodiversidad.cl`
- `NEXTAUTH_URL=https://biodiversidad.cl`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_USE_MOCK_DATA=false`

Variables adicionales dependen de las funciones habilitadas: moderación, SMTP, Flow y n8n. No copiar secretos al repositorio.

## Estrategia de deploy
1. Crear aplicación desde este repositorio y rama `main`.
2. Usar el Dockerfile existente.
3. Exponer puerto `3000`.
4. Configurar dominio `biodiversidad.cl` y TLS.
5. Cargar variables de entorno en Coolify.
6. Desplegar.
7. Validar `/api/health`, home y recorridos comerciales principales.

## Criterio de cierre
- Contenedor saludable.
- `/api/health` responde HTTP 200.
- Home carga sin errores.
- Formularios/CTA prioritarios responden.
- No existen secretos en GitHub.
