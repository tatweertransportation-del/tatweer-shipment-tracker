alter table public.shipments
add column if not exists internal_notes text not null default '';
