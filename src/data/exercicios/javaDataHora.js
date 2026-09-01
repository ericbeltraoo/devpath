// ---------------------------------------------------------------------------
// Exercicios do modulo java-f1-m4 — Data e hora (java.time)
// ---------------------------------------------------------------------------
// REGUA DE NIVEL — leia antes de escrever ou editar qualquer exercicio daqui.
//
// A faixa-alvo e VAGA JUNIOR. Os tres niveis (Aquecimento / Mercado /
// Entrevista) sao progressao DENTRO de junior, nao junior -> pleno -> senior.
//
// O teto nao e opiniao: e a aula do curso do Nelio Alves em que o aluno esta.
// Data-hora e a secao 11. Entao a solucao so pode usar o que veio ate ali:
//
//   PODE   if/for/while, String e StringBuilder, metodos e sobrecarga,
//          classes com construtor e encapsulamento, arrays,
//          java.time inteiro (LocalDate, LocalTime, LocalDateTime, Instant,
//          ZoneId, DateTimeFormatter, Duration, Period, ChronoUnit)
//
//   NAO    enum (secao 12), heranca (13), EXCECOES (14), arquivos (15),
//          interfaces (16), Set/Map/generics (17), lambda e streams (18),
//          record, JUnit, Date e Calendar
//
// Consequencia: validacao vira retorno sentinela (-1) e teste vira main com
// comparacao impressa. Toda muleta dessas fica DECLARADA como muleta no
// codigo, apontando o modulo em que ela vira a forma adulta. Exercicio que
// exige o que o aluno ainda nao estudou nao ensina — so ensina a desistir.
//
// FORMATO. Cada exercicio tem quatro partes, nesta ordem de leitura:
//
//   1. cenario + tarefa + requisitos + testes  -> voce le e TENTA
//   2. explicacao                              -> revelavel
//   3. solucao                                 -> TRANCADA ate marcar "tentei"
//
// A ordem nao e enfeite. Ler a solucao antes de tentar produz a sensacao de
// ter aprendido sem o aprendizado, que e o pior resultado possivel: voce
// atravessa o modulo achando que sabe.
// ---------------------------------------------------------------------------

