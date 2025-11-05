import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfile, KycStatus, Order, Product, LoginResponse } from '@shared/types';
import { api } from '@/lib/api-client';
interface UserState {
  user: UserProfile | null;
  orders: Order[];
  products: Product[];
  cart: Product[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateKycStatus: (status: KycStatus) => void;
  addOrder: (order: Order) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      orders: [],
      products: [],
      cart: [],
      login: async (email, password) => {
        const { user, orders, products } = await api<LoginResponse>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        set({ user, orders, products, cart: [] });
      },
      logout: () => set({ user: null, orders: [], products: [], cart: [] }),
      updateKycStatus: (status) =>
        set((state) => ({
          user: state.user ? { ...state.user, kycStatus: status } : null,
        })),
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),
      addProduct: (product) =>
        set((state) => ({
          products: [product, ...state.products],
        })),
      updateProduct: (product) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === product.id ? product : p)),
        })),
      addToCart: (product) =>
        set((state) => ({
          cart: [...state.cart, product],
        })),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((p) => p.id !== productId),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'user-session-storage', // unique name
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);