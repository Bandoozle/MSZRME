"use client";

import { useState } from "react";
import type { KpiPeriodKey, KpiStore } from "@/lib/platform/data/kpi";
import type { DealerPageId } from "@/lib/platform/data/nav";

type FinPeriodKey = "Month" | "Year" | "PY";

interface FinHero {
  label: string;
  value: string;
  color: string;
  mt: string;
}

interface FinPeriodData {
  title: string;
  subtitle: string;
  heroes: FinHero[];
  pnl: [string, string, string, string, string, string][];
  cogs: [string, string, string][];
  compLabel: string;
  actualLabel: string;
}

const FIN_DATA: Record<FinPeriodKey, FinPeriodData> = {
  Month: {
    title: "Financials — May 2026",
    subtitle: "Single-month performance",
    heroes: [
      { label: "Net Sales", value: "$1.08M", color: "#1A4DB0", mt: "May actual" },
      { label: "Gross Margin", value: "40.5%", color: "#00694A", mt: "$436K" },
      { label: "EBITDA", value: "12.4%", color: "#00B478", mt: "$133K" },
      { label: "YOY Growth", value: "+16.4%", color: "#00B478", mt: "vs May 2025" },
    ],
    pnl: [
      ["Revenue", "$1,076,500", "100%", "—", "$924,400", "#1A4DB0"],
      ["Total COGS", "$640,247", "59.5%", "($9,802)", "$586,000", "#FF3B30"],
      ["Gross Margin", "$436,253", "40.5%", "+$2,806", "$338,400", "#00B478"],
      ["Total OPEX", "$302,676", "28.1%", "+$356", "$252,000", "#00B478"],
      ["EBITDA", "$133,577", "12.4%", "+$2,450", "$86,400", "#00B478"],
      ["Net Income", "$83,933", "7.8%", "+$1,650", "$51,000", "#1A4DB0"],
    ],
    cogs: [
      ["Materials", "$135,000", "12.5%"],
      ["Equipment", "$209,800", "19.5%"],
      ["Field Labour incl. Subs", "$186,600", "17.3%"],
      ["Subcontracts", "$27,420", "2.5%"],
      ["Commissions", "$75,700", "7.0%"],
      ["Financing Fees", "$1,330", "0.1%"],
      ["Other COGS", "$4,597", "0.4%"],
    ],
    compLabel: "May 2025",
    actualLabel: "Month Actual",
  },
  Year: {
    title: "Financials — YTD May 2026",
    subtitle: "Year-to-date performance",
    heroes: [
      { label: "Net Sales", value: "$5.38M", color: "#1A4DB0", mt: "↑ YTD" },
      { label: "Gross Margin", value: "40.5%", color: "#00694A", mt: "$2.18M" },
      { label: "EBITDA", value: "12.4%", color: "#00B478", mt: "$666K" },
      { label: "YOY Growth", value: "+20.5%", color: "#00B478", mt: "vs prior year" },
    ],
    pnl: [
      ["Revenue", "$5,382,500", "100%", "—", "$4,962,000", "#1A4DB0"],
      ["Total COGS", "$3,202,232", "59.5%", "($244,958)", "$3,154,000", "#FF3B30"],
      ["Gross Margin", "$2,180,268", "40.5%", "+$14,029", "$1,808,000", "#00B478"],
      ["Total OPEX", "$1,513,378", "28.1%", "+$1,780", "$1,248,000", "#00B478"],
      ["EBITDA", "$666,890", "12.4%", "+$12,249", "$560,000", "#00B478"],
      ["Net Income", "$421,665", "7.8%", "+$18,249", "$340,000", "#1A4DB0"],
    ],
    cogs: [
      ["Materials", "$675,000", "12.5%"],
      ["Equipment", "$1,049,000", "19.5%"],
      ["Field Labour incl. Subs", "$933,000", "17.3%"],
      ["Subcontracts", "$137,100", "2.5%"],
      ["Commissions", "$378,500", "7.0%"],
      ["Financing Fees", "$6,650", "0.1%"],
      ["Other COGS", "$22,982", "0.4%"],
    ],
    compLabel: "Prior Year YTD",
    actualLabel: "YTD Actual",
  },
  PY: {
    title: "Financials — 2025 (Prior Year)",
    subtitle: "Full prior-year actuals",
    heroes: [
      { label: "Net Sales", value: "$11.70M", color: "#1A4DB0", mt: "2025 actual" },
      { label: "Gross Margin", value: "37.0%", color: "#00694A", mt: "$4.33M" },
      { label: "EBITDA", value: "9.8%", color: "#00B478", mt: "$1.15M" },
      { label: "YOY Growth", value: "+12.4%", color: "#00B478", mt: "2025 vs 2024" },
    ],
    pnl: [
      ["Revenue", "$11,700,000", "100%", "—", "$10,407,000", "#1A4DB0"],
      ["Total COGS", "$7,371,000", "63.0%", "—", "$6,505,000", "#FF3B30"],
      ["Gross Margin", "$4,329,000", "37.0%", "—", "$3,902,000", "#00B478"],
      ["Total OPEX", "$3,182,000", "27.2%", "—", "$2,810,000", "#00B478"],
      ["EBITDA", "$1,147,000", "9.8%", "—", "$1,092,000", "#00B478"],
      ["Net Income", "$705,000", "6.0%", "—", "$640,000", "#1A4DB0"],
    ],
    cogs: [
      ["Materials", "$1,463,000", "12.5%"],
      ["Equipment", "$2,277,000", "19.5%"],
      ["Field Labour incl. Subs", "$2,025,000", "17.3%"],
      ["Subcontracts", "$297,500", "2.5%"],
      ["Commissions", "$821,500", "7.0%"],
      ["Financing Fees", "$14,450", "0.1%"],
      ["Other COGS", "$49,850", "0.4%"],
    ],
    compLabel: "2024 actual",
    actualLabel: "2025 Actual",
  },
};

