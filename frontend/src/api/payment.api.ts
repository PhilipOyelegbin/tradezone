import api from "./axios";
import type { Payment } from "../utils/interface";

export async function getPayments() {
  const response = await api.get(`/payments`);
  return response.data;
}

export async function initiatePayment(data: Partial<Payment>) {
  const response = await api.post(`/payments`, {
    method: data.method,
    order_id: data.order_id,
  });
  return response.data;
}

export async function verifyPayment(paymentId: string) {
  const response = await api.get(`/payments/verify/${paymentId}`);
  return response.data;
}
