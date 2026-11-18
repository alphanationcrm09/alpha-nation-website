-- Alpha Nation: separate customer accounts and private policy records.
-- Customer records are created by the trusted server after an invitation.
create table if not exists public.customer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(btrim(full_name)) between 2 and 120),
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_policies (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customer_profiles(user_id) on delete cascade,
  policy_number text not null unique check (char_length(btrim(policy_number)) between 2 and 80),
  carrier_name text not null check (char_length(btrim(carrier_name)) between 2 and 120),
  product_name text not null check (char_length(btrim(product_name)) between 2 and 120),
  coverage_amount numeric(14,2) check (coverage_amount is null or coverage_amount >= 0),
  policy_status text not null default 'active' check (policy_status in ('active','pending','lapsed','cancelled','paid_up')),
  effective_date date,
  beneficiary_name text,
  beneficiary_relationship text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customer_policies_customer_id_idx
  on public.customer_policies(customer_id);

alter table public.customer_profiles enable row level security;
alter table public.customer_policies enable row level security;

revoke all on public.customer_profiles from anon, public;
revoke all on public.customer_policies from anon, public;
grant select, update (full_name, phone, updated_at) on public.customer_profiles to authenticated;
grant select, insert, update, delete on public.customer_policies to authenticated;

drop policy if exists customer_profiles_read_self on public.customer_profiles;
create policy customer_profiles_read_self on public.customer_profiles
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists customer_profiles_update_self on public.customer_profiles;
create policy customer_profiles_update_self on public.customer_profiles
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists customer_profiles_staff_read on public.customer_profiles;
create policy customer_profiles_staff_read on public.customer_profiles
  for select to authenticated using ((select private.is_website_staff()));

drop policy if exists customer_policies_read_self on public.customer_policies;
create policy customer_policies_read_self on public.customer_policies
  for select to authenticated using ((select auth.uid()) = customer_id);

drop policy if exists customer_policies_staff_read on public.customer_policies;
create policy customer_policies_staff_read on public.customer_policies
  for select to authenticated using ((select private.is_website_staff()));

drop policy if exists customer_policies_staff_insert on public.customer_policies;
create policy customer_policies_staff_insert on public.customer_policies
  for insert to authenticated with check ((select private.is_website_staff()));

drop policy if exists customer_policies_staff_update on public.customer_policies;
create policy customer_policies_staff_update on public.customer_policies
  for update to authenticated
  using ((select private.is_website_staff()))
  with check ((select private.is_website_staff()));

drop policy if exists customer_policies_staff_delete on public.customer_policies;
create policy customer_policies_staff_delete on public.customer_policies
  for delete to authenticated using ((select private.is_website_staff()));
