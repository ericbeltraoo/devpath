// ---------------------------------------------------------------------------
// LINKEDIN — tutorial + criterios do avaliador
// ---------------------------------------------------------------------------

export const SECOES_LINKEDIN = [
  {
    id: 'ln-foto',
    ordem: 1,
    titulo: 'Foto de perfil',
    porqueImporta:
      'Perfil com foto recebe muito mais visualizacoes. Recrutador bate o olho na foto antes de ler qualquer palavra.',
    comoFazer: [
      'Rosto ocupando 60% do quadro, olhando para a camera',
      'Fundo neutro e limpo (parede lisa serve)',
      'Luz natural de FRENTE, nunca contra a janela',
      'Roupa: o que voce usaria no primeiro dia de trabalho',
      'Expressao aberta — sorriso leve funciona melhor que serio',
      'Celular no modo retrato, apoiado, com timer. Nao precisa de fotografo.',
    ],
    evite: [
      'Selfie de carro, academia ou espelho',
      'Foto recortada de festa (da para ver o ombro de alguem)',
      'Oculos escuros, bone, filtro pesado',
      'Foto com menos de 400x400px ou desfocada',
      'Logo, avatar ou personagem no lugar do rosto',
    ],
  },
  {
    id: 'ln-banner',
    ordem: 2,
    titulo: 'Banner (capa)',
    porqueImporta:
      'E o maior espaco visual do perfil e 90% dos candidatos deixam o cinza padrao. Um banner simples ja te diferencia.',
    comoFazer: [
      'Tamanho 1584x396px',
      'Pode conter: sua stack principal, GitHub, ou uma frase curta de posicionamento',
      'Mantenha o lado esquerdo limpo — a foto de perfil cobre essa area',
      'Contraste alto para o texto ser legivel no celular',
      'Canva tem template gratuito de "LinkedIn banner developer"',
    ],
    evite: [
      'Deixar o banner cinza padrao',
      'Poluir com 10 logos de tecnologia',
      'Texto pequeno demais (ninguem le no celular)',
      'Imagem generica de banco de imagens com codigo verde na tela',
    ],
  },
  {
    id: 'ln-headline',
    ordem: 3,
    titulo: 'Headline (o texto abaixo do nome)',
    porqueImporta:
      'E o campo com MAIOR peso na busca do recrutador. Ele aparece em todo lugar: busca, comentario, convite, mensagem. Se so der para arrumar uma coisa no perfil, arrume esta.',
    comoFazer: [
      'Formula: [Cargo alvo] | [Stack principal] | [Diferencial ou objetivo]',
      'Use as palavras-chave exatas que aparecem nas vagas que voce quer',
      'Ate 220 caracteres — use pelo menos 100',
      'Escreva o cargo que voce BUSCA, nao apenas o que voce e hoje',
    ],
    exemplos: {
      ruim: 'Estudante | Em busca de oportunidades',
      medio: 'Desenvolvedor Java | Estudante de programacao',
      bom:
        'Desenvolvedor Backend Java | Spring Boot, PostgreSQL, Docker | Em transicao de carreira com projetos publicados no GitHub',
    },
    evite: [
      'So "Estudante" ou so "Em busca de recolocacao"',
      'Emoji demais',
      '"Apaixonado por tecnologia" sem nenhuma tecnologia citada',
      'Deixar o padrao que o LinkedIn preenche com o cargo atual',
    ],
  },
  {
    id: 'ln-sobre',
    ordem: 4,
    titulo: 'Sobre (resumo)',
    porqueImporta:
      'E onde voce explica sua transicao e conecta os pontos. Recrutador le os 3 primeiros renglones antes de clicar em "ver mais" — o gancho tem que estar ali.',
    comoFazer: [
      'Escreva em primeira pessoa, tom profissional mas humano',
      'Paragrafo 1: quem voce e hoje e o que busca (o gancho)',
      'Paragrafo 2: sua stack e o que voce ja construiu, com exemplo concreto',
      'Paragrafo 3: o que traz da carreira anterior (habilidade transferivel)',
      'Paragrafo 4: chamada para acao + contato + link do GitHub',
      'Repita as palavras-chave da vaga (o algoritmo de busca le esse campo)',
      '4 a 6 linhas por paragrafo, com espaco entre eles — bloco unico ninguem le',
    ],
    exemplos: {
      bom:
        'Estou em transicao para desenvolvimento backend e, nos ultimos meses, tenho estudado Java de forma estruturada e ' +
        'construido projetos reais em vez de so acompanhar aulas.\n\n' +
        'Hoje trabalho com Java 17, Spring Boot, JPA/Hibernate e PostgreSQL. Meu projeto mais recente e uma API REST de ' +
        'gestao de emprestimos, com autenticacao JWT, testes automatizados, Docker e deploy — o codigo e a documentacao ' +
        'estao publicos no meu GitHub.\n\n' +
        'Venho de [area anterior], onde aprendi a lidar com prazo, processo e comunicacao com areas diferentes. ' +
        'Isso me ajuda a entender o problema antes de sair codando.\n\n' +
        'Busco minha primeira oportunidade como desenvolvedor junior. Aberto a conversar: [email] | github.com/[seu-usuario]',
    },
    evite: [
      'Deixar vazio (erro mais grave do perfil inteiro)',
      'Copiar texto motivacional generico da internet',
      'Bloco unico de 15 linhas sem paragrafo',
      'Falar so de sonho e paixao, sem citar uma tecnologia',
    ],
  },
  {
    id: 'ln-experiencia',
    ordem: 5,
    titulo: 'Experiencia',
    porqueImporta:
      'Sem experiencia em TI ainda? Tudo bem. O erro e deixar vazio ou listar so o cargo sem descrever nada.',
    comoFazer: [
      'Liste suas experiencias anteriores, mesmo fora de TI',
      'Em cada uma, escreva 3 a 5 bullets no formato: verbo de acao + o que fez + resultado com numero',
      'Destaque o que e transferivel: processo, dados, planilha, automacao, atendimento, prazo',
      'Se fez freelance ou projeto voluntario com codigo, isso E experiencia — registre como tal',
      'Adicione as skills usadas em cada cargo (o LinkedIn permite vincular)',
    ],
    exemplos: {
      ruim: 'Assistente administrativo — responsavel pelas rotinas do setor.',
      bom:
        'Assistente administrativo\n' +
        '• Automatizei o relatorio mensal do setor com Excel avancado, reduzindo de 4h para 20min de trabalho manual\n' +
        '• Organizei a base de 2.000+ cadastros, eliminando duplicidade e reduzindo erro de emissao em 30%\n' +
        '• Fui ponto de contato entre 3 areas, traduzindo demanda operacional em requisito para o time de sistemas',
    },
    evite: [
      'Cargo sem nenhuma descricao',
      'Copiar a descricao formal do RH',
      'Buraco de anos sem explicacao (se estudou, registre como formacao ou projeto)',
    ],
  },
  {
    id: 'ln-projetos',
    ordem: 6,
    titulo: 'Projetos e Destaques',
    porqueImporta:
      'Para quem esta migrando, projeto e a prova de competencia. Substitui o "sem experiencia" na cabeca do recrutador.',
    comoFazer: [
      'Use a secao Projetos com link do GitHub e da aplicacao no ar',
      'Descreva: qual problema resolve, stack usada, e um detalhe tecnico interessante',
      'Fixe os 3 melhores no "Destaques" (aparecem no topo do perfil)',
      'Prefira 2 projetos bem feitos e documentados a 10 projetos de tutorial',
      'Se tem deploy publico, deixe o link visivel — 90% nao tem, isso te destaca',
    ],
    evite: [
      'Listar clone de tutorial famoso sem nada seu',
      'Repositorio sem README',
      'Link quebrado (teste TODOS antes)',
      'Projeto "to-do list" como destaque principal',
    ],
  },
  {
    id: 'ln-skills',
    ordem: 7,
    titulo: 'Competencias e certificacoes',
    porqueImporta:
      'O filtro de busca do recrutador usa esse campo. Skill que voce nao listou e vaga em que voce nao aparece.',
    comoFazer: [
      'Liste ate 50 skills, mas escolha as 3 principais para fixar no topo',
      'Use o nome exato do mercado: "Spring Boot", nao "Springboot"; "PostgreSQL", nao "Postgre"',
      'Peca validacao (endorsement) para colegas de curso e bootcamp',
      'Adicione certificacoes reais (AWS, Oracle) na secao propria, com o link de verificacao',
      'Certificado de curso da Udemy pode entrar, mas nao no lugar de projeto',
    ],
    evite: [
      'Listar tecnologia que voce nao sabe usar (vao perguntar na entrevista)',
      'Escrever a skill errado e sumir da busca',
      'Deixar skill irrelevante fixada no topo',
    ],
  },
  {
    id: 'ln-rede',
    ordem: 8,
    titulo: 'Rede e atividade',
    porqueImporta:
      'Perfil parado nao aparece. O algoritmo entrega mais quem publica e interage — e boa parte das vagas junior sai por indicacao.',
    comoFazer: [
      'Meta: passar de 500 conexoes (o LinkedIn exibe "500+")',
      'Conecte com devs, recrutadores de tech e pessoas das empresas que voce quer',
      'Convite com nota curta e personalizada converte muito mais',
      'Publique 1x por semana: o que aprendeu, um bug que resolveu, um projeto que entregou',
      'Comente com conteudo em posts de devs — comentario bom gera mais visibilidade que post',
      'Ative o "Open to Work" (pode deixar visivel so para recrutadores)',
      'Personalize a URL do perfil: linkedin.com/in/seu-nome',
    ],
    evite: [
      'Perfil zerado sem nenhuma atividade em meses',
      'So publicar "procuro oportunidade, compartilhem"',
      'Comentar "top!" e "parabens" — nao gera nada',
      'Pedir vaga por DM para desconhecido sem contexto',
    ],
  },
  {
    id: 'ln-recomendacoes',
    ordem: 9,
    titulo: 'Recomendacoes',
    porqueImporta: 'Prova social. Poucos juniores tem — quem tem, se destaca imediatamente.',
    comoFazer: [
      'Peca a 3 pessoas: ex-gestor, colega de projeto, instrutor de curso',
      'Ao pedir, sugira 2 pontos que a pessoa poderia citar (facilita a vida dela)',
      'Escreva recomendacao para os outros primeiro — a reciprocidade e alta',
    ],
    evite: ['Trocar recomendacao generica em massa', 'Texto obviamente escrito por voce mesmo'],
  },
]

