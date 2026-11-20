# Alpha Nation Website — Security and Launch Audit

## Latest verification addendum — 21 November 2026

The current review branch is `feat/alpha-nation-v2-deploy-ready`.

- GitHub Actions completed successfully at commit `63f1b7a26df930e0134dadac5ffa642baf5b236f`.
- The workflow completed dependency installation, ESLint, the Next.js production build and the OpenNext Cloudflare build (`npm run cf:build`).
- This verifies the source build pipeline. It does not replace local Windows/PowerShell verification, browser testing or production acceptance tests.
- The Cloudflare PR preview build for commit `63f1b7a` was still reported as in progress at the time of this update. No production Worker deployment was performed.
- The repository's existing `wrangler.jsonc` production Worker name remains `alpha-ins`. The PR preview Worker named `alpha-nation-site` is separate. Confirm the intended Cloudflare account with `npx wrangler whoami` before deployment.

The legal/compliance and account-configuration checks below remain separate from source-code build validation.

Audit date: 15 November 2026  
Scope: source package and the separate Supabase project `Alpha Nation Website` (`fyndiedplgyiowqvkfsk`). The existing Alpha Nation CRM was not accessed or modified.

## Improvements implemented

### Framework and hosting

- Updated the project from Next.js 14 to Next.js 16.4.6 and React 19.3.1.
- Added the Cloudflare OpenNext adapter (`@opennextjs/cloudflare` 1.20.17) and Wrangler deployment configuration for Cloudflare Workers.
- Added production metadata, robots rules, sitemap generation, static-asset caching headers and deployment instructions.
- The project is a server-rendered Next.js app. It must run on Cloudflare Workers, not a static Pages export. Its default hostname will be a `workers.dev` hostname unless a custom domain is connected.

### Admin authentication and cookies

- Replaced browser-persisted admin authentication with server-managed Supabase SSR sessions.
- Admin session cookies are set `HttpOnly`, `Secure` in production, `SameSite=Lax`, and `Path=/`.
- The browser Supabase client is anonymous and does not persist admin credentials or sessions in local storage.
- Admin sign-in, sign-out, admin data access, and MFA operations now go through server routes.
- Admin page middleware checks the signed-in user and active staff role. Admin APIs repeat the staff check.
- TOTP multi-factor authentication is enforced at AAL2 by middleware, admin APIs and the database staff-role helper. A first-time staff login is redirected to `/admin/security` to enroll an authenticator.
- Mutating admin API requests check the request Origin.

### Public form protection

- Public appointment and inquiry submissions now go through server-side API routes.
- The server verifies Cloudflare Turnstile tokens, action names, hostname and request origin.
- Submissions are limited to five per IP per form type per hour using a private database table and a server-only RPC.
- Anonymous users no longer have direct INSERT permission on appointment or inquiry tables. The server uses a Supabase secret key stored only in runtime secrets.
- Form inputs have server-side length, email, phone, state, ZIP, product, date, time-zone and consent validation.
- A honeypot and browser-side validation remain as additional filters, not as the primary protection.
- The appointment form records the visitor's IANA time zone. Preferred dates/times remain requests and are not automatically confirmed.

### Database security and licensing controls

- Supabase Security Advisor returned zero security lint findings after the changes.
- Anonymous users can read active carrier directory rows only. They cannot read customer requests, agents, licenses or staff roles, and cannot directly submit appointment/inquiry rows.
- Only the server-side service role can execute the database rate-limit RPC or access the private rate-limit table.
- The private staff helper requires an AAL2 JWT as well as an active owner/admin/staff role.
- Added database triggers that reject license verification without NPN, license number and a future expiry date, and reject agent activation without current verified licenses for every assigned state.
- Added a partial unique index to prevent duplicate non-carrier-specific agent/state license records.
- Database input constraints validate public request field lengths and state/ZIP formats.
- A missing carrier foreign-key index was added. Overlapping public policies were scoped to anonymous users.

### Website content and privacy

