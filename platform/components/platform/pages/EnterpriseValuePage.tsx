"use client";

import { useMemo, useState } from "react";
import { KPI, type KpiPeriod } from "@/lib/platform/data/kpi";

const SCENARIOS = [
  ["+$50K EBITDA", "GM improvement + cost reduction", 50000],
  ["+$100K EBITDA", "Add 1 tech + maintenance agreements", 100000],
  ["+$200K EBITDA", "Full optimization program", 200000],
] as const;

function computeEv(d: KpiPeriod, multiple: number) {
  const annualRev = Math.round((d.tsr + d.svr) * 12);
  const ebitda = Math.round(annualRev * 0.12);
  const ev = Math.round(ebitda * multiple);
  return { annualRev, ebitda, ev };
}

export function EnterpriseValuePage() {
  const d = KPI.Month;
  const [multiple, setMultiple] = useState(4.5);

  const { annualRev, ebitda, ev } = useMemo(
    () => computeEv(d, multiple),
    [d, multiple]
  );

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
          Enterprise Value
        </div>
        <div style={{ fontSize: "12px", color: "#7A9A7A", marginTop: "2px" }}>
          What is your business worth today — and at exit?
        </div>
      </div>

      <div
        style={{
          background:
            "linear-gradient(160deg,#060D08,#0A1A2E,#0C2D6E)",
          borderRadius: "16px",
          padding: "22px",
          marginBottom: "10px",
          borderTop: "1px solid rgba(74,127,212,0.4)",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "rgba(0,180,120,0.5)",
            textTransform: "uppercase",
            letterSpacing: ".8px",
            marginBottom: "6px",
          }}
        >
          Estimated Enterprise Value
        </div>
        <div
          style={{
            fontSize: "40px",
            fontWeight: 800,
            color: "#A8C8FF",
            letterSpacing: "-.06em",
            lineHeight: 1,
          }}
        >
          ${ev.toLocaleString()}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "rgba(138,155,168,0.6)",
            marginTop: "6px",
          }}
        >
          Based on ${ebitda.toLocaleString()} EBITDA × {multiple}× multiple
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginTop: "16px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: "10px",
              padding: "12px",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                letterSpacing: ".6px",
                marginBottom: "4px",
              }}
            >
              Annual Revenue
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "white",
              }}
            >
              ${Math.round(annualRev / 1000)}K
            </div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: "10px",
              padding: "12px",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                letterSpacing: ".6px",
                marginBottom: "4px",
              }}
            >
              EBITDA
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#00B478",
              }}
            >
              ${Math.round(ebitda / 1000)}K
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          padding: "18px",
          marginBottom: "10px",
          boxShadow:
            "0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#0A160A",
            marginBottom: "4px",
          }}
        >
          EBITDA Multiple
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#7A9A7A",
            marginBottom: "14px",
          }}
        >
          Strategic buyers in trades: 3–5× · PE roll-up: 5–8× · Optimized exit:
          6–10×
        </div>
        <input
          type="range"
          min={2}
          max={10}
          step={0.5}
          value={multiple}
          onChange={(e) => setMultiple(parseFloat(e.target.value))}
          style={{
            width: "100%",
            accentColor: "#00694A",
            marginBottom: "8px",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
            color: "#7A9A7A",
          }}
        >
          <span>2×</span>
          <span style={{ fontWeight: 700, color: "#1A4DB0" }}>{multiple}×</span>
          <span>10×</span>
        </div>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          padding: "18px",
          marginBottom: "10px",
          boxShadow:
            "0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#0A160A",
            marginBottom: "4px",
          }}
        >
          EBITDA Improvement Scenarios
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#7A9A7A",
            marginBottom: "14px",
          }}
        >
          Every $1 of extra EBITDA is worth ${multiple} at current multiple
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {SCENARIOS.map(([title, desc, delta]) => {
            const newEV = Math.round((ebitda + delta) * multiple);
            const gain = newEV - ev;
            return (
              <div
                key={title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  background: "#F0F3F0",
                  borderRadius: "10px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#0A160A",
                    }}
                  >
                    {title}
                  </div>
                  <div style={{ fontSize: "11px", color: "#7A9A7A" }}>
                    {desc}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 800,
                      color: "#1A4DB0",
                    }}
                  >
                    ${Math.round(newEV / 1000)}K
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#00B478",
                      fontWeight: 700,
                    }}
                  >
                    +${Math.round(gain / 1000)}K value
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default EnterpriseValuePage;
