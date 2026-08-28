# Deploy na Vercel — devpath

O progresso fica gravado num Postgres gerenciado, então marcar um tópico no
trabalho aparece em casa. São 6 passos.

> **Antes de tudo:** os planos gratuitos de Postgres mudam com frequência.
> A arquitetura abaixo é estável; o fornecedor você escolhe na hora. Qualquer
> um que entregue uma *connection string* serve — Neon, Supabase, Vercel
> Postgres, Railway. Não fica nada preso a nenhum deles.

## 1. Banco

No painel da Vercel: **Storage → Create Database → Postgres**, ou crie a base
no fornecedor que preferir. Copie a *connection string*.

Cole o conteúdo de [`api/schema.sql`](../api/schema.sql) no editor SQL do
provedor e execute. São duas tabelas.

## 2. A senha

Gere o hash **na sua máquina**, escolhendo uma senha longa. Ela nunca é
digitada em nenhum arquivo do projeto:

```bash
node -e "console.log(require('bcryptjs').hashSync(process.argv[1],12))" 'SUA-SENHA-AQUI'
```

Copie a saída — começa com `$2a$12$`. É isso que vai para o servidor, não a
senha.

> Rode isso num terminal que você vá fechar. No PowerShell, `Clear-History`
> depois; no bash, `history -c`.

## 3. O segredo do token

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

## 4. Variáveis na Vercel

**Settings → Environment Variables**, nos três ambientes:

| Nome | Valor |
|---|---|
| `DATABASE_URL` | a connection string do passo 1 |
| `SENHA_HASH` | o hash do passo 2 (o que começa com `$2a$12$`) |
| `JWT_SECRET` | o segredo do passo 3 |
| `VITE_API_URL` | `/` |

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
