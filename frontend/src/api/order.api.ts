import api from "./axios";
import type { Order } from "../utils/interface";

export async function fetchOrders() {
  const response = await api.get("/orders");
  return response.data;
}

export async function fetchOrderById(id: string) {
  const response = await api.get(`/orders/${id}`);
  return response.data;
}

export async function createOrder(data: Partial<Order>) {
  const response = await api.post("/orders", data);
  return response.data;
}

export async function updateOrderStatus(id: string, status: string) {
  const response = await api.put(`/orders/${id}`, { status });
  return response.data;
}

export async function deleteOrder(id: string) {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
}
