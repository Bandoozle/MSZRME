"use client";

/**
 * DealerShell
 *
 * Renders the full dealer interface: sidebar + topbar + page content.
 *
 * Pages are lazy-loaded as they're navigated to. Each page component
 * receives the current `user`, `dark` flag, and any shared data it needs.
 *
 * ─────────────────────────────────────────────────────────────────
 * ARCHITECTURE NOTE FOR MARCO
 * ─────────────────────────────────────────────────────────────────
 * This shell is a direct structural port of the HTML prototype's
 * #app-container / #sidebar / #main layout. Each render* function
 * from the prototype maps 1-to-1 to a React component in components/dealer/.
 *
 * The page components currently render static/seed data. To connect
 * them to real data:
 *   - Replace imports from lib/data/* with useSWR hooks or server actions
 *   - The component props interfaces in lib/types.ts define what each page needs
 *
 * Multi-tenancy: the `user` object has the dealer's stage and tier.
 * Gate premium pages (market, seasonal) by checking user.tier >= 2.
 */

import { useState, Suspense, lazy, useEffect } from "react";
import type { AuthUser, DealerPage } from "@/lib/types";

// Lazy-load each page to keep initial bundle small
const Dashboard      = lazy(() => import("@/components/dealer/pages/Dashboard"));
const Market         = lazy(() => import("@/components/dealer/pages/Market"));
const Seasonal       = lazy(() => import("@/components/dealer/pages/Seasonal"));
const Messages       = lazy(() => import("@/components/dealer/pages/Messages"));
const LogNumbers     = lazy(() => import("@/components/dealer/pages/LogNumbers"));
const Goals          = lazy(() => import("@/components/dealer/pages/Goals"));
const Financials     = lazy(() => import("@/components/dealer/pages/Financials"));
const Calculator     = lazy(() => import("@/components/dealer/pages/Calculator"));
const Reports        = lazy(() => import("@/components/dealer/pages/Reports"));
const Notes          = lazy(() => import("@/components/dealer/pages/Notes"));
const Settings       = lazy(() => import("@/components/dealer/pages/Settings"));
const SalesTeam      = lazy(() => import("@/components/dealer/pages/SalesTeam"));
const PlaceholderPage = lazy(() => import("@/components/dealer/pages/PlaceholderPage"));

const NAV = [
  { section: "PERFORMANCE", items: [
    { id: "dashboard",   label: "Dashboard",       icon: "🏠" },
    { id: "lognumbers",  label: "Log Numbers",     icon: "📋" },
    { id: "goals",       label: "Goals",           icon: "✓"  },
    { id: "financials",  label: "Financials",      icon: "💵", tier: 2 },
    { id: "calculator",  label: "GM Calculator",   icon: "±"  },
  ]},
  { section: "INTELLIGENCE", items: [
    { id: "market",    label: "Market Pulse",    icon: "📊", tier: 2 },
    { id: "seasonal",  label: "Seasonal Planner",icon: "📅", tier: 2 },
    { id: "reports",   label: "Reports",         icon: "📄" },
  ]},
  { section: "COMMUNICATE", items: [
    { id: "messages",  label: "Messages",        icon: "💬" },
    { id: "notes",     label: "Notes/Checklists",icon: "📝" },
  ]},
  { section: "PREFERENCES", items: [
    { id: "settings",  label: "Settings",        icon: "⚙️" },
  ]},
] as const;

interface Props {
  user: AuthUser;
  page: DealerPage;
  onNav: (page: DealerPage) => void;
  onLogout: () => void;
  dark: boolean;
  onToggleTheme: () => void;
}

