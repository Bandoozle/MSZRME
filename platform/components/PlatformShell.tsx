"use client";

/**
 * PlatformShell
 *
 * Top-level client component. Owns:
 *  - Authentication state (useAuth)
 *  - Theme state (useTheme)
 *  - Active page / navigation
 *
 * Renders one of three trees:
 *  1. <LoginScreen>       — unauthenticated
 *  2. <DealerShell>       — dealer or new-account role
 *  3. <AdminShell>        — admin role
 *
 * ─────────────────────────────────────────────────────────────────
 * HOW TO EXTEND
 * ─────────────────────────────────────────────────────────────────
 * 1. Add a new dealer page:
 *    - Create components/dealer/YourPage.tsx
 *    - Add the slug to DealerPage in lib/types.ts
 *    - Add a case in DealerShell's <PageRenderer>
 *    - Add a nav item in components/ui/Sidebar.tsx
 *
 * 2. Wire real auth:
 *    - Replace useAuth with a real session provider (NextAuth, Supabase)
 *    - Remove DEMO_ACCOUNTS from lib/data/accounts.ts
 *
 * 3. Wire real data:
 *    - Replace lib/data/*.ts with API calls (SWR, React Query, server components)
 *    - KPI, Peers, and MarketingInputs are the first things to make dynamic
 */

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useTheme } from "@/lib/hooks/useTheme";
import { isWebsiteReferral } from "@/lib/urls";
import type { DealerPage, AdminPage } from "@/lib/types";

import { LoginScreen } from "@/components/ui/LoginScreen";
import { DealerShell } from "@/components/dealer/DealerShell";
import { AdminShell } from "@/components/admin/AdminShell";
import { PrototypeScripts } from "@/components/PrototypeScripts";

interface Props {
  entry?: "home" | "login";
}

export function PlatformShell({ entry = "home" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, error, login, logout, ready } = useAuth();
  const { dark, toggle: toggleTheme } = useTheme();

  const [dealerPage, setDealerPage] = useState<DealerPage>("dashboard");
  const [adminPage, setAdminPage] = useState<AdminPage>("overview");

  const fromWebsite = isWebsiteReferral(searchParams.get("from"));
  const initialEmail = searchParams.get("email") ?? "";
  const signedUp = searchParams.get("signedup") === "1";

  useEffect(() => {
    if (!user) return;
    if (entry === "login") router.replace("/");
  }, [user, entry, router]);

  const handleLogin = useCallback(
    (email: string, password: string) => login(email, password),
    [login]
  );

  if (!ready) {
    return (
      <div
        className={dark ? "dark-mode" : ""}
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--wallpaper, #E8E0D8)",
        }}
      />
    );
  }

  if (!user) {
    return (
      <div className={dark ? "dark-mode" : ""}>
        <LoginScreen
          onLogin={handleLogin}
          error={error}
          fromWebsite={fromWebsite}
          signedUp={signedUp}
          initialEmail={initialEmail}
        />
      </div>
    );
  }

  return (
    <div className={dark ? "dark-mode" : ""} style={{ height: "100dvh", overflow: "hidden" }}>
      <PrototypeScripts />
      {user.role === "admin" ? (
        <AdminShell
          user={user}
          page={adminPage}
          onNav={setAdminPage}
          onLogout={logout}
          dark={dark}
          onToggleTheme={toggleTheme}
        />
      ) : (
        <DealerShell
          user={user}
          page={dealerPage}
          onNav={setDealerPage}
          onLogout={logout}
          dark={dark}
          onToggleTheme={toggleTheme}
        />
      )}
    </div>
  );
}
