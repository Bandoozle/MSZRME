"use client";

/**
 * AdminShell
 *
 * Port of the admin app tree from the HTML prototype.
 * The full admin interface is ~3,000 lines in the prototype.
 *
 * TODO for Marco:
 *  - Port each admNav page into components/admin/pages/
 *  - The admin CSS lives in styles/globals.css under .adm-* selectors
 *  - ADM_ACCOUNTS is in lib/data/accounts.ts — connect to your database
 */

import type { AuthUser, AdminPage } from "@/lib/types";
import { ADM_ACCOUNTS } from "@/lib/data";

const ADMIN_NAV: { id: AdminPage; label: string; icon: string }[] = [
  { id: "overview",         label: "Overview",       icon: "📊" },
  { id: "accounts",         label: "Accounts",       icon: "👥" },
  { id: "analytics",        label: "Analytics",      icon: "📈" },
  { id: "billing",          label: "Billing",        icon: "💳" },
  { id: "invoices",         label: "Invoices",       icon: "🧾" },
  { id: "comms",            label: "Communications", icon: "💬" },
  { id: "config",           label: "Config / Flags", icon: "🚩" },
  { id: "financials-admin", label: "Financials",     icon: "💵" },
  { id: "inputs",           label: "Inputs",         icon: "📥" },
  { id: "logs",             label: "Logs",           icon: "📋" },
  { id: "support",          label: "Support",        icon: "🎧" },
  { id: "system",           label: "System",         icon: "⚙️" },
];

interface Props {
  user: AuthUser;
  page: AdminPage;
  onNav: (page: AdminPage) => void;
  onLogout: () => void;
  dark: boolean;
  onToggleTheme: () => void;
}

export function AdminShell({ user, page, onNav, onLogout, dark, onToggleTheme }: Props) {
  const c = dark
    ? { bg: "#000", sidebar: "#0A140A", t1: "rgba(255,255,255,0.92)", t2: "rgba(235,235,245,0.55)", active: "#00B478", border: "rgba(0,180,120,0.18)" }
    : { bg: "#F2F2F7", sidebar: "#FAFBFA", t1: "#0A160A", t2: "rgba(0,0,0,0.45)", active: "#00694A", border: "rgba(0,0,0,0.06)" };

  return (
    <div id="admin-app" style={{ display: "flex", height: "100dvh", background: c.bg }}>
      {/* Sidebar */}
      <div style={{ width: "200px", flexShrink: 0, background: c.sidebar, borderRight: `1px solid ${c.border}`, display: "flex", flexDirection: "column", padding: "12px 8px", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 8px 16px", borderBottom: `1px solid ${c.border}`, marginBottom: "8px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg,#003D2B,#00B478)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 22 22" fill="none"><polygon points="11,2 20,8 20,14 11,20 2,14 2,8" stroke="white" strokeWidth="1.5" fill="none" opacity="0.8"/><circle cx="11" cy="11" r="3" fill="white"/></svg>
          </div>
          <div style={{ fontSize: "13px", fontWeight: 800, color: c.t1 }}>MSZRME Admin</div>
        </div>

        {ADMIN_NAV.map((item) => (
          <button key={item.id} onClick={() => onNav(item.id)} style={{
            display: "flex", alignItems: "center", gap: "8px", padding: "7px 10px",
            borderRadius: "8px", border: "none", cursor: "pointer", fontFamily: "inherit",
            background: page === item.id ? `${c.active}18` : "transparent",
            color: page === item.id ? c.active : c.t2,
            fontWeight: page === item.id ? 700 : 400, fontSize: "12px", textAlign: "left", marginBottom: "1px",
          }}>
            <span>{item.icon}</span>{item.label}
            {item.id === "accounts" && (
              <span style={{ marginLeft: "auto", fontSize: "10px", fontWeight: 700, background: c.active, color: "white", padding: "1px 6px", borderRadius: "10px" }}>
                {ADM_ACCOUNTS.length}
              </span>
            )}
          </button>
        ))}

        <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: `1px solid ${c.border}` }}>
          <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 10px", borderRadius: "8px", border: "none", cursor: "pointer", fontFamily: "inherit", background: "transparent", color: "#FF453A", fontSize: "12px", width: "100%" }}>
            ← Sign out
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
        <AdminPageRenderer page={page} dark={dark} />
      </div>
    </div>
  );
}

