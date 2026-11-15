-- Apply this migration in the Alpha Nation Website Supabase project only.
create schema if not exists private;

create table if not exists private.website_submission_limits (
  ip_hash text not null check (ip_hash ~ '^[0-9a-f]{64}$'),
  submission_type text not null check (submission_type in ('appointment','inquiry')),
  window_started_at timestamptz not null default now(),
  submission_count integer not null default 0 check (submission_count >= 0),
  primary key (ip_hash, submission_type)
);

alter table private.website_submission_limits enable row level security;
drop policy if exists "deny direct access to website submission limits" on private.website_submission_limits;
create policy "deny direct access to website submission limits"
on private.website_submission_limits for all to public using (false) with check (false);
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated, service_role;
grant execute on function private.is_website_staff() to authenticated;
revoke all on table private.website_submission_limits from public, anon, authenticated;
grant select, insert, update, delete on table private.website_submission_limits to service_role;

create or replace function public.consume_website_submission_limit(
  p_ip_hash text,
  p_submission_type text,
  p_max integer default 5,
  p_window_seconds integer default 3600
)
returns boolean
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_count integer;
begin
  if p_ip_hash !~ '^[0-9a-f]{64}$'
     or p_submission_type not in ('appointment','inquiry')
     or p_max < 1 or p_max > 20
     or p_window_seconds < 1 or p_window_seconds > 86400 then
    return false;
  end if;

  insert into private.website_submission_limits
    (ip_hash, submission_type, window_started_at, submission_count)
  values (p_ip_hash, p_submission_type, now(), 1)
  on conflict (ip_hash, submission_type) do update
  set
    window_started_at = case
      when private.website_submission_limits.window_started_at <= now() - make_interval(secs => p_window_seconds)
      then now() else private.website_submission_limits.window_started_at end,
    submission_count = case
      when private.website_submission_limits.window_started_at <= now() - make_interval(secs => p_window_seconds)
      then 1 else private.website_submission_limits.submission_count + 1 end
  returning submission_count into v_count;

  return v_count <= p_max;
end;
$function$;

revoke all on function public.consume_website_submission_limit(text,text,integer,integer)
  from public, anon, authenticated;
grant execute on function public.consume_website_submission_limit(text,text,integer,integer)
  to service_role;

revoke insert on table public.appointments, public.inquiries from anon;
