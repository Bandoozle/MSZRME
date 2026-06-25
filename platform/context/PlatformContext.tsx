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

export type UserRole = "dealer" | "admin" | "new";

export interface SessionUser {
  email: string;
  role: UserRole;
  name: string;
  biz: string;
  initials: string;
  tier: number;
  stage: string;
}

interface PlatformContextValue {
  user: SessionUser | null;
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
  login: (email: string, password: string) => boolean;
  logout: () => void;
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

function mapUser(email: string): SessionUser | null {
  const u = USERS[email];
  if (!u) return null;
  const yearRev = DEFAULT_KPI.Year.tsr;
  return {
    email,
    role: u.role,
    name: u.name,
    biz: email === "john@northvanhvac.ca" ? "North Vancouver HVAC" : "Your Business",
    initials: initials(u.name),
    tier: 1,
    stage: getStage(yearRev),
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
  const [ready, setReady] = useState(false);
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

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("mszrme_session");
      if (raw) {
        const parsed = JSON.parse(raw) as SessionUser;
        if (parsed?.email) setUser(parsed);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", dark);
  }, [dark]);

  useEffect(() => {
    if (!ready) return;
    const fromPath = pageFromPath(pathname ?? "/");
    setPage(fromPath);
  }, [pathname, ready]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const key = email.trim().toLowerCase();
    const u = USERS[key];
    if (!u || u.pw !== password) return false;
    const session = mapUser(key);
    if (!session) return false;
    setUser(session);
    try {
      sessionStorage.setItem("mszrme_session", JSON.stringify(session));
    } catch {
      /* ignore */
    }
    setPage("dashboard");
    setInsight(INSIGHTS.Day);
    router.replace("/dashboard");
    return true;
  }, [fromWebsite, router]);

  const logout = useCallback(() => {
    setUser(null);
    setPage("dashboard");
    try {
      sessionStorage.removeItem("mszrme_session");
    } catch {
      /* ignore */
    }
  }, []);

  const goTo = useCallback((p: DealerPageId) => {
    setPage(p);
    setNotifOpen(false);
    setMenuOpen(false);
    setSidebarOpen(false);
    router.push(pathForPage(p));
  }, [router]);

  const setPeriod = useCallback((p: KpiPeriodKey) => {
    setPeriodState(p);
    setInsight(INSIGHTS[p]);
  }, []);

  const value = useMemo<PlatformContextValue>(
    () => ({
      user,
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
    }),
    [
      user,
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
    ]
  );

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform(): PlatformContextValue {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform must be used within PlatformProvider");
  return ctx;
}
