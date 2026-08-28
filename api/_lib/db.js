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

let pool

export function db() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL ausente.')
  }
  // Uma funcao serverless morre a cada requisicao, mas o Node pode reaproveitar
  // o processo. Guardar o pool no escopo do modulo evita abrir conexao nova a
  // cada chamada — e e por isso que ele fica FORA da funcao handler.
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL })
  return pool
}

export async function consultar(sql, params = []) {
  const r = await db().query(sql, params)
  return r.rows
}
