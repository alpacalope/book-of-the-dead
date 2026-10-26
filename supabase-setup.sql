-- The Book of the Dead: one-time setup. Paste into Supabase › SQL Editor and press Run.
create table if not exists public.docs (
  owner uuid not null default auth.uid() references auth.users on delete cascade,
  col text not null,
  id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (owner, col, id)
);
alter table public.docs enable row level security;
drop policy if exists "own rows" on public.docs;
create policy "own rows" on public.docs for all to authenticated using (owner = auth.uid()) with check (owner = auth.uid());
alter table public.docs replica identity full;
do $$ begin alter publication supabase_realtime add table public.docs; exception when others then null; end $$;
create or replace function public.merge_doc(p_col text, p_id text, p_patch jsonb) returns void
language sql security invoker set search_path = public as $f$
  update public.docs set data = data || p_patch, updated_at = now()
  where owner = auth.uid() and col = p_col and id = p_id;
$f$;
insert into storage.buckets (id, name, public) values ('files', 'files', false) on conflict (id) do nothing;
drop policy if exists "own files read" on storage.objects;
drop policy if exists "own files add" on storage.objects;
drop policy if exists "own files delete" on storage.objects;
create policy "own files read" on storage.objects for select to authenticated using (bucket_id = 'files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own files add" on storage.objects for insert to authenticated with check (bucket_id = 'files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own files delete" on storage.objects for delete to authenticated using (bucket_id = 'files' and (storage.foldername(name))[1] = auth.uid()::text);
