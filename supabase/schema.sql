-- ===========================================================================
-- DevPath — schema do banco
-- ===========================================================================
-- Cole este arquivo inteiro no SQL Editor do Supabase e clique em RUN.
-- Pode rodar mais de uma vez sem quebrar nada (tudo e idempotente).
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. Tabela de progresso
-- ---------------------------------------------------------------------------
-- Guardamos o estado inteiro do app como JSONB, com uma linha por usuario.
-- Motivo: o formato do progresso muda toda vez que voce adiciona um modulo
-- novo ao roadmap. Com JSONB nao existe migration a cada mudanca de conteudo.
-- ---------------------------------------------------------------------------

create table if not exists public.progresso (
  user_id       uuid primary key references auth.users (id) on delete cascade,
  dados         jsonb       not null default '{}'::jsonb,
  atualizado_em timestamptz not null default now(),
  criado_em     timestamptz not null default now()
);

comment on table public.progresso is 'Estado completo do DevPath, uma linha por usuario.';

-- ---------------------------------------------------------------------------
-- 2. Row Level Security
-- ---------------------------------------------------------------------------
-- SEM ISTO, qualquer pessoa com a chave publica leria o progresso de todos.
-- Com RLS ligado, cada usuario so enxerga a propria linha — a regra e aplicada
-- pelo banco, nao pelo frontend, entao nao da para burlar pelo navegador.
--
-- Nao existe policy sem "auth.uid() = user_id". Nem para leitura.
-- ---------------------------------------------------------------------------

alter table public.progresso enable row level security;

drop policy if exists "le o proprio progresso"       on public.progresso;
drop policy if exists "insere o proprio progresso"   on public.progresso;
drop policy if exists "atualiza o proprio progresso" on public.progresso;
drop policy if exists "apaga o proprio progresso"    on public.progresso;

create policy "le o proprio progresso"
  on public.progresso for select
  to authenticated
  using (auth.uid() = user_id);

create policy "insere o proprio progresso"
  on public.progresso for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "atualiza o proprio progresso"
  on public.progresso for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "apaga o proprio progresso"
  on public.progresso for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 3. Permissoes de papel
-- ---------------------------------------------------------------------------
-- Defesa em profundidade: mesmo que uma policy fosse criada errada no futuro,
-- o papel anonimo (visitante nao logado) nao tem permissao nenhuma na tabela.
-- ---------------------------------------------------------------------------

revoke all on table public.progresso from anon;
grant select, insert, update, delete on table public.progresso to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Validacao e carimbo de data
-- ---------------------------------------------------------------------------
-- Feito em TRIGGER, nao em CHECK, porque CHECK exige funcao immutable.
--
--   - limita o tamanho do JSON (evita um usuario autenticado encher o banco)
--   - garante que "dados" e um objeto JSON, nao array/numero/string
--   - carimba atualizado_em no servidor: nunca confie na data que o cliente manda
-- ---------------------------------------------------------------------------

drop trigger if exists progresso_atualizado on public.progresso;
drop function if exists public.toca_atualizado_em();

create or replace function public.valida_progresso()
returns trigger
language plpgsql
as $$
begin
  if jsonb_typeof(new.dados) <> 'object' then
    raise exception 'O campo dados precisa ser um objeto JSON.'
      using errcode = '22023';
  end if;

  if octet_length(new.dados::text) > 512000 then
    raise exception 'Progresso muito grande (limite de 500 KB).'
      using errcode = '22023';
  end if;

  new.atualizado_em = now();
  return new;
end;
$$;

create trigger progresso_atualizado
  before insert or update on public.progresso
  for each row
  execute function public.valida_progresso();

-- ---------------------------------------------------------------------------
-- 5. Conferencia
-- ---------------------------------------------------------------------------
-- Rode isto depois e confirme que rowsecurity = true e que aparecem 4 policies.
-- ---------------------------------------------------------------------------

-- select relname, relrowsecurity from pg_class where relname = 'progresso';
-- select policyname, cmd, roles from pg_policies where tablename = 'progresso';
