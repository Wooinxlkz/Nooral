import { create } from 'zustand';

type AuthMode = 'sign-in' | 'sign-up';

interface AuthModalState {
  open: boolean;
  mode: AuthMode;
  openModal: (mode?: AuthMode) => void;
  closeModal: () => void;
  setMode: (mode: AuthMode) => void;
}

export const useAuthModal = create<AuthModalState>()((set) => ({
  open: false,
  mode: 'sign-in',
  openModal: (mode = 'sign-in') => set({ open: true, mode }),
  closeModal: () => set({ open: false }),
  setMode: (mode) => set({ mode }),
}));
