# MSZRME Platform — Next.js Package

This is the MSZRME dealer KPI dashboard, packaged as a Next.js 14 (App Router) project.  
Ported from `MSZRME-Platform-V2.html` — a fully functional single-file prototype.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy the env file and add your Anthropic API key
cp .env.local.example .env.local
# → Edit .env.local and set ANTHROPIC_API_KEY=sk-ant-...

# 3. Run the dev server
npm run dev

# 4. Open http://localhost:3000
```

**Demo login credentials:**

| Email | Password | Role |
|---|---|---|
| john@northvanhvac.ca | demo123 | Dealer |
| admin@mszrme.com | admin123 | Admin |
| new@hvacdealer.ca | welcome1 | New account |

---

## Architecture

```
mszrme-platform/
│
├── app/
│   ├── layout.tsx              Root layout (fonts, metadata)
│   ├── page.tsx                Entry point → <PlatformShell>
│   └── api/
│       └── ai/route.ts         Anthropic proxy (fixes CORS, secures API key)
│
├── components/
│   ├── PlatformShell.tsx       Top-level: auth state + dealer/admin routing
│   ├── ui/
│   │   └── LoginScreen.tsx     Login form
│   ├── dealer/
│   │   ├── DealerShell.tsx     Sidebar + topbar + page routing for dealers
│   │   └── pages/
│   │       ├── Dashboard.tsx   ✅ Ported — KPI gauges, period selector
│   │       └── PlaceholderPage.tsx  🚧 Template for pages not yet ported
│   └── admin/
│       └── AdminShell.tsx      Admin sidebar + Overview page + placeholders
│
├── lib/
│   ├── types.ts                All TypeScript interfaces
│   ├── hooks/
│   │   ├── useAuth.ts          Login / logout state
│   │   └── useTheme.ts         Light / dark toggle with localStorage
│   └── data/
│       ├── index.ts            Barrel export
│       ├── kpi.ts              Dealer KPI seed data
│       ├── peers.ts            Market Pulse peer dealer data
│       ├── messages.ts         Contacts + message threads
│       ├── marketing.ts        Seasonal Planner inputs (weather, co-op, rebates)
│       └── accounts.ts         Admin dealer accounts + demo credentials
│
└── styles/
    └── globals.css             Full iOS 27 design system (2,400+ lines)
                                Ported 1:1 from the HTML prototype
```

---

## What's ported vs what's still to build

### ✅ Done
- Auth flow (login / logout, role-based routing)
- Light / dark theme toggle with persistence
- Dealer shell: sidebar navigation, topbar, layout
- Dashboard page: revenue hero, KPI grid, period selector, summary table
- Admin shell: sidebar, Overview page with account table
- All data extracted into typed TypeScript modules
- Anthropic AI proxy route (`/api/ai`) — fixes the CORS error from `file://`
- All CSS design tokens and component styles
- TypeScript types for every data model

### 🚧 To port (each is a `renderX()` function in the HTML prototype)

Each function below maps to one file you create in `components/dealer/pages/`:

| Prototype function | Target component | Notes |
|---|---|---|
| `renderMarket()` | `Market.tsx` | Uses `PEERS` data, fingerprint SVGs, momentum score |
| `renderSeasonal()` | `Seasonal.tsx` | Uses `MARKETING_INPUTS`, 6-channel tab plan |
| `renderMessages()` | `Messages.tsx` | Uses `CONTACTS` + `THREADS`, has AI chat via `/api/ai` |
| `renderLogNumbers()` | `LogNumbers.tsx` | Form with localStorage save, 4 tabs |
| `renderGoals()` | `Goals.tsx` | Monthly target setting |
| `renderFinancials()` | `Financials.tsx` | P&L breakdown (tier 2+) |
| `renderReports()` | `Reports.tsx` | PDF export via `window.print()` |
| `renderSettings()` | `Settings.tsx` | Profile, billing, integrations |
| `renderCalculator()` | `Calculator.tsx` | GM% price calculator |
| `renderNotes()` | `Notes.tsx` | Notes + checklists |

For admin pages, each maps to `components/admin/pages/`:

| Prototype function | Target component |
|---|---|
| `renderAdmAccounts()` | `Accounts.tsx` |
| `renderAdmAnalytics()` | `Analytics.tsx` |
| `renderAdmBilling()` | `Billing.tsx` |
| `renderAdmComms()` | `Comms.tsx` |
| `renderAdmConfig()` | `Config.tsx` (feature flags) |
| `renderAdmSupport()` | `Support.tsx` |
| ... | ... |

---

## How to port a page

1. Find the render function in `MSZRME-Platform-V2.html` (e.g. `renderMarket()`)
2. Create `components/dealer/pages/Market.tsx`
3. The function uses inline HTML strings — convert each to JSX:
   - `style="..."` → `style={{ ... }}` (camelCase keys, string values)
   - Template literals `${}` → JSX `{}`  
   - `onclick="..."` → `onClick={...}`
   - `class="..."` → `className="..."`
4. Data references like `PEERS`, `MARKETING_INPUTS` come from `lib/data/`
5. Helper functions (sparklines, fingerprints, etc.) move to `lib/utils/`
6. Add the import + case to `DealerShell.tsx`'s `PageRenderer`

### Converting inline styles (example)

**Prototype (HTML string):**
```js
'<div style="font-size:13px;font-weight:700;color:#00694A">' + text + '</div>'
```

**React JSX:**
```tsx
<div style={{ fontSize: "13px", fontWeight: 700, color: "#00694A" }}>{text}</div>
```

---

## Connecting real data

All seed data lives in `lib/data/*.ts`. To connect each to a real backend:

### Option A — Supabase (recommended)
```bash
npm install @supabase/supabase-js
```
Replace each data import with a `useSWR` hook or a Server Component fetch:
```tsx
// Before (seed data)
import { KPI } from "@/lib/data";

// After (live data)
import useSWR from "swr";
const { data: kpi } = useSWR(`/api/dealer/${dealerId}/kpi`, fetcher);
```

### Option B — API routes
Create `app/api/dealer/[id]/kpi/route.ts` and fetch from your existing backend.

### Option C — Server Components
Move data-fetching pages to server components (remove `"use client"`) and use
`async/await` directly — no useState needed for the data layer.

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Powers the AI coach chat (Tom) in Messages |
| `ANTHROPIC_MODEL` | No | Defaults to `claude-sonnet-4-6` |

---

## Tech stack

- **Next.js 14** — App Router, Server Components, API Routes
- **TypeScript** — strict mode
- **React 18** — hooks, Suspense, lazy loading
- **@anthropic-ai/sdk** — server-side only (never exposed to client)
- No UI library — all components use the iOS 27 design system from the prototype

---

## Notes for Bretton

The HTML prototype (`MSZRME-Platform-V2.html`) is the source of truth for visual design.  
This package is the structural shell Marco needs to build the real multi-tenant platform on.  
The prototype's SF Pro fonts, all CSS tokens, and the full iOS 27 design language are preserved.

The one thing this package fixes that the prototype couldn't: the AI coach chat in Messages  
was blocked by CORS when opening the file locally. The `/api/ai` route proxies the  
Anthropic call server-side, so it works in the deployed app without exposing the API key.
