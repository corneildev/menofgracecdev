-- Create corporate_inquiries table for B2B proposal requests
CREATE TABLE public.corporate_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT,
  email TEXT NOT NULL,
  country TEXT,
  principals_range TEXT,
  timeline TEXT,
  context TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.corporate_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone (anon or authenticated) can submit a proposal request
CREATE POLICY "Anyone can submit corporate inquiries"
ON public.corporate_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(full_name) BETWEEN 1 AND 200
  AND length(company) BETWEEN 1 AND 200
  AND length(email) BETWEEN 3 AND 255
  AND (role IS NULL OR length(role) <= 200)
  AND (country IS NULL OR length(country) <= 100)
  AND (principals_range IS NULL OR length(principals_range) <= 50)
  AND (timeline IS NULL OR length(timeline) <= 50)
  AND (context IS NULL OR length(context) <= 4000)
);

-- Only admins can read / update / delete
CREATE POLICY "Admins view corporate inquiries"
ON public.corporate_inquiries
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update corporate inquiries"
ON public.corporate_inquiries
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete corporate inquiries"
ON public.corporate_inquiries
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- updated_at trigger
CREATE TRIGGER corporate_inquiries_touch_updated_at
BEFORE UPDATE ON public.corporate_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();