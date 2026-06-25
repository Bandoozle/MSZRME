import type { KpiPeriod } from "../data/kpi";
import { STAGE_DEFS, type StageId } from "../data/nav";
import { fm, getStageData } from "./format";
import type { StageInfo, StageProgressInfo } from "@/components/platform/types";

/** Sidebar stage card info (source: updateStageBadge). */
export function computeStageInfo(stageId: StageId, ytdRevenue: number): StageInfo {
  const s = getStageData(stageId);
  const idx = STAGE_DEFS.findIndex((x) => x.id === stageId);
  const next = idx < STAGE_DEFS.length - 1 ? STAGE_DEFS[idx + 1] : null;

  if (next) {
    const pct = Math.max(
      0,
      Math.min(100, ((ytdRevenue - s.minRev) / (s.maxRev - s.minRev)) * 100)
    );
    return {
      label: `${s.label} ●`,
      rev: s.rev,
      barPercent: pct,
      barColor: s.color,
      progressText: `${pct.toFixed(0)}% to ${next.label} Stage`,
    };
  }

  return {
    label: `${s.label} ●`,
    rev: s.rev,
    barPercent: 100,
    barColor: s.color,
    progressText: "Top stage reached",
  };
}

/** Right-sidebar stage progress block (source: updateRightSidebar). */
export function computeStageProgress(
  stageId: StageId,
  yearKpi: KpiPeriod
): StageProgressInfo {
  const stage = getStageData(stageId);
  const idx = STAGE_DEFS.findIndex((s) => s.id === stageId);
  const next = idx < STAGE_DEFS.length - 1 ? STAGE_DEFS[idx + 1] : null;
  const ytd = yearKpi.tsr || 0;
  const isBlank =
    !yearKpi.tsr &&
    !yearKpi.svr &&
    !yearKpi.leads &&
    !yearKpi.sales &&
    !yearKpi.mc &&
    !yearKpi.dc;

  if (isBlank || !next) {
    return {
      currentLabel: stage.label,
      currentColor: stage.color,
      nextLabel: next?.label,
      nextColor: next?.color,
      nextRev: next
        ? next.minRev >= 1_000_000
          ? `$${next.minRev / 1_000_000}M`
          : `$${next.minRev / 1000}K`
        : undefined,
      percent: 0,
      footerText: isBlank
        ? "Log your first year to start tracking stage progress"
        : "You've reached the top stage",
      isBlank,
    };
  }

  const pct = Math.max(
    0,
    Math.min(100, ((ytd - stage.minRev) / (stage.maxRev - stage.minRev)) * 100)
  );
  const ytdFmt =
    ytd >= 1_000_000
      ? `$${(ytd / 1_000_000).toFixed(2)}M`
      : `$${Math.round(ytd / 1000)}K`;
  const nextRev =
    next.minRev >= 1_000_000
      ? `$${next.minRev / 1_000_000}M`
      : `$${next.minRev / 1000}K`;

  return {
    currentLabel: stage.label,
    currentColor: stage.color,
    nextLabel: next.label,
    nextColor: next.color,
    nextRev,
    percent: pct,
    ytdFormatted: ytdFmt,
    footerText: `${ytdFmt} YTD · ${pct.toFixed(0)}% to ${next.label}`,
    isBlank: false,
  };
}

export function formatStageRev(rev: number): string {
  return fm(rev);
}
