-- 1) Create projects and project_images tables with secure RLS and update trigger
-- Create helper function to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  github_url TEXT,
  live_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'update_projects_updated_at'
  ) THEN
    CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_is_published ON public.projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policies for projects
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects"
ON public.projects
FOR SELECT
TO public
USING (is_published = true);

DROP POLICY IF EXISTS "Owners can view own projects" ON public.projects;
CREATE POLICY "Owners can view own projects"
ON public.projects
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Owners can insert own projects" ON public.projects;
CREATE POLICY "Owners can insert own projects"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Owners can update own projects" ON public.projects;
CREATE POLICY "Owners can update own projects"
ON public.projects
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Owners can delete own projects" ON public.projects;
CREATE POLICY "Owners can delete own projects"
ON public.projects
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Create project_images table
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  path TEXT NOT NULL,
  alt TEXT,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_user_id ON public.project_images(user_id);
CREATE INDEX IF NOT EXISTS idx_project_images_position ON public.project_images(position);

-- Enable RLS
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- Policies for project_images
DROP POLICY IF EXISTS "Public can view images of published projects" ON public.project_images;
CREATE POLICY "Public can view images of published projects"
ON public.project_images
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_images.project_id AND p.is_published = true
  )
);

DROP POLICY IF EXISTS "Owners can view own images" ON public.project_images;
CREATE POLICY "Owners can view own images"
ON public.project_images
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Owners can insert images for own projects" ON public.project_images;
CREATE POLICY "Owners can insert images for own projects"
ON public.project_images
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_images.project_id AND p.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Owners can update own images" ON public.project_images;
CREATE POLICY "Owners can update own images"
ON public.project_images
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Owners can delete own images" ON public.project_images;
CREATE POLICY "Owners can delete own images"
ON public.project_images
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- 2) Create a public storage bucket for portfolio images with strict write rules
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the 'portfolio' bucket
DO $$
BEGIN
  -- Public read access for portfolio images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Portfolio images are publicly accessible'
  ) THEN
    CREATE POLICY "Portfolio images are publicly accessible"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'portfolio');
  END IF;

  -- Allow authenticated users to upload to their own folder: {user_id}/**
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can upload their own portfolio images'
  ) THEN
    CREATE POLICY "Users can upload their own portfolio images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'portfolio'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  -- Allow authenticated users to update their own files
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can update their own portfolio images'
  ) THEN
    CREATE POLICY "Users can update their own portfolio images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'portfolio'
      AND auth.uid()::text = (storage.foldername(name))[1]
    )
    WITH CHECK (
      bucket_id = 'portfolio'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  -- Allow authenticated users to delete their own files
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can delete their own portfolio images'
  ) THEN
    CREATE POLICY "Users can delete their own portfolio images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'portfolio'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;
