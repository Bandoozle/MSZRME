import type { AdminAccount } from "@/lib/platform/data/kpi";

export type AdminAccountExt = AdminAccount & {
  tier?: number;
  clientStage?: string;
};

export function admLoginDays(lastLogin: string): number {
  if (!lastLogin || lastLogin === "Now") return 0;
  const ll = lastLogin.toLowerCase();
  if (
    ll.includes("min") ||
    ll.includes("hr") ||
    ll.includes("hour")
  )
    return 0;
  const numMatch = ll.match(/(\d+)/);
  const num = numMatch ? parseInt(numMatch[1], 10) : 1;
  if (ll.includes("day")) return num;
  if (ll.includes("week")) return num * 7;
  if (ll.includes("month")) return num * 30;
  if (ll === "never") return 999;
  return 1;
}

export function admIsInactive(a: AdminAccount): boolean {
  return admLoginDays(a.lastLogin) >= 7;
}

export function admIsWarning(a: AdminAccount): boolean {
  const d = admLoginDays(a.lastLogin);
  return d >= 4 && d < 7;
}

export function admLastLoginColor(a: AdminAccount): string {
  const d = admLoginDays(a.lastLogin);
  if (d >= 7) return "#EF4444";
  if (d >= 4) return "#F59E0B";
  if (d >= 1) return "rgba(255,255,255,0.5)";
  return "#00B478";
}

export function admHealthScore(a: AdminAccount): number {
  const loginScore = Math.max(0, 100 - admLoginDays(a.lastLogin) * 12);
  const crScore = Math.min(a.cr * 1.4, 100);
  const mrrScore = a.mrr >= 550 ? 100 : a.mrr > 0 ? 60 : 0;
  const mcScore = Math.min(a.mc / 2, 100);
  return Math.round(
    loginScore * 0.35 + crScore * 0.3 + mrrScore * 0.2 + mcScore * 0.15
  );
}

export function admHealthColor(s: number): string {
  return s >= 80 ? "#00B478" : s >= 55 ? "#F59E0B" : "#EF4444";
}

export function admHealthLabel(s: number): string {
  return s >= 80 ? "Healthy" : s >= 55 ? "Moderate" : "At Risk";
}

export function admChurnRisk(a: AdminAccount): number {
  let risk = 0;
  if (admLoginDays(a.lastLogin) >= 7) risk += 40;
  if (admLoginDays(a.lastLogin) >= 14) risk += 20;
  if (a.status === "At Risk") risk += 25;
  if (a.cr < 45) risk += 15;
  if (a.plan === "Trial") risk += 20;
  if (a.mc < 50) risk += 10;
  return Math.min(risk, 100);
}

export function admChurnLabel(s: number): string {
  return s >= 70 ? "High" : s >= 35 ? "Medium" : "Low";
}

export function admChurnColor(s: number): string {
  return s >= 70 ? "#EF4444" : s >= 35 ? "#F59E0B" : "#00B478";
}
