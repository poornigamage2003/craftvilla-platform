import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole } from "../types";

interface AuthState {
  user: User | null;
  login: (email: string, role?: UserRole, name?: string) => User;
  register: (name: string, email: string, role: UserRole) => User;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      login: (email: string, role: UserRole = "CUSTOMER", name?: string) => {
        const computedName =
          name ||
          (email.includes("@")
            ? email.split("@")[0].replace(/[\._]/g, " ")
            : email);
        const capitalized =
          computedName.charAt(0).toUpperCase() + computedName.slice(1);
        const newUser: User = {
          id: "usr-" + Date.now(),
          name: capitalized,
          email,
          role,
        };
        set({ user: newUser });
        return newUser;
      },
      register: (name: string, email: string, role: UserRole) => {
        const newUser: User = {
          id: "usr-" + Date.now(),
          name,
          email,
          role,
        };
        set({ user: newUser });
        return newUser;
      },
      logout: () => {
        set({ user: null });
      },
      setRole: (role: UserRole) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, role } });
        }
      },
    }),
    {
      name: "craftvilla-auth",
    }
  )
);
