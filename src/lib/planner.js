import { TRILHAS } from '../data/tracks'

// ---------------------------------------------------------------------------
// GERADOR DE PLANO
// ---------------------------------------------------------------------------
// A ordem das fases NAO e a ordem das trilhas: e a ordem PEDAGOGICA.
// Ex.: banco de dados entra antes de Spring, porque JPA sem SQL vira decoreba.
// ---------------------------------------------------------------------------

export const OBJETIVOS = {
  'backend-java': {
    nome: 'Backend Java',
    desc: 'Java + Spring Boot + SQL. O caminho mais direto para a primeira vaga junior no Brasil.',
    icone: '☕',
    ordem: [
      'base-f1', 'java-f1', 'java-f2', 'base-f3', 'db-f1',
      'base-f2', 'java-f3', 'java-f4', 'db-f2', 'java-f5',
    ],
  },
  'fullstack': {
    nome: 'Fullstack Java + Angular',
    desc: 'Backend Java com frontend Angular. Combinacao muito pedida em banco, seguradora e governo.',
    icone: '🔀',
    ordem: [
      'base-f1', 'java-f1', 'java-f2', 'base-f3', 'db-f1',
      'base-f2', 'java-f3', 'java-f4', 'ang-f1', 'ang-f2',
      'ang-f3', 'db-f2', 'java-f5',
    ],
  },
  'backend-cloud': {
    nome: 'Backend Java + AWS',
    desc: 'Backend com foco em nuvem e deploy. Diferencial forte e menos concorrido.',
    icone: '☁️',
    ordem: [
      'base-f1', 'java-f1', 'java-f2', 'base-f3', 'db-f1',
      'base-f2', 'java-f3', 'java-f4', 'db-f2', 'java-f5',
      'aws-f1', 'aws-f2', 'aws-f3',
    ],
  },
  'completo': {
    nome: 'Completo (Java + Angular + AWS)',
    desc: 'Tudo. Mais longo, mas cobre todas as frentes que voce escolheu estudar.',
    icone: '🎯',
    ordem: [
      'base-f1', 'java-f1', 'java-f2', 'base-f3', 'db-f1',
      'base-f2', 'java-f3', 'java-f4', 'ang-f1', 'ang-f2',
      'db-f2', 'java-f5', 'ang-f3', 'aws-f1', 'aws-f2', 'aws-f3',
    ],
  },
}

const INDICE_FASES = (() => {
  const mapa = {}
  for (const t of TRILHAS) {
    for (const f of t.fases) {
      mapa[f.id] = { ...f, trilha: t }
    }
  }
  return mapa
})()

export const buscarFase = (id) => INDICE_FASES[id]

export function progressoModulo(modulo, topicos) {
  const total = modulo.topicos.length
  const feitos = modulo.topicos.filter((_, i) => topicos[`${modulo.id}:${i}`]).length
  return { total, feitos, pct: total === 0 ? 0 : Math.round((feitos / total) * 100) }
}

function addDias(dataISO, dias) {
  const d = new Date(dataISO + 'T00:00:00')
  d.setDate(d.getDate() + dias)
  return d.toISOString().slice(0, 10)
}

export function formatarData(iso) {
  if (!iso) return '—'
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}

/**
 * Monta o cronograma semana a semana a partir do objetivo, das horas
 * disponiveis e do que ja foi concluido.
 */
export function gerarPlano(perfil, topicos) {
  const objetivo = OBJETIVOS[perfil.objetivo] || OBJETIVOS['backend-java']
  const horasSemana = Math.max(1, Number(perfil.horasSemana) || 10)
  const inicio = perfil.dataInicio || new Date().toISOString().slice(0, 10)

  let acumulado = 0 // horas restantes acumuladas
  const blocos = []

  for (const faseId of objetivo.ordem) {
    const fase = INDICE_FASES[faseId]
    if (!fase) continue

    const modulos = fase.modulos.map((m) => {
      const p = progressoModulo(m, topicos)
      const restante = m.horas * (1 - p.pct / 100)
      return { ...m, progresso: p, horasRestantes: restante }
    })

    const horasFase = modulos.reduce((s, m) => s + m.horasRestantes, 0)
    const horasTotalFase = modulos.reduce((s, m) => s + m.horas, 0)
    const concluida = horasFase < 0.01

    const semanaInicio = Math.floor(acumulado / horasSemana) + 1
    acumulado += horasFase
    const semanaFim = Math.max(semanaInicio, Math.ceil(acumulado / horasSemana))

    blocos.push({
      faseId,
      fase,
      trilha: fase.trilha,
      modulos,
      concluida,
      horasRestantes: horasFase,
      horasTotal: horasTotalFase,
      pct: horasTotalFase === 0 ? 100 : Math.round((1 - horasFase / horasTotalFase) * 100),
      semanaInicio,
      semanaFim,
      dataInicio: concluida ? null : addDias(inicio, (semanaInicio - 1) * 7),
      dataFim: concluida ? null : addDias(inicio, semanaFim * 7 - 1),
    })
  }

  const horasRestantes = blocos.reduce((s, b) => s + b.horasRestantes, 0)
  const horasTotal = blocos.reduce((s, b) => s + b.horasTotal, 0)
  const semanas = Math.ceil(horasRestantes / horasSemana)

  // Proximo modulo com pendencia
  let proximo = null
  for (const b of blocos) {
    const m = b.modulos.find((x) => x.progresso.pct < 100)
    if (m) {
      proximo = { modulo: m, bloco: b }
      break
    }
  }

  return {
    objetivo,
    blocos,
    horasRestantes,
    horasTotal,
    horasFeitas: horasTotal - horasRestantes,
    pct: horasTotal === 0 ? 0 : Math.round(((horasTotal - horasRestantes) / horasTotal) * 100),
    semanas,
    meses: Math.round((semanas / 4.34) * 10) / 10,
    dataConclusao: addDias(inicio, semanas * 7),
    proximo,
    horasSemana,
  }
}
