# Supabase setup (MSZRME)

One Supabase project powers **both** apps (`website/` signup, `platform/` login).

## 1. Create project

1. [supabase.com](https://supabase.com) → New project
2. **Project Settings → API** → copy **Project URL**
3. **API Keys** tab (your screenshot):
   - **Publishable key** (`sb_publishable_...`) → client apps (website + platform)
   - **Secret key** (`sb_secret_...`) → website signup API only (never in browser)

> **Legacy tab:** If you only see `anon` / `service_role` JWT keys, those work too — same env var names below.

| Dashboard label | Env variable | Apps |
|-----------------|--------------|------|
| Publishable (`sb_publishable_...`) or legacy `anon` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | website + platform |
| Secret (`sb_secret_...`) or legacy `service_role` | `SUPABASE_SERVICE_ROLE_KEY` | website only |

## 2. Run migration

**Option A — SQL Editor:** run each file in `migrations/` in order (`20250624000001_profiles.sql`, `20250624000002_ensure_own_profile.sql`, `20250624000003_fix_profile_update_rls.sql`).

**Option B — CLI:**

```bash
npm i -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

## 3. Environment variables

Copy into **both** `website/.env.local` and `platform/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

**Website only** (server-side signup — use the **secret** key, not publishable):

```env
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
```

## 4. Create an admin user

Public signup always creates **dealer** accounts. For admin:

1. Supabase Dashboard → **Authentication** → **Users** → Add user  
   e.g. `admin@mszrme.com` with a strong password
2. SQL Editor:

```sql
update public.profiles
set role = 'admin',
    display_name = 'Sarah Admin',
    business_name = 'MSZRME',
    first_time = false
where email = 'admin@mszrme.com';
```

## 5. Optional demo dealer

Same flow for `john@northvanhvac.ca`, then:

```sql
update public.profiles
set display_name = 'John Smith',
    business_name = 'North Vancouver HVAC',
    tier = 1,
    stage = 'blue',
    first_time = false
where email = 'john@northvanhvac.ca';
```

## Auth flow

| App | Flow |
|-----|------|
| **Website** | `POST /api/signup` → creates auth user + profile (dealer) → auto sign-in on platform → `/dashboard` |
| **Platform** | `signInWithPassword` → loads `profiles` row → dealer or admin UI |

Sessions are cookie-based per app origin (`localhost:3000` vs `localhost:3001` in dev). Users sign in on the platform after website signup.
