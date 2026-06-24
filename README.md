# MSZRME — Marketing Website

The MSZRME marketing and signup site, built with **Next.js (App Router) + TypeScript + Tailwind CSS**.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build
npm run start
```

## Stack

- **Next.js 14** (App Router) — file-based routing, one real route per page
- **TypeScript**
- **Tailwind CSS** — configured and available; see styling note below
- **lucide-react** — icons

## Project structure

```
app/
  layout.tsx          Root layout: <Nav>, <Footer>, global metadata, fonts
  globals.css         Design system (CSS variables) + Tailwind directives
  page.tsx            Home / sales landing
  platform/           /platform
  features/           /features
  stages/             /stages
  pricing/            /pricing
  about/              /about
  coaching/           /coaching
  contact/            /contact
  support/            /support
  privacy/            /privacy
  terms/              /terms
components/
  Nav.tsx             Sticky nav + mobile menu (client), active-route highlight
  Footer.tsx
  Gauge.tsx           Single instrument gauge (SVG)
  GaugeCluster.tsx    Preset gauge clusters ("hero", "service")
  SignupForm.tsx      (client) front-end validation + success state
  ContactForm.tsx     (client)
  Reveal* / RevealInit.tsx  Scroll-reveal via IntersectionObserver (client)
  CtaBand, StageProgression, StageCards, Tiers, Faq
lib/
  content.ts          Stage colours, stage + pricing data, the accent() helper
```

## Routing

Every page is a real Next.js route (e.g. `/platform`, `/pricing`), so each has its own
URL and per-page `metadata` for SEO. The home page keeps in-page anchors for
`#features`, `#stages`, `#pricing`, and `#signup`.

## Styling note

The visual design lives in `app/globals.css` as a small design system driven by CSS
custom properties (colours, the eight-stage palette, radii, type scale). Tailwind is
fully wired up (`tailwind.config.ts`, PostCSS, directives) and ready for new work; the
existing styles can be migrated to utilities incrementally if your team prefers.

The eight-stage colour system is centralised in `lib/content.ts` (`STAGE_COLORS`) and
applied to cards via the `accent(color)` helper, which sets the `--c` custom property.

## Before launch — placeholders to replace

- **Forms** (`SignupForm`, `ContactForm`) are front-end only. Wire the `TODO`-marked
  submit handlers to your real signup/auth and contact/CRM endpoints.
- **Testimonials** on the home page are placeholders. Swap in real dealer quotes.
- **Open Graph image**: add `app/opengraph-image.png` (1200x630) and set `metadataBase`
  / `openGraph.url` in `app/layout.tsx` so shared links render a preview card.
- **Contact details** (sales@/hello@/privacy@/legal@mszrme.com) are placeholders.
- **Legal copy** (privacy, terms) is template language; have counsel review it.
