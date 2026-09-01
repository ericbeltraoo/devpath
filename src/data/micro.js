// ---------------------------------------------------------------------------
// Indice dos micro-exercicios (um por topico)
// ---------------------------------------------------------------------------
// Dois tamanhos de exercicio convivem no sistema, e eles nao competem:
//
//   exercicios.js  -> a PROVA DO MODULO. Tres exercicios grandes, com cenario
//                     de negocio, solucao em camadas e explicacao completa.
//                     Voce faz quando termina o modulo inteiro.
//
//   micro.js       -> a FIXACAO DO TOPICO. Dez minutos, um main so, uma classe
//                     do java.time por vez. Aparece na Trilha, ao lado do
//                     topico, assim que voce marca aquele topico como visto.
//
// A ligacao e por indice: `topico` e a posicao dentro de modulo.topicos, em
// tracks.js. Reordenar os topicos la exige reordenar os `topico` aqui.
// ---------------------------------------------------------------------------

import { MICRO_DATA_HORA } from './micro/javaDataHora'

export const TODOS_MICRO = [
  ...MICRO_DATA_HORA,
]

/** O micro-exercicio daquele topico, ou null se aquele topico ainda nao tem. */
export const microPorTopico = (moduloId, indice) =>
  TODOS_MICRO.find((m) => m.moduloId === moduloId && m.topico === indice) || null

export const microPorModulo = (moduloId) =>
  TODOS_MICRO.filter((m) => m.moduloId === moduloId)

export const microPorId = (id) => TODOS_MICRO.find((m) => m.id === id) || null
