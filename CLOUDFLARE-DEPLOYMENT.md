# Alpha Nation — Cloudflare Workers deployment

This project uses the OpenNext Cloudflare adapter. It is a Next.js server-rendered app with API routes and cookie-based Supabase sessions, so deploy it to **Cloudflare Workers**, not as a static Cloudflare Pages export. The public hostname will be a `workers.dev` hostname unless a custom domain is connected.

## 1. Install and verify locally

Use Node.js 22 or newer and npm.

```bash
cp .env.local.example .env.local
cp .dev.vars.example .dev.vars
npm install
npm run build
npm run preview
```

Fill in `.env.local` and `.dev.vars` before testing forms. Never commit either file. Use a local Turnstile widget configured for `localhost` or use Cloudflare preview after deployment.

## 2. Required Cloudflare values

Set public build variables in **Workers Builds → Build variables and secrets**. Set the same public values as Worker runtime variables where required. `NEXT_PUBLIC_` values used directly in client components must be present at build time. The appointment form now retrieves the Turnstile site key from `/api/public-config` at runtime, so its Worker runtime variable is authoritative and a stale/missing build-time value will not hide the widget.

**Build variables:**

| Name | Value |
|---|---|
| `NODE_VERSION` | `22.16.0` |
| `NEXTJS_ENV` | `production` |
| `NEXT_PUBLIC_SITE_URL` | Actual production HTTPS URL |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://fyndiedplgyiowqvkfsk.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key for the exact production hostname |

**Worker runtime variables:**

| Name | Value |
|---|---|
| `NEXTJS_ENV` | `production` |
| `NEXT_PUBLIC_SUPABASE_URL` | Same project URL as the build variable |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Same publishable key as the build variable |
| `TURNSTILE_ALLOWED_HOSTNAMES` | Exact hostname(s), comma-separated, no scheme or path |

**Worker runtime secrets:**

| Name | Value |
|---|---|
| `SUPABASE_SECRET_KEY` | Supabase `sb_secret_` key; server runtime only. Legacy `SUPABASE_SERVICE_ROLE_KEY` is supported as a fallback. |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret; server runtime only |
| `RESEND_API_KEY` | Resend API key used only by server routes for lead alerts |
| `RESEND_FROM_EMAIL` | Verified sender address in your Resend domain |
| `LEAD_NOTIFICATION_EMAIL` | Owner notification destination; defaults to `aalphanation@gmail.com` |

Never use a `NEXT_PUBLIC_` prefix for any secret. Email alerts require a verified Resend sender and the three email variables above. Customer requests remain visible in the secure admin panel even when email delivery is not configured. Do not paste secrets into GitHub, source files, chat, or screenshots. The secret key is not required during the Next.js browser bundle build; it is used only by server routes at runtime.

## 3. Supabase setup

1. Run all four SQL files listed in `SUPABASE-ADMIN-SETUP.md` in the website Supabase project's SQL Editor.
2. In Supabase Authentication, create the owner user and run `supabase/setup_owner.sql`.
3. Keep public sign-ups disabled.
4. Sign in at `/admin/login`, enroll TOTP at `/admin/security`, and test signing out and signing in again. Admin access remains blocked until AAL2 is verified.
5. Confirm the Supabase secret key is entered only as a Cloudflare Worker runtime secret. Prefer the modern `sb_secret_` key.

The migrations remove direct anonymous INSERT permission on appointment and inquiry tables and require AAL2 for staff database access. All public submissions must pass through the server routes, Turnstile verification and database-backed IP rate limiting.

## 4. Cloudflare Turnstile

1. Deploy an initial Worker with public forms disabled to obtain the actual `workers.dev` hostname, or reserve your custom domain first.
2. In Cloudflare, create a Turnstile widget for the production hostname.
3. Use the returned site key and secret in the values above, then rebuild/redeploy so the site key is included in the browser bundle.
4. Add any preview hostname separately only if you intend to accept real submissions there.
5. Test a valid challenge, expired token, invalid token, hostname mismatch and repeated submissions.
6. Add a Cloudflare rate-limiting rule for `POST /api/admin/auth` to slow password-guessing attempts; Supabase Auth also applies its own authentication rate limits.

The database rate limit is five submissions per IP per form type per hour. Cloudflare's `CF-Connecting-IP` header is used in production; requests without it fail closed.

## 5. Deploy

Authenticate Wrangler against the intended Cloudflare account, then run:

```bash
npm run deploy
```

**Workers Builds build command:** `npm run cf:build` (this runs the existing Webpack Next.js build, then runs OpenNext with `--skipNextBuild` so it does not rebuild with Turbopack).

**Workers Builds deploy command:** `npx opennextjs-cloudflare deploy`.

The Worker name is `alpha-ins`, matching `name` in `wrangler.jsonc`. Do not deploy this project to `alpha-nation-site`; that is a different Worker. Check the `alpha-ins` Worker logs and test `https://alpha-ins.aalphanation.workers.dev`. Preserve configured environment values when deploying from Wrangler; do not overwrite secrets.

## 6. Post-deploy acceptance tests

- `/`, `/agents`, `/carriers`, `/quote`, `/contact`, `/privacy`, and `/terms` load on desktop and mobile.
- Anonymous visitors can read only active carrier records.
- Anonymous visitors cannot read customer submissions, agent records, license records, or staff roles.
- Forms reject missing/invalid Turnstile tokens and reject requests after the rate limit.
- Valid form submissions appear in the website Supabase project.
- `/admin` and every nested admin route redirect unauthenticated/inactive users to `/admin/login` and users without verified MFA to `/admin/security`.
- Admin API routes and the database staff-role helper reject sessions without AAL2.
- Active staff with verified MFA can manage records; inactive accounts cannot.
- Admin responses are not cached.
- HSTS, CSP Report-Only, frame denial, MIME and referrer headers are present on the live HTTPS host.
- Confirm logs contain no customer message bodies, passwords, access tokens or secret values.

Do not announce the site until the build, Worker preview and all acceptance tests pass, the owner MFA account works, and the business-approved privacy/terms disclosures are published.
