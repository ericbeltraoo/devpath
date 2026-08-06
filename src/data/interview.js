// ---------------------------------------------------------------------------
// PREPARACAO PARA ENTREVISTAS
// ---------------------------------------------------------------------------

export const ETAPAS_PROCESSO = [
  {
    id: 'et-1',
    nome: 'Triagem do RH',
    duracao: '20–30 min',
    quemConduz: 'Recrutador(a) tecnico ou generalista',
    oQueAvaliam: [
      'Comunicacao e clareza',
      'Se o perfil bate com a vaga (stack, senioridade, modelo de trabalho)',
      'Pretensao salarial e disponibilidade',
      'Motivacao real pela vaga (voce leu sobre a empresa?)',
    ],
    comoSePreparar: [
      'Tenha um pitch de 90 segundos decorado — mas que soe natural',
      'Pesquise: o que a empresa faz, produto principal, tamanho, valores',
      'Saiba sua faixa salarial ANTES (pesquise no Glassdoor / Levels.fyi / grupos)',
      'Prepare a resposta para "por que voce quer trabalhar aqui?"',
    ],
    erroFatal: 'Nao saber o que a empresa faz. Elimina na hora.',
  },
  {
    id: 'et-2',
    nome: 'Teste tecnico / take-home',
    duracao: '2h a 1 semana',
    quemConduz: 'Time de engenharia (avaliacao assincrona)',
    oQueAvaliam: [
      'Organizacao do codigo e clareza',
      'Se voce escreve teste',
      'Uso de Git (mensagens de commit contam!)',
      'README e capacidade de comunicar decisoes',
      'Se voce cumpriu TODOS os requisitos do enunciado',
    ],
    comoSePreparar: [
      'Leia o enunciado 2 vezes e faca uma checklist dos requisitos',
      'Commits pequenos e descritivos, nao um "primeiro commit" gigante',
      'README com: como rodar, decisoes tecnicas, o que faria com mais tempo',
      'Entregue simples e completo, nao complexo e pela metade',
    ],
    erroFatal: 'Entregar sem teste nenhum e sem README. Vira descarte automatico.',
  },
  {
    id: 'et-3',
    nome: 'Entrevista tecnica',
    duracao: '45–90 min',
    quemConduz: 'Dev senior / tech lead',
    oQueAvaliam: [
      'Fundamentos (POO, colecoes, HTTP, SQL)',
      'Como voce raciocina sob pressao',
      'Honestidade — se voce sabe dizer "nao sei"',
      'Se voce consegue explicar o proprio codigo',
    ],
    comoSePreparar: [
      'Revise os projetos do SEU curriculo linha por linha — vao perguntar',
      'Pratique falar em voz alta enquanto resolve',
      'Tenha 3 perguntas boas para fazer no final',
      'Revise: POO, Collections, Streams, Spring DI, SQL joins',
    ],
    erroFatal: 'Inventar resposta. O senior percebe em 5 segundos e voce perde a credibilidade toda.',
  },
  {
    id: 'et-4',
    nome: 'Live coding / pair programming',
    duracao: '45–60 min',
    quemConduz: 'Dev senior',
    oQueAvaliam: [
      'Processo de pensamento (importa MAIS que a solucao)',
      'Se voce pergunta antes de assumir',
      'Se voce testa casos de borda',
      'Reacao a dica e a critica',
    ],
    comoSePreparar: [
      'Pratique no LeetCode/Beecrowd falando alto, com timer',
      'Decore o roteiro: entender -> exemplos -> forca bruta -> otimizar -> testar',
      'Teste sua camera, microfone e o editor compartilhado ANTES',
      'Se travar, diga o que esta pensando em vez de ficar em silencio',
    ],
    erroFatal: 'Sair codando sem entender o problema. Sempre repita o enunciado com suas palavras primeiro.',
  },
  {
    id: 'et-5',
    nome: 'Entrevista comportamental / fit cultural',
    duracao: '30–60 min',
    quemConduz: 'Gestor(a) e/ou RH',
    oQueAvaliam: [
      'Trabalho em equipe e como lida com conflito',
      'Como recebe feedback',
      'Autonomia e proatividade',
      'Alinhamento com os valores da empresa',
    ],
    comoSePreparar: [
      'Prepare 5 historias reais no formato STAR',
      'Tenha uma historia de erro que voce cometeu e o que aprendeu',
      'Nunca fale mal de empresa/chefe anterior',
      'Experiencia fora de TI vale — atendimento, lideranca, prazo apertado',
    ],
    erroFatal: 'Responder no abstrato ("eu sou proativo") sem nunca dar um exemplo concreto.',
  },
  {
    id: 'et-6',
    nome: 'Proposta e negociacao',
    duracao: '15–30 min',
    quemConduz: 'RH',
    oQueAvaliam: ['Alinhamento de expectativa', 'Maturidade na negociacao'],
    comoSePreparar: [
      'Nunca diga o primeiro numero se puder devolver a pergunta',
      'Considere o pacote todo: PJ vs CLT, VR, plano, home office, budget de estudo',
      'Peca 24–48h para avaliar — e normal e profissional',
      'Se recusar, recuse bem: o mercado e pequeno e voce pode voltar',
    ],
    erroFatal: 'Aceitar na hora por medo. Pedir um dia para pensar nunca queimou ninguem.',
  },
]

