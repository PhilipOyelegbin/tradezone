import { create } from "zustand";
import type { CartItem } from "../utils/interface";
import {
  createCart,
  deleteCart,
  fetchCartById,
  fetchCarts,
  updateCart,
} from "../api/cart.api";

interface CartState {
  items: CartItem[];
  loading: boolean;
  success: string | null;
  error: string | null;
  actions: {
    addToCart: (
      cart: CartItem,
    ) => Promise<{ items?: CartItem[]; message?: string; error?: string }>;
    getCarts: () => Promise<void>;
    getCartById: (id: string) => Promise<void>;
    updateCart: (id: string, cart: CartItem) => Promise<void>;
    removeFromCart: (
      id: string,
    ) => Promise<{ message?: string; error?: string }>;
  };
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  loading: false,
  success: null,
  error: null,
  actions: {
    addToCart: async (cart) => {
      set({ loading: true, error: null });
      try {
        const data = await createCart(cart);
        set({ items: data.data, success: data.message, loading: false });
        return { items: data.data, message: data.message };
      } catch (err) {
        set({ error: err.request?.statusText || err.message, loading: false });
        return { error: err.request?.statusText || err.message };
      }
    },

    getCarts: async () => {
      set({ loading: true, error: null });
      try {
        const data = await fetchCarts();
        set({ items: data.data, success: data.message, loading: false });
      } catch (err) {
        set({ error: err.request?.statusText || err.message, loading: false });
      }
    },

    getCartById: async (id) => {
      set({ loading: true, error: null });
      try {
        const data = await fetchCartById(id);
        set({ items: data.data, success: data.message, loading: false });
      } catch (err) {
        set({ error: err.request?.statusText || err.message, loading: false });
      }
    },

    updateCart: async (id, cart) => {
      set({ loading: true, error: null });
      try {
        const data = await updateCart(id, cart);
        set({ success: data.message, loading: false });
      } catch (err) {
        set({ error: err.request?.statusText || err.message, loading: false });
      }
    },

    removeFromCart: async (id) => {
      set({ loading: true, error: null });
      try {
        await deleteCart(id);
        set({ success: "Item removed from cart", loading: false });
        return { message: "Item removed from cart" };
      } catch (err) {
        set({ error: err.request?.statusText || err.message, loading: false });
        return { error: err.request?.statusText || err.message };
      }
    },
  },
}));

export const useCartActions = () => {
  const { actions } = useCartStore();
  return actions;
};
