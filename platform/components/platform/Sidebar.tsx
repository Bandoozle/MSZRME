"use client";

import { useMemo, useState } from "react";
import {
  ALL_NAV_DEFS,
  NAV_LAYOUT,
  getAvailableNavItems,
  type DealerPageId,
  type StageId,
} from "@/lib/platform/data/nav";
import { NavSvgIcon } from "./NavSvgIcon";
import type { CoachInfo, StageInfo, UserProfile } from "./types";

const SECTION_MAP: { name: string; ids: DealerPageId[] }[] = [
  {
    name: "Performance",
    ids: ["dashboard", "lognumbers", "goals", "financials", "calculator"],
  },
  { name: "Intelligence", ids: ["market", "seasonal", "reports"] },
  { name: "Communicate", ids: ["messages", "notes", "salesteam"] },
  { name: "Preferences", ids: ["settings", "ev"] },
];

const MORE_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" width="21" height="21"><g transform="translate(-0.444,12.306) scale(0.018060,-0.018060)"><path d="M220 -14C284 -14 334 36 334 100C334 164 284 214 220 214C156 214 106 164 106 100C106 36 156 -14 220 -14ZM606 -14C670 -14 720 36 720 100C720 164 670 214 606 214C542 214 492 164 492 100C492 36 542 -14 606 -14ZM992 -14C1056 -14 1106 36 1106 100C1106 164 1056 214 992 214C928 214 878 164 878 100C878 36 928 -14 992 -14Z" fill="currentColor"/></g></svg>';

