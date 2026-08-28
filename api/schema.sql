-- ---------------------------------------------------------------------------
-- Schema do DevPath na Vercel (Postgres)
-- ---------------------------------------------------------------------------
-- Duas tabelas. A versao anterior, para varios usuarios, tinha quatro mais
-- cadastro e rotacao de refresh token. Nada disso existe aqui porque o
-- sistema tem UM usuario, e complexidade que nao serve a ninguem so aumenta
-- a chance de erro.
--
-- Nao ha tabela de usuarios: a senha mora como hash na variavel de ambiente
-- SENHA_HASH. Senha em arquivo versionado e como se cria vazamento.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS progresso (
  id            INT PRIMARY KEY,      -- sempre 1: uma linha, um dono
  dados         JSONB NOT NULL,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contador de tentativas de login. Fica no BANCO e nao em memoria porque
-- funcao serverless nao guarda estado entre requisicoes: um contador em
-- variavel seria zerado a cada chamada e a protecao viraria enfeite.
CREATE TABLE IF NOT EXISTS tentativas (
  id SERIAL PRIMARY KEY,
  ip TEXT NOT NULL,
  em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tentativas ON tentativas (ip, em);
