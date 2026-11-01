alter table public.profiles
  add column email_notifications boolean not null default true;