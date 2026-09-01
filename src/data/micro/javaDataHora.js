// ---------------------------------------------------------------------------
// MICRO-EXERCICIOS — modulo java-f1-m4 (Data e hora), um por topico
// ---------------------------------------------------------------------------
// Isto NAO e a prova final do modulo: essa sao os tres exercicios grandes em
// exercicios/javaDataHora.js. Aqui e outra coisa.
//
// O micro-exercicio existe para o momento em que voce marca UM topico na
// Trilha e quer ter certeza de que entendeu AQUELA classe. Dez minutos, um
// main so, nenhuma regra de negocio, nenhuma camada.
//
// A classe unica com main aqui e proposital, e nao contradiz a solucao em
// camadas dos exercicios grandes: la o assunto e modelagem, aqui o assunto e
// uma classe do java.time. Separar entidade e service para imprimir tres
// linhas so esconderia o que voce veio ver.
//
// O campo `topico` e o INDICE do topico dentro de modulo.topicos, em
// tracks.js. Se a ordem dos topicos mudar la, tem que mudar aqui.
// ---------------------------------------------------------------------------

export const MICRO_DATA_HORA = [
  // =========================================================================
  {
    id: 'm-dh-0',
    moduloId: 'java-f1-m4',
    topico: 0, // LocalDate, LocalTime, LocalDateTime — data sem fuso
    titulo: 'As tres classes sem fuso',
    tempo: '10 min',

    objetivo:
      'Saber qual das três classes usar em cada situação, e saber tirar pedaços de uma data.',

    tarefa:
      'Crie a data 25/12/2026, o horário 09:30 e a data-hora que junta os dois. Imprima cada ' +
      'um. Depois imprima, a partir da data: o dia da semana, o ano, o mês e o dia.',

    dica:
      'As três se criam com `.of(...)`. `LocalDate.of(ano, mes, dia)` — repare que o mês aqui é ' +
      '12 para dezembro, não 11. `LocalTime.of(hora, minuto)`. `LocalDateTime.of(ano, mes, dia, ' +
      'hora, minuto)`.',

    saidaEsperada: `data:      2026-12-25
hora:      09:30
data-hora: 2026-12-25T09:30
dia da semana: FRIDAY
ano 2026, mes 12, dia 25`,

    solucao: {
      codigo: `import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class MicroDatas {

    public static void main(String[] args) {

        LocalDate data = LocalDate.of(2026, 12, 25);
        LocalTime hora = LocalTime.of(9, 30);
        LocalDateTime dataHora = LocalDateTime.of(2026, 12, 25, 9, 30);

        System.out.println("data:      " + data);
        System.out.println("hora:      " + hora);
        System.out.println("data-hora: " + dataHora);

        System.out.println("dia da semana: " + data.getDayOfWeek());
        System.out.println("ano " + data.getYear()
                + ", mes " + data.getMonthValue()
                + ", dia " + data.getDayOfMonth());
    }
}`,
      comentario:
        'Três classes, uma pergunta cada:\n\n' +
        '`LocalDate` — só o dia do calendário. Aniversário, vencimento, feriado.\n' +
        '`LocalTime` — só o horário. Abertura da loja, horário do alarme.\n' +
        '`LocalDateTime` — os dois juntos. Uma reunião marcada.\n\n' +
        '"Local" aqui não quer dizer "do seu computador": quer dizer **sem fuso**. Elas não ' +
        'sabem onde no mundo aquilo aconteceu. Por isso servem para "a loja abre às 9h" — que é ' +
        'verdade em qualquer cidade — e não servem para um evento que acontece uma vez só.',
    },

    armadilha:
      '**O mês NÃO começa em zero.** `LocalDate.of(2026, 12, 25)` é dezembro mesmo. Quem vem do ' +
      '`Calendar` antigo espera que 12 fosse janeiro do ano seguinte, porque lá o mês ia de 0 a ' +
      '11. Essa foi uma das razões de o `java.time` existir.\n\n' +
      'E repare que `getDayOfWeek()` devolve `FRIDAY`, em inglês e em maiúsculas. Não é texto ' +
      'para mostrar ao usuário — é um valor da linguagem. Formatar para português vem no tópico ' +
      'do `DateTimeFormatter`.',
  },

  // =========================================================================
  {
    id: 'm-dh-1',
    moduloId: 'java-f1-m4',
    topico: 1, // Instant — instante global (UTC)
    titulo: 'Instant, o tipo que vai para o banco',
    tempo: '10 min',

    objetivo:
      'Entender a diferença entre "um momento na linha do tempo" e "um número de calendário".',

    tarefa:
      'Crie um `Instant` a partir do texto `"2026-06-20T14:00:00Z"`. Imprima ele. Depois some ' +
      '90 minutos e imprima de novo. Por último, imprima quantos segundos se passaram desde ' +
      '1970 (`getEpochSecond()`).',

    dica:
      '`Instant.parse("...")` lê o texto no padrão ISO. Para somar tempo, `plus(Duration.ofMinutes(90))`.',

    saidaEsperada: `instante:        2026-06-20T14:00:00Z
mais 90 minutos: 2026-06-20T15:30:00Z
segundos desde 1970: 1781964000`,

    solucao: {
      codigo: `import java.time.Duration;
import java.time.Instant;

public class MicroInstante {

    public static void main(String[] args) {

        Instant momento = Instant.parse("2026-06-20T14:00:00Z");

        System.out.println("instante:        " + momento);
        System.out.println("mais 90 minutos: " + momento.plus(Duration.ofMinutes(90)));
        System.out.println("segundos desde 1970: " + momento.getEpochSecond());
    }
}`,
      comentario:
        'Um `Instant` é um ponto na linha do tempo — o mesmo para todo mundo no planeta. Duas ' +
        'pessoas em países diferentes olhando o mesmo `Instant` estão olhando o mesmo momento; ' +
        'o que muda é o número que cada relógio mostra.\n\n' +
        'Por dentro ele é só um contador de segundos desde 1º de janeiro de 1970 — foi isso que ' +
        'o `getEpochSecond()` mostrou. Nenhum fuso, nenhuma ambiguidade. É por isso que `Instant` ' +
        'é o tipo certo para gravar no banco: um número, um significado.\n\n' +
        'O `Z` no fim do texto quer dizer UTC. Ele não é enfeite: sem ele, aquele texto não ' +
        'diria em que momento a coisa aconteceu.',
    },

    armadilha:
      'Não dá para perguntar a um `Instant` que horas são. `momento.getHour()` **não existe** — ' +
      'e não é limitação, é o ponto. Que horas são depende de onde você está, e o `Instant` de ' +
      'propósito não sabe onde ninguém está. Para virar horário de relógio ele precisa de um ' +
      'fuso, que é o próximo tópico.',
  },

  // =========================================================================
  {
    id: 'm-dh-2',
    moduloId: 'java-f1-m4',
    topico: 2, // ZonedDateTime e ZoneId — conversao de fuso
    titulo: 'O mesmo momento, tres relogios',
    tempo: '10 min',

    objetivo:
      'Converter um instante para o horário de qualquer lugar do mundo, sem somar nada na mão.',

    tarefa:
      'Pegue o instante `"2026-06-20T14:00:00Z"` e mostre que horas são nesse momento em ' +
      'São Paulo, em Manaus e em Lisboa. Imprima também o offset de cada um.',

    dica:
      '`instante.atZone(ZoneId.of("America/Sao_Paulo"))` devolve um `ZonedDateTime`. Ele tem ' +
      '`.getOffset()`. Os nomes de fuso são sempre `Regiao/Cidade`.',

    saidaEsperada: `Sao Paulo: 2026-06-20T11:00-03:00[America/Sao_Paulo]  offset -03:00
Manaus:    2026-06-20T10:00-04:00[America/Manaus]  offset -04:00
Lisboa:    2026-06-20T15:00+01:00[Europe/Lisbon]  offset +01:00`,

    solucao: {
      codigo: `import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class MicroFuso {

    public static void main(String[] args) {

        Instant momento = Instant.parse("2026-06-20T14:00:00Z");

        mostrar("Sao Paulo", momento, "America/Sao_Paulo");
        mostrar("Manaus", momento, "America/Manaus");
        mostrar("Lisboa", momento, "Europe/Lisbon");
    }

    private static void mostrar(String nome, Instant momento, String fuso) {
        ZonedDateTime local = momento.atZone(ZoneId.of(fuso));

        // %-10s alinha a esquerda em 10 colunas: sem isso as tres linhas
        // saem desencontradas e comparar fica pior do que precisa ser.
        System.out.println(String.format("%-11s", nome + ":")
                + local + "  offset " + local.getOffset());
    }
}`,
      comentario:
        'Três horários diferentes — 11:00, 10:00 e 15:00 — e **os três estão certos**. É o mesmo ' +
        'momento, visto de três relógios.\n\n' +
        'Repare que você não somou nem subtraiu nada. O `ZoneId` conhece a regra de cada lugar, ' +
        'inclusive horário de verão, e faz a conta. É exatamente isso que você não quer estar ' +
        'fazendo na mão.\n\n' +
        'Manaus está uma hora atrás de São Paulo. Se você tivesse assumido que "no Brasil é tudo ' +
        '-03:00", já teria errado dentro do próprio país.',
    },

    armadilha:
      '**Offset não é fuso.** `-03:00` é o offset de hoje; `America/Sao_Paulo` é o fuso, e ele ' +
      'carrega a história das mudanças de regra do país. Se você guardar `-03:00` e a regra ' +
      'mudar, todas as datas futuras ficam erradas.\n\n' +
      'Teste você mesmo: troque a data para `"2026-01-20T14:00:00Z"` e rode de novo. Lisboa vai ' +
      'sair como 14:00, não 15:00 — em janeiro o horário de verão europeu não está valendo. ' +
      'Nenhuma linha do seu código muda; quem sabe disso é o `ZoneId`.',
  },

  // =========================================================================
  {
    id: 'm-dh-3',
    moduloId: 'java-f1-m4',
    topico: 3, // DateTimeFormatter — parse e format
    titulo: 'Texto vira data, data vira texto',
    tempo: '10 min',

    objetivo:
      'Ler uma data que veio como texto do usuário e devolver uma data no formato que o ' +
      'brasileiro lê.',

    tarefa:
      'Leia a data `"25/12/2026"` (formato brasileiro) para um `LocalDate`. Depois imprima essa ' +
      'mesma data de três jeitos: no padrão do Java, no formato brasileiro e como ' +
      '"25 de dezembro de 2026".',

    dica:
      '`DateTimeFormatter.ofPattern("dd/MM/yyyy")` monta o molde. `LocalDate.parse(texto, molde)` ' +
      'lê; `molde.format(data)` escreve. Para o mês por extenso em português, o padrão é ' +
      '`"dd \'de\' MMMM \'de\' yyyy"` com `Locale` de Brasil.',

    saidaEsperada: `padrao do Java: 2026-12-25
brasileiro:     25/12/2026
por extenso:    25 de dezembro de 2026`,

    solucao: {
      codigo: `import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class MicroFormato {

    public static void main(String[] args) {

        DateTimeFormatter br = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        // TEXTO -> DATA. A partir daqui da para fazer conta.
        LocalDate data = LocalDate.parse("25/12/2026", br);

        DateTimeFormatter extenso = DateTimeFormatter.ofPattern(
                "dd 'de' MMMM 'de' yyyy", new Locale("pt", "BR"));

        // DATA -> TEXTO, tres jeitos do mesmo dia.
        System.out.println("padrao do Java: " + data);
        System.out.println("brasileiro:     " + br.format(data));
        System.out.println("por extenso:    " + extenso.format(data));
    }
}`,
      comentario:
        'Duas viagens opostas, e vale gravar os nomes:\n\n' +
        '**`parse`** = texto vira data. É a porta de entrada: veio do formulário, do arquivo, da ' +
        'API. Faça isso o quanto antes.\n' +
        '**`format`** = data vira texto. É a porta de saída, na hora de mostrar para alguém.\n\n' +
        'No meio, entre as duas portas, o seu programa trabalha sempre com `LocalDate` — nunca ' +
        'com `String`. É o que permite somar dias, comparar e calcular.\n\n' +
        'O `MMMM` com quatro letras é o mês por extenso; `MM` com duas é o número. O `Locale` é ' +
        'o que decide se sai "dezembro" ou "December".',
    },

    armadilha:
      '**Calcular em cima do texto.** É tentador pegar `"25/12/2026"` e usar `substring` para ' +
      'arrancar o dia. Funciona até chegar uma data em outro formato, ou até você precisar somar ' +
      '30 dias e descobrir que dia 25 + 30 não é dia 55.\n\n' +
      'E cuidado com `mm` minúsculo: `MM` é mês, `mm` é minuto. Escrever `dd/mm/yyyy` compila, ' +
      'roda, e imprime o minuto no lugar do mês.',
  },

  // =========================================================================
  {
    id: 'm-dh-4',
    moduloId: 'java-f1-m4',
    topico: 4, // ISO-8601
    titulo: 'O formato que toda API fala',
    tempo: '10 min',

    objetivo:
      'Reconhecer o formato ISO-8601 quando ele aparecer numa API, e saber que o Java já o lê ' +
      'sem você configurar nada.',

    tarefa:
      'Sem criar nenhum `DateTimeFormatter`, leia estes três textos: `"2026-06-20"` para ' +
      '`LocalDate`, `"2026-06-20T14:30:00"` para `LocalDateTime` e `"2026-06-20T14:30:00Z"` ' +
      'para `Instant`. Imprima os três.',

    dica: 'Só `LocalDate.parse(texto)`, sem segundo parâmetro. O ISO é o padrão do Java.',

    saidaEsperada: `so a data:   2026-06-20
data e hora: 2026-06-20T14:30
com o Z:     2026-06-20T14:30:00Z`,

    solucao: {
      codigo: `import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class MicroIso {

    public static void main(String[] args) {

        // Nenhum DateTimeFormatter. O ISO-8601 e o padrao do java.time:
        // se o texto vier nesse formato, o parse funciona sozinho.
        LocalDate data = LocalDate.parse("2026-06-20");
        LocalDateTime dataHora = LocalDateTime.parse("2026-06-20T14:30:00");
        Instant instante = Instant.parse("2026-06-20T14:30:00Z");

        System.out.println("so a data:   " + data);
        System.out.println("data e hora: " + dataHora);
        System.out.println("com o Z:     " + instante);
    }
}`,
      comentario:
        'ISO-8601 é o formato `2026-06-20T14:30:00Z`, e ele é assim de propósito:\n\n' +
        '**Ano primeiro, do maior para o menor.** Isso faz com que ordenar as datas como texto ' +
        'dê a mesma ordem que ordená-las como data. Com `20/06/2026` isso não acontece.\n' +
        '**O `T`** separa a data da hora, sem espaço, para o valor inteiro ser uma palavra só.\n' +
        '**O `Z`** diz que é UTC. Sem ele, o texto não informa em que momento aquilo aconteceu.\n\n' +
        'Toda API REST que você vai consumir devolve datas assim. Quando o Spring converter JSON ' +
        'em objeto mais para a frente, é este formato que ele vai esperar.',
    },

    armadilha:
      '`LocalDateTime.parse("2026-06-20T14:30:00Z")` **estoura**. O `Z` diz "isto tem fuso", e ' +
      '`LocalDateTime` é justamente o tipo que não tem fuso — ele não sabe o que fazer com aquela ' +
      'letra. Texto com `Z` é `Instant` (ou `ZonedDateTime`); sem `Z`, é `LocalDateTime`.\n\n' +
      'Tente rodar com o tipo errado para ver a mensagem de erro. Reconhecer ' +
      '`DateTimeParseException` de vista economiza tempo depois.',
  },

  // =========================================================================
  {
    id: 'm-dh-5',
    moduloId: 'java-f1-m4',
    topico: 5, // Calculos: plusDays, minusMonths, withDayOfMonth
    titulo: 'Andar no calendario',
    tempo: '10 min',

    objetivo:
      'Somar e subtrair tempo, e trocar um pedaço da data sem mexer no resto.',

    tarefa:
      'Partindo de 31/01/2026: imprima a data 30 dias depois, um mês depois, um mês antes, e a ' +
      'data com o dia trocado para 15. Imprima também o último dia daquele mês.',

    dica:
      '`plusDays`, `plusMonths`, `minusMonths`, `withDayOfMonth`. Para o último dia do mês, ' +
      '`data.withDayOfMonth(data.lengthOfMonth())`.',

    saidaEsperada: `original:        2026-01-31
30 dias depois:  2026-03-02
um mes depois:   2026-02-28
um mes antes:    2025-12-31
dia trocado:     2026-01-15
ultimo do mes:   2026-01-31
original ainda:  2026-01-31`,

    solucao: {
      codigo: `import java.time.LocalDate;

public class MicroCalculos {

    public static void main(String[] args) {

        LocalDate data = LocalDate.of(2026, 1, 31);

        System.out.println("original:        " + data);
        System.out.println("30 dias depois:  " + data.plusDays(30));
        System.out.println("um mes depois:   " + data.plusMonths(1));
        System.out.println("um mes antes:    " + data.minusMonths(1));
        System.out.println("dia trocado:     " + data.withDayOfMonth(15));
        System.out.println("ultimo do mes:   " + data.withDayOfMonth(data.lengthOfMonth()));

        // A original nao mudou nenhuma vez.
        System.out.println("original ainda:  " + data);
    }
}`,
      comentario:
        'Olhe as duas linhas do meio com atenção. **30 dias depois** de 31/01 é 02/03. **Um mês ' +
        'depois** de 31/01 é 28/02. São respostas diferentes porque são perguntas diferentes: ' +
        '"30 dias" é uma quantidade, "um mês" é uma posição no calendário.\n\n' +
        'E repare no que o Java fez sozinho: 31 de fevereiro não existe, então `plusMonths(1)` ' +
        'te deu o último dia válido, 28. Ele não estourou nem inventou 03/03.\n\n' +
        'O `with...` troca um pedaço e mantém o resto — útil para "primeiro dia do mês", ' +
        '"mesmo dia do ano que vem".',
    },

    armadilha:
      '**Achar que `data.plusDays(30)` muda a `data`.** Não muda. Todas essas classes são ' +
      'imutáveis: cada método devolve um objeto **novo** e deixa o original intacto — foi por ' +
      'isso que a última linha ainda imprime 2026-01-31.\n\n' +
      'O erro clássico é escrever `data.plusDays(30);` sozinho numa linha, sem guardar o ' +
      'resultado, e depois não entender por que nada mudou. Ou você atribui ' +
      '(`data = data.plusDays(30)`), ou o resultado se perde.',
  },

  // =========================================================================
  {
    id: 'm-dh-6',
    moduloId: 'java-f1-m4',
    topico: 6, // Duration vs Period vs ChronoUnit
    titulo: 'As tres formas de medir tempo',
    tempo: '15 min',

    objetivo:
      'Escolher entre Duration, Period e ChronoUnit sem chutar — é a decisão que mais aparece ' +
      'em código de verdade.',

    tarefa:
      'Entre 15/03/2000 e 20/06/2026, imprima: quantos anos, meses e dias (`Period`); quantos ' +
      'dias no total (`ChronoUnit`). Depois, entre 08:12 e 17:48 do mesmo dia, imprima quantos ' +
      'minutos correram (`Duration`).',

    dica:
      '`Period.between(dataA, dataB)` tem `.getYears()`, `.getMonths()`, `.getDays()`. ' +
      '`ChronoUnit.DAYS.between(a, b)` devolve o total. `Duration.between(horaA, horaB).toMinutes()`.',

    saidaEsperada: `Period:     26 anos, 3 meses e 5 dias
ChronoUnit: 9593 dias no total
Duration:   576 minutos`,

    solucao: {
      codigo: `import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Period;
import java.time.temporal.ChronoUnit;

public class MicroMedidas {

    public static void main(String[] args) {

        LocalDate inicio = LocalDate.of(2000, 3, 15);
        LocalDate fim = LocalDate.of(2026, 6, 20);

        // CALENDARIO, quebrado em partes.
        Period p = Period.between(inicio, fim);
        System.out.println("Period:     " + p.getYears() + " anos, "
                + p.getMonths() + " meses e " + p.getDays() + " dias");

        // CALENDARIO, um total numa unidade so.
        System.out.println("ChronoUnit: "
                + ChronoUnit.DAYS.between(inicio, fim) + " dias no total");

        // RELOGIO.
        LocalTime entrada = LocalTime.of(8, 12);
        LocalTime saida = LocalTime.of(17, 48);
        System.out.println("Duration:   "
                + Duration.between(entrada, saida).toMinutes() + " minutos");
    }
}`,
      comentario:
        'A regra, e ela resolve quase toda dúvida em `java.time`:\n\n' +
        '**`Period`** — calendário, quebrado em anos/meses/dias. Use para idade, tempo de casa, ' +
        'tempo de contrato. É o que uma pessoa fala: "26 anos e 3 meses".\n\n' +
        '**`Duration`** — relógio. Horas, minutos, segundos. Use para duração de consulta, tempo ' +
        'de expediente, timeout.\n\n' +
        '**`ChronoUnit`** — um total, numa unidade só. Use quando você quer um número para fazer ' +
        'conta: "9593 dias", "576 minutos". Ele funciona tanto para data quanto para hora — ' +
        '`ChronoUnit.DAYS`, `ChronoUnit.MINUTES`, `ChronoUnit.YEARS`.\n\n' +
        'Repare que `Period` e `ChronoUnit` responderam a mesma pergunta de dois jeitos: "26 ' +
        'anos, 3 meses e 5 dias" e "9593 dias" são o mesmo intervalo.',
    },

    armadilha:
      '**`Period.between(a, b).getDays()` não é o total de dias.** É só o que sobrou de dias ' +
      'depois de contar os anos e os meses — no exemplo, 5. Quem quer o total usa `ChronoUnit`. ' +
      'Esse é provavelmente o erro mais comum de `java.time` inteiro.\n\n' +
      '**E nunca calcule idade dividindo dias por 365.** Anos bissextos existem, e a conta erra ' +
      'exatamente em quem nasceu perto do fim de fevereiro. Idade é `Period`.',
  },

  // =========================================================================
  {
    id: 'm-dh-7',
    moduloId: 'java-f1-m4',
    topico: 7, // Por que Date e Calendar sao legado
    titulo: 'Reescrever codigo velho',
    tempo: '15 min',

    objetivo:
      'Reconhecer o padrão antigo quando ele aparecer num sistema legado, e saber traduzir para ' +
      '`java.time`.',

    tarefa:
      'Este trecho existe em milhares de sistemas em produção. Reescreva com `java.time`:\n\n' +
      '```\n' +
      'Calendar c = Calendar.getInstance();\n' +
      'c.set(2026, 11, 25);          // 11 = dezembro\n' +
      'c.add(Calendar.DAY_OF_MONTH, 30);\n' +
      'Date d = c.getTime();\n' +
      'SimpleDateFormat f = new SimpleDateFormat("dd/MM/yyyy");\n' +
      'System.out.println(f.format(d));\n' +
      '```\n\n' +
      'Imprima o resultado e conte quantas linhas a sua versão tem.',

    dica: 'Uma data, um `plusDays`, um `DateTimeFormatter`. Cabe em três linhas.',

    saidaEsperada: `24/01/2027`,

    solucao: {
      codigo: `import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class MicroLegado {

    public static void main(String[] args) {

        LocalDate data = LocalDate.of(2026, 12, 25).plusDays(30);
        System.out.println(DateTimeFormatter.ofPattern("dd/MM/yyyy").format(data));
    }
}`,
      comentario:
        'Seis linhas viraram duas, e cada linha que sumiu era uma chance de errar:\n\n' +
        '**O mês começava em 0.** `c.set(2026, 11, 25)` é dezembro. Todo mundo erra isso pelo ' +
        'menos uma vez, e o erro passa em revisão de código porque parece certo.\n\n' +
        '**`Calendar` é mutável.** `c.add(...)` altera o próprio objeto. Se você passar esse `c` ' +
        'para um método, ele pode voltar diferente e você não vê onde mudou. As classes do ' +
        '`java.time` são imutáveis: `plusDays` devolve outra data e deixa a original em paz.\n\n' +
        '**`SimpleDateFormat` não funciona com threads.** Duas partes do programa formatando ao ' +
        'mesmo tempo produzem resultado errado, de vez em quando, sem estourar erro nenhum. Bug ' +
        'que aparece só em produção e some quando você vai investigar.\n\n' +
        '**`Date` mente no nome.** Apesar de se chamar Date, ela guarda data *e* hora.',
    },

    armadilha:
      'A armadilha aqui não é escrever `Calendar` — é **encontrar** `Calendar`. Você vai abrir ' +
      'sistemas que usam isso, e o reflexo errado é sair reescrevendo tudo. Código velho que ' +
      'funciona há dez anos tem valor, e uma migração dessas quebra o que ninguém lembra que ' +
      'depende dali.\n\n' +
      'O que se faz de verdade: **código novo usa `java.time`**, e o velho só é convertido quando ' +
      'você já ia mexer naquele trecho de qualquer jeito. Numa entrevista, dizer isso vale mais ' +
      'do que dizer "eu trocaria tudo".',
  },
]
