-- Preserve legacy rows and the categories FK, but remove all runtime API access.
drop policy if exists "Public reads active products" on public.products;
drop policy if exists "Admins manage products" on public.products;
revoke all privileges on table public.products from anon, authenticated;

drop policy if exists "Admins upload site assets" on storage.objects;
create policy "Admins upload site assets" on storage.objects for insert to authenticated with check (
  bucket_id = 'site-assets'
  and (storage.foldername(name))[1] in ('hero', 'gallery', 'categories', 'options')
  and (select public.is_admin())
);

drop policy if exists "Admins update site assets" on storage.objects;
create policy "Admins update site assets" on storage.objects for update to authenticated using (
  bucket_id = 'site-assets'
  and (storage.foldername(name))[1] in ('hero', 'gallery', 'categories', 'options')
  and (select public.is_admin())
) with check (
  bucket_id = 'site-assets'
  and (storage.foldername(name))[1] in ('hero', 'gallery', 'categories', 'options')
  and (select public.is_admin())
);

drop policy if exists "Admins delete site assets" on storage.objects;
create policy "Admins delete site assets" on storage.objects for delete to authenticated using (
  bucket_id = 'site-assets'
  and (storage.foldername(name))[1] in ('hero', 'gallery', 'categories', 'options')
  and (select public.is_admin())
);