export const METODO_STAR = {
  nome: 'Metodo STAR',
  descricao:
    'Estrutura para responder qualquer pergunta comportamental. Sem ela, a resposta vira divagacao; com ela, vira evidencia.',
  passos: [
    { letra: 'S', nome: 'Situacao', desc: 'O contexto. Onde, quando, qual era o cenario. 1–2 frases, sem enrolar.' },
    { letra: 'T', nome: 'Tarefa', desc: 'Qual era a SUA responsabilidade especifica ali. Nao a do time — a sua.' },
    { letra: 'A', nome: 'Acao', desc: 'O que VOCE fez, passo a passo. Esta e a parte mais longa. Use "eu fiz", nao "nos fizemos".' },
    { letra: 'R', nome: 'Resultado', desc: 'O desfecho, de preferencia com numero. E o que voce aprendeu.' },
  ],
  exemplo: {
    pergunta: 'Conte sobre uma vez em que voce teve que aprender algo rapido.',
    resposta:
      'S: No meu projeto de portfolio, decidi publicar a API para que pessoas pudessem testar, mas eu so sabia rodar em localhost. ' +
      'T: Eu precisava colocar a aplicacao Java + Postgres no ar em uma semana, sem experiencia nenhuma com deploy. ' +
      'A: Quebrei o problema em tres partes: containerizar, subir o banco e publicar. Estudei Docker pela documentacao oficial, ' +
      'escrevi um Dockerfile multi-stage, montei um docker-compose com o Postgres e, ao errar a conexao entre containers, ' +
      'li os logs ate entender que o host correto era o nome do servico, nao localhost. Depois publiquei em um provedor gratuito. ' +
      'R: A API ficou no ar em 5 dias, com README e link publico. Foi o projeto que mais gerou conversa nas minhas entrevistas, ' +
      'e desde entao Docker virou parte do meu fluxo normal de trabalho.',
  },
}

