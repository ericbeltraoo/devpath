// ---------------------------------------------------------------------------
// DESAFIOS DE PROCESSO SELETIVO
// ---------------------------------------------------------------------------
// IMPORTANTE, e honestidade importa aqui: estes NAO sao os testes proprietarios
// das empresas. Sao reconstrucoes no MESMO FORMATO, nivel e rubrica dos
// processos, a partir de relatos publicos de candidatos, descricoes de vaga e
// do padrao de mercado. Treinar no formato certo e o que importa — decorar um
// enunciado especifico nao serviria de nada, porque eles mudam.
//
// Cada desafio tem `perguntasDoMentor`: voce responde ANTES de codar. Se nao
// conseguir responder, voce nao entendeu o problema — e codar agora so vai
// produzir codigo que voce vai jogar fora.
// ---------------------------------------------------------------------------

export const REGRAS_MENTOR = [
  'Toda decisao tecnica precisa de justificativa. Sem justificativa, voce nao decidiu — chutou.',
  'Nada de zona de conforto: exercicio novo sempre cobra o que voce ja aprendeu antes.',
  'Resolva no nivel certo. Se o problema e de modelagem, nao adianta consertar no controller.',
  'Consistencia: se voce decidiu algo antes, nao contradiga agora sem perceber.',
  'Progresso real e reconhecido. Resposta mediocre nao.',
  'Direto, sem suavizar. "Esta errado e aqui esta o porque" vale mais que rodeio.',
  'Erre antes de pesquisar. O erro ensina mais que a resposta pronta.',
  'Pense antes de codar. Modelagem antes de implementacao, contrato antes da chamada.',
]

export const TIPOS_DESAFIO = {
  triagem: { nome: 'Triagem online', desc: 'Plataforma automatizada, tempo cronometrado, casos de teste ocultos.' },
  takehome: { nome: 'Take-home', desc: 'Projeto para entregar em dias. Avaliam codigo, testes, README e commits.' },
  livecoding: { nome: 'Live coding', desc: 'Voce codifica com alguem olhando. Avaliam raciocinio em voz alta.' },
  design: { nome: 'Design / modelagem', desc: 'Sem IDE. Papel, diagrama e discussao de tradeoffs.' },
  codereview: { nome: 'Code review', desc: 'Recebe codigo alheio e precisa apontar problemas.' },
  debug: { nome: 'Debug', desc: 'Sistema quebrado, voce precisa achar a causa raiz sob pressao.' },
}

