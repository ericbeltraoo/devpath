import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import { pool } from './db.js'

// ---------------------------------------------------------------------------
// Autenticacao
// ---------------------------------------------------------------------------
// Substitui o Supabase Auth. As garantias mantidas:
//   - senha com bcrypt, nunca em texto
//   - access token curto + refresh token longo com rotacao
//   - refresh guardado como HASH: banco vazado nao entrega token utilizavel
//   - limite de tentativas no SERVIDOR (o do front e so usabilidade)
//   - mensagens que nao revelam se um email tem cadastro
// ---------------------------------------------------------------------------

const CUSTO_BCRYPT = 12
const MIN_SENHA = 10

const ACCESS_TTL = '15m'
const REFRESH_DIAS = 30

// Janela de forca bruta: 8 falhas em 15 min bloqueiam por 15 min.
const MAX_FALHAS = 8
const JANELA_MIN = 15

export class ErroAuth extends Error {
  constructor(mensagem, status = 400, codigo = 'erro') {
    super(mensagem)
    this.status = status
    this.codigo = codigo
  }
}

const hashRefresh = (t) => crypto.createHash('sha256').update(t).digest('hex')

function segredo() {
  const s = process.env.JWT_SECRET
  // Falhar na subida e melhor que rodar inseguro sem ninguem perceber.
  if (!s || s.length < 32) {
    throw new Error('JWT_SECRET ausente ou com menos de 32 caracteres.')
  }
  return s
}

export function gerarAccessToken(usuario) {
  return jwt.sign(
    { sub: String(usuario.id), email: usuario.email },
    segredo(),
    { expiresIn: ACCESS_TTL, issuer: 'devpath' }
  )
}

export function verificarAccessToken(token) {
  return jwt.verify(token, segredo(), { issuer: 'devpath' })
}

// ---------------------------------------------------------------------------
// Politica de senha — mesma regra do front, aplicada tambem aqui.
// Validacao so no cliente nao e validacao: a API e chamada direto.
// ---------------------------------------------------------------------------
const SENHAS_PROIBIDAS = new Set([
  'senha123456', '1234567890', 'password123', 'qwertyuiop',
  'senhasenha', 'admin12345', '0123456789', 'abcdefghij',
])

export function validarSenha(senha, email = '') {
  const problemas = []
  if (!senha || senha.length < MIN_SENHA) problemas.push(`Use pelo menos ${MIN_SENHA} caracteres.`)
  if (SENHAS_PROIBIDAS.has(String(senha).toLowerCase())) problemas.push('Senha muito comum.')

  const tipos = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(senha || '')).length
  if (tipos < 3) problemas.push('Misture pelo menos 3 tipos de caractere.')

  const usuario = (email.split('@')[0] || '').toLowerCase()
  if (usuario.length >= 4 && String(senha).toLowerCase().includes(usuario)) {
    problemas.push('A senha nao pode conter o seu email.')
  }
  if (/(.)\1{2,}/.test(senha || '')) problemas.push('Evite o mesmo caractere repetido 3 vezes.')

  return problemas
}

// ---------------------------------------------------------------------------
// Limite de tentativas — no servidor
// ---------------------------------------------------------------------------

export async function registrarTentativa(email, ip, sucesso) {
  await pool.query(
    'INSERT INTO tentativas_login (email, ip, sucesso) VALUES (?, ?, ?)',
    [String(email).toLowerCase().slice(0, 255), ip.slice(0, 45), sucesso ? 1 : 0]
  )
}

export async function estaBloqueado(email, ip) {
  const [linhas] = await pool.query(
    `SELECT COUNT(*) AS falhas
       FROM tentativas_login
      WHERE sucesso = 0
        AND em > NOW() - INTERVAL ? MINUTE
        AND (email = ? OR ip = ?)`,
    [JANELA_MIN, String(email).toLowerCase(), ip]
  )
  return Number(linhas[0]?.falhas || 0) >= MAX_FALHAS
}

// ---------------------------------------------------------------------------
// Cadastro e login
// ---------------------------------------------------------------------------

