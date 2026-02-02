import api from "./axios";

export async function fetchProducts(
  page: number,
  catgeory?: string,
  price?: number
) {
  const pageSize = 12;
  const response = await api.get(
    `/products?page=${page}&pageSize=${pageSize}&category=${
      catgeory || ""
    }&price=${price || ""}`
  );
  return response.data;
}

export async function fetchProductById(id: string) {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

export async function addProduct(data: FormData) {
  const response = await api.post("/products", data);
  return response.data;
}

export async function updateProductDetails(id: string, data: FormData) {
  const response = await api.put(`/products/details/${id}`, data);
  return response.data;
}

export async function updateProductImages(id: string, data: FormData) {
  const response = await api.put(`/products/images/${id}`, data);
  return response.data;
}

export async function deleteProduct(id: string) {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}
