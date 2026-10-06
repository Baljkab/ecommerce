begin;

create or replace function public.create_order_with_stock(
  p_address jsonb,
  p_items jsonb
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_order_id public.orders.id%type;
  v_product public.products%rowtype;
  v_item record;
  v_total numeric := 0;
  v_saved_items jsonb := '[]'::jsonb;
begin
  if v_user_id is null then
    raise exception 'Захиалга өгөхийн тулд нэвтэрнэ үү.';
  end if;

  if p_items is null
     or jsonb_typeof(p_items) <> 'array' then
    raise exception 'Захиалгын барааны мэдээлэл буруу байна.';
  end if;

  if jsonb_array_length(p_items) = 0 then
    raise exception 'Сагс хоосон байна.';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(p_items)
      as item(product_id bigint, quantity integer)
    where item.product_id is null
       or item.quantity is null
       or item.quantity <= 0
  ) then
    raise exception 'Барааны тоо ширхэг буруу байна.';
  end if;

  if p_address is null or exists (
    select 1
    from unnest(array[
      'province',
      'district',
      'khoroo',
      'addressDetail',
      'phoneNumber',
      'email'
    ]) as required_field(name)
    where nullif(btrim(p_address ->> name), '') is null
  ) then
    raise exception 'Хүргэлтийн мэдээллээ бүрэн бөглөнө үү.';
  end if;

  -- Ижил барааны тоог нэгтгэнэ.
  -- ID дарааллаар шинэчлэх нь зэрэг захиалгын түгжрэлийг багасгана.
  for v_item in
    select
      item.product_id,
      sum(item.quantity)::integer as quantity
    from jsonb_to_recordset(p_items)
      as item(product_id bigint, quantity integer)
    group by item.product_id
    order by item.product_id
  loop
    -- Үлдэгдэл шалгах, хасах нь нэг үйлдэл.
    -- Зэрэг захиалга орсон ч үлдэгдлийг сөрөг болгохгүй.
    update public.products
    set stock = stock - v_item.quantity
    where id = v_item.product_id
      and stock >= v_item.quantity
    returning * into v_product;

    if not found then
      raise exception
        'Бараа олдсонгүй эсвэл үлдэгдэл хүрэлцэхгүй байна. Барааны ID: %',
        v_item.product_id;
    end if;

    if v_product.price is null or v_product.price < 0 then
      raise exception 'Барааны үнэ буруу байна.';
    end if;

    v_total := v_total + v_product.price * v_item.quantity;

    v_saved_items := v_saved_items || jsonb_build_array(
      jsonb_build_object(
        'product_id', v_product.id,
        'product_name', v_product.name,
        'product_image_url', v_product.image_url,
        'unit_price', v_product.price,
        'quantity', v_item.quantity
      )
    );
  end loop;

  insert into public.orders (
    user_id,
    total_price,
    province,
    district,
    khoroo,
    address_detail,
    phone_number,
    email
  )
  values (
    v_user_id,
    v_total,
    p_address ->> 'province',
    p_address ->> 'district',
    p_address ->> 'khoroo',
    p_address ->> 'addressDetail',
    p_address ->> 'phoneNumber',
    p_address ->> 'email'
  )
  returning id into v_order_id;

  insert into public.order_items (
    order_id,
    product_id,
    product_name,
    product_image_url,
    unit_price,
    quantity
  )
  select
    v_order_id,
    item.product_id,
    item.product_name,
    item.product_image_url,
    item.unit_price,
    item.quantity
  from jsonb_to_recordset(v_saved_items) as item(
    product_id bigint,
    product_name text,
    product_image_url text,
    unit_price numeric,
    quantity integer
  );

  return v_order_id::text;
end;
$$;

-- Функцийг зөвхөн нэвтэрсэн хэрэглэгч дуудна.
revoke all on function public.create_order_with_stock(jsonb, jsonb)
  from public, anon;

grant execute on function public.create_order_with_stock(jsonb, jsonb)
  to authenticated;

-- Үлдэгдэл хасах функцийг алгасан шууд захиалга нэмэхийг хориглоно.
revoke insert on public.orders, public.order_items
  from anon, authenticated;

commit;