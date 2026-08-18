alter table public.business_settings
  add column hero_position_x smallint not null default 50 check (hero_position_x between 0 and 100),
  add column hero_position_y smallint not null default 50 check (hero_position_y between 0 and 100);

alter table public.products
  add column image_position_x smallint not null default 50 check (image_position_x between 0 and 100),
  add column image_position_y smallint not null default 50 check (image_position_y between 0 and 100);

alter table public.gallery_images
  add column position_x smallint not null default 50 check (position_x between 0 and 100),
  add column position_y smallint not null default 50 check (position_y between 0 and 100);
