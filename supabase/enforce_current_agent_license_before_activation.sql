-- A license cannot be marked verified without identity numbers and a current expiry date.
create or replace function private.guard_verified_agent_license()
returns trigger
language plpgsql
security definer
set search_path to ''
as $function$
begin
  if new.verification_status = 'verified' then
    if nullif(btrim(new.npn), '') is null
       or nullif(btrim(new.license_number), '') is null
       or new.expires_at is null
       or new.expires_at < current_date then
      raise exception 'A verified license requires an NPN, license number and future expiry date.';
    end if;
    new.verified_at := coalesce(new.verified_at, now());
  else
    new.verified_at := null;
  end if;
  return new;
end;
$function$;

revoke all on function private.guard_verified_agent_license() from public, anon, authenticated;
drop trigger if exists guard_verified_agent_license on public.agent_licenses;
create trigger guard_verified_agent_license
before insert or update of verification_status, npn, license_number, expires_at
on public.agent_licenses
for each row execute function private.guard_verified_agent_license();

create or replace function private.guard_agent_activation()
returns trigger
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_missing text;
begin
  if new.status = 'active' then
    if coalesce(array_length(new.states, 1), 0) = 0 then
      raise exception 'An active agent must have at least one assigned state.';
    end if;
    select string_agg(requested.state_code, ', ' order by requested.state_code)
      into v_missing
    from unnest(new.states) as requested(state_code)
    where not exists (
      select 1 from public.agent_licenses license
      where license.agent_id = new.id
        and license.state_code = requested.state_code
        and license.verification_status = 'verified'
        and license.expires_at >= current_date
    );
    if v_missing is not null then
      raise exception 'Cannot activate agent. Current verified licenses are missing for: %', v_missing;
    end if;
  end if;
  return new;
end;
$function$;

revoke all on function private.guard_agent_activation() from public, anon, authenticated;
drop trigger if exists guard_agent_activation on public.agents;
create trigger guard_agent_activation
before insert or update of status, states
on public.agents
for each row execute function private.guard_agent_activation();
