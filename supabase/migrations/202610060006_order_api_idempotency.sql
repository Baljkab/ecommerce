-- Requires 202610060004_order_stock_.sql.
begin;

create table public.order_requests (
  user_id uuid not null references auth.users(id) on delete cascade,
  request_id uuid not null,
  payload jsonb not null,
  order_id text,
  created_at timestamptz not null default now(),
  primary key (user_id, request_id)
);
alter table public.order_requests enable row level security;
revoke all on public.order_requests from public, anon, authenticated;

create or replace function public.submit_order_once(
  p_request_id uuid, p_address jsonb, p_items jsonb
) returns text language plpgsql security definer set search_path = '' as $$
declare
  v_user_id uuid := auth.uid();
  v_payload jsonb := jsonb_build_object('address', p_address, 'items', p_items);
  v_request public.order_requests%rowtype;
  v_order_id text;
begin
  if v_user_id is null then
    raise exception 'Захиалга өгөхийн тулд нэвтэрнэ үү.';
  end if;
  if p_request_id is null then
    raise exception 'Хүсэлтийн дугаар шаардлагатай.';
  end if;
  insert into public.order_requests (user_id, request_id, payload)
    values (v_user_id, p_request_id, v_payload)
    on conflict (user_id, request_id) do nothing;

  select * into v_request from public.order_requests
    where user_id = v_user_id and request_id = p_request_id for update;
  if v_request.payload is distinct from v_payload then
    raise exception 'Ижил хүсэлтийн дугаартай захиалгын мэдээлэл зөрж байна.';
  end if;
  if v_request.order_id is not null then
    return v_request.order_id;
  end if;
  v_order_id := public.create_order_with_stock(p_address, p_items);
  update public.order_requests set order_id = v_order_id
    where user_id = v_user_id and request_id = p_request_id;
  return v_order_id;
end;
$$;

revoke all on function public.submit_order_once(uuid, jsonb, jsonb) from public, anon;
grant execute on function public.submit_order_once(uuid, jsonb, jsonb) to authenticated;
-- Clients must use the idempotent wrapper, including direct Supabase callers.
revoke execute on function public.create_order_with_stock(jsonb, jsonb) from public, anon, authenticated;
commit;
