create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  status text not null default 'pending',
  subtotal numeric(12, 2) not null default 0,
  shipping_total numeric(12, 2) not null default 0,
  tax_total numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  currency text not null default 'USD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_status_valid check (
    status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')
  ),
  constraint orders_subtotal_nonnegative check (subtotal >= 0),
  constraint orders_shipping_total_nonnegative check (shipping_total >= 0),
  constraint orders_tax_total_nonnegative check (tax_total >= 0),
  constraint orders_total_nonnegative check (total >= 0),
  constraint orders_currency_format check (currency ~ '^[A-Z]{3}$')
);

create index orders_user_id_idx on public.orders (user_id);
create index orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;

create policy "Users can view their own orders"
  on public.orders
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.handle_updated_at();