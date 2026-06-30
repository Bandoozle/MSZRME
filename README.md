# MSZRME

Monorepo for the MSZRME marketing website and dealer platform.

## Projects

| Folder | Description | Dev port |
|--------|-------------|----------|
| [`website/`](website/) | Public marketing site (Next.js) | 3000 |
| [`platform/`](platform/) | Dealer dashboard (Next.js) | 3001 |

## Local development

```bash
# Website
cd website
npm install
npm run dev

# Platform (separate terminal)
cd platform
npm install
npm run dev
```

Copy `.env.local.example` to `.env.local` in each project and adjust URLs as needed.

- Website: `NEXT_PUBLIC_PLATFORM_URL` (default `http://localhost:3001`)
- Platform: `NEXT_PUBLIC_WEBSITE_URL` (default `http://localhost:3000`)
- **Both:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see [`supabase/README.md`](supabase/README.md))
- **Website only:** `SUPABASE_SERVICE_ROLE_KEY` (signup API)

