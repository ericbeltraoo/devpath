# Formato antigo — matéria-prima, não conteúdo publicado

Os arquivos `fundamentos.js`, `javaBase.js`, `javaAvancado.js` e `banco.js` **não são
importados por ninguém** e não aparecem para o usuário. Isso é de propósito.

Eles guardam 123 enunciados no formato antigo, cobrindo os 41 módulos de `tracks.js`.
São a fila de matéria-prima para conversão ao formato novo — não código morto para apagar.

O índice que antigamente juntava esses quatro arquivos (`../exerciciosModulos.js`) foi
apagado: ele importava `angular.js`, `aws.js` e `ingles.js`, removidos quando o sistema
passou de 6 trilhas para 3. Não quebrava o build só porque ninguém o importava — mas
quebraria no dia em que alguém o religasse. Se você precisar de um índice desses arquivos
outra vez, escreva um novo, sem as três trilhas mortas.

## O que é publicado

`../exercicios.js` é o índice único do formato novo, e a regra dele é dura:

> Um exercício só entra ali quando está COMPLETO: cenário, testes, explicação em cinco
> partes e solução comentada. Meio exercício na lista é pior que exercício nenhum — você
> clica, e o que aparece não ensina.

Hoje só `javaDataHora.js` passou por essa régua (módulo `java-f1-m4`, 3 exercícios).
Ele é a conversão do bloco `java-f1-m4` do `javaBase.js`: compare os dois para ver o que
uma conversão precisa produzir.

## Contrato do formato antigo

Cada arquivo exporta um objeto `{ [moduloId]: Exercicio[] }`, com 3 exercícios por módulo:

| Campo | O que é |
|---|---|
| `nivel` | 1, 2 ou 3 |
| `titulo` | nome curto |
| `tempo` | estimativa honesta |
| `contexto` | por que este exercício existe / de onde ele vem |
| `enunciado` | o problema |
| `requisitos` | o que precisa estar presente |
| `criteriosAceite` | como saber que ficou pronto (verificável, não opinião) |
| `dicas` | reveladas só por clique, depois da tentativa |
| `revisa` | ids de módulos ANTERIORES que o exercício obriga a reusar |

Os três níveis:

1. **AQUECIMENTO** — o assunto do módulo isolado
2. **MERCADO** — contexto real de empresa, puxa 1 a 2 módulos anteriores
3. **ENTREVISTA** — nível de teste técnico, puxa 3+ e cobra decisão de design

`revisa` não é sugestão: sem aqueles módulos, o enunciado não fecha. É o que impede o
estudo em silos e revela o que você já esqueceu.

Falta nesse formato o que o formato novo exige: **solução** e **explicação**. É por isso
que ele não é publicado.

## Régua de nível — leia antes de editar qualquer enunciado daqui

A faixa-alvo é **vaga júnior**. Os três níveis são progressão DENTRO de júnior, não
júnior → pleno → sênior.

O teto não é opinião: é a seção do curso do Nélio Alves em que o aluno está, declarada em
`tracks.js` no campo `curso.secao` de cada módulo, com a posição atual em `marcoAtual`.
Hoje: **seção 11, "Cálculos com data-hora"**.

Um enunciado não pode exigir conteúdo de seção posterior à do próprio módulo. Quando não
dá para evitar, a saída vira muleta declarada — como o retorno sentinela `-1` que o
`javaDataHora.js` usa no lugar de exceção — e a muleta fica escrita no código, apontando
o módulo em que ela vira a forma adulta.

Exercício que exige o que o aluno ainda não estudou não ensina: ensina a desistir.

### Furos conhecidos

- `javaBase.js` → `java-f1-m3` nível 2 "Importador de CSV de pedidos" — **corrigido**.
  Exigia `try/catch` (exceções, seção 14) num módulo da seção 10. Passou a validar antes
  de converter. O `contexto` também dizia "ler arquivo", o que sugeria I/O de arquivo
  (seção 15) sem o enunciado nunca pedir isso — as linhas sempre chegaram num vetor.
- `fundamentos.js` → `base-f3-m2` nível 3 "Refatoracao guiada por SOLID" — **não é furo
  de enunciado**. `base-f3-m2` ("Clean Code e SOLID") não tem `curso.secao` em
  `tracks.js`, e os tópicos do próprio módulo já incluem Liskov e Interface Segregation.
  Quem está à frente da seção 11 é o módulo inteiro, não o exercício — e o `revisa` dele
  já declara `java-f2-m7` (interfaces) e `java-f2-m2` (herança) abertamente.
- `javaBase.js` → `java-f1-m4` nível 1 "DataUtils" — pedia exceção (seção 14), mas o
  módulo `java-f1-m4` **já foi convertido** e vive em `javaDataHora.js`. O bloco antigo
  ficou como registro; não vale corrigir material já superado.