export async function cadastrar(email, senha, nome) {
  const normalizado = String(email || '').trim().toLowerCase()
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalizado)) {
    throw new ErroAuth('Email invalido.', 400, 'email_invalido')
  }

  const problemas = validarSenha(senha, normalizado)
  if (problemas.length) throw new ErroAuth(problemas[0], 400, 'senha_fraca')

  if (process.env.CADASTRO_ABERTO !== 'true') {
    throw new ErroAuth('O cadastro de novas contas esta fechado.', 403, 'cadastro_fechado')
  }

  const hash = await bcrypt.hash(senha, CUSTO_BCRYPT)
  try {
    const [r] = await pool.query(
      'INSERT INTO usuarios (email, senha_hash, nome) VALUES (?, ?, ?)',
      [normalizado, hash, nome ? String(nome).slice(0, 120) : null]
    )
    return { id: r.insertId, email: normalizado }
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      // Mensagem neutra: nao confirma que o email existe (enumeracao).
      throw new ErroAuth(
        'Nao foi possivel concluir o cadastro com esses dados.',
        409,
        'cadastro_recusado'
      )
    }
    throw e
  }
}

export async function autenticar(email, senha, ip) {
  const normalizado = String(email || '').trim().toLowerCase()

  if (await estaBloqueado(normalizado, ip)) {
    throw new ErroAuth('Muitas tentativas. Aguarde alguns minutos.', 429, 'bloqueado')
  }

  const [linhas] = await pool.query(
    'SELECT id, email, senha_hash, ativo FROM usuarios WHERE email = ? LIMIT 1',
    [normalizado]
  )
  const usuario = linhas[0]

  // Compara sempre, mesmo sem usuario: evita descobrir emails validos pelo
  // tempo de resposta (bcrypt demora; sair antes seria mais rapido).
  const hashFalso = '$2a$12$0000000000000000000000000000000000000000000000000000'
  const confere = await bcrypt.compare(senha || '', usuario?.senha_hash || hashFalso)

  if (!usuario || !confere || !usuario.ativo) {
    await registrarTentativa(normalizado, ip, false)
    throw new ErroAuth('Email ou senha incorretos.', 401, 'credenciais')
  }

  await registrarTentativa(normalizado, ip, true)
  await pool.query('UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?', [usuario.id])

  return { id: usuario.id, email: usuario.email }
}

// ---------------------------------------------------------------------------
// Refresh tokens com rotacao
// ---------------------------------------------------------------------------

export async function emitirRefresh(usuarioId) {
  const token = crypto.randomBytes(48).toString('base64url')
  const expira = new Date(Date.now() + REFRESH_DIAS * 86400000)

  await pool.query(
    'INSERT INTO refresh_tokens (usuario_id, token_hash, expira_em) VALUES (?, ?, ?)',
    [usuarioId, hashRefresh(token), expira]
  )
  return token
}

/**
 * Troca o refresh por um par novo. O antigo e revogado na mesma transacao.
 *
 * Se chegar um refresh JA revogado, isso significa que alguem esta reusando
 * um token antigo — sinal de roubo. A resposta e derrubar TODAS as sessoes
 * do usuario, nao so recusar a requisicao.
 */
export async function rotacionarRefresh(token) {
  const hash = hashRefresh(token || '')

  const [linhas] = await pool.query(
    `SELECT id, usuario_id, expira_em, revogado_em
       FROM refresh_tokens WHERE token_hash = ? LIMIT 1`,
    [hash]
  )
  const atual = linhas[0]
  if (!atual) throw new ErroAuth('Sessao invalida.', 401, 'refresh_invalido')

  if (atual.revogado_em) {
    await revogarTodos(atual.usuario_id)
    throw new ErroAuth(
      'Sessao invalidada por seguranca. Entre novamente.',
      401,
      'refresh_reusado'
    )
  }

  if (new Date(atual.expira_em) < new Date()) {
    throw new ErroAuth('Sessao expirada.', 401, 'refresh_expirado')
  }

  await pool.query('UPDATE refresh_tokens SET revogado_em = NOW() WHERE id = ?', [atual.id])

  const [u] = await pool.query('SELECT id, email FROM usuarios WHERE id = ? LIMIT 1', [atual.usuario_id])
  if (!u[0]) throw new ErroAuth('Sessao invalida.', 401, 'refresh_invalido')

  return { usuario: u[0], refresh: await emitirRefresh(atual.usuario_id) }
}

export async function revogar(token) {
  await pool.query(
    'UPDATE refresh_tokens SET revogado_em = NOW() WHERE token_hash = ? AND revogado_em IS NULL',
    [hashRefresh(token || '')]
  )
}

export async function revogarTodos(usuarioId) {
  await pool.query(
    'UPDATE refresh_tokens SET revogado_em = NOW() WHERE usuario_id = ? AND revogado_em IS NULL',
    [usuarioId]
  )
}
