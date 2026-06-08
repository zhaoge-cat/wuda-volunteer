import { create } from "zustand";

interface User {
  id: number;
  phone: string;
  name: string;
  role: string;
  school?: string;
  avatar?: string;
}

interface AuthState {
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const storedUser = localStorage.getItem("currentUser")
  ? JSON.parse(localStorage.getItem("currentUser")!)
  : null;

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: storedUser,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  login: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", String(user.id));
    localStorage.setItem("currentUser", JSON.stringify(user));
    set({ currentUser: user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("currentUser");
    set({ currentUser: null, token: null, isAuthenticated: false });
  },
  updateUser: (data) =>
    set((state) => {
      const updated = state.currentUser
        ? { ...state.currentUser, ...data }
        : null;
      if (updated) localStorage.setItem("currentUser", JSON.stringify(updated));
      return { currentUser: updated };
    }),
}));

interface UIState {
  sidebarCollapsed: boolean;
  activePage: string;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setActivePage: (page: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  activePage: "dashboard",
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setActivePage: (page) => set({ activePage: page }),
}));
