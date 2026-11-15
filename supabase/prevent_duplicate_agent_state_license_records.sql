-- Prevent duplicate non-carrier-specific license records for an agent/state pair.
create unique index if not exists agent_licenses_agent_state_no_carrier_uidx
on public.agent_licenses (agent_id, state_code)
where carrier_id is null;
