create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_username_length check (char_length(username) between 3 and 32),
  constraint users_username_format check (username ~ '^[A-Za-z0-9_]+$')
);

create unique index users_username_lower_idx on public.users (lower(username));

alter table public.users enable row level security;

create policy "Users can view their own profile"
  on public.users
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.users
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, username, email)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
      'user_' || left(new.id::text, 8)
    ),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on public.users
  for each row execute procedure public.handle_updated_at();