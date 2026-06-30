"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { KPI as DEFAULT_KPI, USERS, type KpiPeriodKey, type KpiStore } from "@/lib/platform/data/kpi";
import type { DealerPageId } from "@/lib/platform/data/nav";
import { getStage } from "@/lib/platform/utils/format";
import { isWebsiteReferral, WEBSITE_URL } from "@/lib/urls";
import { createClient } from "@/lib/supabase/client";
import { ensureProfile, persistOnboarding, profileToSessionUser, type OnboardingData } from "@/lib/auth/profile";
import { homePathForUser, isOnboardingPath } from "@/lib/platform/routing";

export type UserRole = "dealer" | "admin";

export type LoginResult = { ok: true } | { ok: false; message: string };

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  biz: string;
  initials: string;
  tier: number;
  stage: string;
  firstTime: boolean;
}

interface PlatformContextValue {
  user: SessionUser | null;
  authReady: boolean;
  dark: boolean;
  page: DealerPageId;
  period: KpiPeriodKey;
  kpi: KpiStore;
  insight: string;
  toast: string | null;
  notifOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  stageModalOpen: boolean;
  sidebarOpen: boolean;
  fromWebsite: boolean;
  signedUp: boolean;
  initialEmail: string;
  websiteUrl: string;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  goTo: (page: DealerPageId) => void;
  setPeriod: (p: KpiPeriodKey) => void;
  toggleTheme: () => void;
  toggleNotifs: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openMenuSheet: () => void;
  closeMenuSheet: () => void;
  openStageModal: () => void;
  closeStageModal: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  showToast: (msg: string) => void;
  setInsight: (text: string) => void;
  completeOnboarding: (data: OnboardingData) => Promise<boolean>;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

const DEALER_PAGES: DealerPageId[] = [
  "dashboard",
  "goals",
  "lognumbers",
  "calculator",
  "financials",
  "reports",
  "market",
  "seasonal",
  "messages",
  "ev",
  "salesteam",
  "notes",
  "settings",
];

function pageFromPath(pathname: string): DealerPageId {
  const segment = pathname.replace(/^\//, "").split("/")[0];
  if (segment === "" || segment === "login") return "dashboard";
  if (segment === "admin") return "dashboard";
  if (DEALER_PAGES.includes(segment as DealerPageId)) {
    return segment as DealerPageId;
  }
  return "dashboard";
}

function pathForPage(page: DealerPageId): string {
  if (page === "dashboard") return "/dashboard";
  return `/${page}`;
}

const INSIGHTS: Record<KpiPeriodKey, string> = {
  Day: "You've closed 2 jobs today — tracking 238% above daily target. Strong day..",
  Week: "Strong week. 9 closed sales and your closing ratio held above 50% for the seventh consecutive week.",
  Month: "May is tracking near target. Service revenue is the standout — 48 maintenance calls is a personal record.",
  YTD: "You're 87% to your YTD goal through May. Gross profit is healthy — close the service agreement gap with Dealer A.",
  Year: "On track for $3.275M — $225K short of the $3.5M target. Q4 historically runs strong. You're in great shape.",
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function mapDemoUser(email: string): SessionUser | null {
  const u = USERS[email];
  if (!u) return null;
  const yearRev = DEFAULT_KPI.Year.tsr;
  return {
    id: `demo-${email}`,
    email,
    role: u.role,
    name: u.name,
    biz: email === "john@northvanhvac.ca" ? "North Vancouver HVAC" : "Your Business",
    initials: initials(u.name),
    tier: 1,
    stage: getStage(yearRev),
    firstTime: Boolean(u.firstTime),
  };
}

export function PlatformProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fromWebsite = isWebsiteReferral(searchParams.get("from"));
  const signedUp = searchParams.get("signedup") === "1";
  const initialEmail = searchParams.get("email") ?? "";

  const [user, setUser] = useState<SessionUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState<DealerPageId>("dashboard");
  const [period, setPeriodState] = useState<KpiPeriodKey>("Day");
  const [kpi] = useState<KpiStore>(DEFAULT_KPI);
  const [insight, setInsight] = useState(INSIGHTS.Day);
  const [toast, setToast] = useState<string | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadSessionUser = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setAuthReady(true);
      return;
    }

    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      setUser(null);
      setAuthReady(true);
      return;
    }

