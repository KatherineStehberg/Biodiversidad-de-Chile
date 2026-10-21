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

- `NEXT_PUBLIC_SITE_URL`: `https://portal.biodiversidad.cl`, dominio definitivo del sitio completo confirmado por Katherine, sin rutas. Diagnóstico Express es una sección de este portal.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`: proyecto real.
- `NEXT_PUBLIC_USE_MOCK_DATA=false`.

Sólo en servidor:

- `SUPABASE_SERVICE_ROLE_KEY` (nunca NEXT_PUBLIC).
- `FLOW_ENVIRONMENT=production` para cobros reales, `sandbox` para entorno separado. Usar credenciales del mismo ambiente.
- `FLOW_API_KEY`, `FLOW_SECRET_KEY`.
- SMTP, moderación y webhook n8n según `.env.example` para las funciones correspondientes.

Supabase Auth: confirmar Site URL, permitir redirecciones al dominio del portal (`/dashboard`, `/reset-password`), habilitar Email/Google si se ofrecerán y configurar el OAuth client/callback de Supabase en Google. El correo de confirmación/recuperación usa la configuración de **Supabase Auth**, independiente del Nodemailer de la aplicación. Activar confirmación de correo y revisar SMTP, remitente, plantillas, límites y entrega en Auth. El cliente actual usa el retorno implícito de supabase-js; no configurar plantillas PKCE/token_hash sin implementar su callback correspondiente.

## Migración pendiente de revisión, no ejecutada

Orden de revisión (ningún SQL ejecutado):

1. `docs/migrations/20261021_inspect_access.sql`: consultas de metadatos, sin filas privadas. Requiere acceso administrativo autorizado. Exportar definiciones y ACL/RLS actuales, incluidos vistas, funciones SECURITY DEFINER, triggers y Storage. Revisar definiciones de funciones en privado; no publicar secretos históricos.
2. `docs/migrations/20261021_flow_memberships.sql`: requiere tablas reales `usuarios` y `subscriptions` compatibles. Agrega columnas/índices, restringe subscriptions a lectura propia/escritura de servicio y prepara confirmación transaccional y protección de privilegios.
3. `docs/migrations/20261021_privacy_moderation.sql`: propuesta complementaria para #11. Reemplaza políticas de las tablas indicadas y revoca grants de tabla y columna; perfiles privados propios; vistas públicas de proyección explícita; contactos sólo por RPC con membresía vigente y recurso aprobado; triggers que devuelven escrituras cliente a moderación; guardas restrictivas de Storage por propietario/ruta. No ejecutar sin revisar impacto en consumidores existentes.

Ambas migraciones de cambios son transaccionales y requieren revisión contra el esquema real y respaldo previo. No se certifica compatibilidad con producción. La segunda exige el contrato de columnas de la aplicación: en particular `offers.requirements`, `salaryMin`, `salaryMax`, `currency`, `location` JSON, `modality`, `employmentType`, `contact` TEXT y `resources.image`. El SQL histórico no contiene todas esas columnas. Si hay drift, preparar una migración de compatibilidad después de inspeccionar tipos/datos; no convertir `location` TEXT a JSON ni inventar columnas a ciegas.

Revisar también el trigger real que crea `usuarios` desde `auth.users`: registro Email y Google deben crear el perfil con el mismo UUID, email verificado y rol regular, sin confiar en metadatos para privilegios. Una cuenta sin perfil no puede crear la orden por la FK de subscriptions. Resolver perfiles faltantes y conflictos de email con evidencia, sin reasignarlos por suposición.

No ejecutar `docs/supabase-schema.sql` completo sobre una base existente. No importar ni activar suscripciones antiguas sin evidencia del pago y vencimiento. No hay migración automática de membresías manuales/legacy.

Para revertir: detener nuevos pagos primero; conservar órdenes/fechas/identificadores y el esquema aditivo. Restaurar código/definiciones anteriores desde respaldo sólo después de revisar las órdenes recibidas. No eliminar tablas, columnas ni pagos para hacer rollback.

## Rutas

- Creación autenticada: `POST /api/subscriptions/create`.
- Confirmación Flow: `POST /api/subscriptions/webhook`.
- Retorno Flow: `POST /api/subscriptions/return`.
- Membresía propia vigente: `GET /api/subscriptions/me`, bearer token.
- Contacto privado: `GET /api/contacts?kind=offer|consultant&id=UUID`, bearer token; delega autorización a `membership_contact` usando la sesión del solicitante, sin service_role.
- Moderación: enlace a `/moderation?type=...&id=...#secret=...`, confirmación explícita por POST. La clave se retira del fragmento del navegador; no viaja en la query HTTP. Revisar contenido con acceso administrativo antes de decidir. Rechazar conserva el comportamiento existente de eliminar la publicación.

