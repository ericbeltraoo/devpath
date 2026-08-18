const CHAVE = 'devpath:v1'

export const ESTADO_INICIAL = {
  v: 1,
  onboarded: false,
  perfil: {
    nome: '',
    objetivo: 'backend-java',
    horasSemana: 12,
    dataInicio: new Date().toISOString().slice(0, 10),
  },
  topicos: {}, // "moduloId:indice" -> ISO da conclusao
  revisoes: {}, // "moduloId:indice" -> { nivel, proxima, ultima, acertos, falhas }
  exercicios: {}, // "ex-id" -> 'fazendo' | 'feito'
  desafios: {}, // "df-id" -> { status, iniciadoEm, entregueEm, autoavaliacao }
  checklist: {}, // "ck-id" -> true
  entrevistas: {}, // "p-id" -> true (domino essa resposta)
  notas: {}, // "moduloId" -> texto
  linkedin: { respostas: {}, historico: [] },

  // Cronograma semanal: blocos de estudo por dia da semana.
  cronograma: {
    blocos: [], // { id, dia (0-6), materia, minutos, horario }
  },

  // Trava de conteudo novo quando ha revisao atrasada demais.
  // Desligar e permitido, mas anula o motivo de existir do sistema.
  bloqueio: { ativo: true, limite: 15 },

  pomodoro: {
    config: {
      foco: 25,
      pausaCurta: 5,
      pausaLonga: 15,
      ciclosAteLonga: 4,
      autoIniciar: true,
      som: true,
      volume: 0.6,
      notificacao: true,
    },
    sessoes: [], // { fim, minutos, tipo, moduloId }
  },
}

const MAX_SESSOES = 400

/** Completa um estado salvo com os campos que faltam (versoes antigas do app). */
export function normalizar(salvo) {
  if (!salvo || typeof salvo !== 'object') return { ...ESTADO_INICIAL }
  return {
    ...ESTADO_INICIAL,
    ...salvo,
    perfil: { ...ESTADO_INICIAL.perfil, ...(salvo.perfil || {}) },
    linkedin: { ...ESTADO_INICIAL.linkedin, ...(salvo.linkedin || {}) },
    bloqueio: { ...ESTADO_INICIAL.bloqueio, ...(salvo.bloqueio || {}) },
    pomodoro: {
      config: { ...ESTADO_INICIAL.pomodoro.config, ...(salvo.pomodoro?.config || {}) },
      // Corta o historico: o limite de 500 KB por usuario no banco e real.
      sessoes: (salvo.pomodoro?.sessoes || []).slice(-MAX_SESSOES),
    },
    revisoes: salvo.revisoes || {},
    desafios: salvo.desafios || {},
    cronograma: { blocos: salvo.cronograma?.blocos || [] },
  }
}

/** Diz se vale a pena migrar este estado para a nuvem. */
export function temProgresso(estado) {
  if (!estado) return false
  return (
    estado.onboarded ||
    Object.keys(estado.topicos || {}).length > 0 ||
    Object.keys(estado.exercicios || {}).length > 0 ||
    Object.keys(estado.entrevistas || {}).length > 0 ||
    Object.keys(estado.linkedin?.respostas || {}).length > 0
  )
}

export function carregar() {
  try {
    const bruto = localStorage.getItem(CHAVE)
    if (!bruto) return { ...ESTADO_INICIAL }
    return normalizar(JSON.parse(bruto))
  } catch {
    return { ...ESTADO_INICIAL }
  }
}

export function salvar(estado) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado))
  } catch (e) {
    console.warn('Nao foi possivel salvar o progresso:', e)
  }
}

export function exportar(estado) {
  const blob = new Blob([JSON.stringify(estado, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `devpath-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importar(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()
    leitor.onload = () => {
      try {
        const dados = JSON.parse(leitor.result)
        if (!dados || typeof dados !== 'object') throw new Error('Formato invalido')
        resolve(normalizar(dados))
      } catch (e) {
        reject(e)
      }
    }
    leitor.onerror = () => reject(new Error('Falha ao ler o arquivo'))
    leitor.readAsText(arquivo)
  })
}
