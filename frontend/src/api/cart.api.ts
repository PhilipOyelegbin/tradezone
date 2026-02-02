import api from "./axios";
import type { CartItem } from "../utils/interface";

export async function fetchCarts() {
  const response = await api.get("/cart");
  return response.data;
}

export async function fetchCartById(id: string) {
  const response = await api.get(`/cart/${id}`);
  return response.data;
}

export async function createCart(data: CartItem) {
  const response = await api.post("/cart", data);
  return response.data;
}

export async function updateCart(id: string, data: CartItem) {
  const response = await api.put(`/cart/${id}`, data);
  return response.data;
}

export async function deleteCart(id: string) {
  const response = await api.delete(`/cart/${id}`);
  return response.data;
}
