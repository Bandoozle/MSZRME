"use client";
import { useState, useCallback, useEffect } from "react";
import type { AuthUser, UserRole } from "@/lib/types";
import { DEMO_ACCOUNTS, ADM_ACCOUNTS } from "@/lib/data";

const SESSION_KEY = "mszrme_session";

function readSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function writeSession(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else sessionStorage.removeItem(SESSION_KEY);
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(readSession());
    setReady(true);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const match = DEMO_ACCOUNTS.find(
      (a) => a.email === normalizedEmail && a.password === password
    );
    if (!match) {
      setError("Incorrect email or password.");
      return false;
    }

    const acct = ADM_ACCOUNTS.find((a) => a.email === normalizedEmail);
    const role: UserRole = match.role;

    const nameMap: Record<string, string> = {
      "john@northvanhvac.ca": "John Smith",
      "admin@mszrme.com": "Admin",
      "new@hvacdealer.ca": "New Dealer",
    };

    const nextUser: AuthUser = {
      email: normalizedEmail,
      role,
      name: nameMap[normalizedEmail] ?? normalizedEmail.split("@")[0],
      biz: acct?.biz ?? "MSZRME",
      initials: (nameMap[normalizedEmail] ?? "ND")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      stage: acct?.stage ?? "orange",
      tier: acct?.tier ?? 0,
    };
    setUser(nextUser);
    writeSession(nextUser);
    setError("");
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    writeSession(null);
  }, []);

  return { user, error, login, logout, ready };
}
