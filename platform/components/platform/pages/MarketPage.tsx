"use client";

import type { CSSProperties, ReactNode } from "react";
import { PEERS, type Peer } from "@/lib/platform/data/kpi";

export type MarketSortKey = "rev" | "growth" | "svc" | "ast";

const SHAPES = [
  "circle",
  "square",
  "triangle",
  "diamond",
  "hexagon",
  "star",
  "wave",
  "pentagon",
] as const;
const FCOLORS = [
  "#0A84FF",
  "#30D158",
  "#FF9F0A",
  "#FF453A",
  "#BF5AF2",
  "#64D2FF",
  "#FF6B6B",
  "#FFD60A",
];

function shapeIndex(alias: string): number {
  return alias.charCodeAt(7) % SHAPES.length;
}

function fpColor(alias: string): string {
  return FCOLORS[shapeIndex(alias)];
}

function momentum(p: Peer): number {
  const gScore = Math.min(100, Math.max(0, ((p.growth + 15) / 30) * 100));
  const sScore = Math.min(100, (p.svc / 200) * 100);
  const tScore = Math.min(100, ((p.ast - 6000) / 3000) * 100);
  return Math.round(gScore * 0.5 + sScore * 0.3 + tScore * 0.2);
}

function PeerFingerprint({
  alias,
  size = 28,
  pulse = false,
  dark = false,
}: {
  alias: string;
  size?: number;
  pulse?: boolean;
  dark?: boolean;
}) {
  const shape = SHAPES[shapeIndex(alias)];
  const col = fpColor(alias);
  const s = size;
  const r = s / 2;
  const animStyle = pulse
    ? { animation: "mp-pulse 2s ease-in-out infinite" as const }
    : undefined;

  switch (shape) {
    case "circle":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={animStyle}>
          <circle cx={r} cy={r} r={r - 3} fill={col} opacity={0.85} />
        </svg>
      );
    case "square":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={animStyle}>
          <rect
            x={3}
            y={3}
            width={s - 6}
            height={s - 6}
            rx={4}
            fill={col}
            opacity={0.85}
          />
        </svg>
      );
    case "triangle":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={animStyle}>
          <polygon
            points={`${r},3 ${s - 3},${s - 3} 3,${s - 3}`}
            fill={col}
            opacity={0.85}
          />
        </svg>
      );
    case "diamond":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={animStyle}>
          <polygon
            points={`${r},3 ${s - 3},${r} ${r},${s - 3} 3,${r}`}
            fill={col}
            opacity={0.85}
          />
        </svg>
      );
    case "hexagon": {
      const hpts: string[] = [];
      for (let a = 0; a < 6; a++) {
        const ang = ((a * 60 - 30) * Math.PI) / 180;
        hpts.push(
          `${(r + (r - 4) * Math.cos(ang)).toFixed(1)},${(r + (r - 4) * Math.sin(ang)).toFixed(1)}`
        );
      }
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={animStyle}>
          <polygon points={hpts.join(" ")} fill={col} opacity={0.85} />
        </svg>
      );
    }
    case "star": {
      const spts: string[] = [];
      for (let a = 0; a < 10; a++) {
        const ang = (a * 36 * Math.PI) / 180;
        const sr = a % 2 === 0 ? r - 3 : (r - 3) * 0.45;
        spts.push(
          `${(r + sr * Math.sin(ang)).toFixed(1)},${(r - sr * Math.cos(ang)).toFixed(1)}`
        );
      }
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={animStyle}>
          <polygon points={spts.join(" ")} fill={col} opacity={0.85} />
        </svg>
      );
    }
    case "wave":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={animStyle}>
          <circle cx={r} cy={r} r={r - 3} fill={col} opacity={0.85} />
          <circle
            cx={r}
            cy={r}
            r={r - 7}
            fill={dark ? "#1C1C1E" : "#FFF"}
            opacity={0.6}
          />
          <circle cx={r} cy={r} r={r - 11} fill={col} opacity={0.75} />
        </svg>
      );
    default: {
      const ppts: string[] = [];
      for (let a = 0; a < 5; a++) {
        const ang = ((a * 72 - 90) * Math.PI) / 180;
        ppts.push(
          `${(r + (r - 4) * Math.cos(ang)).toFixed(1)},${(r + (r - 4) * Math.sin(ang)).toFixed(1)}`
        );
      }
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={animStyle}>
          <polygon points={ppts.join(" ")} fill={col} opacity={0.85} />
        </svg>
      );
    }
  }
}

