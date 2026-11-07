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
-- 4. ORDER DELIVERY COLUMNS (optional, app also falls back to JSONB metadata)
-- ============================================================================
alter table "order"
  add column if not exists delivery_address text,
  add column if not exists whatsapp_number text,
  add column if not exists alternative_phone text;

-- ============================================================================
-- 5. PRODUCTS & STORAGE: ensure admins can insert/update/delete products & images
-- ============================================================================
alter table "products" enable row level security;

drop policy if exists "Anyone can view products" on "products";
create policy "Anyone can view products"
  on "products"
  for select
  using (true);

drop policy if exists "Admins can insert products" on "products";
create policy "Admins can insert products"
  on "products"
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update products" on "products";
create policy "Admins can update products"
  on "products"
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete products" on "products";
create policy "Admins can delete products"
  on "products"
  for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'products' and public.is_admin());

-- ============================================================================
-- NOTE: Make sure your existing "own data" policies are still in place so that
-- regular shoppers can read/insert their OWN orders and their OWN user row,
-- e.g. a policy with USING (user_id = auth.uid()) on "order" for select, and
-- USING (id = auth.uid()) on "user" for select. The policies above are ADDED
-- on top of those (Postgres combines multiple SELECT policies with OR).
-- ============================================================================
