// ---------------------------------------------------------------------------
// TRILHA DE INGLES
// ---------------------------------------------------------------------------
// Fica em arquivo separado porque e grande e porque tem uma natureza diferente
// das outras: ingles NAO e uma fase que voce termina antes do Java. E habito
// diario e paralelo. Por isso ela nao entra na sequencia do plano — ela e
// agendada no Cronograma, todo dia, em bloco curto.
//
// 20 minutos por dia batem 3 horas no sabado. Idioma e frequencia, nao volume.
// ---------------------------------------------------------------------------

export const TRILHA_INGLES = {
  id: 'ingles',
  nome: 'Ingles',
  area: 'Idioma',
  icone: '🇬🇧',
  cor: '#3b82f6',
  paralela: true, // nao entra na ordem sequencial do plano
  resumo:
    'Do zero ao ingles de trabalho. Ler documentacao sem traduzir, escrever PR e code review, e sustentar uma conversa tecnica. E o que separa vaga de R$ 4 mil de vaga de R$ 12 mil no mesmo nivel tecnico.',
  fases: [
    // =====================================================================
    {
      id: 'en-f1',
      nome: 'Fundamentos (A1–A2)',
      objetivo: 'Montar frase correta sem traduzir do portugues palavra por palavra.',
      modulos: [
        {
          id: 'en-f1-m1',
          titulo: 'Verbo to be, pronomes e artigos',
          horas: 8,
          topicos: [
            'Pronomes pessoais: I, you, he, she, it, we, they',
            'To be no presente: am / is / are — afirmativa, negativa, interrogativa',
            'Contracoes: I’m, you’re, isn’t, aren’t',
            'Artigos a / an / the — e quando NAO usar artigo',
            'There is / there are',
            'Possessivos: my, your, his, her + genitivo com ’s',
            'Ordem da frase em ingles: sujeito + verbo + objeto (sem sujeito oculto)',
          ],
          entregavel: 'Escrever 10 frases sobre voce e seu trabalho, sem consultar tradutor.',
          licoes: [
            {
              titulo: 'O erro numero 1 do brasileiro: sujeito oculto',
              explicacao:
                'Em portugues voce diz "Sou desenvolvedor" e ninguem estranha — o sujeito fica implicito no verbo. Em ingles isso e agramatical: a frase PRECISA de sujeito explicito, sempre. "Am developer" nao existe; e "I am a developer". O mesmo vale para o "it" em frases sobre clima, hora e situacoes gerais: "Esta chovendo" vira "It is raining", com um "it" que nao traduz para nada em portugues. Se voce internalizar so isso nesta fase, ja elimina metade dos seus erros.',
              codigo: `❌ Am a backend developer.        ✅ I am a backend developer.
❌ Is raining.                    ✅ It is raining.
❌ Have 25 years.                 ✅ I am 25 years old.
❌ Is very important test code.   ✅ It is very important to test code.

// Artigo: portugues usa, ingles nao (profissao no plural / geral)
❌ The developers must write the tests.
✅ Developers must write tests.        (regra geral, sem artigo)
✅ The developers on my team wrote the tests.   (grupo especifico)`,
              erroComum:
                '"I have 25 years" — traducao literal de "tenho 25 anos". Em ingles idade e um estado, nao posse: "I am 25 years old".',
              pergunta:
                'Traduza sem tradutor: "Faz frio hoje" e "Preciso estudar mais". Onde entra o sujeito que o portugues escondeu?',
            },
          ],
          recursos: [
            { tipo: 'ref', titulo: 'British Council — Grammar A1', url: 'https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar' },
          ],
        },
        {
          id: 'en-f1-m2',
          titulo: 'Present simple e present continuous',
          horas: 8,
          topicos: [
            'Present simple: rotina, fato, verdade geral',
            'O -s da terceira pessoa (he works, she runs) — o erro mais denunciado',
            'Auxiliares do / does na negativa e na pergunta',
            'Present continuous: acontecendo agora ou temporario',
            'Verbos que nao usam continuous (know, want, need, like, believe)',
            'Adverbios de frequencia: always, usually, often, sometimes, never',
            'Diferenca pratica: "I work" vs "I am working"',
          ],
          entregavel: 'Descrever sua rotina de estudos em 8 frases, alternando os dois tempos corretamente.',
          licoes: [
            {
              titulo: 'I work vs I am working: rotina contra agora',
              explicacao:
                'Present simple e para o que e sempre verdade: sua profissao, sua rotina, um fato. Present continuous e para o que esta acontecendo neste momento ou numa fase temporaria. A confusao acontece porque o portugues usa "estou trabalhando" nos dois casos com naturalidade. Um detalhe que vale ouro em entrevista: alguns verbos, chamados stative, quase nunca vao para o continuous — know, want, need, understand, like, believe. Dizer "I am knowing" soa tao errado quanto "eu estou sabendo" soaria estranho num relatorio formal.',
              codigo: `// ROTINA / FATO — present simple
I work with Java.                    (minha profissao)
The API returns a 404 when not found. (comportamento do sistema)
He deploys every Friday.              (rotina — atencao ao -s)

// AGORA / TEMPORARIO — present continuous
I am working on the payment feature.  (nesta sprint)
The build is failing.                 (agora, nao sempre)
I am studying Spring this month.      (fase temporaria)

// STATIVE — nao vao para o continuous
❌ I am knowing the answer.   ✅ I know the answer.
❌ I am needing help.         ✅ I need help.`,
              erroComum:
                'Esquecer o -s da terceira pessoa: "he work" em vez de "he works". E o erro que mais rapido denuncia nivel basico, e some com repeticao consciente.',
              pergunta:
                'Na daily, voce vai falar do que fez ontem e do que esta fazendo hoje. Qual tempo verbal em cada parte?',
            },
          ],
          recursos: [],
        },
        {
          id: 'en-f1-m3',
          titulo: 'Passado: simple past e past continuous',
          horas: 8,
          topicos: [
            'Verbos regulares: -ed e as tres pronuncias (/t/, /d/, /ɪd/)',
            'Verbos irregulares: os 50 mais usados',
            'Did / didn’t — e por que o verbo volta ao infinitivo depois deles',
            'Past continuous: was / were + -ing',
            'Combinando: "I was coding when the server crashed"',
            'Marcadores de tempo: yesterday, last week, ago, in 2020',
          ],
          entregavel: 'Contar em 6 frases um bug que voce resolveu, no passado.',
          recursos: [],
        },
        {
          id: 'en-f1-m4',
          titulo: 'Futuro e modais essenciais',
          horas: 7,
          topicos: [
            'Will: decisao no momento, previsao, promessa',
            'Going to: plano ja definido, evidencia clara',
            'Present continuous com valor de futuro ("I’m meeting the team at 3")',
            'Can / could — habilidade e pedido educado',
            'Should — conselho e recomendacao tecnica',
            'Must / have to — obrigacao',
            'May / might — possibilidade',
          ],
          entregavel: 'Escrever 5 recomendacoes tecnicas usando should, must e might.',
          recursos: [],
        },
        {
          id: 'en-f1-m5',
          titulo: 'Numeros, datas e vocabulario de base',
          horas: 6,
          topicos: [
            'Numeros grandes, decimais e porcentagem em voz alta',
            'Datas no formato americano e britanico (a confusao 03/04)',
            'Horas: a.m., p.m., quarter past, half past',
            'Vocabulario de escritorio e reuniao',
            'Preposicoes de tempo: in / on / at',
            'Preposicoes de lugar: in / on / at',
          ],
          entregavel: 'Ler em voz alta 10 numeros e datas de uma documentacao real.',
          recursos: [],
        },
      ],
    },

    // =====================================================================
    {
      id: 'en-f2',
      nome: 'Intermediario (B1)',
      objetivo: 'Sair do "eu entendo mas nao falo". Aqui mora o ingles de trabalho.',
      modulos: [
        {
          id: 'en-f2-m1',
          titulo: 'Present perfect — o tempo que nao existe em portugues',
          horas: 10,
          topicos: [
            'Have / has + particípio passado',
            'Experiencia de vida sem data: "I have worked with Java"',
            'Acao que comecou no passado e continua: "I have worked here for 3 years"',
            'For vs since',
            'Already, just, yet, ever, never',
            'Present perfect vs simple past — a regra da data definida',
            'Present perfect continuous: enfase na duracao',
          ],
          entregavel: 'Escrever seu resumo profissional em ingles usando present perfect corretamente.',
          licoes: [
            {
              titulo: 'A regra que resolve 90% dos casos: existe data definida?',
              explicacao:
                'Este e o tempo verbal que mais trava brasileiro, porque o portugues nao tem equivalente direto. A regra pratica: se a frase tem um momento definido no passado — yesterday, last year, in 2023, when I was at X — use simple past. Se nao tem, e a acao se conecta ao presente (experiencia acumulada, ou algo que ainda continua), use present perfect. "I have worked with Spring" quer dizer "ja trabalhei, tenho essa experiencia, ela vale agora". "I worked with Spring in 2023" e um fato encerrado naquele ano. Em entrevista essa diferenca comunica se voce ainda tem a habilidade ou se ela ficou no passado.',
              codigo: `// SEM data definida, conecta ao presente → present perfect
I have worked with Spring Boot.          (tenho essa experiencia)
I have never used Kotlin.                (ate hoje, nunca)
Have you ever deployed to AWS?           (em algum momento da vida?)
I have been studying Java for 8 months.  (comecei e continuo)

// COM data definida → simple past
I worked with Spring Boot in 2024.       (encerrado)
I deployed it yesterday.                 (momento definido)
❌ I have deployed it yesterday.          (erro classico)

// FOR = duracao | SINCE = ponto de partida
I have studied here for 8 months.        (quanto tempo)
I have studied here since January.       (desde quando)`,
              erroComum:
                'Usar present perfect com "yesterday", "last week" ou "in 2023". Se ha data definida, o tempo e simple past — sem excecao.',
              pergunta:
                'O recrutador pergunta "How long have you been studying Java?". Por que ele usou present perfect continuous, e nao simple past?',
            },
          ],
          recursos: [],
        },
        {
          id: 'en-f2-m2',
          titulo: 'Condicionais',
          horas: 8,
          topicos: [
            'Zero conditional: verdade sempre ("If you push, CI runs")',
            'First conditional: possibilidade real futura',
            'Second conditional: hipotese improvavel ou imaginaria',
            'Third conditional: arrependimento sobre o passado',
            'Mixed conditional: passado que afeta o presente',
            'Unless, in case, as long as',
          ],
          entregavel: 'Escrever um post-mortem tecnico curto usando third conditional.',
          recursos: [],
        },
        {
          id: 'en-f2-m3',
          titulo: 'Voz passiva',
          horas: 6,
          topicos: [
            'Estrutura: be + particípio',
            'Por que documentacao tecnica vive em passiva',
            'Passiva em todos os tempos verbais',
            'Quando a passiva esconde responsabilidade (e quando isso e proposital)',
            'Get passive informal: "it got deployed"',
          ],
          entregavel: 'Reescrever 10 frases de uma documentacao da ativa para a passiva e vice-versa.',
          recursos: [],
        },
        {
          id: 'en-f2-m4',
          titulo: 'Reported speech e perguntas indiretas',
          horas: 6,
          topicos: [
            'Mudanca de tempo verbal ao relatar',
            'Say vs tell',
            'Perguntas indiretas: "Could you tell me where the logs are?"',
            'Relatar decisoes de reuniao',
          ],
          entregavel: 'Escrever a ata de uma reuniao ficticia relatando 5 falas.',
          recursos: [],
        },
        {
          id: 'en-f2-m5',
          titulo: 'Phrasal verbs de verdade',
          horas: 8,
          topicos: [
            'Por que phrasal verb muda tudo: look up vs look after vs look into',
            'Os 40 mais usados no dia a dia',
            'Phrasal verbs de tecnologia: roll out, roll back, spin up, shut down, back up',
            'Set up, break down, figure out, come up with, run into',
            'Separaveis vs inseparaveis',
          ],
          entregavel: 'Usar 15 phrasal verbs em frases do seu contexto de trabalho.',
          recursos: [],
        },
        {
          id: 'en-f2-m6',
          titulo: 'Preposicoes e collocations',
          horas: 7,
          topicos: [
            'Depend ON, interested IN, good AT, responsible FOR',
            'Collocations: make a decision, take responsibility, do research',
            'Preposicoes tecnicas: deploy TO, merge INTO, commit TO, connect TO',
            'Por que decorar collocation vale mais que decorar palavra solta',
          ],
          entregavel: 'Lista pessoal de 30 collocations do seu contexto, revisada semanalmente.',
          recursos: [],
        },
      ],
    },

    // =====================================================================
    {
      id: 'en-f3',
      nome: 'Avancado (B2–C1)',
      objetivo: 'Soar natural, nao apenas correto.',
      modulos: [
        {
          id: 'en-f3-m1',
          titulo: 'Estruturas complexas',
          horas: 8,
          topicos: [
            'Relative clauses: who, which, that, whose — defining vs non-defining',
            'Reduced relative clauses ("the service handling payments")',
            'Participle clauses',
            'Inversao para enfase ("Not only does it fail, it also...")',
            'Cleft sentences ("What we need is...")',
          ],
          entregavel: 'Reescrever 10 frases simples suas em versoes mais densas e naturais.',
          recursos: [],
        },
        {
          id: 'en-f3-m2',
          titulo: 'Registro: formal, neutro e informal',
          horas: 6,
          topicos: [
            'Email formal vs mensagem no Slack',
            'Hedging: como discordar sem soar agressivo',
            '"I think we should" vs "We must" vs "It might be worth"',
            'Polidez anglo-saxa: o excesso de "could you possibly"',
            'Direct vs indirect communication entre culturas',
          ],
          entregavel: 'Escrever a mesma mensagem em 3 registros: Slack, email ao time e email ao cliente.',
          recursos: [],
        },
        {
          id: 'en-f3-m3',
          titulo: 'Idioms e expressoes naturais do trabalho',
          horas: 6,
          topicos: [
            'Low-hanging fruit, moving parts, edge case, corner case',
            'On the same page, circle back, touch base, deep dive',
            'Bandwidth, blocker, bottleneck, technical debt',
            'Ballpark figure, quick win, nice to have',
            'Quando idiom ajuda e quando atrapalha a clareza',
          ],
          entregavel: 'Glossario pessoal de 30 expressoes ouvidas em videos e podcasts reais.',
          recursos: [],
        },
      ],
    },

    // =====================================================================
    {
      id: 'en-f4',
      nome: 'Ingles tecnico para devs',
      objetivo: 'Ler doc sem traduzir e escrever como o time internacional escreve.',
      modulos: [
        {
          id: 'en-f4-m1',
          titulo: 'Ler documentacao sem traduzir',
          horas: 8,
          topicos: [
            'Leitura por varredura: achar a resposta sem ler tudo',
            'Vocabulario de doc: deprecated, thread-safe, immutable, overload, retrieve',
            'Estrutura tipica de um javadoc e de um RFC',
            'Ler stack trace e mensagem de erro em ingles',
            'Ler issue e discussao no GitHub',
            'Parar de instalar traducao automatica — o custo de longo prazo',
          ],
          entregavel: 'Ler a doc oficial de java.time inteira em ingles e resumir em portugues, sem tradutor.',
          licoes: [
            {
              titulo: 'Traduzir e a muleta que te mantem no basico',
              explicacao:
                'Toda vez que voce traduz, cria um passo intermediario: ingles → portugues → entendimento. Isso e lento, e a traducao automatica erra justamente onde importa, no vocabulario tecnico. "Deprecated" nao e "depreciado" no sentido contabil — quer dizer que ainda funciona mas nao deve ser usado e vai sumir. Ler direto em ingles e desconfortavel nas primeiras semanas e depois vira automatico. Regra pratica: leia o paragrafo inteiro antes de procurar qualquer palavra; a maioria voce deduz pelo contexto, e as que sobrarem sao as que realmente valem anotar.',
              codigo: `// Vocabulario que aparece em TODA documentacao Java
deprecated      → ainda existe, nao use, vai ser removido
thread-safe     → pode ser usado por varias threads sem corromper
immutable       → nao muda depois de criado
overload        → mesmo nome, parametros diferentes
override        → redefinir na subclasse
retrieve        → obter, buscar
invoke          → chamar (um metodo)
throw / raise   → lancar (uma excecao)
handle          → tratar
enforce         → garantir que a regra seja cumprida
edge case       → caso de borda
trade-off       → escolha entre duas coisas boas
underlying      → subjacente, "por baixo"
regardless of   → independentemente de
unless          → a menos que  ← inverte o sentido, cuidado`,
              erroComum:
                'Ler com o Google Tradutor ligado na pagina. Voce entende o texto de hoje e continua sem entender o de amanha.',
              pergunta:
                'Sem tradutor: o que significa "This method is not thread-safe unless the underlying map is synchronized"? Repare no "unless".',
            },
          ],
          recursos: [
            { tipo: 'doc', titulo: 'Java API docs (em ingles, de proposito)', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/index.html' },
          ],
        },
        {
          id: 'en-f4-m2',
          titulo: 'Escrever: commit, PR, issue e code review',
          horas: 8,
          topicos: [
            'Commit message: imperativo, presente ("Add validation", nao "Added")',
            'Conventional Commits em ingles',
            'Descricao de PR: contexto, mudanca, como testar',
            'Escrever issue: passos para reproduzir, esperado vs obtido',
            'Comentario de code review sem soar rude',
            'Nitpick, LGTM, WIP, PTAL, IMO, TL;DR',
          ],
          entregavel: 'Reescrever todos os commits e o README do seu projeto em ingles.',
          licoes: [
            {
              titulo: 'Code review em ingles sem soar grosso',
              explicacao:
                'Times internacionais usam uma linguagem bem mais indireta que a brasileira em revisao de codigo. Escrever "This is wrong" e tecnicamente correto e socialmente caro. A convencao e transformar critica em pergunta ou sugestao, e sinalizar a gravidade: um comentario com "nit:" avisa que e detalhe e nao bloqueia o merge. Isso nao e frescura — e o que faz um dev remoto brasileiro ser convidado de volta para o proximo projeto.',
              codigo: `// ❌ Direto demais para a cultura de review em ingles
This is wrong.
You forgot the null check.
Why did you do it this way?

// ✅ Mesma mensagem, tom colaborativo
Could we handle the null case here? It might throw an NPE if the user has no address.
What do you think about extracting this into a separate method?
I might be missing context — what was the reason for this approach?

// Sinalizando gravidade
nit: missing space here (nao bloqueia)
suggestion: we could use Optional here to make it explicit
blocking: this breaks the contract with the payment service
question: does this handle the retry case?

// Aprovando
LGTM (Looks Good To Me)
LGTM with minor comments
Nice catch on the edge case!`,
              erroComum:
                'Traduzir literalmente o jeito brasileiro de falar. "Tá errado isso aqui" vira "This is wrong", que em review escrito soa muito mais duro do que voce pretendia.',
              pergunta:
                'Voce viu um bug real que quebra producao. Como escreve o comentario deixando claro que bloqueia, sem soar agressivo?',
            },
          ],
          recursos: [
            { tipo: 'ref', titulo: 'Conventional Commits', url: 'https://www.conventionalcommits.org/en/v1.0.0/' },
          ],
        },
        {
          id: 'en-f4-m3',
          titulo: 'Comunicacao assincrona',
          horas: 6,
          topicos: [
            'Daily escrita: yesterday / today / blockers',
            'Pedir ajuda com contexto suficiente',
            'Avisar atraso sem se desculpar demais',
            'Escrever documentacao tecnica clara',
            'Emoji e tom em Slack de time internacional',
          ],
          entregavel: 'Escrever 5 dailies em ingles, uma por dia, na sua semana real de estudo.',
          recursos: [],
        },
        {
          id: 'en-f4-m4',
          titulo: 'False friends e armadilhas tecnicas',
          horas: 4,
          topicos: [
            'Actually = na verdade (nao "atualmente")',
            'Eventually = por fim (nao "eventualmente")',
            'Realize = perceber (nao "realizar")',
            'Push = empurrar/enviar (cuidado com "puxar")',
            'Support = suportar E dar suporte — depende do contexto',
            'Library = biblioteca de codigo (nao livraria)',
            'Parents / relatives, sensible / sensitive, attend / assist',
          ],
          entregavel: 'Lista de 25 false friends com uma frase correta de cada.',
          recursos: [],
        },
      ],
    },

    // =====================================================================
    {
      id: 'en-f5',
      nome: 'Conversacao e entrevista',
      objetivo: 'Falar sob pressao, que e a unica coisa que a entrevista testa.',
      modulos: [
        {
          id: 'en-f5-m1',
          titulo: 'Listening ativo',
          horas: 10,
          topicos: [
            'Shadowing: repetir junto com o audio, imitando ritmo',
            'Ditado: transcrever 1 minuto de audio e conferir',
            'Connected speech: por que "what do you" vira "whaddaya"',
            'Sotaques: americano, britanico, indiano — o time e global',
            'Assistir conferencia tecnica com legenda em ingles, depois sem',
            'Podcast tecnico na velocidade normal',
          ],
          entregavel: 'Transcrever 3 minutos de uma palestra tecnica e conferir com a legenda oficial.',
          recursos: [],
        },
        {
          id: 'en-f5-m2',
          titulo: 'Speaking: ritmo, pronuncia e fluidez',
          horas: 10,
          topicos: [
            'Sons que o portugues nao tem: th, o "i" curto de "it", h aspirado',
            'Palavra tonica e ritmo da frase',
            'Terminacao -ed: quando e /t/, /d/ ou /ɪd/',
            'Filler words para ganhar tempo: "well", "let me think", "that’s a good question"',
            'Conectores de discurso: however, therefore, on the other hand',
            'Gravar a si mesmo e ouvir — desconfortavel e eficaz',
          ],
          entregavel: 'Gravar 3 minutos falando sobre seu projeto, ouvir e listar 5 pontos a corrigir.',
          recursos: [],
        },
        {
          id: 'en-f5-m3',
          titulo: 'Daily meeting e rotina de time',
          horas: 6,
          topicos: [
            'Estrutura da daily: ontem, hoje, bloqueios',
            'Pedir para repetir sem constrangimento: "Sorry, could you repeat that?"',
            'Discordar educadamente numa discussao tecnica',
            'Apresentar uma proposta em 2 minutos',
            'Vocabulario de cerimonia agil em ingles',
          ],
          entregavel: 'Gravar 5 dailies faladas em ingles, uma por dia.',
          recursos: [],
        },
        {
          id: 'en-f5-m4',
          titulo: 'Entrevista tecnica em ingles',
          horas: 10,
          topicos: [
            '"Tell me about yourself" — o pitch de 90 segundos em ingles',
            'Explicar seu projeto: problema, stack, decisao dificil',
            'Responder comportamental em STAR, em ingles',
            'Pensar em voz alta durante live coding em ingles',
            'Vocabulario de negociacao salarial',
            'Perguntas para fazer ao entrevistador',
          ],
          entregavel: 'Simular uma entrevista completa em ingles, gravada, e assistir depois.',
          licoes: [
            {
              titulo: 'Tell me about yourself — o roteiro que funciona',
              explicacao:
                'A pergunta de abertura de toda entrevista em ingles. Ela nao pede sua biografia: pede um resumo de 60 a 90 segundos com tres partes — presente, trajetoria, e por que esta vaga. Decore a ESTRUTURA, nao o texto; texto decorado soa recitado e o entrevistador percebe na hora. Note os tempos verbais: presente simples para o que voce e hoje, present perfect para a experiencia acumulada, e "I’m looking for" para o futuro.',
              codigo: `// ESTRUTURA — presente → trajetoria → por que aqui

"I'm a backend developer focused on Java and Spring Boot.

 I've spent the last [X] months building REST APIs — my most
 recent project is a lending system with JWT authentication,
 automated tests and a Docker-based deployment. Before moving
 into tech, I worked in [area], which taught me a lot about
 deadlines and working with different teams.

 I'm looking for a junior position where I can contribute clean,
 well-tested code and learn from more experienced developers.
 What caught my attention about [company] was [motivo concreto]."

// Frases para ganhar tempo sem travar
"That's a good question — let me think for a second."
"Just to make sure I understood correctly, you're asking about...?"
"Sorry, could you repeat the last part?"
"I'm not familiar with that, but here's how I'd approach it."`,
              erroComum:
                'Decorar palavra por palavra. Ao esquecer uma frase, voce trava por completo. Decore os tres blocos e improvise dentro deles.',
              pergunta:
                'Escreva o SEU roteiro agora, com seus dados. Depois grave falando e cronometre: passou de 90 segundos?',
            },
          ],
          recursos: [],
        },
        {
          id: 'en-f5-m5',
          titulo: 'Certificacao e prova de nivel',
          horas: 8,
          topicos: [
            'Autoavaliacao pelo quadro CEFR (A1 a C2)',
            'TOEFL, IELTS, Duolingo English Test e Cambridge — qual serve para que',
            'EF SET: teste gratuito que da um numero para o LinkedIn',
            'O que "ingles avancado" significa numa vaga brasileira (spoiler: costuma ser B2)',
            'Como declarar o nivel no curriculo sem exagerar',
          ],
          entregavel: 'Fazer um teste de nivel gratuito e registrar o resultado no LinkedIn.',
          recursos: [
            { tipo: 'ferramenta', titulo: 'EF SET — teste gratuito de nivel', url: 'https://www.efset.org/' },
          ],
        },
      ],
    },
  ],
}