export const EXERCICIOS_DATA_HORA = [
  // =========================================================================
  {
    id: 'dh-1',
    moduloId: 'java-f1-m4',
    nivel: 1,
    titulo: 'Idade de verdade',
    contexto: 'Seguradora · triagem para vaga Júnior',
    tempo: '30 min',

    cenario:
      'Você entrou num time que cuida do sistema de uma seguradora. O preço do seguro muda por ' +
      'faixa etária. Chegou este chamado:\n\n' +
      '"Clientes estão reclamando de cobrança na faixa errada. A análise mostrou que a idade sai ' +
      'errada para algumas pessoas, principalmente quem nasceu no fim de fevereiro. O código ' +
      'atual faz (hoje - nascimento) / 365. Precisamos disso corrigido para o fechamento do mês."\n\n' +
      'Nenhum chamado real vem com a resposta dentro. Leia de novo e repare no que ele NÃO diz: ' +
      'o que fazer quando a data de nascimento vier errada.',

    tarefa:
      'Escreva `idadeEmAnos(LocalDate nascimento, LocalDate referencia)`, devolvendo a idade em ' +
      'anos completos, e `faixaEtaria(int idade)`, devolvendo a faixa como texto: "18-24", ' +
      '"25-39", "40-59" ou "60+".',

    requisitos: [
      'Use `java.time`. Nada de `Date`, `Calendar` ou `SimpleDateFormat` — são as classes antigas, de antes do Java 8',
      'Anos COMPLETOS: quem faz aniversário amanhã ainda tem a idade de ontem',
      'A data de referência entra como parâmetro. Não chame `LocalDate.now()` dentro do método',
      'Nascimento no futuro é dado inválido: devolva -1 em vez de um número negativo qualquer',
      'Só o que você já estudou: `if`, métodos e `String`. Sem `enum`, sem `throw`, sem `List`',
    ],

    testes: [
      { dado: 'nascimento 2000-02-29, referência 2026-02-28', esperado: '25 anos' },
      { dado: 'nascimento 2000-02-29, referência 2026-03-01', esperado: '26 anos' },
      { dado: 'nascimento 2006-08-21, referência 2026-08-21', esperado: '20 anos (faz hoje)' },
      { dado: 'nascimento 2006-08-22, referência 2026-08-21', esperado: '19 anos (falta 1 dia)' },
      { dado: 'nascimento 2030-01-01, referência 2026-08-21', esperado: '-1 (data inválida)' },
      { dado: 'faixaEtaria(24)', esperado: '"18-24" — a borda pertence à faixa de baixo' },
    ],

    explicacao: {
      testa:
        'Se você entendeu que idade é conta de CALENDÁRIO, não de aritmética.\n\n' +
        'É o exercício mais comum em triagem de Java júnior, e o motivo é cruel: a solução ' +
        'ingênua funciona em 99% dos casos. Ela passa em todo teste que você inventar com a sua ' +
        'própria data de nascimento. Só quebra no 1% — e 1% dos clientes de uma seguradora é ' +
        'gente reclamando no telefone.',

      conceito:
        'O `java.time` separa duas ideias que parecem a mesma coisa:\n\n' +
        '**`Period` é calendário.** Ele sabe que fevereiro tem 28 ou 29 dias e que ano tem 365 ' +
        'ou 366. `Period.between(nascimento, referencia).getYears()` devolve anos completos, já ' +
        'resolvido. É uma linha.\n\n' +
        '**`ChronoUnit.DAYS.between(a, b)` é um total.** Devolve a quantidade exata de dias entre ' +
        'as duas datas. O número está certo — e não serve para idade, porque dividir por 365 ' +
        'assume que todo ano tem 365 dias. Não tem.\n\n' +
        'Guarde esta regra, ela resolve a maior parte das dúvidas em `java.time`:\n\n' +
        '· pergunta sobre **calendário** (anos, meses, dias de agenda) → `Period`\n' +
        '· pergunta sobre **relógio** (horas, minutos, segundos corridos) → `Duration`\n' +
        '· quer um **total numa unidade só** → `ChronoUnit`',

      armadilha:
        '**1. Dividir dias por 365.** Quem nasceu em 29/02/2000, medido em 28/02/2026, tem 9496 ' +
        'dias vividos. Divididos por 365 dão 26. A idade real é 25: o aniversário ainda não ' +
        'chegou. O erro aparece só em quem nasceu perto do fim de fevereiro ou já viveu muitos ' +
        'anos bissextos — nunca em quem testa com a própria data.\n\n' +
        '**2. Achar que `Period.between(a, b).getDays()` é o total de dias.** Não é. É só o que ' +
        'sobra de dias depois de contar os anos e os meses. Entre 01/01 e 15/03, `getDays()` ' +
        'devolve 14, e não 73. Se você quer o total, a classe é `ChronoUnit`.\n\n' +
        '**3. A borda da faixa.** `if (idade < 24)` deixa quem tem 24 anos cair na faixa de cima. ' +
        'O certo é `<= 24`. Erro de um caractere, cliente cobrado errado. Por isso existe um ' +
        'teste só para a borda ali em cima.',

      senior:
        'Três coisas, e todas as três estão ao seu alcance hoje:\n\n' +
        '**Recebe a data de referência como parâmetro.** Método que chama `LocalDate.now()` ' +
        'dentro dele não tem como ser testado: você não consegue verificar o caso do 29/02 sem ' +
        'esperar chegar 2026. Isso se chama injetar o relógio, e é a diferença entre código que ' +
        'você testa e código que você "confere na mão e torce".\n\n' +
        '**Trata o dado inválido em vez de deixar passar.** Nascimento no futuro não existe: é ' +
        'cadastro digitado errado. Devolver -1 é um combinado explícito. Devolver -3 anos espalha ' +
        'o erro para o cálculo do preço, e o bug vai aparecer longe daqui, num lugar onde ninguém ' +
        'vai suspeitar da idade.\n\n' +
        '**Cada método faz uma coisa.** `idadeEmAnos` calcula e não formata. `faixaEtaria` ' +
        'classifica e não calcula. É por isso que dá para testar os dois separados.',

      entrevistador:
        'Ele já sabe que você consegue subtrair duas datas. O que ele olha:\n\n' +
        '· Você usou `java.time` ou `Calendar`? `Calendar` em 2026 diz que você aprendeu por ' +
        'tutorial velho e não conferiu se ainda valia.\n' +
        '· Você tratou o 29/02 sem ninguém lembrar?\n' +
        '· O método depende do relógio do sistema, ou dá para testar?\n' +
        '· **Você perguntou o que fazer com data no futuro, ou decidiu sozinho e seguiu?**\n\n' +
        'Esse último pesa mais que os outros três juntos, e é o mais fácil de acertar. O chamado ' +
        'não diz o que fazer com dado inválido — de propósito. Num teste presencial, perguntar ' +
        'vale ponto. Num teste para levar para casa, escreva a pergunta e a sua decisão junto do ' +
        'código: "o chamado não especifica X; assumi Y porque Z". É isso que separa quem executa ' +
        'tarefa de quem resolve problema.',
    },

    solucao: {
      codigo: `import java.time.LocalDate;
import java.time.Period;

public class Idade {

    /**
     * Idade em anos completos.
     *
     * A data de referencia entra como PARAMETRO. Se o metodo chamasse
     * LocalDate.now() aqui dentro, nao daria para testar o caso do 29/02
     * sem esperar o ano virar de verdade.
     *
     * Devolve -1 quando o dado esta invalido. Nao e a forma adulta: o certo
     * e lancar excecao, e isso e o modulo de Excecoes. Ate la, -1 e o
     * combinado — e quem chama TEM que conferir antes de usar o resultado.
     */
    public static int idadeEmAnos(LocalDate nascimento, LocalDate referencia) {
        if (nascimento == null || referencia == null) {
            return -1;
        }
        if (nascimento.isAfter(referencia)) {
            return -1;                       // cadastro digitado errado
        }

        // Period entende calendario: ano bissexto, meses de tamanhos
        // diferentes e aniversario que ainda nao chegou este ano.
        return Period.between(nascimento, referencia).getYears();
    }

    /**
     * A escada de if e a resposta certa para o que voce sabe agora.
     * Quando chegar em enum, ela vira um enum e melhora: a regra passa a
     * morar num lugar so, em vez de poder ser reescrita diferente em cada
     * tela. Volte aqui naquele dia.
     */
    public static String faixaEtaria(int idade) {
        if (idade < 0)   return "invalida";
        if (idade < 18)  return "menor de idade";
        if (idade <= 24) return "18-24";     // <= : quem tem 24 fica AQUI
        if (idade <= 39) return "25-39";
        if (idade <= 59) return "40-59";
        return "60+";
    }

    // -------------------------------------------------------------------
    // Enquanto o JUnit nao chega, o teste e este: roda e le a coluna.
    // Feio, e funciona. Nao pular esta parte e o que cria o habito.
    // -------------------------------------------------------------------
    public static void main(String[] args) {
        conferir("29/02, um dia antes do aniversario", 25,
                 idadeEmAnos(LocalDate.of(2000, 2, 29), LocalDate.of(2026, 2, 28)));

        conferir("29/02, um dia depois", 26,
                 idadeEmAnos(LocalDate.of(2000, 2, 29), LocalDate.of(2026, 3, 1)));

        conferir("faz aniversario hoje", 20,
                 idadeEmAnos(LocalDate.of(2006, 8, 21), LocalDate.of(2026, 8, 21)));

        conferir("falta um dia para o aniversario", 19,
                 idadeEmAnos(LocalDate.of(2006, 8, 22), LocalDate.of(2026, 8, 21)));

        conferir("nascimento no futuro", -1,
                 idadeEmAnos(LocalDate.of(2030, 1, 1), LocalDate.of(2026, 8, 21)));

        conferirTexto("borda da faixa: 24 anos", "18-24", faixaEtaria(24));
        conferirTexto("borda da faixa: 25 anos", "25-39", faixaEtaria(25));
    }

    private static void conferir(String caso, int esperado, int obtido) {
        String selo = (esperado == obtido) ? "ok  " : "ERRO";
        System.out.println(selo + " | " + caso
                + " | esperado " + esperado + ", obtido " + obtido);
    }

    private static void conferirTexto(String caso, String esperado, String obtido) {
        String selo = esperado.equals(obtido) ? "ok  " : "ERRO";
        System.out.println(selo + " | " + caso
                + " | esperado " + esperado + ", obtido " + obtido);
    }
}`,
      notas: [
        'O método que resolve o problema tem três `if` e um `return`. Se a sua solução ficou com 40 linhas e vários cálculos, o problema não foi esforço: foi ter escolhido `ChronoUnit` onde cabia `Period`. Escolher a classe certa é o exercício.',
        'Repare que `idadeEmAnos` não imprime nada e `faixaEtaria` não calcula nada. Método que faz duas coisas é método que você não consegue testar sem executar as duas.',
        'O `-1` é uma muleta honesta, e está comentada como muleta no próprio código. Quando você chegar em Exceções, volte neste arquivo e troque por `IllegalArgumentException`. Código que sabe onde está provisório é melhor que código que finge estar pronto.',
        '`Period.between` já devolve 0 quando as datas são iguais, então "nasceu hoje" funciona sem tratamento especial. Não invente um `if` para isso.',
      ],
      testeSugerido: `// Cole no main e rode. Os sete precisam sair "ok".
//
// Se algum sair "ERRO", NAO va direto para a solucao: olhe qual linha
// falhou e pergunte por que so aquela. Um teste vermelho sozinho quase
// sempre aponta para uma unica decisao errada, e achar qual e o treino.

conferir("29/02, um dia antes do aniversario", 25,
         idadeEmAnos(LocalDate.of(2000, 2, 29), LocalDate.of(2026, 2, 28)));
conferir("29/02, um dia depois", 26,
         idadeEmAnos(LocalDate.of(2000, 2, 29), LocalDate.of(2026, 3, 1)));
conferir("faz aniversario hoje", 20,
         idadeEmAnos(LocalDate.of(2006, 8, 21), LocalDate.of(2026, 8, 21)));
conferir("falta um dia", 19,
         idadeEmAnos(LocalDate.of(2006, 8, 22), LocalDate.of(2026, 8, 21)));
conferir("nascimento no futuro", -1,
         idadeEmAnos(LocalDate.of(2030, 1, 1), LocalDate.of(2026, 8, 21)));
conferirTexto("borda 24", "18-24", faixaEtaria(24));
conferirTexto("borda 25", "25-39", faixaEtaria(25));`,
    },

    revisa: ['java-f1-m2', 'java-f1-m5'],
  },

  {
    id: 'dh-2',
    moduloId: 'java-f1-m4',
    nivel: 2,
    titulo: 'Folha de ponto',
    contexto: 'Empresa de tecnologia · tarefa de vaga Júnior',
    tempo: '45 min',

    cenario:
      'Você é o júnior mais novo do time do RH. O sistema de ponto registra as batidas do ' +
      'crachá como texto, na ordem em que aconteceram. Um dia normal tem quatro batidas: ' +
      'entrada, saída para o almoço, volta do almoço e saída. Chegou este chamado:\n\n' +
      '"O relatório de horas está fechando errado. Quem sai no meio do dia para o médico e ' +
      'volta aparece com menos horas do que trabalhou. E o total sai como 8,57 horas, o que ' +
      'ninguém entende — a folha precisa mostrar 8h34. Às vezes o pessoal esquece de bater a ' +
      'saída no fim do dia e o relatório mostra um número absurdo."\n\n' +
      'Leia o chamado de novo. Ele descreve três problemas diferentes, e um deles não é conta: ' +
      'é o que fazer quando o dado chega quebrado.',

    tarefa:
      'Escreva `minutosTrabalhados(String[] marcacoes)`, que recebe as batidas do dia em ordem ' +
      'e devolve o total de minutos trabalhados, e `formatar(int minutos)`, que transforma esse ' +
      'total em texto no formato "8h34".',

    requisitos: [
      'As batidas vêm como texto no formato "HH:mm" — por exemplo "08:12"',
      'Os pares são entrada/saída na ordem: 1ª com 2ª, 3ª com 4ª, e assim por diante',
      'O dia pode ter mais de quatro batidas (saiu no meio do expediente e voltou)',
      'Número ÍMPAR de batidas significa que faltou bater a saída: devolva -1',
      'Array vazio é um dia sem trabalho: devolva 0, e isso não é erro',
      'Formate sempre com dois dígitos no minuto: 5 minutos é "0h05", não "0h5"',
      'Só o que você já viu: array, `String`, `LocalTime`, `Duration`/`ChronoUnit`, `if` e `for`',
    ],

    testes: [
      { dado: '["08:12","12:03","13:05","17:48"]', esperado: '514 minutos → "8h34"' },
      { dado: '["09:00","18:00"]', esperado: '540 minutos → "9h00"' },
      { dado: '["08:00","12:00","13:00","15:00","15:30","17:30"]', esperado: '480 minutos → "8h00"' },
      { dado: '["08:12","12:03","13:05"]', esperado: '-1 (esqueceu de bater a saída)' },
      { dado: '[] (array vazio)', esperado: '0 → "0h00"' },
      { dado: 'formatar(5)', esperado: '"0h05" — dois dígitos no minuto' },
      { dado: 'formatar(60)', esperado: '"1h00"' },
    ],

    explicacao: {
      testa:
        'Se você consegue pegar dado sujo do mundo real, transformar no tipo certo, calcular e ' +
        'devolver no formato que uma pessoa lê.\n\n' +
        'É literalmente a tarefa que cai na mesa de um júnior na primeira semana. Não tem ' +
        'algoritmo esperto: tem `parse`, um laço de dois em dois, e cuidado com a formatação. ' +
        'O que separa quem entrega de quem entrega errado é lembrar do caso quebrado.',

      conceito:
        'Três ideias, todas da aula que você acabou de ver:\n\n' +
        '**Texto não é hora.** `"08:12"` é uma `String` — você não consegue subtrair duas ' +
        'strings. `LocalTime.parse("08:12")` transforma o texto num tipo que sabe fazer conta. ' +
        'Esse é o primeiro passo de quase todo programa que lê dado de fora: converter para o ' +
        'tipo certo o quanto antes, e trabalhar com o tipo, não com o texto.\n\n' +
        '**Diferença entre dois horários é `Duration`.** Aqui a pergunta é de relógio, não de ' +
        'calendário: quantos minutos correram entre 08:12 e 12:03? `Duration.between(a, b)` ' +
        'responde, e `.toMinutes()` te dá o número. `ChronoUnit.MINUTES.between(a, b)` faz o ' +
        'mesmo. As duas estão certas — e nenhuma das duas é `Period`, que é para calendário.\n\n' +
        '**Percorrer de dois em dois.** As batidas são pares. O laço anda de 2 em 2 ' +
        '(`i = i + 2`), pega `marcacoes[i]` como entrada e `marcacoes[i+1]` como saída, e soma. ' +
        'É por isso que o número ímpar quebra tudo: existe um `i` sem `i+1`.',

      armadilha:
        '**1. Somar horas e minutos separados.** O reflexo é fazer `horaFim - horaInicio` e ' +
        '`minutoFim - minutoInicio`. Entre 08:12 e 12:03 isso dá 4 horas e -9 minutos. Você ' +
        'então escreve um `if` para "pegar emprestado" da hora, e acabou de reimplementar, com ' +
        'bug, o que `Duration.between` já faz certo. Converta para o tipo e deixe a classe ' +
        'trabalhar.\n\n' +
        '**2. Dividir minutos por 60 e imprimir o resultado.** 514 / 60 dá 8,566... e vira ' +
        '"8,57 horas" — que é exatamente a reclamação do chamado. Ninguém lê folha de ponto em ' +
        'decimal. `514 / 60` dá 8 (as horas) e `514 % 60` dá 34 (os minutos). Divisão inteira e ' +
        'resto: é o par que resolve toda formatação de tempo.\n\n' +
        '**3. Esquecer o zero à esquerda.** `0 + "h" + 5` produz "0h5". A folha precisa de ' +
        '"0h05". `String.format("%dh%02d", horas, minutos)` resolve, e o `%02d` é o que garante ' +
        'os dois dígitos.\n\n' +
        '**4. Estourar o array.** Se você escrever `for (int i = 0; i < marcacoes.length; i += 2)` ' +
        'e acessar `marcacoes[i+1]` sem ter conferido o tamanho, o array ímpar não devolve -1: ' +
        'ele explode em `ArrayIndexOutOfBoundsException`. Confira o tamanho ANTES do laço.',

      senior:
        'Ele confere o dado antes de processar, não durante. A checagem `marcacoes.length % 2 != 0` ' +
        'acontece na primeira linha do método, e o resto do código já pode assumir que os pares ' +
        'existem. Validar no meio do laço espalha a dúvida por todo lugar.\n\n' +
        'Ele separa **calcular** de **formatar**. `minutosTrabalhados` devolve um número puro; ' +
        '`formatar` transforma número em texto. Parece exagero num método de 10 linhas, mas é o ' +
        'que permite reusar o cálculo no relatório mensal, no gráfico e na exportação sem ' +
        'arrastar o formato "8h34" junto.\n\n' +
        'E ele repara que o chamado não diz o que fazer com o dia vazio. Ele decide (0, não é ' +
        'erro), e escreve a decisão junto do código.',

      entrevistador:
        'Este exercício é quase sempre presencial, com você compartilhando a tela. O que ele olha:\n\n' +
        '· Você converteu para `LocalTime` logo no começo, ou ficou fatiando a String com ' +
        '`substring` e `Integer.parseInt`? A segunda funciona e denuncia que você não conhece a ' +
        'biblioteca.\n' +
        '· Você tratou o array ímpar antes de acessar `i+1`?\n' +
        '· A formatação saiu com `%02d` ou com um `if (minutos < 10)` improvisado?\n' +
        '· Quando ele disser "e se as batidas vierem fora de ordem?", você entra em pânico ou ' +
        'responde que aí precisa ordenar antes, e que isso muda a suposição do enunciado?\n\n' +
        'Essa última pergunta vem quase sempre. Ela não é pegadinha: ele quer ver se você sabe ' +
        'qual suposição o seu código está fazendo. Saber onde seu código é frágil vale mais do ' +
        'que fingir que ele não é.',
    },

    solucao: {
      codigo: `import java.time.LocalTime;
import java.time.temporal.ChronoUnit;

public class Ponto {

    /**
     * Total de minutos trabalhados no dia.
     *
     * Devolve -1 quando o numero de batidas e impar: falta a saida de
     * alguem, e qualquer numero que a gente inventasse aqui iria parar na
     * folha de pagamento como se fosse verdade.
     *
     * (Quando voce chegar em Excecoes, este -1 vira uma excecao com
     *  mensagem. Ate la, e um combinado, e quem chama precisa conferir.)
     */
    public static int minutosTrabalhados(String[] marcacoes) {
        if (marcacoes == null) {
            return -1;
        }
        // A conferencia vem ANTES do laco. Assim o resto do metodo ja pode
        // contar que, para todo i par, existe i+1.
        if (marcacoes.length % 2 != 0) {
            return -1;
        }

        int total = 0;

        // De dois em dois: entrada em i, saida em i+1.
        for (int i = 0; i < marcacoes.length; i = i + 2) {
            LocalTime entrada = LocalTime.parse(marcacoes[i]);
            LocalTime saida   = LocalTime.parse(marcacoes[i + 1]);

            // Diferenca entre dois horarios e pergunta de RELOGIO.
            // Duration.between(entrada, saida).toMinutes() faz o mesmo.
            total = total + (int) ChronoUnit.MINUTES.between(entrada, saida);
        }

        return total;
    }

    /**
     * 514 -> "8h34".
     *
     * Divisao inteira da as horas, resto da os minutos. E o par que resolve
     * praticamente toda formatacao de tempo.
     */
    public static String formatar(int minutos) {
        if (minutos < 0) {
            return "--";                     // marcacao incompleta
        }
        int horas = minutos / 60;
        int resto = minutos % 60;

        // %02d e o que garante "0h05" em vez de "0h5".
        return String.format("%dh%02d", horas, resto);
    }

    // -------------------------------------------------------------------
    public static void main(String[] args) {
        conferir("dia normal, 4 batidas", 514,
                 minutosTrabalhados(new String[] {"08:12", "12:03", "13:05", "17:48"}));

        conferir("entrada e saida direto", 540,
                 minutosTrabalhados(new String[] {"09:00", "18:00"}));

        conferir("saiu no meio e voltou", 480,
                 minutosTrabalhados(new String[] {"08:00", "12:00", "13:00",
                                                  "15:00", "15:30", "17:30"}));

        conferir("esqueceu de bater a saida", -1,
                 minutosTrabalhados(new String[] {"08:12", "12:03", "13:05"}));

        conferir("dia sem trabalho", 0,
                 minutosTrabalhados(new String[] {}));

        conferirTexto("514 minutos", "8h34", formatar(514));
        conferirTexto("cinco minutos", "0h05", formatar(5));
        conferirTexto("uma hora cravada", "1h00", formatar(60));
        conferirTexto("marcacao incompleta", "--", formatar(-1));
    }

    private static void conferir(String caso, int esperado, int obtido) {
        String selo = (esperado == obtido) ? "ok  " : "ERRO";
        System.out.println(selo + " | " + caso
                + " | esperado " + esperado + ", obtido " + obtido);
    }

    private static void conferirTexto(String caso, String esperado, String obtido) {
        String selo = esperado.equals(obtido) ? "ok  " : "ERRO";
        System.out.println(selo + " | " + caso
                + " | esperado " + esperado + ", obtido " + obtido);
    }
}`,
      notas: [
        'O laço anda `i = i + 2` e lê `i` e `i+1`. Se você tentou usar dois laços aninhados ou uma variável "estou na entrada ou na saída?", funciona — mas compare com esta versão e repare quanto código sumiu quando o passo do laço passou a ser 2.',
        '`ChronoUnit.MINUTES.between(a, b)` e `Duration.between(a, b).toMinutes()` fazem a mesma coisa aqui. Use a que você achar mais legível; as duas aparecem em código real.',
        'A validação do ímpar está na primeira linha, antes do laço. Isso não é gosto: é o que permite o corpo do laço acessar `i+1` sem medo. Código que valida cedo tem menos `if` depois.',
        'Se você já viu `ArrayList` na seção 10 do curso, dá para resolver com `List<String>` no lugar do array — o algoritmo é o mesmo, só troca `.length` por `.size()` e `[i]` por `.get(i)`. Fique com o que estiver mais fresco na sua cabeça.',
        'O `formatar(-1)` devolvendo "--" não estava no enunciado. Foi decisão minha: a folha precisa mostrar alguma coisa naquela linha. Repare que eu te contei que decidi, em vez de esconder — é exatamente isso que se espera de você num teste técnico.',
      ],
      testeSugerido: `// Cole no main e rode. Os nove precisam sair "ok".
//
// Comece pelo caso do array impar. Se voce escreveu o laco antes da
// validacao, ele nao devolve -1: ele estoura com
// ArrayIndexOutOfBoundsException. Ver esse erro acontecer uma vez ensina
// mais do que ler sobre ele tres vezes.

conferir("dia normal, 4 batidas", 514,
         minutosTrabalhados(new String[] {"08:12", "12:03", "13:05", "17:48"}));
conferir("entrada e saida direto", 540,
         minutosTrabalhados(new String[] {"09:00", "18:00"}));
conferir("saiu no meio e voltou", 480,
         minutosTrabalhados(new String[] {"08:00", "12:00", "13:00",
                                          "15:00", "15:30", "17:30"}));
conferir("esqueceu de bater a saida", -1,
         minutosTrabalhados(new String[] {"08:12", "12:03", "13:05"}));
conferir("dia sem trabalho", 0, minutosTrabalhados(new String[] {}));

conferirTexto("514 minutos", "8h34", formatar(514));
conferirTexto("cinco minutos", "0h05", formatar(5));
conferirTexto("uma hora cravada", "1h00", formatar(60));
conferirTexto("marcacao incompleta", "--", formatar(-1));`,
    },

    revisa: ['java-f1-m3', 'java-f1-m2'],
  },

  {
    id: 'dh-3',
    moduloId: 'java-f1-m4',
    nivel: 3,
    titulo: 'Agenda entre fusos',
    contexto: 'Telemedicina · teste técnico para vaga Júnior',
    tempo: '1h',

    cenario:
      'Uma plataforma de telemedicina atende o Brasil inteiro e tem médicos morando fora do ' +
      'país. O banco já foi corrigido pelo time sênior e hoje grava o horário da consulta como ' +
      'instante em UTC — essa parte não é sua. Chegou este chamado:\n\n' +
      '"Precisamos de três coisas na tela da agenda. Mostrar o horário da consulta no fuso de ' +
      'quem está olhando, porque hoje médico em Lisboa e paciente em Manaus veem o mesmo número ' +
      'e um dos dois chega errado. Impedir que o médico marque duas consultas que se sobrepõem ' +
      '— lembrando que uma consulta que começa exatamente quando a outra termina está ok, isso ' +
      'acontece o dia todo. E recusar remarcação faltando menos de 24 horas."\n\n' +
      'Três regras num parágrafo só. Uma delas é um caso-limite que muda o operador de ' +
      'comparação que você vai escrever. Ache qual antes de começar.',

    tarefa:
      'Escreva a classe `Consulta`, guardando o instante de início e a duração em minutos, com: ' +
      '`horarioEm(String fuso)` devolvendo o horário formatado como "20/06/2026 15:00"; ' +
      '`conflitaCom(Consulta outra)` dizendo se as duas se sobrepõem; e ' +
      '`podeRemarcar(Instant agora)` aplicando a regra das 24 horas.',

    requisitos: [
      'O início é um `Instant` (UTC). O fuso NÃO é atributo da consulta: ele é de quem está olhando',
      'Atributos privados, com construtor e getters — a consulta não muda depois de criada',
      'Encostar não é sobrepor: 14:00–14:30 e 14:30–15:00 podem coexistir',
      'A antecedência de 24h é contada do instante real, não da data do calendário',
      'Escreva também `indiceDoConflito(Consulta[] agenda, Consulta nova)`, devolvendo -1 quando não houver',
      'Só o que você já viu: classes, `Instant`, `ZoneId`, `DateTimeFormatter`, `Duration`, array, `if`, `for`',
    ],

    testes: [
      { dado: 'consulta 2026-06-20T14:00:00Z, fuso Europe/Lisbon', esperado: '"20/06/2026 15:00"' },
      { dado: 'a mesma consulta, fuso America/Manaus', esperado: '"20/06/2026 10:00"' },
      { dado: '14:00Z por 30min  vs  14:15Z por 30min', esperado: 'conflita' },
      { dado: '14:00Z por 30min  vs  14:30Z por 30min', esperado: 'NÃO conflita (encostou)' },
      { dado: '14:00Z por 30min  vs  13:45Z por 30min', esperado: 'conflita (sobrepõe pela frente)' },
      { dado: 'consulta às 14:00Z, agora são 13:00Z do dia anterior (25h antes)', esperado: 'pode remarcar' },
      { dado: 'consulta às 14:00Z, agora são 15:00Z do dia anterior (23h antes)', esperado: 'NÃO pode' },
      { dado: 'agenda com 3 consultas, nova encaixa no buraco', esperado: '-1' },
    ],

    explicacao: {
      testa:
        'Se você entendeu que **fuso não é formatação, é significado** — e se você lê um ' +
        'enunciado até o fim antes de escrever o `if`.\n\n' +
        'A parte difícil de verdade não é o `java.time`: é o "encostar não é sobrepor", que está ' +
        'escrito no meio de uma frase e decide se você usa `<` ou `<=`. Enunciado de mercado é ' +
        'assim. A informação que muda o código raramente vem em negrito.',

      conceito:
        'Existem dois tipos de "quando", e confundir os dois é a origem de quase todo bug de ' +
        'fuso horário:\n\n' +
        '**Um instante** é um ponto na linha do tempo, o mesmo para todo mundo no planeta. A ' +
        'consulta acontece num instante só; o que muda é o número que cada pessoa lê no relógio ' +
        'dela. Isso é `Instant`. Quando o médico em Lisboa e o paciente em Manaus olham a ' +
        'consulta das 14:00Z, eles veem 15:00 e 10:00 — e estão os dois certos, olhando o mesmo ' +
        'momento.\n\n' +
        '**Uma data-hora local** é um número de calendário sem âncora: "14:00 do dia 20". Não ' +
        'diz quando aconteceu até você dizer *onde*. Isso é `LocalDateTime`, e é a classe errada ' +
        'para guardar um evento que acontece uma vez.\n\n' +
        'A conversão é uma linha: `instante.atZone(ZoneId.of("Europe/Lisbon"))` devolve um ' +
        '`ZonedDateTime`, que é o instante visto daquele lugar. Formatar vem depois, com ' +
        '`DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")`.\n\n' +
        'E a **sobreposição de intervalos** tem uma fórmula única, que vale para qualquer par:\n\n' +
        '`inicioA < fimB  E  inicioB < fimA`\n\n' +
        'Repare que é `<`, não `<=`. Com `<=`, duas consultas que apenas se encostam contariam ' +
        'como conflito, e a agenda do médico perderia metade dos horários. Foi por isso que o ' +
        'chamado gastou uma frase falando disso.',

      armadilha:
        '**1. Comparar só o início.** Duas consultas às 14:00 e 14:15, ambas de 30 minutos, se ' +
        'sobrepõem — e os inícios são diferentes. Conflito é comparação entre intervalos ' +
        'inteiros, não entre pontos. Quem compara só o início libera o agendamento e o médico ' +
        'descobre na hora da consulta.\n\n' +
        '**2. Trocar `<` por `<=` na fórmula.** É o caso-limite do enunciado. Com `<=`, o teste ' +
        'de 14:30 acusa conflito e você entrega o oposto do que foi pedido — depois de ter lido ' +
        'a frase que avisava.\n\n' +
        '**3. Achar que o offset é o fuso.** `-03:00` não é um fuso, é o offset de hoje. ' +
        '`America/Sao_Paulo` é o fuso, e ele carrega a história das mudanças de regra. Guardar ' +
        '`-03:00` significa errar todas as consultas futuras se o país mudar a regra.\n\n' +
        '**4. Supor que um fuso tem offset fixo.** Lisboa está em UTC+0 no inverno e UTC+1 no ' +
        'verão. Uma consulta às 14:00Z é 14:00 em Lisboa em março e 15:00 em junho. Se você ' +
        'escrever um teste com a data de março esperando 15:00, ele falha — e você vai passar ' +
        'meia hora procurando bug no seu código, quando o errado era o teste. `ZoneId` sabe ' +
        'disso sozinho; some um `+1` na mão e você acabou de criar o bug.\n\n' +
        '**5. Contar 24 horas com `plusDays(1)`.** Aqui a pergunta é de relógio: 24 horas ' +
        'corridas. `Duration.between(agora, inicio).toHours() >= 24` responde. `plusDays` é ' +
        'calendário e, num dia de mudança de horário, "amanhã na mesma hora" pode ter 23 ou 25 ' +
        'horas de distância.',

      senior:
        'Ele separa três responsabilidades que o código apressado mistura:\n\n' +
        '**Guardar** — sempre `Instant`, sempre UTC. Um valor só, sem ambiguidade.\n\n' +
        '**Decidir** — conflito e antecedência são contas entre instantes. Não precisam saber de ' +
        'fuso nenhum. Repare que `conflitaCom` e `podeRemarcar` na solução não mencionam ' +
        '`ZoneId` em lugar algum: se precisassem, seria sinal de que o modelo está errado.\n\n' +
        '**Exibir** — só aqui entra o fuso, e ele vem de quem está olhando, como parâmetro.\n\n' +
        'Essa separação é o motivo de a classe ser fácil de testar. Você consegue verificar ' +
        'conflito sem pensar em fuso, e verificar a exibição sem pensar em conflito.\n\n' +
        'E ele repara que a duração deveria ser validada: consulta de 0 minuto não existe. Hoje ' +
        'o construtor confia em quem chama; quando você chegar em Exceções, é ele que vai barrar.',

      entrevistador:
        'Este cai como teste para levar para casa, e a conversa depois vale tanto quanto o ' +
        'código. O que ele olha:\n\n' +
        '· Você guardou `Instant` ou `LocalDateTime`? Guardar local é o erro que ele está ' +
        'procurando.\n' +
        '· O fuso entrou como parâmetro de exibição, ou virou atributo da consulta? Se virou ' +
        'atributo, ele pergunta: "e quando o paciente viajar?"\n' +
        '· **Você tratou o caso do 14:30 sem ele precisar apontar?** Estava no enunciado. Quem ' +
        'não tratou geralmente não leu até o fim.\n' +
        '· `conflitaCom` menciona fuso? Se sim, ele vai puxar esse fio.\n\n' +
        'A pergunta final quase certa é: "e se a consulta for recorrente, toda terça às 14h, e ' +
        'o horário de verão mudar no meio?" Você **não** precisa saber resolver isso — é assunto ' +
        'de pleno. Precisa saber dizer por que é difícil: porque aí o que importa não é mais o ' +
        'instante, é a regra, e guardar instante calculado deixa a série errada quando a regra ' +
        'do fuso muda. Reconhecer o problema e admitir que não resolveria hoje vale mais do que ' +
        'inventar uma resposta.',
    },

    solucao: {
      codigo: `import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class Consulta {

    private static final DateTimeFormatter BR =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    // Privados e sem setter: uma consulta marcada nao muda de horario no
    // meio do caminho. Se precisar mudar, cria outra.
    private final Instant inicio;
    private final int duracaoMinutos;

    /**
     * O construtor confia em quem chama. Duracao <= 0 nao existe e deveria
     * ser rejeitada aqui — mas rejeitar de verdade e lancar excecao, que e
     * assunto do modulo de Excecoes. Volte aqui naquele dia.
     */
    public Consulta(Instant inicio, int duracaoMinutos) {
        this.inicio = inicio;
        this.duracaoMinutos = duracaoMinutos;
    }

    public Instant getInicio() {
        return inicio;
    }

    public int getDuracaoMinutos() {
        return duracaoMinutos;
    }

    /** O fim e derivado, nao guardado: dois campos que precisam concordar viram bug. */
    public Instant getFim() {
        return inicio.plus(Duration.ofMinutes(duracaoMinutos));
    }

    // ------------------------------------------------------- EXIBIR

    /**
     * O mesmo instante, lido do relogio de quem esta olhando.
     *
     * O fuso e PARAMETRO. Se fosse atributo da consulta, o horario mudaria
     * de significado quando o paciente viajasse.
     */
    public String horarioEm(String fuso) {
        ZonedDateTime local = inicio.atZone(ZoneId.of(fuso));
        return BR.format(local);
    }

    // ------------------------------------------------------- DECIDIR
    // Nenhum dos dois metodos abaixo menciona fuso. Nao e esquecimento:
    // comparar instantes nao precisa saber de fuso nenhum. Se precisasse,
    // o modelo estaria errado.

    /**
     * Sobreposicao de intervalos: inicioA < fimB && inicioB < fimA.
     *
     * O sinal e < e nao <=. Com <=, duas consultas que apenas se encostam
     * (uma termina 14:30, a outra comeca 14:30) contariam como conflito e
     * a agenda perderia metade dos horarios. O chamado avisou disso.
     */
    public boolean conflitaCom(Consulta outra) {
        if (outra == null) {
            return false;
        }
        return this.inicio.isBefore(outra.getFim())
            && outra.getInicio().isBefore(this.getFim());
    }

    /**
     * 24 horas CORRIDAS de antecedencia. Duration, nao plusDays: num dia de
     * mudanca de horario, "amanha na mesma hora" pode ter 23 ou 25 horas.
     */
    public boolean podeRemarcar(Instant agora) {
        if (agora == null) {
            return false;
        }
        return Duration.between(agora, inicio).toHours() >= 24;
    }

    // ------------------------------------------------------- AGENDA

    /** Indice da primeira consulta da agenda que conflita, ou -1. */
    public static int indiceDoConflito(Consulta[] agenda, Consulta nova) {
        if (agenda == null || nova == null) {
            return -1;
        }
        for (int i = 0; i < agenda.length; i++) {
            if (agenda[i] != null && agenda[i].conflitaCom(nova)) {
                return i;
            }
        }
        return -1;
    }

    // -------------------------------------------------------------------
    public static void main(String[] args) {
        Consulta c = new Consulta(Instant.parse("2026-06-20T14:00:00Z"), 30);

        conferirTexto("medico em Lisboa", "20/06/2026 15:00", c.horarioEm("Europe/Lisbon"));
        conferirTexto("paciente em Manaus", "20/06/2026 10:00", c.horarioEm("America/Manaus"));

        Consulta sobrepoe = new Consulta(Instant.parse("2026-06-20T14:15:00Z"), 30);
        Consulta encosta  = new Consulta(Instant.parse("2026-06-20T14:30:00Z"), 30);
        Consulta antes    = new Consulta(Instant.parse("2026-06-20T13:45:00Z"), 30);

        conferirBool("14:15 sobrepoe", true,  c.conflitaCom(sobrepoe));
        conferirBool("14:30 so encosta", false, c.conflitaCom(encosta));
        conferirBool("13:45 sobrepoe pela frente", true, c.conflitaCom(antes));

        conferirBool("25h de antecedencia", true,
                     c.podeRemarcar(Instant.parse("2026-06-19T13:00:00Z")));
        conferirBool("23h de antecedencia", false,
                     c.podeRemarcar(Instant.parse("2026-06-19T15:00:00Z")));

        Consulta[] agenda = { c, encosta,
                new Consulta(Instant.parse("2026-06-20T16:00:00Z"), 60) };

        conferirInt("nova as 15:00 cabe no buraco", -1,
                indiceDoConflito(agenda, new Consulta(
                        Instant.parse("2026-06-20T15:00:00Z"), 30)));

        conferirInt("nova as 14:10 bate com a primeira", 0,
                indiceDoConflito(agenda, new Consulta(
                        Instant.parse("2026-06-20T14:10:00Z"), 10)));
    }

    private static void conferirTexto(String caso, String esperado, String obtido) {
        System.out.println((esperado.equals(obtido) ? "ok  " : "ERRO")
                + " | " + caso + " | esperado " + esperado + ", obtido " + obtido);
    }

    private static void conferirBool(String caso, boolean esperado, boolean obtido) {
        System.out.println((esperado == obtido ? "ok  " : "ERRO")
                + " | " + caso + " | esperado " + esperado + ", obtido " + obtido);
    }

    private static void conferirInt(String caso, int esperado, int obtido) {
        System.out.println((esperado == obtido ? "ok  " : "ERRO")
                + " | " + caso + " | esperado " + esperado + ", obtido " + obtido);
    }
}`,
      notas: [
        '`getFim()` calcula em vez de guardar. Se `fim` fosse um campo, você teria dois valores que precisam concordar — e o dia em que alguém mudar a duração sem mudar o fim, a agenda passa a mentir. Derivar o que dá para derivar é o hábito.',
        'Repare que `conflitaCom` e `podeRemarcar` não têm a palavra `ZoneId` em lugar nenhum. Isso não é economia de código: é o sinal de que o modelo está certo. Comparar instantes não depende de onde ninguém está.',
        'O teste de Lisboa usa **20 de junho** de propósito. Em 20 de março, o mesmo instante daria 14:00 em Lisboa, porque o horário de verão europeu ainda não começou. Eu descobri isso rodando o código, não pensando — e é assim que se descobre.',
        'A fórmula `inicioA < fimB && inicioB < fimA` cobre todos os casos de sobreposição, inclusive um intervalo inteiro dentro do outro. Se você escreveu quatro `if` diferentes para os quatro jeitos de duas consultas se cruzarem, funciona — mas compare com esta linha e guarde a fórmula.',
        'Se você já viu `ArrayList` na seção 10, `indiceDoConflito` fica mais natural com `List<Consulta>`. O algoritmo não muda.',
      ],
      testeSugerido: `// Cole no main e rode. Os nove precisam sair "ok".
//
// Comece pelo teste do 14:30. Se ele sair "ERRO", voce usou <= no lugar
// de < — e a informacao que decidia isso estava no enunciado, no meio da
// frase sobre a agenda. Nao e falta de Java: e leitura.

Consulta c = new Consulta(Instant.parse("2026-06-20T14:00:00Z"), 30);

conferirTexto("medico em Lisboa", "20/06/2026 15:00", c.horarioEm("Europe/Lisbon"));
conferirTexto("paciente em Manaus", "20/06/2026 10:00", c.horarioEm("America/Manaus"));

Consulta sobrepoe = new Consulta(Instant.parse("2026-06-20T14:15:00Z"), 30);
Consulta encosta  = new Consulta(Instant.parse("2026-06-20T14:30:00Z"), 30);
Consulta antes    = new Consulta(Instant.parse("2026-06-20T13:45:00Z"), 30);

conferirBool("14:15 sobrepoe", true,  c.conflitaCom(sobrepoe));
conferirBool("14:30 so encosta", false, c.conflitaCom(encosta));
conferirBool("13:45 sobrepoe pela frente", true, c.conflitaCom(antes));

conferirBool("25h de antecedencia", true,
             c.podeRemarcar(Instant.parse("2026-06-19T13:00:00Z")));
conferirBool("23h de antecedencia", false,
             c.podeRemarcar(Instant.parse("2026-06-19T15:00:00Z")));`,
    },

    revisa: ['java-f2-m1', 'java-f1-m3'],
  },
]
