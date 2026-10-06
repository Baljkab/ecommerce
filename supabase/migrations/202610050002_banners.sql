-- Нүүр хуудасны hero carousel-д зориулсан, админ эрхтэй хэрэглэгчийн
-- удирддаг баннер хүснэгт. is_admin() функцийг
-- 202610050001_admin_product_management.sql-д аль хэдийн үүсгэсэн.
begin;

create table if not exists public.banners (
  id bigint generated always as identity primary key,
  title text not null default '',
  subtitle text not null default '',
  image_url text not null,
  href text not null default '/products',
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

alter table public.banners enable row level security;

drop policy if exists banners_select_all on public.banners;
create policy banners_select_all
  on public.banners for select
  to public
  using (true);

drop policy if exists banners_insert_admin_only on public.banners;
create policy banners_insert_admin_only
  on public.banners for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists banners_update_admin_only on public.banners;
create policy banners_update_admin_only
  on public.banners for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists banners_delete_admin_only on public.banners;
create policy banners_delete_admin_only
  on public.banners for delete
  to authenticated
  using (public.is_admin());

commit;
