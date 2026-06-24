import Gauge, { GaugeProps } from "./Gauge";

const PRESETS: Record<string, GaugeProps[]> = {
  hero: [
    { pct: 1,     color: "#2E5BFF", val: "250%",  label: "Install vs Target", sub: "On $14K" },
    { pct: 0.667, color: "#00B478", val: "66.7%", label: "Closing Ratio",     sub: "On 3 est." },
    { pct: 0.94,  color: "#00B478", val: "$8K",   label: "Avg Ticket",        sub: "Tgt $8.5K" },
  ],
  service: [
    { pct: 0.7,  color: "#2E5BFF", val: "$2K", label: "Service Rev",     sub: "Of $1K tgt" },
    { pct: 0.45, color: "#FBBF24", val: "3",   label: "Maint. Agmt",     sub: "Of 11 tgt" },
    { pct: 0.6,  color: "#A88BFF", val: "2",   label: "Demand Service",  sub: "Avg $580" },
  ],
};

export default function GaugeCluster({ preset = "hero", bare = false }: { preset?: keyof typeof PRESETS; bare?: boolean }) {
  const gauges = PRESETS[preset].map((g, i) => <Gauge key={i} {...g} />);
  if (bare) return <div className="pv-gauges">{gauges}</div>;
  return (
    <div className="cluster">
      <div className="cluster-row">{gauges}</div>
    </div>
  );
}
