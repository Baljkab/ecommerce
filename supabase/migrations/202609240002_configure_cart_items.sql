-- Одоо байгаа public.cart_items хүснэгтэд ажиллуулна.
begin;

do $$
begin
  if exists (select 1 from public.cart_items where quantity <= 0) then
    raise exception 'cart_items хүснэгтэд quantity <= 0 мөр байна. Тоо ширхэгийг зассаны дараа дахин ажиллуулна уу.';
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.cart_items'::regclass
      and conname = 'cart_items_quantity_positive'
  ) then
    alter table public.cart_items
      add constraint cart_items_quantity_positive check (quantity > 0);
  end if;
end
$$;

alter table public.cart_items alter column user_id set default auth.uid();
create index if not exists cart_items_product_id_idx
  on public.cart_items (product_id);

alter table public.cart_items enable row level security;
revoke all on table public.cart_items from public, anon, authenticated;
grant select, insert, update, delete on table public.cart_items to authenticated;

drop policy if exists cart_items_select_own on public.cart_items;
create policy cart_items_select_own
  on public.cart_items for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists cart_items_insert_own on public.cart_items;
create policy cart_items_insert_own
  on public.cart_items for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists cart_items_update_own on public.cart_items;
create policy cart_items_update_own
  on public.cart_items for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists cart_items_delete_own on public.cart_items;
create policy cart_items_delete_own
  on public.cart_items for delete to authenticated
  using ((select auth.uid()) = user_id);

commit;
