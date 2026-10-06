export const FLY_TO_CART_EVENT = "techstore:fly-to-cart";

export type FlyToCartDetail = {
  imageUrl: string;
  fromRect: DOMRect;
};

// Бараа сагсанд нэмэгдэхэд, тухайн зургийн дэлгэц дээрх байрлалыг
// дамжуулж, "сагс руу нисэх" анимацийг эхлүүлдэг глобал event.
export function dispatchFlyToCart(detail: FlyToCartDetail) {
  window.dispatchEvent(
    new CustomEvent<FlyToCartDetail>(FLY_TO_CART_EVENT, { detail }),
  );
}
