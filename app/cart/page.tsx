import React from 'react';
import CartItem from '@/components/CartItem';

const item={
    id: 1,
    name: "ASUS VivoBook 15",
  price: 2_350_000,
  imageUrl: "https://res.cloudinary.com/dok1bfadc/image/upload/v1789700683/bpxeg3iktjziry9hziqq.jpg",
  quantity: 1,
}

export default function CartPage() {
    function removeItem(id: number) {
        console.log(`Removing item with id: ${id}`);
    }
  return (
    <main>
        <CartItem item={item} onRemove={removeItem} />
    </main>
  )
}
