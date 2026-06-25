import type { DealerPageId, StageId } from "@/lib/platform/data/nav";

export interface UserProfile {
  name: string;
  biz: string;
  initials: string;
  email?: string;
}

export interface StageInfo {
  label: string;
  rev: string;
  barPercent: number;
  barColor: string;
  progressText: string;
}

export interface CoachInfo {
  initials: string;
  name: string;
  status: string;
}

export interface StageProgressInfo {
  currentLabel: string;
  currentColor: string;
  nextLabel?: string;
  nextColor?: string;
  nextRev?: string;
  percent: number;
  ytdFormatted?: string;
  footerText: string;
  isBlank?: boolean;
}

export type { DealerPageId, StageId };
