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
