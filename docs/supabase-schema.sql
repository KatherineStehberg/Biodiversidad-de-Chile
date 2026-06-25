-- ============================================================
-- BIODIVERSIDAD.CL — Esquema completo para Supabase
-- Proyecto: nextjs-bio2-main
-- Fecha: 2026-06-22
-- Pegar en: Dashboard → SQL Editor → New Query → Run
-- ============================================================


-- ══════════════════════════════════════════════════════════
-- 1. TABLA USUARIOS  (perfil principal de cada usuario)
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.usuarios (
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

-- Vista "users" — compatibilidad con seed API y products API
-- (el seed endpoint usa from('users'), los demás usan from('usuarios'))
CREATE TABLE IF NOT EXISTS public.users (
  id         UUID   PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT,
  email      TEXT   UNIQUE,
  avatar     TEXT,
  role       TEXT   DEFAULT 'user',
  bio        TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ══════════════════════════════════════════════════════════
-- 2. TABLA CONSULTORES
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.consultores (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id      UUID        NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  especialidad    TEXT        NOT NULL DEFAULT 'General',
  experiencia     TEXT,
  cv_url          TEXT,
  portfolio_url   TEXT,
  certificaciones TEXT,
  verificado      BOOLEAN     NOT NULL DEFAULT FALSE,
  "isApproved"    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ══════════════════════════════════════════════════════════
-- 3. TABLA PRODUCTS  (marketplace verde)
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.products (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT          NOT NULL,
  description TEXT,
  price       NUMERIC(10,2),
  category    TEXT,
  images      JSONB         NOT NULL DEFAULT '[]',
  seller_id   UUID          REFERENCES public.usuarios(id) ON DELETE SET NULL,
  country     TEXT,
  city        TEXT,
  is_approved BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


-- ══════════════════════════════════════════════════════════
-- 4. TABLA OFFERS  (ofertas laborales)
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.offers (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT        NOT NULL,
  description    TEXT,
  company        TEXT,
  location       TEXT,
  contract_type  TEXT,
  salary_range   TEXT,
  tags           JSONB       NOT NULL DEFAULT '[]',
  author         UUID        REFERENCES public.usuarios(id) ON DELETE SET NULL,
  "isApproved"   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ══════════════════════════════════════════════════════════
-- 5. TABLA RESOURCES  (recursos educativos)
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.resources (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  description TEXT        NOT NULL,
  link        TEXT,
  "isActive"  BOOLEAN     NOT NULL DEFAULT FALSE,
  author_id   UUID        REFERENCES public.usuarios(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ══════════════════════════════════════════════════════════
-- 6. TABLA SUBSCRIPTIONS  (membresías / pagos)
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  "user"      UUID          REFERENCES public.usuarios(id) ON DELETE SET NULL,
  "planId"    TEXT          NOT NULL,
  "planName"  TEXT          NOT NULL,
  price       NUMERIC(10,2) NOT NULL,
  currency    TEXT          NOT NULL DEFAULT 'USD',
  status      TEXT          NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending','active','cancelled','expired')),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


-- ══════════════════════════════════════════════════════════
-- 7. TRIGGER: crear fila en usuarios al registrarse
--    Se dispara automáticamente cuando alguien hace sign up
-- ══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (email) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ══════════════════════════════════════════════════════════
-- 8. ROW LEVEL SECURITY (RLS)
-- ══════════════════════════════════════════════════════════
ALTER TABLE public.usuarios      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultores   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- usuarios
CREATE POLICY "usuarios_select_all" ON public.usuarios FOR SELECT USING (true);
CREATE POLICY "usuarios_insert_own" ON public.usuarios FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "usuarios_update_own" ON public.usuarios FOR UPDATE USING (auth.uid() = id);

-- users (seed / lectura seller)
CREATE POLICY "users_select_all"  ON public.users FOR SELECT USING (true);
CREATE POLICY "users_insert_auth" ON public.users FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- consultores
CREATE POLICY "consultores_select_all"  ON public.consultores FOR SELECT USING (true);
CREATE POLICY "consultores_insert_auth" ON public.consultores FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "consultores_update_own"  ON public.consultores FOR UPDATE USING (auth.uid() = usuario_id);

-- products
CREATE POLICY "products_select_all"  ON public.products FOR SELECT USING (true);
CREATE POLICY "products_insert_auth" ON public.products FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "products_update_own"  ON public.products FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "products_delete_own"  ON public.products FOR DELETE USING (auth.uid() = seller_id);

-- offers
CREATE POLICY "offers_select_all"  ON public.offers FOR SELECT USING (true);
CREATE POLICY "offers_insert_auth" ON public.offers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "offers_update_own"  ON public.offers FOR UPDATE USING (auth.uid() = author);

-- resources
CREATE POLICY "resources_select_all"  ON public.resources FOR SELECT USING (true);
CREATE POLICY "resources_insert_auth" ON public.resources FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "resources_update_own"  ON public.resources FOR UPDATE USING (auth.uid() = author_id);

-- subscriptions (solo el propio usuario)
CREATE POLICY "subscriptions_select_own"  ON public.subscriptions FOR SELECT  USING (auth.uid() = "user");
CREATE POLICY "subscriptions_insert_auth" ON public.subscriptions FOR INSERT  WITH CHECK (auth.uid() IS NOT NULL);


-- ══════════════════════════════════════════════════════════
-- 9. STORAGE BUCKETS
-- ══════════════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('documentos', 'documentos', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas avatars (lectura pública, escritura autenticada)
CREATE POLICY "avatars_public_read"  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars_auth_upload"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);
CREATE POLICY "avatars_auth_update"  ON storage.objects FOR UPDATE USING  (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);
CREATE POLICY "avatars_auth_delete"  ON storage.objects FOR DELETE USING  (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

-- Políticas documentos (solo autenticados)
CREATE POLICY "docs_auth_read"   ON storage.objects FOR SELECT USING (bucket_id = 'documentos' AND auth.uid() IS NOT NULL);
CREATE POLICY "docs_auth_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documentos' AND auth.uid() IS NOT NULL);
CREATE POLICY "docs_auth_delete" ON storage.objects FOR DELETE USING  (bucket_id = 'documentos' AND auth.uid() IS NOT NULL);
