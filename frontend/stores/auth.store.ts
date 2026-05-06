import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar: string;
  streamUserId: string;
}

interface AuthState {
  user: User | null;
  jwtToken: string | null;
  streamToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, jwtToken: string, streamToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      jwtToken: null,
      streamToken: null,
      isAuthenticated: false,
      setAuth: (user, jwtToken, streamToken) =>
        set({ user, jwtToken, streamToken, isAuthenticated: true }),
      clearAuth: () =>
        set({ user: null, jwtToken: null, streamToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);


