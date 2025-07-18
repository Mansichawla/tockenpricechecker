import { create } from 'zustand';

interface TokenState {
  tokenAddress: string;
  network: string;
  timestamp: string;
  price: string;
  source: string;
  setData: (data: Partial<TokenState>) => void;
}

export const useTokenStore = create<TokenState>((set) => ({
  tokenAddress: '',
  network: '',
  timestamp: '',
  price: '',
  source: '',
  setData: (data) => set((state) => ({ ...state, ...data })),
}));