export const DESAFIOS = [
  // ------------------------------------------------------------- TRIAGEM --
  {
    id: 'df-01',
    titulo: 'Processamento de transacoes com janela de tempo',
    estilo: 'Formato fintech (Nubank, PicPay, Stone)',
    tipo: 'triagem',
    nivel: 2,
    tempo: '70 min',
    stack: ['Java', 'Collections', 'java.time'],
    preRequisitos: ['java-f2-m4', 'java-f1-m4'],
    contexto:
      'Triagem automatizada. Casos de teste ocultos, incluindo casos de borda que o enunciado nao menciona de proposito — parte da avaliacao e voce PENSAR nos casos que faltam.',
    enunciado:
      'Implemente um autorizador de transacoes. Ele recebe uma lista de operacoes em ordem cronologica e devolve, para cada uma, se foi aprovada e quais violacoes ocorreram.',
    requisitos: [
      'A conta precisa estar inicializada antes de qualquer transacao (violacao: account-not-initialized)',
      'A conta so pode ser inicializada uma vez (violacao: account-already-initialized)',
      'Cartao precisa estar ativo (violacao: card-not-active)',
      'Saldo precisa ser suficiente (violacao: insufficient-limit)',
      'Maximo de 3 transacoes num intervalo de 2 minutos (violacao: high-frequency-small-interval)',
      'Nao pode haver 2 transacoes iguais (mesmo comerciante e valor) em 2 minutos (violacao: doubled-transaction)',
      'Uma transacao pode acumular varias violacoes; nesse caso nenhuma altera o estado da conta',
    ],
    restricoes: [
      'Sem framework, sem banco: estado em memoria',
      'Nao pode usar biblioteca externa alem da standard library',
      'A saida precisa ser deterministica',
    ],
    oQueAvaliam: [
      { criterio: 'Corretude nos casos de borda', peso: 35 },
      { criterio: 'Modelagem de dominio (nao jogar tudo numa classe)', peso: 25 },
      { criterio: 'Legibilidade e nomes', peso: 20 },
      { criterio: 'Testes', peso: 20 },
    ],
    armadilhas: [
      'A janela e DESLIZANTE, nao fixa. "Ultimos 2 minutos a partir de agora", nao "blocos de 2 minutos".',
      'Transacao com multiplas violacoes nao pode debitar o saldo. Muita gente debita e depois tenta desfazer.',
      'Usar double para dinheiro. Descarte quase automatico numa fintech.',
      'Comparar horarios com String em vez de Instant.',
    ],
    perguntasDoMentor: [
      'Qual estrutura de dados guarda o historico para consultar a janela de 2 minutos? Justifique o custo da sua escolha.',
      'Onde mora a regra de negocio: na classe Conta, num Autorizador, ou num validador por regra? Defenda.',
      'Como voce adiciona uma 7a regra sem editar o codigo das outras 6? Se a resposta for "mais um if", releia o "O" do SOLID.',
      'O que acontece se duas transacoes tiverem exatamente o mesmo timestamp?',
    ],
    criteriosAprovacao: [
      'Todos os casos de borda passam, inclusive os nao citados no enunciado',
      'Adicionar uma regra nova nao exige tocar nas regras existentes',
      'BigDecimal para valores monetarios',
      'Testes cobrindo cada violacao isoladamente e em combinacao',
    ],
  },

  {
    id: 'df-02',
    titulo: 'Agregacao de logs com ranking',
    estilo: 'Formato e-commerce (Mercado Livre, Magalu)',
    tipo: 'triagem',
    nivel: 2,
    tempo: '45 min',
    stack: ['Java', 'Streams', 'Collections'],
    preRequisitos: ['java-f2-m5', 'base-f3-m1'],
    contexto: 'Cronometrado. Avaliam se voce escolhe a estrutura certa em vez de forcar solucao O(n²).',
    enunciado:
      'Dado um arquivo de log com milhoes de linhas no formato `timestamp|usuario|acao|duracaoMs`, produza: os 10 usuarios com maior tempo total, a acao mais lenta em media, e o pico de acessos por minuto.',
    requisitos: [
      'Processar sem carregar o arquivo inteiro na memoria',
      'Top 10 sem ordenar a lista completa',
      'Media por acao ignorando linhas malformadas',
      'Relatar quantas linhas foram descartadas e por que',
    ],
    restricoes: ['Java puro', 'Memoria limitada: assuma arquivo maior que a RAM disponivel'],
    oQueAvaliam: [
      { criterio: 'Escolha de estrutura e complexidade', peso: 40 },
      { criterio: 'Streaming em vez de carregar tudo', peso: 30 },
      { criterio: 'Tratamento de dado sujo', peso: 30 },
    ],
    armadilhas: [
      'Files.readAllLines() carrega tudo. Use Files.lines() com try-with-resources.',
      'Ordenar 1 milhao para pegar 10 e O(n log n) quando da para fazer O(n log 10) com uma heap.',
      'Assumir que toda linha esta bem formada. Nao esta — e de proposito.',
    ],
    perguntasDoMentor: [
      'Por que uma PriorityQueue de tamanho 10 e melhor que sort()? Diga a complexidade dos dois.',
      'Files.lines() devolve Stream. O que acontece com o descritor de arquivo se voce nao fechar?',
      'Como voce testa isso sem gerar um arquivo de 1 GB?',
    ],
    criteriosAprovacao: [
      'Uso de min-heap para o top N',
      'Stream fechado corretamente',
      'Linhas invalidas contabilizadas, nao silenciadas',
    ],
  },

  // ------------------------------------------------------------ TAKE-HOME --
  {
    id: 'df-03',
    titulo: 'API de carteira digital',
    estilo: 'Formato fintech (take-home de 5 dias)',
    tipo: 'takehome',
    nivel: 3,
    tempo: '12–16h ao longo de 5 dias',
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
    preRequisitos: ['java-f4-m2', 'java-f4-m3', 'db-f2-m1'],
    contexto:
      'O take-home mais comum em vaga junior de backend no Brasil. Avaliam o REPOSITORIO inteiro, nao so o codigo: commits, README e testes pesam tanto quanto a feature.',
    enunciado:
      'Construa uma API de carteira digital com usuarios comuns e lojistas. Usuarios podem transferir dinheiro entre si e para lojistas; lojistas apenas recebem.',
    requisitos: [
      'Cadastro com nome, CPF/CNPJ, email e senha — CPF/CNPJ e email unicos',
      'POST /transferencia com pagador, recebedor e valor',
      'Lojista nao pode enviar dinheiro, apenas receber',
      'Validar saldo antes de transferir',
      'Consultar um servico autorizador externo antes de concluir (mock)',
      'Se qualquer etapa falhar, a transferencia inteira e revertida',
      'Enviar notificacao apos a transferencia; se o servico de notificacao cair, a transferencia NAO pode falhar',
    ],
    restricoes: [
      'Docker compose subindo API e banco',
      'Migrations versionadas',
      'README com decisoes tecnicas',
    ],
    oQueAvaliam: [
      { criterio: 'Consistencia transacional', peso: 30 },
      { criterio: 'Arquitetura em camadas e testabilidade', peso: 25 },
      { criterio: 'Testes (unitario + integracao)', peso: 20 },
      { criterio: 'README e historico de commits', peso: 15 },
      { criterio: 'Tratamento de erro e status codes', peso: 10 },
    ],
    armadilhas: [
      'O ponto central do desafio e o requisito da notificacao: transferencia concluida NAO pode ser desfeita porque o email falhou. Quem coloca a notificacao dentro da transacao reprova.',
      'Duas requisicoes simultaneas do mesmo pagador podem gastar o mesmo saldo. Pense em lock ou controle otimista.',
      'Regra de negocio dentro do @RestController.',
      'Um unico commit chamado "projeto".',
    ],
    perguntasDoMentor: [
      'Desenhe o fluxo da transferencia ANTES de codar. Onde exatamente comeca e termina a transacao do banco?',
      'A notificacao esta dentro ou fora da transacao? Justifique com o que acontece se o servico de email cair.',
      'Como voce impede que duas requisicoes simultaneas gastem o mesmo saldo? Compare lock pessimista e otimista e escolha.',
      'Que status code voce devolve quando o autorizador externo nega? E quando ele esta fora do ar? Sao o mesmo caso?',
      'Como voce testa o cenario "autorizador fora do ar" sem depender da internet?',
    ],
    criteriosAprovacao: [
      'Notificacao fora da transacao, com falha isolada',
      'Concorrencia tratada explicitamente e documentada no README',
      'Nenhuma regra de negocio no controller',
      'Commits pequenos, descritivos e em ordem logica',
      'docker compose up e a aplicacao sobe',
    ],
  },

  {
    id: 'df-04',
    titulo: 'Importador resiliente de arquivo',
    estilo: 'Formato logistica/varejo (iFood, Loggi)',
    tipo: 'takehome',
    nivel: 3,
    tempo: '8–10h',
    stack: ['Java', 'Spring Boot', 'JPA'],
    preRequisitos: ['java-f3-m3', 'java-f4-m2'],
    contexto: 'Avaliam como voce lida com dado sujo e volume — o problema real de todo backend corporativo.',
    enunciado:
      'Receba um CSV de pedidos por upload, processe de forma assincrona e disponibilize o resultado por um endpoint de status.',
    requisitos: [
      'POST /importacoes devolve 202 com um id de acompanhamento',
      'GET /importacoes/{id} devolve status, total, processados, rejeitados e os erros por linha',
      'Linha invalida nao aborta a importacao inteira',
      'Reenviar o mesmo arquivo nao duplica pedidos (idempotencia)',
      'Suportar arquivo de 500 mil linhas sem estourar memoria',
    ],
    restricoes: ['Processamento assincrono', 'Persistencia em lote, nao linha a linha'],
    oQueAvaliam: [
      { criterio: 'Idempotencia', peso: 30 },
      { criterio: 'Resiliencia a dado invalido', peso: 25 },
      { criterio: 'Uso de memoria e batch', peso: 25 },
      { criterio: 'Contrato da API assincrona', peso: 20 },
    ],
    armadilhas: [
      'Salvar 500 mil entidades uma a uma com o EntityManager segurando tudo em memoria.',
      'Retornar 200 num processamento que ainda nao terminou. O certo e 202.',
      'Idempotencia por nome do arquivo. E fraco: use hash do conteudo ou chave de negocio.',
    ],
    perguntasDoMentor: [
      'O que exatamente define "o mesmo arquivo"? Nome, hash ou chave de negocio de cada linha? Escolha e defenda.',
      'Por que 202 e nao 200? O que muda para quem consome a API?',
      'Onde voce dá flush e clear no EntityManager, e por que isso importa em 500 mil linhas?',
      'Se a aplicacao cair no meio da importacao, o que acontece quando ela voltar?',
    ],
    criteriosAprovacao: [
      'Reenvio do mesmo conteudo nao duplica registro',
      'Memoria estavel durante o processamento',
      'Erros reportados por linha, com o motivo',
    ],
  },

  // ---------------------------------------------------------- LIVE CODING --
  {
    id: 'df-05',
    titulo: 'Cache com expiracao',
    estilo: 'Formato big tech (live coding, 50 min)',
    tipo: 'livecoding',
    nivel: 3,
    tempo: '50 min',
    stack: ['Java', 'Collections', 'Concorrencia'],
    preRequisitos: ['java-f2-m4', 'base-f3-m1'],
    contexto:
      'Alguem observando voce codar. O que avaliam de verdade e o raciocinio em voz alta — candidato que resolve em silencio costuma ser reprovado mesmo acertando.',
    enunciado:
      'Implemente um cache chave-valor com TTL por entrada e capacidade maxima, descartando o item menos recentemente usado quando encher.',
    requisitos: [
      'get(chave) devolve o valor ou vazio se expirou',
      'put(chave, valor, ttl)',
      'Capacidade maxima com politica LRU',
      'Entrada expirada nao pode ocupar espaco para sempre',
      'get em O(1), put em O(1)',
    ],
    restricoes: ['Sem biblioteca de cache pronta', 'Comece single-thread; a versao thread-safe vem depois'],
    oQueAvaliam: [
      { criterio: 'Raciocinio em voz alta', peso: 30 },
      { criterio: 'Escolha de estrutura para O(1)', peso: 30 },
      { criterio: 'Perguntas antes de assumir', peso: 20 },
      { criterio: 'Reacao a dicas do entrevistador', peso: 20 },
    ],
    armadilhas: [
      'Sair codando sem perguntar se pode usar LinkedHashMap.',
      'Varrer o mapa inteiro procurando expirados: vira O(n).',
      'Ficar em silencio quando trava. Diga o que esta pensando.',
      'Ignorar a pergunta de acompanhamento sobre thread-safety.',
    ],
    perguntasDoMentor: [
      'Antes de codar: qual combinacao de estruturas da O(1) em get E em put? Por que uma so nao basta?',
      'Expiracao preguicosa (na leitura) ou ativa (thread limpando)? Qual o custo de cada uma?',
      'Se dois threads chamarem put ao mesmo tempo, o que quebra? Nomeie a estrutura corrompida.',
      'Qual a diferenca entre LRU e LFU, e quando cada uma e melhor?',
    ],
    criteriosAprovacao: [
      'HashMap + lista duplamente encadeada (ou LinkedHashMap com accessOrder)',
      'Explicou a escolha antes de escrever',
      'Discutiu thread-safety quando provocado',
    ],
  },

  // --------------------------------------------------------------- DESIGN --
  {
    id: 'df-06',
    titulo: 'Modelagem: sistema de reservas',
    estilo: 'Formato entrevista de design para junior',
    tipo: 'design',
    nivel: 2,
    tempo: '40 min',
    stack: ['Modelagem', 'SQL', 'REST'],
    preRequisitos: ['db-f1-m1', 'base-f2-m1'],
    contexto:
      'Sem IDE. Papel, quadro branco ou diagrama. Para junior nao esperam escala planetaria — esperam modelagem correta e tradeoffs conscientes.',
    enunciado:
      'Modele um sistema de reserva de salas de reuniao para uma empresa com varios andares e escritorios em cidades diferentes.',
    requisitos: [
      'Diagrama ER com chaves e cardinalidades',
      'Impedir reserva sobreposta na mesma sala',
      'Reserva recorrente (toda terca, por 3 meses)',
      'Cancelamento com historico preservado',
      'Contrato REST dos endpoints principais',
    ],
    restricoes: ['Nada de codigo: so modelo e contrato'],
    oQueAvaliam: [
      { criterio: 'Modelagem e normalizacao', peso: 35 },
      { criterio: 'Tratamento de conflito de horario', peso: 30 },
      { criterio: 'Contrato REST coerente', peso: 20 },
      { criterio: 'Tradeoffs verbalizados', peso: 15 },
    ],
    armadilhas: [
      'Guardar fuso horario errado: escritorios em cidades diferentes e a pegadinha central.',
      'Recorrencia como 90 linhas soltas versus uma regra + excecoes. Os dois sao validos — o erro e nao saber justificar.',
      'DELETE fisico numa entidade que precisa de historico.',
    ],
    perguntasDoMentor: [
      'Voce guarda o horario em qual tipo? Justifique considerando escritorios em fusos diferentes.',
      'A restricao de nao-sobreposicao vive no banco ou na aplicacao? O que acontece com duas requisicoes simultaneas se estiver so na aplicacao?',
      'Recorrencia: materializar as ocorrencias ou guardar a regra? De o tradeoff dos dois em consulta e em alteracao.',
      'Cancelar e DELETE ou PATCH de status? Justifique pelo requisito de historico.',
    ],
    criteriosAprovacao: [
      'Instantes em UTC, com fuso do escritorio guardado a parte',
      'Constraint de exclusao no banco, nao so validacao na aplicacao',
      'Cancelamento sem perda de historico',
    ],
  },

  // ---------------------------------------------------------- CODE REVIEW --
  {
    id: 'df-07',
    titulo: 'Encontre os problemas neste service',
    estilo: 'Formato banco/seguradora (Itau, Bradesco)',
    tipo: 'codereview',
    nivel: 2,
    tempo: '30 min',
    stack: ['Java', 'Spring', 'JPA'],
    preRequisitos: ['java-f4-m2', 'base-f3-m2'],
    contexto:
      'Recebe codigo que "funciona" e precisa apontar o que esta errado. Testa se voce percebe problema que nao quebra em desenvolvimento mas explode em producao.',
    enunciado:
      'Analise o metodo abaixo e liste todos os problemas, classificando cada um como bug, seguranca, performance ou manutencao. Para cada um, diga o impacto em producao.',
    codigo: `@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoRepository repo;
    @Autowired
    private ClienteRepository clienteRepo;

    @GetMapping
    public List<Pedido> listar(@RequestParam String cliente) {
        return repo.findByClienteNome(cliente);
    }

    @PostMapping
    public Pedido criar(@RequestBody Pedido pedido) {
        Cliente c = clienteRepo.findById(pedido.getClienteId()).get();
        double total = 0;
        for (ItemPedido item : pedido.getItens()) {
            total += item.getPreco() * item.getQuantidade();
        }
        if (c.getLimite() > total) {
            pedido.setTotal(total);
            pedido.setStatus("APROVADO");
        } else {
            pedido.setStatus("REPROVADO");
        }
        return repo.save(pedido);
    }

    @GetMapping("/relatorio")
    public String relatorio() {
        String r = "";
        for (Pedido p : repo.findAll()) {
            r += p.getId() + ";" + p.getCliente().getNome() + ";" + p.getTotal() + "\\n";
        }
        return r;
    }
}`,
    requisitos: [
      'Listar cada problema com categoria e impacto',
      'Ordenar por gravidade',
      'Propor a correcao de cada um',
    ],
    restricoes: ['Sem rodar o codigo: leitura apenas'],
    oQueAvaliam: [
      { criterio: 'Quantidade de problemas reais encontrados', peso: 40 },
      { criterio: 'Classificacao correta da gravidade', peso: 30 },
      { criterio: 'Qualidade da correcao proposta', peso: 30 },
    ],
    armadilhas: [
      'Parar nos problemas de estilo e nao ver o N+1 do relatorio.',
      'Nao perceber que expor a entidade Pedido direto e problema de contrato E de seguranca.',
      'Deixar passar o .get() no Optional.',
    ],
    perguntasDoMentor: [
      'Encontrou quantos? Se listou menos de 8, releia — tem mais.',
      'Qual problema derruba a aplicacao primeiro em producao, e por que esse antes dos outros?',
      'O relatorio funciona com 10 pedidos. Por que ele quebra com 100 mil? Sao dois motivos distintos.',
      'Regra de negocio esta no lugar certo? Onde deveria estar?',
    ],
    criteriosAprovacao: [
      'Achou o N+1 no relatorio (p.getCliente() dispara query por pedido)',
      'Achou a concatenacao de String em laco',
      'Achou o Optional.get() sem tratamento',
      'Achou a entidade exposta na API e a ausencia de DTO',
      'Achou a falta de paginacao no findAll',
      'Achou o double em valor monetario',
      'Achou a regra de negocio no controller',
      'Achou a comparacao > que deveria ser >=',
      'Achou a ausencia de @Transactional na criacao',
    ],
  },

  // ----------------------------------------------------------------- DEBUG --
  {
    id: 'df-08',
    titulo: 'A API ficou lenta depois do deploy',
    estilo: 'Formato entrevista de troubleshooting',
    tipo: 'debug',
    nivel: 3,
    tempo: '35 min',
    stack: ['Java', 'Spring', 'SQL'],
    preRequisitos: ['db-f2-m1', 'java-f3-m3'],
    contexto:
      'Cenario de producao. Avaliam metodo de investigacao, nao adivinhacao. Chutar "vou por um cache" reprova.',
    enunciado:
      'Depois de um deploy, o endpoint GET /pedidos passou de 120ms para 8 segundos. Nada mudou na infraestrutura. O volume de dados cresceu 3x no ultimo mes. Conduza a investigacao.',
    requisitos: [
      'Liste em ordem o que voce checa, e o que cada checagem descarta',
      'Diga qual metrica confirma ou elimina cada hipotese',
      'Chegue na causa raiz, nao no sintoma',
      'Proponha correcao imediata e correcao definitiva',
    ],
    restricoes: ['Voce tem acesso a logs, metricas e ao banco. Nao pode reverter o deploy.'],
    oQueAvaliam: [
      { criterio: 'Metodo investigativo', peso: 45 },
      { criterio: 'Separar causa de sintoma', peso: 30 },
      { criterio: 'Correcao proporcional', peso: 25 },
    ],
    armadilhas: [
      'Comecar por "coloco um cache". Isso esconde o problema e cria bug de dado velho.',
      'Culpar o volume de dados sem provar. 3x nao explica 60x mais lento sozinho — isso e cheiro de complexidade quadratica ou N+1.',
      'Nao olhar o SQL gerado.',
    ],
    perguntasDoMentor: [
      'Antes de qualquer hipotese: e lento sempre ou so sob carga? Como voce descobre isso?',
      '3x mais dados e 60x mais lento. O que essa desproporcao te diz sobre a complexidade da operacao?',
      'Qual a PRIMEIRA coisa que voce olha: log de SQL, metrica de CPU, ou plano de execucao? Justifique a ordem.',
      'Achou a causa. Qual a correcao imediata e qual a definitiva? Elas sao a mesma?',
    ],
    criteriosAprovacao: [
      'Mediu antes de mexer',
      'Olhou o SQL gerado e o plano de execucao',
      'Identificou N+1 ou indice ausente como hipotese principal',
      'Cache aparece como ultimo recurso, nao primeiro',
    ],
  },
]

export const NIVEIS_DESAFIO = { 1: 'Aquecimento', 2: 'Nivel real', 3: 'Nivel alto' }
