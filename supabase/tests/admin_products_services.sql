begin;

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('90000000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin.integration@example.test', '', now(), '{}', '{}', now(), now()),
  ('90000000-0000-4000-8000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'user.integration@example.test', '', now(), '{}', '{}', now(), now());
insert into public.profiles (id, display_name, role) values ('90000000-0000-4000-8000-000000000001', 'Admin Integration', 'admin');

set local role authenticated;
select set_config('request.jwt.claim.sub', '90000000-0000-4000-8000-000000000001', true);
insert into public.products (id, category_id, name, slug, description, price, sort_order) values ('91000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'Produto integração', 'produto-integracao', 'temporário', 129.90, 9);
update public.products set name = 'Produto integração editado', is_active = false, is_featured = true where id = '91000000-0000-4000-8000-000000000001';
update public.products set image_path = 'products/91000000-0000-4000-8000-000000000001.webp' where id = '91000000-0000-4000-8000-000000000001';
update public.products set image_path = null where id = '91000000-0000-4000-8000-000000000001';
update public.products set is_active = true where id = '91000000-0000-4000-8000-000000000001';
delete from public.products where id = '91000000-0000-4000-8000-000000000001';

insert into public.services (id, name, slug, description, icon_key, pricing_type, price, is_bookable, sort_order) values ('92000000-0000-4000-8000-000000000001', 'Serviço integração', 'servico-integracao', 'temporário', 'bath', 'fixed', 50.00, true, 9);
update public.services set pricing_type = 'starting_at', price = null, price_from = 35.00, is_bookable = false, is_featured = true where id = '92000000-0000-4000-8000-000000000001';
update public.services set is_active = false, is_bookable = false where id = '92000000-0000-4000-8000-000000000001';
update public.services set is_active = true where id = '92000000-0000-4000-8000-000000000001';
delete from public.services where id = '92000000-0000-4000-8000-000000000001';

select set_config('request.jwt.claim.sub', '90000000-0000-4000-8000-000000000002', true);
do $$
begin
  begin
    insert into public.products (category_id, name, slug, description) values ('20000000-0000-4000-8000-000000000001', 'Bloqueado', 'produto-bloqueado', 'RLS');
    raise exception 'RLS negativa falhou para products insert';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.services set name = 'Bloqueado' where id = '40000000-0000-4000-8000-000000000001';
    if found then raise exception 'RLS negativa falhou para services update'; end if;
  end;
  begin
    delete from public.products where id = '30000000-0000-4000-8000-000000000001';
    if found then raise exception 'RLS negativa falhou para products delete'; end if;
  end;
  begin
    update public.products set image_path = 'products/blocked.webp' where id = '30000000-0000-4000-8000-000000000001';
    if found then raise exception 'RLS negativa falhou para products image_path update'; end if;
  end;
end $$;

rollback;
