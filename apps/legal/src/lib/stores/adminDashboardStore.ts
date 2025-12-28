import { create } from 'zustand';

interface AdminDashboardState {
  username: string;
  password: string;
  authenticated: boolean;
  passwordError: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setPasswordError: (error: string) => void;
  reset: () => void;
}

export const useAdminDashboardStore = create<AdminDashboardState>((set) => ({
  username: '',
  password: '',
  authenticated: false,
  passwordError: '',
  setUsername: (username) => set({ username }),
  setPassword: (password) => set({ password }),
  setAuthenticated: (authenticated) => set({ authenticated }),
  setPasswordError: (error) => set({ passwordError: error }),
  reset: () =>
    set({
      username: '',
      password: '',
      authenticated: false,
      passwordError: '',
    }),
}));
