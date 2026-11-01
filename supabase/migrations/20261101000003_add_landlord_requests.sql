alter table public.profiles
  add column if not exists requested_role text,
  add column if not exists role_request_status text,
  add column if not exists role_reviewed_at timestamptz,
  add column if not exists role_reviewed_by uuid;

update public.profiles
set requested_role = coalesce(requested_role, 'tenant'),
    role_request_status = coalesce(role_request_status, 'none')
where requested_role is null or role_request_status is null;

alter table public.profiles
  alter column requested_role set default 'tenant',
  alter column requested_role set not null,
  alter column role_request_status set default 'none',
  alter column role_request_status set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_requested_role_check'
  ) then
    alter table public.profiles
      add constraint profiles_requested_role_check
      check (requested_role in ('tenant', 'landlord'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_role_request_status_check'
  ) then
    alter table public.profiles
      add constraint profiles_role_request_status_check
      check (role_request_status in ('none', 'pending', 'approved', 'rejected'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_role_reviewed_by_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_role_reviewed_by_fkey
      foreign key (role_reviewed_by) references auth.users (id) on delete set null;
  end if;
end;
$$;

update public.profiles
set requested_role = 'landlord',
    role_request_status = 'approved'
where role = 'landlord'
  and role_request_status = 'none';

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
    when new.raw_user_meta_data ->> 'requested_role' = 'landlord'
      then 'landlord'
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
    case when requested_role_value = 'landlord' then 'pending' else 'none' end
  );

  return new;
end;
$$;

create or replace function public.list_pending_landlord_requests()
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
  where p.requested_role = 'landlord'
    and p.role_request_status = 'pending'
  order by u.created_at asc;
end;
$$;

create or replace function public.review_landlord_request(
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
  set role = case when approve_request then 'landlord' else 'tenant' end,
      role_request_status = case when approve_request then 'approved' else 'rejected' end,
      role_reviewed_at = now(),
      role_reviewed_by = (select auth.uid())
  where id = target_user_id
    and requested_role = 'landlord'
    and role_request_status = 'pending'
    and role = 'tenant';

  if not found then
    raise exception using errcode = '22023', message = 'No pending landlord request found';
  end if;
end;
$$;

revoke all on function public.list_pending_landlord_requests() from public, anon;
grant execute on function public.list_pending_landlord_requests() to authenticated;

revoke all on function public.review_landlord_request(uuid, boolean) from public, anon;
grant execute on function public.review_landlord_request(uuid, boolean) to authenticated;
