alter table public.profiles
  add column role text not null default 'tenant'
  check (role in ('tenant', 'landlord', 'admin', 'super_admin'));

revoke update on table public.profiles from authenticated;
grant update (first_names, last_name, phone, email_notifications)
  on table public.profiles to authenticated;

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select role
  from public.profiles
  where id = (select auth.uid())
$$;

revoke all on function public.current_user_role() from public;
grant execute on function public.current_user_role() to authenticated;
