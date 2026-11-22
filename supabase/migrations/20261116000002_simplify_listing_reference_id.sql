begin;

create or replace function public.set_listing_reference_id()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  neighborhood_prefix text;
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

  new.reference_id := neighborhood_prefix || '-' || new.id::text;
  return new;
end;
$$;

update public.listings
set quartier = quartier;

revoke all on function public.set_listing_reference_id() from public, anon, authenticated;

commit;