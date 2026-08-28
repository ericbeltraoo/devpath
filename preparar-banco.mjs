// ---------------------------------------------------------------------------
// Cria as tabelas no Postgres.
//
//   node preparar-banco.mjs "postgres://usuario:senha@host/base?sslmode=require"
//
// Existe porque o editor SQL da Vercel e do Neon manda o texto colado como
// UMA instrucao preparada, e o Postgres recusa varias instrucoes assim:
//   "cannot insert multiple commands into a prepared statement"
//
// Aqui cada comando vai separado, na ordem. Rodar duas vezes nao quebra
// nada: tudo e IF NOT EXISTS.
// ---------------------------------------------------------------------------
import fs from 'node:fs'
import { Pool } from '@neondatabase/serverless'

const url = process.argv[2] || process.env.DATABASE_URL

if (!url) {
  console.log('\nComo usar:\n')
  console.log('  node preparar-banco.mjs "postgres://...sua connection string..."\n')
  console.log('A connection string esta no painel do banco, na Vercel ou no Neon.\n')
  process.exit(1)
}

if (!/^postgres(ql)?:\/\//.test(url)) {
  console.log('\nIsso nao parece uma connection string de Postgres.')
  console.log('Ela comeca com "postgres://" ou "postgresql://".\n')
  process.exit(1)
}

// Tira comentarios e quebra nos ponto-e-virgula.
const comandos = fs
  .readFileSync(new URL('./api/schema.sql', import.meta.url), 'utf8')
  .split('\n')
  .map((l) => l.replace(/--.*$/, ''))   // corta o comentario ate o fim da linha,
                                        // nao so as linhas que COMECAM com '--':
                                        // um '--' com ';' partiria o comando errado
  .join('\n')
  .split(';')
  .map((c) => c.trim())
  .filter(Boolean)

const pool = new Pool({ connectionString: url })

try {
  console.log(`\nExecutando ${comandos.length} comandos...\n`)

  for (const [i, sql] of comandos.entries()) {
    const resumo = sql.replace(/\s+/g, ' ').slice(0, 58)
    await pool.query(sql)
    console.log(`  ${i + 1}. ok  ${resumo}...`)
  }

  const { rows } = await pool.query(
    `SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' ORDER BY table_name`
  )

  console.log('\nTabelas no banco agora:', rows.map((r) => r.table_name).join(', '))
  console.log('\nPronto. Pode seguir para o passo 3.\n')
} catch (e) {
  console.error('\nFALHOU:', e.message)
  console.error('\nSe fala em autenticacao ou host, a connection string esta errada.')
  console.error('Copie de novo do painel do banco, inteira, sem cortar o final.\n')
  process.exit(1)
} finally {
  await pool.end()
}
