// Ported from mszrme-dealer-runtime.js — renderSettings() seed data.

import type { TierId } from "./nav";

export type SettingsTab = "Account" | "Team" | "Preferences" | "Billing" | "Connected";

export const SETTINGS_TABS: SettingsTab[] = [
  "Account",
  "Team",
  "Preferences",
  "Billing",
  "Connected",
];

export type IntegrationStatus = "" | "connected" | "error";

export interface Integration {
  category: string;
  name: string;
  status: IntegrationStatus;
  desc: string;
  bg: string;
  color: string;
}

export interface IntegrationDetail {
  lastSync: string;
  syncedToday: number;
  mappings: { from: string; to: string; freq: string }[];
}

export interface TeamMember {
  name: string;
  role: "Owner" | "Admin" | "Technician" | "Office";
  email: string;
  avatar: string;
  color: string;
  cr: string;
  inst: number;
  mc: number;
  active: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: string;
  desc: string;
}

export interface ActiveSession {
  device: string;
  location: string;
  time: string;
  current: boolean;
}

export const NEXT_CALL_DATE = {
  date: "Tuesday, May 27",
  time: "10:00 AM PST",
  duration: "60 minutes",
} as const;

export const BACKUP_CODES = [
  "8F2A-K9LP",
  "3X7M-QN4R",
  "WP9C-H2VT",
  "6K1J-YB8S",
  "2NE5-DC3F",
  "TG4A-MW7X",
] as const;

export const ACCOUNT_FIELDS = [
  ["FIRST NAME", "John"],
  ["LAST NAME", "Smith"],
  ["BUSINESS NAME", "North Vancouver HVAC Solutions"],
  ["EMAIL", "john@northvanhvac.ca"],
  ["CITY", "North Vancouver, BC"],
  ["PHONE", "+1 604 555 0142"],
] as const;

export const INVOICES: Invoice[] = [
  {
    id: "INV-2026-005",
    date: "May 1, 2026",
    amount: 550,
    status: "Paid",
    desc: "MSZRME Pro — May 2026",
  },
  {
    id: "INV-2026-004",
    date: "Apr 1, 2026",
    amount: 550,
    status: "Paid",
    desc: "MSZRME Pro — Apr 2026",
  },
  {
    id: "INV-2026-003",
    date: "Mar 1, 2026",
    amount: 550,
    status: "Paid",
    desc: "MSZRME Pro — Mar 2026",
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "John Smith",
    role: "Owner",
    email: "john@northvanhvac.ca",
    avatar: "JS",
    color: "linear-gradient(135deg,#FF6D00,#FF4444)",
    cr: "66.7",
    inst: 2,
    mc: 3,
    active: true,
  },
  {
    name: "Mike Torres",
    role: "Technician",
    email: "mike@northvanhvac.ca",
    avatar: "MT",
    color: "linear-gradient(135deg,#003D2B,#00B478)",
    cr: "71.2",
    inst: 3,
    mc: 5,
    active: true,
  },
  {
    name: "Sarah Kim",
    role: "Technician",
    email: "sarah@northvanhvac.ca",
    avatar: "SK",
    color: "linear-gradient(135deg,#1B2D4F,#00694A)",
    cr: "58.3",
    inst: 1,
    mc: 2,
    active: false,
  },
  {
    name: "Lisa Chen",
    role: "Office",
    email: "lisa@northvanhvac.ca",
    avatar: "LC",
    color: "linear-gradient(135deg,#4A6A50,#7A9A7A)",
    cr: "—",
    inst: 0,
    mc: 0,
    active: true,
  },
];

export const ROLE_PERMISSIONS = [
  ["Owner", "#00694A", "Full access, billing, team management, all data"],
  ["Admin", "#00694A", "Full data access, cannot manage billing or delete account"],
  ["Technician", "#00B478", "Log numbers, view their own KPIs, messages with coach"],
  ["Office", "#4A6A50", "View dashboards, reports, scheduling — no data entry"],
] as const;

export const DISPLAY_TOGGLES = [
  "Show Installs section in Dashboard",
  "Show Sales Pipeline in Dashboard",
  "Show Service in Dashboard",
  "Show Log Numbers Installs tab",
  "Show Log Numbers Service tab",
] as const;

export const NOTIFICATION_PREFS: [string, string, boolean][] = [
  ["Daily Performance Summary", "Push + email", true],
  ["Goal Achievement Alerts", "Push only", true],
  ["Weekly Coach Report", "Email only", true],
  ["Market Pulse Updates", "Off", false],
];

