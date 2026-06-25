# MSZRME Platform

Dealer KPI dashboard — Next.js 14 (App Router), ported from `MSZRME-Platform-V2.html` as React components.

## Quick start

```bash
npm install
cp .env.local.example .env.local   # optional: ANTHROPIC_API_KEY for AI route
npm run dev                        # http://localhost:3001
```

**Demo logins**

| Email | Password | Role |
|-------|----------|------|
| john@northvanhvac.ca | demo123 | Dealer |
| admin@mszrme.com | admin123 | Admin |
| new@hvacdealer.ca | welcome1 | New account |

## Architecture

```
platform/
├── app/                    App Router routes (dashboard, goals, admin, login, …)
├── components/
│   ├── PlatformShell.tsx   Entry: PlatformProvider + PlatformApp
│   ├── PlatformRoutePage.tsx
│   └── platform/           Shell, pages, admin, overlays, login
├── context/
│   └── PlatformContext.tsx Auth, nav, theme, URL sync
├── lib/
│   ├── platform/           Data + utils (kpi, nav, admin, …)
│   └── urls.ts             Website ↔ platform links
└── styles/
    └── platform.css        V2 design system (from extract-prototype.mjs)
```

## Regenerate CSS from HTML prototype

```bash
node scripts/extract-prototype.mjs [path-to-MSZRME-Platform-V2.html]
```

Writes `styles/platform.css` and `public/images/login-wallpaper.jpg`.
