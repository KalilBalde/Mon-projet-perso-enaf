begin;

alter table public.listings
  rename column rooms to bedrooms;

alter table public.listings
  rename column bathrooms to showers;

alter table public.listings
  add column living_rooms integer not null default 0,
  add column offer_type text,
  add constraint listings_living_rooms_nonnegative
    check (living_rooms >= 0),
  add constraint listings_offer_type_check
    check (offer_type is null or offer_type in ('rent', 'sale'));

update public.listings
set offer_type = case status
  when 'rented' then 'rent'
  when 'sold' then 'sale'
  else null
end
where status in ('rented', 'sold');

grant update (bedrooms, living_rooms, showers, offer_type)
  on table public.listings to authenticated;

commit;
