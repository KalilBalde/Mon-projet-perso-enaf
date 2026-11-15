begin;

alter table public.listings
  alter column title drop not null,
  alter column quartier drop not null,
  alter column price drop not null,
  alter column surface drop not null,
  alter column bedrooms drop not null,
  alter column living_rooms drop not null,
  alter column showers drop not null,
  alter column type drop not null,
  alter column image drop not null;

commit;