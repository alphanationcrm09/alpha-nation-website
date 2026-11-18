-- Add an explicit insurance category to each customer policy.
-- Existing records are preserved and default to Final Expense.
alter table public.customer_policies
  add column if not exists insurance_category text not null default 'Final Expense';

alter table public.customer_policies
  drop constraint if exists customer_policies_insurance_category_check;

alter table public.customer_policies
  add constraint customer_policies_insurance_category_check
  check (insurance_category in ('Final Expense', 'Whole Life', 'Term Life', 'Universal Life', 'Homeowners Insurance', 'Renters Insurance', 'Auto Insurance', 'ACA Health Insurance', 'Medicare Advantage', 'Medicare Supplement', 'Medicare Part D', 'Other'));

create index if not exists customer_policies_category_idx
  on public.customer_policies(insurance_category);
