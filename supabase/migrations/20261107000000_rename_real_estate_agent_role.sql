begin;

alter table public.profiles
  drop constraint if exists profiles_role_check,
  drop constraint if exists profiles_requested_role_check;

update public.profiles
set role = 'real_estate_agent'
where role = 'landlord';

update public.profiles
set requested_role = 'real_estate_agent'
where requested_role = 'landlord';

alter table public.profiles
  add constraint profiles_role_check
    check (role in ('tenant', 'real_estate_agent', 'admin', 'super_admin')),
  add constraint profiles_requested_role_check
    check (requested_role in ('tenant', 'real_estate_agent'));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role_value text;
begin
  requested_role_value := case
    when new.raw_user_meta_data ->> 'requested_role' = 'real_estate_agent'
      then 'real_estate_agent'
    else 'tenant'
  end;

  insert into public.profiles (
    id,
    full_name,
    first_names,
    last_name,
    phone,
    role,
    requested_role,
    role_request_status
  )
  values (
    new.id,
    concat_ws(
      ' ',
      nullif(trim(new.raw_user_meta_data ->> 'first_names'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'last_name'), '')
    ),
    coalesce(new.raw_user_meta_data ->> 'first_names', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    'tenant',
    requested_role_value,
    case when requested_role_value = 'real_estate_agent' then 'pending' else 'none' end
  );

  return new;
end;
$$;

create or replace function public.list_pending_agent_requests()
returns table (
  user_id uuid,
  email text,
  first_names text,
  last_name text,
  phone text,
  submitted_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null
    or coalesce(public.current_user_role(), '') not in ('admin', 'super_admin') then
    raise exception using errcode = '42501', message = 'Not authorized';
  end if;

  return query
  select p.id, u.email::text, p.first_names, p.last_name, p.phone, u.created_at
  from public.profiles as p
  join auth.users as u on u.id = p.id
  where p.requested_role = 'real_estate_agent'
    and p.role_request_status = 'pending'
  order by u.created_at asc;
end;
$$;

create or replace function public.review_agent_request(
  target_user_id uuid,
  approve_request boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null
    or coalesce(public.current_user_role(), '') not in ('admin', 'super_admin') then
    raise exception using errcode = '42501', message = 'Not authorized';
  end if;

  update public.profiles
  set role = case when approve_request then 'real_estate_agent' else 'tenant' end,
      role_request_status = case when approve_request then 'approved' else 'rejected' end,
      role_reviewed_at = now(),
      role_reviewed_by = (select auth.uid())
  where id = target_user_id
    and requested_role = 'real_estate_agent'
    and role_request_status = 'pending'
    and role = 'tenant';

  if not found then
    raise exception using errcode = '22023', message = 'No pending agent request found';
  end if;
end;
$$;

revoke all on function public.list_pending_agent_requests() from public, anon;
grant execute on function public.list_pending_agent_requests() to authenticated;
revoke all on function public.review_agent_request(uuid, boolean) from public, anon;
grant execute on function public.review_agent_request(uuid, boolean) to authenticated;

drop function if exists public.list_pending_landlord_requests();
drop function if exists public.review_landlord_request(uuid, boolean);

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
    and role in ('tenant', 'real_estate_agent')
    and role_request_status <> 'pending';

  if not found then
    raise exception using errcode = '22023', message = 'User cannot be promoted';
  end if;
end;
$$;

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
  acting_role text := coalesce(public.current_user_role(), '');
  safe_search text := trim(coalesce(search_term, ''));
  safe_offset integer := greatest(coalesce(page_offset, 0), 0);
  safe_limit integer := least(greatest(coalesce(page_limit, 20), 1), 50);
begin
  if (select auth.uid()) is null
    or acting_role not in ('admin', 'super_admin') then
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
  where (acting_role = 'super_admin' or p.role = 'real_estate_agent')
    and (
      safe_search = ''
      or p.first_names ilike '%' || safe_search || '%'
      or p.last_name ilike '%' || safe_search || '%'
      or u.email ilike '%' || safe_search || '%'
    )
  order by p.created_at desc
  offset safe_offset
  limit safe_limit;
end;
$$;

create or replace function public.demote_managed_account_to_tenant(
  target_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  acting_role text := coalesce(public.current_user_role(), '');
  target_role text;
begin
  if (select auth.uid()) is null
    or acting_role not in ('admin', 'super_admin') then
    raise exception using errcode = '42501', message = 'Not authorized';
  end if;

  if target_user_id = (select auth.uid()) then
    raise exception using errcode = '22023', message = 'Self-demotion is not allowed';
  end if;

  select p.role
  into target_role
  from public.profiles as p
  where p.id = target_user_id
  for update;

  if not found then
    raise exception using errcode = '22023', message = 'Account not found';
  end if;

  if (acting_role = 'admin' and target_role <> 'real_estate_agent')
    or (
      acting_role = 'super_admin'
      and target_role not in ('real_estate_agent', 'admin')
    ) then
    raise exception using errcode = '42501', message = 'Not authorized to remove this role';
  end if;

  update public.profiles
  set role = 'tenant',
      requested_role = 'tenant',
      role_request_status = 'none',
      role_reviewed_at = now(),
      role_reviewed_by = (select auth.uid())
  where id = target_user_id;
end;
$$;

revoke all on function public.list_profiles_for_super_admin(text, integer, integer)
  from public, anon;
grant execute on function public.list_profiles_for_super_admin(text, integer, integer)
  to authenticated;
revoke all on function public.promote_user_to_admin(uuid) from public, anon;
grant execute on function public.promote_user_to_admin(uuid) to authenticated;
revoke all on function public.demote_managed_account_to_tenant(uuid) from public, anon;
grant execute on function public.demote_managed_account_to_tenant(uuid) to authenticated;

drop policy if exists "Authorized roles can submit listings" on public.listings;

create policy "Authorized roles can submit listings"
on public.listings
for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and (
    (
      public.current_user_role() = 'real_estate_agent'
      and moderation_status = 'pending'
    )
    or (
      public.current_user_role() in ('admin', 'super_admin')
      and moderation_status = 'published'
    )
  )
);

commit;