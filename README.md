# DevPath

Sistema pessoal de organização de estudos até a primeira vaga de **Engenheiro de Software Júnior**.

Roadmap organizado (não a bagunça que se acha na internet), exercícios no padrão de mercado,
preparação para entrevistas e um avaliador de perfil do LinkedIn.

## Stack

| Parte | O que é |
|---|---|
| Frontend | React 18 + Vite + React Router (HashRouter), estático |
| API | Node + Express, em `servidor/` |
| Banco | MySQL |
| Autenticação | Própria: bcrypt + JWT curto + refresh token em cookie `httpOnly` |
| Hospedagem | VPS Hostinger, em `estudo.lastweek.com.br` |

O app tem dois modos, decididos automaticamente pela variável `VITE_API_URL`:

- **Modo nuvem** — com a variável definida: login por email/senha e progresso sincronizado entre dispositivos.
- **Modo local** — sem a variável: funciona por inteiro, mas o progresso fica só naquele navegador.

Em ambos os modos o `localStorage` é usado como cache, então o app continua utilizável offline
e as alterações sobem quando a conexão volta.

## Rodando na sua máquina

Pré-requisito: **Node.js 20+**.

```bash
npm install
```

```bash
npm run dev
```

Abre em `http://localhost:5173`. Sem `.env`, roda em modo local — que é o suficiente para
desenvolver qualquer tela que não seja login.

Para gerar a versão de produção:

```bash
npm run build
```

### Subindo a API junto (opcional)

Só é necessário para mexer em login ou sincronização. Exige um MySQL acessível.

```bash
cd servidor && npm install && npm run dev
```

O schema fica em [`servidor/schema.sql`](servidor/schema.sql). Ele **não** cria usuário nem senha
de banco de propósito — credencial não mora em arquivo versionado.

## Colocando no ar

O guia completo é o **[deploy/README.md](deploy/README.md)**: 8 fases, da VPS limpa ao HTTPS
funcionando, incluindo Nginx, systemd e certbot.

Leia também o **[SEGURANCA.md](SEGURANCA.md)** antes de publicar. O item que mais importa:
**crie sua conta antes de fechar o cadastro público**, ou você fica trancado do lado de fora.

> A `vercel.json` na raiz existe caso um dia você queira o frontend na Vercel. Ela sozinha não
> resolve login: a Vercel não hospeda MySQL, e a API precisaria ser portada para serverless.

## Usando no celular

O app é responsivo e pode ser instalado como aplicativo:

- **Android (Chrome):** menu ⋮ → *Adicionar à tela inicial*
- **iPhone (Safari):** botão compartilhar → *Adicionar à Tela de Início*

Instalado, abre em tela cheia, sem barra de navegador. O progresso é o mesmo do computador —
é a mesma conta.

Uma limitação honesta do iPhone: as **notificações do Pomodoro** só funcionam com o app
adicionado à tela de início, e ainda assim o iOS é restritivo. O alarme sonoro funciona nos
dois sistemas, desde que a aba esteja aberta.

## Como a autenticação funciona

- Senha guardada com **bcrypt** (custo 12), nunca em texto.
- Login devolve um **access token JWT de 15 min**, que fica **em memória** no frontend — não
  no `localStorage`, onde um XSS o leria.
- O **refresh token** (30 dias) vai em cookie `httpOnly`, `secure`, `sameSite=strict`, e é
  guardado no banco como hash SHA-256. O JavaScript da página nunca o enxerga.
- Refresh **rotaciona**: cada uso emite um token novo e invalida o anterior. Se um token já
  usado reaparecer, todas as sessões daquele usuário são revogadas — é o sinal clássico de
  token roubado.
- Tentativas de login são limitadas **no banco** (8 falhas / 15 min, por email ou IP).
  No banco, e não em memória, para o limite sobreviver a reinício do processo.

O MySQL não tem Row Level Security. O isolamento entre usuários é garantido pela API, que
**sempre** filtra por `usuario_id` vindo do token — nunca de um parâmetro da requisição.

## Como a sincronização funciona

O estado inteiro do app é gravado como uma linha JSON por usuário na tabela `progresso`.
Escolha deliberada: o formato do progresso muda toda vez que um módulo novo entra no roadmap,
e assim isso não exige migration.

