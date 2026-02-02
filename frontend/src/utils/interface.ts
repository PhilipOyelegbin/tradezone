export interface User {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  address?: string;
  phone_number?: string;
  password?: string;
  is_admin?: boolean;
  is_verified?: boolean;
}

export interface Category {
  id?: string;
  name: string;
  description?: string;
}

export interface Product {
  id?: string;
  images?: string[];
  name: string;
  description: string;
  price: number;
  category: {
    id: string;
    name?: string;
  };
  quantity: number;
}

export interface CartItem {
  id?: string;
  product_id?: string;
  quantity: number;
}

export interface Order {
  id?: string;
  user_id?: string;
  shipping_address: string;
  carts: CartItem[];
  payment_info?: { method: string; amount: number };
  status?: "pending" | "shipped" | "delivered" | "cancelled";
}

export interface Payment {
  id?: string;
  order_id?: string;
  amount?: number;
  method: string;
  status?: "pending" | "completed" | "failed";
}
