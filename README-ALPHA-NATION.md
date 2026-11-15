# Alpha Nation Website

Next.js 16.4.6 website with a separate Supabase backend for appointment requests, customer inquiries, carrier records, agent profiles and state-license records.

## Local setup

1. Install Node.js 22.16 or newer and npm 10.9 or newer.
2. Copy `.env.local.example` to `.env.local`.
3. Copy `.dev.vars.example` to `.dev.vars`.
4. Fill in the local Supabase secret and Cloudflare Turnstile test credentials. Keep both files private.
5. Run `npm install`.
6. Run `npm run dev` and open `http://localhost:3000`.
7. Run `npm run build` and `npm run preview` before considering deployment.

## Admin

- Login: `/admin/login`
- Admin workspace: `/admin`
- MFA setup: `/admin/security`
- First owner account setup: follow `SUPABASE-ADMIN-SETUP.md` and run `supabase/setup_owner.sql` after creating the owner in Supabase Authentication.
- Public account registration is disabled. Admin pages, APIs and database management policies require a verified TOTP MFA session.

## Backend

Supabase project: `fyndiedplgyiowqvkfsk` (`Alpha Nation Website`). It is separate from the Alpha Nation CRM. See `SUPABASE-ADMIN-SETUP.md` for owner/staff provisioning and operating limitations.

## Deployment

The site uses server rendering and API routes. Deploy to **Cloudflare Workers** using OpenNext, not as a static Pages export. The default hostname will be a `workers.dev` hostname unless a custom domain is connected. See `CLOUDFLARE-DEPLOYMENT.md`.

## Important

The booking form submits preferred appointment requests, not confirmed calendar reservations. Staff must confirm the date/time and time zone with the customer. Agent records remain inactive until every assigned state has a current verified license record. Carrier directory entries do not establish appointment authority or product availability.

## Launch status

Read `SECURITY-AND-LAUNCH-AUDIT.md`. A full production build, Worker preview, live browser tests, owner MFA setup, Turnstile configuration and legal approval are still required before public launch.
