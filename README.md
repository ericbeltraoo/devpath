# DevPath

Sistema pessoal de organização de estudos até a primeira vaga de **Engenheiro de Software Júnior**.

Roadmap organizado (não a bagunça que se acha na internet), exercícios no padrão de mercado,
preparação para entrevistas e um avaliador de perfil do LinkedIn.

## Stack

React 18 + Vite + React Router, com **Supabase** (Postgres + Auth) para login e sincronização.

O app tem dois modos, decididos automaticamente:

- **Modo nuvem** — com as variáveis do Supabase definidas: login por email/senha e progresso sincronizado entre dispositivos.
- **Modo local** — sem as variáveis: funciona normalmente, mas o progresso fica só naquele navegador.

Em ambos os modos o `localStorage` é usado como cache, então o app continua utilizável offline e as alterações sobem quando a conexão volta.

## Rodando

Pré-requisito: **Node.js 18+**.

```bash
npm install
```

```bash
npm run dev
```

Abre em `http://localhost:5173`.

Para gerar a versão de produção:

```bash
npm run build
```

## Configurando o Supabase (login + sincronização)

**1. Crie o projeto**

Em [supabase.com](https://supabase.com) → *New project*. Escolha a região `South America (São Paulo)` e guarde a senha do banco.

**2. Crie a tabela**

No painel, abra **SQL Editor** → *New query*, cole o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) e clique em **Run**.

**3. Pegue as chaves**

Em **Project Settings → API**, copie `Project URL` e a chave `anon public`.

> ⚠️ Use apenas a chave **anon / public**. A `service_role` ignora as regras de segurança e nunca deve ir para o frontend.

**4. Crie o `.env`**

Copie `.env.example` para `.env` e preencha:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

Reinicie o `npm run dev` — o Vite só lê o `.env` na inicialização.

**5. Ajuste a confirmação de email**

Em **Authentication → Providers → Email**, decida se quer *Confirm email* ligado. Ligado é mais seguro; desligado deixa o cadastro instantâneo (aceitável para uso pessoal).

## Segurança

O checklist completo — o que já está feito no código e o que você precisa configurar nos painéis — está em **[SEGURANCA.md](SEGURANCA.md)**.

Leia antes de publicar. O item mais importante: **crie sua conta antes de fechar o cadastro público**, ou você fica trancado do lado de fora.

## Publicando na Vercel

O repositório já está inicializado com o primeiro commit feito. Falta apenas apontar para o seu GitHub:

```bash
git remote add origin https://github.com/SEU-USUARIO/devpath.git; git push -u origin main
```

1. Crie o repositório no GitHub (**privado**) e rode o comando acima. O `.env` está no `.gitignore` e **não** vai junto — é o comportamento correto.
2. Em [vercel.com](https://vercel.com) → *Add New → Project* → importe o repositório.
3. A Vercel detecta Vite sozinha. Confirme: build `npm run build`, output `dist`. O `vercel.json` já traz os headers de segurança (CSP, HSTS, `X-Frame-Options`) e o cache dos assets.
4. Em **Environment Variables**, adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` com os mesmos valores do `.env`.
5. Deploy.
6. Volte ao Supabase em **Authentication → URL Configuration** e coloque a URL da Vercel em *Site URL* — sem isso o link de recuperação de senha aponta para `localhost`.

Cada `git push` na branch principal republica o site.

### Notas sobre o plano gratuito

- Projeto Supabase gratuito **pausa após ~1 semana sem acesso**. É só despausar com um clique no painel.
- O roteamento usa `HashRouter` (URLs com `#/roadmap`), então nenhuma configuração de *rewrite* é necessária em qualquer host estático.

## Como a sincronização funciona

O estado inteiro do app é gravado como uma linha `JSONB` por usuário na tabela `progresso`. Escolha deliberada: o formato do progresso muda toda vez que um módulo novo entra no roadmap, e com JSONB isso não exige migration.

- Toda alteração salva no `localStorage` imediatamente e sobe para a nuvem após 1,2s de inatividade (*debounce*).
- No primeiro login em uma conta nova, o progresso que já existia naquele navegador é **migrado automaticamente** para a conta.
- Ao entrar em uma conta que já tem dados, **a nuvem vence** — o que estiver no navegador é substituído.
- A resolução de conflito é *last-write-wins*. Se você usar dois computadores ao mesmo tempo, sem recarregar, o último a salvar sobrescreve o outro. Para uso pessoal isso é suficiente; em *Configurações → Conta* existem os botões **Enviar agora** e **Baixar da nuvem** para forçar a direção.

A segurança fica no banco, não no frontend: a tabela tem **Row Level Security** com políticas que restringem cada operação a `auth.uid() = user_id`. Mesmo com a chave pública em mãos, ninguém lê o progresso de outra pessoa.

## O que tem dentro

| Página | O que faz |
|---|---|
| **Painel** | Progresso geral, próximo passo, previsão de conclusão, progresso por trilha |
| **Meu plano** | Cronograma semana a semana, gerado a partir do objetivo + horas/semana + o que você já concluiu |
| **Roadmap** | 5 trilhas → fases → módulos → tópicos marcáveis, com entregável e recursos por módulo |
| **Exercícios** | Enunciado, requisitos, critérios de aceite e dicas (reveláveis) |
| **Entrevistas** | Etapas do processo, banco de perguntas com resposta modelo, método STAR, checklist |
| **LinkedIn** | Tutorial de 9 seções com exemplos bom / mediano / fraco |
| **Avaliador** | 29 critérios ponderados → nota 0–100, nota por seção e plano de ação priorizado |
| **Configurações** | Conta, status de sincronização, backup em `.json`, reset |

## Trilhas

- 🧱 **Fundamentos de Engenharia** — Git, terminal, HTTP, algoritmos, Clean Code, SOLID, testes, Agile
- ☕ **Java + Spring Boot** — do básico ao deploy, alinhada com o curso do Nélio Alves
- 🅰️ **Angular** — HTML/CSS/JS/TS até RxJS, Signals e testes
- 🗄️ **Banco de Dados** — modelagem, SQL de entrevista, índices, transações, PostgreSQL
- ☁️ **AWS & Cloud** — IAM, EC2, S3, RDS, Lambda, ECS, observabilidade, certificação CLF-C02

## Editando o conteúdo

Todo o conteúdo vive em `src/data/` — nenhum componente precisa ser tocado para mudar o roadmap:

- `tracks.js` — trilhas, fases, módulos, tópicos, entregáveis e links
- `exercises.js` — exercícios
- `interview.js` — etapas, perguntas, método STAR, checklist
- `linkedin.js` — tutorial e critérios do avaliador (com os pesos)

A ordem pedagógica do plano (qual fase vem antes de qual) fica em `src/lib/planner.js`,
no objeto `OBJETIVOS`.

> ⚠️ Não renomeie os `id` dos módulos: eles são a chave do progresso salvo.

## Backup

`Configurações → Exportar progresso` gera um `.json`. Em modo nuvem isso é opcional (o banco já é o backup),
mas continua útil para guardar um ponto no tempo ou levar o progresso para outra conta.

## Próximo passo planejado

Quando a fase **Spring Boot** do roadmap estiver concluída, trocar o Supabase por uma API REST própria
em Java + Spring Security + JWT + Postgres, mantendo este frontend como cliente.
O sistema passa a ser o projeto de portfólio.
