begin;

alter table public.listings
  add column reference_id text;

create or replace function public.set_listing_reference_id()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  neighborhood_prefix text;
  reference_base text;
  candidate text;
  suffix integer := 0;
begin
  neighborhood_prefix := upper(substr(
    regexp_replace(coalesce(new.quartier, ''), '[^[:alnum:]]', '', 'g'),
    1,
    3
  ));

  if neighborhood_prefix = '' then
    neighborhood_prefix := 'ANN';
  else
    neighborhood_prefix := rpad(neighborhood_prefix, 3, 'X');
  end if;

  new.created_at := coalesce(new.created_at, now());
  reference_base := neighborhood_prefix || to_char(
    new.created_at at time zone 'UTC',
    'YYMMDDHH24MI'
  );

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(reference_base));
  candidate := reference_base;

  while exists (
    select 1
    from public.listings
    where reference_id = candidate
      and id is distinct from new.id
  ) loop
    suffix := suffix + 1;
    candidate := reference_base || '-' || new.id::text || '-' || suffix::text;
  end loop;

  new.reference_id := candidate;
  return new;
end;
$$;

create trigger set_listing_reference_id
before insert or update of quartier on public.listings
for each row
execute function public.set_listing_reference_id();

update public.listings
set quartier = quartier
where reference_id is null;

alter table public.listings
  alter column reference_id set not null;

create unique index listings_reference_id_uidx
  on public.listings (reference_id);

revoke all on function public.set_listing_reference_id() from public, anon, authenticated;

commit;