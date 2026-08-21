// Cronometro dos exercicios.
//
// O registro NUNCA guarda um contador que anda sozinho. Guarda duas coisas:
//   ms         -> milissegundos ja consolidados ("banco")
//   iniciadoEm -> instante em que a corrida atual comecou (null = parado)
//
// O decorrido e sempre calculado do relogio. Isso elimina drift, sobrevive a
// recarregar a pagina e continua correto ao sincronizar entre dispositivos —
// nenhum deles precisa concordar sobre "quantos ticks passaram".

/** De quanto em quanto tempo uma corrida em andamento e consolidada no banco. */
export const INTERVALO_BANCO = 60 * 1000

/**
 * Acima disto, uma corrida "em andamento" encontrada ao abrir o app e tratada
 * como abandonada (voce fechou a aba e foi dormir), e o intervalo pendurado e
 * descartado. Como o banco e consolidado a cada 60s, se perde no maximo 1 min
 * de tempo real — em troca de nunca registrar as 8 horas em que o notebook
 * ficou fechado. Dado inventado e pior que dado faltando: voce planejaria em
 * cima dele.
 */
export const LIMITE_ABANDONO = 3 * INTERVALO_BANCO

export const REGISTRO_VAZIO = { status: null, ms: 0, iniciadoEm: null, concluidoEm: null }

/** Aceita o formato antigo (string) e o novo (objeto). */
export function normalizarRegistro(bruto) {
  if (!bruto) return null
  if (typeof bruto === 'string') return { ...REGISTRO_VAZIO, status: bruto }
  if (typeof bruto !== 'object') return null

  const ms = Number(bruto.ms)
  const iniciadoEm = Number(bruto.iniciadoEm)

  return {
    status: bruto.status === 'feito' || bruto.status === 'fazendo' ? bruto.status : null,
    ms: Number.isFinite(ms) && ms >= 0 ? ms : 0,
    iniciadoEm: Number.isFinite(iniciadoEm) && iniciadoEm > 0 ? iniciadoEm : null,
    concluidoEm: typeof bruto.concluidoEm === 'string' ? bruto.concluidoEm : null,
  }
}

export const rodando = (r) => !!r?.iniciadoEm

/** Tempo total do exercicio, incluindo a corrida em andamento. */
export function decorrido(r, agora = Date.now()) {
  if (!r) return 0
  const corrida = r.iniciadoEm ? Math.max(0, agora - r.iniciadoEm) : 0
  return r.ms + corrida
}

/** Consolida a corrida atual no banco. Idempotente: parado, nao muda nada. */
export function bancar(r, agora = Date.now()) {
  if (!r?.iniciadoEm) return r
  return { ...r, ms: decorrido(r, agora), iniciadoEm: null }
}

/**
 * Corrida pendurada de uma sessao anterior. Devolve o registro sem ela, ou o
 * proprio registro se ainda estiver dentro da janela (recarregou a pagina no
 * meio do exercicio — aqui o cronometro deve mesmo continuar andando).
 */
export function descartarOrfa(r, agora = Date.now()) {
  if (!r?.iniciadoEm) return r
  if (agora - r.iniciadoEm <= LIMITE_ABANDONO) return r
  return { ...r, iniciadoEm: null }
}

const dois = (n) => String(n).padStart(2, '0')

/** Mostrador que anda na tela: MM:SS, ou H:MM:SS depois de uma hora. */
export function relogio(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h > 0 ? `${h}:${dois(m)}:${dois(s % 60)}` : `${dois(m)}:${dois(s % 60)}`
}

/** Resumo legivel para totais: "1h 20min", "45min", "38s". */
export function duracaoCurta(ms) {
  const s = Math.max(0, Math.round(ms / 1000))
  if (s < 60) return `${s}s`
  const m = Math.round(s / 60)
  if (m < 60) return `${m}min`
  const h = Math.floor(m / 60)
  const resto = m % 60
  return resto ? `${h}h ${resto}min` : `${h}h`
}

/** Le a estimativa do exercicio ("45 min", "1h15", "1h30", "2h") em minutos. */
export function minutosEstimados(texto) {
  if (typeof texto !== 'string') return null
  const t = texto.toLowerCase().replace(/\s+/g, '')

  const comHora = t.match(/^(\d+)h(\d+)?/)
  if (comHora) return Number(comHora[1]) * 60 + Number(comHora[2] || 0)

  const soMin = t.match(/^(\d+)m/)
  if (soMin) return Number(soMin[1])

  return null
}
