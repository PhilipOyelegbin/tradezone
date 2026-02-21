import { create } from "zustand";
import {
  addProduct,
  deleteProduct,
  fetchProductById,
  fetchProducts,
  updateProductDetails,
  updateProductImages,
} from "../api/product.api";
import type { Product } from "../utils/interface";

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  success: string | null;
  error: string | null;
  actions: {
    getProducts: (
      page: number,
      category?: string,
      price?: number,
    ) => Promise<void>;
    getProductById: (id: string) => Promise<void>;
    addProduct: (data: Product) => Promise<void>;
    updateProductImages: (id: string, data: Product) => Promise<void>;
    updateProductDetails: (id: string, data: Product) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    clearError: () => void;
  };
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  currentProduct: null,
  totalPages: 1,
  currentPage: 1,
  loading: false,
  success: null,
  error: null,

  actions: {
    getProducts: async (page, category, price) => {
      if (get().loading) return;

      set({ loading: true, error: null });
      try {
        const data = await fetchProducts(page, category, price);
        set({
          products: data.data,
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          success: data.message,
          loading: false,
        });
      } catch (err) {
        set({ error: err.request.statusText, loading: false });
      }
    },

    getProductById: async (id) => {
      set({ loading: true, error: null });
      try {
        const data = await fetchProductById(id);
        set({
          currentProduct: data.data,
          success: data.message,
          loading: false,
        });
      } catch (err) {
        set({ error: err.request.statusText, loading: false });
      }
    },

    addProduct: async (product) => {
      set({ loading: true, error: null });
      try {
        const data = await addProduct(product);
        set({ products: data.data, success: data.message, loading: false });
      } catch (err) {
        set({ error: err.request.statusText, loading: false });
      }
    },

    updateProductImages: async (id, product) => {
      set({ loading: true, error: null });
      try {
        const data = await updateProductImages(id, product);
        set({ success: data.message, loading: false });
      } catch (err) {
        set({ error: err.request.statusText, loading: false });
      }
    },

    updateProductDetails: async (id, product) => {
      set({ loading: true, error: null });
      try {
        const data = await updateProductDetails(id, product);
        set({ success: data.message, loading: false });
      } catch (err) {
        set({ error: err.request.statusText, loading: false });
      }
    },

    deleteProduct: async (id) => {
      set({ loading: true, error: null });
      try {
        await deleteProduct(id);
        set({ success: "Product deleted successfully", loading: false });
      } catch (err) {
        set({ error: err.request.statusText, loading: false });
      }
    },

    clearError: () => set({ error: null }),
  },
}));

// 3. Helper hook for cleaner component usage
export const useProductActions = () =>
  useProductStore((state) => state.actions);
