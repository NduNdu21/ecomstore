-- Grant table-level privileges needed for authenticated users to perform admin CRUD flows
-- This is required in addition to the RLS policies in 20260827000004_add_admin_role_policies.sql.

grant select, insert, update, delete on public.products to authenticated;
grant select, insert, update, delete on public.reviews to authenticated;
grant select, insert, update, delete on public.orders to authenticated;
