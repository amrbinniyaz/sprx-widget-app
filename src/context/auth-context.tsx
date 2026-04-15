"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { mockUser } from "@/lib/mock-data";

interface AuthUser {
  firstName: string;
  lastName: string;
  name: string;
  school: string;
  email: string;
  role: string;
  plan: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: Partial<AuthUser> & { password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("sprx_user");
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      // Auto-login for local development/previewing
      setUser(mockUser);
      localStorage.setItem("sprx_user", JSON.stringify(mockUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const u = { ...mockUser, email };
    setUser(u);
    localStorage.setItem("sprx_user", JSON.stringify(u));
  };

  const signup = async (data: Partial<AuthUser> & { password: string }) => {
    await new Promise((r) => setTimeout(r, 800));
    const u = {
      ...mockUser,
      ...data,
      name: `${data.firstName} ${data.lastName}`,
    };
    setUser(u);
    localStorage.setItem("sprx_user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sprx_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
