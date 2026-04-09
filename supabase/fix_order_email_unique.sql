-- The app allows many orders per customer; email must NOT be unique on `order`.
-- Run this in Supabase: SQL Editor → New query → paste → Run.

ALTER TABLE "order" DROP CONSTRAINT IF EXISTS order_email_key;

-- If the constraint name differs, list constraints with:
-- SELECT conname FROM pg_constraint
--   JOIN pg_class ON pg_constraint.conrelid = pg_class.oid
--   WHERE pg_class.relname = 'order';
