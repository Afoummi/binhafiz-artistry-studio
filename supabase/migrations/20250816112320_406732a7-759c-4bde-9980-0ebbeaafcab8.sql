-- Tighten RLS on public.clients to prevent public reads
-- 1) Drop overly permissive public SELECT policy
DROP POLICY IF EXISTS "Enable read access for all users" ON public.clients;

-- 2) Restrict SELECT to authenticated users for their own rows only
CREATE POLICY "Authenticated users can read own clients"
ON public.clients
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 3) Tighten INSERT policy so rows are owned by the creator
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.clients;
CREATE POLICY "Authenticated users can insert own clients"
ON public.clients
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Note: We are not enabling UPDATE/DELETE; can be added later if needed.
