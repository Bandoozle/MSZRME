// Ported from mszrme-dealer-runtime.js — values must match exactly.

export type KpiPeriodKey = "Day" | "Week" | "Month" | "YTD" | "Year";

export interface KpiPeriod {
  tsr: number;
  tgt: number;
  leads: number;
  mktLeads: number;
  techLeads: number;
  est: number;
  sales: number;
  inst: number;
  ir: number;
  zcb: number;
  mc: number;
  dc: number;
  amc: number;
  adc: number;
  svr: number;
  zsc: number;
  cbr: number;
  cr: number;
  ast: number;
  chart: (number | null)[];
  gm?: number;
  nsr?: number;
  svc?: number;
}

export type KpiStore = Record<KpiPeriodKey, KpiPeriod>;

export interface GoalsPeriod {
  rev: number;
  cr: number;
  inst: number;
  mc: number;
  ast: number;
  svr: number;
}

export type GoalsStore = Record<KpiPeriodKey, GoalsPeriod>;

export interface Peer {
  alias: string;
  biz: string;
  rev: number;
  growth: number;
  ast: number;
  svc: number;
  color: string;
  you: boolean;
}

export interface Contact {
  name: string;
  role: string;
  color: string;
  online: boolean;
  init: string;
}

export interface ThreadMessage {
  from: "them" | "me";
  text: string;
  t: string;
}

export type ThreadsStore = Record<string, ThreadMessage[]>;

export type UserRole = "dealer" | "admin";

export interface UserRecord {
  pw: string;
  role: UserRole;
  name: string;
  firstTime?: boolean;
}

export type UsersStore = Record<string, UserRecord>;

export interface AdminAccount {
  id: string;
  alias: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  stage: string;
  contact: string;
  type: string;
  mrr: number;
  status: string;
  lastLogin: string;
  cr: number;
  rev: number;
  mc: number;
  inst: number;
  joined: string;
  plan: string;
  tfa: boolean;
  sessions: number;
  billingDay: number;
  credits: number;
  notes: string;
}

export type AccountKpiStore = Record<string, Partial<KpiStore> | null>;

export const KPI: KpiStore = {
  Day: {
    tsr: 22800,
    tgt: 9590,
    leads: 4,
    mktLeads: 2,
    techLeads: 2,
    est: 3,
    sales: 2,
    inst: 1,
    ir: 14400,
    zcb: 0,
    mc: 3,
    dc: 2,
    amc: 420,
    adc: 580,
    svr: 2020,
    zsc: 0,
    cbr: 0,
    cr: 66.7,
    ast: 7600,
    chart: [
      18000,
      22000,
      19000,
      24000,
      21000,
      23000,
      22800
    ]
  },
  Week: {
    tsr: 76000,
    tgt: 67300,
    leads: 22,
    mktLeads: 12,
    techLeads: 10,
    est: 16,
    sales: 9,
    inst: 4,
    ir: 48000,
    zcb: 0,
    mc: 14,
    dc: 9,
    amc: 430,
    adc: 570,
    svr: 8670,
    zsc: 1,
    cbr: 0,
    cr: 56.3,
    ast: 7650,
    chart: [
      62000,
      68000,
      71000,
      74000,
      73000,
      76000,
      76000
    ]
  },
  Month: {
    tsr: 288800,
    tgt: 291700,
    leads: 84,
    mktLeads: 48,
    techLeads: 36,
    est: 61,
    sales: 38,
    inst: 14,
    ir: 168000,
    zcb: 1,
    mc: 48,
    dc: 28,
    amc: 445,
    adc: 575,
    svr: 37560,
    zsc: 3,
    cbr: 7.1,
    cr: 52.8,
    ast: 7600,
    chart: [
      240000,
      260000,
      271000,
      278000,
      285000,
      288000,
      288800
    ]
  },
  YTD: {
    tsr: 1018000,
    tgt: 1166700,
    leads: 312,
    mktLeads: 172,
    techLeads: 140,
    est: 228,
    sales: 142,
    inst: 54,
    ir: 630000,
    zcb: 4,
    mc: 180,
    dc: 102,
    amc: 445,
    adc: 572,
    svr: 140040,
    zsc: 11,
    cbr: 7.4,
    cr: 52.8,
    ast: 7620,
    chart: [
      800000,
      870000,
      920000,
      960000,
      1018000,
      null,
      null
    ]
  },
  Year: {
    tsr: 3275000,
    tgt: 3500000,
    leads: 1010,
    mktLeads: 554,
    techLeads: 456,
    est: 738,
    sales: 452,
    inst: 176,
    ir: 2112000,
    zcb: 13,
    mc: 580,
    dc: 328,
    amc: 448,
    adc: 574,
    svr: 450320,
    zsc: 36,
    cbr: 7.4,
    cr: 52.8,
    ast: 7652,
    chart: [
      2800000,
      2950000,
      3100000,
      3175000,
      3275000,
      null,
      null
    ]
  }
} as const satisfies KpiStore;