const FIN_PERIODS: [FinPeriodKey, string][] = [
  ["Month", "Month"],
  ["Year", "Year (YTD)"],
  ["PY", "Prior Year"],
];

function favColor(fav: string): string {
  if (fav.startsWith("+")) return "#00B478";
  if (fav === "—") return "var(--ts)";
  return "#FF3B30";
}

export interface FinancialsPageProps {
  period: KpiPeriodKey;
  kpi: KpiStore;
  goTo: (page: DealerPageId) => void;
  showToast: (msg: string) => void;
}

export function FinancialsPage({
  goTo,
  showToast,
}: FinancialsPageProps) {
  const [finPeriod, setFinPeriod] = useState<FinPeriodKey>("Year");
  const fin = FIN_DATA[finPeriod];

  return (
    <>
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          boxShadow:
            "0 1px 0 rgba(0,0,0,0.04),0 2px 8px rgba(0,0,0,0.06)",
          padding: "5px",
          marginBottom: "10px",
          display: "flex",
          gap: "4px",
        }}
      >
        {FIN_PERIODS.map(([k, l]) => (
          <button
            key={k}
            type="button"
            onClick={() => setFinPeriod(k)}
            style={{
              flex: 1,
              padding: "9px 6px",
              borderRadius: "10px",
              border: "none",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              background: finPeriod === k ? "#00694A" : "transparent",
              color: finPeriod === k ? "white" : "#4A6A50",
              fontFamily: "inherit",
              transition: "all .15s",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="ch">
          <div
            className="cav"
            style={{
              background: "linear-gradient(145deg,#00694A,#003D2B)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00B478"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <div className="cauthor">{fin.title}</div>
            <div className="ctime">{fin.subtitle}</div>
          </div>
        </div>
        <div className="cb">
          <div className="mg mg-2" style={{ marginBottom: "12px" }}>
            {fin.heroes.map((h) => (
              <div key={h.label} className="mb">
                <div className="ml">{h.label}</div>
                <div className="mv" style={{ color: h.color, fontSize: "22px" }}>
                  {h.value}
                </div>
                <div className="mt up">{h.mt}</div>
              </div>
            ))}
          </div>
          {fin.pnl.map(([l, v, pct, fav, py, c]) => (
            <div
              key={l}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "9px 0",
                borderBottom: "0.5px solid rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  flex: 1,
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#0A160A",
                }}
              >
                {l}
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: c,
                  minWidth: "90px",
                }}
              >
                {v}
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontSize: "11px",
                  color: "#4A6A50",
                  minWidth: "48px",
                }}
              >
                {pct}
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: favColor(fav),
                  minWidth: "80px",
                }}
              >
                {fav}
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontSize: "11px",
                  color: "#4A6A50",
                  minWidth: "72px",
                }}
              >
                {py}
              </div>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
              color: "var(--tm)",
              marginTop: "6px",
              padding: "0 2px",
            }}
          >
            <span>{fin.actualLabel}</span>
            <span>%</span>
            <span>Fav/(Unfav)</span>
            <span>{fin.compLabel}</span>
          </div>
        </div>
        <div className="cdiv" />
        <div className="cacts">
          <button
            type="button"
            className="ca blue"
            onClick={() => goTo("lognumbers")}
          >
            Log Numbers
          </button>
          <button
            type="button"
            className="ca"
            onClick={() => showToast("PDF exported successfully")}
          >
            Export PDF
          </button>
          <button type="button" className="ca">
            Budgets
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: "20px" }}>
        <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "14px" }}>
          COGS Breakdown
        </div>
        {fin.cogs.map(([l, v, p]) => (
          <div
            key={l}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 0",
              borderBottom: "0.5px solid rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ flex: 1, fontSize: "13px", color: "#0A160A" }}>{l}</div>
            <div style={{ fontSize: "13px", fontWeight: 600 }}>{v}</div>
            <div
              style={{
                fontSize: "11px",
                color: "#4A6A50",
                width: "38px",
                textAlign: "right",
              }}
            >
              {p}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default FinancialsPage;
