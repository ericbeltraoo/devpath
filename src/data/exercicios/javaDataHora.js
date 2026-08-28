// ---------------------------------------------------------------------------
// Exercicios do modulo java-f1-m4 — Data e hora (java.time)
// ---------------------------------------------------------------------------
// FORMATO NOVO. Cada exercicio tem quatro partes, nesta ordem de leitura:
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
    contexto: 'Seguradora · triagem de vaga Júnior',
    tempo: '40 min',

    cenario:
      'Uma seguradora calcula o preço do seguro por faixa etária. O sistema atual usa ' +
      '`(hoje - nascimento) / 365` e vem errando a idade de alguns clientes, que reclamam ' +
      'de estar sendo cobrados na faixa errada. Você foi chamado para corrigir.',

    tarefa:
      'Escreva um método `idadeEmAnos(LocalDate nascimento, LocalDate referencia)` que devolva ' +
      'a idade correta em anos completos, e um `faixaEtaria(int idade)` que classifique em ' +
      '"18-24", "25-39", "40-59" ou "60+".',

    requisitos: [
      'Nada de `Date`, `Calendar` ou `SimpleDateFormat` — são as classes antigas, anteriores ao Java 8',
      'Idade em anos COMPLETOS: quem faz aniversário amanhã ainda tem a idade de ontem',
      'Nascimento no futuro deve ser rejeitado, não devolver número negativo',
      'A data de referência entra como parâmetro, não use `LocalDate.now()` dentro do método',
    ],

    testes: [
      { dado: 'nascimento 2000-02-29, referência 2026-02-28', esperado: '25 anos' },
      { dado: 'nascimento 2000-02-29, referência 2026-03-01', esperado: '26 anos' },
      { dado: 'nascimento 2006-08-21, referência 2026-08-21', esperado: '20 anos (faz hoje)' },
      { dado: 'nascimento 2006-08-22, referência 2026-08-21', esperado: '19 anos (falta 1 dia)' },
      { dado: 'nascimento 2030-01-01, referência 2026-08-21', esperado: 'erro controlado' },
    ],

    explicacao: {
      testa:
        'Se você sabe que idade é uma conta de CALENDÁRIO, não de aritmética. É o exercício ' +
        'mais pedido em triagem de Java júnior justamente porque a solução ingênua funciona ' +
        'em 99% dos casos e falha nos que importam.',

      conceito:
        'O `java.time` separa duas ideias que parecem a mesma:\n\n' +
        '`Period` é calendário. Ele sabe que fevereiro tem 28 ou 29 dias, que ano tem 365 ou ' +
        '366, e que "um ano depois de 29/02/2000" é uma data que precisa de regra, não de soma. ' +
        '`Period.between(a, b).getYears()` te dá anos completos e pronto.\n\n' +
        '`ChronoUnit.DAYS.between(a, b)` te dá o total de dias. É um número exato e verdadeiro — ' +
        'e completamente inútil para idade, porque dividir por 365 assume que todo ano tem 365 ' +
        'dias. Não tem.\n\n' +
        'Regra que resolve 90% das dúvidas em java.time: **se a pergunta é sobre calendário, ' +
        'use Period. Se é sobre relógio, use Duration. Se você quer um total numa unidade só, ' +
        'use ChronoUnit.**',

      armadilha:
        'Duas, e as duas passam despercebidas:\n\n' +
        '**1. `DAYS / 365`.** Quem nasceu em 29/02/2000 e é medido em 28/02/2026 tem 9496 dias. ' +
        'Divididos por 365 dão 26. A idade real é 25 — o aniversário ainda não chegou. O erro ' +
        'aparece só em quem nasceu perto do fim de fevereiro, ou em quem já viveu muitos anos ' +
        'bissextos. Nunca em quem testa com a própria data de nascimento.\n\n' +
        '**2. `Period.between(...).getDays()` achando que é o total de dias.** Não é. É só o ' +
        'componente "dias" que sobra depois de contar anos e meses. Entre 01/01 e 15/03, ' +
        '`getDays()` devolve 14, não 73.',

      senior:
        'Um sênior faz três coisas que um júnior não faz:\n\n' +
        '**Recebe a data de referência como parâmetro.** Método que chama `LocalDate.now()` ' +
        'dentro dele é impossível de testar: você não consegue escrever o teste do 29/02 sem ' +
        'esperar chegar 2026. Isso se chama injetar o relógio, e é a diferença entre código ' +
        'testável e código que você "confere na mão".\n\n' +
        '**Valida a entrada e falha alto.** Nascimento no futuro é dado corrompido. Devolver ' +
        '-3 anos propaga o problema para o cálculo de preço; lançar exceção para na hora.\n\n' +
        '**Não inventa faixas soltas no meio do código.** `if (idade >= 60)` espalhado é como ' +
        'as regras divergem entre telas.',

      entrevistador:
        'Ele já sabe que você consegue subtrair duas datas. O que ele está olhando:\n\n' +
        '· Você usou `java.time` ou `Calendar`? Usar `Calendar` em 2026 diz que você aprendeu ' +
        'por tutorial velho e não conferiu.\n' +
        '· Você tratou 29/02 sem ser lembrado?\n' +
        '· O método é testável, ou depende do relógio do sistema?\n' +
        '· Você perguntou o que fazer com data no futuro, ou assumiu?\n\n' +
        'Esse último é o que mais pesa. Perguntar antes de assumir é o sinal mais forte de ' +
        'senioridade num teste técnico — e o mais fácil de dar.',
    },

    solucao: {
      codigo: `import java.time.LocalDate;
import java.time.Period;

public final class Idade {

    private Idade() {}                       // classe utilitaria nao se instancia

    /**
     * Idade em anos completos.
     *
     * A data de referencia e PARAMETRO, nao LocalDate.now() aqui dentro.
     * Sem isso nao da para testar o caso de 29/02 sem esperar o ano virar.
     */
    public static int idadeEmAnos(LocalDate nascimento, LocalDate referencia) {
        if (nascimento == null || referencia == null) {
            throw new IllegalArgumentException("Datas nao podem ser nulas.");
        }
        if (nascimento.isAfter(referencia)) {
            // Dado corrompido. Devolver negativo propagaria o erro para o preco.
            throw new IllegalArgumentException(
                "Nascimento no futuro: " + nascimento);
        }

        // Period entende calendario: anos bissextos, meses de tamanhos
        // diferentes e aniversario que ainda nao chegou.
        return Period.between(nascimento, referencia).getYears();
    }

    public static Faixa faixaEtaria(int idade) {
        if (idade < 0) throw new IllegalArgumentException("Idade negativa: " + idade);
        for (Faixa f : Faixa.values()) {
            if (idade <= f.maximo) return f;
        }
        return Faixa.SESSENTA_MAIS;
    }

    /**
     * As faixas moram AQUI, uma vez so. Espalhar "if (idade >= 60)" pelo
     * codigo e como as regras comecam a divergir entre telas.
     */
    public enum Faixa {
        MENOR(17, "menor de idade"),
        JOVEM(24, "18-24"),
        ADULTO(39, "25-39"),
        MADURO(59, "40-59"),
        SESSENTA_MAIS(Integer.MAX_VALUE, "60+");

        final int maximo;
        final String rotulo;

        Faixa(int maximo, String rotulo) {
            this.maximo = maximo;
            this.rotulo = rotulo;
        }

        public String rotulo() { return rotulo; }
    }
}`,
      notas: [
        'O `enum` com o valor máximo dentro evita a escada de `if` e deixa a regra num lugar só. Enum com campo e construtor é assunto do módulo seguinte — se ainda não viu, um `if` encadeado resolve, mas volte aqui depois.',
        'Repare que `idadeEmAnos` não formata nada e `faixaEtaria` não calcula nada. Cada um faz uma coisa. É isso que torna os dois testáveis separadamente.',
        '`Period.between` já devolve 0 se as datas forem iguais, então "nasceu hoje" dá 0 sem tratamento especial.',
      ],
      testeSugerido: `// Escreva ESTES testes. Se passar nos cinco, o metodo esta certo.
assertEquals(25, Idade.idadeEmAnos(LocalDate.of(2000,2,29), LocalDate.of(2026,2,28)));
assertEquals(26, Idade.idadeEmAnos(LocalDate.of(2000,2,29), LocalDate.of(2026,3,1)));
assertEquals(20, Idade.idadeEmAnos(LocalDate.of(2006,8,21), LocalDate.of(2026,8,21)));
assertEquals(19, Idade.idadeEmAnos(LocalDate.of(2006,8,22), LocalDate.of(2026,8,21)));
assertThrows(IllegalArgumentException.class,
    () -> Idade.idadeEmAnos(LocalDate.of(2030,1,1), LocalDate.of(2026,8,21)));`,
    },

    revisa: ['java-f1-m2', 'java-f1-m5'],
  },

  // =========================================================================
  {
    id: 'dh-2',
    moduloId: 'java-f1-m4',
    nivel: 2,
    titulo: 'SLA em horário comercial',
    contexto: 'Help desk · desafio técnico de vaga Pleno',
    tempo: '1h30',

    cenario:
      'Um help desk promete resolver chamados em X "horas úteis". Horário comercial é das 9h ' +
      'às 18h, de segunda a sexta, e feriados não contam. O time hoje calcula o vencimento ' +
      'somando as horas direto na data de abertura, e por isso todo chamado aberto numa ' +
      'sexta-feira aparece como vencido na segunda de manhã.',

    tarefa:
      'Dado um chamado com data-hora de abertura e um prazo em horas úteis, calcule o instante ' +
      'de vencimento. Depois, dada a hora atual, diga quais chamados estão vencidos e há quanto ' +
      'tempo, em horas e minutos.',

    requisitos: [
      'Expediente das 9h às 18h, segunda a sexta',
      'Feriados vêm de uma lista configurável e contam como dia não útil',
      'Chamado aberto fora do expediente só começa a consumir prazo no próximo instante útil',
      'Atraso apresentado como "2h15", nunca como 2,25',
      'Relatório ordenado do mais atrasado para o menos',
    ],

    testes: [
      { dado: 'abre sexta 17:00, prazo 2h úteis', esperado: 'vence segunda 10:00' },
      { dado: 'abre sexta 17:00, prazo 6h úteis', esperado: 'vence segunda 14:00' },
      { dado: 'abre sábado 10:00, prazo 1h útil', esperado: 'vence segunda 10:00' },
      { dado: 'abre quarta 03:00 (madrugada), prazo 1h', esperado: 'vence quarta 10:00' },
      { dado: 'abre quinta 17:00, prazo 2h, e sexta é feriado', esperado: 'vence segunda 10:00' },
      { dado: 'venceu 17:00, agora são 19:15', esperado: 'atraso de 2h15' },
    ],

    explicacao: {
      testa:
        'Se você consegue transformar uma regra de negócio cheia de exceções num algoritmo que ' +
        'não tem exceções. É um problema clássico de vaga pleno porque separa quem escreve ' +
        '`if` até funcionar de quem para e escolhe o modelo certo primeiro.',

      conceito:
        'A virada mental é parar de **calcular um horário final** e passar a **gastar um saldo**.\n\n' +
        'O chamado nasce com um crédito de N horas. Você caminha para a frente no tempo, e o ' +
        'crédito só é debitado nos minutos que caem dentro do expediente. Noite, fim de semana ' +
        'e feriado passam de graça. O instante em que o crédito zera é o vencimento.\n\n' +
        'Repare no que isso faz com os casos difíceis: eles somem. Sábado deixa de ser um caso ' +
        'especial e vira "um dia que não debita". Feriado idem. Madrugada idem. Você não escreve ' +
        '`if (sabado)` em lugar nenhum.\n\n' +
        'E são **duas** funções, não uma:\n\n' +
        '`proximoInstanteUtil(t)` — se o expediente está aberto, devolve o próprio `t`; senão, ' +
        'devolve o próximo momento em que abre. Só ela já resolve "abriu sábado", "abriu de ' +
        'madrugada" e "abriu no feriado". As três.\n\n' +
        'O laço que gasta o crédito — usa a primeira, desconta o que cabe até as 18h, e repete.',

      armadilha:
        '**Somar e depois corrigir.** É o reflexo de todo mundo: `abertura.plusHours(2)` e ' +
        'depois "ajustar" se caiu fora. Funciona para 2 horas numa terça. Quebra para 6 horas ' +
        'numa sexta, e o conserto vira remendo de remendo até o código ficar impossível de ler.\n\n' +
        '**Usar `Duration.ofDays(1)` para dizer "amanhã".** `Duration` é relógio: um dia são 24 ' +
        'horas exatas. Se um dia isso rodar com fuso que tem horário de verão, "amanhã às 9h" ' +
        'vira "amanhã às 10h" duas vezes por ano. Para andar no calendário use `plusDays(1)`.\n\n' +
        '**Consultar a lista de feriados com `List.contains`.** Dentro do laço, isso vira uma ' +
        'varredura da lista inteira a cada dia percorrido. `Set<LocalDate>` responde em tempo ' +
        'constante. Numa lista de 12 feriados ninguém nota; é o hábito que está sendo avaliado.',

      senior:
        'Ele começa perguntando, não codando: **"atraso é medido em horas úteis ou em relógio ' +
        'de parede?"** Um chamado que venceu sexta 17h, visto na segunda 9h, está 1 hora ' +
        'atrasado ou 64? As duas respostas se defendem, e o enunciado não diz. Escolher em ' +
        'silêncio é o erro; perguntar é o ponto.\n\n' +
        'Depois ele isola o calendário do relógio. `proximoInstanteUtil` e o laço de consumo ' +
        'vivem separados porque respondem perguntas diferentes — e, não por acaso, usam classes ' +
        'diferentes do `java.time`.\n\n' +
        'E ele escreve os casos de teste **antes**, direto do enunciado. "Sexta 17h + 2h = ' +
        'segunda 10h" não é um exemplo: é a especificação. Se o desenho não produz isso ' +
        'naturalmente, ele está errado antes da primeira linha.',

      entrevistador:
        '· Você perguntou sobre o atraso, ou assumiu?\n' +
        '· O expediente e os feriados são configuráveis, ou estão fixos no meio do código?\n' +
        '· Existe `if (DayOfWeek.SATURDAY)` espalhado, ou uma função só que responde "é útil?"\n' +
        '· `Duration` para tempo e `LocalDate` para calendário, ou tudo misturado?\n' +
        '· Você testou a virada de dia, o fim de semana E o feriado, ou só o caso feliz?\n\n' +
        'Este exercício quase nunca é avaliado pelo resultado. É avaliado pelo **desenho**.',
    },

    solucao: {
      codigo: `import java.time.*;
import java.util.Set;

/** Expediente configuravel. Nada de horario fixo no meio do algoritmo. */
public final class Expediente {

    private final LocalTime abre;
    private final LocalTime fecha;
    private final Set<LocalDate> feriados;   // Set, nao List: consulta em O(1)

    public Expediente(LocalTime abre, LocalTime fecha, Set<LocalDate> feriados) {
        if (!abre.isBefore(fecha)) {
            throw new IllegalArgumentException("Abertura precisa ser antes do fechamento.");
        }
        this.abre = abre;
        this.fecha = fecha;
        this.feriados = Set.copyOf(feriados);   // copia defensiva: ninguem muda por fora
    }

    private boolean diaUtil(LocalDate d) {
        DayOfWeek s = d.getDayOfWeek();
        return s != DayOfWeek.SATURDAY
            && s != DayOfWeek.SUNDAY
            && !feriados.contains(d);
    }

    /**
     * PECA 1 — a que faz os casos dificeis sumirem.
     *
     * Ja esta no expediente? Devolve o proprio instante.
     * Senao, devolve a proxima abertura. Sozinha, resolve "abriu sabado",
     * "abriu de madrugada" e "abriu no feriado".
     */
    public LocalDateTime proximoInstanteUtil(LocalDateTime t) {
        LocalDate dia = t.toLocalDate();

        while (true) {
            if (diaUtil(dia)) {
                LocalDateTime abertura = dia.atTime(abre);
                LocalDateTime fechamento = dia.atTime(fecha);

                if (t.isBefore(abertura)) return abertura;     // madrugada
                if (t.isBefore(fechamento)) return t;          // ja esta dentro
            }
            // Fechado hoje: tenta a abertura do proximo dia.
            // plusDays, nao Duration.ofDays: isto e calendario.
            dia = dia.plusDays(1);
            t = dia.atTime(abre);
        }
    }

    /**
     * PECA 2 — gasta o credito. Nao existe "if sabado" aqui: o que nao e
     * expediente simplesmente nao debita.
     */
    public LocalDateTime vencimento(LocalDateTime abertura, Duration prazoUtil) {
        if (prazoUtil.isNegative() || prazoUtil.isZero()) {
            throw new IllegalArgumentException("Prazo precisa ser positivo.");
        }

        LocalDateTime agora = proximoInstanteUtil(abertura);
        Duration credito = prazoUtil;

        while (true) {
            LocalDateTime fechamento = agora.toLocalDate().atTime(fecha);
            Duration cabeHoje = Duration.between(agora, fechamento);

            // Coube tudo? Acabou: o vencimento e aqui.
            if (credito.compareTo(cabeHoje) <= 0) {
                return agora.plus(credito);
            }

            credito = credito.minus(cabeHoje);
            agora = proximoInstanteUtil(fechamento);   // pula para o proximo dia util
        }
    }

    /** "2h15", nunca "2,25". */
    public static String formatarAtraso(Duration d) {
        Duration a = d.abs();
        return a.toHours() + "h" + String.format("%02d", a.toMinutesPart());
    }
}`,
      notas: [
        'O `while (true)` do `proximoInstanteUtil` termina sempre: no pior caso ele anda alguns dias e encontra um dia útil. Se você cadastrar um ano inteiro de feriados, ele roda para sempre — em código de produção vale limitar as iterações e falhar com mensagem clara. Vale a pena você tentar essa versão.',
        '`Duration.between(agora, fechamento)` funciona porque os dois são `LocalDateTime`. Com `LocalDate` isso lançaria `UnsupportedTemporalTypeException` — é o tipo que decide o que você pode perguntar.',
        '`Set.copyOf` é cópia defensiva: sem isso, quem passou o conjunto pode alterá-lo depois e mudar o comportamento do seu objeto pelas costas.',
        'O atraso aqui está em relógio de parede. Se a regra da empresa for horas úteis, o cálculo é o mesmo laço de consumo, entre vencimento e agora — mais um motivo para ele ser uma função separada e reutilizável.',
      ],
      testeSugerido: `Expediente e = new Expediente(LocalTime.of(9,0), LocalTime.of(18,0), Set.of());

// sexta 17h + 2h uteis -> segunda 10h
assertEquals(LocalDateTime.of(2026,3,16,10,0),
    e.vencimento(LocalDateTime.of(2026,3,13,17,0), Duration.ofHours(2)));

// sexta 17h + 6h uteis -> segunda 14h
assertEquals(LocalDateTime.of(2026,3,16,14,0),
    e.vencimento(LocalDateTime.of(2026,3,13,17,0), Duration.ofHours(6)));

// sabado 10h + 1h util -> segunda 10h
assertEquals(LocalDateTime.of(2026,3,16,10,0),
    e.vencimento(LocalDateTime.of(2026,3,14,10,0), Duration.ofHours(1)));

// madrugada de quarta + 1h -> quarta 10h
assertEquals(LocalDateTime.of(2026,3,11,10,0),
    e.vencimento(LocalDateTime.of(2026,3,11,3,0), Duration.ofHours(1)));

// com feriado na sexta: quinta 17h + 2h -> segunda 10h
Expediente comFeriado = new Expediente(LocalTime.of(9,0), LocalTime.of(18,0),
    Set.of(LocalDate.of(2026,3,13)));
assertEquals(LocalDateTime.of(2026,3,16,10,0),
    comFeriado.vencimento(LocalDateTime.of(2026,3,12,17,0), Duration.ofHours(2)));

assertEquals("2h15", Expediente.formatarAtraso(Duration.ofMinutes(135)));`,
    },

    revisa: ['java-f1-m2', 'java-f1-m3', 'java-f2-m1'],
  },

  // =========================================================================
  {
    id: 'dh-3',
    moduloId: 'java-f1-m4',
    nivel: 3,
    titulo: 'Agenda entre fusos',
    contexto: 'Telemedicina · desafio técnico com discussão de arquitetura',
    tempo: '2h',

    cenario:
      'Uma plataforma de telemedicina atende o Brasil inteiro e tem médicos morando fora do ' +
      'país. Pacientes reclamam de aparecer na consulta uma hora antes ou depois. O banco ' +
      'guarda a consulta numa coluna `DATETIME` com o horário "de Brasília", e o app converte ' +
      'na tela.',

    tarefa:
      'Reprojete o armazenamento e escreva o agendamento: marcar consulta sem conflito na ' +
      'agenda do médico, exibir o horário no fuso de cada participante, e recusar remarcação ' +
      'com menos de 24h de antecedência.',

    requisitos: [
      'O instante da consulta é gravado em UTC; o fuso é atributo da pessoa, não da consulta',
      'Conflito verificado no fuso do médico, considerando a duração',
      'Exibição no fuso local de quem está olhando',
      'Antecedência mínima de 24h para remarcar, contada do instante real',
      'Explique por escrito por que `DATETIME` sem fuso é o bug de origem',
    ],

    testes: [
      { dado: 'médico em Lisboa, paciente em Manaus, consulta 14:00 UTC', esperado: 'médico vê 15:00, paciente vê 10:00' },
      { dado: 'consulta às 14:00 UTC com 30 min, tentar marcar 14:15 UTC', esperado: 'conflito' },
      { dado: 'consulta às 14:00 UTC com 30 min, tentar marcar 14:30 UTC', esperado: 'permitido (limite exato)' },
      { dado: 'consulta daqui a 23h59, tentar remarcar', esperado: 'recusado' },
      { dado: 'agenda do dia do médico em fuso que virou o dia', esperado: 'lista o dia dele, não o UTC' },
    ],

    explicacao: {
      testa:
        'Se você entende que **fuso não é formatação, é dado**. Este é o exercício que separa ' +
        'quem sabe usar `java.time` de quem sabe modelar tempo. Aparece em vaga pleno e sênior ' +
        'e quase sempre vem com a pergunta "por que o sistema atual está errado?".',

      conceito:
        'Existem dois tipos de "quando", e confundi-los é a origem de praticamente todo bug de ' +
        'fuso horário:\n\n' +
        '**Um instante** é um ponto na linha do tempo, igual para todo mundo no universo. A ' +
        'consulta acontece num instante só; o que muda é o número que cada pessoa lê no relógio ' +
        'dela. Isso é `Instant` — ou `ZonedDateTime`, que é um instante mais o fuso de quem olha.\n\n' +
        '**Uma data-hora local** é um número de calendário sem âncora: "14:00 do dia 20". Não ' +
        'diz nada sobre quando aconteceu, até você dizer *onde*. Isso é `LocalDateTime`, e é ' +
        'exatamente o que o sistema atual está guardando — por isso ele está errado.\n\n' +
        'A regra prática que resolve o problema inteiro: **guarde instante em UTC, guarde o ' +
        'fuso junto da pessoa, e converta só na hora de exibir.** O banco nunca guarda "horário ' +
        'de Brasília"; a tela é que sabe para quem está desenhando.\n\n' +
        'E `LocalDateTime` não é uma classe ruim — ela é a certa para "o expediente abre às 9h", ' +
        'que é verdade em qualquer fuso. O erro é usá-la para um evento que acontece uma vez.',

      armadilha:
        '**Guardar o offset em vez do fuso.** `-03:00` não é um fuso, é o offset de hoje. ' +
        '`America/Sao_Paulo` é o fuso, e ele carrega a história das mudanças de regra. Se você ' +
        'guardar `-03:00` e o país mudar a regra, todas as consultas futuras ficam erradas.\n\n' +
        '**Detectar conflito comparando só o início.** Duas consultas às 14:00 e 14:15, ambas ' +
        'de 30 minutos, colidem. A comparação é entre intervalos: `inicioA < fimB && inicioB < ' +
        'fimA`. Repare que é `<` e não `<=` — encostar não é sobrepor, e o teste de 14:30 existe ' +
        'exatamente para cobrar isso.\n\n' +
        '**Somar 24h com `plusDays(1)` para checar antecedência.** Aqui é o contrário do ' +
        'exercício anterior: "24 horas de antecedência" é relógio, não calendário. `Duration` ' +
        'é a classe certa. Este par de exercícios existe para você sentir que a escolha depende ' +
        'da pergunta, não do gosto.',

      senior:
        'A primeira coisa que ele faz é dizer que o problema não está no código de exibição — ' +
        'está no schema. Corrigir a tela sem corrigir a coluna é remendar sintoma, e o bug volta ' +
        'na próxima tela.\n\n' +
        'Depois ele separa três responsabilidades que o código ingênuo mistura: **armazenar** ' +
        '(UTC, sempre), **decidir** (conflito, antecedência — tudo em `Instant`, sem fuso ' +
        'nenhum, porque comparação de instantes não precisa saber de fuso) e **exibir** (aí sim, ' +
        'converte para quem está olhando).\n\n' +
        'E ele pergunta o que ninguém pensou: se o paciente e o médico estão em países que ' +
        'mudam o horário de verão em datas diferentes, uma consulta recorrente marcada hoje ' +
        'ainda estará certa em novembro? A resposta muda o modelo — recorrência precisa guardar ' +
        'a regra, não os instantes.',

      entrevistador:
        '· Você identificou que o `DATETIME` é a causa, ou saiu consertando a tela?\n' +
        '· `Instant`/UTC no armazenamento, ou `LocalDateTime` com um fuso implícito?\n' +
        '· Guardou `ZoneId` ou offset? (essa distinção separa mesmo)\n' +
        '· O conflito compara intervalos ou só instantes de início?\n' +
        '· `Duration` para as 24h, ou `plusDays`?\n' +
        '· Você levantou o horário de verão sem ser provocado?\n\n' +
        'Aqui a discussão vale mais que o código. Espere ser interrompido com "e se...", e trate ' +
        'isso como convite, não como armadilha.',
    },

    solucao: {
      codigo: `import java.time.*;
import java.util.*;

/** O fuso pertence a PESSOA. A consulta so tem instante. */
public record Pessoa(Long id, String nome, ZoneId fuso) {}

/**
 * Instant, nao LocalDateTime.
 *
 * A consulta acontece num ponto unico da linha do tempo. O numero que cada
 * um le no relogio e uma questao de exibicao, e exibicao nao se guarda.
 */
public record Consulta(Long id, Long medicoId, Long pacienteId,
                       Instant inicio, Duration duracao) {

    public Instant fim() {
        return inicio.plus(duracao);
    }

    /**
     * Sobreposicao de intervalos. Repare no "<" e nao "<=":
     * terminar 14:30 e comecar 14:30 nao e conflito, e sequencia.
     */
    public boolean conflitaCom(Consulta outra) {
        return inicio.isBefore(outra.fim()) && outra.inicio.isBefore(fim());
    }

    /** Exibicao — o unico lugar onde fuso aparece. */
    public ZonedDateTime para(Pessoa quem) {
        return inicio.atZone(quem.fuso());
    }
}

public class Agenda {

    private static final Duration ANTECEDENCIA_MINIMA = Duration.ofHours(24);

    private final List<Consulta> consultas = new ArrayList<>();

    public void marcar(Consulta nova) {
        // A decisao acontece em Instant. Comparar instantes nao precisa de fuso.
        boolean ocupado = consultas.stream()
            .filter(c -> c.medicoId().equals(nova.medicoId()))
            .anyMatch(c -> c.conflitaCom(nova));

        if (ocupado) {
            throw new IllegalStateException("Medico ja tem consulta nesse horario.");
        }
        consultas.add(nova);
    }

    /**
     * "24 horas de antecedencia" e RELOGIO, nao calendario.
     * Duration, nao plusDays(1) — a diferenca aparece na virada do
     * horario de verao, e aparece so duas vezes por ano.
     */
    public void remarcar(Consulta atual, Instant novoInicio, Instant agora) {
        Duration falta = Duration.between(agora, atual.inicio());

        if (falta.compareTo(ANTECEDENCIA_MINIMA) < 0) {
            throw new IllegalStateException(
                "Remarcacao exige 24h de antecedencia. Faltam " + falta.toHours() + "h.");
        }
        consultas.remove(atual);
        marcar(new Consulta(atual.id(), atual.medicoId(), atual.pacienteId(),
                            novoInicio, atual.duracao()));
    }

    /**
     * Agenda do dia NO FUSO DO MEDICO. O "dia" dele pode comecar e terminar
     * em instantes que, em UTC, caem em datas diferentes.
     */
    public List<Consulta> doDia(Pessoa medico, LocalDate dia) {
        Instant inicioDoDia = dia.atStartOfDay(medico.fuso()).toInstant();
        Instant fimDoDia = dia.plusDays(1).atStartOfDay(medico.fuso()).toInstant();

        return consultas.stream()
            .filter(c -> c.medicoId().equals(medico.id()))
            .filter(c -> !c.inicio().isBefore(inicioDoDia) && c.inicio().isBefore(fimDoDia))
            .sorted(Comparator.comparing(Consulta::inicio))
            .toList();
    }
}`,
      notas: [
        'No banco, a coluna vira `TIMESTAMP` (ou `DATETIME` com a garantia de estar sempre em UTC) e a pessoa ganha uma coluna `fuso VARCHAR` guardando `America/Sao_Paulo` — o nome, nunca o offset `-03:00`.',
        '`record` é Java 16+. Se o curso ainda não chegou lá, use classe normal com construtor e getters: o desenho é o mesmo, só mais verboso.',
        'Toda a lógica de decisão (`conflitaCom`, `remarcar`) trabalha em `Instant` e não menciona fuso nenhum. Isso não é economia de código: comparação de instantes é verdade universal, e envolver fuso ali seria introduzir uma chance de errar sem ganhar nada.',
        '`Stream` e `Comparator` são do módulo de Lambdas e Streams. Se ainda não viu, escreva com `for` — e volte aqui quando chegar lá, para comparar as duas versões.',
        'O `agora` entra como parâmetro em `remarcar` pelo mesmo motivo do exercício da idade: sem isso, o teste de "faltam 23h59" seria impossível de escrever.',
      ],
      testeSugerido: `Pessoa medico = new Pessoa(1L, "Dra. Ana", ZoneId.of("Europe/Lisbon"));
Pessoa paciente = new Pessoa(2L, "Eric", ZoneId.of("America/Manaus"));

Instant t = Instant.parse("2026-03-20T14:00:00Z");
Consulta c = new Consulta(1L, 1L, 2L, t, Duration.ofMinutes(30));

// mesmo instante, relogios diferentes
assertEquals(15, c.para(medico).getHour());     // Lisboa em marco: UTC+1
assertEquals(10, c.para(paciente).getHour());   // Manaus: UTC-4

// encostar nao e conflito
Consulta emCima  = new Consulta(2L, 1L, 3L, t.plus(Duration.ofMinutes(15)), Duration.ofMinutes(30));
Consulta logoApos = new Consulta(3L, 1L, 3L, t.plus(Duration.ofMinutes(30)), Duration.ofMinutes(30));
assertTrue(c.conflitaCom(emCima));
assertFalse(c.conflitaCom(logoApos));

// 23h59 de antecedencia -> recusa
Instant agora = t.minus(Duration.ofHours(23)).minus(Duration.ofMinutes(59));
assertThrows(IllegalStateException.class,
    () -> agenda.remarcar(c, t.plus(Duration.ofDays(2)), agora));`,
    },

    revisa: ['java-f1-m4', 'java-f2-m1', 'java-f2-m4'],
  },
]
