import mysql from 'mysql2/promise'

// ---------------------------------------------------------------------------
// Pool de conexoes
// ---------------------------------------------------------------------------
// Pool, nao conexao unica: abrir e fechar conexao a cada requisicao e caro, e
// uma conexao unica serializa tudo. connectionLimit baixo de proposito — a VPS
// hospeda outro projeto e o MySQL tem limite global de conexoes.
// ---------------------------------------------------------------------------

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'devpath',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL) || 5,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: 'Z', // grava e le em UTC; a conversao de fuso e do cliente
})

/** Falha rapido na subida em vez de dar erro na primeira requisicao. */
export async function verificarConexao() {
  const conn = await pool.getConnection()
  try {
    await conn.query('SELECT 1')
  } finally {
    conn.release()
  }
}

// ---------------------------------------------------------------------------
// Limpeza dos dados efemeros
// ---------------------------------------------------------------------------
// `refresh_tokens` e `tentativas_login` crescem a cada login. Sem limpeza,
// crescem para sempre.
//
// Isto poderia ser um EVENT do MySQL, mas ligar o event scheduler exige
// `SET GLOBAL`, que muda a instancia inteira do banco — compartilhada com os
// outros projetos desta VPS. Rodando aqui dentro, o DevPath nao toca em nada
// fora do proprio banco.
//
// Falha de limpeza nao derruba a API: e manutencao, nao caminho critico.
// ---------------------------------------------------------------------------
const DIA = 24 * 60 * 60 * 1000

export async function limparDadosEfemeros() {
  try {
    const [t] = await pool.query(
      'DELETE FROM tentativas_login WHERE em < NOW() - INTERVAL 30 DAY'
    )
    const [r] = await pool.query(
      `DELETE FROM refresh_tokens
        WHERE expira_em < NOW() - INTERVAL 7 DAY
           OR (revogado_em IS NOT NULL AND revogado_em < NOW() - INTERVAL 7 DAY)`
    )
    if (t.affectedRows || r.affectedRows) {
      console.log(`[limpeza] ${t.affectedRows} tentativa(s), ${r.affectedRows} refresh token(s)`)
    }
  } catch (e) {
    console.error('[limpeza] falhou, segue o jogo:', e.message)
  }
}

/** Agenda a limpeza diaria. O timer nao segura o processo vivo (`unref`). */
export function agendarLimpeza() {
  limparDadosEfemeros()
  const t = setInterval(limparDadosEfemeros, DIA)
  t.unref()
  return t
}

/**
 * Executa dentro de transacao, com rollback automatico em caso de erro.
 * Usado no login, onde varias escritas precisam ser atomicas.
 */
export async function emTransacao(fn) {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const r = await fn(conn)
    await conn.commit()
    return r
  } catch (e) {
    await conn.rollback()
    throw e
  } finally {
    conn.release()
  }
}