export const GOALS: GoalsStore = {
  Day: {
    rev: 10000,
    cr: 60,
    inst: 2,
    mc: 3,
    ast: 7500,
    svr: 2000
  },
  Week: {
    rev: 50000,
    cr: 62,
    inst: 8,
    mc: 10,
    ast: 7500,
    svr: 8000
  },
  Month: {
    rev: 200000,
    cr: 65,
    inst: 30,
    mc: 40,
    ast: 7500,
    svr: 30000
  },
  YTD: {
    rev: 1200000,
    cr: 65,
    inst: 180,
    mc: 200,
    ast: 7500,
    svr: 150000
  },
  Year: {
    rev: 2400000,
    cr: 65,
    inst: 360,
    mc: 400,
    ast: 7800,
    svr: 300000
  }
} as const satisfies GoalsStore;

export const PEERS: Peer[] = [
  {
    alias: "Dealer A",
    biz: "Vancouver Pro HVAC",
    rev: 537600,
    growth: 12.4,
    ast: 7680,
    svc: 187,
    color: "#00694A",
    you: false
  },
  {
    alias: "Dealer B",
    biz: "North Vancouver HVAC Solutions",
    rev: 452400,
    growth: 14.8,
    ast: 7668,
    svc: 142,
    color: "#00B478",
    you: true
  },
  {
    alias: "Dealer C",
    biz: "Squamish Climate Control",
    rev: 394800,
    growth: 8.1,
    ast: 7449,
    svc: 98,
    color: "#00694A",
    you: false
  },
  {
    alias: "Dealer D",
    biz: "Burnaby HVAC Experts",
    rev: 368000,
    growth: 11.2,
    ast: 7510,
    svc: 114,
    color: "#95D5B2",
    you: false
  },
  {
    alias: "Dealer E",
    biz: "Richmond Air Solutions",
    rev: 316800,
    growth: -4.2,
    ast: 7300,
    svc: 76,
    color: "#FF3B30",
    you: false
  },
  {
    alias: "Dealer F",
    biz: "West Van Premium HVAC",
    rev: 291200,
    growth: 9.3,
    ast: 7543,
    svc: 103,
    color: "#0078D4",
    you: false
  },
  {
    alias: "Dealer G",
    biz: "Coquitlam Home Comfort",
    rev: 258400,
    growth: 7.8,
    ast: 7467,
    svc: 89,
    color: "#00C48C",
    you: false
  },
  {
    alias: "Dealer H",
    biz: "Whistler Alpine HVAC",
    rev: 214800,
    growth: 5.1,
    ast: 7226,
    svc: 61,
    color: "#7A9E7E",
    you: false
  }
] as const satisfies Peer[];

export const CONTACTS: Contact[] = [
  {
    name: "Tom",
    role: "Your Coach",
    color: "#00694A",
    online: true,
    init: "TJ"
  },
  {
    name: "Sarah K.",
    role: "Office Manager",
    color: "#AF52DE",
    online: true,
    init: "SK"
  },
  {
    name: "Mike T.",
    role: "Lead Tech",
    color: "#FF9500",
    online: false,
    init: "MT"
  }
] as const satisfies Contact[];

export const THREADS: ThreadsStore = {
  TJ: [
    {
      from: "them",
      text: "Your closing ratio jumped 4 points this month — what changed?",
      t: "Tue 8:30 AM"
    },
    {
      from: "me",
      text: "We added a 48-hour follow-up call on every estimate.",
      t: "Tue 9:14 AM"
    },
    {
      from: "them",
      text: "That compounds fast. Let's cover it in tonight's seminar.",
      t: "Tue 9:20 AM"
    },
    {
      from: "me",
      text: "Looking forward to it. Should I push harder on service contracts?",
      t: "Tue 11:02 AM"
    },
    {
      from: "them",
      text: "Yes — you're at 142, Dealer A has 187. That's a 45-contract gap worth ~$160K annually. Let's build a strategy.",
      t: "Tue 11:15 AM"
    }
  ],
  SK: [
    {
      from: "them",
      text: "Hey, invoice #2281 for Burnaby job came in — approved?",
      t: "Mon 2:10 PM"
    },
    {
      from: "me",
      text: "Yes, approved. Thanks Sarah.",
      t: "Mon 2:22 PM"
    },
    {
      from: "them",
      text: "Got it. I'll process end of day.",
      t: "Mon 2:24 PM"
    }
  ],
  MT: [
    {
      from: "them",
      text: "Job on Lonsdale done. Callback on the Harrison install — their thermostat is reading wrong.",
      t: "Today 3:44 PM"
    },
    {
      from: "me",
      text: "Get back to them today. Let me know what you find.",
      t: "Today 3:50 PM"
    }
  ]
} as const satisfies ThreadsStore;

