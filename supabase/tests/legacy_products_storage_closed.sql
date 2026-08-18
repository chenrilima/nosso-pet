begin;

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('98000000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin.closed@example.test', '', now(), '{}', '{}', now(), now()),
  ('98000000-0000-4000-8000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'user.closed@example.test', '', now(), '{}', '{}', now(), now());
insert into public.profiles (id, display_name, role) values ('98000000-0000-4000-8000-000000000001', 'Admin Closed', 'admin');

set local role authenticated;
select set_config('request.jwt.claim.sub', '98000000-0000-4000-8000-000000000001', true);

do $$
declare prefix text;
begin
  begin perform 1 from public.products limit 1; raise exception 'Admin ainda seleciona products'; exception when insufficient_privilege then null; end;
  begin insert into public.products (category_id, name, slug, description) values ('20000000-0000-4000-8000-000000000001', 'Bloqueado', 'admin-bloqueado', 'legado'); raise exception 'Admin ainda escreve products'; exception when insufficient_privilege then null; end;

  foreach prefix in array array['products', 'services'] loop
    begin insert into storage.objects (bucket_id, name, owner_id) values ('site-assets', prefix || '/blocked.webp', '98000000-0000-4000-8000-000000000001'); raise exception 'Prefixo obsoleto ainda gravável: %', prefix; exception when insufficient_privilege then null; end;
  end loop;
  foreach prefix in array array['hero', 'gallery', 'categories', 'options'] loop
    insert into storage.objects (bucket_id, name, owner_id) values ('site-assets', prefix || '/98000000-0000-4000-8000-000000000001.webp', '98000000-0000-4000-8000-000000000001');
  end loop;
end $$;

select set_config('request.jwt.claim.sub', '98000000-0000-4000-8000-000000000002', true);
do $$
begin
  begin perform 1 from public.products limit 1; raise exception 'Authenticated ainda seleciona products'; exception when insufficient_privilege then null; end;
  begin insert into storage.objects (bucket_id, name, owner_id) values ('site-assets', 'hero/non-admin.webp', '98000000-0000-4000-8000-000000000002'); raise exception 'Não-admin ainda grava Storage'; exception when insufficient_privilege then null; end;
end $$;

set local role anon;
do $$ begin begin perform 1 from public.products limit 1; raise exception 'Anon ainda seleciona products'; exception when insufficient_privilege then null; end; end $$;

rollback;
