import type { OrderStatus, PaymentMethod, UserRole } from "./database";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  stock_qty: number;
  stock_min: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  name: string;
  phone: string | null;
  address_default: string | null;
  cashback_balance: number;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Motoboy {
  id: string;
  name: string;
  phone: string;
  active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total: number;
  payment_method: PaymentMethod;
  change_for: number | null;
  delivery_address: string;
  motoboy_id: string | null;
  notes: string | null;
  driver_lat: number | null;
  driver_lng: number | null;
  driver_updated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  qty: number;
  price_at_time: number;
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & { products: Pick<Product, "name" | "image_url"> | null })[];
  profiles?: Pick<Profile, "name" | "phone"> | null;
  motoboys?: Pick<Motoboy, "name" | "phone"> | null;
}

export interface StockAlert {
  id: string;
  product_id: string;
  triggered_at: string;
  resolved: boolean;
  resolved_at: string | null;
}
