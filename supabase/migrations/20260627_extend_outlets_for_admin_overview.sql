-- Extend outlets so they can carry the same location-facing metadata Ryan's
-- hardcoded customer pages used: a short descriptor and a public floorplan URL.

alter table public.outlets
  add column if not exists descriptor text,
  add column if not exists public_href text,
  add column if not exists is_public boolean not null default true;

-- Optional backfill for the three original Ryan outlets if names match.
update public.outlets
set
  descriptor = coalesce(descriptor, 'Community mall in Tampines Central'),
  public_href = coalesce(public_href, '/ourtampineshubfloorplan')
where lower(name) = 'our tampines hub';

update public.outlets
set
  descriptor = coalesce(descriptor, 'East-side mall near Pasir Ris MRT'),
  public_href = coalesce(public_href, '/pasirrismallfloorplan')
where lower(name) = 'pasir ris mall';

update public.outlets
set
  descriptor = coalesce(descriptor, 'Heartland mall above Woodleigh MRT'),
  public_href = coalesce(public_href, '/woodleighmallfloorplan')
where lower(name) = 'woodleigh mall';

create or replace function public.get_super_admin_outlet_overview()
returns table (
  id uuid,
  super_admin_id uuid,
  name text,
  address text,
  descriptor text,
  public_href text,
  is_public boolean,
  created_at timestamptz,
  updated_at timestamptz,
  cube_count bigint,
  occupied_cube_count bigint
)
language sql
security invoker
set search_path = public
as $$
  select
    o.id,
    o.super_admin_id,
    o.name,
    o.address,
    o.descriptor,
    o.public_href,
    o.is_public,
    o.created_at,
    o.updated_at,
    count(c.id)::bigint as cube_count,
    count(c.id) filter (where c.merchant_id is not null)::bigint as occupied_cube_count
  from public.outlets o
  left join public.cubes c on c.outlet_id = o.id
  where o.super_admin_id = auth.uid()
  group by
    o.id,
    o.super_admin_id,
    o.name,
    o.address,
    o.descriptor,
    o.public_href,
    o.is_public,
    o.created_at,
    o.updated_at
  order by o.created_at desc;
$$;
