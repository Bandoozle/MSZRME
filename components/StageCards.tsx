import { STAGES, STAGE_COLORS, accent } from "@/lib/content";

export default function StageCards() {
  return (
    <div className="stage-cards" style={{ marginTop: 0 }}>
      {STAGES.map((s) => (
        <div key={s.key} className={"st-card" + (s.dark ? " dark" : "")} style={accent(STAGE_COLORS[s.key])}>
          <div className="dot" />
          <div className="nm">{s.name}</div>
          <div className="bd" style={s.dark ? { color: "#7DEEC0" } : undefined}>{s.band}</div>
          <div className="ds">{s.desc}</div>
        </div>
      ))}
    </div>
  );
}
