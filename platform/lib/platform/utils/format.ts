import { STAGE_DEFS, type StageDef, type StageId } from "../data/nav";

/** Format a dollar value for display (source: fm). */
export function fm(v: number | null | undefined): string {
  if (!v) return "—";
  if (v >= 1_000_000) return "$" + (v / 1_000_000).toFixed(2) + "M";
  if (v >= 1_000) return "$" + Math.round(v / 1_000).toLocaleString() + "K";
  return "$" + Math.round(v).toLocaleString();
}

/** Derive client stage id from annual revenue. */
export function getStage(annualRevenue: number): StageId {
  for (let i = STAGE_DEFS.length - 1; i >= 0; i--) {
    if (annualRevenue >= STAGE_DEFS[i].minRev) return STAGE_DEFS[i].id;
  }
  return "white";
}

/** Look up stage metadata by id. */
export function getStageData(stageId: StageId): StageDef {
  return STAGE_DEFS.find((s) => s.id === stageId) ?? STAGE_DEFS[0];
}

export const CURRENT_ACCOUNT_ID = "A001" as const;

export interface ServiceFeatureFlag {
  id: string;
  accounts: Record<string, boolean | undefined>;
}

/**
 * Dealer-side check for whether the Service Module is enabled.
 * Pass featureFlags when available; defaults to enabled when omitted.
 */
export function isServiceEnabled(
  featureFlags?: ServiceFeatureFlag[],
  accountId: string = CURRENT_ACCOUNT_ID
): boolean {
  if (!featureFlags) return true;
  const flag = featureFlags.find((f) => f.id === "ff-service");
  if (!flag) return true;
  return flag.accounts[accountId] !== false;
}