export const USERS: UsersStore = {
  "john@northvanhvac.ca": {
    pw: "demo123",
    role: "dealer",
    name: "John Smith"
  },
  "admin@mszrme.com": {
    pw: "admin123",
    role: "admin",
    name: "Sarah Admin"
  },
  "new@hvacdealer.ca": {
    pw: "welcome1",
    role: "dealer",
    name: "New Dealer",
    firstTime: true
  }
} as const satisfies UsersStore;

export const ADM_ACCOUNTS: AdminAccount[] = [
  {
    id: "A001",
    alias: "Dealer A",
    name: "Northern HVAC Ltd",
    email: "dealer.a@hvac.ca",
    phone: "+1 604 555 0101",
    city: "North Vancouver, BC",
    stage: "Blue",
    contact: "David Chen",
    type: "Residential & Commercial",
    mrr: 1899,
    status: "Active",
    lastLogin: "2min ago",
    cr: 71.2,
    rev: 538,
    mc: 187,
    inst: 12,
    joined: "Jan 2024",
    plan: "Growth",
    tfa: true,
    sessions: 2,
    billingDay: 1,
    credits: 0,
    notes: "Top performer, renewal Apr 2025"
  },
  {
    id: "A002",
    alias: "Dealer B",
    name: "North Van HVAC Solutions",
    email: "john@northvanhvac.ca",
    phone: "+1 604 555 0142",
    city: "North Vancouver, BC",
    stage: "Green",
    contact: "John Smith",
    type: "Residential",
    mrr: 999,
    status: "Active",
    lastLogin: "Now",
    cr: 66.7,
    rev: 452,
    mc: 142,
    inst: 8,
    joined: "Mar 2024",
    plan: "Starter",
    tfa: true,
    sessions: 1,
    billingDay: 1,
    credits: 0,
    notes: ""
  },
  {
    id: "A005",
    alias: "Dealer C",
    name: "Fraser Valley Heat & Air",
    email: "dealer.c@hvac.ca",
    phone: "+1 604 555 0105",
    city: "Abbotsford, BC",
    stage: "Yellow",
    contact: "Mike Ross",
    type: "Residential",
    mrr: 999,
    status: "At Risk",
    lastLogin: "9 days ago",
    cr: 44.2,
    rev: 317,
    mc: 76,
    inst: 4,
    joined: "Oct 2024",
    plan: "Starter",
    tfa: false,
    sessions: 0,
    billingDay: 1,
    credits: 0,
    notes: "Payment failed — card declined. Login issues reported."
  },
  {
    id: "A008",
    alias: "Dealer D",
    name: "Coquitlam HVAC Services",
    email: "dealer.d@hvac.ca",
    phone: "+1 604 555 0108",
    city: "Coquitlam, BC",
    stage: "Yellow",
    contact: "Anna Perez",
    type: "Residential & Commercial",
    mrr: 0,
    status: "Trial",
    lastLogin: "3 weeks ago",
    cr: 38.1,
    rev: 198,
    mc: 54,
    inst: 2,
    joined: "Apr 2025",
    plan: "Trial",
    tfa: false,
    sessions: 0,
    billingDay: 0,
    credits: 0,
    notes: "Trial ends May 31. Follow up to convert."
  }
] as const satisfies AdminAccount[];

export const ACCOUNT_KPI: AccountKpiStore = {
  "john@northvanhvac.ca": null,
  "new@hvacdealer.ca": {
    Day: {
      tsr: 0,
      tgt: 0,
      leads: 0,
      mktLeads: 0,
      techLeads: 0,
      est: 0,
      sales: 0,
      inst: 0,
      ir: 0,
      zcb: 0,
      mc: 0,
      dc: 0,
      amc: 0,
      adc: 0,
      svr: 0,
      zsc: 0,
      cbr: 0,
      cr: 0,
      ast: 0,
      chart: [
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ],
      gm: 0,
      nsr: 0,
      svc: 0
    },
    Month: {
      tsr: 0,
      tgt: 0,
      leads: 0,
      mktLeads: 0,
      techLeads: 0,
      est: 0,
      sales: 0,
      inst: 0,
      ir: 0,
      zcb: 0,
      mc: 0,
      dc: 0,
      amc: 0,
      adc: 0,
      svr: 0,
      zsc: 0,
      cbr: 0,
      cr: 0,
      ast: 0,
      chart: [
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ],
      gm: 0,
      nsr: 0,
      svc: 0
    },
    Year: {
      tsr: 0,
      tgt: 0,
      leads: 0,
      mktLeads: 0,
      techLeads: 0,
      est: 0,
      sales: 0,
      inst: 0,
      ir: 0,
      zcb: 0,
      mc: 0,
      dc: 0,
      amc: 0,
      adc: 0,
      svr: 0,
      zsc: 0,
      cbr: 0,
      cr: 0,
      ast: 0,
      chart: [
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ],
      gm: 0,
      nsr: 0,
      svc: 0
    }
  }
} as const satisfies AccountKpiStore;
