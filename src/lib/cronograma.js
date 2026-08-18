import { TRILHAS, todosModulos } from '../data/tracks'

// ---------------------------------------------------------------------------
// CRONOGRAMA SEMANAL
// ---------------------------------------------------------------------------
// A diferenca entre este cronograma e uma agenda comum: aqui o PLANEJADO e
// confrontado com o REALIZADO. O tempo realizado nao e voce que digita — vem
// das sessoes do Pomodoro. Cronograma que so guarda intencao vira decoracao.
// ---------------------------------------------------------------------------

export const DIAS = [
  { id: 0, nome: 'Domingo', curto: 'Dom' },
  { id: 1, nome: 'Segunda', curto: 'Seg' },
  { id: 2, nome: 'Terça', curto: 'Ter' },
  { id: 3, nome: 'Quarta', curto: 'Qua' },
  { id: 4, nome: 'Quinta', curto: 'Qui' },
  { id: 5, nome: 'Sexta', curto: 'Sex' },
  { id: 6, nome: 'Sábado', curto: 'Sáb' },
]

/** Materias agendaveis: as trilhas + as atividades transversais. */
export const MATERIAS = [
  ...TRILHAS.map((t) => ({ id: t.id, nome: t.nome, icone: t.icone, cor: t.cor, trilha: true })),
  { id: 'revisao', nome: 'Revisão espaçada', icone: '🔁', cor: '#a78bfa' },
  { id: 'exercicios', nome: 'Exercícios', icone: '⌨️', cor: '#f59e0b' },
  { id: 'desafios', nome: 'Desafios técnicos', icone: '🎯', cor: '#ec4899' },
  { id: 'projeto', nome: 'Projeto de portfólio', icone: '🚀', cor: '#14b8a6' },
  { id: 'faculdade', nome: 'Faculdade', icone: '🎓', cor: '#64748b' },
]

export const getMateria = (id) => MATERIAS.find((m) => m.id === id) || MATERIAS[0]

// Mapa moduloId -> trilhaId, para saber a que materia uma sessao do Pomodoro pertence
const MODULO_PARA_TRILHA = (() => {
  const mapa = {}
  for (const t of TRILHAS) for (const m of todosModulos(t)) mapa[m.id] = t.id
  return mapa
})()

export function minutosPorDia(blocos) {
  const total = {}
  for (const d of DIAS) total[d.id] = 0
  for (const b of blocos) total[b.dia] = (total[b.dia] || 0) + Number(b.minutos || 0)
  return total
}

export function minutosPorMateria(blocos) {
  const total = {}
  for (const b of blocos) total[b.materia] = (total[b.materia] || 0) + Number(b.minutos || 0)
  return total
}

export const totalSemanal = (blocos) => blocos.reduce((a, b) => a + Number(b.minutos || 0), 0)

/** Ordena por horario; blocos sem horario vao para o fim. */
export function blocosDoDia(blocos, dia) {
  return blocos
    .filter((b) => b.dia === dia)
    .sort((a, b) => (a.horario || '99:99').localeCompare(b.horario || '99:99'))
}

/**
 * Minutos efetivamente focados nos ultimos 7 dias, por dia da semana,
 * segundo as sessoes do Pomodoro. Esta e a parte que nao mente.
 */
export function realizadoPorDia(sessoes) {
  const total = {}
  for (const d of DIAS) total[d.id] = 0

  const limite = Date.now() - 7 * 86400000
  for (const s of sessoes || []) {
    const quando = new Date(s.fim)
    if (quando.getTime() < limite) continue
    total[quando.getDay()] += Number(s.minutos || 0)
  }
  return total
}

/** Minutos realizados por materia nos ultimos 7 dias. */
export function realizadoPorMateria(sessoes) {
  const total = {}
  const limite = Date.now() - 7 * 86400000
  for (const s of sessoes || []) {
    if (new Date(s.fim).getTime() < limite) continue
    const materia = s.moduloId ? MODULO_PARA_TRILHA[s.moduloId] || 'outro' : 'outro'
    total[materia] = (total[materia] || 0) + Number(s.minutos || 0)
  }
  return total
}

/**
 * Coerencia do cronograma. Cada aviso aqui e uma contradicao que voce
 * provavelmente nao percebeu — melhor descobrir agora que na terceira semana.
 */
