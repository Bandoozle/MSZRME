"use client";

import { STAGE_DEFS, type StageId } from "@/lib/platform/data/nav";
import { getStageData } from "@/lib/platform/utils/format";

interface Props {
  currentStage: StageId;
}

export function StageListBody({ currentStage }: Props) {
  return (
    <>
      {STAGE_DEFS.map((s, i) => {
        const isActive = s.id === currentStage;
        const isLast = i === STAGE_DEFS.length - 1;
        const divider = isLast ? "" : "0.5px solid rgba(0,0,0,0.08)";
        const dotBorder = s.id === "white" ? "1px solid #E0E0E0" : "none";

        return (
          <div
            key={s.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "14px 20px",
              borderBottom: divider,
              background: isActive ? s.bg : undefined,
            }}
          >
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: s.color,
                flexShrink: 0,
                border: dotBorder,
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? s.color : "#0A160A",
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#4A6A50",
                  marginTop: "1px",
                }}
              >
                {s.rev}
              </div>
            </div>
            {isActive ? (
              <div
                style={{
                  background: s.color,
                  color: "white",
                  fontSize: "10px",
                  fontWeight: 800,
                  padding: "4px 12px",
                  borderRadius: "20px",
                  letterSpacing: ".4px",
                  flexShrink: 0,
                }}
              >
                YOUR LEVEL
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

export function stageModalHeader(currentStage: StageId) {
  const s = getStageData(currentStage);
  return {
    label: s.label,
    rev: s.rev,
    dotColor: s.color,
  };
}
