"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { FLY_TO_CART_EVENT, type FlyToCartDetail } from "@/lib/flyToCart";

type FlyingItem = {
  id: string;
  imageUrl: string;
  fromRect: DOMRect;
  toRect: DOMRect;
};

// Root layout-д нэг л удаа mount хийгдэж, бараа сагсанд нэмэгдэх бүрт
// зургийг эх байрлалаас Сагсны icon руу нисгэж харуулдаг давхарга.
export default function FlyToCartLayer() {
  const [items, setItems] = useState<FlyingItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // SSR үед document байхгүй тул зөвхөн client дээр mount болсны дараа
    // createPortal ашиглана.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleFly(event: Event) {
      const { imageUrl, fromRect } = (event as CustomEvent<FlyToCartDetail>)
        .detail;
      const target = document.getElementById("cart-icon-target");
      if (!target) return;

      const toRect = target.getBoundingClientRect();
      setItems((current) => [
        ...current,
        { id: crypto.randomUUID(), imageUrl, fromRect, toRect },
      ]);
    }

    window.addEventListener(FLY_TO_CART_EVENT, handleFly);
    return () => window.removeEventListener(FLY_TO_CART_EVENT, handleFly);
  }, []);

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  if (!mounted) return null;

  return createPortal(
    <>
      {items.map((item) => (
        <motion.img
          key={item.id}
          src={item.imageUrl}
          alt=""
          aria-hidden="true"
          className="pointer-events-none fixed z-[999] rounded-xl object-cover shadow-lg"
          initial={{
            top: item.fromRect.top,
            left: item.fromRect.left,
            width: item.fromRect.width,
            height: item.fromRect.height,
            opacity: 1,
          }}
          animate={{
            top: item.toRect.top + item.toRect.height / 2 - 8,
            left: item.toRect.left + item.toRect.width / 2 - 8,
            width: 16,
            height: 16,
            opacity: 0.4,
          }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          onAnimationComplete={() => removeItem(item.id)}
        />
      ))}
    </>,
    document.body,
  );
}