export function diagnosticar(cronograma, perfil, sessoes) {
  const blocos = cronograma.blocos || []
  const avisos = []

  const semanaMin = totalSemanal(blocos)
  const semanaHoras = semanaMin / 60
  const meta = Number(perfil.horasSemana) || 0

  if (blocos.length === 0) {
    avisos.push({
      tipo: 'info',
      texto: 'Cronograma vazio. Comece pequeno: 3 blocos na semana que você tem certeza que consegue cumprir.',
    })
    return { avisos, semanaMin, semanaHoras, aderencia: null }
  }

  // Contradicao com o ritmo declarado no plano
  if (meta > 0 && semanaHoras > meta * 1.15) {
    avisos.push({
      tipo: 'danger',
      texto:
        `Você agendou ${semanaHoras.toFixed(1)}h por semana, mas declarou ${meta}h no seu plano. ` +
        'Um dos dois está errado — e cronograma que não cabe na vida real não é cumprido, é abandonado.',
    })
  } else if (meta > 0 && semanaHoras < meta * 0.7) {
    avisos.push({
      tipo: 'warn',
      texto:
        `Você agendou ${semanaHoras.toFixed(1)}h, mas seu plano assume ${meta}h por semana. ` +
        'Com esse cronograma a previsão de conclusão vai atrasar.',
    })
  }

  // Ingles e frequencia, nao volume
  const diasComIngles = new Set(blocos.filter((b) => b.materia === 'ingles').map((b) => b.dia)).size
  const temIngles = blocos.some((b) => b.materia === 'ingles')
  if (!temIngles) {
    avisos.push({
      tipo: 'warn',
      texto: 'Nenhum bloco de inglês. Idioma se aprende por frequência: 20min todo dia batem 3h no sábado.',
    })
  } else if (diasComIngles < 4) {
    avisos.push({
      tipo: 'warn',
      texto: `Inglês só em ${diasComIngles} dia(s) da semana. Abaixo de 4 dias o ganho despenca — prefira blocos menores e mais frequentes.`,
    })
  }

  // Revisao precisa ser diaria, senao a fila estoura
  const diasComRevisao = new Set(blocos.filter((b) => b.materia === 'revisao').map((b) => b.dia)).size
  if (diasComRevisao < 4) {
    avisos.push({
      tipo: 'danger',
      texto:
        `Revisão agendada em apenas ${diasComRevisao} dia(s). É assim que a fila estoura e o roadmap trava. ` +
        'Revisão é diária e curta, não semanal e longa.',
    })
  }

  // Bloco longo demais sem pausa
  const longos = blocos.filter((b) => Number(b.minutos) > 120)
  if (longos.length > 0) {
    avisos.push({
      tipo: 'warn',
      texto: `${longos.length} bloco(s) com mais de 2h seguidas. Quebre em blocos de Pomodoro — atenção não sustenta isso.`,
    })
  }

  // Dia sem folga nenhuma na semana
  const porDia = minutosPorDia(blocos)
  const diasVazios = DIAS.filter((d) => (porDia[d.id] || 0) === 0).length
  if (diasVazios === 0) {
    avisos.push({
      tipo: 'warn',
      texto: 'Você agendou os 7 dias. Sem folga programada, a primeira semana ruim vira desistência. Deixe 1 dia livre.',
    })
  }

  // Aderencia: planejado vs realizado de verdade
  const real = realizadoPorDia(sessoes)
  const realTotal = Object.values(real).reduce((a, b) => a + b, 0)
  const aderencia = semanaMin === 0 ? null : Math.round((realTotal / semanaMin) * 100)

  if (aderencia !== null && aderencia < 50 && realTotal > 0) {
    avisos.push({
      tipo: 'danger',
      texto:
        `Você cumpriu ${aderencia}% do que planejou nos últimos 7 dias. ` +
        'Antes de culpar disciplina, considere que o cronograma pode estar simplesmente grande demais.',
    })
  }

  return { avisos, semanaMin, semanaHoras, aderencia, realTotal }
}

export function formatarMin(min) {
  const m = Math.round(min)
  if (m === 0) return '—'
  if (m < 60) return `${m}min`
  const h = Math.floor(m / 60)
  const r = m % 60
  return r === 0 ? `${h}h` : `${h}h${String(r).padStart(2, '0')}`
}

/** Sugestao inicial coerente com as horas declaradas no perfil. */
export function modeloSugerido(horasSemana = 12) {
  const min = Math.round((horasSemana * 60) / 5) // concentrado em 5 dias uteis
  const bloco = Math.max(25, Math.min(90, min - 35))

  const blocos = []
  let seq = 1
  for (const dia of [1, 2, 3, 4, 5]) {
    blocos.push({ id: `b${seq++}`, dia, materia: 'revisao', minutos: 15, horario: '19:00' })
    blocos.push({ id: `b${seq++}`, dia, materia: 'ingles', minutos: 20, horario: '19:15' })
    blocos.push({ id: `b${seq++}`, dia, materia: 'java', minutos: bloco, horario: '19:35' })
  }
  blocos.push({ id: `b${seq++}`, dia: 6, materia: 'exercicios', minutos: 90, horario: '09:00' })
  blocos.push({ id: `b${seq++}`, dia: 6, materia: 'projeto', minutos: 90, horario: '10:40' })
  return blocos
}