export const PERGUNTAS = [
  // ---------------------------- COMPORTAMENTAL -----------------------------
  {
    id: 'p-c1',
    categoria: 'comportamental',
    pergunta: 'Fale um pouco sobre voce.',
    comoResponder:
      'Nao e biografia. E um pitch de 90 segundos: presente (o que voce faz/estuda) -> caminho (como chegou aqui) -> futuro (por que ESTA vaga).',
    respostaModelo:
      'Hoje estou em transicao para desenvolvimento backend. Venho de [area anterior], onde desenvolvi [habilidade transferivel: organizacao, prazo, atendimento]. Ha [X] meses estudo Java de forma estruturada, ja com base solida em POO, Spring Boot e SQL, e construi [projeto] que esta publicado com API, testes e deploy em container. Estou procurando uma vaga junior onde eu possa contribuir com codigo limpo e aprender com um time mais experiente — e a [empresa] chamou minha atencao por [motivo concreto].',
    armadilha: 'Contar a vida desde o ensino medio. Corte tudo que nao ajuda a te contratar.',
  },
  {
    id: 'p-c2',
    categoria: 'comportamental',
    pergunta: 'Por que voce esta migrando para tecnologia?',
    comoResponder:
      'Motivacao positiva (o que te atrai), nao negativa (fugir do emprego atual). Mostre que a decisao foi pensada e ja tem prova de acao.',
    respostaModelo:
      'Sempre fui a pessoa que automatizava o processo do time. Quando comecei a estudar programacao percebi que era exatamente isso, so que em escala. Nao foi impulso: venho estudando de forma consistente ha [X] meses, com projetos publicados, e cada etapa so confirmou a escolha.',
    armadilha: '"Porque paga bem" ou "porque odeio meu emprego atual". Ambas ligam alerta.',
  },
  {
    id: 'p-c3',
    categoria: 'comportamental',
    pergunta: 'Conte sobre um erro que voce cometeu.',
    comoResponder:
      'STAR, com erro REAL, assumindo responsabilidade, terminando no aprendizado e na mudanca de comportamento.',
    respostaModelo:
      'Em um projeto, comitei um arquivo de configuracao com credencial de banco. Percebi no dia seguinte. Revoguei a credencial na hora, removi do historico, adicionei .gitignore e passei a usar variavel de ambiente. Desde entao, configuracao sensivel nunca entra no repositorio nos meus projetos — virou item fixo do meu checklist.',
    armadilha: 'O falso erro ("sou perfeccionista demais"). Todo entrevistador ja ouviu e desconta pontos.',
  },
  {
    id: 'p-c4',
    categoria: 'comportamental',
    pergunta: 'Como voce lida com um feedback negativo sobre seu codigo?',
    comoResponder: 'Mostre que voce separa o codigo da sua pessoa e que code review e aprendizado, nao julgamento.',
    respostaModelo:
      'Encaro code review como a parte mais barata de aprender. Se nao entendo a sugestao, pergunto o porque em vez de so aplicar — assim aprendo o principio e nao repito. Se discordo, apresento meu raciocinio e aceito a decisao de quem tem mais contexto.',
    armadilha: 'Dar a entender que voce leva critica para o lado pessoal.',
  },
  {
    id: 'p-c5',
    categoria: 'comportamental',
    pergunta: 'O que voce faz quando trava em um problema?',
    comoResponder:
      'Mostre um processo com escalonamento no tempo certo: nem pedir ajuda no primeiro minuto, nem sumir por 3 dias.',
    respostaModelo:
      'Primeiro leio a mensagem de erro inteira e a stack trace ate a causa raiz. Depois reproduzo o minimo possivel e uso o debugger. Consulto documentacao oficial antes de forum. Se depois de uns 45 minutos nao avancei, peco ajuda ja mostrando o que testei e o que descartei — respeita o tempo do outro e costuma resolver rapido.',
    armadilha: '"Eu insisto ate resolver sozinho." Em time, isso e problema, nao virtude.',
  },
  {
    id: 'p-c6',
    categoria: 'comportamental',
    pergunta: 'Onde voce se ve em 5 anos?',
    comoResponder: 'Crescimento tecnico coerente com a vaga. Nao precisa jurar amor eterno.',
    respostaModelo:
      'Quero ser um dev pleno solido, com dominio real de backend e boa nocao de arquitetura e cloud, no nivel de conseguir levar uma feature do desenho ao deploy sozinho e ajudar quem esta comecando. Ainda nao decidi entre trilha tecnica ou lideranca — quero primeiro construir base.',
    armadilha: 'Dizer que quer abrir a propria empresa em 2 anos.',
  },

  // -------------------------------- JAVA -----------------------------------
  {
    id: 'p-j1',
    categoria: 'java',
    pergunta: 'Qual a diferenca entre == e equals()?',
    comoResponder: 'Referencia vs conteudo. Cite o contrato com hashCode e o pool de Strings.',
    respostaModelo:
      '== compara referencia (se apontam para o mesmo objeto na memoria); para primitivos, compara valor. equals() compara conteudo, conforme a classe definir. Em String, o pool de literais faz "a" == "a" dar true, mas new String("a") == "a" dar false — por isso String sempre se compara com equals. E sempre que sobrescrevo equals, sobrescrevo hashCode junto, senao o objeto quebra em HashMap e HashSet.',
    armadilha: 'Parar em "um compara valor e outro objeto" sem citar hashCode.',
  },
  {
    id: 'p-j2',
    categoria: 'java',
    pergunta: 'Classe abstrata ou interface: quando usar cada uma?',
    comoResponder: 'E-UM com estado compartilhado vs contrato/capacidade. Cite heranca multipla de interface.',
    respostaModelo:
      'Classe abstrata quando existe uma relacao "e-um" e ha estado ou comportamento comum a compartilhar — ex.: Conta abstrata com saldo e um sacar() que delega a validacao para as filhas. Interface quando defino um contrato ou capacidade que classes nao relacionadas podem ter — ex.: Exportavel. Uma classe estende uma classe e implementa varias interfaces, entao interface e mais flexivel. Na pratica, prefiro interface e composicao, e uso abstrata so quando ha codigo real repetido.',
    armadilha: 'Responder apenas "interface nao tem implementacao" — desatualizado desde os default methods.',
  },
  {
    id: 'p-j3',
    categoria: 'java',
    pergunta: 'ArrayList ou LinkedList?',
    comoResponder: 'Fale em custo de operacao e diga a verdade: na pratica quase sempre ArrayList.',
    respostaModelo:
      'ArrayList e array dinamico: acesso por indice O(1), insercao no fim amortizada O(1), insercao/remocao no meio O(n) por causa do deslocamento. LinkedList e duplamente encadeada: insercao/remocao O(1) se voce ja esta no no, mas acesso por indice O(n) e com pessimo aproveitamento de cache. Na pratica uso ArrayList em praticamente tudo; LinkedList so faz sentido como Deque, e ate nisso o ArrayDeque costuma ser melhor.',
    armadilha: 'Recitar a tabela sem dizer o que voce usaria de verdade.',
  },
  {
    id: 'p-j4',
    categoria: 'java',
    pergunta: 'Como funciona o HashMap por dentro?',
    comoResponder: 'hashCode -> bucket -> colisao -> equals. Cite a treeificacao no Java 8+.',
    respostaModelo:
      'O HashMap guarda os pares em buckets. Ao inserir, ele calcula o hashCode da chave, aplica uma dispersao e deriva o indice do bucket. Se ja houver algo ali (colisao), percorre a lista daquele bucket comparando com equals; a partir de 8 elementos no mesmo bucket, o Java 8+ converte a lista em arvore balanceada, melhorando o pior caso de O(n) para O(log n). Quando passa do fator de carga (0.75), redimensiona e rehash. Por isso a chave precisa ter hashCode e equals coerentes — e, de preferencia, ser imutavel.',
    armadilha: 'Nao saber explicar o que acontece na colisao.',
  },
  {
    id: 'p-j5',
    categoria: 'java',
    pergunta: 'Checked e unchecked exception — diferenca e qual usar?',
    comoResponder: 'Verificacao em compilacao vs execucao, e a opiniao pratica do mercado.',
    respostaModelo:
      'Checked estende Exception e o compilador obriga a tratar ou declarar (IOException). Unchecked estende RuntimeException e nao obriga (IllegalArgumentException, NullPointerException). Na pratica, e no Spring em particular, o padrao e usar unchecked para erro de dominio — evita poluir assinatura com throws e nao forca o chamador a tratar algo que ele nao resolve. Uso checked so quando o chamador realmente tem como se recuperar.',
    armadilha: 'Nao ter opiniao. O entrevistador quer ver criterio, nao definicao de livro.',
  },
  {
    id: 'p-j6',
    categoria: 'java',
    pergunta: 'O que e imutabilidade e por que importa?',
    comoResponder: 'Estado nao muda apos criacao. Cite thread-safety, seguranca como chave de Map, e record.',
    respostaModelo:
      'Objeto imutavel nao muda de estado depois de criado — campos final, sem setter, e copia defensiva de colecoes. Isso da thread-safety de graca, torna seguro usar como chave de HashMap e elimina bug de alteracao inesperada. String e os wrappers sao imutaveis. Em Java moderno uso record para DTO e value object, que ja nasce imutavel.',
    armadilha: 'Achar que final na referencia torna o objeto imutavel — nao torna.',
  },
  {
    id: 'p-j7',
    categoria: 'java',
    pergunta: 'Por que nao usar double para dinheiro?',
    comoResponder: 'Ponto flutuante binario nao representa decimal exatamente. BigDecimal com String no construtor.',
    respostaModelo:
      'double e ponto flutuante binario e nao representa exatamente valores decimais — 0.1 + 0.2 nao da 0.3. Em dinheiro isso vira divergencia de centavos que estoura em fechamento contabil. Uso BigDecimal, construido a partir de String (new BigDecimal("10.50"), nunca do double), com escala e RoundingMode explicitos, e comparo com compareTo em vez de equals.',
    armadilha: 'Usar BigDecimal, mas construir a partir de double — mantem o erro.',
  },

  // ------------------------------- SPRING ----------------------------------
  {
    id: 'p-s1',
    categoria: 'spring',
    pergunta: 'O que e injecao de dependencia e por que o Spring usa?',
    comoResponder: 'Inversao de controle, acoplamento fraco, testabilidade. Ligue com o "D" do SOLID.',
    respostaModelo:
      'Em vez de a classe criar suas dependencias com new, ela as recebe prontas de fora — o container do Spring instancia e injeta. Isso inverte o controle: a classe depende de abstracao, nao de implementacao concreta, que e exatamente o Dependency Inversion do SOLID. O ganho pratico e testabilidade: no teste eu injeto um mock do repositorio sem tocar em banco. Uso injecao por construtor, que deixa a dependencia obrigatoria explicita e permite campos final.',
    armadilha: 'Defender @Autowired em campo. Injecao por construtor e o padrao atual.',
  },
  {
    id: 'p-s2',
    categoria: 'spring',
    pergunta: 'Diferenca entre @Component, @Service, @Repository e @Controller.',
    comoResponder: 'Tecnicamente todas sao @Component; a diferenca e semantica — exceto @Repository, que tem comportamento extra.',
    respostaModelo:
      'Todas sao especializacoes de @Component, entao todas viram bean. A diferenca principal e semantica, comunicar a camada: @Service para regra de negocio, @Controller/@RestController para entrada HTTP, @Repository para acesso a dados. @Repository tem um extra real: traducao de excecoes de persistencia para a hierarquia DataAccessException do Spring.',
    armadilha: 'Dizer que sao todas identicas. @Repository tem sim comportamento proprio.',
  },
  {
    id: 'p-s3',
    categoria: 'spring',
    pergunta: 'Por que usar DTO em vez de expor a entidade?',
    comoResponder: 'Acoplamento, seguranca, versionamento de contrato e lazy loading.',
    respostaModelo:
      'Expor a entidade acopla o contrato da API ao modelo do banco: qualquer mudanca de coluna quebra o cliente. Alem disso vaza campo sensivel (hash de senha) e abre mass assignment no POST. Tambem cria problema com lazy loading na serializacao. Com DTO eu controlo exatamente o que entra e o que sai, e posso validar a entrada com Bean Validation sem sujar a entidade.',
    armadilha: 'Responder so "e boa pratica" sem justificar.',
  },
  {
    id: 'p-s4',
    categoria: 'spring',
    pergunta: 'Como voce trata erros em uma API Spring?',
    comoResponder: '@RestControllerAdvice, resposta padronizada, status code correto, nao vazar stack trace.',
    respostaModelo:
      'Centralizo em um @RestControllerAdvice com @ExceptionHandler por tipo. Cada excecao de dominio mapeia para um status: nao encontrado -> 404, validacao -> 400 com a lista de campos e mensagens, conflito de regra -> 409, sem permissao -> 403. O corpo e sempre o mesmo formato: timestamp, status, erro, mensagem e path. Stack trace vai para o log, nunca para a resposta.',
    armadilha: 'Try/catch espalhado em cada controller.',
  },
  {
    id: 'p-s5',
    categoria: 'spring',
    pergunta: 'O que e o problema N+1 e como resolver?',
    comoResponder: 'Explique a origem no lazy loading e cite JOIN FETCH / EntityGraph.',
    respostaModelo:
      'Acontece quando carrego uma lista de N entidades e, ao acessar uma associacao lazy de cada uma, o ORM dispara mais uma query por item — 1 + N queries. Detecto ligando o log de SQL e vendo a repeticao. Resolvo com JOIN FETCH no JPQL ou @EntityGraph, trazendo a associacao na mesma consulta; quando ha varias colecoes, uso consulta em duas etapas ou projecao por DTO em vez de FETCH multiplo, que gera produto cartesiano.',
    armadilha: 'Responder "muda para EAGER". Piora: passa a carregar sempre, ate quando nao precisa.',
  },
  {
    id: 'p-s6',
    categoria: 'spring',
    pergunta: 'Como funciona o @Transactional?',
    comoResponder: 'Proxy AOP, rollback em unchecked por padrao, e a pegadinha da chamada interna.',
    respostaModelo:
      'O Spring cria um proxy em volta do bean que abre a transacao antes do metodo e faz commit ou rollback depois. Por padrao, rollback so acontece em RuntimeException — checked exception nao dispara rollback a menos que eu declare rollbackFor. Duas pegadinhas: o metodo precisa ser public, e uma chamada interna (this.metodo()) nao passa pelo proxy, entao a transacao nao se aplica. Uso readOnly=true nas consultas.',
    armadilha: 'Nao conhecer a limitacao da chamada interna — pergunta classica de senior.',
  },

  // -------------------------------- SQL ------------------------------------
  {
    id: 'p-q1',
    categoria: 'sql',
    pergunta: 'Diferenca entre INNER JOIN e LEFT JOIN.',
    comoResponder: 'Explique com um exemplo concreto, nao com definicao decorada.',
    respostaModelo:
      'INNER JOIN traz so as linhas com correspondencia nas duas tabelas. LEFT JOIN traz todas da esquerda e completa com NULL onde nao ha par a direita. Exemplo: clientes com pedidos — INNER esconde quem nunca comprou; LEFT mostra todos, e filtrar por pedido IS NULL me da exatamente os clientes sem compra. Detalhe: colocar condicao da tabela da direita no WHERE de um LEFT JOIN transforma ele num INNER na pratica; essa condicao tem que ir no ON.',
    armadilha: 'Nao saber a pegadinha do WHERE que anula o LEFT JOIN.',
  },
  {
    id: 'p-q2',
    categoria: 'sql',
    pergunta: 'WHERE ou HAVING?',
    comoResponder: 'Antes vs depois da agregacao.',
    respostaModelo:
      'WHERE filtra linhas antes do GROUP BY e nao aceita funcao de agregacao. HAVING filtra os grupos depois da agregacao, entao e onde vai COUNT(*) > 3. Por performance, filtro o maximo possivel no WHERE, porque reduz o volume antes de agrupar.',
    armadilha: 'Usar HAVING para o que caberia no WHERE.',
  },
  {
    id: 'p-q3',
    categoria: 'sql',
    pergunta: 'Quando um indice atrapalha?',
    comoResponder: 'Custo de escrita, espaco, baixa seletividade e funcao sobre a coluna.',
    respostaModelo:
      'Todo indice precisa ser atualizado a cada INSERT, UPDATE e DELETE, entao excesso de indice degrada escrita e ocupa espaco. Indice em coluna de baixa seletividade (um campo booleano com 50/50) costuma nem ser usado — o otimizador prefere varrer a tabela. E ele deixa de valer quando aplico funcao na coluna, tipo WHERE UPPER(nome) = ... ; nesse caso preciso de indice funcional. Confirmo tudo isso com EXPLAIN ANALYZE, nao no achismo.',
    armadilha: 'Achar que indice sempre acelera.',
  },
  {
    id: 'p-q4',
    categoria: 'sql',
    pergunta: 'O que e uma transacao e o que significa ACID?',
    comoResponder: 'Definir as 4 letras com exemplo de transferencia bancaria.',
    respostaModelo:
      'Transacao e um conjunto de operacoes que acontece tudo ou nada. ACID: Atomicidade — na transferencia, o debito e o credito acontecem juntos ou nenhum dos dois; Consistencia — o banco sai de um estado valido para outro valido, respeitando constraints; Isolamento — transacoes concorrentes nao enxergam estado intermediario uma da outra, conforme o nivel configurado; Durabilidade — apos o commit, o dado sobrevive a queda do servidor.',
    armadilha: 'Recitar as siglas sem exemplo.',
  },

  // ------------------------------ ANGULAR ----------------------------------
  {
    id: 'p-a1',
    categoria: 'angular',
    pergunta: 'Observable ou Promise?',
    comoResponder: 'Um valor vs stream, eager vs lazy, cancelavel, operadores.',
    respostaModelo:
      'Promise emite um unico valor, ja comeca a executar assim que criada e nao da para cancelar. Observable e um stream que pode emitir varios valores ao longo do tempo, e lazy (so executa no subscribe), e cancelavel via unsubscribe e traz todo o arsenal de operadores do RxJS — debounce, retry, switchMap. Por isso o HttpClient do Angular devolve Observable: permite cancelar requisicao obsoleta.',
    armadilha: 'Nao citar cancelamento — e o ponto mais pratico da diferenca.',
  },
  {
    id: 'p-a2',
    categoria: 'angular',
    pergunta: 'switchMap, mergeMap, concatMap ou exhaustMap?',
    comoResponder: 'Diga o comportamento e o caso de uso de cada um.',
    respostaModelo:
      'switchMap cancela a requisicao anterior quando chega um novo valor — ideal para autocomplete. mergeMap executa tudo em paralelo, sem garantia de ordem — bom para uploads independentes. concatMap enfileira e mantem a ordem — bom para operacoes que dependem da anterior. exhaustMap ignora novas emissoes enquanto a atual nao terminar — perfeito para botao de login, porque evita duplo clique.',
    armadilha: 'Usar mergeMap em busca e criar race condition, mostrando resultado antigo.',
  },
  {
    id: 'p-a3',
    categoria: 'angular',
    pergunta: 'Como evitar memory leak com Observables?',
    comoResponder: 'async pipe, takeUntilDestroyed, unsubscribe no ngOnDestroy.',
    respostaModelo:
      'Todo subscribe manual em um Observable de vida longa precisa ser encerrado, senao o componente destruido continua reagindo. Prefiro o async pipe, que assina e cancela sozinho. Quando preciso do subscribe, uso takeUntilDestroyed() ou um Subject de destroy com takeUntil e completo no ngOnDestroy. Requisicao HTTP completa sozinha, entao la o risco e menor.',
    armadilha: 'Dizer que nunca precisa de unsubscribe.',
  },

  // -------------------------------- AWS ------------------------------------
  {
    id: 'p-w1',
    categoria: 'aws',
    pergunta: 'Qual a diferenca entre Regiao e Availability Zone?',
    comoResponder: 'Geografia vs isolamento fisico dentro da regiao. Cite alta disponibilidade.',
    respostaModelo:
      'Regiao e uma area geografica (sa-east-1, Sao Paulo), escolhida por latencia, custo e requisito legal de residencia de dados. Cada regiao tem varias Availability Zones, que sao datacenters isolados fisicamente mas ligados por rede de baixa latencia. Distribuir a aplicacao em mais de uma AZ e o que garante que a queda de um datacenter nao derruba o sistema — e por isso o RDS Multi-AZ existe.',
    armadilha: 'Tratar AZ como se fosse um servidor.',
  },
  {
    id: 'p-w2',
    categoria: 'aws',
    pergunta: 'Como sua aplicacao acessa o S3 sem colocar chave no codigo?',
    comoResponder: 'IAM Role para o servico. Isso separa quem sabe de quem nunca fez.',
    respostaModelo:
      'Atribuo uma IAM Role ao recurso — instance profile na EC2, execution role na Lambda, task role no ECS. O SDK pega a credencial temporaria automaticamente pela cadeia de credenciais, e ela rotaciona sozinha. Assim nao existe access key no codigo nem em variavel de ambiente, e a policy da role da so a permissao minima naquele bucket.',
    armadilha: 'Responder "coloco a access key numa variavel de ambiente". E o antipadrao.',
  },
  {
    id: 'p-w3',
    categoria: 'aws',
    pergunta: 'Quando NAO usar Lambda?',
    comoResponder: 'Cold start, limite de tempo, carga constante, processo com estado.',
    respostaModelo:
      'Lambda e otimo para carga esporadica e event-driven. Evito quando ha exigencia de latencia muito baixa e constante, porque o cold start pesa — especialmente em JVM; quando o processamento passa do limite de tempo de execucao; quando a carga e alta e continua, caso em que container em ECS/EC2 sai bem mais barato; e quando o processo precisa manter estado ou conexao persistente, como pool de conexoes com banco.',
    armadilha: 'Achar que serverless e sempre mais barato.',
  },

  // ----------------------------- ARQUITETURA -------------------------------
  {
    id: 'p-r1',
    categoria: 'arquitetura',
    pergunta: 'Explique a arquitetura do seu projeto.',
    comoResponder:
      'A pergunta mais importante da entrevista de junior. Estrutura: problema -> stack e porque -> camadas -> uma decisao dificil -> o que faria diferente.',
    respostaModelo:
      'E uma API de emprestimo de livros. Backend em Java com Spring Boot, dividido em Controller, Service e Repository: o Controller so recebe e valida DTO, a regra de negocio fica no Service e o acesso a dados no Repository com Spring Data JPA. Banco Postgres, com schema versionado por Flyway. Autenticacao stateless por JWT com Spring Security. Roda em Docker com docker-compose subindo API e banco, e o GitHub Actions roda os testes a cada push. Uma decisao que me custou tempo: eu tinha colocado o calculo de multa no Controller e nao conseguia testar sem subir o contexto web — movi para o Service e o teste virou unitario, rapido. Se fosse refazer, escreveria os testes antes.',
    armadilha: 'Nao saber explicar o proprio projeto. E o descarte mais comum e mais evitavel.',
  },
  {
    id: 'p-r2',
    categoria: 'arquitetura',
    pergunta: 'O que voce faria se um endpoint ficasse lento em producao?',
    comoResponder: 'Mostre metodo investigativo, nao chute.',
    respostaModelo:
      'Primeiro meco, nao adivinho: olho os logs e as metricas para saber se e lento sempre ou so sob carga, e em qual etapa. Verifico o SQL gerado, procurando N+1 e consulta sem indice, e rodo EXPLAIN. Se for o banco, ajusto a consulta ou o indice. Se for a aplicacao, procuro laco custoso ou chamada externa sincrona. So depois disso considero cache, porque cache sem entender a causa esconde o problema em vez de resolver.',
    armadilha: 'Comecar por "eu colocaria cache".',
  },
  {
    id: 'p-r3',
    categoria: 'arquitetura',
    pergunta: 'Monolito ou microsservicos?',
    comoResponder: 'Junior nao precisa defender microsservico. Precisa mostrar criterio.',
    respostaModelo:
      'Depende do tamanho do time e do dominio. Microsservico resolve problema organizacional e de escala independente, mas cobra caro: rede, observabilidade, consistencia eventual, deploy distribuido. Para a maioria dos casos, um monolito bem modularizado e mais simples de operar, e da para extrair servico depois quando a dor aparecer. Comecar por microsservico sem necessidade e o erro classico.',
    armadilha: 'Dizer que microsservico e sempre melhor porque e moderno.',
  },

  // ------------------------------ CARREIRA ---------------------------------
  {
    id: 'p-k1',
    categoria: 'carreira',
    pergunta: 'Qual sua pretensao salarial?',
    comoResponder: 'Devolva a pergunta primeiro. Se insistirem, de uma faixa pesquisada com o piso ja aceitavel.',
    respostaModelo:
      'Antes de falar em numero, voces ja tem uma faixa definida para a posicao? Ajuda a ver se estamos alinhados. — Se insistirem: Pelo que pesquisei para junior nessa stack e regiao, a faixa fica entre R$ X e R$ Y. Estou confortavel nessa faixa, e considero o pacote como um todo: modelo de trabalho, beneficios e oportunidade de aprendizado.',
    armadilha: 'Dizer um numero muito baixo por inseguranca. Isso ancora toda a negociacao para baixo.',
  },
  {
    id: 'p-k2',
    categoria: 'carreira',
    pergunta: 'Voce tem alguma pergunta para nos?',
    comoResponder: 'Nunca responda "nao". Tenha 3 prontas e escolha as que fizerem sentido pelo que ouviu.',
    respostaModelo:
      'Como e o processo de code review no time? / Como um junior recebe acompanhamento nos primeiros meses — tem mentor ou pareamento? / Qual seria minha primeira entrega, se eu comecasse na proxima semana? / Qual o maior desafio tecnico do time hoje?',
    armadilha: '"Nao, ta tudo claro." Passa desinteresse.',
  },
]

