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
  password_value text not null default '',
  updated_at timestamptz not null
);

alter table public.shipment_file_access
add column if not exists password_value text not null default '';

alter table public.shipment_files enable row level security;
alter table public.shipment_file_access enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
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
    select 1
    from pg_policies
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

notify pgrst, 'reload schema';
