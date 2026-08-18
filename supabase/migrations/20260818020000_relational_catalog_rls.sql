drop policy "Public reads active option groups" on public.product_option_groups;
create policy "Public reads publishable option groups" on public.product_option_groups for select to anon, authenticated using (
  is_active and exists (select 1 from public.categories where categories.id = product_option_groups.category_id and categories.is_active)
);

drop policy "Public reads active product options" on public.product_options;
create policy "Public reads publishable product options" on public.product_options for select to anon, authenticated using (
  is_active and exists (
    select 1 from public.product_option_groups
    join public.categories on categories.id = product_option_groups.category_id
    where product_option_groups.id = product_options.group_id
      and product_option_groups.is_active and categories.is_active
  )
);
