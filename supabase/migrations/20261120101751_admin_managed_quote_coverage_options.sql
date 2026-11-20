create table if not exists public.quote_coverage_options (
  id uuid primary key default gen_random_uuid(),
  amount integer not null unique check (amount between 2000 and 1000000),
  label text not null check (char_length(trim(label)) between 1 and 80),
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.quote_coverage_options (amount, label, sort_order)
values
  (5000, '$5,000', 10),
  (10000, '$10,000', 20),
  (15000, '$15,000', 30),
  (20000, '$20,000', 40),
  (25000, '$25,000', 50),
  (30000, '$30,000', 60),
  (40000, '$40,000', 70),
  (50000, '$50,000', 80)
on conflict (amount) do nothing;

alter table public.quote_coverage_options enable row level security;

grant select on public.quote_coverage_options to anon, authenticated;
grant insert, update, delete on public.quote_coverage_options to authenticated;

create policy "Public can read active quote coverage options"
on public.quote_coverage_options
for select
to anon, authenticated
using (active = true);

create policy "Owners can manage quote coverage options"
on public.quote_coverage_options
for all
to authenticated
using (
  exists (
    select 1 from public.staff_roles sr
    where sr.user_id = (select auth.uid())
      and sr.active = true
      and sr.role = 'owner'
  )
)
with check (
  exists (
    select 1 from public.staff_roles sr
    where sr.user_id = (select auth.uid())
      and sr.active = true
      and sr.role = 'owner'
  )
);
