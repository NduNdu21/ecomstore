create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  price numeric(12, 2) not null,
  currency text not null default 'USD',
  stock_quantity integer not null default 0,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_price_nonnegative check (price >= 0),
  constraint products_stock_nonnegative check (stock_quantity >= 0),
  constraint products_currency_format check (currency ~ '^[A-Z]{3}$'),
  constraint products_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create unique index products_slug_lower_idx on public.products (lower(slug));

alter table public.products enable row level security;

create policy "Anyone can view active products"
  on public.products
  for select
  to anon, authenticated
  using (is_active = true);

create trigger products_updated_at
  before update on public.products
  for each row execute function public.handle_updated_at();