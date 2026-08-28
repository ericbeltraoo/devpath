import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { consultar } from './db.js'

// ---------------------------------------------------------------------------
// Autenticacao de sistema de UM usuario
// ---------------------------------------------------------------------------
// Nao ha cadastro, nao ha tabela de usuarios, nao ha rotacao de refresh token.
// Havia tudo isso quando o sistema previa varias contas; para uma conta so,
// aquilo era complexidade que so aumentava a chance de erro.
//
// O que sobra e o que realmente protege:
//   - senha guardada como hash bcrypt numa variavel de ambiente
//   - token assinado em cookie httpOnly (o JavaScript da pagina nao le)
//   - limite de tentativas gravado no BANCO, porque funcao serverless nao
//     tem memoria entre requisicoes: um contador em variavel seria zerado a
//     cada chamada e a protecao viraria enfeite
// ---------------------------------------------------------------------------

export const COOKIE = 'devpath_sessao'
const DIAS = 30
const MAX_FALHAS = 8
const JANELA_MIN = 15

// Hash de descarte, so para o tempo de resposta nao denunciar nada quando a
// variavel de ambiente esta faltando.
const HASH_FALSO = '$2a$12$C6UzMDM.H6dfI/f/IKcEe.4dGkFOxOCe1yhO0iVjnMdRJ0mFCiHK.'

export class ErroAuth extends Error {
  constructor(mensagem, status = 400, codigo = 'erro') {
    super(mensagem)
    this.status = status
    this.codigo = codigo
  }
}

function segredo() {
  const s = process.env.JWT_SECRET
  // Falhar na subida e melhor que rodar inseguro sem ninguem perceber.
  if (!s || s.length < 32) throw new Error('JWT_SECRET ausente ou com menos de 32 caracteres.')
  return s
}

export const assinar = () => jwt.sign({ sub: 'dono' }, segredo(), { expiresIn: `${DIAS}d`, issuer: 'devpath' })

export function cookieDeSessao(token) {
  const partes = [
    `${COOKIE}=${token}`,
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    'Path=/',
    `Max-Age=${DIAS * 86400}`,
  ]
  return partes.join('; ')
}

export const cookieVazio = () =>
  `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`

function lerCookie(req, nome) {
  const bruto = req.headers.cookie || ''
  for (const parte of bruto.split(';')) {
    const [k, ...v] = parte.trim().split('=')
    if (k === nome) return v.join('=')
  }
  return null
}

/** Lanca se nao houver sessao valida. Use no inicio de toda rota protegida. */
export function exigirSessao(req) {
  const token = lerCookie(req, COOKIE)
  if (!token) throw new ErroAuth('Nao autenticado.', 401, 'sem_sessao')
  try {
    jwt.verify(token, segredo(), { issuer: 'devpath' })
  } catch (e) {
    const expirou = e.name === 'TokenExpiredError'
    throw new ErroAuth(
      expirou ? 'Sessao expirada.' : 'Sessao invalida.',
      401,
      expirou ? 'sessao_expirada' : 'sessao_invalida'
    )
  }
}

const ip = (req) =>
  (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'desconhecido'

export async function autenticar(senha, req) {
  const origem = ip(req)

  const [{ falhas }] = await consultar(
    `SELECT COUNT(*)::int AS falhas FROM tentativas
      WHERE ip = $1 AND em > NOW() - INTERVAL '${JANELA_MIN} minutes'`,
    [origem]
  )

  if (falhas >= MAX_FALHAS) {
    throw new ErroAuth('Muitas tentativas. Aguarde alguns minutos.', 429, 'bloqueado')
  }

  // bcrypt.compare sempre roda, mesmo sem a variavel configurada: sair antes
  // seria mais rapido, e a diferenca de tempo e informacao para quem ataca.
  const hash = process.env.SENHA_HASH || HASH_FALSO
  const confere = await bcrypt.compare(String(senha || ''), hash)

  if (!confere || !process.env.SENHA_HASH) {
    await consultar('INSERT INTO tentativas (ip) VALUES ($1)', [origem])
    throw new ErroAuth('Senha incorreta.', 401, 'credenciais')
  }

  // Limpa o historico daquele IP no acerto, e aproveita para podar o resto.
  await consultar(
    `DELETE FROM tentativas WHERE ip = $1 OR em < NOW() - INTERVAL '1 day'`,
    [origem]
  )
  return true
}
