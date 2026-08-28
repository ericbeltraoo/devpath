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

// Na Vercel o frontend e a API vivem no MESMO dominio, entao a URL correta e
// vazia (caminho relativo). Mas "vazio" tambem e o valor de "nao configurado".
//
// Por isso a decisao NAO pode ser tomada olhando a BASE: com VITE_API_URL="/"
// o app cairia em modo local justamente na hospedagem em que ele funciona.
// Quem decide e a PRESENCA da variavel; a BASE so diz para onde apontar.
const URL_API = lerEnv('VITE_API_URL')
const BASE = (URL_API || '').replace(/\/+$/, '')   // "/" e "https://x/" viram ""

/** Sem VITE_API_URL, o app roda em modo local (so neste navegador). */
export const nuvemAtiva = URL_API != null && URL_API !== ''

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

// ---------------------------------------------------------------------------
// Sessao — sistema de UM usuario
// ---------------------------------------------------------------------------
// Nao existe cadastro nem email: uma senha, definida como hash na variavel
// SENHA_HASH do servidor. O token vai em cookie httpOnly, invisivel para o
// JavaScript da pagina, entao nao ha nada em memoria para restaurar.
// ---------------------------------------------------------------------------

export async function entrar(senha) {
  await requisitar('/api/entrar', { method: 'POST', body: JSON.stringify({ senha }) })
  return { id: 'dono', email: 'voce' }
}

/** Restaura a sessao ao abrir a pagina: pergunta se o cookie ainda vale. */
export async function renovarSessao() {
  try {
    await requisitar('/api/sessao', {}, true)
    return { id: 'dono', email: 'voce' }
  } catch {
    return null
  }
}

export async function sair() {
  try {
    await requisitar('/api/sair', { method: 'POST' }, true)
  } catch {
    /* sem sessao no servidor: sair localmente ja basta */
  }
}

export const sairDeTudo = sair

// A recuperacao de senha exigiria email. Com um usuario so, o caminho e
// trocar a variavel SENHA_HASH no painel — esta no README.
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

  if (c === 'credenciais') return 'Senha incorreta.'
  if (c === 'bloqueado') return 'Muitas tentativas em pouco tempo. Aguarde alguns minutos.'
  if (c === 'sem_sessao' || c === 'sessao_expirada' || c === 'sessao_invalida') {
    return 'Sessao expirada. Entre novamente.'
  }
  if (c === 'muito_grande') return 'Seu progresso passou do limite de tamanho.'

  if (m.includes('failed to fetch') || m.includes('networkerror')) {
    return 'Sem conexao com o servidor. Verifique sua internet.'
  }
  return erro?.message || 'Erro inesperado.'
}
