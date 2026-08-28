// ---------------------------------------------------------------------------
// Indice unico dos exercicios no formato novo.
// ---------------------------------------------------------------------------
// Um exercicio so entra aqui quando esta COMPLETO: cenario, testes,
// explicacao em cinco partes e solucao comentada. Meio exercicio na lista e
// pior que exercicio nenhum — voce clica, e o que aparece nao ensina.
// ---------------------------------------------------------------------------

import { EXERCICIOS_DATA_HORA } from './exercicios/javaDataHora'

export const TODOS_EXERCICIOS = [
  ...EXERCICIOS_DATA_HORA,
]

export const NIVEIS = {
  1: { nome: 'Aquecimento', cor: 'var(--ok)' },
  2: { nome: 'Mercado', cor: 'var(--warn)' },
  3: { nome: 'Entrevista', cor: 'var(--danger)' },
}

export const porModulo = (moduloId) => TODOS_EXERCICIOS.filter((e) => e.moduloId === moduloId)
