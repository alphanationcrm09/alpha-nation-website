alter table public.appointments
  add column if not exists legal_first_name text,
  add column if not exists legal_last_name text,
  add column if not exists beneficiary_name text,
  add column if not exists beneficiary_relationship text,
  add column if not exists coverage_amount numeric(12,2);
alter table public.appointments add constraint appointments_coverage_amount_range
  check (coverage_amount is null or coverage_amount between 2000 and 50000000) not valid;
create table if not exists public.service_states (
  state_code char(2) primary key,
  state_name text not null unique,
  status text not null default 'active' check(status in ('active','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
insert into public.service_states(state_code,state_name) values
('AL','Alabama'),('AK','Alaska'),('AZ','Arizona'),('AR','Arkansas'),('CA','California'),('CO','Colorado'),('CT','Connecticut'),('DE','Delaware'),('DC','District of Columbia'),('FL','Florida'),('GA','Georgia'),('HI','Hawaii'),('ID','Idaho'),('IL','Illinois'),('IN','Indiana'),('IA','Iowa'),('KS','Kansas'),('KY','Kentucky'),('LA','Louisiana'),('ME','Maine'),('MD','Maryland'),('MA','Massachusetts'),('MI','Michigan'),('MN','Minnesota'),('MS','Mississippi'),('MO','Missouri'),('MT','Montana'),('NE','Nebraska'),('NV','Nevada'),('NH','New Hampshire'),('NJ','New Jersey'),('NM','New Mexico'),('NY','New York'),('NC','North Carolina'),('ND','North Dakota'),('OH','Ohio'),('OK','Oklahoma'),('OR','Oregon'),('PA','Pennsylvania'),('RI','Rhode Island'),('SC','South Carolina'),('SD','South Dakota'),('TN','Tennessee'),('TX','Texas'),('UT','Utah'),('VT','Vermont'),('VA','Virginia'),('WA','Washington'),('WV','West Virginia'),('WI','Wisconsin'),('WY','Wyoming')
on conflict(state_code) do nothing;
alter table public.service_states enable row level security;
revoke all on public.service_states from anon,authenticated;
grant select on public.service_states to anon,authenticated;
grant insert,update,delete on public.service_states to authenticated;
create policy "Public can view active service states" on public.service_states for select to anon,authenticated using(status='active' or private.is_website_staff());
create policy "Staff manage service states" on public.service_states for all to authenticated using(private.is_website_staff()) with check(private.is_website_staff());
