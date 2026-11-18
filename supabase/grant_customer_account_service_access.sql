-- The server-only Supabase secret client needs explicit Data API grants
-- when project default privileges have been tightened.
grant select, insert, update, delete on public.customer_profiles to service_role;
grant select, insert, update, delete on public.customer_policies to service_role;
