begin;

alter table public.listings
  add column kitchen text,
  add constraint listings_kitchen_check
    check (kitchen is null or kitchen in ('internal', 'external', 'both'));

grant update (kitchen) on table public.listings to authenticated;

commit;