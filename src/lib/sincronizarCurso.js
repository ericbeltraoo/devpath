import { TRILHAS, todosModulos } from '../data/tracks'

// ---------------------------------------------------------------------------
// SINCRONIZACAO COM O CURSO
// ---------------------------------------------------------------------------
// Marca como concluido tudo que vem ANTES da aula onde voce esta, usando o
// mapeamento modulo -> secao do curso.
//
// O detalhe que faz isto funcionar em vez de estragar: as revisoes NAO podem
// todas vencer amanha. Marcar 35 topicos de uma vez com vencimento em 1 dia
// criaria 35 revisoes atrasadas no dia seguinte, estourando o limite de 15 e
// TRAVANDO o roadmap — o sistema puniria voce por ter sido honesto.
//
// Por isso as datas sao escalonadas: conteudo de secao mais antiga vem antes
// (voce viu ha mais tempo, tem mais chance de ter esquecido), e o volume por
// dia fica abaixo do limite de bloqueio.
// ---------------------------------------------------------------------------

const DIA = 86400000

/** Quantas revisoes deixar vencer por dia ao escalonar. */
const POR_DIA = 5

/**
 * @param {number} secaoAtual   secao do curso em que voce esta
 * @param {number} aulaNaSecao  posicao da aula dentro da secao (1-based)
 * @param {number} aulasNaSecao total de aulas da secao
 */
export function planejarSincronizacao(secaoAtual, aulaNaSecao, aulasNaSecao) {
  const completos = [] // modulos inteiros, de secoes ja passadas
  const parciais = [] // o modulo da secao atual, marcado proporcionalmente

  for (const trilha of TRILHAS) {
    if (trilha.id === 'ingles') continue // ingles nao vem do curso
    for (const m of todosModulos(trilha)) {
      if (!m.curso) continue

      if (m.curso.secao < secaoAtual) {
        completos.push(m)
      } else if (m.curso.secao === secaoAtual) {
        // Aulas concluidas = as anteriores a atual. Arredonda para BAIXO:
        // marcar de menos e barato (voce revisa algo que sabe), marcar de mais
        // e caro (o sistema para de te mostrar o que voce nao sabe).
        const fracao = Math.max(0, aulaNaSecao - 1) / aulasNaSecao
        const quantos = Math.floor(m.topicos.length * fracao)
        if (quantos > 0) parciais.push({ modulo: m, quantos })
      }
    }
  }

  // Ordena por secao para escalonar o vencimento: mais antigo revisa primeiro
  completos.sort((a, b) => a.curso.secao - b.curso.secao)

  const totalTopicos =
    completos.reduce((acc, m) => acc + m.topicos.length, 0) +
    parciais.reduce((acc, p) => acc + p.quantos, 0)

  return { completos, parciais, totalTopicos, dias: Math.ceil(totalTopicos / POR_DIA) }
}

/**
 * Produz os objetos `topicos` e `revisoes` prontos para entrar no estado.
 * Nao sobrescreve o que voce ja tinha marcado.
 */
export function aplicarSincronizacao(plano, topicosAtuais = {}, revisoesAtuais = {}) {
  const topicos = { ...topicosAtuais }
  const revisoes = { ...revisoesAtuais }
  const agora = new Date().toISOString()

  const chaves = []
  for (const m of plano.completos) {
    m.topicos.forEach((_, i) => chaves.push(`${m.id}:${i}`))
  }
  for (const p of plano.parciais) {
    for (let i = 0; i < p.quantos; i++) chaves.push(`${p.modulo.id}:${i}`)
  }

  let novos = 0
  chaves.forEach((chave) => {
    if (topicos[chave]) return // respeita o que ja estava marcado
    topicos[chave] = agora

    // Escalonamento: a cada POR_DIA topicos, empurra um dia para frente.
    const emDias = 1 + Math.floor(novos / POR_DIA)
    revisoes[chave] = {
      nivel: 0,
      proxima: new Date(Date.now() + emDias * DIA).toISOString().slice(0, 10),
      ultima: agora.slice(0, 10),
      acertos: 0,
      falhas: 0,
    }
    novos++
  })

  return { topicos, revisoes, novos }
}
