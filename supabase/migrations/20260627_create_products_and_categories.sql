-- Product folders/categories owned by merchants.

create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.product_categories enable row level security;

drop policy if exists "Merchants can manage their product categories" on public.product_categories;
drop policy if exists "Super admins can read merchant product categories" on public.product_categories;

create policy "Merchants can manage their product categories"
  on public.product_categories for all
  using (merchant_id = auth.uid())
  with check (merchant_id = auth.uid());

create policy "Super admins can read merchant product categories"
  on public.product_categories for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = merchant_id and p.super_admin_id = auth.uid()
    )
  );

drop trigger if exists on_product_category_updated on public.product_categories;

create trigger on_product_category_updated
  before update on public.product_categories
  for each row execute function public.handle_updated_at();

-- Products owned by merchants. Products can optionally sit inside a folder.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.product_categories(id) on delete set null,
  name text not null,
  description text,
  image_url text,
  price numeric(10, 2) not null default 0 check (price >= 0),
  quantity integer not null default 0 check (quantity >= 0),
  status text not null default 'active' check (status in ('draft', 'active', 'hidden', 'sold_out')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Merchants can manage their products" on public.products;
drop policy if exists "Super admins can read merchant products" on public.products;

create policy "Merchants can manage their products"
  on public.products for all
  using (merchant_id = auth.uid())
  with check (
    merchant_id = auth.uid()
    and (
      category_id is null
      or exists (
        select 1 from public.product_categories c
        where c.id = category_id and c.merchant_id = auth.uid()
      )
    )
  );

create policy "Super admins can read merchant products"
  on public.products for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = merchant_id and p.super_admin_id = auth.uid()
    )
  );

drop trigger if exists on_product_updated on public.products;

create trigger on_product_updated
  before update on public.products
  for each row execute function public.handle_updated_at();

-- Public product image bucket. Files are grouped under merchant_id folders:
-- product-images/{merchant_id}/{filename}

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can read product images" on storage.objects;
drop policy if exists "Merchants can upload product images" on storage.objects;
drop policy if exists "Merchants can update own product images" on storage.objects;
drop policy if exists "Merchants can delete own product images" on storage.objects;

create policy "Anyone can read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Merchants can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Merchants can update own product images"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'product-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Merchants can delete own product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
