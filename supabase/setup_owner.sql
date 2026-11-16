-- Run only after creating the owner account in this WEBSITE project's Supabase Authentication.
-- The CRM and website use separate Supabase projects, so the same email is used
-- for the owner identity but the website account must be created separately.
-- CRM owner email: khanbahi202502@gmail.com.
insert into public.staff_roles (user_id, role, active)
select id, 'owner', true
from auth.users
where lower(email) = lower('khanbahi202502@gmail.com')
on conflict (user_id) do update set role = 'owner', active = true;
