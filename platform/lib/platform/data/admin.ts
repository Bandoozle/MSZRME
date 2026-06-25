// Ported from mszrme-dealer-runtime.js — values must match exactly.

import { ADM_ACCOUNTS } from "./kpi";

export { ADM_ACCOUNTS };

export type AdminThreadMessage = {
  from: "them" | "us";
  msg: string;
  t: string;
  unread?: boolean;
};

export type AdminThreadsStore = Record<string, AdminThreadMessage[]>;

export interface AdminInvoice {
  id: string;
  account: string;
  name: string;
  date: string;
  amount: number;
  status: string;
  method: string;
}

export interface AdminLogEntry {
  t: string;
  user: string;
  action: string;
  detail: string;
  level: "info" | "warn" | "admin" | "error";
}

export interface AdminMonthlyRow {
  mo: string;
  dealers: number;
  mrr: number;
  new: number;
  target: number;
}

export interface AdminTierRow {
  name: string;
  color: string;
  count: number;
  mrr: number;
  target: number;
  desc: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  desc: string;
  tier: number;
  global: boolean;
  accounts: Record<string, boolean>;
}

export interface MarketingInputs {
  region: string;
  weather: {
    label: string;
    impact: string;
    window: string;
    hot: boolean;
  }[];
  coop: {
    name: string;
    available: string;
    expires: string;
    match: string;
    used: string;
  }[];
  utility: {
    program: string;
    audience: string;
    amount: string;
    notes: string;
    status: string;
  }[];
}

export interface ExitDeal {
  id: string;
  dealerName: string;
  tier: number;
  revM: number;
  ebitdaM: number;
  multiple: number;
  evEstimate: number;
  stage: string;
  targetExit: string;
  successFeeRate: number;
  successFee: number;
  notes: string;
}

export interface AdminCallLog {
  id: string;
  date: string;
  duration: string;
  type: string;
  notes: string;
  actions: string[];
  done: boolean[];
}

export type AdminCallLogsStore = Record<string, AdminCallLog[]>;

export interface AdminNotifHistoryItem {
  icon: string;
  text: string;
  t: string;
  to: string;
  type: string;
}

export interface AdminScheduledNotif {
  id: string;
  icon: string;
  text: string;
  to: string;
  sendAt: string;
  status: string;
}

export interface AdminTimelineNote {
  t: string;
  author: string;
  note: string;
}

export type AdminTagsStore = Record<string, string[]>;
export type AdminNotesTimelineStore = Record<string, AdminTimelineNote[]>;

export const INITIAL_CALL_LOGS: AdminCallLogsStore = {
  A001: [
    {
      id: "c1",
      date: "May 13, 2026",
      duration: "58 min",
      type: "Monthly",
      notes:
        "Reviewed Q1 numbers. GM% improved to 44%. Discussed adding a maintenance agreement push in June. Recommended follow-up script.",
      actions: [
        "Send maintenance agreement follow-up template",
        "Review Q2 pricing before next call",
      ],
      done: [true, false],
    },
    {
      id: "c2",
      date: "Apr 8, 2026",
      duration: "62 min",
      type: "Monthly",
      notes:
        "Closing ratio dropped to 48%. Traced to missed follow-ups. Recommended 3-day follow-up protocol.",
      actions: [
        "Implement 3-day estimate follow-up protocol",
        "Log every estimate in the dashboard",
      ],
      done: [true, true],
    },
  ],
};

export const INITIAL_AI_MESSAGES = [
  {
    role: "assistant" as const,
    content:
      "Hi! I'm your MSZRME Revenue AI. I can see you're currently at **$3,897 MRR** with 4 accounts — 1 Growth, 2 Starter, 1 Trial. Your growth goal is **3–5 new dealers per month**.\n\nHere are my top three revenue opportunities right now:\n\n**1. Convert Dealer D (Trial → Starter)** — trial ends May 31. A personal outreach call this week could lock in $999/mo.\n\n**2. Recover Dealer C** — payment failed and login issues. Direct intervention could save $999/mo.\n\n**3. Upsell Dealer B to Growth** — strong performance suggests Growth tier readiness (+$900/mo).\n\nWhat would you like to explore?",
  },
];

