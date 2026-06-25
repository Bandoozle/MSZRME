"use client";

import type { ReactNode } from "react";
import type { DealerPageId } from "@/lib/platform/data/nav";
import type { CoachInfo, UserProfile } from "./types";

const SHEET_NAV: {
  pageId: DealerPageId;
  label: string;
  iconBg: string;
  stroke: string;
  icon: ReactNode;
}[] = [
  {
    pageId: "dashboard",
    label: "Dashboard",
    iconBg: "rgba(0,105,74,0.08)",
    stroke: "#00694A",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00694A" strokeWidth="1.8" strokeLinecap="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    pageId: "goals",
    label: "Goals",
    iconBg: "rgba(0,105,74,0.08)",
    stroke: "#00694A",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00694A" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    pageId: "financials",
    label: "Financials",
    iconBg: "rgba(0,105,74,0.08)",
    stroke: "#00B478",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00B478" strokeWidth="1.8" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    pageId: "lognumbers",
    label: "Log Numbers",
    iconBg: "rgba(0,0,0,0.05)",
    stroke: "#2D4A32",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D4A32" strokeWidth="1.8" strokeLinecap="round">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="9" y1="7" x2="15" y2="7" />
        <line x1="9" y1="11" x2="15" y2="11" />
        <line x1="9" y1="15" x2="13" y2="15" />
      </svg>
    ),
  },
  {
    pageId: "market",
    label: "Market Pulse",
    iconBg: "rgba(27,45,79,0.08)",
    stroke: "#1B2D4F",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B2D4F" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    pageId: "seasonal",
    label: "Seasonal",
    iconBg: "rgba(0,180,120,0.1)",
    stroke: "#00694A",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00694A" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    pageId: "reports",
    label: "Reports",
    iconBg: "rgba(0,0,0,0.05)",
    stroke: "#2D4A32",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D4A32" strokeWidth="1.8" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    pageId: "calculator",
    label: "GM Calculator",
    iconBg: "rgba(0,0,0,0.05)",
    stroke: "#2D4A32",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D4A32" strokeWidth="1.8" strokeLinecap="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="10" x2="8" y2="10" />
        <line x1="12" y1="10" x2="12" y2="10" />
        <line x1="16" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="8" y2="14" />
        <line x1="12" y1="14" x2="12" y2="14" />
        <line x1="16" y1="14" x2="16" y2="14" />
      </svg>
    ),
  },
  {
    pageId: "settings",
    label: "Settings",
    iconBg: "rgba(0,0,0,0.05)",
    stroke: "#2D4A32",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D4A32" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
];

export interface MenuSheetProps {
  open: boolean;
  onClose: () => void;
  user: UserProfile;
  /** Short badge label (e.g. "Green") */
  stageBadge: string;
  /** Stage card title (e.g. "Green ●") */
  stageCardTitle: string;
  stageCardSummary: string;
  coach: CoachInfo;
  onNavigate: (page: DealerPageId) => void;
  onShowStageModal?: () => void;
}

export function MenuSheet({
  open,
  onClose,
  user,
  stageBadge,
  stageCardTitle,
  stageCardSummary,
  coach,
  onNavigate,
  onShowStageModal,
}: MenuSheetProps) {
  const sheetNav = (pageId: DealerPageId) => {
    onNavigate(pageId);
    onClose();
  };

  return (
    <>
      <div
        id="menu-sheet-overlay"
        onClick={onClose}
        style={{
          display: open ? "block" : "none",
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 700,
          backdropFilter: "blur(4px)",
        }}
      />

      <div
        id="menu-sheet"
        style={{
          display: open ? "block" : "none",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 800,
          background: "rgba(250,250,252,0.98)",
          backdropFilter: "blur(28px)",
          borderRadius: "24px 24px 0 0",
          boxShadow: "0 -4px 32px rgba(0,0,0,0.14)",
          maxHeight: "90vh",
          overflowY: "auto",
          paddingBottom: "env(safe-area-inset-bottom,16px)",
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform .34s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "10px 0 6px",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          <div
            style={{
              width: "36px",
              height: "4px",
              borderRadius: "2px",
              background: "rgba(0,0,0,0.15)",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "13px",
            padding: "10px 20px 14px",
            borderBottom: "0.5px solid rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#FF6D00,#FF4444)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 800,
              color: "white",
              flexShrink: 0,
              position: "relative",
            }}
          >
            {user.initials}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#34C759",
                border: "2px solid white",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#0A160A",
                letterSpacing: "-.02em",
              }}
            >
              {user.name}
            </div>
            <div style={{ fontSize: "12px", color: "#7A9A7A", marginTop: "1px" }}>
              {user.biz}
            </div>
          </div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              background: "rgba(0,105,74,0.08)",
              color: "#00694A",
              padding: "4px 11px",
              borderRadius: "20px",
            }}
          >
            {stageBadge}
          </div>
        </div>

        <div
          style={{
            padding: "14px 16px 10px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
          }}
        >
          {SHEET_NAV.map((item) => (
            <button
              key={item.pageId}
              type="button"
              className="sheet-nav-btn"
              onClick={() => sheetNav(item.pageId)}
            >
              <div className="sheet-nav-icon" style={{ background: item.iconBg }}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div style={{ padding: "0 16px 8px" }}>
          <div
            onClick={() => {
              onShowStageModal?.();
              onClose();
            }}
            style={{
              background: "#00694A",
              borderRadius: "16px",
              padding: "14px 16px",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(149,213,178,0.15)",
              }}
            />
            <div
              style={{
                fontSize: "9px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
                letterSpacing: ".8px",
                marginBottom: "3px",
              }}
            >
              Current Stage
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: "white",
                letterSpacing: "-.04em",
              }}
            >
              {stageCardTitle}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.5)",
                marginTop: "2px",
              }}
            >
              {stageCardSummary}
            </div>
          </div>
        </div>

        <div style={{ padding: "0 16px 16px" }}>
          <div
            onClick={() => sheetNav("messages")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 14px",
              background: "rgba(255,255,255,0.42)",
              backdropFilter: "saturate(180%) blur(24px)",
              WebkitBackdropFilter: "saturate(180%) blur(24px)",
              borderRadius: "16px",
              cursor: "pointer",
              boxShadow:
                "0 0.5px 0 rgba(255,255,255,0.5) inset, 0 0 0 0.5px rgba(255,255,255,0.18)",
            }}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#00694A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "white",
                }}
              >
                {coach.initials}
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "11px",
                  height: "11px",
                  borderRadius: "50%",
                  background: "#34C759",
                  border: "2px solid #F0F3F0",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#0A160A" }}>
                {coach.name} — Your Coach
              </div>
              <div style={{ fontSize: "12px", color: "#7A9A7A" }}>{coach.status}</div>
            </div>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7A9A7A"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
