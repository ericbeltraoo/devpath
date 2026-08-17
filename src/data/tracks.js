// ---------------------------------------------------------------------------
// TRILHAS DE ESTUDO
// ---------------------------------------------------------------------------
// Modelo de dados:
//   trilha  -> fases -> modulos -> topicos (unidade minima marcavel)
//
// Cada modulo tem:
//   id         identificador estavel (NAO renomear: e a chave do progresso salvo)
//   titulo     nome do modulo
//   horas      estimativa de horas de estudo focado
//   topicos    lista de itens marcaveis
//   entregavel o que voce precisa ter PRONTO ao final (prova de que aprendeu)
//   recursos   links de referencia
//   curso      (opcional) onde este conteudo aparece no curso do Nelio Alves,
//              no formato { secao: 5, nome: 'Estruturas repetitivas' }.
//              A ORDEM do roadmap NAO segue a do curso — ela segue valor de
//              mercado. Este campo serve so para voce saber qual aula assistir.
// ---------------------------------------------------------------------------

export const TRILHAS = [
  // =========================================================================
  // FUNDAMENTOS — base comum a qualquer area
  // =========================================================================
  {
    id: 'base',
    nome: 'Fundamentos de Engenharia',
    area: 'Base',
    icone: '🧱',
    cor: '#8b5cf6',
    resumo:
      'A base que todo dev junior precisa ter, independente de linguagem. E o que separa quem "sabe programar" de quem trabalha em time.',
    fases: [
      {
        id: 'base-f1',
        nome: 'Ferramentas do dia a dia',
        objetivo: 'Parar de depender do botao direito. Terminal, Git e IDE no automatico.',
        modulos: [
          {
            id: 'base-f1-m1',
            titulo: 'Terminal e sistema de arquivos',
            horas: 6,
            topicos: [
              'Navegacao: cd, ls/dir, pwd, caminhos relativos vs absolutos',
              'Manipular arquivos: mkdir, cp, mv, rm (e o equivalente no PowerShell)',
              'Variaveis de ambiente e PATH (por que "comando nao reconhecido" acontece)',
              'Pipes e redirecionamento: |, >, >>',
              'Instalar SDKs pelo terminal (winget / sdkman / choco)',
            ],
            entregavel: 'Criar, mover e apagar uma estrutura de pastas de projeto inteira sem usar o mouse.',
            recursos: [
              { tipo: 'doc', titulo: 'PowerShell - guia de comandos basicos', url: 'https://learn.microsoft.com/pt-br/powershell/scripting/learn/ps101/01-getting-started' },
            ],
          },
          {
            id: 'base-f1-m2',
            titulo: 'Git e GitHub de verdade',
            horas: 12,
            topicos: [
              'Os 3 estados: working directory, staging area, repositorio',
              'init, add, commit, status, log, diff',
              'Branches: branch, checkout/switch, merge',
              'Conflitos de merge — resolver na mao, sem panico',
              'Remotos: remote, push, pull, fetch, clone',
              'Pull Request: abrir, revisar, comentar, aprovar',
              'Boas mensagens de commit (Conventional Commits)',
              '.gitignore e por que NUNCA comitar senha/credencial',
              'git revert vs reset — o que e seguro em time',
            ],
            entregavel:
              'Um repositorio no GitHub com pelo menos 3 branches, 1 PR aberto por voce e 1 conflito resolvido de proposito.',
            recursos: [
              { tipo: 'doc', titulo: 'Pro Git (livro oficial, em portugues)', url: 'https://git-scm.com/book/pt-br/v2' },
              { tipo: 'pratica', titulo: 'Learn Git Branching (visual, interativo)', url: 'https://learngitbranching.js.org/?locale=pt_BR' },
            ],
          },
          {
            id: 'base-f1-m3',
            titulo: 'IDE e produtividade',
            horas: 4,
            topicos: [
              'IntelliJ IDEA / VS Code: atalhos essenciais (buscar arquivo, buscar simbolo, refatorar, formatar)',
              'Debugger: breakpoint, step over, step into, watch, avaliar expressao',
              'Parar de usar System.out.println para depurar',
              'Live templates / snippets',
            ],
            entregavel: 'Achar e corrigir um bug usando SOMENTE o debugger, sem nenhum print.',
            recursos: [
              { tipo: 'doc', titulo: 'IntelliJ IDEA — atalhos de teclado', url: 'https://www.jetbrains.com/help/idea/mastering-keyboard-shortcuts.html' },
            ],
          },
        ],
      },
      {
        id: 'base-f2',
        nome: 'Como a web funciona',
        objetivo: 'Entender o que acontece entre o clique do usuario e o seu codigo.',
        modulos: [
          {
            id: 'base-f2-m1',
            titulo: 'HTTP, REST e JSON',
            horas: 8,
            topicos: [
              'Cliente/servidor, DNS, IP, porta',
              'Metodos HTTP: GET, POST, PUT, PATCH, DELETE — e idempotencia',
              'Status codes que voce PRECISA saber: 200, 201, 204, 400, 401, 403, 404, 409, 422, 500',
              'Headers, query params, path params, body',
              'JSON: estrutura, serializacao, desserializacao',
              'O que faz uma API ser RESTful (recursos no plural, sem verbo na URL)',
              'CORS — por que o navegador bloqueia sua requisicao',
              'Testar API com Postman ou Insomnia',
            ],
            entregavel:
              'Documentar (em markdown) 6 endpoints de uma API fictitia de biblioteca: metodo, rota, body, respostas e status codes.',
            recursos: [
              { tipo: 'doc', titulo: 'MDN — Visao geral do HTTP', url: 'https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Overview' },
              { tipo: 'doc', titulo: 'MDN — Status codes', url: 'https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status' },
            ],
          },
          {
            id: 'base-f2-m2',
            titulo: 'Autenticacao e seguranca basica',
            horas: 6,
            topicos: [
              'Autenticacao vs autorizacao',
              'Sessao com cookie vs token (JWT): quando usar cada um',
              'Estrutura do JWT: header, payload, signature — e por que payload NAO e secreto',
              'Hash de senha com BCrypt (nunca guardar senha em texto puro)',
              'HTTPS e por que credencial nunca vai na URL',
              'OWASP Top 10 — nivel de leitura, sem decorar',
            ],
            entregavel: 'Explicar em 1 pagina, com suas palavras, o fluxo completo de login com JWT.',
            recursos: [
              { tipo: 'doc', titulo: 'JWT — introducao oficial', url: 'https://jwt.io/introduction' },
              { tipo: 'doc', titulo: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' },
            ],
          },
        ],
      },
      {
        id: 'base-f3',
        nome: 'Logica, algoritmos e qualidade',
        objetivo: 'O conteudo que cai em teste tecnico e o que faz seu codigo ser aprovado no code review.',
        modulos: [
          {
            id: 'base-f3-m1',
            titulo: 'Estruturas de dados e complexidade',
            horas: 20,
            topicos: [
              'Array vs lista encadeada — custo de acesso e insercao',
              'Pilha (Stack) e Fila (Queue) — casos de uso reais',
              'Hash Table / Map — o motivo de ser O(1) e quando degrada',
              'Set — deduplicacao',
              'Arvore binaria de busca (conceito) e arvore em geral',
              'Notacao Big-O: O(1), O(log n), O(n), O(n log n), O(n²)',
              'Recursao: caso base, chamada recursiva, stack overflow',
              'Two pointers e sliding window (padroes que mais caem)',
              'Ordenacao: entender bubble/insertion, USAR a da biblioteca padrao',
            ],
            entregavel:
              'Resolver 30 exercicios de logica (LeetCode Easy / Beecrowd) e anotar a complexidade de cada solucao.',
            recursos: [
              { tipo: 'pratica', titulo: 'Beecrowd (antigo URI) — em portugues', url: 'https://judge.beecrowd.com/pt' },
              { tipo: 'pratica', titulo: 'LeetCode — lista Top Interview 150', url: 'https://leetcode.com/studyplan/top-interview-150/' },
              { tipo: 'ref', titulo: 'Big-O Cheat Sheet', url: 'https://www.bigocheatsheet.com/' },
            ],
          },
          {
            id: 'base-f3-m2',
            titulo: 'Clean Code e SOLID',
            horas: 10,
            topicos: [
              'Nomes que explicam a intencao (o maior ganho de todos)',
              'Funcoes pequenas, um nivel de abstracao, poucos parametros',
              'Comentario bom explica POR QUE, nao O QUE',
              'Guard clauses — matar o if aninhado',
              'DRY, KISS, YAGNI — e quando DRY atrapalha',
              'S — Single Responsibility',
              'O — Open/Closed',
              'L — Liskov Substitution',
              'I — Interface Segregation',
              'D — Dependency Inversion (a base da injecao de dependencia do Spring)',
            ],
            entregavel:
              'Pegar um codigo antigo seu e refatorar aplicando 5 principios. Commitar antes e depois para comparar.',
            recursos: [
              { tipo: 'ref', titulo: 'Clean Code — resumo em portugues (GitHub)', url: 'https://github.com/felipefialho/clean-code-javascript-pt-br' },
            ],
          },
          {
            id: 'base-f3-m3',
            titulo: 'Testes automatizados',
            horas: 10,
            topicos: [
              'Piramide de testes: unitario, integracao, e2e',
              'Padrao AAA: Arrange, Act, Assert',
              'O que e um bom nome de teste',
              'Mocks e stubs — testar em isolamento',
              'Cobertura de codigo: util como sinal, pessimo como meta',
              'TDD — o ciclo red / green / refactor',
            ],
            entregavel: 'Uma classe de servico com 100% dos casos de borda cobertos por testes.',
            recursos: [
              { tipo: 'doc', titulo: 'JUnit 5 — guia oficial', url: 'https://junit.org/junit5/docs/current/user-guide/' },
            ],
          },
          {
            id: 'base-f3-m4',
            titulo: 'Trabalhar em time (Agile)',
            horas: 5,
            topicos: [
              'Scrum: papeis, sprint, daily, review, retro',
              'Kanban e limite de WIP',
              'Jira / Azure Boards: card, criterio de aceite, estimativa',
              'Code review: como pedir e como receber critica',
              'Git Flow vs Trunk Based Development',
              'Ingles tecnico — ler documentacao sem traduzir',
            ],
            entregavel: 'Organizar seu proprio projeto de portfolio em um board Kanban com criterios de aceite.',
            recursos: [
              { tipo: 'doc', titulo: 'Scrum Guide (PT-BR)', url: 'https://scrumguides.org/download.html' },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // JAVA + SPRING BOOT
  // =========================================================================
  {
    id: 'java',
    nome: 'Java + Spring Boot',
    area: 'Backend',
    icone: '☕',
    cor: '#e76f00',
    resumo:
      'Trilha principal para backend no mercado brasileiro. Alinhada com o curso do Nelio Alves e estendida ate o nivel que empresas cobram de um junior.',
    fases: [
      {
        id: 'java-f1',
        nome: 'Fundamentos da linguagem',
        objetivo: 'Sintaxe, tipos e estruturas de controle no automatico.',
        modulos: [
          {
            id: 'java-f1-m1',
            titulo: 'Sintaxe, tipos e operadores',
            horas: 10,
            topicos: [
              'JDK, JRE, JVM e bytecode — o que cada um faz',
              'Tipos primitivos e wrappers (int vs Integer, autoboxing)',
              'Casting implicito e explicito',
              'Operadores aritmeticos, relacionais e logicos',
              'Scanner e entrada de dados',
              'Saida formatada: printf, String.format, Locale',
            ],
            entregavel: 'Calculadora de console com as 4 operacoes e saida formatada com 2 casas decimais.',
            recursos: [
              { tipo: 'curso', titulo: 'Curso Java COMPLETO — Nelio Alves (Udemy)', url: 'https://www.udemy.com/course/java-curso-completo/' },
              { tipo: 'doc', titulo: 'Java Tutorials — Oracle', url: 'https://docs.oracle.com/javase/tutorial/' },
            ],
          },
          {
            id: 'java-f1-m2',
            titulo: 'Estruturas de controle',
            horas: 10,
            topicos: [
              'if / else if / else e operador ternario',
              'switch tradicional e switch expression (Java 14+)',
              'while, do-while, for, for-each',
              'break e continue',
              'Escopo de variavel',
              'Debug de laco no IntelliJ',
            ],
            entregavel: 'Menu de console em loop com 5 opcoes, validando entrada invalida sem quebrar.',
            recursos: [],
          },
          {
            id: 'java-f1-m3',
            titulo: 'Arrays e Strings',
            horas: 8,
            topicos: [
              'Array unidimensional e matriz',
              'Percorrer, somar, achar maior/menor, media',
              'String e imutabilidade',
              'Metodos: substring, indexOf, split, trim, replace, equals vs ==',
              'StringBuilder — por que concatenar em loop e ruim',
            ],
            entregavel: 'Programa que le uma frase e devolve: total de palavras, palavra mais longa e frase invertida.',
            recursos: [],
          },
          {
            id: 'java-f1-m4',
            titulo: 'Data e hora (java.time)',
            horas: 8,
            marcoAtual: true,
            topicos: [
              'LocalDate, LocalTime, LocalDateTime — data sem fuso',
              'Instant — instante global (UTC), o tipo certo para gravar no banco',
              'ZonedDateTime e ZoneId — conversao de fuso horario',
              'DateTimeFormatter — parse (texto -> data) e format (data -> texto)',
              'ISO-8601: por que 2026-08-06T14:30:00Z e o padrao das APIs',
              'Calculos: plusDays, minusMonths, withDayOfMonth',
              'Duration (tempo) vs Period (datas) vs ChronoUnit.between',
              'Por que Date e Calendar sao legado e nao devem ser usados',
            ],
            entregavel:
              'Classe utilitaria que calcula idade exata, dias uteis entre duas datas e converte um Instant para o fuso de Sao Paulo.',
            licoes: [
              {
                titulo: 'Por que existem tantos tipos de data',
                explicacao:
                  'A pergunta que resolve 90% da confusao e: "esse momento depende de onde a pessoa esta?". Um aniversario nao depende — 15/03/1998 e 15/03/1998 em qualquer lugar do mundo, entao e LocalDate. O instante em que um pagamento foi processado depende — 14h em Sao Paulo e 19h em Londres, mas e o MESMO instante, entao e Instant. LocalDateTime e o meio-termo perigoso: tem data e hora, mas nenhuma referencia de fuso; serve para "a reuniao e as 14h no horario local de quem abrir", nao para registrar quando algo aconteceu. Regra pratica de backend: o que voce grava no banco como "aconteceu em" e quase sempre Instant.',
                codigo: `// Aniversario: nao tem hora, nao tem fuso
LocalDate nascimento = LocalDate.of(1998, 3, 15);

// Horario comercial: hora sem data e sem fuso
LocalTime abertura = LocalTime.of(9, 0);

// "14h30 do dia 6" — sem dizer 14h30 ONDE
LocalDateTime reuniao = LocalDateTime.of(2026, 8, 6, 14, 30);

// O instante exato em que algo aconteceu, universal
Instant pagamentoEm = Instant.now();

// O mesmo instante, visto de Sao Paulo
ZonedDateTime emSP = pagamentoEm.atZone(ZoneId.of("America/Sao_Paulo"));`,
                erroComum:
                  'Usar LocalDateTime para registrar quando algo aconteceu. Funciona no seu computador e quebra quando o servidor esta em outro fuso, ou no horario de verao. Se e um evento que aconteceu, e Instant.',
                pergunta:
                  'Um usuario em Manaus agenda uma consulta para "10h do dia 20". Voce guarda LocalDateTime ou Instant? E se a clinica for em Sao Paulo? Justifique antes de continuar.',
              },
              {
                titulo: 'Instant, ISO-8601 e o "Z" que voce vai ver em toda API',
                explicacao:
                  'Instant e um ponto na linha do tempo contado a partir de 1970-01-01T00:00:00Z, o epoch. Ele nao tem fuso — ou melhor, ele E sempre UTC. Quando voce ve 2026-08-06T14:30:00Z numa resposta de API, esse formato e o ISO-8601 e o Z significa "Zulu", ou seja, UTC. E o padrao porque nao tem ambiguidade: nao existe "6 de agosto" que possa ser lido como 8 de junho, e nao existe duvida de fuso. Toda API seria que voce vai consumir devolve datas assim, e a sua deve devolver tambem.',
                codigo: `Instant agora = Instant.now();
System.out.println(agora);            // 2026-08-06T17:30:00.123456Z

// Converter para um fuso especifico, para EXIBIR ao usuario
ZoneId sp = ZoneId.of("America/Sao_Paulo");
ZonedDateTime local = agora.atZone(sp);
System.out.println(local);            // 2026-08-06T14:30:00.123456-03:00[America/Sao_Paulo]

// E o caminho de volta
Instant deVolta = local.toInstant();
System.out.println(agora.equals(deVolta));   // true — e o mesmo instante

// Ler uma data que veio de uma API
Instant recebido = Instant.parse("2026-08-06T17:30:00Z");`,
                erroComum:
                  'Achar que converter de fuso "muda o horario". Nao muda: e o mesmo instante, apresentado de outro jeito. Se voce imprimir os dois e comparar com equals(), sao iguais.',
                pergunta:
                  'Se sao 14h30 em Sao Paulo e voce converte para o fuso de Tokyo, o Instant muda? Responda antes de rodar o codigo.',
              },
              {
                titulo: 'Duration vs Period vs ChronoUnit — os tres jeitos de medir tempo',
                explicacao:
                  'Duration mede tempo em unidades exatas: segundos, minutos, horas. Period mede em unidades de calendario: anos, meses, dias. A diferenca importa mais do que parece, porque mes nao tem tamanho fixo e dia nem sempre tem 24 horas (horario de verao). Duration.ofDays(1) e sempre 24 horas cravadas; Period.ofDays(1) e "o mesmo horario do dia seguinte", que pode ser 23 ou 25 horas. ChronoUnit.between e o atalho quando voce quer so um numero: quantos dias, quantos meses, quantos minutos.',
                codigo: `LocalDate inicio = LocalDate.of(2026, 1, 31);
LocalDate fim    = LocalDate.of(2026, 3, 1);

// Period: pensa em calendario
Period p = Period.between(inicio, fim);
System.out.println(p.getMonths() + "m " + p.getDays() + "d");  // 1m 1d

// ChronoUnit: da o numero direto
long dias = ChronoUnit.DAYS.between(inicio, fim);              // 29
long meses = ChronoUnit.MONTHS.between(inicio, fim);           // 1

// Duration: tempo exato, entre instantes
Instant t1 = Instant.parse("2026-08-06T10:00:00Z");
Instant t2 = Instant.parse("2026-08-06T14:30:00Z");
Duration d = Duration.between(t1, t2);
System.out.println(d.toMinutes());                             // 270

// Idade: Period e a ferramenta certa
int idade = Period.between(nascimento, LocalDate.now()).getYears();`,
                erroComum:
                  'Calcular idade com ChronoUnit.DAYS.between(...) / 365. Erra em ano bissexto e em quem nasceu em 29/02. Use Period.between(...).getYears().',
                pergunta:
                  'Por que Duration.between nao aceita dois LocalDate? Pense no que falta para "duracao exata" fazer sentido.',
              },
              {
                titulo: 'DateTimeFormatter: texto vira data, data vira texto',
                explicacao:
                  'Formatter faz os dois caminhos: format() transforma objeto em String para EXIBIR, parse() transforma String em objeto para PROCESSAR. O padrao brasileiro dd/MM/yyyy so deve aparecer na borda do sistema — na tela, no relatorio, no PDF. Por dentro, e entre sistemas, sempre ISO. Atencao ao caso das letras: MM e mes, mm e minuto. Trocar os dois e o bug mais comum do Java inteiro, e ele passa despercebido porque em varios meses os numeros parecem plausiveis.',
                codigo: `DateTimeFormatter BR = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

LocalDateTime dt = LocalDateTime.of(2026, 8, 6, 14, 30);
String exibir = dt.format(BR);                    // "06/08/2026 14:30"

LocalDateTime lido = LocalDateTime.parse("06/08/2026 14:30", BR);

// Texto invalido lanca DateTimeParseException — trate na borda
try {
    LocalDate.parse("31/02/2026", DateTimeFormatter.ofPattern("dd/MM/yyyy"));
} catch (DateTimeParseException e) {
    // 31 de fevereiro nao existe
}

// Com fuso e nome de mes em portugues
DateTimeFormatter EXTENSO = DateTimeFormatter
        .ofPattern("dd 'de' MMMM 'de' yyyy", new Locale("pt", "BR"));`,
                erroComum:
                  'Usar "mm" para mes. "dd/mm/yyyy" te devolve o minuto no lugar do mes. Mes e MM maiusculo; minuto e mm minusculo.',
                pergunta:
                  'Sua API recebe "06/08/2026" de um formulario. Onde exatamente voce faz o parse: no controller, no service ou na entidade? Justifique pela regra de "converter na borda".',
              },
              {
                titulo: 'Por que Date e Calendar sao proibidos em codigo novo',
                explicacao:
                  'O curso mostra Date, Calendar e SimpleDateFormat porque voce VAI encontrar isso em sistema legado, e precisa saber ler. Mas nao escreva codigo novo com eles. Motivos concretos: sao mutaveis, entao qualquer metodo que receba um Date pode alterar o seu objeto sem avisar; SimpleDateFormat nao e thread-safe e corrompe dados silenciosamente sob concorrencia, o que gera bug que so aparece em producao; e o Calendar conta mes a partir de zero, entao janeiro e 0 e dezembro e 11. A API java.time nasceu em 2014 justamente para corrigir tudo isso, e e imutavel por construcao.',
                codigo: `// LEGADO — saiba ler, nao escreva
Calendar c = Calendar.getInstance();
c.set(2026, 7, 6);   // 7 = AGOSTO. Mes comeca em zero.

SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
// Compartilhar este sdf entre threads corrompe a saida

// MODERNO — imutavel, thread-safe, mes e mes
LocalDate d = LocalDate.of(2026, 8, 6);   // 8 = agosto, como voce esperaria
DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy"); // seguro entre threads

// Ponte com codigo legado, quando nao der para evitar
Instant i = new java.util.Date().toInstant();
java.util.Date legado = java.util.Date.from(Instant.now());`,
                erroComum:
                  'Declarar SimpleDateFormat como campo static compartilhado. Parece otimizacao, e na verdade e corrupcao de dados sob concorrencia. DateTimeFormatter pode ser static sem problema.',
                pergunta:
                  'Imutabilidade resolve dois dos tres problemas citados. Quais dois, e por que ela resolve cada um?',
              },
            ],
            recursos: [
              { tipo: 'doc', titulo: 'java.time — javadoc oficial', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/package-summary.html' },
              { tipo: 'artigo', titulo: 'Baeldung — Introduction to Java 8 Date/Time API', url: 'https://www.baeldung.com/java-8-date-time-intro' },
            ],
          },
          {
            id: 'java-f1-m5',
            titulo: 'Metodos e boas praticas iniciais',
            horas: 6,
            topicos: [
              'Assinatura de metodo, parametros, retorno',
              'Passagem por valor (e o que isso significa para objetos)',
              'Sobrecarga (overload)',
              'Metodos static vs de instancia',
              'Quebrar um main gigante em metodos com nome',
            ],
            entregavel: 'Refatorar a calculadora do modulo 1 para que o main tenha no maximo 15 linhas.',
            recursos: [],
          },
        ],
      },
      {
        id: 'java-f2',
        nome: 'Orientacao a Objetos',
        objetivo: 'O coracao do Java. Sem isso, Spring nao faz sentido.',
        modulos: [
          {
            id: 'java-f2-m1',
            titulo: 'Classes, objetos e encapsulamento',
            horas: 12,
            topicos: [
              'Classe vs objeto vs instancia',
              'Atributos, metodos, construtores e sobrecarga de construtor',
              'this — referencia a propria instancia',
              'Modificadores: private, protected, public, default',
              'Getters e setters — e quando NAO criar',
              'Membros static e constantes (static final)',
              'toString, equals e hashCode (o contrato entre eles)',
              'Composicao — objeto que tem outro objeto',
            ],
            entregavel: 'Modelar um sistema de aluguel de veiculos com 4 classes que se relacionam.',
            recursos: [],
          },
          {
            id: 'java-f2-m2',
            titulo: 'Heranca, polimorfismo e abstracao',
            horas: 12,
            topicos: [
              'extends e reuso de comportamento',
              'super — construtor e metodo da superclasse',
              'Sobrescrita (@Override) vs sobrecarga',
              'Polimorfismo: mesma chamada, comportamentos diferentes',
              'Upcasting, downcasting e instanceof',
              'Classes e metodos abstract',
              'final em classe, metodo e variavel',
              'interface — contrato sem implementacao',
              'default methods em interface',
              'Composicao vs heranca — por que preferir composicao',
            ],
            entregavel:
              'Hierarquia de contas bancarias (corrente, poupanca, salario) com regra de saque diferente em cada uma, resolvida por polimorfismo.',
            recursos: [],
          },
          {
            id: 'java-f2-m3',
            titulo: 'Excecoes',
            horas: 8,
            topicos: [
              'try / catch / finally e try-with-resources',
              'Checked vs unchecked exception',
              'throw vs throws',
              'Criar excecoes customizadas de dominio',
              'Stack trace: ler de baixo pra cima e achar a causa raiz',
              'Anti-padroes: catch vazio, catch(Exception e) generico, engolir erro',
            ],
            entregavel: 'Servico de reserva de hotel que lanca excecoes de dominio para datas invalidas.',
            recursos: [
              { tipo: 'artigo', titulo: 'Baeldung — Exception Handling in Java', url: 'https://www.baeldung.com/java-exceptions' },
            ],
          },
          {
            id: 'java-f2-m4',
            titulo: 'Collections e Generics',
            horas: 12,
            topicos: [
              'Generics: <T>, por que existe, type erasure (nocao)',
              'List: ArrayList vs LinkedList',
              'Set: HashSet, LinkedHashSet, TreeSet',
              'Map: HashMap, LinkedHashMap, TreeMap — iterar entrySet',
              'Queue e Deque',
              'Comparable vs Comparator — ordenar objetos',
              'Iterator e ConcurrentModificationException',
              'Collections.unmodifiableList e List.of',
            ],
            entregavel: 'Agenda de contatos em memoria com busca, ordenacao por 2 criterios e remocao.',
            recursos: [],
          },
          {
            id: 'java-f2-m5',
            titulo: 'Lambdas, Streams e Optional',
            horas: 10,
            topicos: [
              'Interface funcional e @FunctionalInterface',
              'Sintaxe lambda e method reference (::)',
              'Function, Predicate, Consumer, Supplier',
              'Stream: filter, map, sorted, distinct, limit',
              'Terminais: collect, forEach, reduce, count, anyMatch',
              'Collectors: toList, joining, groupingBy, partitioningBy',
              'Optional — o fim do NullPointerException defensivo',
              'Quando Stream deixa o codigo PIOR (loop simples continua valido)',
            ],
            entregavel: 'Reescrever 5 laços for da sua agenda usando Streams, sem perder legibilidade.',
            recursos: [
              { tipo: 'artigo', titulo: 'Baeldung — Java 8 Streams', url: 'https://www.baeldung.com/java-8-streams' },
            ],
          },
        ],
      },
      {
        id: 'java-f3',
        nome: 'Java profissional',
        objetivo: 'Sair do "programa de console" e entrar no ecossistema real.',
        modulos: [
          {
            id: 'java-f3-m1',
            titulo: 'Maven e estrutura de projeto',
            horas: 6,
            topicos: [
              'pom.xml: groupId, artifactId, version',
              'Dependencias e escopos (compile, test, provided)',
              'Ciclo de vida: clean, compile, test, package, install',
              'Estrutura padrao src/main/java e src/test/java',
              'Repositorio central e cache local (.m2)',
              'Nocao de Gradle (voce vai ver nas vagas)',
            ],
            entregavel: 'Criar um projeto Maven do zero pelo terminal e gerar um .jar executavel.',
            recursos: [
              { tipo: 'doc', titulo: 'Maven em 5 minutos', url: 'https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html' },
            ],
          },
          {
            id: 'java-f3-m2',
            titulo: 'Testes com JUnit 5 e Mockito',
            horas: 10,
            topicos: [
              '@Test, @BeforeEach, @AfterEach, @DisplayName',
              'Assertions: assertEquals, assertThrows, assertAll',
              '@ParameterizedTest com @ValueSource e @CsvSource',
              'Mockito: @Mock, @InjectMocks, when/thenReturn, verify',
              'Testar excecoes e casos de borda',
              'JaCoCo — medir cobertura',
            ],
            entregavel: 'Suite de testes cobrindo regra de negocio de calculo de juros, incluindo casos invalidos.',
            recursos: [
              { tipo: 'doc', titulo: 'Mockito — documentacao', url: 'https://site.mockito.org/' },
            ],
          },
          {
            id: 'java-f3-m3',
            titulo: 'JDBC e JPA/Hibernate',
            horas: 14,
            topicos: [
              'JDBC puro: Connection, PreparedStatement, ResultSet (entender o que o JPA esconde)',
              'SQL Injection e por que PreparedStatement resolve',
              'ORM: mapear classe para tabela',
              '@Entity, @Table, @Id, @GeneratedValue, @Column',
              'Relacionamentos: @OneToMany, @ManyToOne, @ManyToMany, @OneToOne',
              'Lazy vs Eager e o problema N+1',
              'Cascade e orphanRemoval',
              'JPQL basico',
              'Transacoes e @Transactional',
            ],
            entregavel: 'Modelo de dados de e-commerce (cliente, pedido, item, produto) mapeado e persistindo.',
            recursos: [
              { tipo: 'artigo', titulo: 'Baeldung — JPA/Hibernate guide', url: 'https://www.baeldung.com/learn-jpa-hibernate' },
            ],
          },
        ],
      },
      {
        id: 'java-f4',
        nome: 'Spring Boot',
        objetivo: 'O framework que aparece em praticamente toda vaga Java no Brasil.',
        modulos: [
          {
            id: 'java-f4-m1',
            titulo: 'Fundamentos do Spring',
            horas: 10,
            topicos: [
              'Inversao de Controle e Injecao de Dependencia',
              'Container e ciclo de vida do bean',
              '@Component, @Service, @Repository, @Controller',
              '@Autowired — e por que injecao por construtor e a forma correta',
              '@Configuration e @Bean',
              'Spring Initializr e estrutura do projeto',
              'application.properties / application.yml',
              'Profiles: dev, test, prod',
            ],
            entregavel: 'Projeto Spring Boot rodando com 3 beans injetados por construtor e 2 profiles configurados.',
            recursos: [
              { tipo: 'ferramenta', titulo: 'Spring Initializr', url: 'https://start.spring.io/' },
              { tipo: 'doc', titulo: 'Spring Boot — documentacao', url: 'https://docs.spring.io/spring-boot/index.html' },
            ],
          },
          {
            id: 'java-f4-m2',
            titulo: 'API REST em camadas',
            horas: 14,
            topicos: [
              'Arquitetura: Controller -> Service -> Repository',
              '@RestController, @RequestMapping, @GetMapping, @PostMapping...',
              '@PathVariable, @RequestParam, @RequestBody',
              'ResponseEntity e status code correto em cada operacao',
              'DTO — nunca expor a entidade direto na API',
              'Mapeamento entidade <-> DTO (manual ou MapStruct)',
              'Bean Validation: @NotNull, @NotBlank, @Size, @Email, @Valid',
              '@RestControllerAdvice — tratamento global de excecao',
              'Resposta de erro padronizada (timestamp, status, message, path)',
              'Paginacao e ordenacao com Pageable',
            ],
            entregavel: 'CRUD completo de uma entidade com validacao, DTO, paginacao e erros padronizados.',
            recursos: [
              { tipo: 'guia', titulo: 'Spring — Building a RESTful Web Service', url: 'https://spring.io/guides/gs/rest-service' },
            ],
          },
          {
            id: 'java-f4-m3',
            titulo: 'Spring Data JPA',
            horas: 8,
            topicos: [
              'JpaRepository e os metodos que voce ganha de graca',
              'Query methods por nome (findByNomeContainingIgnoreCase)',
              '@Query com JPQL e nativeQuery',
              'Projections',
              'Flyway ou Liquibase — versionar o banco',
              'H2 em memoria para dev e testes',
            ],
            entregavel: 'Migrar o schema do projeto para Flyway, com 3 migrations versionadas.',
            recursos: [
              { tipo: 'doc', titulo: 'Spring Data JPA — reference', url: 'https://docs.spring.io/spring-data/jpa/reference/' },
            ],
          },
          {
            id: 'java-f4-m4',
            titulo: 'Spring Security e JWT',
            horas: 12,
            topicos: [
              'SecurityFilterChain e configuracao moderna (sem WebSecurityConfigurerAdapter)',
              'PasswordEncoder com BCrypt',
              'UserDetailsService e carregamento do usuario',
              'Autenticacao stateless com JWT',
              'Filtro customizado para validar o token',
              'Autorizacao por role: @PreAuthorize e hasRole',
              'CORS no Spring',
              'Erros 401 vs 403 — retornar o certo',
            ],
            entregavel: 'API com /login que devolve JWT e rotas protegidas por perfil (ADMIN / USER).',
            recursos: [
              { tipo: 'doc', titulo: 'Spring Security — reference', url: 'https://docs.spring.io/spring-security/reference/' },
            ],
          },
          {
            id: 'java-f4-m5',
            titulo: 'Testes e documentacao da API',
            horas: 8,
            topicos: [
              '@SpringBootTest e @WebMvcTest',
              'MockMvc — testar endpoint sem subir servidor',
              '@DataJpaTest para camada de persistencia',
              'Testcontainers (nocao) — banco real no teste',
              'OpenAPI/Swagger com springdoc',
              'Logging com SLF4J e niveis de log',
            ],
            entregavel: 'Swagger UI funcionando e testes de integracao cobrindo os endpoints principais.',
            recursos: [
              { tipo: 'doc', titulo: 'springdoc-openapi', url: 'https://springdoc.org/' },
            ],
          },
        ],
      },
      {
        id: 'java-f5',
        nome: 'Entrega e portfolio',
        objetivo: 'Tirar o projeto do localhost. E aqui que o junior se diferencia.',
        modulos: [
          {
            id: 'java-f5-m1',
            titulo: 'Docker',
            horas: 8,
            topicos: [
              'Imagem vs container vs volume',
              'Dockerfile para app Java (multi-stage build)',
              'docker build, run, ps, logs, exec',
              'docker-compose: app + banco de dados juntos',
              'Variaveis de ambiente e secrets fora do codigo',
            ],
            entregavel: 'docker-compose up sobe sua API + PostgreSQL com um comando so.',
            recursos: [
              { tipo: 'doc', titulo: 'Docker — get started', url: 'https://docs.docker.com/get-started/' },
            ],
          },
          {
            id: 'java-f5-m2',
            titulo: 'CI/CD com GitHub Actions',
            horas: 6,
            topicos: [
              'Workflow, job, step, runner',
              'Pipeline: build + test a cada push',
              'Badge de build no README',
              'Secrets do repositorio',
              'Deploy automatico em ambiente gratuito (Render / Railway / Fly.io)',
            ],
            entregavel: 'Pipeline verde no GitHub rodando os testes em todo push da main.',
            recursos: [
              { tipo: 'doc', titulo: 'GitHub Actions — docs', url: 'https://docs.github.com/pt/actions' },
            ],
          },
          {
            id: 'java-f5-m3',
            titulo: 'Projeto final de portfolio',
            horas: 40,
            topicos: [
              'Escolher um dominio real (nao "todo list"): clinica, oficina, biblioteca, financeiro',
              'Modelar o banco antes de codar',
              'API REST completa com auth, validacao e paginacao',
              'Testes automatizados com cobertura razoavel',
              'Docker + deploy publico com URL acessivel',
              'README profissional: problema, stack, como rodar, print/gif, decisoes tecnicas',
              'Board Kanban publico mostrando o processo',
            ],
            entregavel: 'Um projeto no ar, com URL, README completo e pipeline verde. Vale mais que 10 projetos de curso.',
            recursos: [],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // ANGULAR
  // =========================================================================
  {
    id: 'angular',
    nome: 'Angular',
    area: 'Frontend',
    icone: '🅰️',
    cor: '#dd0031',
    resumo:
      'Framework frontend mais usado em empresas que ja rodam Java no backend (bancos, seguradoras, governo). Combinacao Java + Angular e das mais pedidas no Brasil.',
    fases: [
      {
        id: 'ang-f1',
        nome: 'Pre-requisitos web',
        objetivo: 'Angular nao substitui HTML, CSS e JS — ele monta em cima.',
        modulos: [
          {
            id: 'ang-f1-m1',
            titulo: 'HTML e CSS suficientes',
            horas: 12,
            topicos: [
              'HTML semantico: header, nav, main, section, article, footer',
              'Formularios e acessibilidade (label, for, aria)',
              'CSS: seletores, box model, especificidade',
              'Flexbox — dominar de verdade',
              'CSS Grid — layout de pagina',
              'Media queries e mobile first',
              'Variaveis CSS (custom properties)',
            ],
            entregavel: 'Uma landing page responsiva feita sem framework de CSS.',
            recursos: [
              { tipo: 'pratica', titulo: 'Flexbox Froggy', url: 'https://flexboxfroggy.com/#pt-br' },
              { tipo: 'doc', titulo: 'MDN — CSS', url: 'https://developer.mozilla.org/pt-BR/docs/Web/CSS' },
            ],
          },
          {
            id: 'ang-f1-m2',
            titulo: 'JavaScript moderno',
            horas: 16,
            topicos: [
              'let/const, escopo e hoisting',
              'Arrow functions e this',
              'Destructuring, spread e rest',
              'Template literals',
              'Array: map, filter, reduce, find, some, every',
              'Objetos, optional chaining (?.) e nullish (??)',
              'Modulos: import / export',
              'Assincronismo: callback -> Promise -> async/await',
              'fetch e tratamento de erro',
              'DOM basico (para entender o que o Angular faz por voce)',
            ],
            entregavel: 'App em JS puro que consome uma API publica e renderiza os dados na tela.',
            recursos: [
              { tipo: 'doc', titulo: 'MDN — JavaScript', url: 'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript' },
            ],
          },
          {
            id: 'ang-f1-m3',
            titulo: 'TypeScript',
            horas: 12,
            topicos: [
              'Por que tipagem estatica (vindo de Java, isso vai ser familiar)',
              'Tipos: string, number, boolean, any, unknown, never',
              'Interface vs type alias',
              'Union e intersection types',
              'Generics',
              'Enums e literal types',
              'Classes, modificadores de acesso e implements',
              'Decorators (a base de todo o Angular)',
              'tsconfig e strict mode',
            ],
            entregavel: 'Tipar completamente o app do modulo anterior, com strict mode ligado e zero any.',
            recursos: [
              { tipo: 'doc', titulo: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
            ],
          },
        ],
      },
      {
        id: 'ang-f2',
        nome: 'Angular essencial',
        objetivo: 'Componentes, dados e navegacao.',
        modulos: [
          {
            id: 'ang-f2-m1',
            titulo: 'Componentes e templates',
            horas: 12,
            topicos: [
              'Angular CLI: ng new, ng generate, ng serve, ng build',
              'Estrutura de um componente: .ts, .html, .css',
              'Standalone components (padrao nas versoes atuais)',
              'Interpolacao {{ }} e property binding [prop]',
              'Event binding (click) e two-way binding [(ngModel)]',
              'Diretivas de fluxo: @if / @for (e o antigo *ngIf / *ngFor)',
              'Comunicacao: @Input e @Output com EventEmitter',
              'Ciclo de vida: ngOnInit, ngOnDestroy, ngOnChanges',
              'Pipes prontos e pipe customizado',
            ],
            entregavel: 'Lista de cards com filtro e detalhe, quebrada em pelo menos 4 componentes.',
            recursos: [
              { tipo: 'doc', titulo: 'Angular — documentacao oficial', url: 'https://angular.dev/' },
            ],
          },
          {
            id: 'ang-f2-m2',
            titulo: 'Services, DI e HttpClient',
            horas: 10,
            topicos: [
              'Service com @Injectable e providedIn: root',
              'Injecao de dependencia no Angular (mesmo conceito do Spring)',
              'HttpClient: get, post, put, delete',
              'Tipar a resposta com interface',
              'Interceptors: anexar token JWT e tratar erro global',
              'Consumir a SUA API Spring Boot (integracao real)',
              'environment.ts — URL da API por ambiente',
            ],
            entregavel: 'Frontend Angular consumindo a API Java que voce construiu, com login por JWT.',
            recursos: [],
          },
          {
            id: 'ang-f2-m3',
            titulo: 'Rotas e formularios',
            horas: 12,
            topicos: [
              'RouterModule, rotas, routerLink e router-outlet',
              'Parametros de rota e query params',
              'Lazy loading de rotas',
              'Guards: proteger rota por autenticacao/role',
              'Template-driven forms (formularios simples)',
              'Reactive Forms: FormGroup, FormControl, FormBuilder',
              'Validators prontos e validator customizado',
              'Exibir mensagem de erro por campo',
            ],
            entregavel: 'Area logada com rotas protegidas e formulario de cadastro com validacao completa.',
            recursos: [],
          },
        ],
      },
      {
        id: 'ang-f3',
        nome: 'Angular avancado',
        objetivo: 'O que faz diferenca em code review e entrevista.',
        modulos: [
          {
            id: 'ang-f3-m1',
            titulo: 'RxJS e Signals',
            horas: 12,
            topicos: [
              'Observable vs Promise',
              'subscribe e — importante — unsubscribe (vazamento de memoria)',
              'Operadores: map, filter, tap, switchMap, mergeMap, catchError, debounceTime',
              'Subject e BehaviorSubject (estado compartilhado)',
              'async pipe — a forma preferida de consumir Observable',
              'Signals: signal, computed, effect (API moderna do Angular)',
              'Quando usar Signal e quando usar RxJS',
            ],
            entregavel: 'Campo de busca com debounce + switchMap que cancela requisicoes anteriores.',
            recursos: [
              { tipo: 'ref', titulo: 'RxJS — operadores (learnrxjs)', url: 'https://www.learnrxjs.io/' },
            ],
          },
          {
            id: 'ang-f3-m2',
            titulo: 'UI, testes e build',
            horas: 12,
            topicos: [
              'Angular Material ou PrimeNG — componentes de mercado',
              'Layout responsivo e tema',
              'Testes com Jasmine e Karma: TestBed, spy',
              'Testar componente e service isoladamente',
              'ChangeDetectionStrategy.OnPush — performance',
              'ng build --configuration production e analise de bundle',
              'Deploy na Vercel / Netlify / S3',
            ],
            entregavel: 'App Angular publicado com URL publica e testes passando no CI.',
            recursos: [
              { tipo: 'doc', titulo: 'Angular Material', url: 'https://material.angular.io/' },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // BANCO DE DADOS
  // =========================================================================
  {
    id: 'db',
    nome: 'Banco de Dados',
    area: 'Dados',
    icone: '🗄️',
    cor: '#22a06b',
    resumo:
      'A parte que MAIS reprova junior em entrevista tecnica. SQL cai em praticamente todo processo seletivo de backend.',
    fases: [
      {
        id: 'db-f1',
        nome: 'Modelagem e SQL',
        objetivo: 'Sair do "sei fazer SELECT *" para modelar e consultar de verdade.',
        modulos: [
          {
            id: 'db-f1-m1',
            titulo: 'Modelagem relacional',
            horas: 10,
            topicos: [
              'Entidade, atributo e relacionamento (modelo ER)',
              'Chave primaria, chave estrangeira e chave composta',
              'Cardinalidade: 1:1, 1:N, N:N (e a tabela associativa)',
              'Normalizacao: 1FN, 2FN, 3FN',
              'Quando desnormalizar de proposito',
              'Tipos de dados e a escolha certa (VARCHAR vs TEXT, DECIMAL vs FLOAT para dinheiro)',
              'Diagramar no dbdiagram.io ou DBeaver',
            ],
            entregavel: 'Diagrama ER de um sistema de clinica medica, normalizado ate 3FN.',
            recursos: [
              { tipo: 'ferramenta', titulo: 'dbdiagram.io', url: 'https://dbdiagram.io/' },
            ],
          },
          {
            id: 'db-f1-m2',
            titulo: 'SQL — DDL e DML',
            horas: 12,
            topicos: [
              'CREATE / ALTER / DROP TABLE, constraints (NOT NULL, UNIQUE, CHECK, DEFAULT)',
              'INSERT, UPDATE, DELETE (e o perigo do WHERE esquecido)',
              'SELECT, WHERE, operadores, LIKE, IN, BETWEEN, IS NULL',
              'ORDER BY, LIMIT/OFFSET, DISTINCT',
              'Funcoes de string, data e numero',
              'CASE WHEN',
              'COALESCE e tratamento de NULL',
            ],
            entregavel: 'Script SQL que cria e popula o banco da clinica com dados coerentes.',
            recursos: [
              { tipo: 'pratica', titulo: 'SQLBolt — exercicios interativos', url: 'https://sqlbolt.com/' },
            ],
          },
          {
            id: 'db-f1-m3',
            titulo: 'Consultas que caem em entrevista',
            horas: 14,
            topicos: [
              'INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN — desenhar o diagrama mentalmente',
              'Self join',
              'Agregacoes: COUNT, SUM, AVG, MIN, MAX',
              'GROUP BY e HAVING (e a diferenca para WHERE)',
              'Subqueries no SELECT, FROM e WHERE',
              'EXISTS vs IN',
              'CTE (WITH) — deixar consulta complexa legivel',
              'Window functions: ROW_NUMBER, RANK, LAG/LEAD, SUM OVER',
              'UNION vs UNION ALL',
            ],
            entregavel:
              'Resolver 20 desafios de SQL nivel entrevista (2o maior salario, N por grupo, duplicados, ranking).',
            recursos: [
              { tipo: 'pratica', titulo: 'LeetCode — SQL 50', url: 'https://leetcode.com/studyplan/top-sql-50/' },
              { tipo: 'pratica', titulo: 'HackerRank — SQL', url: 'https://www.hackerrank.com/domains/sql' },
            ],
          },
        ],
      },
      {
        id: 'db-f2',
        nome: 'Banco em producao',
        objetivo: 'O que voce vai encontrar na empresa, nao no curso.',
        modulos: [
          {
            id: 'db-f2-m1',
            titulo: 'Transacoes, indices e performance',
            horas: 12,
            topicos: [
              'ACID: atomicidade, consistencia, isolamento, durabilidade',
              'BEGIN / COMMIT / ROLLBACK',
              'Niveis de isolamento e problemas: dirty read, phantom read',
              'Deadlock — o que e e como evitar',
              'Indice: como funciona (B-tree), quando ajuda e quando atrapalha',
              'Indice composto e ordem das colunas',
              'EXPLAIN / EXPLAIN ANALYZE — ler plano de execucao',
              'Full table scan vs index scan',
              'Problema N+1 vindo do ORM — identificar pelo log de SQL',
            ],
            entregavel:
              'Pegar uma consulta lenta, rodar EXPLAIN, criar o indice certo e documentar o antes/depois em ms.',
            recursos: [
              { tipo: 'ref', titulo: 'Use The Index, Luke!', url: 'https://use-the-index-luke.com/' },
            ],
          },
          {
            id: 'db-f2-m2',
            titulo: 'PostgreSQL na pratica',
            horas: 8,
            topicos: [
              'Instalar via Docker e conectar com DBeaver',
              'psql — comandos basicos',
              'Tipos do Postgres: SERIAL, UUID, JSONB, ARRAY',
              'Views e materialized views',
              'Stored procedures e triggers (nocao — saber que existe e o custo)',
              'Backup e restore (pg_dump / pg_restore)',
              'Usuarios e permissoes (GRANT)',
            ],
            entregavel: 'Postgres rodando em Docker com backup e restore testados de verdade.',
            recursos: [
              { tipo: 'doc', titulo: 'PostgreSQL — documentacao', url: 'https://www.postgresql.org/docs/current/' },
            ],
          },
          {
            id: 'db-f2-m3',
            titulo: 'NoSQL — nocoes',
            horas: 6,
            topicos: [
              'Relacional vs NoSQL: quando cada um faz sentido',
              'Teorema CAP (nivel conceitual)',
              'MongoDB: documento, colecao, CRUD basico',
              'Redis: cache, TTL, chave-valor',
              'Por que cache resolve e por que cria bug de dado velho',
            ],
            entregavel: 'Adicionar cache Redis a um endpoint da sua API e medir o ganho.',
            recursos: [],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // AWS / CLOUD
  // =========================================================================
  {
    id: 'aws',
    nome: 'AWS & Cloud',
    area: 'Infra',
    icone: '☁️',
    cor: '#ff9900',
    resumo:
      'Diferencial forte para junior. Nao precisa ser especialista: precisa saber colocar sua aplicacao no ar e falar a lingua da nuvem.',
    fases: [
      {
        id: 'aws-f1',
        nome: 'Fundamentos da nuvem',
        objetivo: 'Entender o modelo antes de sair clicando no console.',
        modulos: [
          {
            id: 'aws-f1-m1',
            titulo: 'Conceitos e conta',
            horas: 8,
            topicos: [
              'IaaS, PaaS, SaaS',
              'Regiao, Availability Zone e Edge Location',
              'Modelo de responsabilidade compartilhada',
              'Free Tier — e como NAO tomar susto na fatura',
              'Billing alarm e AWS Budgets (fazer isso no PRIMEIRO dia)',
              'Console vs AWS CLI',
            ],
            entregavel: 'Conta criada, MFA ativado e alarme de custo configurado em US$ 5.',
            recursos: [
              { tipo: 'curso', titulo: 'AWS Skill Builder — Cloud Practitioner Essentials', url: 'https://explore.skillbuilder.aws/' },
            ],
          },
          {
            id: 'aws-f1-m2',
            titulo: 'IAM — identidade e acesso',
            horas: 6,
            topicos: [
              'Usuario, grupo, role e policy',
              'Principio do menor privilegio',
              'Nunca usar a conta root no dia a dia',
              'Access key — riscos e rotacao',
              'Role para servico (EC2/Lambda acessando S3 sem credencial no codigo)',
            ],
            entregavel: 'Um usuario IAM sem privilegio de admin, com policy escrita por voce.',
            recursos: [
              { tipo: 'doc', titulo: 'AWS IAM — user guide', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html' },
            ],
          },
        ],
      },
      {
        id: 'aws-f2',
        nome: 'Servicos essenciais',
        objetivo: 'Os servicos que aparecem em vaga de backend junior.',
        modulos: [
          {
            id: 'aws-f2-m1',
            titulo: 'Computacao e rede',
            horas: 12,
            topicos: [
              'EC2: instancia, AMI, tipo, key pair, security group',
              'Conectar por SSH e subir um .jar manualmente',
              'VPC: subnet publica vs privada, route table, internet gateway',
              'Security Group vs NACL',
              'Elastic Load Balancer e Auto Scaling (conceito)',
              'Elastic Beanstalk — o caminho mais rapido para deploy Java',
            ],
            entregavel: 'Sua API Spring Boot rodando em uma EC2, acessivel pela internet.',
            recursos: [],
          },
          {
            id: 'aws-f2-m2',
            titulo: 'Armazenamento e banco',
            horas: 10,
            topicos: [
              'S3: bucket, objeto, classes de armazenamento',
              'Hospedar site estatico no S3 (seu Angular pode morar aqui)',
              'Pre-signed URL para upload seguro',
              'RDS: PostgreSQL/MySQL gerenciado, backup automatico, multi-AZ',
              'Conectar a aplicacao ao RDS',
              'DynamoDB — nocao de NoSQL gerenciado',
              'Secrets Manager / Parameter Store — tirar senha do application.properties',
            ],
            entregavel: 'App em EC2 conectando em RDS, com a senha vindo do Secrets Manager.',
            recursos: [],
          },
          {
            id: 'aws-f2-m3',
            titulo: 'Serverless e containers',
            horas: 10,
            topicos: [
              'Lambda: funcao, trigger, cold start, limites',
              'API Gateway + Lambda — API sem servidor',
              'SQS (fila) e SNS (notificacao) — desacoplar servicos',
              'ECR: registrar sua imagem Docker',
              'ECS Fargate — rodar container sem gerenciar servidor',
              'Quando serverless NAO vale a pena',
            ],
            entregavel: 'Uma Lambda que processa mensagem de uma fila SQS e grava no S3.',
            recursos: [],
          },
          {
            id: 'aws-f2-m4',
            titulo: 'Observabilidade e custo',
            horas: 6,
            topicos: [
              'CloudWatch Logs — encontrar o erro da sua aplicacao',
              'Metricas e alarmes',
              'CloudTrail — auditoria de quem fez o que',
              'Cost Explorer e tags de custo',
              'Infra como codigo: nocao de CloudFormation / Terraform',
            ],
            entregavel: 'Alarme que dispara quando sua aplicacao registra 5 erros 500 em 5 minutos.',
            recursos: [],
          },
        ],
      },
      {
        id: 'aws-f3',
        nome: 'Certificacao (opcional, mas pesa no curriculo)',
        objetivo: 'Um selo que abre triagem de RH.',
        modulos: [
          {
            id: 'aws-f3-m1',
            titulo: 'AWS Certified Cloud Practitioner (CLF-C02)',
            horas: 25,
            topicos: [
              'Dominio 1: conceitos de nuvem',
              'Dominio 2: seguranca e conformidade',
              'Dominio 3: tecnologia e servicos',
              'Dominio 4: cobranca, precos e suporte',
              'Simulados — meta de 85%+ antes de agendar',
              'Agendar e fazer a prova',
            ],
            entregavel: 'Certificacao CLF-C02 aprovada e adicionada ao LinkedIn.',
            recursos: [
              { tipo: 'doc', titulo: 'Guia oficial do exame CLF-C02', url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/' },
            ],
          },
        ],
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const getTrilha = (id) => TRILHAS.find((t) => t.id === id)

export function todosModulos(trilha) {
  return trilha.fases.flatMap((f) => f.modulos.map((m) => ({ ...m, faseId: f.id, faseNome: f.nome, trilhaId: trilha.id })))
}

export function todosTopicosIds(trilha) {
  return todosModulos(trilha).flatMap((m) => m.topicos.map((_, i) => `${m.id}:${i}`))
}

export function horasTrilha(trilha) {
  return todosModulos(trilha).reduce((acc, m) => acc + m.horas, 0)
}
