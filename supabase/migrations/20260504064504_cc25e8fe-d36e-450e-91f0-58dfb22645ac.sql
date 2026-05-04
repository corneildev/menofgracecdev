DROP POLICY IF EXISTS "Product videos public read" ON storage.objects;

CREATE POLICY "Admins list product videos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'product-videos' AND has_role(auth.uid(), 'admin'::app_role));
