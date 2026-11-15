# Alpha Nation website backend setup

Supabase project: `Alpha Nation Website`
Project ref: `fyndiedplgyiowqvkfsk`

## Connect the website

1. Copy `.env.local.example` to `.env.local`.
2. Keep the Supabase URL and publishable key values from that example.
3. Install dependencies and run `npm run build` before deployment.

The publishable key is intended for browser use. Never put a Supabase secret/service-role key in this repository or in a `NEXT_PUBLIC_` variable.

## Apply the security migrations first

In SQL Editor for this website project, run these files in order:

1. `supabase/secure_public_forms.sql`
2. `supabase/require_admin_mfa.sql`
3. `supabase/prevent_duplicate_agent_state_license_records.sql`
4. `supabase/enforce_current_agent_license_before_activation.sql`

These restrict public form writes, add the server-only rate-limit store, require AAL2 for admin database access, and enforce current license records before agent activation.

## Create the first owner login

The website intentionally has no public sign-up page. Create the owner account directly in Supabase:

1. Open the Supabase dashboard for project `fyndiedplgyiowqvkfsk`.
2. Open Authentication → Users → Add user.
3. Create the owner account using `aalphanation@gmail.com` and a strong password known only to the owner. Confirm the email if the dashboard offers that option.
4. Open SQL Editor and run `supabase/setup_owner.sql`.
5. Sign in at `/admin/login`. The app redirects to `/admin/security` until TOTP MFA is enrolled and verified.

Staff users must first be created in Supabase Authentication, then granted a `staff` or `admin` role in `public.staff_roles`. Do not grant the owner role to ordinary staff.

## Important operating notes

- The website database is separate from the existing Alpha Nation CRM.
- Public visitors can submit appointment requests and inquiries. They cannot read customer records.
- Appointment preferred dates/times are stored as local requests and are not automatically confirmed or checked against agent calendars. Staff must call to confirm.
- Agent records and state licenses are initially unverified. Verify NPN and license status with the relevant state regulator before activating an agent for customer routing.
- The carrier directory is editable in the admin panel. A carrier listed does not mean Alpha Nation is appointed with it in every state or that every product is available.
- Do not collect medical/health details in the public booking form.




## Admin authentication hardening

- Admin sessions are stored in `Secure` (production), `HttpOnly`, `SameSite=Lax`, `Path=/` cookies. The browser JavaScript client is anonymous and read-only; it does not persist an admin session in local storage.
- The Next.js middleware, admin API routes and `private.is_website_staff()` database helper require a verified TOTP session at AAL2.
- On first login, open `/admin/security`, scan the QR code in an authenticator app, and verify the current code. Admin pages remain blocked until MFA is verified.
- Keep a second authenticator method/device available for recovery. Do not share one-time codes or authenticator secrets.
- Keep public user registration disabled and periodically review active rows in `staff_roles`.
