export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Boilerplate types (to fix build errors from untouched template files)
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}
// Verdant Application Types
export interface Product {
  id: string;
  name:string;
  description: string;
  price: number;
  imageUrl: string;
  sellerName?: string;
  category: string;
}
export type KycStatus = 'not_started' | 'pending' | 'verified' | 'rejected';
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  kycStatus: KycStatus;
  avatarUrl?: string;
}
export type OrderStatus = 'placed' | 'shipped' | 'delivered' | 'cancelled' | 'disputed';
export interface Order {
  id: string;
  items: Product[];
  buyerId: string;
  status: OrderStatus;
  date: string; // ISO 8601 date string
  trackingNumber?: string;
  orderNumber: string;
  totalAmount: number;
}
export interface LoginResponse {
    user: UserProfile;
    orders: Order[];
    products: Product[];
}
export interface EducationContent {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;
}
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  kycStatus: KycStatus;
  joinDate: string;
}
export interface Dispute {
  id: string;
  orderNumber: string;
  productName: string;
  status: 'open' | 'resolved' | 'escalated' | 'disputed';
  date: string;
}