import { normalizarRegistro, descartarOrfa } from './cronometro'

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
  // "ex-id" -> { status: 'fazendo'|'feito'|null, ms, iniciadoEm, concluidoEm }
  // Antes era so a string do status. A migracao esta em migrarExercicios().
  exercicios: {},
  desafios: {}, // "df-id" -> { status, iniciadoEm, entregueEm, autoavaliacao }
  checklist: {}, // "ck-id" -> true
  entrevistas: {}, // "p-id" -> true (domino essa resposta)
  notas: {}, // "moduloId" -> texto
  linkedin: { respostas: {}, historico: [] },

  // Ultima sincronizacao com o curso: { secao, aula, em }
  cursoSincronizado: null,

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

/**
 * Estados salvos antes do cronometro guardam so a string do status. Aqui elas
 * viram registros completos com ms = 0 — ninguem perde exercicio resolvido.
 *
 * Tambem e o ponto onde uma corrida deixada em andamento numa sessao anterior
 * e descartada, para o app nao abrir contando o tempo em que ficou fechado.
 */
function migrarExercicios(bruto) {
  const saida = {}
  for (const [id, valor] of Object.entries(bruto || {})) {
    const r = normalizarRegistro(valor)
    if (!r) continue
    const limpo = descartarOrfa(r)
    if (!limpo.status && limpo.ms === 0) continue // registro vazio, nao ocupa espaco
    saida[id] = limpo
  }
  return saida
}

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
    exercicios: migrarExercicios(salvo.exercicios),
    revisoes: salvo.revisoes || {},
    desafios: salvo.desafios || {},
    cronograma: { blocos: salvo.cronograma?.blocos || [] },
    cursoSincronizado: salvo.cursoSincronizado || null,
  }
}

// Mapas "id -> valor" que so ganham chave quando o usuario mexe em algo.
const MAPAS_DE_PROGRESSO = [
  'topicos', 'revisoes', 'exercicios', 'desafios', 'checklist', 'entrevistas', 'notas',
]

/**
 * Diz se ha qualquer coisa produzida pelo usuario neste estado.
 *
 * Esta funcao decide quem vence quando o navegador e a nuvem discordam, entao
 * ela precisa enxergar o estado INTEIRO. A versao anterior olhava 5 campos e
 * ignorava revisoes, cronograma, notas, desafios e pomodoro: quem tinha
 * progresso so nesses campos era lido como conta vazia, a resposta do banco ia
 * para o lixo, o PC novo abria zerado — e o primeiro clique subia esse estado
 * em branco por cima do progresso real.
 *
 * Regra ao mexer aqui: todo campo de ESTADO_INICIAL que o usuario alimenta
 * entra nesta conta. Esquecer de somar um campo significa perder o dado dele.
 */
export function temProgresso(estado) {
  if (!estado || typeof estado !== 'object') return false
  if (estado.onboarded) return true
  if (MAPAS_DE_PROGRESSO.some((c) => Object.keys(estado[c] || {}).length > 0)) return true
  if (Object.keys(estado.linkedin?.respostas || {}).length > 0) return true
  if ((estado.linkedin?.historico || []).length > 0) return true
  if ((estado.cronograma?.blocos || []).length > 0) return true
  if ((estado.pomodoro?.sessoes || []).length > 0) return true
  if (estado.cursoSincronizado) return true
  return false
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
