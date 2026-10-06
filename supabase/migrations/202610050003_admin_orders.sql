-- Existing orders/order_items tables and public.is_admin() are required.
-- Keep the existing order/payment status untouched; delivery has its own status.
begin;

alter table public.orders
  add column if not exists delivery_status text not null default 'pending';

alter table public.orders add constraint orders_delivery_status_check
  check (delivery_status in ('pending', 'shipping', 'delivered'));

create index if not exists orders_delivery_status_created_at_idx
  on public.orders (delivery_status, created_at desc, id desc);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
grant select on public.orders, public.order_items to authenticated;

create policy orders_select_admin on public.orders
  for select to authenticated using (public.is_admin());
create policy order_items_select_admin on public.order_items
  for select to authenticated using (public.is_admin());

-- Restrict even older broad SELECT policies to the owner or an admin.
create policy orders_select_owner_or_admin_boundary on public.orders
  as restrictive for select to public
  using (user_id = auth.uid() or public.is_admin());
create policy order_items_select_owner_or_admin_boundary on public.order_items
  as restrictive for select to public
  using (exists (
    select 1 from public.orders o
    where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
  ));

-- A user's existing UPDATE/INSERT policies must not allow delivery changes.
create or replace function public.protect_order_delivery_status()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if TG_OP = 'INSERT' then
    if new.delivery_status <> 'pending' and not public.is_admin() then
      raise exception 'Хүргэлтийн төлөв өөрчлөх админ эрх шаардлагатай.' using errcode = '42501';
    end if;
  elsif new.delivery_status is distinct from old.delivery_status and not public.is_admin() then
    raise exception 'Хүргэлтийн төлөв өөрчлөх админ эрх шаардлагатай.' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger protect_order_delivery_status
  before insert or update on public.orders
  for each row execute function public.protect_order_delivery_status();

-- Only this narrow operation needs elevated access; all inputs are checked.
create or replace function public.admin_update_delivery_status(
  p_order_id text, p_previous_status text, p_next_status text
) returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then
    raise exception 'Админ эрх шаардлагатай.' using errcode = '42501';
  end if;
  if p_next_status is null or p_next_status not in ('pending', 'shipping', 'delivered') then
    raise exception 'Хүргэлтийн төлөв буруу байна.' using errcode = '22023';
  end if;
  update public.orders set delivery_status = p_next_status
    where id::text = p_order_id and delivery_status = p_previous_status;
  if not found then
    raise exception 'Захиалга өөрчлөгдсөн эсвэл олдсонгүй.' using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.protect_order_delivery_status() from public;
revoke all on function public.admin_update_delivery_status(text, text, text) from public;
grant execute on function public.admin_update_delivery_status(text, text, text) to authenticated;

commit;
