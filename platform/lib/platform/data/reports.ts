// Ported from mszrme-dealer-runtime.js — renderReports() catalog.

export interface ReportCatalogItem {
  title: string;
  desc: string;
  icon: string;
  period: string;
}

export const REPORT_CATALOG: ReportCatalogItem[] = [
  {
    title: "Monthly KPI Summary",
    desc: "Revenue, contracts, margins, and goals for the current month",
    icon: "📊",
    period: "May 2026",
  },
  {
    title: "Market Position Report",
    desc: "Your market rank, peer comparison, and growth vs competitors",
    icon: "🗺️",
    period: "May 2026",
  },
  {
    title: "GM & Profitability Analysis",
    desc: "Gross margin breakdown by category with improvement recommendations",
    icon: "💰",
    period: "Q2 2026",
  },
  {
    title: "Coaching Progress Report",
    desc: "Milestone progress, tier standing, and coaching action items",
    icon: "🎯",
    period: "YTD 2026",
  },
];

export const REPORT_TITLES = [
  "Monthly KPI Summary — May 2026",
  "Market Position Report — May 2026",
  "GM & Profitability Analysis — Q2 2026",
  "Coaching Progress Report — YTD 2026",
] as const;