function NavChevron({ open }: { open: boolean }) {
  return (
    <svg
      className="nav-chev"
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        marginLeft: "auto",
        transition: "transform .15s",
        transform: `rotate(${open ? 90 : 0}deg)`,
      }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

interface NavButtonProps {
  pageId: DealerPageId;
  activePage: DealerPageId;
  isSub?: boolean;
  onNavigate: (page: DealerPageId) => void;
}

function NavButton({ pageId, activePage, isSub = false, onNavigate }: NavButtonProps) {
  const def = ALL_NAV_DEFS[pageId];
  if (!def) return null;

  const isActive = activePage === pageId;
  const className = [
    "nav-item",
    isActive ? "active" : "",
    isSub ? "nav-sub" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      id={`nav-${pageId}`}
      style={{ width: "100%", padding: 0 }}
      onClick={() => onNavigate(pageId)}
    >
      <NavSvgIcon svg={def.svg} />
      <span className="nav-lbl">{def.label}</span>
      {pageId === "messages" ? <span className="nav-badge">3</span> : null}
    </button>
  );
}

export interface SidebarProps {
  activePage: DealerPageId;
  onNavigate: (page: DealerPageId) => void;
  user: UserProfile;
  stage: StageInfo;
  stageId: StageId;
  tier: number;
  coach: CoachInfo;
  onShowStageModal?: () => void;
  onPrivacy?: () => void;
  onTerms?: () => void;
  onSupport?: () => void;
}

export function Sidebar({
  activePage,
  onNavigate,
  user,
  stage,
  stageId,
  tier,
  coach,
  onShowStageModal,
  onPrivacy,
  onTerms,
  onSupport,
}: SidebarProps) {
  const available = useMemo(
    () => getAvailableNavItems(stageId, tier),
    [stageId, tier],
  );

  const drawerItems = NAV_LAYOUT.drawer.filter((id) => available.includes(id));
  const activeIsInDrawer = drawerItems.includes(activePage);

  const [drawerOpen, setDrawerOpen] = useState(activeIsInDrawer);
  const [coachHover, setCoachHover] = useState(false);

  const rendered = new Set<DealerPageId>();

  return (
    <div id="sidebar">
      <div
        className="coach-bar"
        onClick={() => onNavigate("settings")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
          padding: "12px 14px",
          borderBottom: "0.5px solid rgba(60,60,67,0.20)",
          margin: 0,
          borderRadius: 0,
          background: "transparent",
          boxShadow: "none",
          cursor: "default",
        }}
      >
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            id="sb-avatar"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#FF6D00,#FF4444)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: 700,
              color: "white",
            }}
          >
            {user.initials}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#28C840",
              border: "1.5px solid rgba(250,250,250,0.9)",
            }}
          />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            id="sb-name"
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#1C1C1E",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              letterSpacing: "-0.008em",
            }}
          >
            {user.name}
          </div>
          <div
            id="sb-biz"
            style={{
              fontSize: "11px",
              color: "rgba(0,0,0,0.50)",
              marginTop: "1px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user.biz}
          </div>
        </div>
      </div>

      <div
        id="sidebar-nav-card"
        style={{
          background: "transparent",
          margin: 0,
          padding: "4px 8px",
          border: "none",
          borderRadius: 0,
          boxShadow: "none",
        }}
      >
        {SECTION_MAP.map((section) => {
          const sectionItems = section.ids.filter(
            (id) =>
              NAV_LAYOUT.primary.includes(id) && available.includes(id),
          );
          if (sectionItems.length === 0) return null;

          return (
            <div key={section.name}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "rgba(0,0,0,0.36)",
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                  padding: "10px 14px 2px",
                  lineHeight: 1,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                {section.name}
              </div>
              {sectionItems.map((pageId) => {
                rendered.add(pageId);
                return (
                  <NavButton
                    key={pageId}
                    pageId={pageId}
                    activePage={activePage}
                    onNavigate={onNavigate}
                  />
                );
              })}
            </div>
          );
        })}

        {NAV_LAYOUT.primary.map((pageId) => {
          if (rendered.has(pageId)) return null;
          if (!available.includes(pageId)) return null;
          return (
            <NavButton
              key={pageId}
              pageId={pageId}
              activePage={activePage}
              onNavigate={onNavigate}
            />
          );
        })}

        {drawerItems.length > 0 ? (
          <>
            <button
              type="button"
              className={`nav-item nav-drawer-trigger${activeIsInDrawer ? " active" : ""}`}
              style={{
                width: "100%",
                padding: 0,
                marginTop: "6px",
                borderTop: "1px solid rgba(0,180,120,0.08)",
                paddingTop: "8px",
              }}
              onClick={() => setDrawerOpen((open) => !open)}
            >
              <NavSvgIcon svg={MORE_ICON_SVG} />
              <span className="nav-lbl">More</span>
              <NavChevron open={drawerOpen} />
            </button>
            {drawerOpen
              ? drawerItems.map((pageId) => (
                  <NavButton
                    key={pageId}
                    pageId={pageId}
                    activePage={activePage}
                    isSub
                    onNavigate={onNavigate}
                  />
                ))
              : null}
          </>
        ) : null}
      </div>

      <div style={{ margin: "10px 8px 2px" }}>
        <div
          className="stage-pill"
          onClick={onShowStageModal}
          style={{
            cursor: "default",
            borderRadius: "10px",
            padding: "14px 14px 12px",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.60)",
              textTransform: "uppercase",
              letterSpacing: ".8px",
              marginBottom: "4px",
            }}
          >
            Current Stage
          </div>
          <div
            id="sb-stage-name"
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.022em",
              lineHeight: 1.1,
            }}
          >
            {stage.label}
          </div>
          <div
            id="sb-stage-rev"
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.65)",
              marginTop: "3px",
            }}
          >
            {stage.rev}
          </div>
          <div
            style={{
              marginTop: "10px",
              height: "4px",
              background: "rgba(255,255,255,0.22)",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              id="sb-stage-bar"
              style={{
                width: `${stage.barPercent}%`,
                height: "100%",
                background: stage.barColor,
                borderRadius: "2px",
              }}
            />
          </div>
          <div
            id="sb-stage-progress"
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.50)",
              marginTop: "5px",
            }}
          >
            {stage.progressText}
          </div>
        </div>
      </div>

      <div style={{ margin: "4px 8px 0" }}>
        <div
          onClick={() => onNavigate("messages")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            padding: "6px 10px",
            borderRadius: "8px",
            cursor: "default",
            transition: "background .12s",
            background: coachHover ? "rgba(0,0,0,0.06)" : "transparent",
          }}
          onMouseEnter={() => setCoachHover(true)}
          onMouseLeave={() => setCoachHover(false)}
        >
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background: "linear-gradient(135deg,#003D2B,#00B478)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "9px",
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
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#28C840",
                border: "1.5px solid rgba(250,250,250,0.95)",
              }}
            />
          </div>
          <div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "#1C1C1E",
                letterSpacing: "-0.008em",
              }}
            >
              {coach.name}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "rgba(0,0,0,0.40)",
                marginTop: "1px",
              }}
            >
              {coach.status}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "8px 14px 2px",
          fontSize: "11px",
          color: "rgba(0,0,0,0.30)",
          lineHeight: 1.8,
        }}
      >
        <span onClick={onPrivacy} style={{ color: "inherit", cursor: "default" }}>
          Privacy
        </span>{" "}
        ·{" "}
        <span onClick={onTerms} style={{ color: "inherit", cursor: "default" }}>
          Terms
        </span>{" "}
        ·{" "}
        <span onClick={onSupport} style={{ color: "inherit", cursor: "default" }}>
          Support
        </span>
      </div>
    </div>
  );
}
