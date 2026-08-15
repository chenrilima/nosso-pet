begin;

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('93000000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin.gallery@example.test', '', now(), '{}', '{}', now(), now()),
  ('93000000-0000-4000-8000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'user.gallery@example.test', '', now(), '{}', '{}', now(), now());
insert into public.profiles (id, display_name, role) values ('93000000-0000-4000-8000-000000000001', 'Admin Gallery', 'admin');

set local role authenticated;
select set_config('request.jwt.claim.sub', '93000000-0000-4000-8000-000000000001', true);
insert into public.faqs (id, question, answer, sort_order, is_published) values ('94000000-0000-4000-8000-000000000001', 'FAQ integração?', 'Resposta temporária.', 8, true);
update public.faqs set answer = 'Resposta editada.', is_published = false where id = '94000000-0000-4000-8000-000000000001';
update public.faqs set is_published = true where id = '94000000-0000-4000-8000-000000000001';
delete from public.faqs where id = '94000000-0000-4000-8000-000000000001';

insert into public.gallery_images (id, storage_path, alt_text, caption, sort_order, is_published) values ('95000000-0000-4000-8000-000000000001', 'gallery/96000000-0000-4000-8000-000000000001.webp', 'Fixture neutra', null, 8, true);
update public.gallery_images set alt_text = 'Fixture editada', is_published = false where id = '95000000-0000-4000-8000-000000000001';
update public.gallery_images set storage_path = 'gallery/97000000-0000-4000-8000-000000000001.webp', is_published = true where id = '95000000-0000-4000-8000-000000000001';
delete from public.gallery_images where id = '95000000-0000-4000-8000-000000000001';

insert into storage.objects (bucket_id, name, owner_id, metadata) values ('site-assets', 'gallery/96000000-0000-4000-8000-000000000001.webp', '93000000-0000-4000-8000-000000000001', '{"mimetype":"image/webp","size":12}');
update storage.objects set name = 'gallery/97000000-0000-4000-8000-000000000001.webp' where bucket_id = 'site-assets' and name = 'gallery/96000000-0000-4000-8000-000000000001.webp';

select set_config('request.jwt.claim.sub', '93000000-0000-4000-8000-000000000002', true);
do $$
begin
  begin insert into public.faqs (question, answer) values ('Bloqueada?', 'RLS'); raise exception 'RLS negativa falhou para faqs insert'; exception when insufficient_privilege then null; end;
  update public.faqs set answer = 'Bloqueada' where id = '50000000-0000-4000-8000-000000000001'; if found then raise exception 'RLS negativa falhou para faqs update'; end if;
  delete from public.faqs where id = '50000000-0000-4000-8000-000000000001'; if found then raise exception 'RLS negativa falhou para faqs delete'; end if;
  begin insert into public.gallery_images (storage_path, alt_text) values ('gallery/98000000-0000-4000-8000-000000000001.webp', 'Bloqueada'); raise exception 'RLS negativa falhou para gallery insert'; exception when insufficient_privilege then null; end;
  update public.gallery_images set alt_text = 'Bloqueada' where id = '60000000-0000-4000-8000-000000000001'; if found then raise exception 'RLS negativa falhou para gallery update'; end if;
  delete from public.gallery_images where id = '60000000-0000-4000-8000-000000000001'; if found then raise exception 'RLS negativa falhou para gallery delete'; end if;
  begin insert into storage.objects (bucket_id, name, owner_id) values ('site-assets', 'gallery/98000000-0000-4000-8000-000000000001.webp', '93000000-0000-4000-8000-000000000002'); raise exception 'RLS negativa falhou para storage insert'; exception when insufficient_privilege then null; end;
  update storage.objects set name = 'gallery/blocked.webp' where bucket_id = 'site-assets' and name = 'gallery/97000000-0000-4000-8000-000000000001.webp'; if found then raise exception 'RLS negativa falhou para storage update'; end if;
end $$;

rollback;