function AdminPageRenderer({ page, dark }: { page: AdminPage; dark: boolean }) {
  const c = dark
    ? { bg: "#1C1C1E", t1: "rgba(255,255,255,0.92)", t2: "rgba(235,235,245,0.5)", border: "rgba(255,255,255,0.09)", green: "#30D158" }
    : { bg: "#FFFFFF",  t1: "#0A160A",               t2: "rgba(60,60,67,0.5)",    border: "rgba(0,0,0,0.06)",       green: "#00694A" };

  if (page === "overview") {
    return (
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: c.t1, marginBottom: "20px", letterSpacing: "-.03em" }}>Overview</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginBottom: "20px" }}>
          {[
            { label: "Monthly Recurring Revenue", value: `$${ADM_ACCOUNTS.reduce((s,a) => s+a.mrr, 0).toLocaleString()}`, color: c.green },
            { label: "Active Accounts", value: `${ADM_ACCOUNTS.filter(a=>a.status==="Active").length} / ${ADM_ACCOUNTS.length}`, color: c.green },
            { label: "At Risk",         value: `${ADM_ACCOUNTS.filter(a=>a.status==="At Risk").length}`,  color: "#FF453A" },
            { label: "New / Trial",     value: `${ADM_ACCOUNTS.filter(a=>a.status==="New").length}`,      color: "#FF9F0A" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: c.bg, borderRadius: "14px", padding: "16px", boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: "10px", color: c.t2, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "8px" }}>{stat.label}</div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: stat.color, letterSpacing: "-.04em" }}>{stat.value}</div>
            </div>
          ))}
        </div>
        <div style={{ background: c.bg, borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: `0.5px solid ${c.border}`, fontSize: "12px", fontWeight: 700, color: c.t2, textTransform: "uppercase", letterSpacing: ".08em" }}>Dealer Accounts</div>
          {ADM_ACCOUNTS.map((acct) => (
            <div key={acct.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderBottom: `0.5px solid ${c.border}` }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#003D2B,#00B478)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "11px", fontWeight: 800, flexShrink: 0 }}>
                {acct.name.split(" ").map(w=>w[0]).slice(0,2).join("")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: c.t1 }}>{acct.name}</div>
                <div style={{ fontSize: "11px", color: c.t2 }}>{acct.email}</div>
              </div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: acct.status === "Active" ? c.green : acct.status === "At Risk" ? "#FF453A" : "#FF9F0A" }}>{acct.status}</div>
              <div style={{ fontSize: "11px", color: c.t2, minWidth: "70px", textAlign: "right" }}>
                {acct.mrr > 0 ? `$${acct.mrr.toLocaleString()}/mo` : "Trial"}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // All other admin pages — placeholder for porting
  const label = ADMIN_NAV.find(n=>n.id===page)?.label ?? page;
  return (
    <div style={{ background: c.bg, borderRadius: "18px", padding: "40px 32px", textAlign: "center", border: `1px dashed ${c.border}` }}>
      <div style={{ fontSize: "32px", marginBottom: "14px" }}>🚧</div>
      <div style={{ fontSize: "18px", fontWeight: 700, color: c.t1, marginBottom: "8px" }}>{label}</div>
      <div style={{ fontSize: "13px", color: c.t2, maxWidth: "380px", margin: "0 auto" }}>
        Port <code style={{ fontFamily: "monospace", fontSize: "12px" }}>admRender{label.replace(/\s/g, "")}()</code> from the HTML prototype to{" "}
        <code style={{ fontFamily: "monospace", fontSize: "12px" }}>components/admin/pages/{label.replace(/\s/g, "")}.tsx</code>.
      </div>
    </div>
  );
}