    const profile = await ensureProfile(supabase, authUser.id);
    if (profile) {
      setUser(profileToSessionUser(profile));
    } else {
      setUser(null);
    }
    setAuthReady(true);
  }, []);

  useEffect(() => {
    void loadSessionUser();

    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
        return;
      }
      void ensureProfile(supabase, session.user.id).then((profile) => {
        if (profile) setUser(profileToSessionUser(profile));
      });
    });

    return () => subscription.unsubscribe();
  }, [loadSessionUser]);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", dark);
  }, [dark]);

  useEffect(() => {
    if (!authReady) return;
    const fromPath = pageFromPath(pathname ?? "/");
    setPage(fromPath);
  }, [pathname, authReady]);

  useEffect(() => {
    if (!authReady || !user) return;
    if (user.role === "admin") return;

    const onOnboarding = isOnboardingPath(pathname);
    if (user.firstTime && !onOnboarding) {
      router.replace("/onboarding");
      return;
    }
    if (!user.firstTime && onOnboarding) {
      router.replace("/dashboard");
    }
  }, [authReady, user, pathname, router]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      const key = email.trim().toLowerCase();

      if (!isSupabaseConfigured()) {
        const u = USERS[key];
        if (!u || u.pw !== password) {
          return { ok: false, message: "Invalid email or password." };
        }
        const session = mapDemoUser(key);
        if (!session) {
          return { ok: false, message: "Invalid email or password." };
        }
        setUser(session);
        setPage("dashboard");
        setInsight(INSIGHTS.Day);
        router.replace(homePathForUser(session));
        return { ok: true };
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: key,
        password,
      });

      if (error || !data.user) {
        const message =
          error?.message === "Invalid login credentials"
            ? "Invalid email or password."
            : (error?.message ?? "Could not sign in. Try again.");
        return { ok: false, message };
      }

      const profile = await ensureProfile(supabase, data.user.id);
      if (!profile) {
        await supabase.auth.signOut();
        return {
          ok: false,
          message: "Could not load your account. Try again or contact support.",
        };
      }

      const session = profileToSessionUser(profile);
      setUser(session);
      setPage("dashboard");
      setInsight(INSIGHTS.Day);
      router.replace(homePathForUser(session));
      return { ok: true };
    },
    [router]
  );

  const completeOnboarding = useCallback(
    async (data: OnboardingData): Promise<boolean> => {
      if (!user) return false;

      if (!isSupabaseConfigured()) {
        const updated: SessionUser = {
          ...user,
          name: data.displayName,
          biz: data.businessName,
          initials: initials(data.displayName),
          stage: getStage(data.annualRevenue),
          firstTime: false,
        };
        setUser(updated);
        router.replace("/dashboard");
        return true;
      }

      const supabase = createClient();
      const profile = await persistOnboarding(supabase, user.id, data);
      if (!profile) return false;

      const session = profileToSessionUser(profile);
      setUser(session);
      router.replace("/dashboard");
      return true;
    },
    [router, user]
  );

  const logout = useCallback(async () => {
    setUser(null);
    setPage("dashboard");

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }

    router.replace("/login");
  }, [router]);

  const goTo = useCallback(
    (p: DealerPageId) => {
      setPage(p);
      setNotifOpen(false);
      setMenuOpen(false);
      setSidebarOpen(false);
      router.push(pathForPage(p));
    },
    [router]
  );

  const setPeriod = useCallback((p: KpiPeriodKey) => {
    setPeriodState(p);
    setInsight(INSIGHTS[p]);
  }, []);

  const value = useMemo<PlatformContextValue>(
    () => ({
      user,
      authReady,
      dark,
      page,
      period,
      kpi,
      insight,
      toast,
      notifOpen,
      searchOpen,
      menuOpen,
      stageModalOpen,
      sidebarOpen,
      fromWebsite,
      signedUp,
      initialEmail,
      websiteUrl: WEBSITE_URL,
      login,
      logout,
      goTo,
      setPeriod,
      toggleTheme: () => setDark((d) => !d),
      toggleNotifs: () => setNotifOpen((o) => !o),
      openSearch: () => setSearchOpen(true),
      closeSearch: () => setSearchOpen(false),
      openMenuSheet: () => setMenuOpen(true),
      closeMenuSheet: () => setMenuOpen(false),
      openStageModal: () => setStageModalOpen(true),
      closeStageModal: () => setStageModalOpen(false),
      openSidebar: () => setSidebarOpen(true),
      closeSidebar: () => setSidebarOpen(false),
      showToast,
      setInsight,
      completeOnboarding,
    }),
    [
      user,
      authReady,
      dark,
      page,
      period,
      kpi,
      insight,
      toast,
      notifOpen,
      searchOpen,
      menuOpen,
      stageModalOpen,
      sidebarOpen,
      fromWebsite,
      signedUp,
      initialEmail,
      login,
      logout,
      goTo,
      setPeriod,
      showToast,
      completeOnboarding,
    ]
  );

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform(): PlatformContextValue {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform must be used within PlatformProvider");
  return ctx;
}
