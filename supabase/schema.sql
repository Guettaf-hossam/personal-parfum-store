create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  volume text not null default '100 ml',
  category text not null default 'شرقي',
  price numeric not null check (price > 0),
  old_price numeric check (old_price is null or old_price > 0),
  description text,
  image text not null,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_active_created
  on public.products (is_active, created_at desc);

alter table public.products enable row level security;

create policy "Allow anonymous read active products"
  on public.products
  for select
  to anon
  using (is_active = true);

create policy "Allow authenticated full access to products"
  on public.products
  for all
  to authenticated
  using (true)
  with check (true);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Allow public read product images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'product-images');

create policy "Allow authenticated upload product images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "Allow authenticated update product images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'product-images');

create policy "Allow authenticated delete product images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'product-images');