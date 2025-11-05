import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfile, KycStatus, Order } from '@shared/types';
import { MOCK_ORDERS } from '@/lib/constants';
interface UserState {
  user: UserProfile | null;
  orders: Order[];
  login: (user: UserProfile) => void;
  logout: () => void;
  updateKycStatus: (status: KycStatus) => void;
  addOrder: (order: Order) => void;
}
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      orders: [],
      login: (user) => set({ user, orders: MOCK_ORDERS }),
      logout: () => set({ user: null, orders: [] }),
      updateKycStatus: (status) =>
        set((state) => ({
          user: state.user ? { ...state.user, kycStatus: status } : null,
        })),
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),
    }),
    {
      name: 'user-session-storage', // unique name
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);