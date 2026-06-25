"use client";

import type { DealerPageId } from "@/lib/platform/data/nav";
import type { StageProgressInfo } from "./types";

export interface RightSidebarProps {
  activePage: DealerPageId;
  aiInsight: string;
  stageProgress?: StageProgressInfo;
}

export function RightSidebar({
  activePage,
  aiInsight,
  stageProgress,
}: RightSidebarProps) {
  const showPerfBlock = activePage === "dashboard";

  return (
    <div id="right">
      <div className="ai-card">
        <div
          style={{
            fontSize: "9px",
            fontWeight: 700,
            color: "rgba(255,255,255,0.65)",
            textTransform: "uppercase",
            letterSpacing: ".8px",
            marginBottom: "8px",
          }}
        >
          <svg
            width="14"
            height="7"
            viewBox="0 0 56 24"
            fill="none"
            style={{ marginRight: "5px", verticalAlign: "middle" }}
          >
            <path
              d="M2 12 C6 4,16 1,28 12 C40 1,50 4,54 12 C50 20,40 23,28 12 C16 23,6 20,2 12Z"
              fill="#00694A"
            />
          </svg>
          Insight
        </div>
        <div
          style={{ fontSize: "13px", color: "white", lineHeight: 1.65 }}
          id="ai-right"
        >
          {aiInsight}
        </div>
      </div>

      <div
        id="rs-perf-block"
        style={{ display: showPerfBlock ? undefined : "none" }}
      >
        <div className="rs-sec">
          <div className="rs-title">Stage Progress</div>
          <div
            id="rs-stage"
            style={{
              background: "rgba(255,255,255,0.42)",
              backdropFilter: "saturate(180%) blur(24px)",
              WebkitBackdropFilter: "saturate(180%) blur(24px)",
              borderRadius: "14px",
              padding: "14px",
              boxShadow:
                "0 0.5px 0 rgba(255,255,255,0.5) inset, 0 0 0 0.5px rgba(255,255,255,0.18)",
            }}
          >
            {stageProgress ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#4A6A50",
                    marginBottom: "5px",
                  }}
                >
                  <span style={{ color: stageProgress.currentColor }}>
                    {stageProgress.currentLabel}
                  </span>
                  {stageProgress.nextLabel ? (
                    <span style={{ color: stageProgress.nextColor }}>
                      {stageProgress.nextLabel}
                      {stageProgress.nextRev
                        ? ` (${stageProgress.nextRev})`
                        : ""}
                    </span>
                  ) : null}
                </div>
                <div className="pw">
                  <div
                    className="pf"
                    style={{
                      background: `linear-gradient(90deg,${stageProgress.currentColor}88,${stageProgress.currentColor})`,
                      width: `${stageProgress.percent}%`,
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#4A6A50",
                    marginTop: "4px",
                  }}
                >
                  {stageProgress.footerText}
                </div>
              </>
            ) : (
              <div style={{ fontSize: "11px", color: "#4A6A50" }}>
                Loading stage progress...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
