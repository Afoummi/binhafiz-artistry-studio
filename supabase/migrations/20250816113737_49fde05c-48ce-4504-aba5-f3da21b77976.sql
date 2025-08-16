-- Create a contact_submissions table for the contact form with safe RLS
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policies
-- Allow anyone (including anonymous) to submit a contact form
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON public.contact_submissions;
CREATE POLICY "Anyone can insert contact submissions"
ON public.contact_submissions
FOR INSERT
TO public
WITH CHECK (true);

-- Allow authenticated users to read submissions (for dashboard views)
DROP POLICY IF EXISTS "Authenticated users can read contact submissions" ON public.contact_submissions;
CREATE POLICY "Authenticated users can read contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (true);

-- We are not enabling UPDATE/DELETE from the client.
