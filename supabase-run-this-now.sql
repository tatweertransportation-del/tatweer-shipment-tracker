alter table public.shipments
add column if not exists internal_notes text not null default '';

create table if not exists public.shipment_files (
  id uuid primary key,
  tracking_number text not null references public.shipments(tracking_number) on delete cascade,
  file_name text not null,
  mime_type text not null default 'application/octet-stream',
  file_size integer not null default 0,
  content_base64 text not null,
  uploaded_at timestamptz not null
);

create table if not exists public.shipment_file_access (
  tracking_number text primary key references public.shipments(tracking_number) on delete cascade,
  password_hash text not null,
  updated_at timestamptz not null
);

create table if not exists public.shipment_ratings (
  id uuid primary key,
  tracking_number text not null references public.shipments(tracking_number) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  language text not null default 'ar',
  created_at timestamptz not null
);

alter table public.shipments enable row level security;
alter table public.shipment_updates enable row level security;
alter table public.suggestions enable row level security;
alter table public.shipment_files enable row level security;
alter table public.shipment_file_access enable row level security;
alter table public.shipment_ratings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'shipments'
      and policyname = 'service role full access shipments'
  ) then
    create policy "service role full access shipments"
    on public.shipments
    for all
    to service_role
    using (true)
    with check (true);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'shipment_updates'
      and policyname = 'service role full access shipment_updates'
  ) then
    create policy "service role full access shipment_updates"
    on public.shipment_updates
    for all
    to service_role
    using (true)
    with check (true);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'suggestions'
      and policyname = 'service role full access suggestions'
  ) then
    create policy "service role full access suggestions"
    on public.suggestions
    for all
    to service_role
    using (true)
    with check (true);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'shipment_files'
      and policyname = 'service role full access shipment_files'
  ) then
    create policy "service role full access shipment_files"
    on public.shipment_files
    for all
    to service_role
    using (true)
    with check (true);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'shipment_file_access'
      and policyname = 'service role full access shipment_file_access'
  ) then
    create policy "service role full access shipment_file_access"
    on public.shipment_file_access
    for all
    to service_role
    using (true)
    with check (true);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'shipment_ratings'
      and policyname = 'service role full access shipment_ratings'
  ) then
    create policy "service role full access shipment_ratings"
    on public.shipment_ratings
    for all
    to service_role
    using (true)
    with check (true);
  end if;
end
$$;

notify pgrst, 'reload schema';
