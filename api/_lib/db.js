import { Pool } from '@neondatabase/serverless'

// ---------------------------------------------------------------------------
// Conexao com o Postgres
// ---------------------------------------------------------------------------
// Uma tabela de progresso com uma linha. O sistema tem UM usuario e o
// progresso inteiro cabe num documento JSON — o mesmo motivo que fez o
// formato ser JSON desde o inicio: o schema muda toda vez que um modulo
// entra na trilha, e assim isso nunca exige migration.
//
// Nada aqui esta preso a fornecedor: qualquer Postgres que entregue uma
// connection string serve.
// ---------------------------------------------------------------------------

export const NOMES = [
  'DATABASE_URL',
  'DATABASE_URL_UNPOOLED',
  'POSTGRES_URL',
  'POSTGRES_URL_NON_POOLING',
  'POSTGRES_PRISMA_URL',
  'NEON_DATABASE_URL',
]

const EH_POSTGRES = (v) => typeof v === 'string' && /^postgres(ql)?:\/\/\S+@/.test(v)

/** Nomes de variaveis de banco presentes. So os NOMES, nunca os valores. */
export const variaveisDeBancoVisiveis = () =>
  Object.keys(process.env).filter((k) => /^(POSTGRES|DATABASE|PG|NEON)/i.test(k)).sort()

/**
 * TODAS as connection strings plausiveis, em ordem de preferencia.
 *
 * Devolve uma lista, e nao uma so, porque o ambiente costuma ter varias ao
 * mesmo tempo: uma sobra de configuracao anterior e as que a integracao do
 * banco criou agora. Escolher uma pelo nome e apostar — e apostar errado
 * significa dizer "nao conecta" tendo a string certa ali do lado.
 */
export function candidatosDeUrl() {
  const vistos = new Set()
  const saida = []

  const add = (nome, url) => {
    if (!EH_POSTGRES(url) || vistos.has(url)) return
    vistos.add(url)
    saida.push({ nome, url })
  }

  for (const n of NOMES) add(n, process.env[n])

  // Prefixo personalizado da Vercel: NEON_DATABASE_URL, ACME_POSTGRES_URL...
  for (const k of Object.keys(process.env).sort()) {
    if (NOMES.some((n) => k.endsWith(n))) add(k, process.env[k])
  }

  // Qualquer variavel cujo VALOR seja uma URL Postgres.
  for (const k of Object.keys(process.env).sort()) add(k, process.env[k])

  // Ultimo recurso: pecas separadas em vez da URL montada.
  const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE } = process.env
  if (PGHOST && PGUSER && PGPASSWORD && PGDATABASE) {
    add(
      'PGHOST/PGUSER/PGPASSWORD/PGDATABASE',
      `postgres://${encodeURIComponent(PGUSER)}:${encodeURIComponent(PGPASSWORD)}@${PGHOST}/${PGDATABASE}?sslmode=require`
    )
  }

  return saida
}

/** Driver as vezes lanca erro com message vazia; sem isto o log fica mudo. */
export const detalheErro = (e) =>
  e?.message || e?.code || e?.name || String(e) || 'erro sem mensagem'

let pool
let nomeEmUso = null

export const conexaoEmUso = () => nomeEmUso

/**
 * Testa os candidatos em ordem e fica com o primeiro que responder.
 *
 * Uma string invalida nao derruba mais o sistema quando existe outra boa no
 * ambiente. O nome da que funcionou fica guardado para o diagnostico poder
 * dizer qual esta em uso — sem nunca mostrar o valor.
 */
export async function conexao() {
  if (pool) return pool

  const candidatos = candidatosDeUrl()
  if (!candidatos.length) {
    throw new Error(
      `Nenhuma variavel de conexao encontrada. Defina uma destas: ${NOMES.join(', ')}`
    )
  }

  const falhas = []
  for (const c of candidatos) {
    const tentativa = new Pool({ connectionString: c.url })
    try {
      await tentativa.query('SELECT 1')
      pool = tentativa
      nomeEmUso = c.nome
      return pool
    } catch (e) {
      falhas.push(`${c.nome}: ${detalheErro(e)}`)
      await tentativa.end().catch(() => {})
    }
  }

  throw new Error(
    `Nenhuma das ${candidatos.length} strings de conexao funcionou. ${falhas.join(' | ')}`
  )
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

/**
 * Roda uma vez por processo. A PROMESSA e guardada, nao o resultado, para
 * duas requisicoes simultaneas nao dispararem a criacao em paralelo.
 */
export function garantirTabelas() {
  if (!instalacao) {
    instalacao = (async () => {
      const p = await conexao()
      for (const sql of TABELAS) await p.query(sql)
    })().catch((e) => {
      instalacao = null // deixa a proxima requisicao tentar de novo
      throw e
    })
  }
  return instalacao
}

export async function consultar(sql, params = []) {
  await garantirTabelas()
  const p = await conexao()
  const r = await p.query(sql, params)
  return r.rows
}

/**
 * Executa dentro de transacao, com rollback automatico em caso de erro.
 */
export async function emTransacao(fn) {
  const p = await conexao()
  const conn = await p.connect()
  try {
    await conn.query('BEGIN')
    const r = await fn(conn)
    await conn.query('COMMIT')
    return r
  } catch (e) {
    await conn.query('ROLLBACK').catch(() => {})
    throw e
  } finally {
    conn.release()
  }
}