- Toda alteração salva no `localStorage` imediatamente e sobe para a API após 1,2s de
  inatividade (*debounce*), com até 5 reenvios em espera exponencial.
- No primeiro login em uma conta nova, o progresso que já existia naquele navegador é
  **migrado automaticamente** para a conta.
- Ao entrar em uma conta que já tem dados, **a nuvem vence** — o que estiver no navegador é
  substituído.
- A resolução de conflito é *last-write-wins*. Se você usar dois computadores ao mesmo tempo,
  sem recarregar, o último a salvar sobrescreve o outro. Para uso pessoal é suficiente; em
  *Configurações → Conta* existem **Enviar agora** e **Baixar da nuvem** para forçar a direção.
- Limites da API: 500 KB de progresso por usuário e 60 gravações por minuto.

## O que tem dentro

| Página | O que faz |
|---|---|
| **Painel** | Progresso geral, próximo passo, previsão de conclusão, progresso por trilha |
| **Revisão** | Fila de revisão espaçada; bloqueia conteúdo novo quando a dívida passa do limite |
| **Pomodoro** | Blocos de foco configuráveis, alarme, notificação, tempo contabilizado por módulo |
| **Cronograma** | Blocos de estudo por dia da semana, com matéria e tempo mínimo |
| **Meu plano** | Semana a semana, gerado do objetivo + horas/semana + o que você já concluiu |
| **Roadmap** | Trilhas → fases → módulos → tópicos, com entregável, recursos e 3 exercícios por módulo |
| **Exercícios** | Enunciado, requisitos, critérios de aceite, dicas reveláveis e cronômetro |
| **Desafios** | Projetos maiores, de portfólio |
| **Entrevistas** | Etapas do processo, banco de perguntas com resposta modelo, método STAR, checklist |
| **LinkedIn** | Tutorial com exemplos bom / mediano / fraco |
| **Avaliador** | Critérios ponderados → nota 0–100, nota por seção e plano de ação priorizado |
| **Configurações** | Conta, status de sincronização, backup em `.json`, reset |

## Trilhas

- 🧱 **Fundamentos de Engenharia** — Git, terminal, HTTP, algoritmos, Clean Code, SOLID, testes, Agile
- ☕ **Java + Spring Boot** — na ordem do curso do Nélio Alves, não numa ordem inventada
- 🅰️ **Angular** — HTML/CSS/JS/TS até RxJS, Signals e testes
- 🗄️ **Banco de Dados** — modelagem, SQL de entrevista, índices, transações
- ☁️ **AWS & Cloud** — IAM, EC2, S3, RDS, Lambda, ECS, observabilidade, certificação CLF-C02
- 🌍 **Inglês** — do básico ao avançado, técnico e conversação (trilha paralela, fora da sequência)

## Editando o conteúdo

Todo o conteúdo vive em `src/data/` — nenhum componente precisa ser tocado para mudar o roadmap:

| Arquivo | Conteúdo |
|---|---|
| `tracks.js` | Trilhas, fases, módulos, tópicos, entregáveis e links |
| `ingles.js` | Trilha de inglês |
| `exerciciosModulos.js` | Índice dos 3 exercícios por módulo (fontes em `exercicios/`) |
| `exercises.js` | Exercícios da aba Exercícios |
| `desafios.js` | Projetos de portfólio |
| `interview.js` | Etapas, perguntas, método STAR, checklist |
| `linkedin.js` | Tutorial e critérios do avaliador, com os pesos |
| `cursoNelio.js` | Grade do curso, usada para marcar onde você está |

A ordem pedagógica do plano (qual fase vem antes de qual) fica em `src/lib/planner.js`,
no objeto `OBJETIVOS`.

> ⚠️ Não renomeie os `id` dos módulos nem dos exercícios: eles são a chave do progresso salvo.

## Backup

`Configurações → Exportar progresso` gera um `.json`. Em modo nuvem é opcional (o banco já é o
backup), mas continua útil para guardar um ponto no tempo ou levar o progresso para outra conta.

## Próximo passo planejado

Quando a fase **Spring Boot** do roadmap estiver concluída, reescrever `servidor/` em
Java + Spring Security + JWT, mantendo o mesmo contrato HTTP e este frontend como cliente.
O sistema passa a ser o projeto de portfólio.