export function DealerShell({ user, page, onNav, onLogout, dark, onToggleTheme }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const feedWrap = document.getElementById("feed-wrap");
    if (feedWrap && page === "dashboard") feedWrap.innerHTML = "";
  }, [page]);

  const c = dark
    ? { sidebar: "#1C1C1E", sidebarBorder: "rgba(255,255,255,0.08)", label1: "rgba(255,255,255,0.92)", label2: "rgba(235,235,245,0.55)", active: "#0A84FF" }
    : { sidebar: "#F2F5F2", sidebarBorder: "rgba(0,0,0,0.06)",       label1: "#0A160A",                label2: "rgba(0,0,0,0.45)",        active: "#0088FF" };

  return (
    <div style={{ display: "flex", height: "100dvh", overflow: "hidden", background: dark ? "#000" : "#F2F2F7" }}>
      {/* ── SIDEBAR ── */}
      <div id="sidebar" style={{
        width: "240px", flexShrink: 0, display: "flex", flexDirection: "column",
        background: c.sidebar, borderRight: `0.5px solid ${c.sidebarBorder}`,
        overflowY: "auto", height: "100%",
      }}>
        {/* Search */}
        <div style={{ padding: "10px 12px 8px" }}>
          <div style={{ position: "relative" }}>
            <input placeholder="Search" style={{ width: "100%", height: "30px", fontSize: "13px", paddingLeft: "28px" }} />
            <svg style={{ position: "absolute", left: "9px", top: "50%", transform: "translateY(-50%)", width: "14px", height: "14px", opacity: 0.4 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>

        {/* Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 14px", borderBottom: `0.5px solid ${c.sidebarBorder}` }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#FF6B6B,#FF3B30)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px", fontWeight: 800, flexShrink: 0 }}>
            {user.initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: c.label1, letterSpacing: "-.01em" }}>{user.name}</div>
            <div style={{ fontSize: "11px", color: c.label2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.biz}</div>
          </div>
        </div>

        {/* Nav sections */}
        {NAV.map((section) => (
          <div key={section.section}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: c.label2, textTransform: "uppercase", letterSpacing: ".10em", padding: "14px 16px 6px" }}>
              {section.section}
            </div>
            {section.items.map((item) => {
              const isActive = page === item.id;
              const locked = "tier" in item && item.tier > user.tier;
              return (
                <button
                  key={item.id}
                  onClick={() => !locked && onNav(item.id as DealerPage)}
                  title={locked ? `Requires tier ${(item as { tier: number }).tier}` : undefined}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "0 12px", height: "36px", border: "none", cursor: locked ? "not-allowed" : "pointer",
                    background: isActive ? c.active : "transparent",
                    borderRadius: "10px", margin: "1px 6px", width: "calc(100% - 12px)",
                    color: isActive ? "white" : locked ? c.label2 : c.label1,
                    fontSize: "13px", fontWeight: isActive ? 700 : 500, textAlign: "left",
                    opacity: locked ? 0.4 : 1, fontFamily: "inherit",
                  }}
                >
                  <span style={{ fontSize: "15px", width: "20px", textAlign: "center" }}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}

        {/* Footer */}
        <div style={{ marginTop: "auto", padding: "12px 14px 16px", borderTop: `0.5px solid ${c.sidebarBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#00694A", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "10px", fontWeight: 800 }}>TJ</div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: c.label1 }}>Tom</div>
              <div style={{ fontSize: "10px", color: c.label2 }}>● Online · Your Coach</div>
            </div>
          </div>
          <div style={{ fontSize: "10px", color: c.label2 }}>Privacy · Terms · Support</div>
        </div>
      </div>

      {/* ── MAIN AREA ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <div style={{ height: "44px", display: "flex", alignItems: "center", padding: "0 16px", borderBottom: `0.5px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, background: dark ? "rgba(28,28,30,0.9)" : "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", gap: "10px", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: "4px" }}>
            {(["dashboard","financials","market","lognumbers","messages"] as DealerPage[]).map((p) => (
              <button key={p} onClick={() => onNav(p)} style={{ padding: "5px 10px", border: "none", background: page === p ? (dark ? "#636366" : "rgba(0,0,0,0.08)") : "transparent", borderRadius: "8px", fontSize: "11px", fontWeight: page === p ? 700 : 500, color: dark ? "rgba(235,235,245,0.8)" : "#0A160A", cursor: "pointer", fontFamily: "inherit" }}>
                {p === "dashboard" ? "🏠" : p === "financials" ? "💵" : p === "market" ? "📊" : p === "lognumbers" ? "📋" : "💬"}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center" }}>
            <button onClick={onToggleTheme} style={{ width: "34px", height: "34px", border: "none", background: "transparent", cursor: "pointer", fontSize: "16px" }}>
              {dark ? "☀️" : "🌙"}
            </button>
            <button onClick={onLogout} style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg,#FF6B6B,#FF3B30)", border: "none", cursor: "pointer", color: "white", fontSize: "11px", fontWeight: 800 }}>
              {user.initials}
            </button>
          </div>
        </div>

        {/* Page content — #feed-wrap is the prototype render target */}
        <div id="main" style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <div id="feed-wrap" />
          <Suspense fallback={<div style={{ padding: "40px", textAlign: "center", color: dark ? "rgba(235,235,245,0.4)" : "rgba(0,0,0,0.3)", fontSize: "13px" }}>Loading…</div>}>
            <PageRenderer page={page} user={user} dark={dark} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function PageRenderer({ page, user, dark }: { page: DealerPage; user: AuthUser; dark: boolean }) {
  switch (page) {
    case "dashboard":   return <Dashboard user={user} dark={dark} />;
    case "market":      return <Market />;
    case "seasonal":    return <Seasonal />;
    case "messages":    return <Messages />;
    case "lognumbers":  return <LogNumbers />;
    case "goals":       return <Goals />;
    case "financials":  return <Financials />;
    case "calculator":  return <Calculator />;
    case "reports":     return <Reports />;
    case "notes":       return <Notes />;
    case "settings":    return <Settings />;
    case "salesteam":   return <SalesTeam />;
    default:            return <PlaceholderPage page={page} dark={dark} />;
  }
}