export const CATEGORIAS = {
  comportamental: { nome: 'Comportamental', cor: '#8b5cf6' },
  java: { nome: 'Java', cor: '#e76f00' },
  spring: { nome: 'Spring', cor: '#6db33f' },
  sql: { nome: 'SQL / Banco', cor: '#22a06b' },
  angular: { nome: 'Angular', cor: '#dd0031' },
  aws: { nome: 'AWS', cor: '#ff9900' },
  arquitetura: { nome: 'Arquitetura', cor: '#3b82f6' },
  carreira: { nome: 'Carreira', cor: '#ec4899' },
}

export const CHECKLIST_PRE_ENTREVISTA = [
  { id: 'ck-1', texto: 'Pesquisei o que a empresa faz, o produto e o modelo de negocio', quando: '1 dia antes' },
  { id: 'ck-2', texto: 'Li a descricao da vaga de novo e listei as tecnologias citadas', quando: '1 dia antes' },
  { id: 'ck-3', texto: 'Revisei cada projeto do meu curriculo (consigo explicar linha por linha?)', quando: '1 dia antes' },
  { id: 'ck-4', texto: 'Olhei o LinkedIn de quem vai me entrevistar', quando: '1 dia antes' },
  { id: 'ck-5', texto: 'Preparei 5 historias no formato STAR', quando: '1 dia antes' },
  { id: 'ck-6', texto: 'Preparei 3 perguntas para fazer no final', quando: '1 dia antes' },
  { id: 'ck-7', texto: 'Defini minha faixa salarial com pesquisa (nao com chute)', quando: '1 dia antes' },
  { id: 'ck-8', texto: 'Testei camera, microfone e o link da reuniao', quando: '1h antes' },
  { id: 'ck-9', texto: 'Ambiente arrumado, luz de frente, celular no silencioso', quando: '1h antes' },
  { id: 'ck-10', texto: 'Agua por perto, bloco de notas e caneta na mesa', quando: '15 min antes' },
  { id: 'ck-11', texto: 'Fechei abas e notificacoes (Slack, WhatsApp, email)', quando: '15 min antes' },
  { id: 'ck-12', texto: 'Entrei na sala 3 minutos antes', quando: 'na hora' },
  { id: 'ck-13', texto: 'Enviei email de agradecimento em ate 24h', quando: 'depois' },
  { id: 'ck-14', texto: 'Anotei as perguntas que travei para estudar depois', quando: 'depois' },
]