Flow recibe las URLs al crear cada orden. No se asume que un link de pago externo active una membresía. Documentación oficial consultada: https://developers.flow.cl/api y https://developers.flow.cl/docs/quick-start .

## Correcciones adicionales de esta revisión

- Los contactos de ofertas ya no se seleccionan ni serializan en la página pública. Los paneles consultan el contacto por API autorizada; no usan un email/contacto recibido como prop pública. La protección de REST directo depende de aplicar y comprobar la migración revisada.
- Directorio de consultores y vendedores usa `consultant_directory` / `public_profiles`, sin email, dirección, redes ni CV. API pública de producto filtra aprobación y elimina email legacy. Marketplace filtra aprobados y corrige `avatar`/`imagen_perfil` mediante la vista.
- PUT/DELETE de productos exigen sesión y propiedad explícita. Las ofertas aceptan una lista de campos y no hacen SELECT de contacto después de insertar. Las ediciones profesionales vuelven a moderación; perfiles se guardan por UUID. Se retiran escrituras cliente del campo privilegiado `rol`.
- Moderación usa cliente privado de servicio tras verificar la clave; corrige `consultants/user` a `consultores/usuario_id` y `users` a `usuarios`. Los enlaces ya no intentan ejecutar un GET contra una API que sólo acepta POST.
- Avatares nuevos se guardan en carpeta del UUID, con tipos JPEG/PNG/WebP, límite 5 MB y sin sobrescritura. CV nuevos guardan referencia privada de Storage y el propietario obtiene una URL firmada de 5 minutos; no se guardan URLs firmadas en la base. Propuesta: bucket documentos privado y acceso por propietario. Revisar objetos legacy sin owner/ruta y URLs antiguas o firmadas aún vigentes; no mover ni borrar archivos a ciegas. Compartir CV con terceros no se implementa como beneficio pagado.
- Registro con sesión inmediata dirige al dashboard. Reenvío de confirmación y recuperación usan la URL del portal. Recuperación observa cambios de sesión y cierra sesión después de cambiar contraseña. Google y entrega real de correos siguen sin verificación operativa.
- En producción Auth ya no supone un dominio cuando falta `NEXT_PUBLIC_SITE_URL`; exige origen HTTPS sin rutas. Flow aplica la misma restricción y comprueba tipos de orden/importe/moneda al leer el estado.
- Membresía propia excluye periodos que todavía no empiezan y responde sin caché con campos limitados. SQL rechaza valores nulos de importe/moneda/orden. Cliente servidor no persiste sesiones entre peticiones. Seed queda deshabilitado en producción; ofertas ficticias sólo aparecen con mocks explícitos.

## Inventario de configuración: local no equivale a hosting

No hay conexión administrativa identificada a Supabase, Flow ni al panel de hosting en esta sesión. No se consultaron datos privados, esquema/políticas reales ni variables remotas. El repositorio no identifica un proyecto accesible de hosting; no se puede afirmar «configurada» o «faltante» en hosting sin leer ese panel. No se cambiaron DNS ni sitios.

| Nombres | Estado local (sin valores) | Estado hosting |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_USE_MOCK_DATA` | Configuradas | Sin acceso; pendiente de lectura |
| `SUPABASE_SERVICE_ROLE_KEY`, `FLOW_ENVIRONMENT`, `FLOW_API_KEY`, `FLOW_SECRET_KEY` | Faltantes | Sin acceso; pendiente de lectura |
| `MODERATION_SECRET`, `ADMIN_EMAILS`, `ADMIN_EMAIL`, `REVALIDATE_SECRET` | Faltantes | Sin acceso; pendiente de lectura |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | Faltantes | Sin acceso; pendiente de lectura |
| `SMTP_PORT` | Configurada | Sin acceso; pendiente de lectura |
| `N8N_DIAGNOSTIC_WEBHOOK_URL`, `N8N_WEBHOOK_URL` | Faltantes | Sin acceso; pendiente de lectura |
| `OFFERS_SHOW_PENDING`, `OFFERS_ENFORCE_SMTP` | Configuradas | Sin acceso; pendiente de lectura |

`FLOW_CHECKOUT_URL` local es legacy y no configura el nuevo flujo. `NEXTAUTH_URL`/`NEXTAUTH_SECRET` locales no configuran Supabase Auth. No copiar secretos ni archivos .env a Git ni al chat. El estado «configurada» sólo indica presencia, no validez. Katherine confirmó `https://portal.biodiversidad.cl` para el sitio completo. Sigue pendiente comprobar su configuración efectiva en hosting, Supabase Auth y retornos de Flow; la confirmación del destino no acredita configuración remota. El sitio principal no se reemplaza y no se modificó DNS.

