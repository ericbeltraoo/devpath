import express from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import cors from 'cors'
import { pool, verificarConexao, agendarLimpeza } from './db.js'
import {
  ErroAuth, cadastrar, autenticar, gerarAccessToken, verificarAccessToken,
  emitirRefresh, rotacionarRefresh, revogar, revogarTodos,
} from './auth.js'

const app = express()
const PORTA = Number(process.env.PORT) || 3001
const ORIGEM = process.env.CORS_ORIGIN || 'https://devpath.lastweek.com.br'
const PRODUCAO = process.env.NODE_ENV === 'production'

// Atras do Nginx: sem isto, req.ip devolve 127.0.0.1 para todo mundo e o
// limite de tentativas por IP vira inutil.
app.set('trust proxy', 1)

app.use(helmet())
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(cors({ origin: ORIGEM, credentials: true }))

// ---------------------------------------------------------------------------
// Refresh token vai em cookie httpOnly, nao no corpo da resposta.
// Assim o JavaScript da pagina nao consegue le-lo, e um XSS nao rouba a sessao
// inteira. O access token, de vida curta, fica em memoria no front.
// ---------------------------------------------------------------------------
const COOKIE = 'devpath_rt'
const opcoesCookie = {
  httpOnly: true,
  secure: PRODUCAO,
  sameSite: 'strict',
  path: '/api/auth',
  maxAge: 30 * 86400 * 1000,
}

const ip = (req) => req.ip || req.socket.remoteAddress || '0.0.0.0'

function protegido(req, res, next) {
  const cabecalho = req.headers.authorization || ''
  const token = cabecalho.startsWith('Bearer ') ? cabecalho.slice(7) : null
  if (!token) return res.status(401).json({ erro: 'Nao autenticado.', codigo: 'sem_token' })

  try {
    const payload = verificarAccessToken(token)
    // A identidade vem SEMPRE do token, nunca de parametro da requisicao.
    // Sem RLS no MySQL, e isto que garante o isolamento entre usuarios.
    req.usuarioId = Number(payload.sub)
    next()
  } catch (e) {
    const expirou = e.name === 'TokenExpiredError'
    res.status(401).json({
      erro: expirou ? 'Sessao expirada.' : 'Token invalido.',
      codigo: expirou ? 'token_expirado' : 'token_invalido',
    })
  }
}

const rota = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

// ============================================================ autenticacao

app.post('/api/auth/cadastrar', rota(async (req, res) => {
  const { email, senha, nome } = req.body || {}
  const usuario = await cadastrar(email, senha, nome)
  res.status(201).json({ id: usuario.id, email: usuario.email })
}))

app.post('/api/auth/login', rota(async (req, res) => {
  const { email, senha } = req.body || {}
  const usuario = await autenticar(email, senha, ip(req))
  const refresh = await emitirRefresh(usuario.id)

  res.cookie(COOKIE, refresh, opcoesCookie)
  res.json({ accessToken: gerarAccessToken(usuario), usuario })
}))

app.post('/api/auth/refresh', rota(async (req, res) => {
  const token = req.cookies?.[COOKIE]
  if (!token) return res.status(401).json({ erro: 'Sessao invalida.', codigo: 'sem_refresh' })

  const { usuario, refresh } = await rotacionarRefresh(token)
  res.cookie(COOKIE, refresh, opcoesCookie)
  res.json({ accessToken: gerarAccessToken(usuario), usuario })
}))

app.post('/api/auth/logout', rota(async (req, res) => {
  const token = req.cookies?.[COOKIE]
  if (token) await revogar(token)
  res.clearCookie(COOKIE, { ...opcoesCookie, maxAge: undefined })
  res.status(204).end()
}))

app.post('/api/auth/sair-de-tudo', protegido, rota(async (req, res) => {
  await revogarTodos(req.usuarioId)
  res.clearCookie(COOKIE, { ...opcoesCookie, maxAge: undefined })
  res.status(204).end()
}))

