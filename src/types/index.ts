// ==========================================
// Type definitions for Cây Thuốc Ông Han store
// ==========================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string; // Lucide icon name
  image: string;
  productCount: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  images: string[];
  shortDescription: string;
  description: string;
  usage: string; // Công dụng / Chủ trị
  dosage: string; // Cách dùng / Liều lượng
  origin: string; // Nguồn gốc
  ingredients?: string; // Thành phần
  weight: string; // Khối lượng
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[]; // Ví dụ: "giải độc", "mát gan", "trị mất ngủ"
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller?: boolean;
  precautions?: string; // Lưu ý & Đối tượng dùng
  preservation?: string; // Hướng dẫn bảo quản
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  customer: CustomerInfo;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  ward: string;
  district: string;
  city: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipping"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "bank_transfer" | "momo";

export interface FilterOptions {
  search: string;
  categoryId: string;
  tags: string[];
  priceRange: [number, number];
  sortBy: "name" | "price-asc" | "price-desc" | "rating" | "newest";
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
}