## Correspondencia de beneficios

Se retiraron de las tarjetas de membresía las promesas sin prestación pagada identificada: boletín mensual (el panel de suscripción simula envío), mapas básicos como beneficio del plan, descargas CSV/JSON avanzadas, navegación sin publicidad diferenciada, insignia verificada, soporte prioritario, API REST premium, reportes exclusivos, contacto con investigadores, menciones anuales y licencia comercial de datos. Las APIs ambientales existentes no constituyen una API premium con licenciamiento y cuotas. No vender esas prestaciones sin implementarlas y definir su alcance.

Semilla describe navegación pública, perfil y envío a moderación. Brote describe contactos de ofertas/consultores aprobados durante un mes. Bosque declara los mismos beneficios de acceso y un aporte mayor; no tiene funcionalidades exclusivas implementadas. Ambos mantienen precio y renovación manual. Su entrega depende de esquema/permisos/Auth y pago verificados; el texto no certifica funcionamiento en producción.

## Pendientes que siguen bloqueando aprobación de producción — NO LISTO

- Credenciales/hosting/Supabase real no inspeccionados ni configurados en esta intervención.
- Obtener lectura autorizada del panel del hosting y administración de Supabase/Flow por canales del proveedor, sin compartir claves en chat. Verificar el dominio confirmado `portal.biodiversidad.cl` y variables reales antes del build Node.js 22/Next.js, sin Docker. Supabase Auth debe usar `https://portal.biodiversidad.cl` como Site URL y permitir `https://portal.biodiversidad.cl/dashboard` y `https://portal.biodiversidad.cl/reset-password`; Flow recibirá confirmación y retorno bajo ese mismo origen mediante la configuración del servidor.
- Inspeccionar esquema/RLS/ACL, vistas y funciones expuestas reales; ajustar y revisar ambas migraciones. Corregir drift de offers/resources y perfil Auth antes de aplicarlas mediante un procedimiento separado autorizado. #11 sigue abierto: no hay evidencia real de que REST/GraphQL/RPC antiguos no expongan datos.
- El código nuevo requiere las vistas y RPC propuestas: no desplegarlo contra la base antigua. Verificar rechazo de consultas de usuarios ajenos, contactos sin membresía, contenido pendiente, autoaprobación y mutación de archivos ajenos en un entorno separado, cuando se autorice esa validación.
- Configurar Email/Google, URLs permitidas, confirmación y recuperación en Supabase Auth; comprobar registro, llegada y uso de correo, login, OAuth, logout y dashboard. Configurar SMTP/admin/moderación para que la revisión editorial pueda operar.
- Verificar cuenta y ambiente Flow; posteriormente autorizar validación sandbox de creación, confirmación/retorno, reintentos, expiración y pagos simultáneos. No se hicieron llamadas de pago ni cobros en esta revisión.
- Los enlaces Flow existentes de Diagnóstico (Starter/Pro/Business) son productos distintos, quedan conservados y no usan este recorrido de membresías. Confirmar vigencia, titular, monto y operación de esos botones en la cuenta de Flow.
- El marketplace ofrece contacto con vendedor, no carrito/checkout de productos. No se agregó cobro por cada producto.
- Aprobar el alcance comercial simplificado de Brote/Bosque; las promesas retiradas permanecen pendientes si se desea ofrecerlas.
- Sin tests, lint, typecheck, build, transacciones ni cambios en la base real por instrucción de Katherine. Sólo revisión de código/diff y documentación. No considerar este PR validado para producción.

Referencias técnicas consultadas para la propuesta: [RLS de Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security), [control de acceso de Storage](https://supabase.com/docs/guides/storage/security/access-control) y [API oficial de Flow](https://developers.flow.cl/api). Estas referencias describen mecanismos; no acreditan el estado del proyecto real.
