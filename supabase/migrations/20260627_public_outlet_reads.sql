-- Let public/customer pages retrieve only outlets marked as visible.

drop policy if exists "Anyone can read public outlets" on public.outlets;

create policy "Anyone can read public outlets"
  on public.outlets for select
  using (is_public = true);
