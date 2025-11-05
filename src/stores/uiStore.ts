import { create } from 'zustand';
interface UIState {
  isAiChatOpen: boolean;
  openAiChat: () => void;
  closeAiChat: () => void;
  toggleAiChat: () => void;
  speakingMessageId: number | null;
  setSpeakingMessageId: (id: number | null) => void;
}
export const useUIStore = create<UIState>((set) => ({
  isAiChatOpen: false,
  openAiChat: () => set({ isAiChatOpen: true }),
  closeAiChat: () => set({ isAiChatOpen: false }),
  toggleAiChat: () => set((state) => ({ isAiChatOpen: !state.isAiChatOpen })),
  speakingMessageId: null,
  setSpeakingMessageId: (id) => set({ speakingMessageId: id }),
}));