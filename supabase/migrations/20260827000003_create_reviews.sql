create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  rating smallint not null,
  title text,
  body text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reviews_rating_range check (rating between 1 and 5),
  constraint reviews_user_product_unique unique (user_id, product_id)
);

create index reviews_product_id_idx on public.reviews (product_id);
create index reviews_published_product_idx
  on public.reviews (product_id, created_at desc)
  where is_published = true;

alter table public.reviews enable row level security;

create policy "Anyone can view published reviews"
  on public.reviews
  for select
  to anon, authenticated
  using (is_published = true);

create policy "Users can create their own reviews"
  on public.reviews
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own reviews"
  on public.reviews
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own reviews"
  on public.reviews
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create trigger reviews_updated_at
  before update on public.reviews
  for each row execute function public.handle_updated_at();