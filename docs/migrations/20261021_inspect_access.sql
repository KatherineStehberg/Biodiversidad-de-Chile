-- Sólo lectura de metadatos. Preparado, NO ejecutado.
-- Ejecutar con acceso de administración autorizado y revisar el resultado en privado.
-- No selecciona datos de personas ni secretos. No exportar filas de auth.users.
SELECT table_schema, table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE (table_schema='public' AND table_name IN
 ('usuarios','users','consultores','consultants','offers','products','resources','subscriptions'))
 OR (table_schema='storage' AND table_name='objects' AND column_name IN ('owner','owner_id','name','bucket_id'))
ORDER BY table_schema, table_name, ordinal_position;

SELECT n.nspname AS schema_name, c.relname, c.relrowsecurity, c.relforcerowsecurity, c.relacl
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname IN ('public','storage') AND c.relkind IN ('r','v','m');
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies WHERE schemaname IN ('public','storage') ORDER BY schemaname, tablename, policyname;
SELECT grantee, table_schema, table_name, privilege_type
FROM information_schema.table_privileges WHERE table_schema IN ('public','storage');
SELECT grantee, table_schema, table_name, column_name, privilege_type
FROM information_schema.column_privileges WHERE table_schema IN ('public','storage');
SELECT schemaname, viewname, definition FROM pg_views WHERE schemaname='public';
-- Inventario de funciones expuestas: inspeccionar definiciones en privado (pueden contener
-- configuración histórica sensible). Especial atención a SECURITY DEFINER y grants PUBLIC.
SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS arguments,
 p.prosecdef, p.proacl, p.proconfig
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public';
SELECT event_object_schema, event_object_table, trigger_name, action_statement
FROM information_schema.triggers WHERE event_object_schema IN ('public','auth');
SELECT id, public, file_size_limit, allowed_mime_types FROM storage.buckets;
-- Conteos agregados para planificar archivos legacy; no listar nombres ni URLs privadas.
SELECT bucket_id, count(*) AS objects, count(*) FILTER (WHERE owner_id IS NULL) AS missing_owner
FROM storage.objects GROUP BY bucket_id;
