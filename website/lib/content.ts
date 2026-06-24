// Shared content + the eight-stage colour system, reused across pages.

export const STAGE_COLORS = {
  white: "#C9CDD6",
  yellow: "#FBBF24",
  orange: "#FB923C",
  red: "#EF4444",
  green: "#00B478",
  purple: "#A88BFF",
  blue: "#5AA9FF",
  black: "#1d1d1f",
} as const;

export type StageKey = keyof typeof STAGE_COLORS;

export interface Stage {
  key: StageKey;
  name: string;
  band: string;
  desc: string;
  dark?: boolean;
}

export const STAGES: Stage[] = [
  { key: "white",  name: "White",  band: "Just starting",    desc: "Get the core numbers right and build the daily logging habit." },
  { key: "yellow", name: "Yellow", band: "Finding rhythm",    desc: "Consistent logging turns into your first clear monthly picture." },
  { key: "orange", name: "Orange", band: "Building",          desc: "Goals and KPIs drive the week. The team starts rowing together." },
  { key: "red",    name: "Red",    band: "Scaling pressure",  desc: "Volume rises. Financials keep margin honest as you grow." },
  { key: "green",  name: "Green",  band: "$2.4–5M",           desc: "Real momentum. Coaching sharpens from monthly to biweekly." },
  { key: "purple", name: "Purple", band: "Established",        desc: "A mature operation running on numbers, not on heroics." },
  { key: "blue",   name: "Blue",   band: "Market leader",     desc: "Multi-location command and the data to back every call." },
  { key: "black",  name: "Black",  band: "$15M+",             desc: "The summit. Advisory, exit-readiness, and the full toolkit.", dark: true },
];

export interface Tier {
  badge?: string;
  name: string;
  tag: string;
  price: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

export const TIERS: Tier[] = [
  { name: "Base", tag: "Get the numbers right", price: "$750",
    features: ["Full KPI dashboard", "Daily & weekly logging", "GM calculator", "Quarterly check-in"],
    cta: "Choose Base" },
  { name: "Starter", tag: "Measure, set, hit", price: "$999", badge: "Most popular", featured: true,
    features: ["Everything in Base", "Goal & milestone tracking", "Full Financials (P&L)", "Monthly 1-on-1 coaching"],
    cta: "Start free trial" },
  { name: "Growth", tag: "Scale with intent", price: "$1,899",
    features: ["Everything in Starter", "Biweekly coaching", "Market intel reports", "Performance reports"],
    cta: "Choose Growth" },
  { name: "Scale", tag: "Built for the climb", price: "$3,500",
    features: ["Everything in Growth", "Weekly coaching", "Advisory & exit-readiness", "Priority support"],
    cta: "Choose Scale" },
];

import type { CSSProperties } from "react";
/** Sets the --c custom property used by stage-accented cards. */
export const accent = (color: string): CSSProperties => ({ "--c": color } as CSSProperties);
