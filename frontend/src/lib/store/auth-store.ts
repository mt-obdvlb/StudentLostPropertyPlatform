"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, UserRole } from "@/lib/types";
import { setStoredToken, registerUnauthorizedHandler } from "@/lib/api/axios";

type AuthState = {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User | null) => void;
  clear: () => void;
  isAuthenticated: () => boolean;
  hasRole: (...roles: UserRole[]) => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      hydrated: false,
      setAuth: (token, user) => {
        setStoredToken(token);
        set({ token, user });
      },
      setUser: (user) => set({ user }),
      clear: () => {
        setStoredToken(null);
        set({ token: null, user: null });
      },
      isAuthenticated: () => !!get().token,
      hasRole: (...roles) => {
        const user = get().user;
        if (!user) return false;
        return roles.includes(user.role);
      },
    }),
    {
      name: "lost-found.auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
          if (state.token) setStoredToken(state.token);
        }
      },
    },
  ),
);

if (typeof window !== "undefined") {
  registerUnauthorizedHandler(() => {
    useAuthStore.getState().clear();
    const from = window.location.pathname + window.location.search;
    if (window.location.pathname !== "/login") {
      window.location.href = `/login?from=${encodeURIComponent(from)}`;
    }
  });
}

export function useHydratedAuth() {
  return useAuthStore((s) => s.hydrated);
}
