import { STAGE_COLORS } from "@/lib/content";

export default function StageProgression() {
  return (
    <div className="stages" style={{ marginTop: 0 }}>
      <div className="stage-track">
        <span className="stage-seg" style={{ background: STAGE_COLORS.white }} />
        <span className="stage-seg" style={{ background: STAGE_COLORS.yellow }} />
        <span className="stage-seg" style={{ background: STAGE_COLORS.orange }} />
        <span className="stage-seg" style={{ background: STAGE_COLORS.red }} />
        <span className="stage-seg you" style={{ background: "linear-gradient(90deg,#00694A,#00B478)" }} />
        <span className="stage-seg" style={{ background: STAGE_COLORS.purple }} />
        <span className="stage-seg" style={{ background: STAGE_COLORS.blue }} />
        <span className="stage-seg" style={{ background: STAGE_COLORS.black }} />
      </div>
      <div className="stage-labels"><span>White</span><span>Green &middot; $2.4&ndash;5M</span><span>Black &middot; $15M+</span></div>
    </div>
  );
}
