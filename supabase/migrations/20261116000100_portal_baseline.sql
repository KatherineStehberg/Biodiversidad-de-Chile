-- Portal Biodiversidad. Apply to a clean Supabase project.
-- Supabase manages auth.users, storage tables and API roles.
BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind IN ('r', 'p', 'v', 'm', 'f')
      AND c.relname IN (
        'usuarios', 'users', 'consultores', 'products', 'offers', 'resources',
        'subscriptions', 'public_profiles', 'public_consultants', 'public_offers'
      )
  ) THEN
    RAISE EXCEPTION 'Portal baseline requires a clean schema. Existing data has not been changed.';
  END IF;
END
$$;

CREATE TABLE public.usuarios (
  id               UUID         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email            TEXT         UNIQUE NOT NULL,
  name             TEXT,
  address          TEXT,
  bio              TEXT,
  tipo_usuario     TEXT         NOT NULL DEFAULT 'usuario_regular'
                                CHECK (tipo_usuario IN ('usuario_regular','consultor','reclutador','admin')),
  rol              TEXT,
  imagen_perfil    TEXT,
  membresia_activa BOOLEAN      NOT NULL DEFAULT FALSE,
  linkedin_url     TEXT,
  instagram_url    TEXT,
  facebook_url     TEXT,
  tiktok_url       TEXT,
  puntos           INTEGER      NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE public.consultores (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id      UUID        UNIQUE NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  especialidad    TEXT        NOT NULL DEFAULT 'General',
  experiencia     TEXT,
  cv_url          TEXT,
  portfolio_url   TEXT,
  certificaciones TEXT,
  verificado      BOOLEAN     NOT NULL DEFAULT FALSE,
  "isApproved"    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.products (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT          NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) CHECK (price >= 0),
  category    TEXT,
  images      JSONB         NOT NULL DEFAULT '[]',
  seller_id   UUID          REFERENCES public.usuarios(id) ON DELETE SET NULL,
  country     TEXT,
  city        TEXT,
  is_approved BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE public.offers (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT        NOT NULL,
  description    TEXT,
  company        TEXT,
  requirements   TEXT,
  currency       TEXT NOT NULL DEFAULT 'CLP',
  location       JSONB,
  "salaryMin"    NUMERIC CHECK ("salaryMin" >= 0),
  "salaryMax"    NUMERIC CHECK ("salaryMax" >= 0),
  modality       TEXT,
  "employmentType" TEXT,
  contact        TEXT,
  contract_type  TEXT,
  salary_range   TEXT,
  tags           JSONB       NOT NULL DEFAULT '[]',
  author         UUID        REFERENCES public.usuarios(id) ON DELETE SET NULL,
  "isApproved"   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.resources (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  description TEXT        NOT NULL,
  link        TEXT,
  "isActive"  BOOLEAN     NOT NULL DEFAULT FALSE,
  author_id   UUID        REFERENCES public.usuarios(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.subscriptions (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  "user"      UUID          REFERENCES public.usuarios(id) ON DELETE SET NULL,
  "providerId" TEXT UNIQUE,
  "startedAt" TIMESTAMPTZ,
  "currentPeriodEnd" TIMESTAMPTZ,
  "planId"    TEXT          NOT NULL,
  "planName"  TEXT          NOT NULL,
  price       NUMERIC(10,2) NOT NULL,
  currency    TEXT          NOT NULL DEFAULT 'USD',
  status      TEXT          NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending','active','cancelled','expired')),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX products_seller_idx ON public.products (seller_id);
CREATE INDEX offers_author_idx ON public.offers (author);
CREATE INDEX resources_author_idx ON public.resources (author_id);
CREATE INDEX subscriptions_user_idx ON public.subscriptions ("user", created_at DESC);

CREATE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, name)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name',
             pg_catalog.split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW WHEN (NEW.email IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_user();

-- Profile updates are permitted after signup through an ID-based upsert.
-- Enforce verified Auth identity and prevent promotion to admin by API callers.
CREATE FUNCTION public.check_profile_identity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  IF current_user = 'authenticated' THEN
    IF NEW.tipo_usuario = 'admin'
       AND (TG_OP = 'INSERT' OR OLD.tipo_usuario IS DISTINCT FROM 'admin') THEN
      RAISE EXCEPTION 'Admin role is managed by the portal administrator' USING ERRCODE = '42501';
    END IF;
    IF TG_OP = 'UPDATE' AND NEW.rol IS DISTINCT FROM OLD.rol
       AND NEW.rol IS NOT NULL
       AND NEW.rol NOT IN ('user', 'consultant', 'reclutador', 'usuario_regular', 'consultor') THEN
      RAISE EXCEPTION 'Protected role' USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_profile_identity
  BEFORE INSERT OR UPDATE ON public.usuarios
  FOR EACH ROW EXECUTE FUNCTION public.check_profile_identity();

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.usuarios, public.consultores, public.products, public.offers,
  public.resources, public.subscriptions FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.usuarios, public.consultores, public.products, public.offers,
  public.resources, public.subscriptions TO service_role;

GRANT SELECT ON public.usuarios TO authenticated;
GRANT INSERT (id,email,name,address,tipo_usuario,linkedin_url,instagram_url,facebook_url,tiktok_url,updated_at)
  ON public.usuarios TO authenticated;
GRANT UPDATE (email,name,address,tipo_usuario,linkedin_url,instagram_url,facebook_url,tiktok_url,
              imagen_perfil,rol,updated_at)
  ON public.usuarios TO authenticated;
CREATE POLICY profile_own_read ON public.usuarios FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id);
CREATE POLICY profile_own_insert ON public.usuarios FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id AND email = (SELECT auth.jwt()->>'email'));
CREATE POLICY profile_own_update ON public.usuarios FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id AND email = (SELECT auth.jwt()->>'email'));

GRANT SELECT ON public.consultores TO authenticated;
GRANT INSERT (usuario_id,especialidad,experiencia,cv_url,portfolio_url,certificaciones)
  ON public.consultores TO authenticated;
GRANT UPDATE (especialidad,experiencia,cv_url,portfolio_url,certificaciones)
  ON public.consultores TO authenticated;
CREATE POLICY consultant_own_read ON public.consultores FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = usuario_id);
CREATE POLICY consultant_own_insert ON public.consultores FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = usuario_id);
CREATE POLICY consultant_own_update ON public.consultores FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = usuario_id) WITH CHECK ((SELECT auth.uid()) = usuario_id);

