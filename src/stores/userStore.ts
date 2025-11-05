import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfile, KycStatus } from '@shared/types';
interface UserState {
  user: UserProfile | null;
  login: (user: UserProfile) => void;
  logout: () => void;
  updateKycStatus: (status: KycStatus) => void;
}
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      updateKycStatus: (status) =>
        set((state) => ({
          user: state.user ? { ...state.user, kycStatus: status } : null,
        })),
    }),
    {
      name: 'user-session-storage', // unique name
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);