export const ADM_THREADS: AdminThreadsStore = {
  "A001": [
    {
      "from": "them",
      "msg": "Hey, the Market Pulse data hasn't updated since Tuesday - is there an issue?",
      "t": "10:14am"
    },
    {
      "from": "us",
      "msg": "Looking into it now. There was a sync delay on our end. Should be live within 15 minutes.",
      "t": "10:18am"
    },
    {
      "from": "them",
      "msg": "Thanks, appreciate the quick response.",
      "t": "10:19am"
    }
  ],
  "A002": [
    {
      "from": "them",
      "msg": "Quick question - how do I update my backup payment method?",
      "t": "9:02am"
    },
    {
      "from": "us",
      "msg": "Head to Settings > Billing > Backup Payment Method. Let me know if you need a walkthrough.",
      "t": "9:05am"
    }
  ],
  "A005": [
    {
      "from": "them",
      "msg": "I haven't been able to log in for two days. Password reset isn't working.",
      "t": "Yesterday"
    },
    {
      "from": "us",
      "msg": "I've reset your account. Check your inbox for a new invite link.",
      "t": "Yesterday"
    },
    {
      "from": "them",
      "msg": "Got it, thank you.",
      "t": "Yesterday"
    },
    {
      "from": "them",
      "msg": "Actually still not working - the link expired.",
      "t": "8:44am"
    }
  ]
};

export const ADM_INVOICES: AdminInvoice[] = [
  {
    "id": "INV-2026-040",
    "account": "A001",
    "name": "Northern HVAC Ltd",
    "date": "May 1 2026",
    "amount": 1899,
    "status": "Paid",
    "method": "Visa ••4821"
  },
  {
    "id": "INV-2026-041",
    "account": "A002",
    "name": "North Van HVAC",
    "date": "May 1 2026",
    "amount": 999,
    "status": "Paid",
    "method": "Visa ••3190"
  },
  {
    "id": "INV-2026-044",
    "account": "A005",
    "name": "Fraser Valley Heat",
    "date": "May 1 2026",
    "amount": 999,
    "status": "Overdue",
    "method": "Visa ••9901"
  },
  {
    "id": "INV-2026-047",
    "account": "A008",
    "name": "Coquitlam HVAC",
    "date": "May 1 2026",
    "amount": 0,
    "status": "Trial",
    "method": "—"
  },
  {
    "id": "INV-2026-032",
    "account": "A001",
    "name": "Northern HVAC Ltd",
    "date": "Apr 1 2026",
    "amount": 1899,
    "status": "Paid",
    "method": "Visa ••4821"
  },
  {
    "id": "INV-2026-033",
    "account": "A002",
    "name": "North Van HVAC",
    "date": "Apr 1 2026",
    "amount": 999,
    "status": "Paid",
    "method": "Visa ••3190"
  }
];