// ============================================================ progresso

const LIMITE_JSON = 512 * 1024   // 500 KB por usuario
const LIMITE_MINUTO = 60         // gravacoes por minuto

app.get('/api/progresso', protegido, rota(async (req, res) => {
  const [linhas] = await pool.query(
    'SELECT dados, atualizado_em FROM progresso WHERE usuario_id = ?',
    [req.usuarioId]   // <- do token, nunca do corpo da requisicao
  )
  if (!linhas.length) return res.json({ dados: null, atualizadoEm: null })

  const bruto = linhas[0].dados
  res.json({
    dados: typeof bruto === 'string' ? JSON.parse(bruto) : bruto,
    atualizadoEm: linhas[0].atualizado_em,
  })
}))

app.put('/api/progresso', protegido, rota(async (req, res) => {
  const dados = req.body?.dados
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    return res.status(400).json({ erro: 'O campo dados precisa ser um objeto.', codigo: 'payload_invalido' })
  }

  const json = JSON.stringify(dados)
  if (Buffer.byteLength(json, 'utf8') > LIMITE_JSON) {
    return res.status(413).json({ erro: 'Progresso acima do limite de 500 KB.', codigo: 'muito_grande' })
  }

  // Limite de gravacoes por minuto, com janela deslizante na propria linha.
  // Sem isto, um script pode martelar a tabela e queimar a cota do servidor.
  // O contador e recalculado aqui, entao o cliente nao consegue burlar.
  const [atual] = await pool.query(
    `SELECT janela_escritas, janela_inicio > NOW() - INTERVAL 1 MINUTE AS dentro
       FROM progresso WHERE usuario_id = ?`,
    [req.usuarioId]
  )

  if (atual.length && atual[0].dentro && atual[0].janela_escritas >= LIMITE_MINUTO) {
    return res.status(429).json({ erro: 'Muitas gravacoes. Aguarde um minuto.', codigo: 'limite_taxa' })
  }

  await pool.query(
    `INSERT INTO progresso (usuario_id, dados, janela_inicio, janela_escritas)
          VALUES (?, ?, NOW(), 1)
     ON DUPLICATE KEY UPDATE
          dados = VALUES(dados),
          janela_inicio = IF(janela_inicio > NOW() - INTERVAL 1 MINUTE, janela_inicio, NOW()),
          janela_escritas = IF(janela_inicio > NOW() - INTERVAL 1 MINUTE, janela_escritas + 1, 1)`,
    [req.usuarioId, json]
  )

  res.json({ atualizadoEm: new Date().toISOString() })
}))

// ============================================================ saude

app.get('/api/health', rota(async (_req, res) => {
  await pool.query('SELECT 1')
  res.json({ ok: true, em: new Date().toISOString() })
}))

// ============================================================ erros

app.use((_req, res) => res.status(404).json({ erro: 'Rota nao encontrada.', codigo: 'nao_encontrado' }))

app.use((err, _req, res, _next) => {
  if (err instanceof ErroAuth) {
    return res.status(err.status).json({ erro: err.message, codigo: err.codigo })
  }
  // Stack trace vai para o log, nunca para a resposta.
  console.error('[erro]', err)
  res.status(500).json({ erro: 'Erro interno.', codigo: 'interno' })
})

// ============================================================ inicializacao

async function subir() {
  try {
    await verificarConexao()
  } catch (e) {
    console.error('Nao foi possivel conectar ao MySQL:', e.message)
    process.exit(1)
  }
  // Limpeza das tabelas efemeras: aqui, e nao num EVENT do MySQL, para nao
  // mexer em configuracao global do banco compartilhado com outros projetos.
  agendarLimpeza()

  app.listen(PORTA, '127.0.0.1', () => {
    // Escuta so em 127.0.0.1: quem fala com a internet e o Nginx.
    console.log(`API do DevPath em 127.0.0.1:${PORTA} (origem: ${ORIGEM})`)
  })
}

subir()
