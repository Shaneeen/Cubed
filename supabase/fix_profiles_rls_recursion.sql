-- Run this once in the Supabase SQL editor if login fails with:
-- "infinite recursion detected in policy for relation profiles"

drop policy if exists "Super admins can read their merchants" on public.profiles;

create policy "Super admins can read their merchants"
  on public.profiles for select
  using (super_admin_id = auth.uid());
