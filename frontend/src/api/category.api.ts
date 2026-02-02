import api from "./axios";
import type { Category } from "../utils/interface";

export async function fetchCategories() {
  const response = await api.get("/categories");
  return response.data;
}

export async function fetchCategoryById(id: string) {
  const response = await api.get(`/categories/${id}`);
  return response.data;
}

export async function createCategory(data: Category) {
  const response = await api.post("/categories", data);
  return response.data;
}

export async function updateCategory(
  id: string,
  data: { name?: string; description?: string },
) {
  const response = await api.put(`/categories/${id}`, data);
  return response.data;
}

export async function deleteCategory(id: string) {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
}
