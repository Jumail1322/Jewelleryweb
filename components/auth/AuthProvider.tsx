"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ApiError, apiFetch } from "@/lib/api";

type Session = { access: string; refresh: string | null; email: string };

type AuthContextValue = {
  session: Session | null;
  ready: boolean;
  /** Step 1: emails a one-time code */
  requestOtp: (email: string) => Promise<void>;
  /** Step 2: exchanges the code for tokens */
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  /** apiFetch with the customer's token, refreshing it once on 401 */
  authFetch: <T>(path: string, init?: RequestInit) => Promise<T>;
};

const STORAGE_KEY = "ornmnt-auth";
const AuthContext = createContext<AuthContextValue | null>(null);

/** The login/refresh responses aren't documented, so look for the token under the usual names. */
function findToken(body: unknown, keys: string[]): string | null {
  if (!body || typeof body !== "object") return null;
  for (const [k, v] of Object.entries(body as Record<string, unknown>)) {
    if (keys.includes(k) && typeof v === "string") return v;
  }
  for (const v of Object.values(body as Record<string, unknown>)) {
    const found = findToken(v, keys);
    if (found) return found;
  }
  return null;
}
const ACCESS_KEYS = ["access", "access_token", "accessToken", "token"];
const REFRESH_KEYS = ["refresh", "refresh_token", "refreshToken"];

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function writeSession(s: Session | null) {
  try {
    if (s) localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable — session lasts for this visit only
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(readSession());
    setReady(true);
  }, []);

  const save = useCallback((s: Session | null) => {
    writeSession(s);
    setSession(s);
  }, []);

  const requestOtp = useCallback(async (email: string) => {
    await apiFetch("/authentication/customer-login/", { method: "POST", body: JSON.stringify({ email }) });
  }, []);

  const verifyOtp = useCallback(
    async (email: string, otp: string) => {
      const body = await apiFetch<unknown>("/authentication/verify/otp/", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });
      const access = findToken(body, ACCESS_KEYS);
      if (!access) throw new Error("Login succeeded but no access token was returned.");
      save({ access, refresh: findToken(body, REFRESH_KEYS), email });
    },
    [save],
  );

  const logout = useCallback(() => save(null), [save]);

  const authFetch = useCallback(
    async <T,>(path: string, init: RequestInit = {}): Promise<T> => {
      const current = readSession();
      if (!current) throw new ApiError("Please log in to continue.", 401, null);
      try {
        return await apiFetch<T>(path, { ...init, token: current.access });
      } catch (err) {
        if (!(err instanceof ApiError) || err.status !== 401 || !current.refresh) {
          if (err instanceof ApiError && err.status === 401) save(null);
          throw err;
        }
        // Access token expired — refresh once and retry
        try {
          const body = await apiFetch<unknown>("/authentication/token-refresh/", {
            method: "POST",
            body: JSON.stringify({ refresh: current.refresh }),
          });
          const access = findToken(body, ACCESS_KEYS);
          if (!access) throw err;
          const next = { ...current, access, refresh: findToken(body, REFRESH_KEYS) ?? current.refresh };
          save(next);
          return await apiFetch<T>(path, { ...init, token: next.access });
        } catch {
          save(null);
          throw new ApiError("Your session expired. Please log in again.", 401, null);
        }
      }
    },
    [save],
  );

  const value = useMemo(
    () => ({ session, ready, requestOtp, verifyOtp, logout, authFetch }),
    [session, ready, requestOtp, verifyOtp, logout, authFetch],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
