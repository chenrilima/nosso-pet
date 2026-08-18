alter table public.categories
  add column description text not null default '',
  add column image_path text check (image_path is null or image_path ~ '^categories/[0-9a-fA-F-]{36}\.(webp|png)$');

create table public.product_option_groups (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null check (btrim(name) <> ''),
  is_required boolean not null default true,
  is_active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, name)
);

create table public.product_options (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.product_option_groups(id) on delete cascade,
  name text not null check (btrim(name) <> ''),
  image_path text check (image_path is null or image_path ~ '^options/[0-9a-fA-F-]{36}\.(webp|png)$'),
  is_active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (group_id, name)
);

create index product_option_groups_public_order_idx on public.product_option_groups (category_id, sort_order, name) where is_active;
create index product_options_public_order_idx on public.product_options (group_id, sort_order, name) where is_active;

create trigger product_option_groups_set_updated_at before update on public.product_option_groups for each row execute function public.set_updated_at();
create trigger product_options_set_updated_at before update on public.product_options for each row execute function public.set_updated_at();

alter table public.product_option_groups enable row level security;
alter table public.product_options enable row level security;

create policy "Public reads active option groups" on public.product_option_groups for select to anon, authenticated using (is_active);
create policy "Admins manage option groups" on public.product_option_groups for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Public reads active product options" on public.product_options for select to anon, authenticated using (is_active);
create policy "Admins manage product options" on public.product_options for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

grant select on table public.product_option_groups, public.product_options to anon, authenticated;
grant insert, update, delete on table public.product_option_groups, public.product_options to authenticated;

drop policy "Admins upload site assets" on storage.objects;
create policy "Admins upload site assets" on storage.objects for insert to authenticated with check (
  bucket_id = 'site-assets'
  and (storage.foldername(name))[1] in ('products', 'services', 'gallery', 'hero', 'categories', 'options')
  and (select public.is_admin())
);
drop policy "Admins update site assets" on storage.objects;
create policy "Admins update site assets" on storage.objects for update to authenticated using (
  bucket_id = 'site-assets' and (select public.is_admin())
) with check (
  bucket_id = 'site-assets'
  and (storage.foldername(name))[1] in ('products', 'services', 'gallery', 'hero', 'categories', 'options')
  and (select public.is_admin())
);

update public.categories set description = case slug
  when 'racoes' then 'Encontre opções adequadas ao perfil e à rotina do seu pet.'
  when 'petiscos' then 'Recompensas e agrados para diferentes pets e preferências.'
  when 'higiene' then 'Cuidados para limpeza, conforto e bem-estar no dia a dia.'
  when 'brinquedos' then 'Diversão e estímulo escolhidos conforme o perfil do pet.'
  when 'acessorios' then 'Itens úteis para passeio, alimentação e rotina.'
  else 'Conte para nossa equipe o que você procura.' end;

do $$
declare
  category_record record;
  group_id uuid;
  group_record record;
  option_name text;
begin
  for category_record in select id, slug from public.categories loop
    for group_record in select * from (values
      ('racoes','Pet',0,array['Cães','Gatos']), ('racoes','Marca',1,array['Premier','Golden','GranPlus','Fórmula Natural','Royal Canin','Não sei']), ('racoes','Fase',2,array['Filhote','Adulto','Sênior','Castrado','Não sei']), ('racoes','Tamanho desejado',3,array['Pequeno','Médio','Grande','Não sei']),
      ('petiscos','Pet',0,array['Cães','Gatos']), ('petiscos','Tipo',1,array['Biscoito','Natural','Dental','Sachê','Não sei']), ('petiscos','Porte',2,array['Pequeno','Médio','Grande','Não se aplica']),
      ('higiene','Pet',0,array['Cães','Gatos']), ('higiene','Tipo',1,array['Shampoo','Condicionador','Tapete higiênico','Areia','Outro']), ('higiene','Preferência',2,array['Uso diário','Pele sensível','Controle de odores','Não sei']),
      ('brinquedos','Pet',0,array['Cães','Gatos']), ('brinquedos','Tipo',1,array['Bola','Mordedor','Pelúcia','Interativo']), ('brinquedos','Porte',2,array['Pequeno','Médio','Grande']),
      ('acessorios','Pet',0,array['Cães','Gatos']), ('acessorios','Tipo',1,array['Coleira','Guia','Peitoral','Comedouro','Cama','Outro']), ('acessorios','Porte',2,array['Pequeno','Médio','Grande','Não sei'])
    ) as seed(category_slug, group_name, group_order, options)
    where seed.category_slug = category_record.slug loop
      insert into public.product_option_groups (category_id, name, sort_order) values (category_record.id, group_record.group_name, group_record.group_order) returning id into group_id;
      for option_name in select unnest(group_record.options) loop
        insert into public.product_options (group_id, name, sort_order)
        values (group_id, option_name, array_position(group_record.options, option_name) - 1);
      end loop;
    end loop;
  end loop;
end $$;
