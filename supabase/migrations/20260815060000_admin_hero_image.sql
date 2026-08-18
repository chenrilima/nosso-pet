alter table public.business_settings
add column hero_image_path text null
check (hero_image_path is null or hero_image_path ~ '^hero/[0-9a-fA-F-]{36}\.(webp|png)$');

drop policy "Admins upload site assets" on storage.objects;
create policy "Admins upload site assets" on storage.objects for insert to authenticated with check (
  bucket_id = 'site-assets'
  and (storage.foldername(name))[1] in ('products', 'services', 'gallery', 'hero')
  and (select public.is_admin())
);

drop policy "Admins update site assets" on storage.objects;
create policy "Admins update site assets" on storage.objects for update to authenticated using (
  bucket_id = 'site-assets' and (select public.is_admin())
) with check (
  bucket_id = 'site-assets'
  and (storage.foldername(name))[1] in ('products', 'services', 'gallery', 'hero')
  and (select public.is_admin())
);
