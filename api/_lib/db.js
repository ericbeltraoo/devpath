import { neonConfig, Pool } from '@neondatabase/serverless'

// ---------------------------------------------------------------------------
// Armazenamento
// ---------------------------------------------------------------------------
// Uma tabela, uma linha. O sistema tem UM usuario e o progresso inteiro cabe
// num documento JSON — o mesmo motivo que fez o formato ser JSON desde o
// inicio: o schema do progresso muda toda vez que um modulo entra na trilha,
// e assim isso nunca exige migration.
//
// A conexao e por DATABASE_URL (Postgres). E de proposito que nao esta preso
// a um fornecedor: Neon, Supabase, Vercel Postgres, Railway e qualquer outro
// entregam uma connection string. Trocar de provedor e trocar uma variavel.
// ---------------------------------------------------------------------------

// A Vercel batiza essa variavel de formas diferentes conforme o banco foi
// criado (integracao com Neon, Postgres proprio, ou cadastro manual). Aceitar
// todos os nomes usuais evita o erro mais chato possivel: a variavel EXISTE,
// so nao com o nome que o codigo procura.
export const NOMES = [
  'DATABASE_URL',
  'DATABASE_URL_UNPOOLED',      // integracao nativa do Neon com a Vercel
  'POSTGRES_URL',
  'POSTGRES_URL_NON_POOLING',
  'POSTGRES_PRISMA_URL',
  'NEON_DATABASE_URL',
]

/** Nomes de variaveis de banco presentes. So os NOMES, nunca os valores. */
export const variaveisDeBancoVisiveis = () =>
  Object.keys(process.env).filter((k) => /^(POSTGRES|DATABASE|PG|NEON)/i.test(k)).sort()

export function urlDoBanco() {
  for (const n of NOMES) {
    const v = process.env[n]
    if (v && v.startsWith('postgres')) return v
  }

  // Ultimo recurso: algumas integracoes nao entregam a URL montada, e sim as
  // pecas separadas. Montar aqui evita voce ter que montar na mao e errar o
  // encoding da senha.
  const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE } = process.env
  if (PGHOST && PGUSER && PGPASSWORD && PGDATABASE) {
    const u = encodeURIComponent(PGUSER)
    const p = encodeURIComponent(PGPASSWORD)
    return `postgres://${u}:${p}@${PGHOST}/${PGDATABASE}?sslmode=require`
  }

  return null
}

let pool

export function db() {
  const url = urlDoBanco()
  if (!url) {
    // Mensagem util no log: diz o que procurar, sem vazar valor nenhum.
    throw new Error(
      `Nenhuma variavel de conexao encontrada. Defina uma destas: ${NOMES.join(', ')}`
    )
  }
  // Uma funcao serverless morre a cada requisicao, mas o Node pode reaproveitar
  // o processo. Guardar o pool no escopo do modulo evita abrir conexao nova a
  // cada chamada — e e por isso que ele fica FORA da funcao handler.
  if (!pool) pool = new Pool({ connectionString: url })
  return pool
}

// ---------------------------------------------------------------------------
// Criacao automatica das tabelas
// ---------------------------------------------------------------------------
// O sistema se instala sozinho na primeira consulta.
//
// Antes, criar as tabelas era um passo manual: copiar o schema e colar no
// editor SQL do painel. Esse passo produziu dois erros seguidos que nao
// tinham nada a ver com o schema — o editor manda tudo como uma instrucao
// preparada ("cannot insert multiple commands"), e as vezes a sessao dele e
// somente leitura ("cannot execute CREATE TABLE in a read-only transaction").
//
// Passo manual que falha por motivo alheio e passo que nao devia existir.
// Tudo aqui e IF NOT EXISTS, entao rodar de novo nao faz nada.
// ---------------------------------------------------------------------------
const TABELAS = [
  `CREATE TABLE IF NOT EXISTS progresso (
     id            INT PRIMARY KEY,
     dados         JSONB NOT NULL,
     atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
   )`,
  `CREATE TABLE IF NOT EXISTS tentativas (
     id SERIAL PRIMARY KEY,
     ip TEXT NOT NULL,
     em TIMESTAMPTZ NOT NULL DEFAULT NOW()
   )`,
  `CREATE INDEX IF NOT EXISTS idx_tentativas ON tentativas (ip, em)`,
]

let instalacao

/** Roda uma vez por processo. A promessa e guardada, nao o resultado, para
 *  duas requisicoes simultaneas nao dispararem a criacao em paralelo. */
export function garantirTabelas() {
  if (!instalacao) {
    instalacao = (async () => {
      for (const sql of TABELAS) await db().query(sql)
    })().catch((e) => {
      instalacao = null // deixa tentar de novo na proxima requisicao
      throw e
    })
  }
  return instalacao
}

export async function consultar(sql, params = []) {
  await garantirTabelas()
  const r = await db().query(sql, params)
  return r.rows
}
