-- Apply this migration in the Alpha Nation Website Supabase project only.
-- Admin pages, admin API routes, and RLS-protected management queries require AAL2.
create or replace function private.is_website_staff()
returns boolean
language sql
stable
security definer
set search_path to ''
as $function$
  select
    (auth.jwt() ->> 'aal') = 'aal2'
    and exists (
      select 1
      from public.staff_roles r
      where r.user_id = (select auth.uid())
        and r.active = true
        and r.role in ('owner','admin','staff')
    );
$function$;

revoke all on function private.is_website_staff() from public, anon;
grant execute on function private.is_website_staff() to authenticated;
