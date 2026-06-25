"use client";

import type { ReactNode } from "react";
import type { DealerPageId, StageId } from "@/lib/platform/data/nav";
import { MobileNavigation } from "./MobileNavigation";
import { MenuSheet } from "./MenuSheet";
import { RightSidebar } from "./RightSidebar";
import { Sidebar } from "./Sidebar";
import { TopNavigation } from "./TopNavigation";
import type {
  CoachInfo,
  StageInfo,
  StageProgressInfo,
  UserProfile,
} from "./types";

export interface AppShellProps {
  children: ReactNode;
  activePage: DealerPageId;
  onNavigate: (page: DealerPageId) => void;
  user: UserProfile;
  stage: StageInfo;
  stageId: StageId;
  tier: number;
  coach: CoachInfo;
  aiInsight: string;
  stageProgress?: StageProgressInfo;
  searchQuery?: string;
  onSearchFocus?: () => void;
  onSearchChange?: (value: string) => void;
  onToggleNotifs?: () => void;
  notifsOpen?: boolean;
  notifList?: ReactNode;
  onToggleTheme?: () => void;
  sidebarOpen?: boolean;
  onCloseSidebar?: () => void;
  menuSheetOpen?: boolean;
  onOpenMenuSheet?: () => void;
  onCloseMenuSheet?: () => void;
  onShowStageModal?: () => void;
  stageModalOpen?: boolean;
  onCloseStageModal?: () => void;
  stageModalLabel?: string;
  stageModalRev?: string;
  stageModalDotColor?: string;
  stageListBody?: ReactNode;
  searchOverlayOpen?: boolean;
  onCloseSearch?: () => void;
  onSearchOverlayInput?: (value: string) => void;
  searchResults?: ReactNode;
  onPrivacy?: () => void;
  onTerms?: () => void;
  onSupport?: () => void;
  messageBadge?: number;
}

export function AppShell({
  children,
  activePage,
  onNavigate,
  user,
  stage,
  stageId,
  tier,
  coach,
  aiInsight,
  stageProgress,
  searchQuery,
  onSearchFocus,
  onSearchChange,
  onToggleNotifs,
  notifsOpen = false,
  notifList,
  onToggleTheme,
  sidebarOpen = false,
  onCloseSidebar,
  menuSheetOpen = false,
  onOpenMenuSheet,
  onCloseMenuSheet,
  onShowStageModal,
  stageModalOpen = false,
  onCloseStageModal,
  stageModalLabel = "Green",
  stageModalRev = "$2.4M – $5M",
  stageModalDotColor = "#00B478",
  stageListBody,
  searchOverlayOpen = false,
  onCloseSearch,
  onSearchOverlayInput,
  searchResults,
  onPrivacy,
  onTerms,
  onSupport,
  messageBadge = 3,
}: AppShellProps) {
  return (
    <div id="dealer-app">
      <TopNavigation
        activePage={activePage}
        onNavigate={onNavigate}
        onSearchFocus={onSearchFocus}
        onSearchChange={onSearchChange}
        searchQuery={searchQuery}
        onToggleNotifs={onToggleNotifs}
        notifsOpen={notifsOpen}
        onToggleTheme={onToggleTheme}
        userInitials={user.initials}
        onAvatarClick={() => onNavigate("settings")}
      />

      <div className={`notif-panel${notifsOpen ? " open" : ""}`} id="notifPanel">
        <div id="notifList">{notifList}</div>
      </div>

      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        user={user}
        stage={stage}
        stageId={stageId}
        tier={tier}
        coach={coach}
        onShowStageModal={onShowStageModal}
        onPrivacy={onPrivacy}
        onTerms={onTerms}
        onSupport={onSupport}
      />

      <div
        id="sidebar-overlay"
        onClick={onCloseSidebar}
        className={sidebarOpen ? "open" : undefined}
        style={{
          display: sidebarOpen ? "block" : "none",
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          zIndex: 500,
          backdropFilter: "blur(2px)",
        }}
      />

      <MobileNavigation
        activePage={activePage}
        onNavigate={onNavigate}
        onOpenMenuSheet={onOpenMenuSheet}
        messageBadge={messageBadge}
      />

      <MenuSheet
        open={menuSheetOpen}
        onClose={() => onCloseMenuSheet?.()}
        user={user}
        stageBadge={stage.label.replace(" ●", "")}
        stageCardTitle={stage.label}
        stageCardSummary={`${stage.rev.replace(" tier", "")} · ${stage.progressText}`}
        coach={coach}
        onNavigate={onNavigate}
        onShowStageModal={onShowStageModal}
      />

      <div id="main">
        <div id="feed-wrap" className="feed">
          {children}
        </div>
      </div>

      <RightSidebar
        activePage={activePage}
        aiInsight={aiInsight}
        stageProgress={stageProgress}
      />

      <div
        className={`overlay${stageModalOpen ? " open" : ""}`}
        id="stageModal"
        onClick={(e) => {
          if (e.target === e.currentTarget) onCloseStageModal?.();
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            width: "92%",
            maxWidth: "420px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(0,105,74,0.07)",
                borderRadius: "20px",
                padding: "8px 16px",
                cursor: "pointer",
              }}
              onClick={onCloseStageModal}
            >
              <div
                id="stage-modal-dot"
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: stageModalDotColor,
                }}
              />
              <div>
                <div
                  id="stage-modal-label"
                  style={{
                    fontSize: "14px",
                    fontWeight: 800,
                    color: "#00694A",
                  }}
                >
                  {stageModalLabel}
                </div>
                <div
                  id="stage-modal-rev"
                  style={{
                    fontSize: "11px",
                    color: "#4CAF50",
                    marginTop: "-1px",
                  }}
                >
                  {stageModalRev}
                </div>
              </div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00B478"
                strokeWidth="2.5"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </div>
          </div>
          <div style={{ padding: "0 20px 14px" }}>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                color: "#0A160A",
              }}
            >
              Client Stage System
            </div>
            <div style={{ fontSize: "13px", color: "#4A6A50", marginTop: "3px" }}>
              Colour stage based on annual revenue
            </div>
          </div>
          <div style={{ height: "1px", background: "#F0F3F0" }} />
          <div
            id="stage-list-body"
            style={{ maxHeight: "520px", overflowY: "auto" }}
          >
            {stageListBody}
          </div>
          <div style={{ padding: "14px 20px", borderTop: "1px solid #F2F5F2" }}>
            <button
              type="button"
              onClick={onCloseStageModal}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                background: "#F0F3F0",
                border: "none",
                fontSize: "14px",
                fontWeight: 700,
                color: "#4A6A50",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <div
        className={`overlay${searchOverlayOpen ? " open" : ""}`}
        id="searchOverlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) onCloseSearch?.();
        }}
      >
        <div className="overlay-panel">
          <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "14px" }}>
            Search MSZRME
          </div>
          <input
            className="lf-input"
            id="searchOverlayInput"
            placeholder="Search pages, metrics, dealers..."
            onChange={(e) => onSearchOverlayInput?.(e.target.value)}
            style={{ marginBottom: "12px", fontSize: "14px" }}
          />
          <div id="searchResults">{searchResults}</div>
        </div>
      </div>
    </div>
  );
}
