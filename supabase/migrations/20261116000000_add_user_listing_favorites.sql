begin;

create table public.user_listing_favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  listing_id bigint not null references public.listings (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

alter table public.user_listing_favorites enable row level security;

grant select, insert, delete
  on table public.user_listing_favorites to authenticated;

create policy "Users can read their own listing favorites"
on public.user_listing_favorites
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "Users can add their own listing favorites"
on public.user_listing_favorites
for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy "Users can remove their own listing favorites"
on public.user_listing_favorites
for delete
to authenticated
using (user_id = (select auth.uid()));

commit;