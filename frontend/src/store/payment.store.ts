import { create } from "zustand";
import type { Payment } from "../utils/interface";
import {
  getPayments,
  initiatePayment,
  verifyPayment,
} from "../api/payment.api";

interface PaymentState {
  payments: [];
  loading: boolean;
  success: string | null;
  error: string | null;
  actions: {
    getPayments: () => Promise<void>;
    verifyPayment: (id: string) => Promise<void>;
    initiatePayment: (
      paymentData: Partial<Payment>,
    ) => Promise<{ data?: any; message?: string; error?: string }>;
  };
}

export const usePaymentStore = create<PaymentState>((set) => ({
  payments: [],
  loading: false,
  success: null,
  error: null,
  actions: {
    getPayments: async () => {
      set({ loading: true, error: null });
      try {
        const response = await getPayments();
        set({
          payments: response.data,
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

    verifyPayment: async (id: string) => {
      set({ loading: true, error: null });
      try {
        const response = await verifyPayment(id);
        set({
          payments: response.data,
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

    initiatePayment: async (paymentData: Partial<Payment>) => {
      set({ loading: true, error: null, success: null });
      try {
        const response = await initiatePayment(paymentData);
        set({
          payments: response.data,
          success: response.message,
          loading: false,
        });
        return {
          data: response.data,
          message: response.message || "Payment created successfully",
        };
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

export const usePaymentActions = () => {
  const { actions } = usePaymentStore();
  return actions;
};
