"use client";

import { useAdmin } from "./AdminContext";
import { AdminDetailBody } from "./AdminDetailBody";
import type { DetailTabId } from "./types";

const TABS: { id: DetailTabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "edit", label: "Edit" },
  { id: "calls", label: "Calls" },
  { id: "tier", label: "Tier" },
  { id: "security", label: "Security" },
  { id: "billing", label: "Billing" },
  { id: "data", label: "KPI Data" },
  { id: "activity", label: "Activity" },
];

export function AdminDetailPanel() {
  const {
    detailAccount,
    detailTab,
    detailOpen,
    setDetailTab,
    closeDetail,
    showDealerExit,
    onExitAdmin,
    showToast,
    addAuditLog,
  } = useAdmin();

  const impersonate = () => {
    if (!detailAccount) return;
    showToast(`Viewing as ${detailAccount.name}`, "success");
    addAuditLog(
      "sarah.admin",
      "IMPERSONATE",
      `Viewing dealer app as ${detailAccount.id} — ${detailAccount.name}`
    );
    closeDetail();
    onExitAdmin?.();
  };

  return (
    <div id="adm-detail-panel" className={detailOpen ? "open" : undefined}>
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid var(--abdr)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          background: "var(--as)",
          zIndex: 1,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(0,180,120,0.15)",
        }}
      >
        <div id="adm-detail-title" style={{ fontSize: "14px", fontWeight: 700, color: "var(--atp)" }}>
          {detailAccount?.name ?? "Account Detail"}
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {detailAccount && showDealerExit ? (
            <button
              type="button"
              id="adm-impersonate-btn"
              onClick={impersonate}
              style={{
                padding: "5px 12px",
                borderRadius: "20px",
                border: "1px solid rgba(74,127,212,0.3)",
                background: "rgba(26,77,176,0.1)",
                color: "#4A7FD4",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
              }}
            >
              View as Dealer
            </button>
          ) : null}
          <button
            type="button"
            onClick={closeDetail}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "1px solid var(--abdr)",
              background: "none",
              color: "var(--ats)",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>
      </div>
      {detailAccount ? (
        <>
          <div
            id="adm-detail-tabs"
            style={{
              display: "flex",
              gap: 0,
              padding: "0 18px",
              borderBottom: "1px solid var(--abdr)",
              overflowX: "auto",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
              flexShrink: 0,
            }}
          >
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setDetailTab(id)}
                style={{
                  padding: "10px 14px",
                  border: "none",
                  background: "none",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                  transition: "all .15s",
                  flexShrink: 0,
                  borderBottom: `2px solid ${detailTab === id ? "#00694A" : "transparent"}`,
                  color: detailTab === id ? "#00694A" : "var(--ats)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div id="adm-detail-body" style={{ padding: "18px 20px", overflowY: "auto" }}>
            <AdminDetailBody account={detailAccount} tab={detailTab} />
          </div>
        </>
      ) : null}
    </div>
  );
}
