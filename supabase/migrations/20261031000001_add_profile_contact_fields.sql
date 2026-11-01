alter table public.profiles
  add column first_names text not null default '',
  add column last_name text not null default '',
  add column phone text not null default '';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    first_names,
    last_name,
    phone
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
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  );

  return new;
end;
$$;