-- Preparada para revisión. NO ejecutada contra Supabase real.
-- Requiere las tablas usuarios/subscriptions del esquema vigente.
-- Transaccional y aditiva; respaldar e inspeccionar esquema/políticas reales antes de aplicar.
BEGIN;
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS "providerId" text,
  ADD COLUMN IF NOT EXISTS "startedAt" timestamptz,
  ADD COLUMN IF NOT EXISTS "currentPeriodEnd" timestamptz;
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_flow_provider_unique
  ON public.subscriptions ("providerId") WHERE "providerId" IS NOT NULL;
CREATE INDEX IF NOT EXISTS subscriptions_user_expiry
  ON public.subscriptions ("user", "currentPeriodEnd") WHERE status = 'active';

-- El navegador sólo puede leer sus propias órdenes. Toda escritura pasa por servidor.
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.subscriptions FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
-- Eliminar todas las políticas anteriores de esta tabla para evitar lecturas amplias.
DO $$ DECLARE item record;
BEGIN
  FOR item IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'subscriptions'
  LOOP EXECUTE format('DROP POLICY %I ON public.subscriptions', item.policyname); END LOOP;
END $$;
CREATE POLICY subscriptions_select_own ON public.subscriptions FOR SELECT TO authenticated
  USING (auth.uid() = "user");

CREATE OR REPLACE FUNCTION public.confirm_flow_payment(
  order_id uuid, flow_order text, paid_amount numeric, paid_currency text, payment_status integer
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  payment public.subscriptions%ROWTYPE;
  next_start timestamptz;
BEGIN
  SELECT * INTO payment FROM public.subscriptions WHERE id = order_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Unknown order'; END IF;
  IF paid_amount IS NULL OR paid_currency IS NULL OR flow_order IS NULL OR flow_order = ''
     OR payment.price IS DISTINCT FROM paid_amount OR payment.currency IS DISTINCT FROM paid_currency THEN
    RAISE EXCEPTION 'Payment mismatch';
  END IF;
  IF payment."providerId" IS NOT NULL AND payment."providerId" <> flow_order THEN
    RAISE EXCEPTION 'Provider order mismatch';
  END IF;
  -- Repetir callback/retorno no extiende ni revoca una membresía ya confirmada.
  IF payment.status = 'active' THEN RETURN; END IF;
  IF payment_status = 2 THEN
    -- Serializar pagos del mismo usuario para acumular meses sin carreras.
    PERFORM id FROM public.usuarios WHERE id = payment."user" FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Unknown user'; END IF;
    SELECT greatest(now(), coalesce(max("currentPeriodEnd"), now())) INTO next_start
      FROM public.subscriptions WHERE "user" = payment."user" AND status = 'active';
    UPDATE public.subscriptions SET status = 'active', "providerId" = flow_order,
      "startedAt" = next_start, "currentPeriodEnd" = next_start + interval '1 month'
      WHERE id = order_id;
  ELSIF payment_status IN (3, 4) THEN
    UPDATE public.subscriptions SET status = 'cancelled', "providerId" = flow_order WHERE id = order_id;
  ELSIF payment_status <> 1 THEN
    RAISE EXCEPTION 'Unknown payment status';
  END IF;
END $$;
REVOKE ALL ON FUNCTION public.confirm_flow_payment(uuid, text, numeric, text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_flow_payment(uuid, text, numeric, text, integer) TO service_role;

-- Proteger campos privilegiados aunque exista UPDATE sobre el perfil propio.
CREATE OR REPLACE FUNCTION public.protect_user_privileges()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF current_user IN ('anon', 'authenticated') THEN
    IF TG_OP = 'INSERT' THEN
      IF NEW.tipo_usuario = 'admin' OR NEW.membresia_activa OR NEW.rol IS NOT NULL THEN
        RAISE EXCEPTION 'Privileged profile fields';
      END IF;
    ELSIF NEW.membresia_activa IS DISTINCT FROM OLD.membresia_activa
       OR (NEW.tipo_usuario IS DISTINCT FROM OLD.tipo_usuario AND (NEW.tipo_usuario = 'admin' OR OLD.tipo_usuario = 'admin'))
       OR NEW.rol IS DISTINCT FROM OLD.rol THEN
      RAISE EXCEPTION 'Privileged profile fields';
    END IF;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS protect_user_privileges ON public.usuarios;
CREATE TRIGGER protect_user_privileges BEFORE INSERT OR UPDATE ON public.usuarios
  FOR EACH ROW EXECUTE FUNCTION public.protect_user_privileges();
COMMIT;
