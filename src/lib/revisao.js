// ---------------------------------------------------------------------------
// MOTOR DE REVISAO ESPACADA
// ---------------------------------------------------------------------------
// O problema real: voce estuda um assunto, marca como concluido e esquece.
// Tres meses depois nao sabe explicar o que aprendeu no mes 1.
//
// A causa nao e falta de organizacao — e a curva do esquecimento. Memoria
// decai exponencialmente, a menos que voce recupere a informacao ANTES de
// esquece-la por completo. Cada recuperacao bem-sucedida achata a curva.
//
// Por isso o intervalo cresce: 1 dia, 3, 7, 21, 60. Se voce falha, volta
// para 1 dia. O sistema so aumenta o intervalo quando voce PROVA que lembra.
//
// Nao e opcional nem decorativo: com revisoes atrasadas demais, o roadmap
// trava conteudo novo. Estudar assunto novo em cima de base esquecida e
// construir andar em cima de fundacao que ja rachou.
// ---------------------------------------------------------------------------

/** Intervalos em dias por nivel de dominio. */
export const INTERVALOS = [1, 3, 7, 21, 60]

export const NIVEL_MAXIMO = INTERVALOS.length - 1

export const RESULTADOS = {
  facil: { rotulo: 'Expliquei sem hesitar', cor: 'var(--ok)', delta: +1, icone: '💪' },
  parcial: { rotulo: 'Lembrei com esforco', cor: 'var(--warn)', delta: 0, icone: '🤔' },
  esqueci: { rotulo: 'Nao lembrava', cor: 'var(--danger)', delta: -99, icone: '🔁' },
}

const DIA = 86400000

export const hoje = () => new Date().toISOString().slice(0, 10)

function somarDias(dias, base = new Date()) {
  return new Date(base.getTime() + dias * DIA).toISOString().slice(0, 10)
}

/** Agendamento inicial, criado quando um topico e marcado como concluido. */
export function agendarPrimeira() {
  return { nivel: 0, proxima: somarDias(INTERVALOS[0]), ultima: hoje(), acertos: 0, falhas: 0 }
}

/** Reagenda um item depois de uma revisao. */
export function reagendar(revisao, resultado) {
  const atual = revisao || agendarPrimeira()
  const r = RESULTADOS[resultado]
  if (!r) return atual

  let nivel
  if (resultado === 'esqueci') nivel = 0
  else nivel = Math.min(NIVEL_MAXIMO, Math.max(0, atual.nivel + r.delta))

  return {
    nivel,
    proxima: somarDias(INTERVALOS[nivel]),
    ultima: hoje(),
    acertos: (atual.acertos || 0) + (resultado === 'esqueci' ? 0 : 1),
    falhas: (atual.falhas || 0) + (resultado === 'esqueci' ? 1 : 0),
  }
}

/**
 * Monta a fila de revisao a partir do estado.
 * @returns {{vencidas: [], hoje: [], futuras: [], diasAtraso: number}}
 */
export function filaDeRevisao(revisoes, indiceTopicos) {
  const h = hoje()
  const vencidas = []
  const doDia = []
  const futuras = []

  for (const [chave, rev] of Object.entries(revisoes || {})) {
    const info = indiceTopicos[chave]
    if (!info) continue // topico removido do roadmap
    const item = { chave, ...rev, ...info }

    if (rev.proxima < h) vencidas.push(item)
    else if (rev.proxima === h) doDia.push(item)
    else futuras.push(item)
  }

  // Mais atrasado primeiro: o que voce mais provavelmente ja esqueceu.
  vencidas.sort((a, b) => a.proxima.localeCompare(b.proxima))
  futuras.sort((a, b) => a.proxima.localeCompare(b.proxima))

  return { vencidas, hoje: doDia, futuras, pendentes: [...vencidas, ...doDia] }
}

/**
 * Regra de bloqueio. Retorna null quando esta liberado, ou o motivo.
 */
export function avaliarBloqueio(fila, config) {
  if (!config?.ativo) return null
  const limite = config.limite ?? 15
  const n = fila.vencidas.length
  if (n < limite) return null

  return {
    vencidas: n,
    limite,
    mensagem:
      `Voce tem ${n} revisoes atrasadas (limite: ${limite}). Conteudo novo esta travado ate voce ` +
      `derrubar essa fila. Estudar assunto novo agora so aumenta o que voce ja esqueceu.`,
  }
}

/** Estatisticas para o painel. */
export function estatisticasRevisao(revisoes) {
  const itens = Object.values(revisoes || {})
  if (itens.length === 0) {
    return { total: 0, dominados: 0, fracos: 0, taxaAcerto: null, porNivel: [0, 0, 0, 0, 0] }
  }

  const porNivel = [0, 0, 0, 0, 0]
  let acertos = 0
  let falhas = 0

  for (const r of itens) {
    porNivel[Math.min(NIVEL_MAXIMO, r.nivel || 0)]++
    acertos += r.acertos || 0
    falhas += r.falhas || 0
  }

  const tentativas = acertos + falhas
  return {
    total: itens.length,
    dominados: porNivel[NIVEL_MAXIMO] + porNivel[NIVEL_MAXIMO - 1],
    fracos: porNivel[0],
    taxaAcerto: tentativas === 0 ? null : Math.round((acertos / tentativas) * 100),
    porNivel,
  }
}
