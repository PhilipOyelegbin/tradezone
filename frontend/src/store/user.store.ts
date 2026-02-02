import { create } from "zustand";
import type { User } from "../utils/interface";
import {
  createUser,
  fetchAllUsers,
  fetchUserById,
  forgetPassword,
  loginUser,
  removeUser,
  resendVerificationEmail,
  resetPassword,
  updateUser,
  verifyEmail,
} from "../api/user.api";

interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
  success: string | null;
  error: string | null;
  actions: {
    authUser: (user: User) => Promise<void>;
    addUser: (user: User) => Promise<void>;
    verifyUser: (token: string) => Promise<void>;
    resendVerificationMail: (email: string) => Promise<void>;
    getUsers: () => Promise<void>;
    getUserById: (id: string) => Promise<void>;
    updateUser: (id: string, user: User) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    forgePassword: (email: string) => Promise<void>;
    resetPassword: (token: string, password: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
  };
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  loading: false,
  success: null,
  error: null,

  actions: {
    authUser: async (user) => {
      set({ loading: true, error: null });
      try {
        const data = await loginUser(user);
        set({ token: data.data.token, success: data.message, loading: false });
      } catch (err) {
        set({ error: err.request?.statusText || err.message, loading: false });
      }
    },

    addUser: async (user) => {
      set({ loading: true, error: null });
      try {
        const data = await createUser(user);
        set({ success: data.message, loading: false });
      } catch (err) {
        set({ error: err.request?.statusText || err.message, loading: false });
      }
    },

    verifyUser: async (token) => {
      set({ loading: true, error: null });
      try {
        const data = await verifyEmail(token);
        set({ success: data.message, loading: false });
      } catch (err) {
        set({ error: err.request?.statusText || err.message, loading: false });
      }
    },

    resendVerificationMail: async (email) => {
      set({ loading: true, error: null });
      try {
        const data = await resendVerificationEmail(email);
        set({ success: data.message, loading: false });
      } catch (err) {
        set({ error: err.request?.statusText || err.message, loading: false });
      }
    },

    getUsers: async () => {
      set({ loading: true, error: null });
      try {
        const data = await fetchAllUsers();
        set({ user: data.data, success: data.message, loading: false });
      } catch (err) {
        set({ error: err.request?.statusText || err.message, loading: false });
      }
    },

    getUserById: async (id) => {
      set({ loading: true, error: null });
      try {
        const data = await fetchUserById(id);
        set({ user: data.data, success: data.message, loading: false });
      } catch (err) {
        set({ error: err.request?.statusText || err.message, loading: false });
      }
    },

    updateUser: async (id, user) => {
      set({ loading: true, error: null });
      try {
        const data = await updateUser(id, user);
        set({ user: data.data, success: data.message, loading: false });
      } catch (err) {
        set({ error: err.request?.statusText || err.message, loading: false });
      }
    },

    deleteUser: async (id) => {
      set({ loading: true, error: null });
      try {
        await removeUser(id);
        set({ success: "User deleted successfully", loading: false });
      } catch (err) {
        set({ error: err.request?.statusText || err.message, loading: false });
      }
    },

    forgePassword: async (email) => {
      set({ loading: true, error: null });
      try {
        const data = await forgetPassword(email);
        set({ success: data.message, loading: false });
      } catch (err) {
        set({ error: err.request?.statusText || err.message, loading: false });
      }
    },

    resetPassword: async (token, password) => {
      set({ loading: true, error: null });
      try {
        const data = await resetPassword(token, password);
        set({ success: data.message, loading: false });
      } catch (err) {
        set({ error: err.request?.statusText || err.message, loading: false });
      }
    },

    logout: () => set({ user: null, token: null }),
    clearError: () => set({ error: null }),
  },
}));

export const useUserActions = () => useUserStore((state) => state.actions);
