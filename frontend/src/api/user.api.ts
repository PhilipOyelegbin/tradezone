import type { User } from "../utils/interface";
import api from "./axios";

export async function loginUser(data: User) {
  const response = await api.post("/users/login", data);
  return response.data;
}

export async function createUser(data: User) {
  const response = await api.post("/users/register", data);
  return response.data;
}

export async function verifyEmail(token: string) {
  const response = await api.post(`/users/verify-email/${token}`);
  return response.data;
}

export async function resendVerificationEmail(email: string) {
  const response = await api.post("/users/resend-verification", { email });
  return response.data;
}

export async function fetchAllUsers() {
  const response = await api.get("/users");
  return response.data;
}

export async function fetchUserById(id: string) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

export async function updateUser(id: string, data: User) {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
}

export async function removeUser(id: string) {
  const response = await api.delete(`/users/${id}`);
  return response.data;
}

export async function forgetPassword(email: string) {
  const response = await api.post("/users/forget-password", { email });
  return response.data;
}

export async function resetPassword(token: string, password: string) {
  const response = await api.post(`/users/reset-password/${token}`, {
    password,
  });
  return response.data;
}
