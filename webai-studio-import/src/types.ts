export interface Product {
  id: string;
  name: string;
  description: string;
  volume: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'cerveja' | 'whisky' | 'vinho' | 'gelo' | 'outro';
  subCategory?: string; // e.g. 'Lager', 'Pilsen', 'Artesanais'
  rating: number;
  isGelada?: boolean;
  isTurbo?: boolean;
  estimatedTime?: string;
  temperature?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface TrackingEvent {
  title: string;
  description: string;
  time: string;
  completed: boolean;
  active?: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: 'Pendente' | 'Preparando' | 'A caminho' | 'Entregue' | 'Cancelado';
  total: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  items: CartItem[];
  deliveryAddress: string;
  paymentMethod: string;
  changeFor?: string;
  observation?: string;
  trackingEvents: TrackingEvent[];
  courier?: {
    name: string;
    rating: number;
    avatar: string;
  };
}

export type ScreenType =
  | 'splash'
  | 'login'
  | 'home'
  | 'categories'
  | 'product-details'
  | 'cart'
  | 'checkout'
  | 'tracking'
  | 'history'
  | 'profile';