- Added Privacy Policy and Terms of Use drafts covering submitted fields, service providers, referrals, essential admin cookies, Turnstile, appointment limitations and insurance disclosures.
- Removed unverified agent names and state territories from the public agent page. It now explains the licensing verification process.
- Updated the homepage time-zone FAQ to match the form's actual browser time-zone behavior.
- The public carrier directory remains explicitly non-exhaustive and does not imply appointment authority or product availability.
- No testimonials, invented prices, or guaranteed coverage claims were added.

### Response headers

- Added HSTS, `X-Content-Type-Options`, `X-Frame-Options`, a strict referrer policy, Permissions Policy, same-origin opener policy, no-store admin/API responses and a CSP in Report-Only mode.
- CSP is not yet enforced. It must be reviewed against the live site and Turnstile before moving from Report-Only to enforcement.

## Verified directly in Supabase

- Security Advisor: zero security lint findings after the final database changes.
- Anonymous INSERT permission on appointments: denied.
- Anonymous INSERT permission on inquiries: denied.
- Anonymous SELECT on appointments/inquiries: denied.
- Anonymous SELECT on agents and agent licenses: denied.
- Anonymous SELECT on active carrier directory: allowed.
- Anonymous execution of rate-limit RPC: denied.
- Service-role execution of rate-limit RPC: allowed.
- Staff helper execution: granted only to authenticated users; helper additionally checks JWT AAL2 and active staff role.
- License-verification and agent-activation triggers are installed.

The performance advisor still lists several indexes as unused. The website database has little/no production traffic, so this is expected. Do not remove them without reviewing real query plans.

## Remaining launch blockers

These are not code changes that can be completed without the owner's account setup or business/legal decisions.

1. **Production dependency install and build:** npm package installation timed out because the package registry was unreachable from this environment. The TypeScript/TSX parser check passed, but a full type check, Next production build, OpenNext preview and dependency audit have not passed. A fresh `package-lock.json` must be generated by `npm install` in an environment with registry access.
2. **Cloudflare account deployment:** no Cloudflare account was connected to this session. The Worker has not been deployed and no live hostname has been verified.
3. **Secrets and Turnstile:** the owner must add the Supabase `sb_secret_` key and Turnstile secret as Cloudflare runtime secrets, configure the site key at build time, and allowlist the actual production hostname. Public forms intentionally fail closed until these values exist.
4. **Owner account and MFA:** the owner Auth user has not been provisioned. Create it in Supabase Auth, run `supabase/setup_owner.sql`, sign in, and complete TOTP enrollment at `/admin/security`.
5. **Legal approval:** Privacy and Terms are drafts, not legal advice. The legal operator name and mailing address, lead/referral disclosure, retention schedule, state privacy notices, insurance licensing language and telemarketing/TCPA consent wording must be confirmed by the business and qualified counsel before collecting live leads.
6. **Live acceptance tests:** desktop/mobile, form submissions, Turnstile failure cases, database rate limits, admin login/logout, MFA, unauthorized access, agent license activation, response headers, and backup/recovery have not been tested against a live deployment.

## Operational limits to keep visible

- Appointment dates/times are preferred requests, not confirmed reservations. Staff must contact the customer to confirm.
- Agent license verification is based on records entered and checked by staff; the website does not automatically query state regulators. Expired licenses must be reviewed and agents deactivated before routing.
- Carrier directory status does not prove appointment authority, product availability or eligibility.
- The initial carrier directory is not an exhaustive list of every US insurance carrier.
- No automatic calendar collision detection, email notification, or agent auto-assignment is implemented.

## Database migrations applied

- `tighten_website_table_grants_and_license_index`
- `scope_public_website_policies_to_anonymous_role`
- `validate_public_website_submission_fields`
- `make_public_appointment_address_optional`
- `secure_public_forms_with_turnstile_and_rate_limits`
- `restore_staff_helper_schema_access`
- `deny_direct_access_to_private_submission_limits`
- `require_admin_mfa_for_database_staff_access`
- `prevent_duplicate_agent_state_license_records`
- `enforce_current_agent_license_before_activation`

## Launch decision

**The source and database hardening work is prepared, but the website is not yet approved for public launch.** Do not publish until the dependency install/build/Worker preview passes, Cloudflare secrets and Turnstile are configured, the owner account completes MFA, the legal drafts are approved, and live acceptance tests pass.
