# Deploy na Vercel — devpath

O progresso fica gravado num Postgres gerenciado, então marcar um tópico no
trabalho aparece em casa. São 3 passos.

> **Antes de tudo:** os planos gratuitos de Postgres mudam com frequência.
> A arquitetura abaixo é estável; o fornecedor você escolhe na hora. Qualquer
> um que entregue uma *connection string* serve — Neon, Supabase, Vercel
> Postgres, Railway. Não fica nada preso a nenhum deles.

## 1. Banco

No painel da Vercel, dentro do projeto: **Storage → Create Database →
Postgres**. Dê um nome e crie.

Se ele perguntar a qual projeto conectar, escolha o **devstudy**. Se não
perguntar, abra o banco depois e use **Connect Project**.

Isso é tudo. **Você não precisa copiar a connection string**, e não precisa
criar tabela nenhuma:

- ao conectar o banco ao projeto, a Vercel cadastra a variável de conexão sozinha
- as tabelas são criadas pela própria API, na primeira vez que ela usa o banco

> Copiar a string à mão continua funcionando (variável `DATABASE_URL`), mas é o
> caminho com mais chance de erro: basta cortar o final e nada conecta.

## 2. A senha

Escolha uma frase longa que você lembre — **não existe "esqueci minha senha"**
aqui. Na pasta do projeto:

```bash
node gerar-segredos.mjs "ESCREVA-AQUI-SUA-FRASE-SECRETA"
```

Ele imprime dois valores rotulados, `SENHA_HASH` e `JWT_SECRET`. Copie os dois.

O que vai para a Vercel é o **hash**, nunca a frase. Hash é a senha passada por
um liquidificador: não dá para voltar atrás. Se alguém ler tudo que está lá,
encontra o embaralhado, e o embaralhado não abre nada.

> Depois de copiar, limpe o histórico: `Clear-History` no PowerShell.

> ⚠️ **Escolha a sua frase, não copie o exemplo.** Uma versão anterior deste
> guia trazia uma frase literal no lugar do espaço reservado, e ela acabou
> virando a senha de verdade — uma senha que estava escrita, por extenso, num
> arquivo público do repositório. Exemplo copiado é senha conhecida.

## Trocar a senha depois

```bash
node trocar-senha.mjs
```

Pergunta a frase nova (escondida, sem eco na tela), gera o hash e atualiza a
variável na Vercel. A frase não aparece na tela nem fica no histórico do
terminal. Depois é só publicar — o script mostra o comando.

## 3. (nada a fazer — o segredo já saiu no passo 2)

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

## 4. Variáveis na Vercel

**Settings → Environment Variables**, nos três ambientes:

| Nome | Valor |
|---|---|
| `DATABASE_URL` | **provavelmente já existe** — veja a nota abaixo |
| `SENHA_HASH` | o hash do passo 2 (o que começa com `$2b$12$`) |
| `JWT_SECRET` | o segredo do passo 3 |
| `VITE_API_URL` | `/` |

> **Sobre a `DATABASE_URL`:** se voce criou o banco pelo painel da Vercel, ela
> provavelmente **ja esta na lista** — a Vercel cadastra sozinha ao conectar o
> banco ao projeto, as vezes com outro nome (`POSTGRES_URL`,
> `POSTGRES_URL_NON_POOLING`). O codigo aceita qualquer um desses, entao **nao
> crie uma duplicada**: confira a lista antes. So adicione manualmente se
> nenhuma variavel de Postgres aparecer ali.

> `VITE_API_URL=/` diz ao app que a API está no mesmo domínio. **Sem essa
> variável o site sobe, funciona, e salva só no navegador** — sem erro nenhum
> na tela. Se o progresso não estiver sincronizando, comece conferindo aqui.
>
> Variáveis `VITE_` entram **no build**. Adicionou depois do primeiro deploy?
> Precisa de um *Redeploy*, senão nada muda.

## 5. Deploy

Importe o repositório em [vercel.com](https://vercel.com/new). O framework é
detectado (Vite) e a pasta `api/` vira função serverless automaticamente.

## 6. Conferir

Abra o site. Deve pedir a senha. Depois de entrar:

1. Marque um tópico qualquer na Trilha
2. Abra o site **em outro navegador** (ou aba anônima), entre com a mesma senha
3. O tópico tem que estar marcado lá

Se estiver, acabou. Se não estiver, é o `VITE_API_URL` — veja o aviso do passo 4.

---

## Trocar a senha depois

Repita o passo 2 e substitua `SENHA_HASH` nas variáveis. Um *Redeploy* aplica.
Não existe "esqueci minha senha": com um usuário só, o painel é a recuperação.

## O que este deploy NÃO tem

Faltas conhecidas, não esquecidas:

- **Backup automático.** O provedor do Postgres provavelmente faz o dele —
  confirme, e não confie sem testar uma restauração. `Configurações → Exportar
  progresso` continua sendo o backup que depende só de você.
- **Histórico de versões do progresso.** A gravação sobrescreve. Se você
  desmarcar tudo por engano e sincronizar, o estado anterior se foi.
- **Dois computadores ao mesmo tempo.** A resolução é *last-write-wins*: o
  último a salvar vence. Para uso pessoal basta, mas se você deixar o sistema
  aberto no trabalho e mexer em casa, recarregue antes de continuar.

## Por que não a VPS

Continua sendo uma opção válida, e o guia está em [README.md](README.md). A
diferença real:

| | Vercel | VPS |
|---|---|---|
| Trabalho para subir | 6 passos | 8 fases |
| Manutenção | nenhuma | Nginx, systemd, certbot, backup |
| Custo | grátis no uso pessoal | você já paga |
| Você aprende | pouco | bastante, e conta em entrevista |

A pasta `servidor/` (API Node + MySQL para VPS) continua no repositório e não
atrapalha o deploy na Vercel. Se você decidir que não vai usá-la, apague — dois
backends para o mesmo contrato acabam divergindo.
