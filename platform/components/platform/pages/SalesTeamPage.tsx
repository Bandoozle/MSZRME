"use client";

import { SALES_REPS } from "@/lib/platform/data/salesTeam";
import { fmtSalesK, paceColor } from "@/lib/platform/utils/salesTeam";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export interface SalesTeamPageProps {
  onToast?: (message: string) => void;
}

export function SalesTeamPage({ onToast }: SalesTeamPageProps) {
  const today = new Date();
  const monthName = MONTHS[today.getMonth()];
  const year = today.getFullYear();

  const teamMth = SALES_REPS.reduce(
    (s, r) => ({
      estimates: s.estimates + r.mth.estimates,
      sales: s.sales + r.mth.sales,
      revenue: s.revenue + r.mth.revenue,
      goal: s.goal + r.mth.goal,
    }),
    { estimates: 0, sales: 0, revenue: 0, goal: 0 }
  );
  const teamYtd = SALES_REPS.reduce(
    (s, r) => ({
      estimates: s.estimates + r.ytd.estimates,
      sales: s.sales + r.ytd.sales,
      revenue: s.revenue + r.ytd.revenue,
      goal: s.goal + r.ytd.goal,
    }),
    { estimates: 0, sales: 0, revenue: 0, goal: 0 }
  );
  const teamCrMth =
    teamMth.estimates > 0 ? (teamMth.sales / teamMth.estimates) * 100 : 0;
  const teamCrYtd =
    teamYtd.estimates > 0 ? (teamYtd.sales / teamYtd.estimates) * 100 : 0;
  const teamAstMth =
    teamMth.sales > 0 ? Math.round(teamMth.revenue / teamMth.sales) : 0;
  const teamAstYtd =
    teamYtd.sales > 0 ? Math.round(teamYtd.revenue / teamYtd.sales) : 0;

  return (
    <>
      <div style={{ padding: "4px 0 12px" }}>
        <div
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#0A160A",
            letterSpacing: "-.03em",
          }}
        >
          Sales Team
        </div>
        <div style={{ fontSize: "13px", color: "#7A9A7A", marginTop: "2px" }}>
          Monthly performance & YTD pacing · {monthName} {year}
        </div>
      </div>

      <div
        style={{
          background:
            "linear-gradient(145deg,#003D2B 0%,#00694A 55%,#00B478 130%)",
          borderRadius: "18px",
          padding: "18px 20px",
          marginBottom: "10px",
          color: "white",
          boxShadow: "0 4px 18px rgba(0,90,60,0.18)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 80% at 100% 0%,rgba(0,180,120,0.22),transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "6px",
            }}
          >
            Team Performance
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              marginBottom: "14px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.6)",
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                {monthName}
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  letterSpacing: "-.04em",
                  marginTop: "2px",
                }}
              >
                {fmtSalesK(teamMth.revenue)}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.7)",
                  marginTop: "2px",
                }}
              >
                {Math.round((teamMth.revenue / teamMth.goal) * 100)}% of monthly
                goal
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.6)",
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                YTD {year}
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  letterSpacing: "-.04em",
                  marginTop: "2px",
                }}
              >
                {fmtSalesK(teamYtd.revenue)}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.7)",
                  marginTop: "2px",
                }}
              >
                {Math.round((teamYtd.revenue / teamYtd.goal) * 100)}% of annual
                goal
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "14px",
              fontSize: "11px",
              color: "rgba(255,255,255,0.85)",
              borderTop: "0.5px solid rgba(255,255,255,0.15)",
              paddingTop: "12px",
            }}
          >
            <div>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>Closing</span>{" "}
              <span style={{ fontWeight: 700 }}>{teamCrMth.toFixed(1)}%</span>{" "}
              <span
                style={{ color: "rgba(255,255,255,0.45)", fontSize: "10px" }}
              >
                / {teamCrYtd.toFixed(1)}% YTD
              </span>
            </div>
            <div>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>Avg Ticket</span>{" "}
              <span style={{ fontWeight: 700 }}>{fmtSalesK(teamAstMth)}</span>
            </div>
            <div>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>Deals</span>{" "}
              <span style={{ fontWeight: 700 }}>{teamMth.sales}</span>
              <span
                style={{ color: "rgba(255,255,255,0.45)", fontSize: "10px" }}
              >
                {" "}
                / {teamYtd.sales} YTD
              </span>
            </div>
          </div>
        </div>
      </div>

      {SALES_REPS.map((r) => {
        const mthPct = Math.min(
          Math.round((r.mth.revenue / r.mth.goal) * 100),
          100
        );
        const ytdPct = Math.min(
          Math.round((r.ytd.revenue / r.ytd.goal) * 100),
          100
        );
        const mthGoalColor = paceColor(mthPct);

        return (
          <div
            key={r.id}
            style={{
              background: "#FFFFFF",
              borderRadius: "14px",
              boxShadow:
                "0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
              overflow: "hidden",
              marginBottom: "10px",
              borderTop: `2px solid ${r.color}`,
            }}
          >
            <div
              style={{
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                borderBottom: "0.5px solid rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: `linear-gradient(135deg,${r.color},${r.color}aa)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: "-.02em",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                {r.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 800,
                    color: "#0A160A",
                    letterSpacing: "-.01em",
                  }}
                >
                  {r.name}
                </div>
                <div style={{ fontSize: "11px", color: "#7A9A7A" }}>
                  {r.role}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#7A9A7A",
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                  }}
                >
                  Mth Pace
                </div>
                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: 800,
                    color: mthGoalColor,
                    letterSpacing: "-.03em",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {mthPct}%
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 0,
                borderBottom: "0.5px solid rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  padding: "14px 18px",
                  borderRight: "0.5px solid rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#7A9A7A",
                    textTransform: "uppercase",
                    letterSpacing: ".08em",
                    marginBottom: "8px",
                  }}
                >
                  {monthName}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    fontSize: "11px",
                  }}
                >
                  {[
                    ["Revenue", fmtSalesK(r.mth.revenue), true],
                    ["Goal", fmtSalesK(r.mth.goal), false],
                    ["Estimates", String(r.mth.estimates), true],
                    ["Closed", String(r.mth.sales), true],
                    ["Closing", `${r.mth.cr.toFixed(1)}%`, true, "#00694A"],
                    ["Avg Ticket", fmtSalesK(r.mth.ast), false],
                  ].map(([label, val, bold, color]) => (
                    <div
                      key={String(label)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#7A9A7A" }}>{label}</span>
                      <span
                        style={{
                          fontWeight: bold ? 800 : 400,
                          color: typeof color === "string" ? color : "#0A160A",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: "14px 18px" }}>
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#7A9A7A",
                    textTransform: "uppercase",
                    letterSpacing: ".08em",
                    marginBottom: "8px",
                  }}
                >
                  YTD {year}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    fontSize: "11px",
                  }}
                >
                  {[
                    ["Revenue", fmtSalesK(r.ytd.revenue), true],
                    ["Goal", fmtSalesK(r.ytd.goal), false],
                    ["Estimates", String(r.ytd.estimates), true],
                    ["Closed", String(r.ytd.sales), true],
                    ["Closing", `${r.ytd.cr.toFixed(1)}%`, true, "#00694A"],
                    ["Avg Ticket", fmtSalesK(r.ytd.ast), false],
                  ].map(([label, val, bold, color]) => (
                    <div
                      key={String(label)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#7A9A7A" }}>{label}</span>
                      <span
                        style={{
                          fontWeight: bold ? 800 : 400,
                          color: typeof color === "string" ? color : "#0A160A",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: "12px 18px 14px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    color: "#7A9A7A",
                    width: "60px",
                    flexShrink: 0,
                  }}
                >
                  Mth pace
                </div>
                <div
                  style={{
                    flex: 1,
                    height: "5px",
                    background: "rgba(0,0,0,0.05)",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${mthPct}%`,
                      height: "100%",
                      background: `linear-gradient(90deg,${r.color},${r.color}cc)`,
                      borderRadius: "3px",
                      transition: "width .6s",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: mthGoalColor,
                    width: "36px",
                    textAlign: "right",
                  }}
                >
                  {mthPct}%
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    color: "#7A9A7A",
                    width: "60px",
                    flexShrink: 0,
                  }}
                >
                  YTD pace
                </div>
                <div
                  style={{
                    flex: 1,
                    height: "5px",
                    background: "rgba(0,0,0,0.05)",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${ytdPct}%`,
                      height: "100%",
                      background: `linear-gradient(90deg,${r.color}aa,${r.color}55)`,
                      borderRadius: "3px",
                      transition: "width .6s",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#4A6A50",
                    width: "36px",
                    textAlign: "right",
                  }}
                >
                  {ytdPct}%
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          padding: "14px 18px",
          boxShadow: "0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "12px", color: "#7A9A7A" }}>
          Track up to 12 sales reps per business
        </div>
        <button
          type="button"
          onClick={() => onToast?.("Add Rep coming soon")}
          style={{
            padding: "8px 16px",
            borderRadius: "20px",
            background: "rgba(0,105,74,0.08)",
            border: "1px solid rgba(0,105,74,0.18)",
            color: "#00694A",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          + Add Rep
        </button>
      </div>
    </>
  );
}

export default SalesTeamPage;
