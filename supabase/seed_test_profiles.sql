-- Manual setup for one super admin and one merchant test account.
--
-- Step 1:
-- Create these two users first in Supabase Authentication > Users:
--   superadmin@cubed.test
--   merchant@cubed.test
--
-- Step 2:
-- Copy their UUIDs from the Auth dashboard and replace the placeholders below.
--
-- Step 3:
-- Run this SQL in the Supabase SQL editor.

begin;

-- Replace these placeholder UUIDs with the real auth.users IDs.
with ids as (
  select
    '11111111-1111-1111-1111-111111111111'::uuid as super_admin_id,
    '22222222-2222-2222-2222-222222222222'::uuid as merchant_id
)
insert into public.profiles (id, email, full_name, role, super_admin_id)
select
  ids.super_admin_id,
  'superadmin@cubed.test',
  'Cubed Super Admin',
  'super_admin',
  null
from ids
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role,
  super_admin_id = excluded.super_admin_id;

with ids as (
  select
    '11111111-1111-1111-1111-111111111111'::uuid as super_admin_id,
    '22222222-2222-2222-2222-222222222222'::uuid as merchant_id
)
insert into public.profiles (id, email, full_name, role, super_admin_id)
select
  ids.merchant_id,
  'merchant@cubed.test',
  'Cubed Test Merchant',
  'merchant',
  ids.super_admin_id
from ids
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role,
  super_admin_id = excluded.super_admin_id;

commit;