export const ADM_LOGS: AdminLogEntry[] = [
  {
    "t": "14:22:01",
    "user": "john@northvanhvac.ca",
    "action": "LOGIN",
    "detail": "Successful login · North Vancouver, BC",
    "level": "info"
  },
  {
    "t": "14:20:44",
    "user": "sarah.admin",
    "action": "ACCOUNT_VIEW",
    "detail": "Viewed Dealer B account detail",
    "level": "info"
  },
  {
    "t": "14:19:31",
    "user": "dealer.c@hvac.ca",
    "action": "LOGIN_FAIL",
    "detail": "Failed login attempt · 2nd attempt",
    "level": "warn"
  },
  {
    "t": "14:17:08",
    "user": "dealer.a@hvac.ca",
    "action": "INVOICE_DL",
    "detail": "Downloaded INV-2026-040",
    "level": "info"
  },
  {
    "t": "14:12:55",
    "user": "sarah.admin",
    "action": "BILLING_EXT",
    "detail": "Extended billing 30 days for Dealer C",
    "level": "admin"
  },
  {
    "t": "14:08:33",
    "user": "john@northvanhvac.ca",
    "action": "GOAL_UPDATE",
    "detail": "Updated Month revenue target to $220,000",
    "level": "info"
  },
  {
    "t": "14:01:12",
    "user": "dealer.b@hvac.ca",
    "action": "EXPORT",
    "detail": "Exported YTD report as PDF",
    "level": "info"
  },
  {
    "t": "13:55:44",
    "user": "dealer.c@hvac.ca",
    "action": "LOGIN_FAIL",
    "detail": "Failed login attempt · 1st attempt",
    "level": "warn"
  },
  {
    "t": "13:44:09",
    "user": "sarah.admin",
    "action": "PW_RESET",
    "detail": "Forced password reset for dealer.c@hvac.ca",
    "level": "admin"
  },
  {
    "t": "13:30:00",
    "user": "system",
    "action": "BILLING_RUN",
    "detail": "Monthly billing cycle completed · 3 of 4 charged",
    "level": "info"
  },
  {
    "t": "13:28:11",
    "user": "system",
    "action": "INVOICE_FAIL",
    "detail": "Charge failed for dealer.c@hvac.ca — card declined",
    "level": "error"
  },
  {
    "t": "12:14:07",
    "user": "dealer.b@hvac.ca",
    "action": "2FA_ENABLE",
    "detail": "Two-factor authentication enabled",
    "level": "info"
  },
  {
    "t": "11:58:22",
    "user": "sarah.admin",
    "action": "FEATURE_FLAG",
    "detail": "Enabled Seasonal Planner for A002",
    "level": "admin"
  },
  {
    "t": "11:22:00",
    "user": "dealer.a@hvac.ca",
    "action": "TEAM_ADD",
    "detail": "Added team member: mike@northern.ca",
    "level": "info"
  }
];

export const ADM_MONTHLY: AdminMonthlyRow[] = [
  {
    "mo": "Jan",
    "dealers": 2,
    "mrr": 1898,
    "new": 2,
    "target": 3
  },
  {
    "mo": "Feb",
    "dealers": 2,
    "mrr": 1898,
    "new": 0,
    "target": 2
  },
  {
    "mo": "Mar",
    "dealers": 3,
    "mrr": 2897,
    "new": 1,
    "target": 3
  },
  {
    "mo": "Apr",
    "dealers": 3,
    "mrr": 2897,
    "new": 0,
    "target": 2
  },
  {
    "mo": "May",
    "dealers": 4,
    "mrr": 3897,
    "new": 1,
    "target": 3
  }
];

export const ADM_TIERS: AdminTierRow[] = [
  {
    "name": "Trial",
    "color": "#F59E0B",
    "count": 1,
    "mrr": 0,
    "target": 0,
    "desc": "30-day free trial · converting May 31"
  },
  {
    "name": "Starter",
    "color": "#00B478",
    "count": 2,
    "mrr": 1998,
    "target": 999,
    "desc": "$999/month · core platform + Financials"
  },
  {
    "name": "Growth",
    "color": "#4A7FD4",
    "count": 1,
    "mrr": 1899,
    "target": 1899,
    "desc": "$1,899/month · full platform + Sales Team"
  },
  {
    "name": "Scale",
    "color": "#A855F7",
    "count": 0,
    "mrr": 0,
    "target": 2999,
    "desc": "$2,999/month · multi-location + API access"
  }
];

export const ADM_NOTIF_HISTORY: AdminNotifHistoryItem[] = [
  {
    "icon": "📊",
    "text": "Market Pulse data updated for all accounts",
    "t": "Today 10:18am",
    "to": "All (4)",
    "type": "Announcement"
  },
  {
    "icon": "⚠️",
    "text": "Payment failed for Dealer C — please update billing",
    "t": "Today 9:00am",
    "to": "Dealer C",
    "type": "Alert"
  },
  {
    "icon": "✅",
    "text": "Dealer A hit Blue Stage — congratulations!",
    "t": "Yesterday",
    "to": "Dealer A",
    "type": "Achievement"
  },
  {
    "icon": "📣",
    "text": "Platform maintenance window May 15 2:00–3:00am PST",
    "t": "May 13",
    "to": "All (4)",
    "type": "Announcement"
  }
];

