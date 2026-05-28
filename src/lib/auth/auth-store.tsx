"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthSession, AuthUser } from "@/lib/types/auth";

const AUTH_STORAGE_KEY = "mini-commerce-auth";

type AuthContextValue = {
  session: AuthSession | null;
  isHydrated: boolean;
  setSession: (session: AuthSession) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const storedSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

      if (storedSession) {
        try {
          setSessionState(JSON.parse(storedSession) as AuthSession);
        } catch {
          window.localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }

      setIsHydrated(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const setSession = useCallback((nextSession: AuthSession) => {
    setSessionState(nextSession);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
  }, []);

  const setUser = useCallback((user: AuthUser) => {
    setSessionState((currentSession) => {
      if (!currentSession) {
        return null;
      }

      const nextSession = {
        ...currentSession,
        user,
      };

      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
      return nextSession;
    });
  }, []);

  const logout = useCallback(() => {
    setSessionState(null);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isHydrated,
      setSession,
      setUser,
      logout,
    }),
    [isHydrated, logout, session, setSession, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
