import { createClient } from '@supabase/supabase-js'

const limpar = (v) =>
  typeof v === 'string' ? v.replace(/^﻿/, '').trim().replace(/^["']|["']$/g, '') : undefined

/**
 * Le uma variavel de ambiente tolerando dois erros classicos no Windows:
 *
 *  1. BOM no inicio do .env — o PowerShell grava "﻿" com
 *     Set-Content -Encoding utf8, e esse caractere invisivel gruda na PRIMEIRA
 *     chave do arquivo ("﻿VITE_SUPABASE_URL"), tornando-a irreconhecivel.
 *  2. Valor entre aspas ou com espaco sobrando.
 *
 * Sem isso o app cai em modo local sem dizer o motivo, e voce perde uma hora
 * procurando erro no Supabase quando o problema esta no encoding do arquivo.
 */
function lerEnv(nome) {
  const env = import.meta.env
  if (env[nome] != null) return limpar(env[nome])

  const chaveComLixo = Object.keys(env).find((k) => k.replace(/^﻿/, '') === nome)
  if (chaveComLixo) {
    console.warn(
      `[DevPath] A variavel ${nome} foi lida, mas o arquivo .env tem BOM. ` +
        'Regrave o .env como UTF-8 sem BOM para evitar problemas.'
    )
    return limpar(env[chaveComLixo])
  }
  return undefined
}

const url = lerEnv('VITE_SUPABASE_URL')
const chave = lerEnv('VITE_SUPABASE_ANON_KEY')

/**
 * Se as variaveis nao estiverem definidas, o app roda em MODO LOCAL:
 * tudo continua funcionando, mas o progresso fica so neste navegador.
 * Isso evita que o app quebre antes de voce configurar o Supabase.
 */
export const nuvemAtiva = Boolean(url && chave)

/**
 * Meio configurado e pior que nao configurado: o app parece funcionar, mas
 * silenciosamente para de sincronizar. Sinalizamos para avisar na tela.
 */
export const configuracaoIncompleta = Boolean((url || chave) && !nuvemAtiva)

if (configuracaoIncompleta) {
  console.error(
    '[DevPath] Configuracao do Supabase incompleta: ' +
      `${url ? '' : 'VITE_SUPABASE_URL ausente. '}${chave ? '' : 'VITE_SUPABASE_ANON_KEY ausente.'}`
  )
}

if (nuvemAtiva && /service_role|^eyJ.*service/i.test(chave)) {
  console.error(
    '[DevPath] PERIGO: a chave configurada parece ser a service_role. ' +
      'Ela ignora o RLS e NUNCA deve ir para o navegador. Use a chave anon/public.'
  )
}

export const supabase = nuvemAtiva
  ? createClient(url, chave, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

const TABELA = 'progresso'

/** Le o progresso do usuario. Retorna null se ainda nao existe linha. */
export async function carregarNuvem(userId) {
  const { data, error } = await supabase
    .from(TABELA)
    .select('dados, atualizado_em')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data ? { dados: data.dados, atualizadoEm: data.atualizado_em } : null
}

/** Grava (insere ou atualiza) o progresso do usuario. */
export async function salvarNuvem(userId, dados) {
  const { error } = await supabase
    .from(TABELA)
    .upsert({ user_id: userId, dados }, { onConflict: 'user_id' })

  if (error) throw error
}

/**
 * Traduz os erros do Supabase para portugues legivel.
 *
 * Regra importante: a mensagem NUNCA pode revelar se um email tem cadastro.
 * Isso se chama enumeracao de usuarios — e como um atacante descobre quais
 * emails existem antes de tentar forca bruta. Por isso login errado e cadastro
 * duplicado devolvem mensagens que nao distinguem os casos.
 */
export function traduzirErro(erro) {
  const m = (erro?.message || '').toLowerCase()

  if (m.includes('invalid login credentials')) return 'Email ou senha incorretos.'
  if (m.includes('email not confirmed')) return 'Confirme seu email antes de entrar. Verifique a caixa de entrada e o spam.'

  // Neutro de proposito: nao confirma que a conta existe.
  if (m.includes('user already registered') || m.includes('already been registered')) {
    return 'Nao foi possivel concluir o cadastro com esses dados. Se voce ja tem conta, use "Entrar" ou a recuperacao de senha.'
  }

  if (m.includes('password should be at least') || m.includes('password is too weak')) {
    return 'Senha muito fraca. Use uma senha mais longa e com mais variedade de caracteres.'
  }
  if (m.includes('pwned') || m.includes('leaked') || m.includes('compromised')) {
    return 'Essa senha aparece em vazamentos publicos conhecidos. Escolha outra.'
  }
  if (m.includes('unable to validate email') || m.includes('invalid email')) return 'Email invalido.'
  if (m.includes('signups not allowed') || m.includes('signup is disabled')) {
    return 'O cadastro de novas contas esta fechado neste sistema.'
  }
  if (m.includes('rate limit') || m.includes('too many') || m.includes('429')) {
    return 'Muitas tentativas em pouco tempo. Aguarde alguns minutos antes de tentar de novo.'
  }
  if (m.includes('captcha')) return 'Verificacao anti-robo falhou. Recarregue a pagina e tente novamente.'
  if (m.includes('failed to fetch') || m.includes('networkerror')) {
    return 'Sem conexao com o servidor. Verifique sua internet.'
  }
  if (m.includes('muito grande') || m.includes('limite de 500')) {
    return 'Seu progresso passou do limite de tamanho. Exporte um backup e fale com o suporte.'
  }

  return erro?.message || 'Erro inesperado.'
}
