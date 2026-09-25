"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CartItemData } from "@/types/product";
import { getSupabaseClient } from "@/lib/supabase";
import {
  changeDatabaseQuantity,
  getCartErrorMessage,
  guestCartStorageKey,
  readDatabaseCart,
  readGuestCart,
  removeDatabaseCartItems,
  saveGuestCart,
} from "@/lib/cart";

type CartState = {
  items: CartItemData[];
  isLoading: boolean;
  isSaving: boolean;
  isAuthenticated: boolean;
  error: string | null;
};

type CartContextType = CartState & {
  addToCart: (item: CartItemData) => Promise<boolean>;
  removeFromCart: (id: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  increaseQuantity: (id: number) => Promise<boolean>;
  decreaseQuantity: (id: number) => Promise<boolean>;
  reloadCart: () => Promise<void>;
  totalQuantity: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({
    items: [],
    isLoading: true,
    isSaving: false,
    isAuthenticated: false,
    error: null,
  });
  const clientRef = useRef<SupabaseClient | null>(null);
  const ownerRef = useRef<string | null | undefined>(undefined);
  const versionRef = useRef(Symbol("cart-session"));
  const busyRef = useRef(false);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let unsubscribe = () => {};

    function changeOwner(userId: string | null) {
      if (!active || ownerRef.current === userId) return;
      ownerRef.current = userId;
      const version = Symbol("cart-session");
      versionRef.current = version;
      busyRef.current = true;
      setState({
        items: [],
        isLoading: true,
        isSaving: false,
        isAuthenticated: userId !== null,
        error: null,
      });

      // Database requests must run outside the Supabase auth callback's lock.
      clearTimeout(timer);
      timer = setTimeout(async () => {
        try {
          const client = clientRef.current;
          if (!client) throw new Error("Холболт үүсээгүй байна.");
          const items = userId
            ? await readDatabaseCart(client, userId)
            : readGuestCart();
          if (active && versionRef.current === version) {
            setState((current) => ({ ...current, items, isLoading: false }));
          }
        } catch (error) {
          if (active && versionRef.current === version) {
            setState((current) => ({
              ...current,
              isLoading: false,
              error: getCartErrorMessage(error),
            }));
          }
        } finally {
          if (active && versionRef.current === version) busyRef.current = false;
        }
      }, 0);
    }

    function handleGuestStorage(event: StorageEvent) {
      if (
        ownerRef.current !== null ||
        (event.key !== null && event.key !== guestCartStorageKey)
      )
        return;
      try {
        const items = readGuestCart();
        setState((current) => ({ ...current, items, error: null }));
      } catch (error) {
        setState((current) => ({
          ...current,
          error: getCartErrorMessage(error),
        }));
      }
    }

    async function initialize() {
      try {
        const client = getSupabaseClient();
        clientRef.current = client;
        const {
          data: { subscription },
        } = client.auth.onAuthStateChange((_event, session) =>
          changeOwner(session?.user.id ?? null),
        );
        unsubscribe = () => subscription.unsubscribe();
        const { data, error } = await client.auth.getSession();
        if (!active) return;
        if (error) throw error;
        if (ownerRef.current === undefined)
          changeOwner(data.session?.user.id ?? null);
      } catch (error) {
        if (active && ownerRef.current === undefined) {
          setState((current) => ({
            ...current,
            isLoading: false,
            error: getCartErrorMessage(error),
          }));
        }
      }
    }

    void initialize();
    window.addEventListener("storage", handleGuestStorage);
    return () => {
      active = false;
      clearTimeout(timer);
      unsubscribe();
      window.removeEventListener("storage", handleGuestStorage);
      ownerRef.current = undefined;
      versionRef.current = Symbol("cart-session");
      busyRef.current = false;
    };
  }, []);

  async function reloadCart() {
    const userId = ownerRef.current;
    const client = clientRef.current;
    if (busyRef.current) return;
    if (userId === undefined || !client) {
      window.location.reload();
      return;
    }
    const version = versionRef.current;
    busyRef.current = true;
    setState((current) => ({ ...current, isLoading: true, error: null }));
    try {
      const items = userId
        ? await readDatabaseCart(client, userId)
        : readGuestCart();
      if (versionRef.current === version)
        setState((current) => ({ ...current, items }));
    } catch (error) {
      if (versionRef.current === version) {
        setState((current) => ({
          ...current,
          error: getCartErrorMessage(error),
        }));
      }
    } finally {
      if (versionRef.current === version) {
        busyRef.current = false;
        setState((current) => ({ ...current, isLoading: false }));
      }
    }
  }

  async function mutateCart(
    remote: (client: SupabaseClient, userId: string) => Promise<void>,
    local: (items: CartItemData[]) => CartItemData[],
  ): Promise<boolean> {
    const userId = ownerRef.current;
    const client = clientRef.current;
    if (userId === undefined || !client || busyRef.current) return false;
    const version = versionRef.current;
    let saved = false;
    busyRef.current = true;
    setState((current) => ({ ...current, isSaving: true, error: null }));

    try {
      let items: CartItemData[];
      if (userId) {
        await remote(client, userId);
        saved = true;
        items = await readDatabaseCart(client, userId);
      } else {
        items = local(readGuestCart());
        saveGuestCart(items);
        saved = true;
      }
      if (versionRef.current !== version) return false;
      setState((current) => ({ ...current, items }));
      return true;
    } catch (error) {
      if (versionRef.current !== version) return false;
      setState((current) => ({
        ...current,
        error: saved
          ? "Өөрчлөлт хадгалагдсан боловч сагсыг дахин уншиж чадсангүй. Дахин ачаална уу."
          : getCartErrorMessage(error),
      }));
      return saved;
    } finally {
      if (versionRef.current === version) {
        busyRef.current = false;
        setState((current) => ({ ...current, isSaving: false }));
      }
    }
  }

  function addToCart(newItem: CartItemData) {
    if (ownerRef.current === null) {
      setState((current) => ({
        ...current,
        error: "Сагсанд бараа нэмэхийн тулд эхлээд нэвтэрч орно уу.",
      }));
      return Promise.resolve(false);
    }
    return mutateCart(
      (client, userId) =>
        changeDatabaseQuantity(
          client,
          userId,
          newItem.id,
          newItem.quantity,
          true,
        ),
      (items) =>
        items.some((item) => item.id === newItem.id)
          ? items.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item,
            )
          : [...items, { ...newItem }],
    );
  }

  function changeQuantity(id: number, delta: number) {
  const current = state.items.find((item) => item.id === id);
  if (delta > 0 && current && current.quantity >= current.stock) {
    setState((s) => ({
      ...s,
      error: "Үлдэгдэл хүрэлцэхгүй байна.",
    }));
    return Promise.resolve(false);
  }
  return mutateCart(
    (client, userId) => changeDatabaseQuantity(client, userId, id, delta),
    (items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(item.stock, item.quantity + delta),
              ),
            }
          : item,
      ),
  );
}

  function removeFromCart(id: number) {
    return mutateCart(
      (client, userId) => removeDatabaseCartItems(client, userId, id),
      (items) => items.filter((item) => item.id !== id),
    );
  }

  function clearCart() {
    return mutateCart(
      (client, userId) => removeDatabaseCartItems(client, userId),
      () => [],
    );
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity: (id) => changeQuantity(id, 1),
        decreaseQuantity: (id) => changeQuantity(id, -1),
        reloadCart,
        totalQuantity: state.items.reduce(
          (total, item) => total + item.quantity,
          0,
        ),
        totalPrice: state.items.reduce(
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
  if (!context)
    throw new Error("useCart нь CartProvider дотор ашиглагдах ёстой.");
  return context;
}
