-- Админ эрхтэй хэрэглэгчид products хүснэгтэд бичих (insert/update/delete)
-- боломжтой болгоно. Унших эрхийг (select) өөрчлөхгүй, зөвхөн бичих
-- үйлдлийг role = 'admin' профайлтай хэрэглэгчээр хязгаарлана.
begin;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.products enable row level security;

drop policy if exists products_insert_admin_only on public.products;
create policy products_insert_admin_only
  on public.products for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists products_update_admin_only on public.products;
create policy products_update_admin_only
  on public.products for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists products_delete_admin_only on public.products;
create policy products_delete_admin_only
  on public.products for delete
  to authenticated
  using (public.is_admin());

commit;
