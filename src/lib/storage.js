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
  topicos: {}, // "moduloId:indice" -> true
  exercicios: {}, // "ex-id" -> 'fazendo' | 'feito'
  checklist: {}, // "ck-id" -> true
  entrevistas: {}, // "p-id" -> true (domino essa resposta)
  notas: {}, // "moduloId" -> texto
  linkedin: { respostas: {}, historico: [] },
}

/** Completa um estado salvo com os campos que faltam (versoes antigas do app). */
export function normalizar(salvo) {
  if (!salvo || typeof salvo !== 'object') return { ...ESTADO_INICIAL }
  return {
    ...ESTADO_INICIAL,
    ...salvo,
    perfil: { ...ESTADO_INICIAL.perfil, ...(salvo.perfil || {}) },
    linkedin: { ...ESTADO_INICIAL.linkedin, ...(salvo.linkedin || {}) },
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
