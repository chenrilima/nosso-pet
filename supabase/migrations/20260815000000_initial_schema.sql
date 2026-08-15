create extension if not exists pgcrypto;

create type public.admin_role as enum ('admin');
create type public.pricing_type as enum ('fixed', 'starting_at', 'quote');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (btrim(display_name) <> ''),
  role public.admin_role not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.business_settings (
  id uuid primary key default gen_random_uuid(),
  singleton_key boolean not null default true unique check (singleton_key),
  name text not null check (btrim(name) <> ''),
  short_name text not null check (btrim(short_name) <> ''),
  phone text not null,
  phone_raw text not null check (phone_raw ~ '^[0-9]+$'),
  whatsapp text not null,
  whatsapp_raw text not null check (whatsapp_raw ~ '^[0-9]+$'),
  instagram_handle text not null,
  instagram_url text not null,
  address_line text not null,
  district text not null,
  city text not null,
  state text not null check (char_length(state) = 2),
  postal_code text not null,
  maps_url text not null,
  maps_embed_url text not null,
  hours jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (btrim(name) <> ''),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  sort_order integer not null default 0 check (sort_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null check (btrim(name) <> ''),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null,
  price numeric(12,2) check (price is null or price >= 0),
  image_path text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null check (btrim(name) <> ''),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null,
  icon_key text not null check (icon_key ~ '^[a-z][a-z0-9_]*$'),
  image_path text,
  pricing_type public.pricing_type not null default 'quote',
  price numeric(12,2) check (price is null or price >= 0),
  price_from numeric(12,2) check (price_from is null or price_from >= 0),
  duration_minutes integer check (duration_minutes is null or duration_minutes >= 0),
  is_active boolean not null default true,
  is_bookable boolean not null default true,
  is_featured boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_pricing_consistent check (
    (pricing_type = 'fixed' and price is not null and price_from is null) or
    (pricing_type = 'starting_at' and price is null and price_from is not null) or
    (pricing_type = 'quote' and price is null and price_from is null)
  )
);

create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique check (storage_path ~ '^gallery/[A-Za-z0-9][A-Za-z0-9._/-]*$'),
  alt_text text not null check (btrim(alt_text) <> ''),
  caption text,
  sort_order integer not null default 0 check (sort_order >= 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null check (btrim(question) <> ''),
  answer text not null check (btrim(answer) <> ''),
  sort_order integer not null default 0 check (sort_order >= 0),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categories_public_order_idx on public.categories (sort_order, name) where is_active;
create index products_category_order_idx on public.products (category_id, sort_order, name) where is_active;
create index services_public_order_idx on public.services (sort_order, name) where is_active;
create index services_bookable_order_idx on public.services (sort_order, name) where is_active and is_bookable;
create index gallery_published_order_idx on public.gallery_images (sort_order) where is_published;
create index faqs_published_order_idx on public.faqs (sort_order) where is_published;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger business_settings_set_updated_at before update on public.business_settings for each row execute function public.set_updated_at();
create trigger categories_set_updated_at before update on public.categories for each row execute function public.set_updated_at();
create trigger products_set_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger services_set_updated_at before update on public.services for each row execute function public.set_updated_at();
create trigger gallery_images_set_updated_at before update on public.gallery_images for each row execute function public.set_updated_at();
create trigger faqs_set_updated_at before update on public.faqs for each row execute function public.set_updated_at();

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.business_settings enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.services enable row level security;
alter table public.gallery_images enable row level security;
alter table public.faqs enable row level security;

create policy "Admins manage profiles" on public.profiles for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Public reads business settings" on public.business_settings for select to anon, authenticated using (true);
create policy "Admins manage business settings" on public.business_settings for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Public reads active categories" on public.categories for select to anon, authenticated using (is_active);
create policy "Admins manage categories" on public.categories for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Public reads active products" on public.products for select to anon, authenticated using (is_active);
create policy "Admins manage products" on public.products for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Public reads active services" on public.services for select to anon, authenticated using (is_active);
create policy "Admins manage services" on public.services for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Public reads published gallery" on public.gallery_images for select to anon, authenticated using (is_published);
create policy "Admins manage gallery" on public.gallery_images for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Public reads published FAQs" on public.faqs for select to anon, authenticated using (is_published);
create policy "Admins manage FAQs" on public.faqs for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-assets', 'site-assets', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins upload site assets" on storage.objects for insert to authenticated with check (
  bucket_id = 'site-assets' and (storage.foldername(name))[1] in ('products', 'services', 'gallery') and (select public.is_admin())
);
create policy "Admins update site assets" on storage.objects for update to authenticated using (
  bucket_id = 'site-assets' and (select public.is_admin())
) with check (
  bucket_id = 'site-assets' and (storage.foldername(name))[1] in ('products', 'services', 'gallery') and (select public.is_admin())
);
create policy "Admins delete site assets" on storage.objects for delete to authenticated using (
  bucket_id = 'site-assets' and (select public.is_admin())
);
