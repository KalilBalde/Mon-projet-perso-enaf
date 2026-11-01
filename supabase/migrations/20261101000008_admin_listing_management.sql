grant update (
  title,
  quartier,
  price,
  surface,
  rooms,
  bathrooms,
  type,
  priority,
  image,
  images,
  description,
  features
) on table public.listings to authenticated;
grant delete on table public.listings to authenticated;

alter table public.listings
  add constraint listings_priority_nonnegative check (priority >= 0);

create policy "Admins can update listing details"
on public.listings
for update
to authenticated
using (
  coalesce(public.current_user_role(), '') in ('admin', 'super_admin')
)
with check (
  coalesce(public.current_user_role(), '') in ('admin', 'super_admin')
);

create policy "Admins can delete listings"
on public.listings
for delete
to authenticated
using (
  coalesce(public.current_user_role(), '') in ('admin', 'super_admin')
);

create policy "Admins can delete listing images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'listing-images'
  and coalesce(public.current_user_role(), '') in ('admin', 'super_admin')
);