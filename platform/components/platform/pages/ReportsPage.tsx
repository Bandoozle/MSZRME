"use client";

import { useCallback, useState } from "react";
import type { KpiPeriod, Peer } from "@/lib/platform/data/kpi";
import { REPORT_CATALOG, REPORT_TITLES } from "@/lib/platform/data/reports";
import type { TierId } from "@/lib/platform/data/nav";
import { TIER_DEFS } from "@/lib/platform/data/nav";
import { openReport } from "@/lib/platform/utils/reports";

export interface ReportsPageProps {
  kpi?: KpiPeriod;
  peers?: Peer[];
  currentTier?: TierId;
  bizName?: string;
}

function ReportModalBody({
  idx,
  kpi,
  peers,
  currentTier,
  bizName,
}: {
  idx: number;
  kpi: KpiPeriod;
  peers: Peer[];
  currentTier: TierId;
  bizName: string;
}) {
  const gm = kpi.gm ?? 43;
  const svc = kpi.svc ?? kpi.sales;
  const youRank =
    [...peers].sort((a, b) => b.rev - a.rev).findIndex((p) => p.you) + 1;
  const avgRev = Math.round(
    peers.reduce((s, p) => s + p.rev, 0) / peers.length
  );
  const tier = TIER_DEFS[currentTier];

  const hrStyle = {
    border: "none",
    borderTop: "1px solid #EEF0EE",
    margin: "16px 0",
  } as const;

  const h2Style = { color: "#003D2B", margin: 0 } as const;
  const pMuted = { color: "#7A9A7A", margin: "4px 0 0" } as const;

  if (idx === 0) {
    const rows = [
      ["Total Revenue", "$" + Math.round((kpi.tsr + kpi.svr) / 1000) + "K"],
      ["Install Revenue", "$" + Math.round(kpi.tsr / 1000) + "K"],
      ["Service Revenue", "$" + Math.round(kpi.svr / 1000) + "K"],
      ["Gross Margin", gm + "%"],
      ["Closing Ratio", kpi.cr + "%"],
      ["Maintenance Agreements", String(kpi.mc)],
      ["Contracts Completed", String(svc)],
      ["Avg Ticket", "$" + kpi.ast],
    ];
    return (
      <>
        <h2 style={h2Style}>Monthly KPI Summary</h2>
        <p style={pMuted}>
          {bizName} · May 2026
        </p>
        <hr style={hrStyle} />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {rows.map(([label, val]) => (
              <tr
                key={label}
                style={{ borderBottom: "1px solid #EEF0EE" }}
              >
                <td
                  style={{
                    padding: "10px",
                    fontWeight: 600,
                    color: "#0A160A",
                  }}
                >
                  {label}
                </td>
                <td
                  style={{
                    padding: "10px",
                    textAlign: "right",
                    fontWeight: 800,
                    color: "#003D2B",
                  }}
                >
                  {val}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }

  if (idx === 1) {
    return (
      <>
        <h2 style={h2Style}>Market Position Report</h2>
        <p style={pMuted}>BC HVAC Market · May 2026</p>
        <hr style={hrStyle} />
        <p>
          <strong>Market Rank:</strong> #{youRank} of {peers.length} dealers in
          British Columbia
        </p>
        <p>
          <strong>Revenue:</strong> $452K — 16% above market average of $
          {Math.round(avgRev / 1000)}K
        </p>
        <p>
          <strong>Growth Rate:</strong> +14.8% — highest in peer group
        </p>
        {peers.slice(0, 5).map((p, i) => (
          <div
            key={p.biz}
            style={{
              padding: "8px 0",
              borderBottom: "1px solid #EEF0EE",
            }}
          >
            <strong>
              {i + 1}. {p.biz}
            </strong>{" "}
            — ${Math.round(p.rev / 1000)}K · {p.growth}% growth
          </div>
        ))}
      </>
    );
  }

  if (idx === 2) {
    return (
      <>
        <h2 style={h2Style}>Gross Margin Analysis</h2>
        <p style={pMuted}>Q2 2026</p>
        <hr style={hrStyle} />
        <p>
          <strong>Overall GM:</strong> {gm}% — Target 45%
        </p>
        <p>
          <strong>Equipment markup:</strong> Avg 42%
        </p>
        <p>
          <strong>Labour margin:</strong> Avg 58%
        </p>
        <p>
          <strong>Maintenance agreements:</strong> {kpi.mc} active
        </p>
        <div
          style={{
            background: "#F0F8F0",
            padding: "12px",
            borderRadius: "8px",
            marginTop: "16px",
          }}
        >
          <strong>Recommendation:</strong> A 2% GM improvement on current
          volume adds ~$18K annually.
        </div>
      </>
    );
  }

  return (
    <>
      <h2 style={h2Style}>Coaching Progress Report</h2>
      <p style={pMuted}>
        YTD 2026 · Tier {currentTier} — {tier.name}
      </p>
      <hr style={hrStyle} />
      <p>
        <strong>Coaching cadence:</strong> {tier.calls}
      </p>
      <p>
        <strong>Milestones completed:</strong> 2/4 toward Tier 2
      </p>
      <ul style={{ paddingLeft: "20px", margin: "8px 0" }}>
        {tier.milestones.map((m, i) => (
          <li key={m} style={{ margin: "6px 0" }}>
            {i < 2 ? "✅" : "⬜"} {m}
          </li>
        ))}
      </ul>
    </>
  );
}

export function ReportsPage({
  kpi,
  peers = [],
  currentTier = 2,
  bizName = "North Van HVAC Solutions",
}: ReportsPageProps) {
  const [modalIdx, setModalIdx] = useState<number | null>(null);

  const handleGenerate = useCallback(
    (idx: number) => {
      if (!kpi) return;
      const ctx = { kpi, peers, currentTier, bizName };
      if (!openReport(idx, ctx)) {
        setModalIdx(idx);
      }
    },
    [kpi, peers, currentTier, bizName]
  );

  if (!kpi) return null;

  return (
    <>
      <div style={{ padding: "4px 0 14px" }}>
        <div
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#0A160A",
            letterSpacing: "-.03em",
          }}
        >
          Reports
        </div>
        <div style={{ fontSize: "12px", color: "#7A9A7A", marginTop: "2px" }}>
          Generate and download performance reports
        </div>
      </div>

      {REPORT_CATALOG.map((item, idx) => (
        <div
          key={item.title}
          style={{
            background: "#FFFFFF",
            borderRadius: "14px",
            padding: "16px",
            marginBottom: "8px",
            boxShadow:
              "0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "linear-gradient(135deg,#003D2B,#00694A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              flexShrink: 0,
            }}
          >
            {item.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#0A160A",
              }}
            >
              {item.title}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#7A9A7A",
                marginTop: "2px",
              }}
            >
              {item.desc} · {item.period}
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleGenerate(idx)}
            style={{
              padding: "8px 14px",
              borderRadius: "20px",
              background: "rgba(0,105,74,0.08)",
              border: "1px solid rgba(0,105,74,0.2)",
              color: "#00694A",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              flexShrink: 0,
            }}
          >
            Generate
          </button>
        </div>
      ))}

      {modalIdx !== null ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setModalIdx(null)}
        >
          <div
            style={{
              background: "white",
              flex: 1,
              margin: "20px",
              borderRadius: "16px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              maxHeight: "calc(100vh - 40px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "14px 18px",
                borderBottom: "1px solid #EEF0EE",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#0A160A",
                }}
              >
                {REPORT_TITLES[modalIdx]}
              </div>
              <button
                type="button"
                onClick={() => setModalIdx(null)}
                style={{
                  background: "rgba(0,0,0,0.06)",
                  border: "none",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#4A6A50",
                }}
              >
                ×
              </button>
            </div>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
                fontFamily:
                  '-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro","Inter",sans-serif',
                fontSize: "14px",
                color: "#0A160A",
                lineHeight: 1.6,
              }}
            >
              <ReportModalBody
                idx={modalIdx}
                kpi={kpi}
                peers={peers}
                currentTier={currentTier}
                bizName={bizName}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ReportsPage;
