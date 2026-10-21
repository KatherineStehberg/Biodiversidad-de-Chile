# Preparación de pagos y acceso — 21 octubre 2026

## Cambios preparados (sin desplegar)

- Brote $5.700 CLP y Bosque $10.000 CLP usan la misma tabla de precios en UI y servidor. Semilla dirige al registro gratuito.
- Pago por un mes mediante `payment/create` de Flow. Renovación manual, sin suscripción recurrente ni tarjeta almacenada.
- Firma HMAC SHA256; credenciales de servidor. El navegador nunca fija monto ni usuario.
- Confirmación POST de Flow con token; el servidor consulta `payment/getStatus` y valida orden, monto, moneda y orden del proveedor en SQL antes de activar.
- Confirmación transaccional e idempotente compartida entre webhook y retorno; reintentos no suman meses. Dos pagos distintos acumulan periodos.
- Acceso de membresía consultado con bearer token, estado active y vencimiento futuro. `usuarios.membresia_activa` deja de ser la fuente de autorización.
- Se retiran recibos, fechas y transacciones ficticios de las pantallas de resultado.
- Se impide solicitar rol admin mediante la API de perfil; migración protege campos privilegiados frente a escritura directa.

## Configuración real pendiente

En el hosting, antes del build:

- `NEXT_PUBLIC_SITE_URL`: URL HTTPS del portal definitivo, sin rutas. Confirmar si sigue siendo `https://consultores.biodiversidad.cl`.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`: proyecto real.
- `NEXT_PUBLIC_USE_MOCK_DATA=false`.

Sólo en servidor:

- `SUPABASE_SERVICE_ROLE_KEY` (nunca NEXT_PUBLIC).
- `FLOW_ENVIRONMENT=production` para cobros reales, `sandbox` para entorno separado. Usar credenciales del mismo ambiente.
- `FLOW_API_KEY`, `FLOW_SECRET_KEY`.
- SMTP, moderación y webhook n8n según `.env.example` para las funciones correspondientes.

Supabase Auth: confirmar Site URL, permitir redirecciones al dominio del portal (`/dashboard`, `/reset-password`), habilitar Email/Google si se ofrecerán y configurar el OAuth client/callback de Supabase en Google. El correo de confirmación/recuperación usa la configuración de **Supabase Auth**, independiente del Nodemailer de la aplicación.

## Migración pendiente de revisión, no ejecutada

`docs/migrations/20261021_flow_memberships.sql` requiere tablas reales `usuarios` y `subscriptions` compatibles. Inspeccionar esquema y políticas vigentes, guardar definición y respaldo previo. La migración es transaccional: agrega columnas/índices; reemplaza políticas de subscriptions; restringe escrituras a service_role; agrega la función de confirmación y un trigger sobre privilegios de usuarios.

No ejecutar `docs/supabase-schema.sql` completo sobre una base existente. No importar ni activar suscripciones antiguas sin evidencia del pago y vencimiento. No hay migración automática de membresías manuales/legacy.

Para revertir: detener nuevos pagos primero; conservar órdenes/fechas/identificadores y el esquema aditivo. Restaurar código/definiciones anteriores desde respaldo sólo después de revisar las órdenes recibidas. No eliminar tablas, columnas ni pagos para hacer rollback.

## Rutas

- Creación autenticada: `POST /api/subscriptions/create`.
- Confirmación Flow: `POST /api/subscriptions/webhook`.
- Retorno Flow: `POST /api/subscriptions/return`.
- Membresía propia vigente: `GET /api/subscriptions/me`, bearer token.

Flow recibe las URLs al crear cada orden. No se asume que un link de pago externo active una membresía. Documentación oficial consultada: https://developers.flow.cl/api y https://developers.flow.cl/docs/quick-start .

## Pendientes que siguen bloqueando aprobación de producción

- Credenciales/hosting/Supabase real no inspeccionados ni configurados en esta intervención.
- Migración preparada, no aplicada; esquema/RLS general del issue #11 sigue pendiente. Esta migración cubre subscriptions y privilegios de perfil, no cierra toda la auditoría.
- Los gates visuales de contacto no sustituyen permisos del servidor/base. Hay que verificar que contactos/datos privados no se entreguen en consultas públicas antes de vender ese beneficio.
- Los enlaces Flow existentes de Diagnóstico (Starter/Pro/Business) son productos distintos, quedan conservados y no usan este recorrido de membresías. Confirmar vigencia, titular, monto y operación de esos botones en la cuenta de Flow.
- El marketplace ofrece contacto con vendedor, no carrito/checkout de productos. No se agregó cobro por cada producto.
- Las prestaciones anunciadas en planes (API, reportes, descargas, etc.) requieren confirmar que existen y están disponibles antes de publicar la oferta.
- Sin tests, lint, typecheck, build, transacciones ni cambios en la base real por instrucción de Katherine. Sólo revisión de código/diff y documentación. No considerar este PR validado para producción.
