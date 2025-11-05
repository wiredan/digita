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
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateKycStatus: (status: KycStatus) => void;
  updateProfile: (data: Partial<Pick<UserProfile, 'name' | 'avatarUrl'>>) => Promise<void>;
  placeOrder: (cart: Product[], totalAmount: number) => Promise<Order>;
  addProduct: (productData: Omit<Product, 'id' | 'sellerName'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
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
      signup: async (name, email, password) => {
        const { user, orders, products } = await api<LoginResponse>('/api/auth/signup', {
          method: 'POST',
          body: JSON.stringify({ name, email, password }),
        });
        set({ user, orders, products, cart: [] });
      },
      logout: () => set({ user: null, orders: [], products: [], cart: [] }),
      updateKycStatus: (status) =>
        set((state) => ({
          user: state.user ? { ...state.user, kycStatus: status } : null,
        })),
      updateProfile: async (data) => {
        const updatedUser = await api<UserProfile>('/api/profile', {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }));
      },
      placeOrder: async (cart, totalAmount) => {
        const newOrder = await api<Order>('/api/orders', {
          method: 'POST',
          body: JSON.stringify({ items: cart, totalAmount }),
        });
        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));
        return newOrder;
      },
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
      name: 'user-session-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);