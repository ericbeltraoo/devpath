// ---------------------------------------------------------------------------
// Cliente da API do DevPath
// ---------------------------------------------------------------------------
// Substitui o Supabase. Diferenca de arquitetura que importa:
//
//   Supabase: chave anon publica no bundle, isolamento garantido pelo RLS
//   Aqui:     nenhuma chave no bundle. O isolamento e garantido pela API,
//             que sempre filtra pelo usuario do JWT.
//
// O access token fica em MEMORIA (nao em localStorage): assim um XSS nao
// consegue le-lo depois que a aba fecha. O refresh token vive num cookie
// httpOnly, invisivel para o JavaScript — e ele que restaura a sessao no
// recarregamento da pagina.
// ---------------------------------------------------------------------------

const limpar = (v) =>
  typeof v === 'string' ? v.replace(/^﻿/, '').trim().replace(/^["']|["']$/g, '') : undefined

function lerEnv(nome) {
  const env = import.meta.env
  if (env[nome] != null) return limpar(env[nome])
  // Windows: PowerShell grava BOM com Set-Content -Encoding utf8, e o BOM
  // gruda na primeira chave do .env tornando-a irreconhecivel.
  const comLixo = Object.keys(env).find((k) => k.replace(/^﻿/, '') === nome)
  if (comLixo) {
    console.warn(`[DevPath] ${nome} lida, mas o .env tem BOM. Regrave como UTF-8 sem BOM.`)
    return limpar(env[comLixo])
  }
  return undefined
}

const BASE = lerEnv('VITE_API_URL') || ''

/** Sem URL de API, o app roda em modo local (so neste navegador). */
export const nuvemAtiva = Boolean(BASE)

/** Mantido para a tela de Configuracoes continuar avisando de config quebrada. */
export const configuracaoIncompleta = false

let accessToken = null
let aoDeslogar = null

export const definirCallbackDeslogar = (fn) => { aoDeslogar = fn }

// ---------------------------------------------------------------------------

class ErroApi extends Error {
  constructor(mensagem, status, codigo) {
    super(mensagem)
    this.status = status
    this.codigo = codigo
  }
}

async function requisitar(caminho, opcoes = {}, jaTentouRenovar = false) {
  const resposta = await fetch(BASE + caminho, {
    ...opcoes,
    credentials: 'include', // manda o cookie httpOnly do refresh
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(opcoes.headers || {}),
    },
  })

  // Token de 15 min expirou no meio do uso: renova uma vez e repete, em
  // silencio. Sem isto, o usuario seria deslogado a cada 15 minutos.
  if (resposta.status === 401 && !jaTentouRenovar && !caminho.startsWith('/api/auth/')) {
    const renovou = await renovarSessao()
    if (renovou) return requisitar(caminho, opcoes, true)
    accessToken = null
    aoDeslogar?.()
  }

  if (resposta.status === 204) return null

  const corpo = await resposta.json().catch(() => ({}))
  if (!resposta.ok) throw new ErroApi(corpo.erro || 'Erro inesperado.', resposta.status, corpo.codigo)
  return corpo
}

// ------------------------------------------------------------ autenticacao

export async function criarConta(email, senha, nome) {
  return requisitar('/api/auth/cadastrar', {
    method: 'POST',
    body: JSON.stringify({ email, senha, nome }),
  })
}

export async function entrar(email, senha) {
  const r = await requisitar('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  })
  accessToken = r.accessToken
  return r.usuario
}

/** Restaura a sessao no carregamento da pagina, usando o cookie httpOnly. */
export async function renovarSessao() {
  try {
    const r = await requisitar('/api/auth/refresh', { method: 'POST' }, true)
    accessToken = r.accessToken
    return r.usuario
  } catch {
    accessToken = null
    return null
  }
}

export async function sair() {
  try {
    await requisitar('/api/auth/logout', { method: 'POST' }, true)
  } finally {
    accessToken = null
  }
}

export async function sairDeTudo() {
  try {
    await requisitar('/api/auth/sair-de-tudo', { method: 'POST' })
  } finally {
    accessToken = null
  }
}

// A recuperacao de senha por email exige servidor SMTP. Enquanto nao houver,
// e melhor dizer isso na cara do que oferecer um botao que nao faz nada.
export const recuperacaoDisponivel = false

// --------------------------------------------------------------- progresso

export async function carregarNuvem() {
  const r = await requisitar('/api/progresso')
  return r?.dados ? { dados: r.dados, atualizadoEm: r.atualizadoEm } : null
}

export async function salvarNuvem(dados) {
  await requisitar('/api/progresso', { method: 'PUT', body: JSON.stringify({ dados }) })
}

// ------------------------------------------------------------------ erros

export function traduzirErro(erro) {
  const c = erro?.codigo
  const m = (erro?.message || '').toLowerCase()

  if (c === 'credenciais') return 'Email ou senha incorretos.'
  if (c === 'bloqueado') return 'Muitas tentativas em pouco tempo. Aguarde alguns minutos.'
  if (c === 'senha_fraca') return erro.message
  if (c === 'email_invalido') return 'Email invalido.'
  if (c === 'cadastro_fechado') return 'O cadastro de novas contas esta fechado neste sistema.'
  if (c === 'cadastro_recusado') {
    // Neutro de proposito: nao confirma se o email ja tem conta.
    return 'Nao foi possivel concluir o cadastro com esses dados. Se voce ja tem conta, use "Entrar".'
  }
  if (c === 'refresh_reusado') return 'Sua sessao foi invalidada por seguranca. Entre novamente.'
  if (c === 'refresh_expirado' || c === 'sem_refresh') return 'Sessao expirada. Entre novamente.'
  if (c === 'limite_taxa') return 'Muitas gravacoes seguidas. Aguarde um minuto.'
  if (c === 'muito_grande') return 'Seu progresso passou do limite de tamanho.'

  if (m.includes('failed to fetch') || m.includes('networkerror')) {
    return 'Sem conexao com o servidor. Verifique sua internet.'
  }
  return erro?.message || 'Erro inesperado.'
}
