// User Types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  avatar?: string;
  phone?: string;
  address?: Address;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  subcategory?: string;
  brand: string;
  images: ProductImage[];
  stock: number;
  sku: string;
  weight?: number;
  dimensions?: Dimensions;
  specifications?: Specification[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  _id: string;
  url: string;
  alt: string;
  isMain: boolean;
  order: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string;
  isActive: boolean;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
}

export interface Specification {
  name: string;
  value: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface ProductVariant {
  _id: string;
  name: string;
  value: string;
  priceModifier: number;
  stockModifier: number;
}

// Order Types
export interface Order {
  _id: string;
  orderNumber: string;
  customer: User;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingMethod: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  variant?: ProductVariant;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

// Review Types
export interface Review {
  _id: string;
  product: string;
  customer: User;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerified: boolean;
  isApproved: boolean;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

// Chat Types
export interface ChatMessage {
  _id: string;
  chatId: string;
  sender: User;
  message: string;
  type: 'text' | 'image' | 'file';
  isRead: boolean;
  createdAt: string;
}

export interface Chat {
  _id: string;
  customer: User;
  admin?: User;
  status: 'open' | 'in_progress' | 'closed';
  subject: string;
  priority: 'low' | 'medium' | 'high';
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// Theme Types
export interface ThemeConfig {
  _id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    luxury: {
      gold: string;
      platinum: string;
      charcoal: string;
      pearl: string;
    };
  };
  fonts: {
    heading: string;
    body: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Filter Types
export interface ProductFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  featured?: boolean;
  tags?: string[];
  search?: string;
  sortBy?: ProductSortOption;
  page?: number;
  limit?: number;
}

export type ProductSortOption = 
  | 'newest'
  | 'oldest'
  | 'price_low'
  | 'price_high'
  | 'rating'
  | 'popularity'
  | 'name_asc'
  | 'name_desc';

// Component Props Types
export interface ButtonProps {
  variant?: 'luxury' | 'elegant' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Store Types (Zustand)
export interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

// Search Types
export interface SearchResult {
  products: Product[];
  categories: Category[];
  brands: string[];
  total: number;
  query: string;
}

// Analytics Types
export interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: Order[];
  topProducts: Product[];
  salesByMonth: { month: string; sales: number }[];
  ordersByStatus: { status: OrderStatus; count: number }[];
}