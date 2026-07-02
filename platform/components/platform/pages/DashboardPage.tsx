"use client";

import { GaugeCard } from "@/components/platform/GaugeCard";
import type { KpiPeriod, KpiPeriodKey } from "@/lib/platform/data/kpi";
import {
  fm,
  isServiceEnabled,
  type ServiceFeatureFlag,
} from "@/lib/platform/utils/format";

const PERIODS: KpiPeriodKey[] = ["Day", "Week", "Month", "YTD", "Year"];
const MN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

const EMPTY_UNLOCK = [
  ["📈", "Live performance gauges with goal-vs-actual tracking"],
  ["🎯", "Monthly goal progress synced from your daily logs"],
  ["💡", "AI insights highlighting wins and opportunities"],
  ["📅", "Seasonal demand forecast tied to your local weather and rebates"],
] as const;

export interface DashboardPageProps {
  period: KpiPeriodKey;
  onPeriodChange: (period: KpiPeriodKey) => void;
  onNavigate: (pageId: string) => void;
  kpi: KpiPeriod;
  onExportPdf?: () => void;
  featureFlags?: ServiceFeatureFlag[];
}

export function DashboardPage({
  period,
  onPeriodChange,
  onNavigate,
  kpi: d,
  onExportPdf,
  featureFlags,
}: DashboardPageProps) {
  const isBlank =
    !d.tsr && !d.svr && !d.leads && !d.sales && !d.mc && !d.dc;

  if (isBlank) {
    return (
      <div
        style={{
          maxWidth: "560px",
          margin: "60px auto",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <div style={{ fontSize: "56px", marginBottom: "14px" }}>📊</div>
        <div
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: "#0A160A",
            letterSpacing: "-.02em",
            marginBottom: "8px",
          }}
        >
          Your dashboard is ready
        </div>
        <div
          style={{
            fontSize: "14px",
            color: "#4A6A50",
            lineHeight: 1.6,
            marginBottom: "26px",
          }}
        >
          Log your first daily or weekly numbers and your KPI gauges, goal
          progress, and AI insights will come to life. It takes about two
          minutes.
        </div>
        <button
          type="button"
          onClick={() => onNavigate("lognumbers")}
          style={{
            padding: "14px 28px",
            background: "linear-gradient(135deg,#003D2B,#00B478)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            letterSpacing: ".02em",
            boxShadow: "0 4px 16px rgba(0,105,74,0.25)",
          }}
        >
          Log your first numbers →
        </button>
        <div
          style={{
            marginTop: "30px",
            padding: "18px 22px",
            background: "white",
            borderRadius: "14px",
            border: "1px solid rgba(0,180,120,0.15)",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 800,
              color: "#00694A",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            What you&apos;ll unlock
          </div>
          {EMPTY_UNLOCK.map(([icon, text]) => (
            <div
              key={text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px 0",
                fontSize: "13px",
                color: "#0A160A",
              }}
            >
              <span style={{ fontSize: "18px" }}>{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const pct = d.tgt > 0 ? Math.min((d.tsr / d.tgt) * 100, 100) : 0;
  const chartValues = d.chart.filter((v): v is number => v != null && v > 0);
  const max = chartValues.length > 0 ? Math.max(...chartValues) : 1;
  const totalRev = d.tsr + d.svr;
  const goalPct =
    d.tgt > 0 ? Math.round((totalRev / d.tgt) * 100) : 0;
  const goalReached = totalRev >= d.tgt;
  const progressWidth =
    d.tgt > 0 ? Math.min((totalRev / d.tgt) * 100, 100) : 0;
  const serviceOn = isServiceEnabled(featureFlags);

  const installGauges = [
    {
      label: "Install Rev vs Target",
      val: `${Math.min(Math.round((d.ir / (d.tgt * 0.6)) * 100), 999)}%`,
      sub: `On ${fm(d.ir)}`,
      pct: Math.min(d.ir / (d.tgt * 0.6), 1),
      warn: d.ir / (d.tgt * 0.6) < 0.5,
      pal: "blue" as const,
    },
    {
      label: "Closing Ratio",
      val: `${d.cr.toFixed(1)}%`,
      sub: `On ${d.est || 0} estimates`,
      pct: Math.min(d.cr / 100, 1),
      warn: d.cr < 40,
      pal: "green" as const,
    },
    {
      label: "Avg Ticket",
      val: fm(d.ast),
      sub: "Target $8.5K",
      pct: Math.min(d.ast / 8500, 1),
      warn: d.ast < 5000,
      pal: "green" as const,
    },
  ];

  const serviceGauges = [
    {
      label: "Service Revenue",
      val: fm(d.svr),
      sub: `Of ${fm(d.tgt * 0.15)} tgt`,
      pct: Math.min(d.svr / (d.tgt * 0.15), 1),
      warn: d.svr / (d.tgt * 0.15) < 0.5,
      pal: "blue" as const,
    },
    {
      label: "Maintenance Agmt",
      val: String(d.mc),
      sub: `of ${d.mc + 8} target`,
      pct: Math.min(d.mc / (d.mc + 8), 0.92),
      warn: d.mc < 4,
      pal: "green" as const,
    },
    {
      label: "Demand Service",
      val: String(d.dc),
      sub: `Avg ${fm(d.adc)} each`,
      pct: Math.min(d.dc / 15, 0.95),
      warn: d.dc < 3,
      pal: "silver" as const,
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "8px 0 14px",
          gap: "12px",
        }}
      >
        <h1 className="ios-large-title" style={{ padding: 0 }}>
          Dashboard
        </h1>
        <button
          type="button"
          className="ios-btn ios-btn-md ios-btn-glass"
          onClick={() => onExportPdf?.()}
          style={{ color: "var(--label-1)", fontWeight: 500 }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <polyline points="9 15 12 12 15 15" />
          </svg>
          Export PDF
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(145deg,#003D2B 0%,#00694A 60%,#00B478 100%)",
            borderRadius: "22px",
            position: "relative",
            overflow: "hidden",
            boxShadow:
              "0 0.5px 0 rgba(255,255,255,0.20) inset, 0 4px 14px rgba(0,80,55,0.22), 0 18px 44px rgba(0,80,55,0.18)",
            padding: "24px 22px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "148px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-30px",
              right: "-30px",
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(149,213,178,0.25) 0%,transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-20px",
              left: "-20px",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(255,255,255,0.06) 0%,transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.65)",
                textTransform: "uppercase",
                letterSpacing: ".8px",
                marginBottom: "8px",
              }}
            >
              Total Revenue
            </div>
            <div
              style={{
                fontSize: "40px",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "white",
                lineHeight: 1,
              }}
            >
              {fm(totalRev)}
            </div>
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.6)",
              marginTop: "8px",
            }}
          >
            {d.tgt > 0
              ? `${((totalRev / d.tgt) * 100).toFixed(1)}% of target · `
              : ""}
            {period}
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "22px",
            padding: "22px 20px",
            boxShadow:
              "0 0.5px 0 rgba(255,255,255,0.9) inset, 0 0 0 0.5px rgba(0,0,0,0.04), 0 4px 14px rgba(0,0,0,0.05), 0 18px 40px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                fontWeight: 700,
                color: "#4A6A50",
                textTransform: "uppercase",
                letterSpacing: ".8px",
              }}
            >
              Progress to Goal
            </div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#4A6A50" }}>
              Target{" "}
              <strong style={{ color: "#0A160A" }}>{fm(d.tgt)}</strong>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                fontWeight: 800,
                letterSpacing: "-0.05em",
                color: "#00694A",
                lineHeight: 1,
              }}
            >
              {d.tgt > 0 ? `${goalPct}%` : "—"}
            </div>
            {goalReached ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#00694A",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Goal reached
              </div>
            ) : (
              <div style={{ fontSize: "13px", color: "#4A6A50" }}>
                {fm(d.tgt - totalRev)} to go
              </div>
            )}
          </div>
          <div
            style={{
              height: "10px",
              background: "rgba(0,105,74,0.1)",
              borderRadius: "5px",
              overflow: "hidden",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progressWidth}%`,
                background: "linear-gradient(90deg,#003D2B,#00B478)",
                borderRadius: "5px",
                transition: "width .6s ease",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "#4A6A50",
            }}
          >
            <span>$0</span>
            <span style={{ fontWeight: 700, color: "#00694A" }}>
              {d.tgt > 0
                ? `${((totalRev / d.tgt) * 100).toFixed(1)}% complete`
                : ""}
            </span>
            <span>{fm(d.tgt)}</span>
          </div>
        </div>
      </div>

      <div
        className="apl-cluster"
        style={{
          borderRadius: "18px",
          marginBottom: "18px",
          padding: "20px 18px 18px",
          background: "var(--apl-cluster-bg)",
          boxShadow: "var(--apl-cluster-shadow)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--apl-cluster-title)",
            }}
          >
            Performance
          </div>
          <div className="apl-seg">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                className={`period-btn${period === p ? " is-active" : ""}`}
                onClick={() => onPeriodChange(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--apl-section-lbl)",
            letterSpacing: "-0.01em",
            marginBottom: "12px",
          }}
        >
          Install
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,minmax(0,1fr))",
            gap: "14px",
            marginBottom: "20px",
          }}
        >
          {installGauges.map((g) => (
            <GaugeCard key={g.label} {...g} />
          ))}
        </div>

        {serviceOn ? (
          <>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--apl-section-lbl)",
                letterSpacing: "-0.01em",
                marginBottom: "12px",
              }}
            >
              Service
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,minmax(0,1fr))",
                gap: "14px",
              }}
            >
              {serviceGauges.map((g) => (
                <GaugeCard key={g.label} {...g} />
              ))}
            </div>
          </>
        ) : null}

        <div
          style={{
            marginTop: "18px",
            paddingTop: "14px",
            borderTop: "0.5px solid var(--apl-cluster-sep)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#30D158",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                color: "var(--apl-legend-fg)",
                letterSpacing: "-0.01em",
              }}
            >
              Live · updates with period
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#30D158",
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--apl-legend-fg)",
                  letterSpacing: "-0.01em",
                }}
              >
                On target
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#FF453A",
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--apl-legend-fg)",
                  letterSpacing: "-0.01em",
                }}
              >
                Below
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="ios-section-hdr">Performance summary</div>
      <div className="ios-group" style={{ margin: "0 0 24px", borderRadius: "14px" }}>
        <div
          className="ios-row"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate("lognumbers")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onNavigate("lognumbers");
          }}
        >
          <div className="ios-row-icon tint-brand">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <div className="ios-row-content">
            <div className="ios-row-title">Sales Revenue</div>
            <div className="ios-row-subtitle">
              {period} · {pct.toFixed(0)}% of goal
            </div>
          </div>
          <div
            className="ios-row-content"
            style={{ alignItems: "flex-end", flex: 0 }}
          >
            <div
              className="ios-row-detail"
              style={{ fontWeight: 600, color: "var(--label-1)" }}
            >
              {fm(d.tsr)}
            </div>
            <div className="ios-metric-trend up" style={{ marginTop: 0 }}>
              ↑ on pace
            </div>
          </div>
          <div className="ios-row-chevron">
            <svg
              viewBox="0 0 7 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="1,1 6,6 1,11" />
            </svg>
          </div>
        </div>
        <div
          className="ios-row"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate("reports")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onNavigate("reports");
          }}
        >
          <div className="ios-row-icon tint-green">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div className="ios-row-content">
            <div className="ios-row-title">Closing Ratio</div>
            <div className="ios-row-subtitle">Top 22% of dealers</div>
          </div>
          <div
            className="ios-row-detail"
            style={{ color: "var(--sys-green)", fontWeight: 600 }}
          >
            {d.cr.toFixed(1)}%
          </div>
          <div className="ios-row-chevron">
            <svg
              viewBox="0 0 7 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="1,1 6,6 1,11" />
            </svg>
          </div>
        </div>
        <div
          className="ios-row"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate("reports")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onNavigate("reports");
          }}
        >
          <div className="ios-row-icon tint-orange">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="6" x2="12" y2="12" />
              <line x1="12" y1="12" x2="16" y2="14" />
            </svg>
          </div>
          <div className="ios-row-content">
            <div className="ios-row-title">Average Ticket</div>
            <div className="ios-row-subtitle">+12% vs trailing 90 days</div>
          </div>
          <div className="ios-row-detail" style={{ fontWeight: 600 }}>
            ${(d.ast / 1000).toFixed(1)}K
          </div>
          <div className="ios-row-chevron">
            <svg
              viewBox="0 0 7 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="1,1 6,6 1,11" />
            </svg>
          </div>
        </div>
      </div>

      <div className="ios-section-hdr">Revenue trend · {period}</div>
      <div
        className="ios-group"
        style={{ margin: "0 0 24px", borderRadius: "14px", padding: "16px 16px 18px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "14px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--label-2)",
                letterSpacing: "-.005em",
              }}
            >
              Total revenue
            </div>
            <div
              style={{
                fontSize: "34px",
                fontWeight: 700,
                letterSpacing: "-.037em",
                color: "var(--label-1)",
                lineHeight: 1.1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {fm(totalRev)}
            </div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color:
                  totalRev >= d.tgt ? "var(--sys-green)" : "var(--label-2)",
                marginTop: "2px",
              }}
            >
              {d.tgt > 0
                ? `${Math.round((totalRev / d.tgt) * 100)}% of target`
                : "Set a target in Goals"}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "6px",
            height: "60px",
          }}
        >
          {d.chart.map((v, i) => (
            <div
              key={MN[i]}
              title={v ? fm(v) : `${MN[i]} upcoming`}
              style={{
                flex: 1,
                borderRadius: "4px 4px 2px 2px",
                background: v
                  ? "linear-gradient(180deg,#00B478,#00694A)"
                  : "rgba(0,0,0,0.06)",
                height: v ? `${Math.round((v / max) * 100)}%` : "8%",
                transition: "height .6s var(--ease)",
                position: "relative",
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "8px",
            fontSize: "11px",
            color: "var(--label-3)",
            letterSpacing: ".02em",
          }}
        >
          {d.chart.map((_, i) => (
            <span key={MN[i]} style={{ flex: 1, textAlign: "center" }}>
              {MN[i]}
            </span>
          ))}
        </div>
      </div>

      <div className="ios-section-hdr">Sales pipeline</div>
      <div className="ios-group" style={{ margin: "0 0 24px", borderRadius: "14px" }}>
        <div
          className="ios-row"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate("lognumbers")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onNavigate("lognumbers");
          }}
        >
          <div className="ios-row-icon tint-blue">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="ios-row-content">
            <div className="ios-row-title">Leads</div>
            <div className="ios-row-subtitle">New opportunities</div>
          </div>
          <div className="ios-row-detail" style={{ fontWeight: 600 }}>
            {d.leads}
          </div>
        </div>
        <div
          className="ios-row"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate("lognumbers")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onNavigate("lognumbers");
          }}
        >
          <div className="ios-row-icon tint-indigo">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="ios-row-content">
            <div className="ios-row-title">Estimates</div>
            <div className="ios-row-subtitle">
              {d.est > 0
                ? `${((d.est / d.leads) * 100).toFixed(0)}% lead conversion`
                : "No estimates yet"}
            </div>
          </div>
          <div className="ios-row-detail" style={{ fontWeight: 600 }}>
            {d.est}
          </div>
        </div>
        <div
          className="ios-row"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate("lognumbers")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onNavigate("lognumbers");
          }}
        >
          <div className="ios-row-icon tint-green">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="ios-row-content">
            <div className="ios-row-title">Closed Sales</div>
            <div className="ios-row-subtitle">
              {d.cr.toFixed(1)}% closing ratio
            </div>
          </div>
          <div
            className="ios-row-detail"
            style={{ color: "var(--sys-green)", fontWeight: 600 }}
          >
            {d.sales}
          </div>
        </div>
      </div>

      <div className="ios-section-hdr">Installs</div>
      <div className="ios-group" style={{ margin: "0 0 24px", borderRadius: "14px" }}>
        <div
          className="ios-row"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate("lognumbers")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onNavigate("lognumbers");
          }}
        >
          <div className="ios-row-icon tint-mint">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <div className="ios-row-content">
            <div className="ios-row-title">Equipment Installs</div>
            <div className="ios-row-subtitle">Completed this period</div>
          </div>
          <div className="ios-row-detail" style={{ fontWeight: 600 }}>
            {d.inst}
          </div>
        </div>
        <div
          className="ios-row"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate("reports")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onNavigate("reports");
          }}
        >
          <div className="ios-row-icon tint-brand">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="ios-row-content">
            <div className="ios-row-title">Install Revenue</div>
            <div className="ios-row-subtitle">From completed jobs</div>
          </div>
          <div
            className="ios-row-detail"
            style={{ color: "var(--green)", fontWeight: 600 }}
          >
            {fm(d.ir)}
          </div>
        </div>
        <div
          className="ios-row"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate("reports")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onNavigate("reports");
          }}
        >
          <div className="ios-row-icon tint-yellow">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M1 4v6h6" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </div>
          <div className="ios-row-content">
            <div className="ios-row-title">Callback Rate</div>
            <div className="ios-row-subtitle">Returned within 30 days</div>
          </div>
          <div
            className="ios-row-detail"
            style={{
              color: d.cbr <= 5 ? "var(--sys-green)" : "var(--sys-orange)",
              fontWeight: 600,
            }}
          >
            {d.cbr > 0 ? `${d.cbr.toFixed(1)}%` : "0%"}
          </div>
        </div>
      </div>

      <div className="ios-section-hdr">Service</div>
      <div className="ios-group" style={{ margin: "0 0 24px", borderRadius: "14px" }}>
        <div
          className="ios-row"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate("lognumbers")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onNavigate("lognumbers");
          }}
        >
          <div className="ios-row-icon tint-teal">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M9 12l2 2 4-4" />
              <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z" />
              <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z" />
              <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z" />
              <path d="M12 21c0-1-1-2-2-2s-2 1-2 2 1 2 2 2 2-1 2-2z" />
            </svg>
          </div>
          <div className="ios-row-content">
            <div className="ios-row-title">Maintenance Calls</div>
            <div className="ios-row-subtitle">Avg ticket ${d.amc}</div>
          </div>
          <div className="ios-row-detail" style={{ fontWeight: 600 }}>
            {d.mc}
          </div>
        </div>
        <div
          className="ios-row"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate("lognumbers")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onNavigate("lognumbers");
          }}
        >
          <div className="ios-row-icon tint-orange">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 9.16a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.47h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.1a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.46 17.48z" />
            </svg>
          </div>
          <div className="ios-row-content">
            <div className="ios-row-title">Demand Calls</div>
            <div className="ios-row-subtitle">Avg ticket ${d.adc}</div>
          </div>
          <div className="ios-row-detail" style={{ fontWeight: 600 }}>
            {d.dc}
          </div>
        </div>
        <div
          className="ios-row"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate("reports")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onNavigate("reports");
          }}
        >
          <div className="ios-row-icon tint-brand">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="ios-row-content">
            <div className="ios-row-title">Service Revenue</div>
            <div className="ios-row-subtitle">Maintenance + demand</div>
          </div>
          <div
            className="ios-row-detail"
            style={{ color: "var(--green)", fontWeight: 600 }}
          >
            {fm(d.svr)}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", padding: "0 0 8px" }}>
        <button
          type="button"
          className="ios-btn ios-btn-rg ios-btn-glass-prom ios-btn-block"
          onClick={() => onNavigate("lognumbers")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Log Numbers
        </button>
        <button
          type="button"
          className="ios-btn ios-btn-rg ios-btn-glass"
          onClick={() => onNavigate("messages")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Ask Tom
        </button>
        <button
          type="button"
          className="ios-btn ios-btn-rg ios-btn-glass"
          onClick={() => onNavigate("reports")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export
        </button>
      </div>
    </>
  );
}

export default DashboardPage;
