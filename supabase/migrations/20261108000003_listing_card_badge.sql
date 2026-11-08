begin;

alter table public.listings
  add column card_badge text;

update public.listings
set card_badge = case
  when status = 'sold' then 'sold'
  when status = 'rented' then 'rented'
  when is_new then 'new'
  else null
end;

alter table public.listings
  add constraint listings_card_badge_check
    check (card_badge is null or card_badge in ('new', 'rented', 'sold')),
  alter column card_badge set default 'new';

grant update (card_badge) on table public.listings to authenticated;

commit;