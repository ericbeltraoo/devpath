// ---------------------------------------------------------------------------
// CURRICULO DO CURSO: Java COMPLETO — Nelio Alves (Udemy)
// ---------------------------------------------------------------------------
// 26 secoes, 408 aulas, 54h09m. Serve para duas coisas:
//   1. mostrar a secao correspondente em cada modulo do roadmap
//   2. sincronizar o progresso: marcar tudo anterior a aula onde voce esta
//
// Sobre a contagem de aulas: os numeros abaixo vem da contagem manual do
// curriculo publicado e somam 404, nao 408. A diferenca de 4 provavelmente
// esta em aulas de aviso/material que se repetem. Por isso a sincronizacao
// trabalha por SECAO + posicao dentro dela, que e exato, e nao pelo numero
// absoluto da aula, que teria erro acumulado.
// ---------------------------------------------------------------------------

export const SECOES_NELIO = [
  { n: 1, nome: 'Introdução ao curso', aulas: 5 },
  { n: 2, nome: 'Introdução à programação', aulas: 7 },
  { n: 3, nome: 'Introdução à linguagem Java', aulas: 11 },
  { n: 4, nome: 'Estrutura sequencial', aulas: 12 },
  { n: 5, nome: 'Estrutura condicional', aulas: 11 },
  { n: 6, nome: 'Estrutura repetitiva', aulas: 14 },
  { n: 7, nome: 'Tópicos especiais (String, funções, bitwise)', aulas: 6 },
  { n: 8, nome: 'Introdução à POO', aulas: 12 },
  { n: 9, nome: 'Construtores, this, sobrecarga, encapsulamento', aulas: 11 },
  { n: 10, nome: 'Memória, arrays e listas', aulas: 20 },
  { n: 11, nome: 'Data-hora', aulas: 13 },
  { n: 12, nome: 'Enumerações e composição', aulas: 11 },
  { n: 13, nome: 'Herança e polimorfismo', aulas: 12 },
  { n: 14, nome: 'Tratamento de exceções', aulas: 11 },
  { n: 15, nome: 'Trabalhando com arquivos', aulas: 9 },
  { n: 16, nome: 'Interfaces', aulas: 14 },
  { n: 17, nome: 'Generics, Set, Map', aulas: 14 },
  { n: 18, nome: 'Programação funcional e expressões lambda', aulas: 12 },
  { n: 19, nome: 'Git e GitHub (bônus)', aulas: 27 },
  { n: 20, nome: 'JDBC', aulas: 27 },
  { n: 21, nome: 'JPA / Hibernate (nivelamento)', aulas: 6 },
  { n: 22, nome: 'Spring Boot — web services', aulas: 34 },
  { n: 23, nome: 'Projeto Jogo de Xadrez', aulas: 33 },
  { n: 24, nome: 'Projeto MongoDB com Spring Boot', aulas: 27 },
  { n: 25, nome: 'JavaFX — aplicação desktop', aulas: 44 },
  { n: 26, nome: 'Aula bônus', aulas: 1 },
]

export const TOTAL_SECOES = SECOES_NELIO.length
export const getSecao = (n) => SECOES_NELIO.find((s) => s.n === n)

/** Aulas da secao 11, para referencia na tela de sincronizacao. */
export const AULAS_DATA_HORA = [
  'Boas-vindas e avisos',
  'Material de apoio do capítulo',
  'Introdução a data-hora e duração',
  'Entendendo timezone (fuso horário)',
  'Padrão ISO 8601',
  'Operações importantes com data-hora',
  'Instanciando data-hora em Java',
  'Convertendo data-hora para texto',
  'Convertendo data-hora global para local',
  'Cálculos com data-hora',
  'Aviso: próximas duas aulas são sobre Date e Calendar',
  'Trabalhando com datas - Date',
  'Manipulando um Date com Calendar',
]
