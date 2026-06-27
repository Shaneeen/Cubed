-- Outlets: physical store locations owned by a super admin.

create table public.outlets (
  id uuid primary key default gen_random_uuid(),
  super_admin_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.outlets enable row level security;

create policy "Super admins can manage their outlets"
  on public.outlets for all
  using (super_admin_id = auth.uid())
  with check (super_admin_id = auth.uid());

create trigger on_outlet_updated
  before update on public.outlets
  for each row execute function public.handle_updated_at();

-- Cubes: rentable display spaces inside an outlet, assignable to merchants.

create table public.cubes (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references public.outlets(id) on delete cascade,
  label text not null,
  merchant_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cubes enable row level security;

create policy "Super admins can manage cubes in their outlets"
  on public.cubes for all
  using (
    exists (
      select 1 from public.outlets o
      where o.id = outlet_id and o.super_admin_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.outlets o
      where o.id = outlet_id and o.super_admin_id = auth.uid()
    )
  );

create policy "Merchants can view their assigned cubes"
  on public.cubes for select
  using (merchant_id = auth.uid());

create trigger on_cube_updated
  before update on public.cubes
  for each row execute function public.handle_updated_at();
