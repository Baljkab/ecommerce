"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import type { CartItemData } from "@/types/product";

type CartContextType = {
  items: CartItemData[];
  addToCart: (item: CartItemData) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalQuantity: number;
  totalPrice: number;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartStorageKey = "cart";
const cartListeners = new Set<() => void>();

function subscribeToCart(listener: () => void) {
  cartListeners.add(listener);

  return () => {
    cartListeners.delete(listener);
  };
}

function getCartSnapshot() {
  if (typeof window === "undefined") {
    return "[]";
  }

  return window.localStorage.getItem(cartStorageKey) ?? "[]";
}

function getServerCartSnapshot() {
  return "[]";
}

function saveCart(items: CartItemData[]) {
  window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  cartListeners.forEach((listener) => listener());
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = JSON.parse(
    useSyncExternalStore(
      subscribeToCart,
      getCartSnapshot,
      getServerCartSnapshot,
    ),
  ) as CartItemData[];

  function increaseQuantity(id: number) {
    saveCart(
      items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }

  function decreaseQuantity(id: number) {
    saveCart(
      items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
      ),
    );
  }

  function addToCart(newItem: CartItemData) {
    const existingItem = items.find((item) => item.id === newItem.id);

    if (!existingItem) {
      saveCart([...items, newItem]);
      return;
    }

    saveCart(
      items.map((item) =>
        item.id === newItem.id
          ? { ...item, quantity: item.quantity + newItem.quantity }
          : item,
      ),
    );
  }

  function removeFromCart(id: number) {
    saveCart(items.filter((item) => item.id !== id));
  }

  function clearCart() {
    saveCart([]);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
        totalPrice: items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart нь CartProvider дотор ашиглагдах ёстой.");
  }

  return context;
}