// ---------------------------------------------------------------------------
// AVALIADOR — criterios ponderados
// tipo 'sn'  -> sim (1) / nao (0)
// tipo 'esc' -> 0 a 3 (ausente, fraco, bom, otimo)
// ---------------------------------------------------------------------------

export const CRITERIOS = [
  // Foto e banner
  { id: 'c1', secao: 'Foto e banner', peso: 3, tipo: 'sn', pergunta: 'Voce tem foto de perfil?', dica: 'Perfil sem foto e praticamente ignorado por recrutador.' },
  { id: 'c2', secao: 'Foto e banner', peso: 4, tipo: 'esc', pergunta: 'A foto e profissional (rosto nitido, fundo limpo, luz boa, roupa adequada)?', dica: 'Refaca com o celular: parede lisa, luz de frente, modo retrato, timer.' },
  { id: 'c3', secao: 'Foto e banner', peso: 2, tipo: 'sn', pergunta: 'Voce trocou o banner cinza padrao?', dica: 'Canva -> template "LinkedIn banner developer". 15 minutos de trabalho, alto impacto.' },

  // Headline
  { id: 'c4', secao: 'Headline', peso: 9, tipo: 'esc', pergunta: 'Sua headline cita o CARGO que voce busca (ex.: Desenvolvedor Backend Java)?', dica: 'Este e o campo de maior peso na busca do recrutador. Escreva o cargo alvo.' },
  { id: 'c5', secao: 'Headline', peso: 7, tipo: 'esc', pergunta: 'Sua headline cita as tecnologias principais da sua stack?', dica: 'Formula: Cargo | Stack | Diferencial. Ex.: Dev Backend Java | Spring Boot, PostgreSQL, Docker | Projetos publicados.' },
  { id: 'c6', secao: 'Headline', peso: 3, tipo: 'sn', pergunta: 'A headline usa mais de 100 caracteres (ou seja, aproveita o espaco)?', dica: 'Voce tem 220 caracteres. Usar 30 e desperdicio de palavra-chave.' },

  // Sobre
  { id: 'c7', secao: 'Sobre', peso: 8, tipo: 'sn', pergunta: 'A secao "Sobre" esta preenchida?', dica: 'Deixar vazio e o erro mais caro do perfil. Escreva 4 paragrafos hoje.' },
  { id: 'c8', secao: 'Sobre', peso: 6, tipo: 'esc', pergunta: 'O "Sobre" explica sua transicao e o que voce busca, de forma concreta?', dica: 'Paragrafo 1 e o gancho: quem voce e hoje e qual vaga voce quer.' },
  { id: 'c9', secao: 'Sobre', peso: 5, tipo: 'esc', pergunta: 'O "Sobre" cita tecnologias e um projeto real que voce construiu?', dica: 'Cite stack e descreva 1 projeto em 2 linhas. Palavra-chave ali tambem conta na busca.' },
  { id: 'c10', secao: 'Sobre', peso: 3, tipo: 'esc', pergunta: 'O texto esta dividido em paragrafos curtos e legiveis no celular?', dica: 'Bloco unico de 15 linhas ninguem le. Quebre a cada 3-4 linhas.' },
  { id: 'c11', secao: 'Sobre', peso: 3, tipo: 'sn', pergunta: 'Tem chamada para acao com contato e link do GitHub?', dica: 'Termine com: "Aberto a conversar: email | github.com/seu-usuario".' },

  // Experiencia
  { id: 'c12', secao: 'Experiencia', peso: 6, tipo: 'sn', pergunta: 'Suas experiencias anteriores estao listadas (mesmo fora de TI)?', dica: 'Experiencia fora de TI conta. Vazio passa impressao de perfil abandonado.' },
  { id: 'c13', secao: 'Experiencia', peso: 6, tipo: 'esc', pergunta: 'Cada cargo tem descricao em bullets, com verbo de acao?', dica: 'Formato: verbo + o que fez + resultado. Nunca so o titulo do cargo.' },
  { id: 'c14', secao: 'Experiencia', peso: 5, tipo: 'esc', pergunta: 'As descricoes trazem resultado com numero (%, tempo, volume)?', dica: '"Reduzi de 4h para 20min" vale dez vezes mais que "responsavel por relatorios".' },

  // Projetos
  { id: 'c15', secao: 'Projetos', peso: 9, tipo: 'esc', pergunta: 'Voce tem projetos publicados no GitHub, linkados no perfil?', dica: 'Sem experiencia em TI, projeto E o seu curriculo. Minimo 2 bem feitos.' },
  { id: 'c16', secao: 'Projetos', peso: 6, tipo: 'esc', pergunta: 'Os repositorios tem README explicando problema, stack e como rodar?', dica: 'Repositorio sem README e visto como projeto abandonado.' },
  { id: 'c17', secao: 'Projetos', peso: 6, tipo: 'sn', pergunta: 'Pelo menos 1 projeto esta NO AR, com link publico funcionando?', dica: 'Deploy publico e o maior diferencial de portfolio junior. Poucos tem.' },
  { id: 'c18', secao: 'Projetos', peso: 4, tipo: 'sn', pergunta: 'Voce fixou seus melhores projetos na secao "Destaques"?', dica: 'Destaques aparecem no topo do perfil. Coloque os 3 melhores.' },

  // Competencias
  { id: 'c19', secao: 'Competencias', peso: 5, tipo: 'esc', pergunta: 'Voce listou pelo menos 10 competencias tecnicas relevantes?', dica: 'Filtro de recrutador busca por skill. O que nao esta listado nao aparece.' },
  { id: 'c20', secao: 'Competencias', peso: 4, tipo: 'sn', pergunta: 'Os nomes estao escritos como o mercado escreve (Spring Boot, PostgreSQL, Docker)?', dica: 'Grafia errada = perfil invisivel na busca.' },
  { id: 'c21', secao: 'Competencias', peso: 3, tipo: 'sn', pergunta: 'Sua formacao/cursos estao registrados na secao de formacao?', dica: 'Registre o bootcamp/curso e as certificacoes com link de verificacao.' },

  // Rede e atividade
  { id: 'c22', secao: 'Rede e atividade', peso: 4, tipo: 'esc', pergunta: 'Voce tem 500+ conexoes?', dica: 'Conecte com 10 pessoas da area por dia com nota personalizada.' },
  { id: 'c23', secao: 'Rede e atividade', peso: 5, tipo: 'esc', pergunta: 'Voce publicou ou comentou algo tecnico no ultimo mes?', dica: 'Perfil parado nao e entregue. 1 post por semana ja muda o jogo.' },
  { id: 'c24', secao: 'Rede e atividade', peso: 4, tipo: 'sn', pergunta: 'O "Open to Work" esta ativado para recrutadores?', dica: 'Ative e configure os cargos-alvo. Voce entra nos filtros do LinkedIn Recruiter.' },
  { id: 'c25', secao: 'Rede e atividade', peso: 2, tipo: 'sn', pergunta: 'Voce personalizou a URL do perfil (linkedin.com/in/seu-nome)?', dica: 'Configuracoes -> Editar URL publica. 1 minuto de trabalho.' },
  { id: 'c26', secao: 'Rede e atividade', peso: 3, tipo: 'sn', pergunta: 'Voce tem pelo menos 1 recomendacao recebida?', dica: 'Peca a ex-gestor, colega ou instrutor. Sugira 2 pontos para facilitar.' },

  // Idioma e detalhes
  { id: 'c27', secao: 'Detalhes', peso: 3, tipo: 'sn', pergunta: 'O perfil esta sem erro de portugues (revisado)?', dica: 'Erro de digitacao na headline passa impressao de descuido. Revise em voz alta.' },
  { id: 'c28', secao: 'Detalhes', peso: 2, tipo: 'sn', pergunta: 'Voce tem uma versao do perfil em ingles?', dica: 'Abre vagas internacionais e de multinacional. LinkedIn suporta perfil multi-idioma.' },
  { id: 'c29', secao: 'Detalhes', peso: 3, tipo: 'sn', pergunta: 'Localizacao e disponibilidade (remoto/hibrido) estao corretas?', dica: 'Filtro por localidade e um dos primeiros que o recrutador aplica.' },
]

