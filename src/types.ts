export type CategoryType = 
  | 'all'
  | 'men'
  | 'women'
  | 'accessories'
  | 'islamic-lifestyle'
  | 'peshawari'
  | 'khussa'
  | 'formal'
  | 'casual'
  | 'sneakers'
  | 'heels'
  | 'sandals'
  | 'boots'
  | 'sale';

export interface ProductColor {
  name: string;
  hex: string;
  bgClass?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  fitRating?: 'Runs Small' | 'True to Size' | 'Runs Large';
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  brand: string;
  price: number; // in PKR
  originalPrice?: number; // in PKR
  category: CategoryType;
  gender: 'men' | 'women' | 'unisex';
  subcategory: string;
  rating: number;
  reviewCount: number;
  images: string[];
  colors: ProductColor[];
  sizes: number[]; // e.g. [39, 40, 41, 42, 43, 44, 45]
  description: string;
  features: string[];
  material: string;
  soleMaterial: string;
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFlashDeal?: boolean;
  flashDealEnds?: string;
  discountPercentage?: number;
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  selectedColor: ProductColor;
  selectedSize: number;
  quantity: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  image?: string;
}

export interface OrderDetails {
  orderId: string;
  date: string;
  placedAtTimestamp?: number;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    zip: string;
    country: string;
    notes?: string;
  };
  paymentMethod: 'cod' | 'jazzcash-easypaisa' | 'bank-card';
  transactionId?: string;
  shippingMethod: 'standard' | 'express';
  status: 'Order Placed' | 'Under Quality Check' | 'Dispatched with Courier' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  cancellationReason?: string;
  cancelledAt?: string;
  currentLocation?: string;
  courierName?: string;
  trackingNumber?: string;
  estimatedDelivery: string;
  trackingSteps: {
    title: string;
    description: string;
    date: string;
    completed: boolean;
    current?: boolean;
  }[];
}
