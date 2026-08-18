begin;

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) values
  ('93000000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'catalog-admin@example.test', '', now(), '{}', '{}', now(), now()),
  ('93000000-0000-4000-8000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'catalog-user@example.test', '', now(), '{}', '{}', now(), now());
insert into public.profiles (id, display_name, role) values ('93000000-0000-4000-8000-000000000001', 'Catalog Admin', 'admin');

set local role authenticated;
select set_config('request.jwt.claim.sub', '93000000-0000-4000-8000-000000000001', true);
insert into public.categories (id, name, slug, description, is_active) values
  ('93100000-0000-4000-8000-000000000001', 'Categoria ativa', 'rls-categoria-ativa', '', true),
  ('93100000-0000-4000-8000-000000000002', 'Categoria inativa', 'rls-categoria-inativa', '', false);
insert into public.product_option_groups (id, category_id, name, is_active) values
  ('93200000-0000-4000-8000-000000000001', '93100000-0000-4000-8000-000000000001', 'Grupo ativo', true),
  ('93200000-0000-4000-8000-000000000002', '93100000-0000-4000-8000-000000000002', 'Grupo com pai inativo', true),
  ('93200000-0000-4000-8000-000000000003', '93100000-0000-4000-8000-000000000001', 'Grupo inativo', false);
insert into public.product_options (id, group_id, name, is_active) values
  ('93300000-0000-4000-8000-000000000001', '93200000-0000-4000-8000-000000000001', 'Opção publicável', true),
  ('93300000-0000-4000-8000-000000000002', '93200000-0000-4000-8000-000000000002', 'Opção com categoria inativa', true),
  ('93300000-0000-4000-8000-000000000003', '93200000-0000-4000-8000-000000000003', 'Opção com grupo inativo', true),
  ('93300000-0000-4000-8000-000000000004', '93200000-0000-4000-8000-000000000001', 'Opção inativa', false);

do $$ begin
  if (select count(*) from public.product_option_groups where id::text like '93200000-%') <> 3 then raise exception 'admin deve ler todos os grupos'; end if;
  if (select count(*) from public.product_options where id::text like '93300000-%') <> 4 then raise exception 'admin deve ler todas as opções'; end if;
end $$;

select set_config('request.jwt.claim.sub', '93000000-0000-4000-8000-000000000002', true);
do $$ begin
  if (select count(*) from public.product_option_groups where id::text like '93200000-%') <> 1 then raise exception 'usuário deve ler somente grupo publicável'; end if;
  if (select count(*) from public.product_options where id::text like '93300000-%') <> 1 then raise exception 'usuário deve ler somente opção publicável'; end if;
  update public.product_option_groups set name = 'Bloqueado' where id = '93200000-0000-4000-8000-000000000001';
  if found then raise exception 'usuário comum não pode atualizar grupo'; end if;
end $$;

set local role anon;
do $$ begin
  if (select count(*) from public.product_option_groups where id::text like '93200000-%') <> 1 then raise exception 'anon deve ler somente grupo publicável'; end if;
  if (select count(*) from public.product_options where id::text like '93300000-%') <> 1 then raise exception 'anon deve ler somente opção publicável'; end if;
end $$;

rollback;
