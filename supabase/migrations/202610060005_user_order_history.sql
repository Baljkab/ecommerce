-- Run after 202610050003_admin_orders.sql, which provides the restrictive
-- owner-or-admin SELECT boundaries for both tables.
begin;

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
grant select on public.orders, public.order_items to authenticated;

drop policy if exists orders_select_own_history on public.orders;
create policy orders_select_own_history on public.orders
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists order_items_select_own_history on public.order_items;
create policy order_items_select_own_history on public.order_items
  for select to authenticated using (exists (
    select 1 from public.orders o
    where o.id = order_items.order_id and o.user_id = (select auth.uid())
  ));

create index if not exists orders_user_created_at_idx
  on public.orders (user_id, created_at desc, id desc);

commit;
