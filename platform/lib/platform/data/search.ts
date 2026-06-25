import type { DealerPageId } from "./nav";

export interface SearchIndexItem {
  label: string;
  page: DealerPageId;
  icon: string;
}

/** Dealer global search index (source: SEARCH_INDEX). */
export const SEARCH_INDEX: SearchIndexItem[] = [
  { label: "Dashboard", page: "dashboard", icon: "🏠" },
  { label: "Financials — P&L Report", page: "financials", icon: "💰" },
  { label: "Log Numbers — Daily KPIs", page: "lognumbers", icon: "📋" },
  { label: "Market Pulse — Regional Benchmarks", page: "market", icon: "🌐" },
  { label: "Messages — Tom", page: "messages", icon: "💬" },
  { label: "Seasonal Planner — Grants & Weather", page: "seasonal", icon: "📅" },
  { label: "Reports — PDF Downloads", page: "reports", icon: "📄" },
  { label: "GM Calculator", page: "calculator", icon: "🧮" },
  { label: "Settings", page: "settings", icon: "⚙️" },
];
