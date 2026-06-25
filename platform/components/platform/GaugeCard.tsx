"use client";

export type GaugePalette = "blue" | "green" | "silver";

export interface GaugeCardProps {
  label: string;
  val: string;
  sub?: string;
  pct: number;
  warn?: boolean;
  pal?: GaugePalette;
}

export function GaugeCard({ label, val, sub, pct, warn, pal }: GaugeCardProps) {
  let ringColor: string;
  let ringColorEnd: string;
  const valColor = "var(--g-val)";

  if (warn) {
    ringColor = "#FF453A";
    ringColorEnd = "#FF6961";
  } else if (pal === "blue") {
    ringColor = "#0A84FF";
    ringColorEnd = "#5AC8FA";
  } else if (pal === "silver") {
    ringColor = "#5E5CE6";
    ringColorEnd = "#7D7AFF";
  } else {
    ringColor = "#30D158";
    ringColorEnd = "#34E37E";
  }

  const gid = "ring" + label.replace(/\W/g, "");
  const size = 132;
  const cx = 66;
  const cy = 66;
  const sw = 12;
  const R = cx - sw / 2 - 2;
  const circ = 2 * Math.PI * R;
  const clampedPct = Math.max(0, Math.min(pct, 1));
  const dash = circ * clampedPct;
  const gap = circ - dash;

  return (
    <div
      className="apl-gauge"
      style={{
        background: "var(--g-card)",
        borderRadius: "18px",
        padding: "18px 14px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "var(--g-shadow)",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--g-lbl)",
          textAlign: "center",
          marginBottom: "14px",
          letterSpacing: "-0.01em",
          lineHeight: 1.25,
          minHeight: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "132px",
          aspectRatio: "1",
        }}
      >
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width="100%"
          style={{ maxWidth: `${size}px`, display: "block" }}
        >
          <defs>
            <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={ringColor} />
              <stop offset="100%" stopColor={ringColorEnd} />
            </linearGradient>
          </defs>
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke="var(--g-track)"
            strokeWidth={sw}
          />
          {clampedPct > 0 && (
            <circle
              cx={cx}
              cy={cy}
              r={R}
              fill="none"
              stroke={`url(#${gid})`}
              strokeWidth={sw}
              strokeLinecap="round"
              strokeDasharray={`${dash.toFixed(2)} ${gap.toFixed(2)}`}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{
                transition: "stroke-dasharray .8s cubic-bezier(0.25,0.8,0.25,1)",
              }}
            />
          )}
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontSize: "clamp(19px,4.4vw,26px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: valColor,
              lineHeight: 1,
              fontFamily:
                '-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro","Inter",sans-serif',
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {val}
          </div>
          {sub ? (
            <div
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: ringColor,
                marginTop: "5px",
                letterSpacing: "-0.01em",
                maxWidth: "96px",
              }}
            >
              {sub}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default GaugeCard;
