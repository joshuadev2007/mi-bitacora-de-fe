-- Pegá este SQL en Supabase -> SQL Editor -> New query -> Run.
-- UNA tabla privada, compartida por JoshOS y Mi Bitácora de Fe.
-- Las notas NO estarán cifradas de extremo a extremo; acceso protegido mediante RLS.
create table if not exists public.user_app_data (
    user_id uuid not null references auth.users(id) on delete cascade,
    app_id text not null check (app_id in ('joshos','bitacora-fe','levelup-life')),
    payload jsonb not null,
    revision bigint not null default 1 check (revision > 0),
    updated_at timestamptz not null default now(),
    primary key (user_id, app_id)
);

alter table public.user_app_data enable row level security;

-- Ejecutable una sola vez y re-ejecutable sin duplicar reglas.
drop policy if exists "Solo dueño puede leer" on public.user_app_data;
create policy "Solo dueño puede leer" on public.user_app_data
for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Solo dueño puede crear" on public.user_app_data;
create policy "Solo dueño puede crear" on public.user_app_data
for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Solo dueño puede modificar" on public.user_app_data;
create policy "Solo dueño puede modificar" on public.user_app_data
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

grant select, insert, update on public.user_app_data to authenticated;
revoke all on public.user_app_data from anon;
-- No hay política de DELETE por diseño: esta versión no borra copias remotas.
