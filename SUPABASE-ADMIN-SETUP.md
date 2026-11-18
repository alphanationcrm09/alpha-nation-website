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
3. Create the owner account using the same email as the CRM Owner account: `khanbahi202502@gmail.com`. The CRM and website use separate Supabase projects, so the website requires its own Auth user and password; the CRM password is not automatically shared. Confirm the email if the dashboard offers that option.
4. Open SQL Editor and run `supabase/setup_owner.sql`.
5. Sign in at `/admin/login`. The app redirects to `/admin/security` until TOTP MFA is enrolled and verified.

Staff users must first be created in Supabase Authentication, then granted a `staff` or `admin` role in `public.staff_roles`. Do not grant the owner role to ordinary staff.

## Staff and customer account management

After the Owner account has completed MFA, the Admin panel includes two Owner-only sections:

- **Staff accounts:** invite staff or admins by email, change staff/admin roles, and deactivate or reactivate access. Owner access cannot be granted from this screen.
- **Customers and policies:** invite customers by email, create a private customer profile, and attach policy details. Customers sign in at `/customer/login` and see only policy rows linked to their own Auth user ID.

Invitation links return to `/auth/callback` and then to the password setup page. In Supabase Dashboard → Authentication → URL Configuration → Redirect URLs, add:

`https://alpha-ins.aalphanation.workers.dev/auth/callback`

Add the matching callback URL for any future custom domain before sending invitations from that domain. Supabase email delivery and the project's SMTP limits still apply. Staff access requires TOTP MFA; customer access does not.

Apply the customer account SQL files if setting up another environment:

1. `supabase/customer_accounts_and_policy_portal.sql`
2. `supabase/grant_customer_account_service_access.sql`

These create the customer profile and policy tables with RLS. Customer policy data is not imported from appointment requests; staff must enter verified policy details before customers will see them.

## Important operating notes

- The website database and authentication are separate from the existing Alpha Nation CRM. The website owner account uses the CRM Owner email identity, but sign-in credentials and MFA enrollment are configured separately in the website project.
- Public visitors can submit appointment requests and inquiries. They cannot read customer records.
- Appointment requests collect legal first and last name, phone, email, residential address, state, ZIP, insurance type, requested coverage amount, beneficiary name and relationship, plus preferred appointment date/time.
- To email owner alerts, configure `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (a verified sender) and `LEAD_NOTIFICATION_EMAIL` as Cloudflare Worker runtime secrets/variables. Email alerts contain no customer PII; complete details are available after signing in to the admin panel.
- Admin → Service states controls which states are available in the public appointment form.
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
