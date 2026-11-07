-- ============================================================================
-- Auto-delete Completed Orders After 30 Days
-- HOW TO RUN: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run.
-- ============================================================================

-- 1. Track exact completion timestamp on each order
alter table public."order"
  add column if not exists completed_at timestamptz;

-- Backfill existing completed orders that don't have completed_at yet
update public."order"
set completed_at = coalesce(completed_at, created_at, now())
where "orderLevel" = 3
  and completed_at is null;

-- 2. Trigger: automatically stamp completed_at when orderLevel becomes 3
create or replace function public.set_order_completed_at()
returns trigger
language plpgsql
as $$
begin
  if new."orderLevel" = 3 and (old."orderLevel" is distinct from 3) then
    new.completed_at := coalesce(new.completed_at, now());
  elsif new."orderLevel" is distinct from 3 then
    new.completed_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_set_order_completed_at on public."order";
create trigger trg_set_order_completed_at
  before update on public."order"
  for each row
  execute function public.set_order_completed_at();

-- 3. Allow admins to delete completed orders directly if needed
drop policy if exists "Admins can delete completed orders" on public."order";
create policy "Admins can delete completed orders"
  on public."order"
  for delete
  to authenticated
  using (public.is_admin() and "orderLevel" = 3);

-- 4. Cleanup function: deletes completed orders older than 30 days
create or replace function public.cleanup_expired_completed_orders()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  with deleted as (
    delete from public."order"
    where "orderLevel" = 3
      and coalesce(completed_at, created_at) <= (now() - interval '30 days')
    returning id
  )
  select count(*) into deleted_count from deleted;

  return deleted_count;
end;
$$;

grant execute on function public.cleanup_expired_completed_orders() to authenticated, anon;

-- Run once immediately
select public.cleanup_expired_completed_orders();

-- 5. Schedule daily automatic DB cleanup via pg_cron (runs every day at 03:00 UTC)
do $$
begin
  create extension if not exists pg_cron;

  if exists (select 1 from cron.job where jobname = 'cleanup-completed-orders-30d') then
    perform cron.unschedule('cleanup-completed-orders-30d');
  end if;

  perform cron.schedule(
    'cleanup-completed-orders-30d',
    '0 3 * * *',
    $cron$select public.cleanup_expired_completed_orders();$cron$
  );
exception
  when others then
    raise notice 'pg_cron schedule skipped (enable pg_cron in Database -> Extensions if desired): %', sqlerrm;
end;
$$;
