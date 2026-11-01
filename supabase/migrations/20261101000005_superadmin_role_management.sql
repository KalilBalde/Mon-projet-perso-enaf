create or replace function public.list_profiles_for_super_admin(
  search_term text default '',
  page_offset integer default 0,
  page_limit integer default 20
)
returns table (
  user_id uuid,
  email text,
  first_names text,
  last_name text,
  role text,
  role_request_status text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  safe_search text := trim(coalesce(search_term, ''));
  safe_offset integer := greatest(coalesce(page_offset, 0), 0);
  safe_limit integer := least(greatest(coalesce(page_limit, 20), 1), 50);
begin
  if (select auth.uid()) is null
    or coalesce(public.current_user_role(), '') <> 'super_admin' then
    raise exception using errcode = '42501', message = 'Not authorized';
  end if;

  return query
  select
    p.id,
    u.email::text,
    p.first_names,
    p.last_name,
    p.role,
    p.role_request_status,
    p.created_at
  from public.profiles as p
  join auth.users as u on u.id = p.id
  where safe_search = ''
    or p.first_names ilike '%' || safe_search || '%'
    or p.last_name ilike '%' || safe_search || '%'
    or u.email ilike '%' || safe_search || '%'
  order by p.created_at desc
  offset safe_offset
  limit safe_limit;
end;
$$;

create or replace function public.promote_user_to_admin(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null
    or coalesce(public.current_user_role(), '') <> 'super_admin' then
    raise exception using errcode = '42501', message = 'Not authorized';
  end if;

  if target_user_id = (select auth.uid()) then
    raise exception using errcode = '22023', message = 'Self-promotion is not allowed';
  end if;

  update public.profiles
  set role = 'admin'
  where id = target_user_id
    and role in ('tenant', 'landlord')
    and role_request_status <> 'pending';

  if not found then
    raise exception using errcode = '22023', message = 'User cannot be promoted';
  end if;
end;
$$;

revoke all on function public.list_profiles_for_super_admin(text, integer, integer)
  from public, anon;
grant execute on function public.list_profiles_for_super_admin(text, integer, integer)
  to authenticated;

revoke all on function public.promote_user_to_admin(uuid)
  from public, anon;
grant execute on function public.promote_user_to_admin(uuid)
  to authenticated;