export const ACTIVE_SESSIONS: ActiveSession[] = [
  {
    device: "MacBook Pro · Safari",
    location: "North Vancouver, BC",
    time: "Now",
    current: true,
  },
  {
    device: "iPhone 15 · MSZRME App",
    location: "North Vancouver, BC",
    time: "2h ago",
    current: false,
  },
];

export const INTEGRATIONS: Integration[] = [
  {
    category: "Accounting & Finance",
    name: "QuickBooks Online",
    status: "connected",
    desc: "Revenue, COGS, P&L, payroll — auto-populates GM calculator",
    bg: "#EBF5FF",
    color: "#0077C5",
  },
  {
    category: "Accounting & Finance",
    name: "Xero",
    status: "",
    desc: "Real-time P&L, cash flow, invoicing and bank reconciliation",
    bg: "#E8F4FC",
    color: "#13B5EA",
  },
  {
    category: "Accounting & Finance",
    name: "FreshBooks",
    status: "",
    desc: "Invoicing, expenses, time tracking for small trades businesses",
    bg: "#FFF0E8",
    color: "#FF6A3A",
  },
  {
    category: "Accounting & Finance",
    name: "Sage Accounting",
    status: "",
    desc: "Full accounting suite — strong in Canadian market",
    bg: "#F0F8F0",
    color: "#00B050",
  },
  {
    category: "Accounting & Finance",
    name: "Wave",
    status: "",
    desc: "Free accounting and invoicing — popular for smaller operators",
    bg: "#F0F0FF",
    color: "#5C35CC",
  },
  {
    category: "Accounting & Finance",
    name: "Zoho Books",
    status: "",
    desc: "Accounts payable/receivable, GST/HST filing",
    bg: "#FFF5E8",
    color: "#E8681A",
  },
  {
    category: "CRM & Sales",
    name: "HubSpot CRM",
    status: "connected",
    desc: "Contacts, deals, pipeline — maps to closing ratio and lead tracking",
    bg: "#FFF5F0",
    color: "#FF7A59",
  },
  {
    category: "CRM & Sales",
    name: "Salesforce",
    status: "",
    desc: "Enterprise CRM — opportunities, accounts, service contracts",
    bg: "#E8F4FF",
    color: "#00A1E0",
  },
  {
    category: "CRM & Sales",
    name: "Pipedrive",
    status: "",
    desc: "Visual sales pipeline — estimates, follow-ups, won/lost deals",
    bg: "#FFF0F5",
    color: "#C0392B",
  },
  {
    category: "CRM & Sales",
    name: "Zoho CRM",
    status: "",
    desc: "Leads, contacts, sales forecasting, email integration",
    bg: "#FFF5E8",
    color: "#E8681A",
  },
  {
    category: "Field Service Management",
    name: "ServiceTitan",
    status: "connected",
    desc: "Jobs, dispatch, technician performance, install revenue",
    bg: "#F5F0FF",
    color: "#7B2FBE",
  },
  {
    category: "Field Service Management",
    name: "Jobber",
    status: "",
    desc: "Quoting, scheduling, invoicing — syncs job revenue to dashboard",
    bg: "#EDFDF5",
    color: "#00A859",
  },
  {
    category: "Field Service Management",
    name: "Housecall Pro",
    status: "",
    desc: "Scheduling, estimates, payments — HVAC-specific workflows",
    bg: "#E8F0FF",
    color: "#3554D1",
  },
  {
    category: "Field Service Management",
    name: "FieldEdge",
    status: "",
    desc: "HVAC-specific: service agreements, equipment history, dispatch",
    bg: "#FFF8E8",
    color: "#F5A623",
  },
  {
    category: "Marketing Platforms",
    name: "Meta Ads",
    status: "",
    desc: "Facebook & Instagram ad spend, CPL, ROAS by campaign",
    bg: "#E8F0FF",
    color: "#1877F2",
  },
  {
    category: "Marketing Platforms",
    name: "Google Ads",
    status: "",
    desc: "Search & local service ad spend, impressions, lead volume",
    bg: "#FFF8E8",
    color: "#EA4335",
  },
  {
    category: "Marketing Platforms",
    name: "Google Analytics",
    status: "",
    desc: "Website traffic, lead source attribution, conversion tracking",
    bg: "#FFF5E8",
    color: "#F9AB00",
  },
  {
    category: "Marketing Platforms",
    name: "Google Business Profile",
    status: "",
    desc: "Reviews, local search ranking, calls and direction requests",
    bg: "#E8FFF0",
    color: "#0F9D58",
  },
  {
    category: "Marketing Platforms",
    name: "Mailchimp",
    status: "",
    desc: "Email campaign performance, open rates, unsubscribes",
    bg: "#FFFCE8",
    color: "#FFE01B",
  },
  {
    category: "Marketing Platforms",
    name: "Klaviyo",
    status: "",
    desc: "Email & SMS marketing flows, revenue attribution",
    bg: "#F5F0FF",
    color: "#6B2FBE",
  },
  {
    category: "Social & Reputation",
    name: "Instagram Business",
    status: "",
    desc: "Follower growth, reach, post engagement, story views",
    bg: "#FFF0F8",
    color: "#C13584",
  },
  {
    category: "Social & Reputation",
    name: "LinkedIn",
    status: "",
    desc: "Company page analytics, content reach, follower demographics",
    bg: "#E8F4FF",
    color: "#0A66C2",
  },
  {
    category: "Payments",
    name: "Stripe",
    status: "",
    desc: "Payment processing, MRR, churn, subscription metrics",
    bg: "#F0F0FF",
    color: "#635BFF",
  },
  {
    category: "Payments",
    name: "Square",
    status: "",
    desc: "In-person and online payments, cash flow, transaction history",
    bg: "#F5F5F5",
    color: "#222222",
  },
  {
    category: "Communication",
    name: "Gmail / Google Workspace",
    status: "",
    desc: "Email thread tracking, response times, client communications",
    bg: "#FFF5F0",
    color: "#EA4335",
  },
  {
    category: "Communication",
    name: "Slack",
    status: "",
    desc: "Team notifications — alerts for new leads, KPI milestones",
    bg: "#F5F0FF",
    color: "#4A154B",
  },
];

