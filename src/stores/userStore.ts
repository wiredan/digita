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
  addProduct: (productData: Omit<Product, 'id' | 'sellerName'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
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
      addProduct: async (productData) => {
        const newProduct = await api<Product>('/api/products', {
          method: 'POST',
          body: JSON.stringify(productData),
        });
        set((state) => ({
          products: [newProduct, ...state.products],
        }));
      },
      updateProduct: async (product) => {
        const updatedProduct = await api<Product>(`/api/products/${product.id}`, {
          method: 'PUT',
          body: JSON.stringify(product),
        });
        set((state) => ({
          products: state.products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
        }));
      },
      deleteProduct: async (productId: string) => {
        await api(`/api/products/${productId}`, { method: 'DELETE' });
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        }));
      },
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