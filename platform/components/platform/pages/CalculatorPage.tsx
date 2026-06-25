"use client";

import { useCallback, useMemo, useState, type CSSProperties } from "react";
import {
  DEFAULT_JOB_COSTS,
  GM_PROVINCES,
  PROVINCE_OPTIONS,
  type ProvinceCode,
} from "@/lib/platform/data/calculator";
import {
  buildGmScenarios,
  computeGm,
  fmtD,
  fmtP,
} from "@/lib/platform/utils/calculator";
import { openGmPdfExport } from "@/lib/platform/utils/gmPdf";

const JOB_COST_FIELDS = [
  ["equipment", "Equipment", DEFAULT_JOB_COSTS.equipment],
  ["materials", "Materials", DEFAULT_JOB_COSTS.materials],
  ["labour", "Labour", DEFAULT_JOB_COSTS.labour],
  ["subcon", "Subcontract", DEFAULT_JOB_COSTS.subcon],
  ["electrical", "Electrical", DEFAULT_JOB_COSTS.electrical],
  ["other", "Other/Warranty", DEFAULT_JOB_COSTS.other],
] as const;

const RATE_FIELDS = [
  ["targetGm", "Target GM %", DEFAULT_JOB_COSTS.targetGm, true],
  ["commission", "Commission %", DEFAULT_JOB_COSTS.commission, false],
  ["financing", "Financing Charge %", DEFAULT_JOB_COSTS.financing, false],
] as const;

const inputBase: CSSProperties = {
  width: "100%",
  padding: "7px 8px 7px 20px",
  borderRadius: "8px",
  border: "1px solid rgba(0,0,0,0.1)",
  background: "#F0F3F0",
  fontSize: "13px",
  fontWeight: 600,
  color: "#0A160A",
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
  transition: "all .15s",
};

export interface CalculatorPageProps {
  onToast?: (message: string) => void;
}

