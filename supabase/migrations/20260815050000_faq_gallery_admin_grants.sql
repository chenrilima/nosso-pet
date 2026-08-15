grant insert, update, delete on table public.faqs to authenticated;
grant insert, update, delete on table public.gallery_images to authenticated;

-- The Storage remove API selects matching rows before deleting them.
create policy "Admins inspect site assets for management"
on storage.objects for select to authenticated
using (bucket_id = 'site-assets' and (select public.is_admin()));
