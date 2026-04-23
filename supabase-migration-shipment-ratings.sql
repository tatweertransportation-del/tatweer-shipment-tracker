create table if not exists public.shipment_ratings (
  id uuid primary key,
  tracking_number text not null references public.shipments(tracking_number) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  language text not null default 'ar',
  created_at timestamptz not null
);

alter table public.shipment_ratings enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
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
