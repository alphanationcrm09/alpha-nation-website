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

1. **Local PowerShell verification:** GitHub Actions successfully installed the locked dependencies, ran ESLint and completed the Next.js production build plus OpenNext Cloudflare build (`npm run cf:build`) at commit `63f1b7a26df930e0134dadac5ffa642baf5b236f`. Run the same checks on the owner's Windows/PowerShell machine before deploying. A separate dependency vulnerability audit and live browser test have not been performed.
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

**The source and database hardening work is prepared, but the website is not yet approved for public launch.** Do not publish until the latest Cloudflare Worker preview succeeds, Cloudflare runtime secrets and Turnstile are verified, the owner account completes MFA, the legal disclosures are approved, and live acceptance tests pass.


## Current verification addendum — 21 November 2026

This section supersedes any conflicting earlier status statements in this historical audit.

### Verified in the current Supabase project

- Project status is `ACTIVE_HEALTHY`.
- The production schema contains the customer profile and policy tables, quote coverage options (8 rows), and service-state records (51 rows).
- There is one active owner role, and that owner's account has a verified TOTP factor. This confirms factor enrollment in Auth; an end-to-end browser login test has not been performed.
- Current Security Advisor result: one warning remains — leaked-password protection is disabled. Do not describe the current advisor result as zero findings.
- Performance Advisor reports seven unused indexes and four tables with multiple permissive SELECT policies. The unused-index notices are informational; no index was removed.
- Supabase reports 23 applied migration versions. The repository currently contains only one versioned file under `supabase/migrations`, with other SQL scripts stored outside that directory. The remote schema is present, but local migration history is incomplete. Do not run migration repair or fabricate historical migrations to hide this mismatch.

### Current source and release checks

- PR #27 contains the privacy notice correction and matching setup/deployment documentation updates.
- GitHub Actions completed successfully for commit `7dbc04c446cdc3e3544aedac83dbca1a3ddcb6ec`, including dependency installation, ESLint and `npm run cf:build`.
- A subsequent commit removes a duplicate privacy warning paragraph. No new GitHub Actions build was triggered for that final documentation-only commit; the preceding build is not a direct check of the latest SHA.
- The Supabase Preview check is skipped because the repository branch is not associated with a Supabase preview branch.
- The previous Cloudflare `alpha-ins` build failure remains unresolved. GitHub's OpenNext build passing does not prove that Cloudflare Workers Builds succeeds.
- No production Worker deployment or production database migration was performed during this review.

### Remaining release gates

1. Inspect and resolve the failed Cloudflare `alpha-ins` build using its Cloudflare build log.
2. Enable leaked-password protection in Supabase Auth settings.
3. Restore complete, authentic local migration history before relying on Supabase migration-based preview or deployment workflows.
4. Run a fresh build on the exact final PR commit.
5. Verify the Cloudflare runtime secrets, Turnstile hostname allowlist, and admin rate-limiting rule in the Cloudflare dashboard.
6. Complete live desktop/mobile acceptance tests for public pages, Turnstile-protected forms, admin login/logout, MFA, customer portal access, and response headers.
7. Obtain business/legal approval for the privacy and terms disclosures, including retention, referral sharing, legal operator/contact details, and applicable telemarketing consent language.

**Release decision: NOT READY.** The source build previously passed, and the owner TOTP factor is verified, but the Cloudflare build, current security warning, latest-commit CI, legal approval, and live acceptance tests are not yet verified.