function Sparkline({ peer }: { peer: Peer }) {
  let seed =
    peer.alias.charCodeAt(peer.alias.length - 1) * 7 +
    Math.round(peer.growth * 100);
  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const n = 18;
  const raw: number[] = [];
  for (let i = 0; i < n; i++) {
    const trend = (i / (n - 1)) * (peer.growth / 100) * 40;
    const noise = (rng() - 0.5) * 5;
    raw.push(50 - trend + noise);
  }
  const mn = Math.min(...raw);
  const mx = Math.max(...raw);
  const span = mx - mn || 1;
  const W = 68;
  const H = 22;
  const pad = 2;
  const d =
    "M " +
    raw
      .map((v, i) => {
        const x = pad + (i * (W - pad * 2)) / (n - 1);
        const y = pad + ((v - mn) / span) * (H - pad * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" L ");
  const col =
    peer.growth >= 10
      ? "#30D158"
      : peer.growth >= 0
        ? "#00694A"
        : "#FF453A";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={68} height={22} style={{ display: "block" }}>
      <path
        d={d}
        fill="none"
        stroke={col}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.9}
      />
    </svg>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return <span style={{ fontSize: "15px", lineHeight: 1 }}>🥇</span>;
  if (rank === 2)
    return <span style={{ fontSize: "15px", lineHeight: 1 }}>🥈</span>;
  if (rank === 3)
    return <span style={{ fontSize: "15px", lineHeight: 1 }}>🥉</span>;
  return (
    <span
      style={{
        fontSize: "12px",
        fontWeight: 800,
        color: "var(--label-3)",
        letterSpacing: "-.02em",
      }}
    >
      {rank}
    </span>
  );
}

export interface MarketPageProps {
  sort: MarketSortKey;
  onSortChange: (sort: MarketSortKey) => void;
  peers?: readonly Peer[];
  userInitials?: string;
  dark?: boolean;
}

export function MarketPage({
  sort,
  onSortChange,
  peers = PEERS,
  userInitials = "JS",
  dark = false,
}: MarketPageProps) {
  const peerList = [...peers];
  const byRev = [...peerList].sort((a, b) => b.rev - a.rev);
  const you = peerList.find((p) => p.you) ?? peerList[1];
  const youRank = byRev.findIndex((p) => p.you) + 1;
  const above = youRank > 1 ? byRev[youRank - 2] : null;
  const leader = byRev[0];
  const avgRev = Math.round(
    peerList.reduce((s, p) => s + p.rev, 0) / peerList.length
  );
  const avgAst = Math.round(
    peerList.reduce((s, p) => s + p.ast, 0) / peerList.length
  );
  const avgGrowth = (
    peerList.reduce((s, p) => s + p.growth, 0) / peerList.length
  ).toFixed(1);
  const gapToLeader = leader.rev - you.rev;
  const gapToAbove = above ? above.rev - you.rev : 0;
  const percentile = Math.round(
    ((peerList.length - youRank + 1) / peerList.length) * 100
  );
  const maxRev = leader.rev;
  const peerGroup = "Green Stage Peers";

  const c = dark
    ? {
        txt1: "rgba(255,255,255,0.92)",
        txt2: "rgba(235,235,245,0.6)",
        sep: "rgba(255,255,255,0.09)",
        rowYou:
          "linear-gradient(90deg,rgba(48,209,88,0.12),rgba(48,209,88,0.02))",
        mpHover: "rgba(255,255,255,0.04)",
        tabActive: "#636366",
        tabInactive: "rgba(235,235,245,0.55)",
        track: "rgba(255,255,255,0.12)",
      }
    : {
        txt1: "rgba(0,0,0,1)",
        txt2: "rgba(60,60,67,0.6)",
        sep: "rgba(0,0,0,0.06)",
        rowYou:
          "linear-gradient(90deg,rgba(0,180,120,0.07),rgba(0,180,120,0.01))",
        mpHover: "rgba(0,0,0,0.02)",
        tabActive: "#FFFFFF",
        tabInactive: "rgba(60,60,67,0.55)",
        track: "rgba(0,0,0,0.06)",
      };

  const sorted = [...peerList].sort((a, b) => {
    if (sort === "rev") return b.rev - a.rev;
    if (sort === "growth") return b.growth - a.growth;
    if (sort === "svc") return b.svc - a.svc;
    return b.ast - a.ast;
  });

  function coachPrompt(): ReactNode {
    const byContracts = [...peerList].sort((a, b) => b.svc - a.svc);
    const targetContracts = byContracts[0];
    const contractGap = targetContracts.svc - you.svc;
    const revenueGap = Math.round(gapToAbove / 1000);
    let weeksAtPace = above
      ? Math.max(1, Math.ceil(gapToAbove / ((you.rev * (you.growth / 100)) / 52)))
      : 0;
    weeksAtPace = Math.min(weeksAtPace, 52);
    if (youRank === 1) {
      return (
        <>
          🏆 You&apos;re leading the market. Close{" "}
          <strong>
            {Math.round((you.rev - byRev[1].rev) / avgAst)}
          </strong>{" "}
          more contracts to extend your lead by $
          {Math.round((you.rev - byRev[1].rev) / 1000)}K.
        </>
      );
    }
    return (
      <>
        Add <strong>{contractGap}</strong> contracts to tie{" "}
        <PeerFingerprint alias={targetContracts.alias} size={16} dark={dark} />{" "}
        for most contracts · Gain $<strong>{revenueGap}K</strong> revenue to
        overtake #{youRank - 1} in <strong>~{weeksAtPace} weeks</strong> at your
        current growth rate.
      </>
    );
  }

  function marketMoves(): string[] {
    const improved = peerList.filter((p) => !p.you && p.growth > 8);
    const declining = peerList.filter((p) => !p.you && p.growth < 0);
    const moves: string[] = [];
    moves.push(
      `${improved.length} competitor${improved.length === 1 ? "" : "s"} growing faster than 8% this period`
    );
    if (declining.length)
      moves.push(
        `${declining.length} dealer${declining.length === 1 ? "" : "s"} declining — opportunity to gain ground`
      );
    moves.push(
      `Field avg ticket $${Math.round(avgAst).toLocaleString()} · You're ${you.ast > avgAst ? "+" : ""}$${Math.round(you.ast - avgAst)} vs market mean`
    );
    return moves;
  }

  const statStrip = [
    [
      "Avg Revenue",
      `$${Math.round(avgRev / 1000)}K`,
      `Across ${peerList.length} peers`,
      "#00694A",
    ],
    [
      "Field Growth",
      `+${avgGrowth}%`,
      `You: +${you.growth.toFixed(1)}% (${you.growth > parseFloat(avgGrowth) ? "↑ above" : "↓ below"} avg)`,
      "#30D158",
    ],
    [
      "Avg Ticket",
      `$${Math.round(avgAst).toLocaleString()}`,
      `You: $${Math.round(you.ast).toLocaleString()}`,
      "#0A84FF",
    ],
  ] as const;

  const sortTabs: [MarketSortKey, string][] = [
    ["rev", "Revenue"],
    ["growth", "Growth"],
    ["svc", "Contracts"],
    ["ast", "Avg Ticket"],
  ];

  return (
    <>
      <style>{`
        @keyframes mp-pulse{0%,100%{opacity:0.85}50%{opacity:0.55}}
        .mp-row{transition:background .15s}
        .mp-row:hover{background:var(--mp-hover) !important}
        .mp-tab-btn{transition:all .18s}
        .mp-momentum-bar{transition:width .8s cubic-bezier(.4,0,.2,1)}
      `}</style>

      <div
        style={{
          position: "relative",
          background:
            "linear-gradient(135deg,#003D2B 0%,#00694A 55%,#00B478 130%)",
          borderRadius: "20px",
          padding: "22px 24px 20px",
          marginBottom: "12px",
          overflow: "hidden",
          boxShadow:
            "0 1px 0 rgba(0,0,0,0.04), 0 8px 28px rgba(0,90,60,0.18)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 80% at 100% 0%,rgba(0,180,120,0.28),transparent 60%),radial-gradient(ellipse 50% 70% at 0% 100%,rgba(0,0,0,0.18),transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg,transparent,rgba(0,180,120,0.7),transparent)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "18px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "180px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#00B478",
                  boxShadow: "0 0 10px rgba(0,180,120,0.9)",
                  animation: "mp-pulse 2s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.72)",
                  textTransform: "uppercase",
                  letterSpacing: ".16em",
                }}
              >
                {peerGroup}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "8px",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "52px",
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: "-.06em",
                  lineHeight: 1,
                  fontFeatureSettings: "'tnum'",
                }}
              >
                #{youRank}
              </span>
              <span
                style={{
                  fontSize: "17px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.55)",
                  letterSpacing: "-.03em",
                }}
              >
                of {peerList.length}
              </span>
            </div>
            {youRank > 1 ? (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  background: "rgba(0,0,0,0.20)",
                  borderRadius: "20px",
                  padding: "4px 10px",
                  marginBottom: "10px",
                }}
              >
                <svg width="9" height="9" viewBox="0 0 12 12">
                  <polygon points="6,1 11,10 1,10" fill="#FFD60A" />
                </svg>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.80)",
                  }}
                >
                  ${Math.round(gapToAbove / 1000)}K from #{youRank - 1}
                </span>
              </div>
            ) : (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  background: "rgba(0,0,0,0.20)",
                  borderRadius: "20px",
                  padding: "4px 10px",
                  marginBottom: "10px",
                }}
              >
                <span style={{ fontSize: "11px" }}>🏆</span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.80)",
                  }}
                >
                  Market leader
                </span>
              </div>
            )}
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.92)",
                marginBottom: "4px",
                letterSpacing: "-.01em",
              }}
            >
              {you.biz}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.62)",
                lineHeight: 1.55,
              }}
            >
              {youRank === 1
                ? `Leading by $${Math.round((you.rev - byRev[1].rev) / 1000)}K`
                : `$${Math.round(gapToLeader / 1000)}K behind ${leader.biz.split(/\s+/).slice(0, 2).join(" ")}`}
              {" · "}
              Ahead of {peerList.length - youRank} dealer
              {peerList.length - youRank === 1 ? "" : "s"}
            </div>
          </div>
          <div
            style={{
              flexShrink: 0,
              textAlign: "right",
              minWidth: "110px",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.55)",
                textTransform: "uppercase",
                letterSpacing: ".16em",
                marginBottom: "8px",
              }}
            >
              Percentile
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 800,
                color: "#00FFA8",
                letterSpacing: "-.04em",
                lineHeight: 1,
                textShadow: "0 0 18px rgba(0,255,168,0.25)",
              }}
            >
              Top {percentile}%
            </div>
            <div
              style={{
                marginTop: "8px",
                width: "96px",
                height: "4px",
                background: "rgba(255,255,255,0.14)",
                borderRadius: "3px",
                overflow: "hidden",
                marginLeft: "auto",
              }}
            >
              <div
                style={{
                  width: `${percentile}%`,
                  height: "100%",
                  background: "linear-gradient(90deg,#00B478,#FFFFFF)",
                  borderRadius: "3px",
                  boxShadow: "0 0 8px rgba(0,180,120,0.4)",
                }}
              />
            </div>
            <div style={{ marginTop: "12px" }}>
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.55)",
                  textTransform: "uppercase",
                  letterSpacing: ".16em",
                  marginBottom: "5px",
                }}
              >
                Momentum
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "4px",
                    background: "rgba(255,255,255,0.14)",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${momentum(you)}%`,
                      height: "100%",
                      background: "linear-gradient(90deg,#FFD60A,#FF9F0A)",
                      borderRadius: "3px",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "#FFD60A",
                  }}
                >
                  {momentum(you)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mp-coach"
        style={{
          background: "rgba(0,136,255,0.07)",
          border: "1px solid rgba(0,136,255,0.14)",
          borderRadius: "14px",
          padding: "12px 16px",
          marginBottom: "12px",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
        }}
      >
        <span style={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>
          💡
        </span>
        <div
          style={{ fontSize: "12px", lineHeight: 1.6, color: c.txt2 }}
        >
          {coachPrompt()}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        {statStrip.map(([label, val, sub, col]) => (
          <div
            key={label}
            className="mp-stat"
            style={{
              position: "relative",
              background: dark ? "#1C1C1E" : "#FFF",
              borderRadius: "14px",
              padding: "14px 14px 12px",
              boxShadow:
                "0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: `linear-gradient(90deg,transparent,${col},transparent)`,
              }}
            />
            <div
              style={{
                fontSize: "9px",
                fontWeight: 700,
                color: c.txt2,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                marginBottom: "6px",
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontSize: "19px",
                fontWeight: 800,
                color: col,
                letterSpacing: "-.04em",
                lineHeight: 1,
                fontFeatureSettings: "'tnum'",
              }}
            >
              {val}
            </div>
            <div
              style={{
                fontSize: "10px",
                color: c.txt2,
                marginTop: "5px",
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {sub}
            </div>
          </div>
        ))}
      </div>

      <div
        className="mp-moves"
        style={{
          background: dark ? "#2C2C2E" : "rgba(0,0,0,0.02)",
          border: dark
            ? "0.5px solid rgba(255,255,255,0.08)"
            : "0.5px solid rgba(0,0,0,0.06)",
          borderRadius: "14px",
          padding: "12px 16px",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "9px",
          }}
        >
          <span style={{ fontSize: "11px" }}>📊</span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: c.txt2,
              textTransform: "uppercase",
              letterSpacing: ".10em",
            }}
          >
            Market Moves This Week
          </span>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "5px" }}
        >
          {marketMoves().map((m) => (
            <div
              key={m}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                fontSize: "11px",
                color: c.txt2,
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "#30D158",
                  flexShrink: 0,
                }}
              />
              {m}
            </div>
          ))}
        </div>
      </div>

      <div
        id="mp-leaderboard"
        className="mp-lb"
        style={{
          background: dark ? "#1C1C1E" : "#FFF",
          borderRadius: "18px",
          boxShadow:
            "0 1px 0 rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "15px 18px 13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `0.5px solid ${c.sep}`,
          }}
        >
          <div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 800,
                color: c.txt1,
                letterSpacing: "-.02em",
              }}
            >
              Competitive Landscape
            </div>
            <div
              style={{
                fontSize: "10px",
                color: c.txt2,
                marginTop: "2px",
                fontWeight: 500,
              }}
            >
              {peerList.length} dealers · Greater Vancouver ·{" "}
              <span style={{ color: c.txt2 }}>Identities anonymised</span>
            </div>
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "9px",
              fontWeight: 800,
              color: "#00694A",
              background: "rgba(0,180,120,0.1)",
              padding: "5px 10px",
              borderRadius: "10px",
              letterSpacing: ".1em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#00B478",
                animation: "mp-pulse 2s ease-in-out infinite",
              }}
            />
            Live
          </div>
        </div>

        <div
          className="mp-tab-hdr"
          style={{
            display: "flex",
            borderBottom: `0.5px solid ${c.sep}`,
            background: dark
              ? "rgba(255,255,255,0.04)"
              : "rgba(238,241,236,0.5)",
          }}
        >
          {sortTabs.map(([key, label]) => {
            const active = sort === key;
            return (
              <button
                key={key}
                type="button"
                className="mp-tab-btn"
                onClick={() => onSortChange(key)}
                style={{
                  flex: 1,
                  padding: "11px 4px",
                  border: "none",
                  background: active ? c.tabActive : "transparent",
                  fontSize: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  color: active ? "#00694A" : c.tabInactive,
                  borderBottom: `2px solid ${active ? "#00694A" : "transparent"}`,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {sorted.map((p, i) => {
          const rank = i + 1;
          const gc = p.growth >= 0 ? "#30D158" : "#FF453A";
          const revPct = Math.round((p.rev / maxRev) * 100);
          const rowBg = p.you ? c.rowYou : "transparent";
          const isYou = p.you;
          const momVal = momentum(p);
          const momCol =
            momVal >= 70 ? "#30D158" : momVal >= 45 ? "#FF9F0A" : "#FF453A";
          return (
            <div
              key={p.alias}
              className="mp-row"
              style={
                {
                  "--mp-hover": c.mpHover,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 18px",
                  borderBottom: `0.5px solid ${c.sep}`,
                  background: rowBg,
                } as CSSProperties
              }
            >
              {isYou ? (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "10px",
                    bottom: "10px",
                    width: "3px",
                    background:
                      "linear-gradient(180deg,#00694A,#00B478)",
                    borderRadius: "0 3px 3px 0",
                  }}
                />
              ) : null}
              <div
                style={{
                  width: "22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <RankBadge rank={rank} />
              </div>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "11px",
                  background: isYou
                    ? "linear-gradient(135deg,#00694A,#003D2B)"
                    : dark
                      ? "#2C2C2E"
                      : "#F2F5F2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow:
                    "0 1px 4px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
              >
                {isYou ? (
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      color: "white",
                      letterSpacing: "-.02em",
                    }}
                  >
                    {userInitials}
                  </span>
                ) : (
                  <PeerFingerprint alias={p.alias} size={28} dark={dark} />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "4px",
                  }}
                >
                  {isYou ? (
                    <>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 800,
                          color: "#00694A",
                          letterSpacing: "-.01em",
                        }}
                      >
                        {p.biz}
                      </span>
                      <span
                        style={{
                          fontSize: "8px",
                          fontWeight: 800,
                          color: "white",
                          background:
                            "linear-gradient(135deg,#003D2B,#00B478)",
                          padding: "2px 7px",
                          borderRadius: "8px",
                          letterSpacing: ".08em",
                          flexShrink: 0,
                        }}
                      >
                        YOU
                      </span>
                    </>
                  ) : (
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: c.txt1,
                        letterSpacing: "-.01em",
                      }}
                    >
                      {p.alias}
                    </span>
                  )}
                  <div
                    title={`Momentum ${momVal}`}
                    style={{
                      marginLeft: "auto",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "3px",
                        background: c.track,
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        className="mp-momentum-bar"
                        style={{
                          width: `${momVal}%`,
                          height: "100%",
                          background: momCol,
                          borderRadius: "2px",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: "4px",
                      background: c.track,
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${revPct}%`,
                        height: "100%",
                        background: isYou
                          ? "linear-gradient(90deg,#00694A,#00B478)"
                          : rank === 1
                            ? "linear-gradient(90deg,#00694A,#7AAA8E)"
                            : "linear-gradient(90deg,#5A8A6E,#8AB39A)",
                        borderRadius: "3px",
                        transition: "width .6s cubic-bezier(.4,0,.2,1)",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color: c.txt1,
                      letterSpacing: "-.02em",
                      fontFeatureSettings: "'tnum'",
                      flexShrink: 0,
                      minWidth: "44px",
                      textAlign: "right",
                    }}
                  >
                    ${Math.round(p.rev / 1000)}K
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "10px",
                    color: c.txt2,
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      color: gc,
                      fontWeight: 800,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "2px",
                    }}
                  >
                    {p.growth >= 0 ? "▲" : "▼"}{" "}
                    {Math.abs(p.growth).toFixed(1)}%
                  </span>
                  <span style={{ color: c.sep }}>·</span>
                  <span>
                    <span style={{ color: c.txt1, fontWeight: 700 }}>
                      {p.svc}
                    </span>{" "}
                    contracts
                  </span>
                  <span style={{ color: c.sep }}>·</span>
                  <span>
                    $
                    <span style={{ color: c.txt1, fontWeight: 700 }}>
                      {(p.ast / 1000).toFixed(1)}K
                    </span>{" "}
                    avg
                  </span>
                  {isYou && youRank > 1 ? (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "9px",
                        color: c.txt2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      ${Math.round(gapToAbove / 1000)}K from #{youRank - 1}
                    </span>
                  ) : null}
                </div>
              </div>
              <div style={{ flexShrink: 0 }}>
                <Sparkline peer={p} />
              </div>
            </div>
          );
        })}

        <div
          style={{
            padding: "12px 18px",
            borderTop: `0.5px solid ${c.sep}`,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "9px",
              fontWeight: 600,
              color: c.txt2,
              textTransform: "uppercase",
              letterSpacing: ".10em",
            }}
          >
            Your peers
          </span>
          {peerList
            .filter((p) => !p.you)
            .map((p) => (
              <div
                key={p.alias}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                title={p.alias}
              >
                <PeerFingerprint alias={p.alias} size={14} dark={dark} />
                <span
                  style={{
                    fontSize: "9px",
                    color: c.txt2,
                    fontWeight: 500,
                  }}
                >
                  {p.alias}
                </span>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default MarketPage;