export const ADM_SCHEDULED: AdminScheduledNotif[] = [
  {
    "id": "sn1",
    "icon": "📊",
    "text": "Your May KPI report is ready — log in to download.",
    "to": "All Active",
    "sendAt": "Jun 1, 2026 8:00am",
    "status": "Scheduled"
  },
  {
    "id": "sn2",
    "icon": "⚠️",
    "text": "Your trial ends in 7 days. Upgrade to Pro to keep your data.",
    "to": "Dealer H",
    "sendAt": "May 24, 2026 9:00am",
    "status": "Scheduled"
  }
];

export const MARKETING_INPUTS: MarketingInputs = {
  "region": "North Vancouver, BC",
  "weather": [
    {
      "label": "Cooling degree days +18% vs 10-yr avg",
      "impact": "+12–18% cooling demand",
      "window": "Jun–Aug",
      "hot": true
    },
    {
      "label": "First major heat event projected",
      "impact": "+$28K install pipeline",
      "window": "Jul 8–12",
      "hot": true
    },
    {
      "label": "Above-normal August temps",
      "impact": "AC service spike likely",
      "window": "75% probability",
      "hot": true
    },
    {
      "label": "Wildfire smoke season earlier",
      "impact": "+24% IAQ filter demand",
      "window": "Late Jul onward",
      "hot": false
    }
  ],
  "coop": [
    {
      "name": "Daikin Comfort Pro Co-op",
      "available": "$4,200",
      "expires": "Aug 31",
      "match": "50/50",
      "used": "$1,800 / $6,000"
    },
    {
      "name": "Bosch IDS Dealer Co-op",
      "available": "$2,800",
      "expires": "Sept 15",
      "match": "50/50",
      "used": "$1,200 / $4,000"
    },
    {
      "name": "Lennox Premier Dealer",
      "available": "$1,500",
      "expires": "Dec 31",
      "match": "40/60",
      "used": "$0 / $1,500"
    },
    {
      "name": "Mitsubishi Diamond Dealer",
      "available": "$3,000",
      "expires": "Dec 31",
      "match": "50/50",
      "used": "$0 / $3,000"
    }
  ],
  "utility": [
    {
      "program": "CleanBC Heat Pump Rebate",
      "audience": "Consumer",
      "amount": "$3,000–$11,000",
      "notes": "Stacks with federal",
      "status": "Active"
    },
    {
      "program": "BC Hydro Power Smart",
      "audience": "Commercial",
      "amount": "Up to $2,000",
      "notes": "Per-unit cap",
      "status": "Active"
    },
    {
      "program": "FortisBC Dual-Fuel Rebate",
      "audience": "Consumer",
      "amount": "Up to $4,000",
      "notes": "HP + gas furnace",
      "status": "Active"
    },
    {
      "program": "Canada Greener Homes Grant",
      "audience": "Consumer",
      "amount": "Up to $5,000",
      "notes": "Year-round",
      "status": "Active"
    },
    {
      "program": "Canada Greener Homes Loan",
      "audience": "Consumer",
      "amount": "0% up to $40,000",
      "notes": "10-yr term",
      "status": "Active"
    }
  ]
};

export const ADM_TAGS: AdminTagsStore = {
  "A001": [
    "VIP",
    "High Volume"
  ],
  "A002": [
    "Demo Account"
  ],
  "A005": [
    "Payment Issue",
    "Follow Up"
  ],
  "A008": [
    "Trial Converting Soon"
  ]
};

export const ADM_NOTES_TIMELINE: AdminNotesTimelineStore = {
  "A001": [
    {
      "t": "May 14 2:30pm",
      "author": "Sarah Admin",
      "note": "Renewal conversation — happy with platform, considering adding 2 techs."
    },
    {
      "t": "Apr 28 10:00am",
      "author": "Sarah Admin",
      "note": "Moved to Blue Stage. Sent congratulations message."
    }
  ],
  "A002": [
    {
      "t": "May 10 9:00am",
      "author": "Sarah Admin",
      "note": "Demo account for prospect walk-throughs. John aware."
    }
  ],
  "A005": [
    {
      "t": "May 16 8:44am",
      "author": "Sarah Admin",
      "note": "Password reset link expired. Sent new one manually."
    },
    {
      "t": "May 15 4:00pm",
      "author": "Sarah Admin",
      "note": "Card declined — Visa ••9901. Emailed billing contact."
    }
  ]
};

