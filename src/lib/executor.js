import { nuvemAtiva } from './api'

// ---------------------------------------------------------------------------
// Cliente da execucao de testes
// ---------------------------------------------------------------------------
// A chamada passa pela API do proprio sistema, nao direto para o servico de
// execucao. Motivos em servidor/src/executar.js — resumo: mantem o CSP fechado
// e permite trocar de provedor sem tocar no frontend.
// ---------------------------------------------------------------------------

export const execucaoDisponivel = nuvemAtiva

export async function executarTestes(codigo, testes, imports) {
  if (!nuvemAtiva) throw new Error('Execucao indisponivel em modo local.')

  const { requisitarPublico } = await import('./api')
  return requisitarPublico('/api/executar', {
    method: 'POST',
    body: JSON.stringify({ codigo, testes, imports }),
  })
}
