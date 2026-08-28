import pg from 'pg'

// Driver: `pg`, o cliente padrao de Postgres, falando TCP.
//
// Foram duas tentativas antes desta, as duas com o driver do Neon:
//
//   Pool (WebSocket)  -> falhava com "[object ErrorEvent]" na Vercel
//   neon() (HTTP)     -> 404 "resource-not-found" neste host
//
// Os dois dependiam de infraestrutura especifica do fornecedor. O `pg` fala
// o protocolo do Postgres direto, e o runtime Node da Vercel abre TCP sem
// problema. Funciona com Neon, Supabase, RDS ou um Postgres na sua VPS —
// que era, desde o comeco, o objetivo de nao ficar preso a ninguem.

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

/**
 * Erro legivel a partir do que o driver lancar.
 *
 * Existe porque a resposta chegou a trazer "[object ErrorEvent]": o objeto
 * nao tinha `message`, e String(e) devolveu a representacao inutil. Mensagem
 * de erro que nao diz nada custa horas de quem esta tentando configurar.
 */
export function detalheErro(e) {
  if (!e) return 'erro sem detalhe'
  if (typeof e === 'string') return e
  const partes = [e.message, e.code, e.severity, e.detail, e.error?.message, e.type]
    .filter((x) => typeof x === 'string' && x.trim())
  if (partes.length) return [...new Set(partes)].join(' | ')
  try {
    const j = JSON.stringify(e, Object.getOwnPropertyNames(e))
    if (j && j !== '{}') return j.slice(0, 300)
  } catch { /* objeto nao serializavel */ }
  return e.constructor?.name || Object.prototype.toString.call(e)
}

let cliente
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
  if (cliente) return cliente

  const candidatos = candidatosDeUrl()
  if (!candidatos.length) {
    throw new Error(
      `Nenhuma variavel de conexao encontrada. Defina uma destas: ${NOMES.join(', ')}`
    )
  }

  const falhas = []
  for (const c of candidatos) {
    // max: 1 — numa funcao serverless nao ha concorrencia dentro do processo,
    // e varias conexoes por invocacao esgotariam o limite do banco a toa.
    const tentativa = new pg.Pool({
      connectionString: c.url,
      max: 1,
      ssl: { rejectUnauthorized: true },
      connectionTimeoutMillis: 8000,
      idleTimeoutMillis: 10000,
    })
    try {
      await tentativa.query('SELECT 1')
      cliente = tentativa
      nomeEmUso = c.nome
      return cliente
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
      const c = await conexao()
      for (const ddl of TABELAS) await c.query(ddl)
    })().catch((e) => {
      instalacao = null // deixa a proxima requisicao tentar de novo
      throw e
    })
  }
  return instalacao
}

export async function consultar(sql, params = []) {
  await garantirTabelas()
  const c = await conexao()
  const r = await c.query(sql, params)
  return r.rows
}

// emTransacao nao existe: nenhuma rota precisa de transacao. Se um dia
// precisar, com `pg` da para faze-la de verdade, pegando um client do pool.
