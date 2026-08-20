// ---------------------------------------------------------------------------
// EXERCICIOS POR MODULO — indice
// ---------------------------------------------------------------------------
// Cada modulo do roadmap tem 3 exercicios. O conteudo mora em arquivos por
// trilha, em ./exercicios/, porque um arquivo unico com 237 exercicios seria
// impossivel de manter.
//
// CONTRATO de cada exercicio:
//   nivel           1, 2 ou 3
//   titulo          nome curto
//   tempo           estimativa honesta
//   contexto        por que este exercicio existe / de onde ele vem
//   enunciado       o problema
//   requisitos      o que precisa estar presente
//   criteriosAceite como saber que ficou pronto (verificavel, nao opiniao)
//   dicas           reveladas so por clique, depois da tentativa
//   revisa          ids de modulos ANTERIORES que o exercicio obriga a reusar
//
// Os tres niveis:
//   1 AQUECIMENTO — o assunto do modulo isolado
//   2 MERCADO     — contexto real de empresa, puxa 1 a 2 modulos anteriores
//   3 ENTREVISTA  — nivel de teste tecnico, puxa 3+ e cobra decisao de design
//
// `revisa` nao e sugestao: sem aqueles modulos, o enunciado nao fecha. E o que
// impede o estudo em silos e revela o que voce ja esqueceu.
// ---------------------------------------------------------------------------

import { JAVA_BASE } from './exercicios/javaBase'
import { JAVA_AVANCADO } from './exercicios/javaAvancado'
import { FUNDAMENTOS } from './exercicios/fundamentos'
import { BANCO } from './exercicios/banco'
import { ANGULAR } from './exercicios/angular'
import { AWS } from './exercicios/aws'
import { INGLES } from './exercicios/ingles'

export const EXERCICIOS_MODULO = {
  ...FUNDAMENTOS,
  ...JAVA_BASE,
  ...JAVA_AVANCADO,
  ...BANCO,
  ...ANGULAR,
  ...AWS,
  ...INGLES,
}

export const NIVEIS_EX = {
  1: { nome: 'Aquecimento', cor: 'var(--ok)', desc: 'O assunto do módulo, isolado.' },
  2: { nome: 'Mercado', cor: 'var(--warn)', desc: 'Contexto real de empresa, puxando módulos anteriores.' },
  3: { nome: 'Entrevista', cor: 'var(--danger)', desc: 'Nível de teste técnico, com decisão de design.' },
}

/** Id estavel usado para guardar o status no estado. */
export const idExercicio = (moduloId, nivel) => `exm-${moduloId}-n${nivel}`

export const temExercicios = (moduloId) => Boolean(EXERCICIOS_MODULO[moduloId]?.length)

export function totaisExercicios() {
  const mods = Object.keys(EXERCICIOS_MODULO)
  const total = mods.reduce((a, id) => a + EXERCICIOS_MODULO[id].length, 0)
  const comReuso = mods.reduce(
    (a, id) => a + EXERCICIOS_MODULO[id].filter((e) => e.revisa?.length).length,
    0
  )
  return { modulos: mods.length, total, comReuso }
}
