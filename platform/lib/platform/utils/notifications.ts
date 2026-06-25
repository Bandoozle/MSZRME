import { GOALS, type GoalsStore, type KpiPeriod, type KpiPeriodKey } from "../data/kpi";
import { STAGE_DEFS, type StageId } from "../data/nav";
import { getStage, getStageData } from "./format";

export type NotificationType = "call" | "warn" | "win" | "grant" | "milestone";

export interface PlatformNotification {
  id: string;
  type: NotificationType;
  icon: string;
  title: string;
  body: string;
  action: string;
  page: string;
  time: string;
  read: boolean;
}

const TYPE_COLORS: Record<NotificationType, string> = {
  call: "#1A4DB0",
  warn: "#C62828",
  win: "#00694A",
  grant: "#F5A623",
  milestone: "#00B478",
};

export function notificationColor(type: NotificationType): string {
  return TYPE_COLORS[type] ?? "#7A9A7A";
}

/** Build dynamic notification list (source: buildNotifs). */
export function buildNotifications(
  period: KpiPeriodKey,
  kpiPeriod: KpiPeriod,
  currentStage: StageId
): PlatformNotification[] {
  const notifs: PlatformNotification[] = [];
  const g = GOALS[period] ?? ({} as GoalsStore[KpiPeriodKey]);
  const d = kpiPeriod;

  notifs.push({
    id: "call1",
    type: "call",
    icon: "📅",
    title: "Coaching call in 2 days",
    body: "Tuesday May 27 · 10:00 AM PST · Prepare your numbers",
    action: "View Briefing",
    page: "dashboard",
    time: "2d",
    read: false,
  });

  if ((d.cr || 52) < 50) {
    notifs.push({
      id: "kpi1",
      type: "warn",
      icon: "⚠️",
      title: "Closing ratio below 50%",
      body: `Currently ${(d.cr || 52).toFixed(1)}% — target is 60%. Review estimate follow-up process.`,
      action: "Log Numbers",
      page: "lognumbers",
      time: "Today",
      read: false,
    });
  }

  if ((d.tsr || 0) > (g.rev || 0) * 0.9) {
    notifs.push({
      id: "kpi2",
      type: "win",
      icon: "🎯",
      title: "Revenue target almost hit",
      body: `You're at ${Math.round(((d.tsr || 0) / (g.rev || 1)) * 100)}% of your ${period} target. Strong close.`,
      action: "View Dashboard",
      page: "dashboard",
      time: "Now",
      read: true,
    });
  }

  notifs.push({
    id: "grant1",
    type: "grant",
    icon: "💰",
    title: "CleanBC grant deadline — Aug 31",
    body: "You have 3 pending installs eligible for up to $18,000 in rebates.",
    action: "Seasonal Planner",
    page: "seasonal",
    time: "3mo",
    read: false,
  });

  notifs.push({
    id: "mile1",
    type: "milestone",
    icon: "⭐",
    title: "Milestone unlocked: 60-day log streak",
    body: "Consistent daily logging is a Tier 2 progression milestone. Well done.",
    action: "View Goals",
    page: "goals",
    time: "Yesterday",
    read: true,
  });

  const annualRunRate = (d.tsr + d.svr) * 12;
  const derivedStage = getStage(annualRunRate);
  const currentStageData = getStageData(currentStage);
  const derivedStageData = getStageData(derivedStage);
  const currentIdx = STAGE_DEFS.findIndex((s) => s.id === currentStageData.id);
  const derivedIdx = STAGE_DEFS.findIndex((s) => s.id === derivedStageData.id);

  if (derivedIdx > currentIdx) {
    notifs.unshift({
      id: "stage-upgrade",
      type: "win",
      icon: "🚀",
      title: `You've grown into ${derivedStageData.label} stage`,
      body: `Your annualised revenue of $${Math.round(annualRunRate / 1000)}K has crossed the ${derivedStageData.rev} threshold. Your coach will review your stage.`,
      action: "View Settings",
      page: "settings",
      time: "Now",
      read: false,
    });
  }

  return notifs;
}
