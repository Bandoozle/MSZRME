// Instrument-cluster gauge — the product's signature, rendered as clean SVG.
// Pure/computed, so it stays a server component.

export interface GaugeProps {
  pct: number;
  color: string;
  val: string;
  label: string;
  sub: string;
}

export default function Gauge({ pct, color, val, label, sub }: GaugeProps) {
  const cx = 70, cy = 72, R = 52, sw = 8, start = 135, sweep = 270;
  const rad = (d: number) => (d * Math.PI) / 180;
  const pt = (d: number, r: number): [number, number] => [cx + r * Math.cos(rad(d)), cy + r * Math.sin(rad(d))];
  const arc = (s: number, e: number, r: number) => {
    const p1 = pt(s, r), p2 = pt(e, r);
    const lg = Math.abs(e - s) > 180 ? 1 : 0;
    return `M ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} A ${r} ${r} 0 ${lg} 1 ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  };
  const vd = start + sweep * Math.min(pct, 1);
  const tip = pt(vd, R - 2);

  return (
    <div className="pv-g">
      <div className="gl">{label}</div>
      <svg viewBox="0 0 140 100" width="100%" style={{ maxWidth: 150, overflow: "visible" }}>
        <path d={arc(start, start + sweep, R)} fill="none" stroke="#e6e6eb" strokeWidth={sw} strokeLinecap="round" />
        <path d={arc(start, vd, R)} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={tip[0].toFixed(1)} y2={tip[1].toFixed(1)} stroke="#1d1d1f" strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={4} fill="#1d1d1f" />
      </svg>
      <div className="gv" style={{ color }}>{val}</div>
      <div className="gs">{sub}</div>
    </div>
  );
}