export function CalculatorPage({ onToast }: CalculatorPageProps) {
  const [province, setProvince] = useState<ProvinceCode>("BC");
  const [costs, setCosts] = useState({
    equipment: DEFAULT_JOB_COSTS.equipment,
    materials: DEFAULT_JOB_COSTS.materials,
    labour: DEFAULT_JOB_COSTS.labour,
    subcon: DEFAULT_JOB_COSTS.subcon,
    electrical: DEFAULT_JOB_COSTS.electrical,
    other: DEFAULT_JOB_COSTS.other,
    targetGm: DEFAULT_JOB_COSTS.targetGm,
    commission: DEFAULT_JOB_COSTS.commission,
    financing: DEFAULT_JOB_COSTS.financing,
    hst: GM_PROVINCES.BC.rate,
  });

  const provData = GM_PROVINCES[province];

  const setProvinceAndTax = useCallback((code: ProvinceCode) => {
    setProvince(code);
    setCosts((c) => ({ ...c, hst: GM_PROVINCES[code].rate }));
  }, []);

  const gmInputs = useMemo(
    () => ({
      equipment: costs.equipment,
      materials: costs.materials,
      labour: costs.labour,
      subcon: costs.subcon,
      electrical: costs.electrical,
      other: costs.other,
      targetGm: costs.targetGm,
      commission: costs.commission,
      financing: costs.financing,
      hst: costs.hst,
    }),
    [costs]
  );

  const result = useMemo(() => computeGm(gmInputs), [gmInputs]);
  const scenarios = useMemo(
    () => buildGmScenarios(gmInputs, costs.targetGm),
    [gmInputs, costs.targetGm]
  );

  const provName =
    PROVINCE_OPTIONS.find((o) => o.value === province)?.label.split("—")[0].trim() ??
    province;

  const handleExport = () => {
    if (result.sell <= 0) {
      onToast?.("Enter costs above to enable export");
      return;
    }
    if (!openGmPdfExport(gmInputs, result, provName)) {
      onToast?.("Pop-ups blocked — allow pop-ups to export");
    }
  };

  const setNum = (key: keyof typeof costs, val: string) => {
    setCosts((c) => ({ ...c, [key]: parseFloat(val) || 0 }));
  };

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
          GM Calculator
        </div>
        <div style={{ fontSize: "12px", color: "#7A9A7A", marginTop: "2px" }}>
          Gross margin · commission · financing · tax · PDF export
        </div>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          boxShadow:
            "0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
          marginBottom: "10px",
          overflow: "hidden",
          borderTop: "1px solid rgba(0,180,120,0.1)",
        }}
      >
        <div
          style={{
            padding: "16px 18px",
            borderBottom: "0.5px solid rgba(0,0,0,0.07)",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#7A9A7A",
              textTransform: "uppercase",
              letterSpacing: ".6px",
              marginBottom: "10px",
            }}
          >
            Job Costs
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            {JOB_COST_FIELDS.map(([key, label, defaultVal]) => (
              <div key={key}>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#7A9A7A",
                    marginBottom: "3px",
                    fontWeight: 500,
                  }}
                >
                  {label}
                </div>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "9px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "11px",
                      color: "#4A6A50",
                      fontWeight: 600,
                      pointerEvents: "none",
                    }}
                  >
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={costs[key] || ""}
                    onChange={(e) => setNum(key, e.target.value)}
                    onFocus={(e) => {
                      e.target.select();
                      e.target.style.borderColor = "#00B478";
                      e.target.style.background = "#fff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(0,0,0,0.1)";
                      e.target.style.background = "#F0F3F0";
                    }}
                    style={inputBase}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              borderRadius: "8px",
              background: "rgba(0,105,74,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#4A6A50",
                textTransform: "uppercase",
                letterSpacing: ".4px",
              }}
            >
              Base COGS
            </span>
            <span
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: "#00694A",
                letterSpacing: "-.04em",
              }}
            >
              ${Math.round(result.cogs).toLocaleString()}
            </span>
          </div>
        </div>

        <div
          style={{
            padding: "14px 18px",
            borderBottom: "0.5px solid rgba(0,0,0,0.07)",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#7A9A7A",
              textTransform: "uppercase",
              letterSpacing: ".6px",
              marginBottom: "10px",
            }}
          >
            Rates & Market
          </div>

          <div style={{ marginBottom: "10px" }}>
            <div
              style={{
                fontSize: "10px",
                color: "#7A9A7A",
                marginBottom: "3px",
                fontWeight: 500,
              }}
            >
              Province / Market
            </div>
            <select
              value={province}
              onChange={(e) =>
                setProvinceAndTax(e.target.value as ProvinceCode)
              }
              onFocus={(e) => {
                e.target.style.borderColor = "#00B478";
                e.target.style.background = "#fff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(0,0,0,0.1)";
                e.target.style.background = "#F0F3F0";
              }}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid rgba(0,0,0,0.1)",
                background: "#F0F3F0",
                fontSize: "13px",
                fontWeight: 600,
                color: "#0A160A",
                fontFamily: "inherit",
                outline: "none",
                transition: "all .15s",
              }}
            >
              {PROVINCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              marginBottom: "8px",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "rgba(0,0,0,0.03)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "#7A9A7A",
                  fontWeight: 500,
                }}
              >
                {provData.label}
              </div>
              <div style={{ position: "relative", width: "120px" }}>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={costs.hst}
                  onChange={(e) => setNum("hst", e.target.value)}
                  onFocus={(e) => {
                    e.target.select();
                    e.target.style.borderColor = "#00B478";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(0,0,0,0.1)";
                  }}
                  style={{
                    width: "100%",
                    padding: "5px 38px 5px 10px",
                    borderRadius: "6px",
                    border: "1px solid rgba(0,0,0,0.1)",
                    background: "#FFFFFF",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#0A160A",
                    fontFamily: "inherit",
                    outline: "none",
                    boxSizing: "border-box",
                    textAlign: "right",
                    transition: "all .15s",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    right: "24px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "11px",
                    color: "#4A6A50",
                    fontWeight: 600,
                    pointerEvents: "none",
                  }}
                >
                  %
                </span>
              </div>
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#7A9A7A",
                lineHeight: 1.4,
              }}
            >
              {provData.note}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            {RATE_FIELDS.map(([key, label, , fullWidth]) => (
              <div
                key={key}
                style={fullWidth ? { gridColumn: "1 / -1" } : undefined}
              >
                <div
                  style={{
                    fontSize: "10px",
                    color: "#7A9A7A",
                    marginBottom: "3px",
                    fontWeight: 500,
                  }}
                >
                  {label}
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={costs[key]}
                    onChange={(e) => setNum(key, e.target.value)}
                    onFocus={(e) => {
                      e.target.select();
                      e.target.style.borderColor = "#00B478";
                      e.target.style.background = "#fff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(0,0,0,0.1)";
                      e.target.style.background = "#F0F3F0";
                    }}
                    style={{
                      ...inputBase,
                      padding: "7px 22px 7px 10px",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "9px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "11px",
                      color: "#4A6A50",
                      fontWeight: 600,
                      pointerEvents: "none",
                    }}
                  >
                    %
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "16px 18px" }}>
          <div
            style={{
              position: "relative",
              background:
                "linear-gradient(135deg,#003D2B 0%,#00694A 55%,#00B478 130%)",
              borderRadius: "14px",
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
              boxShadow:
                "0 4px 18px rgba(0,90,60,0.18), 0 1px 0 rgba(255,255,255,0.08) inset",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1px",
                background:
                  "linear-gradient(90deg,transparent,rgba(0,180,120,0.6),transparent)",
                pointerEvents: "none",
              }}
            />
            <div>
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.7)",
                  textTransform: "uppercase",
                  letterSpacing: ".12em",
                  marginBottom: "5px",
                }}
              >
                Required Selling Price
              </div>
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  letterSpacing: "-.05em",
                  lineHeight: 1,
                  textShadow: "0 1px 12px rgba(0,0,0,0.18)",
                }}
              >
                {result.sell > 0 ? fmtD(result.sell) : "—"}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.72)",
                  marginTop: "5px",
                }}
              >
                {result.sell > 0
                  ? `Multiplier: ${result.mult.toFixed(2)}×  ·  Customer total: ${fmtD(result.custT)}`
                  : result.denom <= 0
                    ? "Rates produce no solution"
                    : "Enter costs above"}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.7)",
                  textTransform: "uppercase",
                  letterSpacing: ".12em",
                  marginBottom: "3px",
                }}
              >
                Actual GM
              </div>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  letterSpacing: "-.04em",
                  textShadow: "0 1px 12px rgba(0,0,0,0.18)",
                }}
              >
                {result.sell > 0 ? fmtP(result.actGM) : "—"}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            {(
              [
                ["Gross Profit", result.gp, "#00694A"],
                ["Customer Total w/ Tax", result.custT, "#1A4DB0"],
                ["Commission", result.commD, "#4A6A50"],
                ["Financing Cost", result.finC, "#8A9BA8"],
              ] as const
            ).map(([label, val, color]) => (
              <div
                key={label}
                style={{
                  background: "#F0F3F0",
                  borderRadius: "10px",
                  padding: "11px 14px",
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#7A9A7A",
                    textTransform: "uppercase",
                    letterSpacing: ".5px",
                    marginBottom: "4px",
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: 800,
                    color,
                    letterSpacing: "-.04em",
                  }}
                >
                  {result.sell > 0 ? fmtD(val) : "—"}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "12px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={handleExport}
              style={{
                padding: "9px 16px",
                borderRadius: "10px",
                border: "1px solid rgba(0,105,74,0.25)",
                background: "rgba(0,105,74,0.06)",
                color: "#00694A",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                transition: "all .15s",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="13"
                height="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
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
        </div>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          boxShadow:
            "0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
          overflow: "hidden",
          borderTop: "1px solid rgba(0,180,120,0.1)",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "0.5px solid rgba(0,0,0,0.07)",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#0A160A",
            }}
          >
            GM Scenarios
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#7A9A7A",
              marginTop: "1px",
            }}
          >
            30% – 50% · current commission, financing & tax
          </div>
        </div>
        <div
          style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "11px",
              minWidth: "440px",
            }}
          >
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.02)" }}>
                {[
                  "Target GM",
                  "Sell Price",
                  "Gross Profit",
                  "Actual GM",
                  "Multiplier",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 14px",
                      textAlign: "right",
                      fontSize: "8px",
                      fontWeight: 700,
                      color: "rgba(0,180,120,0.55)",
                      textTransform: "uppercase",
                      letterSpacing: ".5px",
                      borderBottom: "0.5px solid rgba(0,0,0,0.07)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scenarios.map((row) => (
                <tr
                  key={row.gm}
                  style={{
                    background: row.current
                      ? "rgba(26,77,176,0.07)"
                      : row.gm % 2
                        ? undefined
                        : "rgba(0,0,0,0.015)",
                    borderBottom: "0.5px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <td
                    style={{
                      padding: "8px 14px",
                      textAlign: "right",
                      color: row.current ? "#1A4DB0" : "#0A160A",
                      fontWeight: row.current ? 700 : 500,
                    }}
                  >
                    {row.current ? "▶ " : ""}
                    {row.gm}%
                  </td>
                  <td
                    style={{
                      padding: "8px 14px",
                      textAlign: "right",
                      fontWeight: row.current ? 700 : 500,
                      color: row.current ? "#1A4DB0" : "#0A160A",
                    }}
                  >
                    {row.sell ? fmtD(row.sell) : "—"}
                  </td>
                  <td
                    style={{
                      padding: "8px 14px",
                      textAlign: "right",
                      color: "#00694A",
                    }}
                  >
                    {row.sell ? fmtD(row.gp) : "—"}
                  </td>
                  <td
                    style={{
                      padding: "8px 14px",
                      textAlign: "right",
                      color: "#00B478",
                      fontWeight: 600,
                    }}
                  >
                    {row.sell ? fmtP(row.actGM) : "—"}
                  </td>
                  <td
                    style={{
                      padding: "8px 14px",
                      textAlign: "right",
                      color: "#7A9A7A",
                    }}
                  >
                    {row.sell ? row.mult.toFixed(3) + "×" : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default CalculatorPage;
