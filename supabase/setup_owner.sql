-- Run only after creating the owner in Supabase Authentication > Users.
-- The account must use the owner's verified email address.
insert into public.staff_roles (user_id, role, active)
select id, 'owner', true
from auth.users
where lower(email) = lower('aalphanation@gmail.com')
on conflict (user_id) do update set role = 'owner', active = true;
