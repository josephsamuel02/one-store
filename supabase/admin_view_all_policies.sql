-- ============================================================================
-- Why this is needed
-- ============================================================================
-- The app uses Supabase Row Level Security (RLS). With the default per-user
-- policies, the logged-in admin can ONLY read rows that belong to their own
-- account. That is why:
--   * The admin sees their OWN orders but NOT orders placed by other people.
--   * The new "Users" page can only see the admin's own user row.
--
-- This script adds an `is_admin()` helper and SELECT policies so that any user
-- whose row in the "user" table has role = 'admin' can read ALL orders and ALL
-- users. Regular shoppers are unaffected and still only see their own data.
--
-- HOW TO RUN: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run.
-- ============================================================================

-- 1. Helper that tells whether the current logged-in user is an admin.
--    SECURITY DEFINER lets it read the "user" table without being blocked by
--    that table's own RLS (this also avoids infinite recursion in policies).
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public."user" u
    where u.id = auth.uid()
      and lower(u.role) = 'admin'
  );
$$;

-- ============================================================================
-- 2. ORDERS: let admins read every order.
-- ============================================================================
alter table "order" enable row level security;

drop policy if exists "Admins can view all orders" on "order";
create policy "Admins can view all orders"
  on "order"
  for select
  to authenticated
  using (public.is_admin());

-- (Optional) let admins update order status / progress on any order.
drop policy if exists "Admins can update all orders" on "order";
create policy "Admins can update all orders"
  on "order"
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================================
-- 3. USERS: let admins read every signed-up user (needed for the Users page).
-- ============================================================================
alter table "user" enable row level security;

drop policy if exists "Admins can view all users" on "user";
create policy "Admins can view all users"
  on "user"
  for select
  to authenticated
  using (public.is_admin());

-- ============================================================================
-- NOTE: Make sure your existing "own data" policies are still in place so that
-- regular shoppers can read/insert their OWN orders and their OWN user row,
-- e.g. a policy with USING (user_id = auth.uid()) on "order" for select, and
-- USING (id = auth.uid()) on "user" for select. The policies above are ADDED
-- on top of those (Postgres combines multiple SELECT policies with OR).
-- ============================================================================
