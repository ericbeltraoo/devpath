import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const chave = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Se as variaveis nao estiverem definidas, o app roda em MODO LOCAL:
 * tudo continua funcionando, mas o progresso fica so neste navegador.
 * Isso evita que o app quebre antes de voce configurar o Supabase.
 */
export const nuvemAtiva = Boolean(url && chave)

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

/** Traduz os erros do Supabase para portugues legivel. */
export function traduzirErro(erro) {
  const m = (erro?.message || '').toLowerCase()

  if (m.includes('invalid login credentials')) return 'Email ou senha incorretos.'
  if (m.includes('email not confirmed')) return 'Confirme seu email antes de entrar. Verifique a caixa de entrada e o spam.'
  if (m.includes('user already registered')) return 'Ja existe uma conta com esse email. Use "Entrar".'
  if (m.includes('password should be at least')) return 'A senha precisa ter pelo menos 6 caracteres.'
  if (m.includes('unable to validate email')) return 'Email invalido.'
  if (m.includes('rate limit') || m.includes('too many')) return 'Muitas tentativas. Espere alguns minutos.'
  if (m.includes('failed to fetch') || m.includes('networkerror')) return 'Sem conexao com o servidor. Verifique sua internet.'

  return erro?.message || 'Erro inesperado.'
}
