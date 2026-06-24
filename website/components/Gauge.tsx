// Instrument-cluster gauge — the product's signature, rendered as clean SVG.
// Pure/computed, so it stays a server component.

export interface GaugeProps {
  pct: number;
  color: string;
  val: string;
  label: string;
  sub: string;
}

const VB_W = 140;
const VB_H = 132;
const CX = 70;
const CY = 78;
const R = 46;
const SW = 7;
const START = 135;
const SWEEP = 270;

const LABEL_STYLE = {
  fontSize: 9,
  fontWeight: 600,
  letterSpacing: "0.36",
  fill: "var(--ink-3)",
} as const;

const SUB_STYLE = {
  fontSize: 10,
  fontWeight: 600,
  fill: "var(--green-bright)",
} as const;

export default function Gauge({ pct, color, val, label, sub }: GaugeProps) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const pt = (d: number, r: number): [number, number] => [
    CX + r * Math.cos(rad(d)),
    CY + r * Math.sin(rad(d)),
  ];
  const arc = (s: number, e: number, r: number) => {
    const p1 = pt(s, r);
    const p2 = pt(e, r);
    const lg = Math.abs(e - s) > 180 ? 1 : 0;
    return `M ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} A ${r} ${r} 0 ${lg} 1 ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  };

  const vd = START + SWEEP * Math.min(pct, 1);
  const tip = pt(vd, R - 2);
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div className="pv-g">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        height="100%"
        className="pv-g-svg"
        role="img"
        aria-labelledby={`gauge-${slug}`}
      >
        <title id={`gauge-${slug}`}>{`${label}: ${val}`}</title>

        <text
          x={CX}
          y={13}
          textAnchor="middle"
          {...LABEL_STYLE}
          style={{ textTransform: "uppercase" }}
        >
          {label}
        </text>

        <path
          d={arc(START, START + SWEEP, R)}
          fill="none"
          stroke="#e6e6eb"
          strokeWidth={SW}
          strokeLinecap="round"
        />
        <path
          d={arc(START, vd, R)}
          fill="none"
          stroke={color}
          strokeWidth={SW}
          strokeLinecap="round"
        />
        <line
          x1={CX}
          y1={CY}
          x2={tip[0].toFixed(1)}
          y2={tip[1].toFixed(1)}
          stroke="#1d1d1f"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle cx={CX} cy={CY} r={4} fill="#1d1d1f" />

        <text
          x={CX}
          y={108}
          textAnchor="middle"
          fontSize={19}
          fontWeight={700}
          letterSpacing="-0.38"
          fill={color}
        >
          {val}
        </text>
        <text
          x={CX}
          y={122}
          textAnchor="middle"
          {...SUB_STYLE}
        >
          {sub}
        </text>
      </svg>
    </div>
  );
}
