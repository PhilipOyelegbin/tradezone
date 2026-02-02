import { create } from "zustand";
import {
  createOrder,
  deleteOrder,
  fetchOrderById,
  fetchOrders,
  updateOrderStatus,
} from "../api/order.api";
import type { Order } from "../utils/interface";

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  success: string | null;
  error: string | null;
  actions: {
    getOrders: () => Promise<void>;
    getOrdersById: (id: string) => Promise<void>;
    createOrder: (
      orderData: Partial<Order>,
    ) => Promise<{ data?: any; message?: string; error?: string }>;
    updateOrder: (
      id: string,
      status: string,
    ) => Promise<{ message?: string; error?: string }>;
    deleteOrder: (id: string) => Promise<{ message?: string; error?: string }>;
  };
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  success: null,
  error: null,
  actions: {
    getOrders: async () => {
      set({ loading: true, error: null });
      try {
        const response = await fetchOrders();
        set({
          orders: response.data,
          success: response.message,
          loading: false,
        });
      } catch (err: any) {
        set({
          error: err.request?.statusText || err.message,
          loading: false,
        });
      }
    },

    getOrdersById: async (id: string) => {
      set({ loading: true, error: null });
      try {
        const response = await fetchOrderById(id);
        set({
          currentOrder: response.data,
          success: response.message,
          loading: false,
        });
      } catch (err: any) {
        set({
          error: err.request?.statusText || err.message,
          loading: false,
        });
      }
    },

    createOrder: async (orderData: Partial<Order>) => {
      set({ loading: true, error: null, success: null });
      try {
        const response = await createOrder(orderData);
        set({
          currentOrder: response.data,
          success: response.message,
          loading: false,
        });
        return {
          data: response.data,
          message: response.message || "Order created successfully",
        };
      } catch (err: any) {
        set({
          error: err.request?.statusText || err.message,
          loading: false,
        });
        return { error: err.request?.statusText || err.message };
      }
    },

    updateOrder: async (id: string, status: string) => {
      set({ loading: true, error: null, success: null });
      try {
        const response = await updateOrderStatus(id, status);
        set({
          orders: response.data,
          success: response.message,
          loading: false,
        });
        return { message: response.message || "Order updated successfully" };
      } catch (err: any) {
        set({
          error: err.request?.statusText || err.message,
          loading: false,
        });
        return { error: err.request?.statusText || err.message };
      }
    },

    deleteOrder: async (id: string) => {
      set({ loading: true, error: null, success: null });
      try {
        const response = await deleteOrder(id);
        set({
          success: response.message,
          loading: false,
        });
        return { message: response.message || "Order deleted successfully" };
      } catch (err: any) {
        set({
          error: err.request?.statusText || err.message,
          loading: false,
        });
        return { error: err.request?.statusText || err.message };
      }
    },
  },
}));

export const useOrderActions = () => {
  const { actions } = useOrderStore();
  return actions;
};
