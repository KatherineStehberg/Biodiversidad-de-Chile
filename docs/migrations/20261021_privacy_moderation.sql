-- PROPUESTA para revisión después de inspeccionar el esquema/ACL/RLS real (#11).
-- NO ejecutada. Aplicar después de 20261021_flow_memberships.sql, en staging primero.
-- Requiere el contrato de columnas consumido por el código (offers.contact TEXT incluido).
-- Si falta alguna columna: detenerse y resolver drift; no importar supabase-schema.sql.
BEGIN;

-- Quitar ACL de tabla Y columna: un GRANT de columna antiguo sobrevive al REVOKE de tabla.
DO $$ DECLARE t text; c record; p record;
BEGIN
  FOREACH t IN ARRAY ARRAY['usuarios','users','consultores','products','offers','resources','subscriptions'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('REVOKE ALL ON public.%I FROM PUBLIC, anon, authenticated', t);
    FOR c IN SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name=t LOOP
      EXECUTE format('REVOKE ALL (%I) ON public.%I FROM PUBLIC, anon, authenticated', c.column_name, t);
    END LOOP;
    IF t <> 'subscriptions' THEN
      FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename=t LOOP
        EXECUTE format('DROP POLICY %I ON public.%I', p.policyname, t);
      END LOOP;
    END IF;
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  END LOOP;
END $$;

-- Perfil privado propio; ninguna lectura pública de email/address/redes/roles.
GRANT SELECT, INSERT, UPDATE ON public.usuarios TO authenticated;
CREATE POLICY usuarios_own_read ON public.usuarios FOR SELECT TO authenticated USING (id=auth.uid());
CREATE POLICY usuarios_own_insert ON public.usuarios FOR INSERT TO authenticated WITH CHECK (id=auth.uid());
CREATE POLICY usuarios_own_update ON public.usuarios FOR UPDATE TO authenticated
  USING (id=auth.uid()) WITH CHECK (id=auth.uid());
-- public.users es legacy: sin acceso cliente. Auditar vistas/RPC antiguas que lo expongan.

-- Vistas deliberadamente ejecutadas con permisos del creador: proyección pública cerrada,
-- con filtro de aprobación en la propia definición. Crear como propietario de las tablas.
CREATE OR REPLACE VIEW public.public_profiles WITH (security_barrier=true, security_invoker=false) AS
SELECT u.id, u.name, u.imagen_perfil AS avatar FROM public.usuarios u
WHERE EXISTS (SELECT 1 FROM public.consultores c WHERE c.usuario_id=u.id AND c."isApproved"=true)
   OR EXISTS (SELECT 1 FROM public.products p WHERE p.seller_id=u.id AND p.is_approved=true);
CREATE OR REPLACE VIEW public.consultant_directory WITH (security_barrier=true, security_invoker=false) AS
SELECT c.id, c.usuario_id, c.especialidad, c.experiencia, c.verificado, c."isApproved", c.created_at,
  jsonb_build_object('name',u.name,'imagen_perfil',u.imagen_perfil) AS usuarios
FROM public.consultores c JOIN public.usuarios u ON u.id=c.usuario_id WHERE c."isApproved"=true;
REVOKE ALL ON public.public_profiles, public.consultant_directory FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.public_profiles, public.consultant_directory TO anon, authenticated;

-- Datos profesionales/documentos privados sólo para su autor; directorio por la vista.
GRANT SELECT, INSERT, UPDATE ON public.consultores TO authenticated;
CREATE POLICY consultores_own_read ON public.consultores FOR SELECT TO authenticated USING (usuario_id=auth.uid());
CREATE POLICY consultores_own_insert ON public.consultores FOR INSERT TO authenticated WITH CHECK (usuario_id=auth.uid());
CREATE POLICY consultores_own_update ON public.consultores FOR UPDATE TO authenticated
  USING (usuario_id=auth.uid()) WITH CHECK (usuario_id=auth.uid());

GRANT SELECT (id,title,description,price,category,images,seller_id,country,city,is_approved,created_at) ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
CREATE POLICY products_read ON public.products FOR SELECT TO anon, authenticated
  USING (is_approved=true OR seller_id=auth.uid());
CREATE POLICY products_insert ON public.products FOR INSERT TO authenticated WITH CHECK (seller_id=auth.uid());
CREATE POLICY products_update ON public.products FOR UPDATE TO authenticated USING (seller_id=auth.uid()) WITH CHECK (seller_id=auth.uid());
CREATE POLICY products_delete ON public.products FOR DELETE TO authenticated USING (seller_id=auth.uid());

-- No otorgar SELECT(contact), ni siquiera a authenticated. Contacto sólo por RPC pagada.
-- Lista explícita: una columna nueva no se vuelve pública automáticamente.
GRANT SELECT (id,title,description,requirements,"salaryMin","salaryMax",currency,location,modality,"employmentType",tags,author,"isApproved",created_at)
  ON public.offers TO anon, authenticated;
GRANT INSERT, UPDATE ON public.offers TO authenticated;
CREATE POLICY offers_read ON public.offers FOR SELECT TO anon, authenticated USING ("isApproved"=true OR author=auth.uid());
CREATE POLICY offers_insert ON public.offers FOR INSERT TO authenticated WITH CHECK (author=auth.uid());
CREATE POLICY offers_update ON public.offers FOR UPDATE TO authenticated USING (author=auth.uid()) WITH CHECK (author=auth.uid());

GRANT SELECT (id,title,description,image,link,"isActive",author_id,created_at) ON public.resources TO anon, authenticated;
GRANT INSERT, UPDATE ON public.resources TO authenticated;
CREATE POLICY resources_read ON public.resources FOR SELECT TO anon, authenticated USING ("isActive"=true OR author_id=auth.uid());
CREATE POLICY resources_insert ON public.resources FOR INSERT TO authenticated WITH CHECK (author_id=auth.uid());
CREATE POLICY resources_update ON public.resources FOR UPDATE TO authenticated USING (author_id=auth.uid()) WITH CHECK (author_id=auth.uid());
GRANT SELECT ON public.subscriptions TO authenticated;

-- Toda escritura cliente vuelve a moderación. Ni la API ni REST directo pueden aprobar.
CREATE OR REPLACE FUNCTION public.reset_client_moderation()
RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog, public AS $$
BEGIN
  IF current_user IN ('anon','authenticated') THEN
    IF TG_TABLE_NAME='products' THEN NEW.is_approved := false;
    ELSIF TG_TABLE_NAME='resources' THEN NEW."isActive" := false;
    ELSE NEW."isApproved" := false;
    END IF;
    IF TG_TABLE_NAME='consultores' THEN
      IF TG_OP='INSERT' THEN NEW.verificado := false;
      ELSE NEW.verificado := OLD.verificado;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END $$;
DO $$ DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['consultores','products','offers','resources'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS reset_client_moderation ON public.%I',t);
    EXECUTE format('CREATE TRIGGER reset_client_moderation BEFORE INSERT OR UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.reset_client_moderation()',t);
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.membership_contact(resource_kind text, resource_id uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog, public AS $$
DECLARE result text;
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.subscriptions s WHERE s."user"=auth.uid() AND s.status='active'
      AND s."startedAt"<=now() AND s."currentPeriodEnd">now()
  ) THEN RAISE EXCEPTION 'Active membership required' USING ERRCODE='42501'; END IF;
  IF resource_kind='offer' THEN
    SELECT o.contact INTO result FROM public.offers o WHERE o.id=resource_id AND o."isApproved"=true;
  ELSIF resource_kind='consultant' THEN
    SELECT u.email INTO result FROM public.consultores c JOIN public.usuarios u ON u.id=c.usuario_id
      WHERE c.id=resource_id AND c."isApproved"=true;
  ELSE RAISE EXCEPTION 'Invalid resource';
  END IF;
  RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.membership_contact(text,uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.membership_contact(text,uuid) TO authenticated;

-- Políticas RESTRICTIVE: los permisos amplios existentes no pueden saltar estos límites.
-- No se borran políticas de buckets ajenos. Exportar las políticas reales antes de aplicar.
-- Archivos antiguos sin carpeta UID conservan lectura avatar, requieren revisión para mutar.
CREATE POLICY membership_storage_read_guard ON storage.objects AS RESTRICTIVE FOR SELECT TO anon, authenticated
USING (bucket_id NOT IN ('avatars','documentos') OR bucket_id='avatars' OR
  (bucket_id='documentos' AND owner_id=auth.uid()::text));
CREATE POLICY membership_storage_insert_guard ON storage.objects AS RESTRICTIVE FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id NOT IN ('avatars','documentos') OR (owner_id=auth.uid()::text AND
  ((bucket_id='avatars' AND (storage.foldername(name))[1]=auth.uid()::text) OR
   (bucket_id='documentos' AND (storage.foldername(name))[1]='cvs' AND (storage.foldername(name))[2]=auth.uid()::text))));
CREATE POLICY membership_storage_update_guard ON storage.objects AS RESTRICTIVE FOR UPDATE TO anon, authenticated
USING (bucket_id NOT IN ('avatars','documentos') OR owner_id=auth.uid()::text)
WITH CHECK (bucket_id NOT IN ('avatars','documentos') OR (owner_id=auth.uid()::text AND
  ((bucket_id='avatars' AND (storage.foldername(name))[1]=auth.uid()::text) OR
   (bucket_id='documentos' AND (storage.foldername(name))[1]='cvs' AND (storage.foldername(name))[2]=auth.uid()::text))));
CREATE POLICY membership_storage_delete_guard ON storage.objects AS RESTRICTIVE FOR DELETE TO anon, authenticated
USING (bucket_id NOT IN ('avatars','documentos') OR owner_id=auth.uid()::text);
-- Las policies restrictivas requieren también una policy permisiva para habilitar la operación.
CREATE POLICY membership_storage_owner ON storage.objects FOR ALL TO authenticated
USING (bucket_id IN ('avatars','documentos') AND owner_id=auth.uid()::text)
WITH CHECK (bucket_id IN ('avatars','documentos') AND owner_id=auth.uid()::text);
CREATE POLICY membership_avatar_read ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id='avatars');
UPDATE storage.buckets SET public=false WHERE id='documentos';
COMMIT;
