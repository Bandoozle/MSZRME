"use client";

import type { ReactNode } from "react";
import { useAdmin } from "./AdminContext";
import type { AdminPageId } from "./types";

const NAV: { section: string; items: { id: AdminPageId; label: string; badge?: string | number }[] }[] = [
  {
    section: "Overview",
    items: [
      { id: "overview", label: "Dashboard" },
      { id: "analytics", label: "Analytics" },
    ],
  },
  {
    section: "Customers",
    items: [
      { id: "accounts", label: "Accounts" },
      { id: "support", label: "Support Chat", badge: 3 },
      { id: "comms", label: "Communications" },
    ],
  },
  {
    section: "Revenue",
    items: [
      { id: "billing", label: "Billing & MRR" },
      { id: "financials-admin", label: "Financials & AI" },
      { id: "invoices", label: "Invoices" },
    ],
  },
  {
    section: "Content",
    items: [
      { id: "inputs", label: "Marketing Inputs" },
      { id: "config", label: "Feature Flags" },
    ],
  },
  {
    section: "System",
    items: [
      { id: "system", label: "System Health" },
      { id: "logs", label: "Audit Logs" },
    ],
  },
];

function NavIcon({ id }: { id: AdminPageId }) {
  const paths: Partial<Record<AdminPageId, ReactNode>> = {
    overview: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </>
    ),
    analytics: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    accounts: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    support: (
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    ),
    comms: (
      <>
        <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3z" />
        <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
      </>
    ),
    billing: (
      <>
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </>
    ),
    "financials-admin": (
      <>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </>
    ),
    invoices: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </>
    ),
    inputs: (
      <>
        <path d="M3 3v18h18" />
        <path d="M7 16l4-7 4 5 4-9" />
      </>
    ),
    config: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </>
    ),
    system: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </>
    ),
    logs: (
      <>
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </>
    ),
  };
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {paths[id]}
    </svg>
  );
}

export function AdminSidebar() {
  const { page, setPage, accounts, closeSidebar, sidebarOpen } = useAdmin();

  return (
    <>
      <div
        id="adm-sidebar-overlay"
        className={sidebarOpen ? "open" : undefined}
        onClick={closeSidebar}
      />
      <div
        className={`adm-sidebar${sidebarOpen ? " adm-open" : ""}`}
        id="adm-sidebar-panel"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 10px 6px",
            borderBottom: "1px solid rgba(0,0,0,0.07)",
            marginBottom: "4px",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#0A160A" }}>
            Menu
          </div>
          <button
            type="button"
            onClick={closeSidebar}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(0,0,0,0.06)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              color: "#4A6A50",
            }}
          >
            ×
          </button>
        </div>
        {NAV.map((group) => (
          <div key={group.section}>
            <div className="adm-sec">{group.section}</div>
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`adm-nav${page === item.id ? " active" : ""}`}
                id={`admn-${item.id}`}
                onClick={() => setPage(item.id)}
              >
                <NavIcon id={item.id} />
                {item.label}
                {item.id === "accounts" ? (
                  <span className="adm-badge">{accounts.length}</span>
                ) : item.badge ? (
                  <span className="adm-badge" id="adm-support-badge">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        ))}
        <div
          style={{
            padding: "16px 10px 0",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            marginTop: "16px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.2)",
              fontFamily: "monospace",
            }}
          >
            v2.1.0-admin
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.2)",
              marginTop: "1px",
            }}
          >
            sarah.admin · active
          </div>
        </div>
      </div>
    </>
  );
}
