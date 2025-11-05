import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfile, KycStatus, Order, Product } from '@shared/types';
import { MOCK_ORDERS, MOCK_USER_PRODUCTS } from '@/lib/constants';
interface UserState {
  user: UserProfile | null;
  orders: Order[];
  products: Product[];
  login: (user: UserProfile) => void;
  logout: () => void;
  updateKycStatus: (status: KycStatus) => void;
  addOrder: (order: Order) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
}
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      orders: [],
      products: [],
      login: (user) => set({ user, orders: MOCK_ORDERS, products: MOCK_USER_PRODUCTS }),
      logout: () => set({ user: null, orders: [], products: [] }),
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
    }),
    {
      name: 'user-session-storage', // unique name
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);