-- Changes to a published consultant profile require another moderation pass.
CREATE FUNCTION public.review_consultant_edits()
RETURNS trigger LANGUAGE plpgsql SET search_path = ''
AS $$
BEGIN
  IF current_user = 'authenticated' THEN
    NEW."isApproved" := false;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER review_consultant_edits BEFORE UPDATE ON public.consultores
  FOR EACH ROW EXECUTE FUNCTION public.review_consultant_edits();

GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT (title,description,price,category,images,seller_id,country,city),
      UPDATE (title,description,price,category,images,country,city), DELETE
  ON public.products TO authenticated;
CREATE POLICY product_visible ON public.products FOR SELECT TO anon, authenticated
  USING (is_approved OR (SELECT auth.uid()) = seller_id);
CREATE POLICY product_own_insert ON public.products FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = seller_id);
CREATE POLICY product_own_update ON public.products FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = seller_id) WITH CHECK ((SELECT auth.uid()) = seller_id);
CREATE POLICY product_own_delete ON public.products FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = seller_id);

CREATE FUNCTION public.review_product_edits()
RETURNS trigger LANGUAGE plpgsql SET search_path = ''
AS $$
BEGIN
  IF current_user = 'authenticated' THEN
    NEW.is_approved := false;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER review_product_edits BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.review_product_edits();

GRANT SELECT ON public.offers TO authenticated;
GRANT INSERT (title,description,company,requirements,currency,location,"salaryMin","salaryMax",modality,"employmentType",
              contact,contract_type,salary_range,tags,author) ON public.offers TO authenticated;
CREATE POLICY offer_own_read ON public.offers FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = author);
CREATE POLICY offer_own_insert ON public.offers FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = author);

GRANT SELECT ON public.resources TO anon, authenticated;
GRANT INSERT (title,description,link,author_id) ON public.resources TO authenticated;
CREATE POLICY resource_visible ON public.resources FOR SELECT TO anon, authenticated
  USING ("isActive" OR (SELECT auth.uid()) = author_id);
CREATE POLICY resource_own_insert ON public.resources FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = author_id);

GRANT SELECT ON public.subscriptions TO authenticated;
CREATE POLICY subscription_own_read ON public.subscriptions FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = "user");

-- These projections intentionally run with the view owner's privileges so the
-- underlying private tables can keep owner-only policies.
CREATE VIEW public.public_profiles WITH (security_barrier = true) AS
SELECT p.id, p.name, p.imagen_perfil AS avatar, p.bio FROM public.usuarios p
WHERE p.id = (SELECT auth.uid())
   OR EXISTS (SELECT 1 FROM public.products m WHERE m.seller_id = p.id AND m.is_approved);

CREATE VIEW public.public_consultants WITH (security_barrier = true) AS
SELECT c.id, c.especialidad, c.experiencia, c.portfolio_url, c.certificaciones,
       c.verificado, c."isApproved", c.created_at, p.name, p.imagen_perfil
FROM public.consultores c JOIN public.usuarios p ON p.id = c.usuario_id
WHERE c."isApproved";

CREATE VIEW public.public_offers WITH (security_barrier = true) AS
SELECT id,title,description,location,"salaryMin","salaryMax",modality,"employmentType",
       tags,"isApproved",created_at
FROM public.offers
WHERE "isApproved";

REVOKE ALL ON public.public_profiles, public.public_consultants, public.public_offers
  FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.public_profiles, public.public_consultants, public.public_offers
  TO anon, authenticated;

CREATE FUNCTION public.offer_contact(offer_id uuid)
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT o.contact FROM public.offers o
  WHERE o.id = offer_id AND (
    o.author = (SELECT auth.uid())
    OR (o."isApproved" AND EXISTS (
      SELECT 1 FROM public.usuarios p
      WHERE p.id = (SELECT auth.uid()) AND p.membresia_activa
    ))
  );
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user(), public.check_profile_identity(),
  public.review_consultant_edits(), public.review_product_edits(), public.offer_contact(uuid)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.offer_contact(uuid) TO authenticated;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true), ('documentos', 'documentos', false);

CREATE POLICY portal_avatar_read ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'avatars');
CREATE POLICY portal_avatar_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND owner_id = (SELECT auth.uid())::text);
CREATE POLICY portal_avatar_update ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND owner_id = (SELECT auth.uid())::text)
  WITH CHECK (bucket_id = 'avatars' AND owner_id = (SELECT auth.uid())::text);
CREATE POLICY portal_avatar_delete ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND owner_id = (SELECT auth.uid())::text);
CREATE POLICY portal_document_read ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'documentos' AND owner_id = (SELECT auth.uid())::text);
CREATE POLICY portal_document_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documentos' AND owner_id = (SELECT auth.uid())::text);
CREATE POLICY portal_document_delete ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'documentos' AND owner_id = (SELECT auth.uid())::text);

COMMIT;
