/** Compact currency format from renderSalesTeam(). */
export function fmtSalesK(n: number): string {
  return n >= 1000
    ? "$" + (n / 1000).toFixed(n >= 100000 ? 0 : 1) + "K"
    : "$" + Math.round(n).toLocaleString();
}

export function paceColor(pct: number): string {
  if (pct >= 100) return "#00B478";
  if (pct >= 70) return "#00694A";
  if (pct >= 40) return "#F5A623";
  return "#C1121F";
}
