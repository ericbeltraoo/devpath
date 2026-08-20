// Exercicios dos modulos Java das secoes 4 a 13 do curso.
// Ver exerciciosModulos.js para o contrato dos campos.

export const JAVA_BASE = {
  // =========================================================================
  // S4 — Sintaxe, tipos e operadores
  // =========================================================================
  'java-f1-m1': [
    {
      nivel: 1,
      titulo: 'Calculadora de troco',
      tempo: '30 min',
      contexto: 'Caixa de supermercado. O clássico para fixar divisão inteira e resto.',
      enunciado:
        'Leia o valor da compra e o valor pago. Calcule o troco e diga quantas notas de 100, 50, 20, 10, 5, 2 e moedas de 1 real devem ser devolvidas, sempre usando a menor quantidade de cédulas.',
      requisitos: [
        'Entrada com Scanner',
        'Rejeitar valor pago menor que a compra',
        'Divisão inteira e resto para decompor o troco',
        'Saída formatada com printf e 2 casas decimais',
      ],
      criteriosAceite: [
        'Troco de R$ 187 devolve 1x100, 1x50, 1x20, 1x10, 1x5, 1x2',
        'Locale correto: separador decimal não sai errado',
        'Pagamento exato imprime "sem troco"',
      ],
      dicas: ['Trabalhe em centavos (int) para não sofrer com arredondamento de double'],
      revisa: [],
    },
    {
      nivel: 2,
      titulo: 'Cálculo de comissão de vendedor',
      tempo: '45 min',
      contexto: 'Sistema de RH. Regras de faixa são o cálculo mais comum em software corporativo.',
      enunciado:
        'Dado o valor vendido no mês, calcule a comissão: 3% até R$ 10 mil, 5% na parte entre 10 mil e 30 mil, 8% no que passar de 30 mil. A alíquota é progressiva, ou seja, incide por faixa — não é a alíquota da faixa final aplicada ao total.',
      requisitos: [
        'Cálculo progressivo por faixa, não por alíquota única',
        'Exibir o valor de cada faixa separadamente',
        'Descontar INSS de 11% sobre a comissão',
        'Saída em formato de contracheque, alinhada',
      ],
      criteriosAceite: [
        'Venda de R$ 40 mil gera comissão de R$ 2.100 (300 + 1000 + 800)',
        'Venda de R$ 5 mil gera R$ 150',
        'Nenhum número mágico solto: as faixas são constantes nomeadas',
      ],
      dicas: [
        'Progressivo é igual ao imposto de renda: cada faixa tem sua alíquota, e você soma as partes.',
        'Se sua conta dá 8% sobre os 40 mil inteiros, você entendeu errado o enunciado.',
      ],
      revisa: [],
    },
    {
      nivel: 3,
      titulo: 'Simulador de financiamento (nível entrevista)',
      tempo: '1h30',
      contexto: 'Fintech. Cai como triagem online porque separa quem sabe modelar de quem só sabe sintaxe.',
      enunciado:
        'Simule um financiamento pela Tabela Price: dado valor, taxa mensal e número de parcelas, calcule a parcela fixa e imprima a tabela de amortização mês a mês, com juros, amortização e saldo devedor.',
      requisitos: [
        'Fórmula da Price com Math.pow',
        'Tabela mês a mês com 4 colunas alinhadas',
        'Total pago e total de juros ao final',
        'Validar entradas: taxa negativa e parcelas zero são rejeitadas',
      ],
      criteriosAceite: [
        'A soma das amortizações fecha exatamente com o valor financiado',
        'O saldo devedor termina em zero (tolerância de centavos)',
        'A tabela permanece alinhada com valores de 6 dígitos',
      ],
      dicas: [
        'Se o saldo final não zera, o erro está no arredondamento — decida onde arredondar ANTES de codar.',
      ],
      revisa: [],
    },
  ],

  // =========================================================================
  // S6 — Estruturas de controle
  // =========================================================================
  'java-f1-m2': [
    {
      nivel: 1,
      titulo: 'Validador de entrada resiliente',
      tempo: '30 min',
      contexto: 'Toda aplicação de console real precisa disso, e quase todo iniciante ignora.',
      enunciado:
        'Peça ao usuário uma nota de 0 a 10. Se digitar fora da faixa, avise e peça de novo, quantas vezes forem necessárias. Ao final, leia 5 notas válidas e mostre média, maior e menor.',
      requisitos: [
        'Laço que só sai com entrada válida',
        'Contador de tentativas inválidas',
        'Média com 2 casas decimais',
      ],
      criteriosAceite: [
        'Digitar -1, 15 e depois 7 aceita apenas o 7',
        'O programa nunca encerra por entrada inválida',
      ],
      dicas: ['do-while é o laço natural aqui: você sempre pede pelo menos uma vez'],
      revisa: ['java-f1-m1'],
    },
    {
      nivel: 2,
      titulo: 'Terminal de autoatendimento',
      tempo: '1h',
      contexto: 'Caixa eletrônico. É o exercício de menu que aparece em prova de estágio.',
      enunciado:
        'Menu com: consultar saldo, depositar, sacar, extrato e sair. O saque só permite valores múltiplos de 10, respeita o saldo e cobra R$ 1 de tarifa a partir do 4º saque do mês.',
      requisitos: [
        'Laço principal que só encerra na opção sair',
        'Opção inválida não quebra nem sai do menu',
        'Extrato lista as operações na ordem em que ocorreram',
        'Contador de saques com a regra da tarifa',
      ],
      criteriosAceite: [
        'Sacar R$ 55 é recusado com mensagem clara',
        'O 4º saque desconta R$ 1 a mais',
        'Saldo nunca fica negativo',
      ],
      dicas: ['Guarde o extrato em String concatenada por enquanto — nos módulos seguintes isso vira lista.'],
      revisa: ['java-f1-m1'],
    },
    {
      nivel: 3,
      titulo: 'Fechamento de folha de ponto',
      tempo: '1h30',
      contexto: 'Sistema de RH. Regra real, com as pegadinhas reais.',
      enunciado:
        'Leia N registros de ponto no formato "dia entrada saida" (horas inteiras). Calcule horas trabalhadas por dia, desconte 1h de almoço quando o dia passar de 6h, some as horas do mês e aponte horas extras acima de 220h, pagas com adicional de 50%.',
      requisitos: [
        'Laço aninhado ou acumulador por dia',
        'Regra do almoço aplicada condicionalmente',
        'Dias com saída menor que entrada são rejeitados como inválidos',
        'Relatório final com total, extras e valor a receber',
      ],
      criteriosAceite: [
        'Um dia de 6h exatas NÃO desconta almoço; 6h01 desconta',
        'Registro inválido não entra na soma e é reportado',
        'Zero registros produz relatório zerado, sem divisão por zero',
      ],
      dicas: [
        'A regra "acima de 6h" tem borda em 6h exatas. Decida o comportamento e escreva no código, não deixe implícito.',
      ],
      revisa: ['java-f1-m1'],
    },
  ],

  // =========================================================================
  // S7 — Métodos e boas práticas
  // =========================================================================
  'java-f1-m5': [
    {
      nivel: 1,
      titulo: 'Quebrar o main gigante',
      tempo: '30 min',
      contexto: 'Refatoração é o que você mais vai fazer profissionalmente.',
      enunciado:
        'Pegue o SEU terminal de autoatendimento do módulo anterior e refatore: nenhum método pode passar de 15 linhas, e o main deve ter no máximo 10.',
      requisitos: [
        'Um método por operação: sacar, depositar, extrato',
        'Métodos de validação separados dos de ação',
        'Nomes que dizem o que fazem, sem comentário explicando',
      ],
      criteriosAceite: [
        'O comportamento é idêntico ao de antes',
        'Nenhum método faz duas coisas',
        'Dá para ler o main e entender o programa inteiro',
      ],
      dicas: ['Se o nome do método precisa de "e" no meio, ele faz duas coisas.'],
      revisa: ['java-f1-m2'],
    },
    {
      nivel: 2,
      titulo: 'Biblioteca de validação de documentos',
      tempo: '1h15',
      contexto: 'Todo sistema brasileiro valida CPF. É pergunta de entrevista júnior.',
      enunciado:
        'Crie métodos estáticos de validação: CPF (com dígito verificador), email (formato básico), telefone e data no formato dd/MM/yyyy. Use sobrecarga para aceitar CPF com e sem máscara.',
      requisitos: [
        'validarCpf(String) e validarCpf(long) por sobrecarga',
        'Algoritmo real do dígito verificador, não só contagem de caracteres',
        'Rejeitar CPFs de dígitos repetidos (111.111.111-11)',
        'Cada método faz uma coisa e retorna boolean',
      ],
      criteriosAceite: [
        'CPF válido conhecido passa; um dígito trocado reprova',
        '000.000.000-00 é rejeitado',
        'A versão com e sem máscara dá o mesmo resultado',
      ],
      dicas: ['O dígito verificador do CPF é o exercício de laço mais cobrado do Brasil. Faça na mão, não copie.'],
      revisa: ['java-f1-m1', 'java-f1-m2'],
    },
    {
      nivel: 3,
      titulo: 'Motor de cálculo de frete',
      tempo: '1h30',
      contexto: 'E-commerce. Enunciado em cima de regra composta, como no mercado.',
      enunciado:
        'Calcule o frete a partir de peso, dimensões, CEP de origem e destino e modalidade (econômico, expresso). Considere peso cubado (quando maior que o peso real), acréscimo por região e desconto progressivo por valor do pedido.',
      requisitos: [
        'Peso cubado = (C x L x A) / 6000, e vale o maior entre ele e o peso real',
        'Sobrecarga: calcularFrete com e sem modalidade (padrão econômico)',
        'Método separado para cada regra, e um que orquestra',
        'Nenhum método com mais de 3 parâmetros — agrupe o que for coeso',
      ],
      criteriosAceite: [
        'Caixa grande e leve cobra pelo cubado',
        'Trocar a tabela de preço exige mudar um método só',
        'O método orquestrador tem menos de 10 linhas e se lê como texto',
      ],
      dicas: [
        'Se você já sente falta de um objeto para agrupar peso e dimensões, é exatamente o que o próximo módulo resolve.',
      ],
      revisa: ['java-f1-m1', 'java-f1-m2'],
    },
  ],

  // =========================================================================
  // S9 — Classes, objetos e encapsulamento
  // =========================================================================
  'java-f2-m1': [
    {
      nivel: 1,
      titulo: 'Produto que protege o próprio preço',
      tempo: '40 min',
      contexto: 'A diferença entre encapsulamento de verdade e getter/setter automático.',
      enunciado:
        'Modele Produto com nome, preço e estoque. Preço não pode ser negativo, estoque não pode ficar negativo, e não deve existir setPreco nem setEstoque públicos: só operações de negócio.',
      requisitos: [
        'Construtor que valida e não deixa nascer objeto inválido',
        'reajustar(double percentual) em vez de setPreco',
        'darBaixa(int qtd) e repor(int qtd) em vez de setEstoque',
        'toString formatado',
      ],
      criteriosAceite: [
        'Não existe caminho no código que deixe estoque negativo',
        'Reajuste de -200% é recusado',
        'Nenhum setter de preço ou estoque na classe',
      ],
      dicas: ['Para cada setter que você for criar, pergunte: que regra quebra se alguém mudar isso direto?'],
      revisa: ['java-f1-m5'],
    },
    {
      nivel: 2,
      titulo: 'Carrinho de compras',
      tempo: '1h15',
      contexto: 'E-commerce. Primeiro exercício em que objetos colaboram entre si.',
      enunciado:
        'Modele ItemCarrinho e Carrinho. O carrinho adiciona, remove e altera quantidade, calcula subtotal, aplica cupom de desconto e dá o total. Adicionar um produto que já está no carrinho soma a quantidade em vez de duplicar a linha.',
      requisitos: [
        'Item guarda o preço no momento da adição, não uma referência viva ao produto',
        'Carrinho não expõe a lista interna para alteração externa',
        'Cupom percentual e cupom de valor fixo',
        'Remover item inexistente não quebra',
      ],
      criteriosAceite: [
        'Reajustar o preço do Produto NÃO altera o total de um carrinho já montado',
        'Adicionar o mesmo produto duas vezes gera uma linha com quantidade 2',
        'Desconto nunca deixa o total negativo',
      ],
      dicas: [
        'O requisito do preço congelado é o mesmo do e-commerce real, e é a pegadinha central deste exercício.',
      ],
      revisa: ['java-f1-m5', 'java-f1-m3'],
    },
    {
      nivel: 3,
      titulo: 'Reserva de sala com invariantes',
      tempo: '2h',
      contexto: 'Formato de teste técnico: modelagem sob regras que conflitam entre si.',
      enunciado:
        'Modele Sala, Reserva e AgendaDeSalas. Uma sala não pode ter duas reservas sobrepostas, reserva tem duração mínima de 30 min e máxima de 4h, e o cancelamento preserva histórico.',
      requisitos: [
        'A regra de sobreposição vive dentro da agenda, não em quem chama',
        'Estado da reserva controlado, sem String solta',
        'Cancelar não remove: marca',
        'Consultar disponibilidade de uma sala num intervalo',
      ],
      criteriosAceite: [
        'Reservar 14h-15h e depois 14h30-15h30 na mesma sala é recusado',
        'Reservar 14h-15h em salas diferentes é permitido',
        'Reserva cancelada libera o horário mas continua no histórico',
      ],
      dicas: [
        'Dois intervalos colidem se inicioA < fimB E inicioB < fimA. Desenhe os quatro casos no papel antes de codar.',
      ],
      revisa: ['java-f1-m5', 'java-f1-m2'],
    },
  ],

  // =========================================================================
  // S10 — Arrays, listas e Strings
  // =========================================================================
  'java-f1-m3': [
    {
      nivel: 1,
      titulo: 'Boletim da turma',
      tempo: '40 min',
      contexto: 'Fixação de percurso de vetor e cálculo agregado.',
      enunciado:
        'Leia as notas de N alunos, calcule média da turma, maior e menor nota, quantos ficaram acima da média e o desvio em relação a ela.',
      requisitos: [
        'Vetor de notas e vetor de nomes em paralelo',
        'Uma passada para a média, outra para as comparações',
        'Listar quem ficou acima da média',
      ],
      criteriosAceite: [
        'Turma de 1 aluno não quebra',
        'Empate na maior nota lista os dois',
      ],
      dicas: ['Vetores paralelos funcionam aqui e vão te incomodar no próximo exercício — de propósito.'],
      revisa: ['java-f1-m2', 'java-f1-m5'],
    },
    {
      nivel: 2,
      titulo: 'Importador de CSV de pedidos',
      tempo: '1h15',
      contexto: 'Ler arquivo de terceiro é rotina em backend, e o dado nunca vem limpo.',
      enunciado:
        'Dado um vetor de Strings no formato "id;cliente;produto;quantidade;preco", faça o parse para objetos, some o faturamento, encontre o produto mais vendido e reporte as linhas inválidas com o motivo.',
      requisitos: [
        'split e conversão de tipo com tratamento de erro',
        'Linha com campo faltando ou número inválido não derruba o processamento',
        'Relatório final: processadas, rejeitadas e motivo de cada rejeição',
        'Ignorar espaços sobrando com trim',
      ],
      criteriosAceite: [
        'Uma linha malformada no meio não impede as demais de serem processadas',
        'Quantidade negativa é rejeitada, não somada',
        'O relatório diz QUAL linha falhou e por quê',
      ],
      dicas: ['Nunca confie em dado externo. Esta é a lição do exercício, não o split.'],
      revisa: ['java-f2-m1', 'java-f1-m5', 'java-f1-m2'],
    },
    {
      nivel: 3,
      titulo: 'Mapa de vendas por região e mês',
      tempo: '1h45',
      contexto: 'Relatório gerencial: matriz é a estrutura natural, e quase ninguém pensa nisso primeiro.',
      enunciado:
        'Monte uma matriz [região][mês] de faturamento. Calcule total por região, total por mês, a região que mais cresceu entre o primeiro e o último mês, e imprima a matriz formatada com totais nas bordas.',
      requisitos: [
        'Matriz preenchida a partir de uma lista de vendas',
        'Somatórios por linha e por coluna',
        'Crescimento percentual entre primeiro e último mês',
        'Impressão alinhada, com cabeçalho de meses',
      ],
      criteriosAceite: [
        'Região sem venda no primeiro mês não gera divisão por zero',
        'Os totais de linha e coluna batem com o total geral',
        'A tabela permanece legível com valores de 7 dígitos',
      ],
      dicas: ['Crescimento a partir de zero não é infinito: decida a regra e documente no código.'],
      revisa: ['java-f2-m1', 'java-f1-m5', 'java-f1-m1'],
    },
  ],

  // =========================================================================
  // S11 — Data e hora  ← MODULO ATUAL
  // =========================================================================
  'java-f1-m4': [
    {
      nivel: 1,
      titulo: 'DataUtils',
      tempo: '1h',
      contexto: 'A base que todo sistema precisa. Faça esta antes de qualquer outra coisa.',
      enunciado:
        'Classe utilitária com: idade exata em anos, dias entre duas datas, dias úteis entre duas datas, conversão de Instant para o fuso de São Paulo, e formatação/parse no padrão brasileiro.',
      requisitos: [
        'idadeEmAnos(LocalDate): int',
        'diasUteisEntre(LocalDate, LocalDate): long — ignorando sábado e domingo',
        'paraFusoSaoPaulo(Instant): ZonedDateTime',
        'formatarBR e parseBR com DateTimeFormatter',
        'Zero uso de Date ou Calendar',
      ],
      criteriosAceite: [
        'Nascimento em 29/02 calcula idade sem erro',
        'diasUteisEntre da sexta para a segunda devolve 1',
        'parseBR de "31/02/2026" falha de forma controlada, não com exceção crua',
      ],
      dicas: ['Period para idade, ChronoUnit para diferença em dias. Se você usou DAYS/365, refaça.'],
      revisa: ['java-f1-m5'],
    },
    {
      nivel: 2,
      titulo: 'SLA de chamados de suporte',
      tempo: '1h30',
      contexto: 'Help desk. Cálculo de SLA em horário comercial é pedido real e cheio de borda.',
      enunciado:
        'Cada chamado tem abertura, prioridade e prazo em horas úteis. Calcule o vencimento considerando apenas horário comercial (9h às 18h, seg a sex) e diga quais estão vencidos e por quanto tempo.',
      requisitos: [
        'Prazo contado em horas ÚTEIS, pulando noite e fim de semana',
        'Chamado aberto às 17h com 2h de prazo vence às 10h do dia seguinte',
        'Chamado aberto sábado começa a contar segunda às 9h',
        'Relatório ordenado por tempo de atraso',
      ],
      criteriosAceite: [
        'Abertura fora do horário comercial não consome prazo',
        'Feriado cadastrado é tratado como não-útil',
        'Atraso apresentado em horas e minutos, não em decimal',
      ],
      dicas: [
        'Não tente resolver com uma fórmula. Avance hora a hora, ou dia a dia com resto — é mais simples e mais correto.',
      ],
      revisa: ['java-f2-m1', 'java-f1-m3', 'java-f1-m5'],
    },
    {
      nivel: 3,
      titulo: 'Agenda de consultas multi-fuso',
      tempo: '2h',
      contexto: 'Telemedicina. Formato de teste técnico em empresa com operação nacional.',
      enunciado:
        'Pacientes e médicos podem estar em fusos diferentes. Agende consultas evitando conflito na agenda do médico, exiba o horário no fuso de cada parte e permita remarcar respeitando antecedência mínima de 24h.',
      requisitos: [
        'Instante armazenado em UTC; fuso guardado por pessoa',
        'Conflito verificado no fuso do médico',
        'Exibição no fuso local de quem consulta',
        'Remarcar com menos de 24h é recusado',
        'Relatório do dia na agenda do médico',
      ],
      criteriosAceite: [
        'Consulta às 14h em SP aparece como 13h para paciente em Manaus, e é o mesmo Instant',
        'Duas consultas no mesmo horário do mesmo médico são recusadas mesmo vindo de fusos diferentes',
        'A antecedência de 24h é calculada em tempo absoluto, não em data local',
      ],
      dicas: [
        'Se em algum ponto você comparar LocalDateTime de fusos diferentes, o bug já entrou. Compare Instant.',
      ],
      revisa: ['java-f2-m1', 'java-f1-m3', 'java-f1-m5', 'java-f1-m2'],
    },
  ],

  // =========================================================================
  // S12 — Enumerações e composição
  // =========================================================================
  'java-f2-m6': [
    {
      nivel: 1,
      titulo: 'Status de pedido com comportamento',
      tempo: '40 min',
      contexto: 'Substituir String mágica por enum é a refatoração mais comum em código legado.',
      enunciado:
        'Crie o enum StatusPedido (aguardando pagamento, pago, separando, enviado, entregue, cancelado) com atributos: descrição amigável, se permite cancelamento e se é estado final.',
      requisitos: [
        'Enum com construtor e atributos',
        'Métodos podeCancelar() e ehFinal()',
        'Método que lista os status a partir dos quais é possível cancelar',
        'Nenhum if comparando texto',
      ],
      criteriosAceite: [
        'Adicionar um status novo não exige alterar nenhum if existente',
        'Status final não permite cancelamento',
      ],
      dicas: ['Persistir enum pelo ordinal() quebra ao inserir valor no meio. Use o nome.'],
      revisa: ['java-f2-m1'],
    },
    {
      nivel: 2,
      titulo: 'Máquina de estados do pedido',
      tempo: '1h15',
      contexto: 'Regra de transição de estado é onde mais nasce bug em e-commerce.',
      enunciado:
        'Implemente as transições válidas: de aguardando pagamento só vai para pago ou cancelado; de pago só para separando ou cancelado; e assim por diante. Toda transição registra data e usuário no histórico.',
      requisitos: [
        'O próprio enum sabe para quais estados pode transitar',
        'Transição inválida é recusada com mensagem clara',
        'Histórico com data-hora de cada mudança',
        'Consultar quanto tempo o pedido ficou em cada estado',
      ],
      criteriosAceite: [
        'Ir de entregue para pago é recusado',
        'O histórico permite reconstruir a linha do tempo completa',
        'Tempo em cada estado é calculado com java.time, não com long de milissegundos',
      ],
      dicas: ['Um EnumSet ou um Set dentro do próprio enum resolve as transições sem switch gigante.'],
      revisa: ['java-f1-m4', 'java-f2-m1', 'java-f1-m3'],
    },
    {
      nivel: 3,
      titulo: 'Planos de assinatura com composição',
      tempo: '2h',
      contexto: 'SaaS. Testa se você sabe compor em vez de herdar — pergunta de design em entrevista.',
      enunciado:
        'Modele planos (Free, Pro, Enterprise) com limites diferentes, ciclo de cobrança mensal ou anual com desconto, upgrade e downgrade com cálculo proporcional, e histórico de faturas.',
      requisitos: [
        'Plano e Ciclo como enums com regras próprias',
        'Assinatura COMPÕE plano, ciclo e histórico — não herda de nada',
        'Upgrade no meio do ciclo cobra a diferença proporcional aos dias restantes',
        'Downgrade só vale no próximo ciclo',
        'Gerar fatura com vencimento correto',
      ],
      criteriosAceite: [
        'Upgrade no dia 15 de um ciclo de 30 dias cobra metade da diferença',
        'Trocar de plano não perde o histórico de faturas',
        'Adicionar um 4º plano não exige tocar na classe Assinatura',
      ],
      dicas: [
        'Se você criou PlanoPro extends Plano, parou e releia: plano é dado com regra, não hierarquia de tipos.',
      ],
      revisa: ['java-f1-m4', 'java-f2-m1', 'java-f1-m3', 'java-f1-m5'],
    },
  ],

  // =========================================================================
  // S13 — Herança e polimorfismo
  // =========================================================================
  'java-f2-m2': [
    {
      nivel: 1,
      titulo: 'Hierarquia de contas bancárias',
      tempo: '1h',
      contexto: 'O exercício de POO mais cobrado em prova de faculdade e entrevista júnior.',
      enunciado:
        'Conta abstrata com saldo e titular. ContaCorrente cobra R$ 5 por saque; ContaPoupanca não permite saldo negativo; ContaSalario limita a 3 saques por mês.',
      requisitos: [
        'Classe abstrata com método sacar() que delega a validação às filhas',
        'Uma List<Conta> processa saques de todos os tipos sem instanceof',
        'BigDecimal para dinheiro',
        'equals e hashCode pelo número da conta',
      ],
      criteriosAceite: [
        'Adicionar um 4º tipo não exige mudar o código que processa a lista',
        'Nenhum instanceof no código de negócio',
        'Saque acima do permitido é recusado por cada regra específica',
      ],
      dicas: ['Template Method: sacar() na abstrata chama validarSaque() abstrato. Esse é o padrão esperado.'],
      revisa: ['java-f2-m1', 'java-f2-m6'],
    },
    {
      nivel: 2,
      titulo: 'Folha de pagamento polimórfica',
      tempo: '1h30',
      contexto: 'RH. Cada tipo de contratação tem regra própria — caso didático perfeito de polimorfismo.',
      enunciado:
        'Calcule o pagamento de CLT (salário fixo, desconto de INSS e IRRF), PJ (valor da nota, sem desconto) e horista (horas x valor/hora, com adicional de 50% nas extras). Gere a folha do mês inteiro.',
      requisitos: [
        'Funcionario abstrato com calcularPagamento() abstrato',
        'Faixas de INSS e IRRF em constantes, não espalhadas',
        'Horista usa as horas trabalhadas do período (java.time)',
        'Relatório com total da folha e total por tipo',
      ],
      criteriosAceite: [
        'A lista de funcionários é percorrida uma vez, sem verificar tipo',
        'Mudar a tabela do INSS afeta um lugar só',
        'Funcionário sem horas registradas não quebra o cálculo',
      ],
      dicas: ['Se apareceu um switch pelo tipo de contratação, o comportamento está no lugar errado.'],
      revisa: ['java-f1-m4', 'java-f2-m1', 'java-f2-m6', 'java-f1-m3'],
    },
    {
      nivel: 3,
      titulo: 'Tarifação de transporte (nível entrevista)',
      tempo: '2h30',
      contexto: 'Mobilidade urbana. Formato de take-home de vaga júnior em startup de logística.',
      enunciado:
        'Calcule a tarifa de corridas para tipos diferentes de veículo (moto, carro comum, carro executivo, van), com preço base, por km, por minuto, tarifa dinâmica em horário de pico e desconto para assinantes.',
      requisitos: [
        'Hierarquia de veículos com regra de tarifa por tipo',
        'Multiplicador de pico calculado por faixa de horário (java.time)',
        'Desconto de assinante aplicado por composição, não por herança',
        'Tarifa mínima garantida por tipo',
        'Relatório de faturamento por tipo de veículo',
      ],
      criteriosAceite: [
        'Corrida curta em van respeita a tarifa mínima da van',
        'Corrida às 18h30 de terça aplica pico; às 18h30 de domingo, não',
        'Adicionar "bicicleta" exige apenas uma classe nova',
        'Assinante e tipo de veículo se combinam sem explosão de subclasses',
      ],
      dicas: [
        'Se você pensou em VanAssinante extends Van, pare: são dois eixos independentes. Um é herança, outro é composição.',
      ],
      revisa: ['java-f1-m4', 'java-f2-m1', 'java-f2-m6', 'java-f1-m3', 'java-f1-m5'],
    },
  ],
}

