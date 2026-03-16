export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string | null;
  category: string;
  stock: number;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: number;
  userId: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
  shippingAddress: string;
  phone: string;
  items?: OrderItem[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