export const FAIXAS = [
  { min: 90, rotulo: 'Excelente', cor: '#22c55e', texto: 'Seu perfil esta no nivel dos melhores candidatos junior. Foco agora em volume: candidatura ativa e networking.' },
  { min: 75, rotulo: 'Bom', cor: '#84cc16', texto: 'Perfil solido. Corrija os pontos abaixo e voce entra na faixa de excelencia.' },
  { min: 55, rotulo: 'Mediano', cor: '#eab308', texto: 'Voce tem a base, mas esta perdendo oportunidade nos campos que mais pesam na busca do recrutador.' },
  { min: 35, rotulo: 'Precisa de trabalho', cor: '#f97316', texto: 'Varios campos criticos estao fracos ou vazios. Uma tarde de trabalho muda muito esse numero.' },
  { min: 0, rotulo: 'Critico', cor: '#ef4444', texto: 'O perfil praticamente nao te representa hoje. Comece pela headline, pelo Sobre e pela foto — nessa ordem.' },
]

export function avaliar(respostas) {
  let pesoTotal = 0
  let pontos = 0
  const porSecao = {}

  for (const c of CRITERIOS) {
    const bruto = respostas[c.id]
    const max = c.tipo === 'sn' ? 1 : 3
    const valor = bruto === undefined || bruto === null ? 0 : Number(bruto)
    const norm = Math.min(Math.max(valor, 0), max) / max

    pesoTotal += c.peso
    pontos += norm * c.peso

    if (!porSecao[c.secao]) porSecao[c.secao] = { peso: 0, pontos: 0 }
    porSecao[c.secao].peso += c.peso
    porSecao[c.secao].pontos += norm * c.peso
  }

  const nota = pesoTotal === 0 ? 0 : Math.round((pontos / pesoTotal) * 100)
  const faixa = FAIXAS.find((f) => nota >= f.min)

  const secoes = Object.entries(porSecao).map(([nome, v]) => ({
    nome,
    nota: Math.round((v.pontos / v.peso) * 100),
  }))

  // Prioriza o que da mais ganho: peso alto x quanto falta para o maximo
  const acoes = CRITERIOS.map((c) => {
    const max = c.tipo === 'sn' ? 1 : 3
    const valor = Number(respostas[c.id] ?? 0)
    const falta = (max - Math.min(Math.max(valor, 0), max)) / max
    return { ...c, ganho: falta * c.peso, valor }
  })
    .filter((a) => a.ganho > 0)
    .sort((a, b) => b.ganho - a.ganho)

  return { nota, faixa, secoes, acoes, pesoTotal }
}
