begin;

alter table public.listings
  add column view_count bigint not null default 0
  constraint listings_view_count_nonnegative check (view_count >= 0);

create or replace function public.increment_listing_view(target_listing_id bigint)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_view_count bigint;
begin
  update public.listings
  set view_count = view_count + 1
  where id = target_listing_id
    and moderation_status = 'published'
  returning view_count into updated_view_count;

  return updated_view_count;
end;
$$;

revoke all on function public.increment_listing_view(bigint) from public;
grant execute on function public.increment_listing_view(bigint) to anon, authenticated;

commit;