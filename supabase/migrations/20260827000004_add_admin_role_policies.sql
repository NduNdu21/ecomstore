create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create policy "Admins can manage products"
  on public.products
  for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can view all reviews"
  on public.reviews
  for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can moderate reviews"
  on public.reviews
  for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete reviews"
  on public.reviews
  for delete
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can view all orders"
  on public.orders
  for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can update orders"
  on public.orders
  for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));