export const FEATURE_FLAGS: FeatureFlag[] = [
  {
    "id": "ff-dashboard",
    "name": "Dashboard",
    "desc": "Main KPI overview with gauges and stage progress",
    "tier": 1,
    "global": true,
    "accounts": {
      "A001": true,
      "A002": true,
      "A005": true,
      "A008": true
    }
  },
  {
    "id": "ff-lognumbers",
    "name": "Log Numbers",
    "desc": "Daily / Weekly KPI entry with localStorage save-lock",
    "tier": 1,
    "global": true,
    "accounts": {
      "A001": true,
      "A002": true,
      "A005": true,
      "A008": true
    }
  },
  {
    "id": "ff-goals",
    "name": "Goals",
    "desc": "Monthly target setting and progress tracking",
    "tier": 1,
    "global": true,
    "accounts": {
      "A001": true,
      "A002": true,
      "A005": true,
      "A008": true
    }
  },
  {
    "id": "ff-notes",
    "name": "Notes & Checklists",
    "desc": "Personal notes plus three-slot initiative tracking",
    "tier": 1,
    "global": true,
    "accounts": {
      "A001": true,
      "A002": true,
      "A005": true,
      "A008": true
    }
  },
  {
    "id": "ff-gm-calc",
    "name": "GM Calculator",
    "desc": "Gross margin price calculator with PDF export",
    "tier": 1,
    "global": true,
    "accounts": {
      "A001": true,
      "A002": true,
      "A005": true,
      "A008": true
    }
  },
  {
    "id": "ff-reports",
    "name": "Reports",
    "desc": "Downloadable PDF performance and coaching reports",
    "tier": 1,
    "global": true,
    "accounts": {
      "A001": true,
      "A002": true,
      "A005": true,
      "A008": true
    }
  },
  {
    "id": "ff-financials",
    "name": "Financials",
    "desc": "Full P&L breakdown plus COGS analysis",
    "tier": 2,
    "global": false,
    "accounts": {
      "A001": true,
      "A002": true
    }
  },
  {
    "id": "ff-market",
    "name": "Market Pulse",
    "desc": "Anonymous peer-dealer leaderboard",
    "tier": 2,
    "global": false,
    "accounts": {
      "A001": true,
      "A002": true
    }
  },
  {
    "id": "ff-seasonal",
    "name": "Seasonal Planner",
    "desc": "ML demand forecast plus 90-day marketing plan",
    "tier": 2,
    "global": false,
    "accounts": {
      "A001": true,
      "A002": true
    }
  },
  {
    "id": "ff-service",
    "name": "Service Module",
    "desc": "Service gauges on Dashboard + Service tab in Log Numbers (turn off for install-only shops)",
    "tier": 1,
    "global": false,
    "accounts": {
      "A001": true,
      "A002": true,
      "A005": true,
      "A008": true
    }
  },
  {
    "id": "ff-salesteam",
    "name": "Sales Team",
    "desc": "Multi-rep tracking with revenue / closing / pace metrics",
    "tier": 4,
    "global": false,
    "accounts": {
      "A001": true
    }
  },
  {
    "id": "ff-pricebook",
    "name": "Price Book",
    "desc": "Equipment pricing module with sell-sheet generator (coming soon)",
    "tier": 3,
    "global": false,
    "accounts": {}
  },
  {
    "id": "ff-beta-rep",
    "name": "Beta Reports",
    "desc": "Advanced custom report builder (beta)",
    "tier": 0,
    "global": false,
    "accounts": {}
  },
  {
    "id": "ff-ai-notify",
    "name": "AI Notifications",
    "desc": "Claude-powered insight notifications and weekly digest",
    "tier": 0,
    "global": false,
    "accounts": {
      "A001": true,
      "A002": true
    }
  },
  {
    "id": "ff-api-access",
    "name": "API Access",
    "desc": "REST API access for third-party integrations",
    "tier": 0,
    "global": false,
    "accounts": {}
  }
];