export const INTEGRATION_DETAILS: Record<string, IntegrationDetail> = {
  "QuickBooks Online": {
    lastSync: "2 min ago",
    syncedToday: 412,
    mappings: [
      { from: "Income → Service Revenue (Account 4100)", to: "Service Revenue", freq: "Daily" },
      { from: "Income → Install Revenue (Account 4200)", to: "Install Revenue", freq: "Daily" },
      { from: "Income → Maintenance Agmts (Account 4300)", to: "Maintenance Revenue", freq: "Daily" },
      { from: "COGS → Materials (Account 5100)", to: "COGS", freq: "Daily" },
      { from: "COGS → Labour (Account 5200)", to: "Labour Cost", freq: "Daily" },
      { from: "Profit & Loss Summary", to: "Gross Margin %", freq: "Daily" },
      { from: "Balance Sheet → Cash", to: "Cash on Hand", freq: "Daily" },
    ],
  },
  "HubSpot CRM": {
    lastSync: "8 min ago",
    syncedToday: 17,
    mappings: [
      { from: "Contacts created", to: "Total Leads", freq: "Real-time" },
      { from: "Deal pipeline → Closed Won", to: "Sales Count", freq: "Real-time" },
      { from: "Deal source attribution", to: "Lead Source ROI", freq: "Daily" },
      { from: "Deal → Estimate Sent", to: "Estimates Given", freq: "Real-time" },
      { from: "Closed Won / Estimates", to: "Closing Ratio", freq: "Real-time" },
      { from: "Lifecycle stage history", to: "Avg Sales Cycle", freq: "Daily" },
    ],
  },
  ServiceTitan: {
    lastSync: "5 min ago",
    syncedToday: 38,
    mappings: [
      { from: "Jobs → Completed", to: "Install Count", freq: "Real-time" },
      { from: "Jobs → Demand Service", to: "Demand Service Calls", freq: "Real-time" },
      { from: "Jobs → Maintenance", to: "Maintenance Calls", freq: "Real-time" },
      { from: "Memberships → Active", to: "Maintenance Agreements", freq: "Real-time" },
      { from: "Estimates → Sold", to: "Closing Ratio", freq: "Real-time" },
      { from: "Invoice Avg Total", to: "Avg Sales Ticket", freq: "Daily" },
      { from: "Jobs → Callback / Recall", to: "Callback Rate", freq: "Daily" },
      { from: "Lead Source by Job", to: "Lead Source Attribution", freq: "Real-time" },
    ],
  },
};

export const DEFAULT_CURRENT_TIER: TierId = 2;
