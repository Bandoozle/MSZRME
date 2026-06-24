// ─────────────────────────────────────────────────────────────────────────────
// MSZRME Platform — Core TypeScript types
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = "dealer" | "admin" | "new";
export type DealerStage = "orange" | "red" | "green" | "purple" | "blue" | "black";
export type DealerPage =
  | "dashboard" | "lognumbers" | "goals" | "financials"
  | "calculator" | "market" | "seasonal" | "reports"
  | "messages" | "notes" | "settings" | "salesteam" | "ev";
export type AdminPage =
  | "overview" | "accounts" | "analytics" | "billing" | "invoices"
  | "comms" | "config" | "financials-admin" | "inputs" | "logs"
  | "support" | "system";

export interface AuthUser {
  email: string;
  role: UserRole;
  name: string;
  biz: string;
  initials: string;
  stage: DealerStage;
  tier: number;
}

export interface KPIPeriod {
  installs: number;
  installRev: number;
  installTarget: number;
  closingRatio: number;
  avgTicket: number;
  avgTicketTarget: number;
  serviceRev: number;
  maintenanceContracts: number;
  maintenanceTarget: number;
  demandService: number;
  leads: number;
  estimates: number;
  closedSales: number;
  equipmentInstalls: number;
  callbackRate: number;
  maintenanceCalls: number;
  demandCalls: number;
  totalRev: number;
  revTarget: number;
}

export interface KPIData {
  Day: KPIPeriod;
  Week: KPIPeriod;
  Month: KPIPeriod;
  YTD: KPIPeriod;
  Year: KPIPeriod;
}

export interface Peer {
  alias: string;
  biz: string;
  rev: number;
  growth: number;
  svc: number;
  ast: number;
  you?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  online: boolean;
  lastTime: string;
  preview: string;
  unread?: number;
}

export interface Message {
  me: boolean;
  text: string;
  time: string;
}

export interface Threads {
  [contactId: string]: Message[];
}

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  biz: string;
  stage: DealerStage;
  status: "Active" | "At Risk" | "Inactive" | "New";
  mrr: number;
  lastLogin: string;
  tier: number;
  phone?: string;
  city?: string;
  province?: string;
  joinDate?: string;
  notes?: string;
  contractEnd?: string;
}

export interface WeatherSignal {
  label: string;
  impact: string;
  window: string;
  hot?: boolean;
}

export interface CoopFund {
  name: string;
  available: string;
  used: string;
  total: string;
  match: string;
  expires: string;
}

export interface UtilityProgram {
  program: string;
  amount: string;
  audience: string;
  notes: string;
  active: boolean;
}

export interface MarketingInputs {
  region: string;
  weather: WeatherSignal[];
  coop: CoopFund[];
  utility: UtilityProgram[];
}

export interface Note {
  id: number;
  title: string;
  body: string;
  date: string;
  pinned?: boolean;
  checklist?: ChecklistItem[];
}

export interface ChecklistItem {
  id: number;
  text: string;
  done: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
