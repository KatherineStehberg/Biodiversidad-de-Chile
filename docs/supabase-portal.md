# Base independiente del portal Biodiversidad

Aplica `supabase/migrations/20261116000100_portal_baseline.sql` en un proyecto Supabase limpio de la organización propietaria del portal. Se puede ejecutar como una sola consulta en SQL Editor. La migración se detiene antes de cambiar datos si ya existen tablas del portal. Conserva cualquier copia anterior en su proyecto actual. El escenario de arranque limpio comienza con registros nuevos y funciona sin datos, usuarios ni credenciales de Bio2.

En Supabase Auth, habilita correo y contraseña con confirmación. Usa el dominio del entorno como Site URL y los retornos exactos `/dashboard` y `/reset-password`. Para Google, usa un cliente web de la organización y registra el callback que aparece en el proveedor Google del nuevo Supabase. El Client ID y el secreto se configuran en Supabase, con un cliente independiente del que usa Bio2. Usa SMTP propio para confirmar altas y recuperar contraseñas del público.

Configura en Coolify para compilación y ejecución `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `NEXT_PUBLIC_USE_MOCK_DATA=false`. Configura `SUPABASE_SERVICE_ROLE_KEY` solo en el servidor y verifica que URL y claves sean del mismo proyecto. Usa un `MODERATION_SECRET` de esta instalación. Revisa el origen del portal y los ajustes de correo de `.env.example`.

Prueba en un entorno de ensayo antes de cambiar Coolify de producción. Cubre alta, confirmación y recuperación por correo, login Google, edición del perfil, avatar y CV privado, directorio, ofertas, marketplace, recursos y moderación. Verifica con dos cuentas que solo puedan editar sus datos y que la oferta publicada oculte el contacto a quien no tenga membresía. Registra el commit de prueba y el estado de las variables anteriores en el alojamiento para poder revertir el portal.

Las suscripciones pueden registrarse como pendientes. El receptor Flow de la versión actual es un borrador y no valida pagos. La activación de membresía por pago depende de una integración Flow verificada por el servidor.
