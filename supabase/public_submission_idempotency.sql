-- Prevent repeated identical public submissions from creating duplicate leads.
-- Fingerprints are HMAC-SHA256 values and do not expose submitted personal data.
alter table public.appointments
  add column if not exists submission_fingerprint text;

alter table public.inquiries
  add column if not exists submission_fingerprint text;

create unique index if not exists appointments_submission_fingerprint_uidx
  on public.appointments (submission_fingerprint)
  where submission_fingerprint is not null;

create unique index if not exists inquiries_submission_fingerprint_uidx
  on public.inquiries (submission_fingerprint)
  where submission_fingerprint is not null;

comment on column public.appointments.submission_fingerprint is
  'Daily HMAC fingerprint used to make identical website submissions idempotent.';
comment on column public.inquiries.submission_fingerprint is
  'Daily HMAC fingerprint used to make identical website submissions idempotent.';
