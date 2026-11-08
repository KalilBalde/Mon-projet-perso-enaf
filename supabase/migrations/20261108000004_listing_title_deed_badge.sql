begin;

alter table public.listings
  drop constraint if exists listings_card_badge_check;

alter table public.listings
  add constraint listings_card_badge_check
    check (card_badge is null or card_badge in ('new', 'rented', 'sold', 'title_deed'));

commit;