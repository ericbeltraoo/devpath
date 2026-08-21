# Segurança — checklist antes e depois de publicar

Marque conforme for fazendo. Os itens de **código** já estão prontos; os de **servidor** só você
pode executar, porque exigem acesso à VPS.

> **Decisão de escopo:** o DevPath é um **sistema pessoal, de usuário único**. O cadastro nasce
> **fechado** e só abre por variável de ambiente. Isso elimina de uma vez a maior parte da
> superfície de ataque. Se um dia abrir para outras pessoas, leia "Se abrir para outros usuários"
> no fim.

## O que mudou: agora a senha é sua responsabilidade

Antes o login era do Supabase, e este documento dizia que você não guardava senha em lugar
nenhum. **Isso deixou de ser verdade.** A autenticação agora é própria, e o hash da senha mora
na sua tabela `usuarios`, no seu MySQL, na sua VPS.

Consequências práticas, sem rodeio:

- **Se o banco vazar, o material vaza com ele.** São hashes bcrypt com custo 12, não texto —
  quebrar isso é caro. Mas "caro" não é "impossível", e não é mais problema de outra empresa.
- **Backup do banco é dado sensível.** Um `mysqldump` no `/tmp` com permissão frouxa é um
  arquivo de senhas esperando.
- **Você é o time de segurança agora.** Não existe mais um painel de terceiro aplicando limites
  por você. Tudo que este documento lista precisa estar no seu código ou na sua VPS.

Foi a troca certa — você deixa de depender de serviço externo e ganha o projeto de portfólio —
mas é uma troca, não um upgrade grátis.

## Como a autenticação funciona

1. O formulário manda email e senha por HTTPS para a **sua** API.
2. A API valida a política de senha **de novo** no servidor e grava o hash **bcrypt custo 12**.
   Validar só no cliente não é validar: a API pode ser chamada direto com `curl`.
3. O login devolve um **access token JWT de 15 minutos**, que o frontend guarda **em memória** —
   não no `localStorage`, onde um XSS o leria.
4. O **refresh token** (30 dias) vai em cookie `httpOnly`, `secure`, `sameSite=strict`, com
   `path=/api/auth`. O JavaScript da página nunca o enxerga.
5. No banco o refresh é guardado como **hash SHA-256**. Banco vazado não entrega token usável.
6. Cada refresh **rotaciona**: emite um novo e invalida o anterior. Se um token já usado
   reaparecer, **todas** as sessões daquele usuário são revogadas — é a assinatura de token roubado.

O MySQL **não tem Row Level Security**. O isolamento entre contas depende inteiramente de a API
filtrar por `usuario_id` extraído do token, nunca de parâmetro da requisição. É uma linha de
código em [`api.js`](servidor/src/api.js) separando você de um vazamento — por isso ela está
comentada lá, e por isso nenhuma rota nova deve aceitar id de usuário vindo do cliente.

## Código — já feito

- [x] **Senha com bcrypt custo 12**, nunca em texto, nunca em log
- [x] **Política de senha aplicada no servidor também** — mínimo 10 caracteres, 3 dos 4 tipos,
      bloqueio de senhas comuns, de repetições e de senha contendo o próprio email
- [x] **Access token curto em memória**, refresh em cookie `httpOnly` + `sameSite=strict`
- [x] **Refresh guardado como hash**, com rotação e revogação em massa na reutilização
- [x] **`JWT_SECRET` obrigatório com 32+ caracteres** — a API se recusa a subir sem ele.
      Falhar na subida é melhor que rodar inseguro sem ninguém perceber
- [x] **Limite de tentativas no servidor** — 8 falhas em 15 min, por email **ou** IP, contadas
      **no banco**. No banco, e não em memória, para sobreviver a reinício do processo
- [x] **Comparação em tempo constante-ish** — email inexistente ainda paga o custo de um bcrypt
      contra hash falso, para o tempo de resposta não denunciar quais emails existem
- [x] **Mensagens sem enumeração de usuários** — login errado e cadastro duplicado devolvem
      textos que não revelam se aquele email tem conta
- [x] **Cadastro fechado por padrão** — só abre com `CADASTRO_ABERTO=true` no `.env`
- [x] **Backoff no formulário de login** — usabilidade, não segurança (veja a tabela adiante).
      Falha de **rede** não conta como tentativa errada
- [x] **`usuario_id` sempre do token**, nunca do corpo ou da URL
- [x] **Limite de 500 KB e 60 gravações/min por usuário**, recalculado no servidor
- [x] **Reenvio com espera exponencial** — até 5 tentativas antes de reportar erro, então queda
      de rede não perde seu progresso
- [x] **API escuta só em `127.0.0.1`** — quem fala com a internet é o Nginx
- [x] **`.env` e `.env.*` no `.gitignore`** (com exceção explícita para o `.env.example`)
- [x] **`schema.sql` não cria usuário nem senha de banco** — credencial não mora em arquivo versionado
- [x] **Stack trace vai para o log, nunca para a resposta**
- [x] **Headers HTTP no Nginx**: CSP com `frame-ancestors 'none'`, HSTS, `X-Frame-Options: DENY`,
      `nosniff`, Referrer-Policy, Permissions-Policy, `X-Robots-Tag: noindex`
- [x] **CSP em `<meta>`** no `index.html` como rede de segurança. Cobre script, style, img e
      connect; **não** cobre `frame-ancestors` nem HSTS, que só funcionam como cabeçalho HTTP
- [x] **systemd endurecido** — usuário próprio sem shell, `ProtectSystem=strict`, `ProtectHome`,
      `NoNewPrivileges`, `PrivateTmp`
- [x] **Sem `dangerouslySetInnerHTML`** em lugar nenhum — todo texto é escapado pelo React
- [x] **Links externos** com `rel="noreferrer"`
- [x] **Detecção de `.env` quebrado** — se tiver BOM (o PowerShell grava assim com
      `-Encoding utf8`), o app avisa na tela em vez de cair em modo local silenciosamente

## Servidor — você precisa fazer

Os passos detalhados estão em [deploy/README.md](deploy/README.md). Este é o resumo do que é
segurança, não configuração:

- [ ] **Gerar as senhas NA VPS**, com `openssl`, nunca digitá-las no chat ou num arquivo local.
      A senha do MySQL que você mencionou em conversa deve ser considerada **queimada**: não a
      use para nada.
- [ ] **Usuário de banco dedicado** (`devpath_app`) com permissão só na base `devpath`.
      A API **nunca** conecta como root.
- [ ] **`.env` com `chmod 600`**, dono `devpath`
- [ ] **MySQL escutando só em `127.0.0.1`** — confira com `ss -tlnp | grep 3306`
- [ ] **Firewall**: só 22, 80 e 443 abertos
- [ ] **HTTPS com certbot** e renovação automática testada (`certbot renew --dry-run`)
- [ ] **Backup do `mysqldump` com permissão restrita** e fora do diretório servido pelo Nginx
- [ ] **MFA na conta da Hostinger e do GitHub**

> ### ⚠️ Ordem importa: crie sua conta ANTES de fechar o cadastro
>
> 1. Publique o site com `CADASTRO_ABERTO=true`
> 2. Crie a **sua** conta
> 3. Confirme que o login funciona e que seu progresso migrou
> 4. **Só então** troque para `CADASTRO_ABERTO=false` e reinicie o serviço
>
> Se inverter a ordem, você fica trancado do lado de fora e vai precisar inserir o usuário na
> mão pelo MySQL.

## Limites de taxa: quem protege o quê

Três camadas, e só duas são segurança de verdade:

| Camada | Onde roda | Vale como segurança? |
|---|---|---|
| Backoff do formulário de login | Navegador | **Não.** Um atacante chama a API direto e ignora sua tela. Serve para você não se trancar sozinho. |
| 8 falhas / 15 min por email ou IP | API + banco | **Sim.** É o que barra força bruta de verdade. |
| 60 gravações/min por usuário | API + banco | **Sim.** Impede que uma sessão comprometida queime o servidor gravando em loop. |

## Repositório público: o que muda

- Todo o código fica visível. **Isso é uma vantagem**: vira portfólio. Um sistema real, usado por
  você, com autenticação própria, deploy e endurecimento — vale mais numa entrevista que dez
  projetos de tutorial.
- **Nenhum segredo pode estar no repo.** Confira antes de cada push:
  `git ls-files | grep -i env` deve mostrar só `.env.example`.
- Email de commit privado, se quiser: *GitHub → Settings → Emails → Keep my email addresses private*.

## Sobre as dependências

`npm audit` reporta vulnerabilidades altas em `react-router` (GHSA-qwww-vcr4-c8h2, *RSC Mode CSRF
Bypass*). Decisão consciente de **manter a versão atual**:

- O aviso é específico do **modo RSC** (React Server Components com server actions). Este app é
  uma SPA puramente cliente, com `HashRouter`. O código vulnerável nunca é executado aqui.
- A correção sugerida pelo `npm audit fix --force` **desce** para a 7.11.0 — que reintroduz o
  *open redirect levando a XSS* (GHSA-jjmj-jmhj-qwj2), corrigido na 7.18.0. Esse sim é explorável
  em cliente.

Ou seja: descer de versão deixaria o app **menos** seguro. Reavalie quando sair uma versão acima.

> Isso vale como resposta pronta em entrevista: "eu li o audit em vez de obedecer ao audit".

## O que ainda não existe

Faltas conhecidas, não esquecidas:

- **Recuperação de senha por email** — exige SMTP. A tela está escondida em vez de oferecer um
  botão que não faz nada. Para redefinir hoje, é `UPDATE` no banco (veja `deploy/README.md`).
- **Rate limit no Nginx** — hoje o limite só existe na aplicação. Ela é DB-backed e cobre login e
  gravação, mas um flood de requisições ainda chega até o Node. Um `limit_req_zone` no Nginx
  pararia antes.
- **Backup automático** — configure o cron com `mysqldump`, e **restaure pelo menos uma vez**.
  Backup nunca testado é backup imaginário.
- **Monitoramento** — nada avisa se a API cair. Hoje você descobre usando.

## Se abrir para outros usuários

Nada disto é necessário enquanto o sistema for só seu:

- **CAPTCHA** (Cloudflare Turnstile) no cadastro. Vai exigir liberar `challenges.cloudflare.com`
  na CSP do Nginx.
- **SMTP próprio** (Resend, SendGrid, SES) para confirmação de email e recuperação de senha.
- **Confirmação de email obrigatória** — sem isso alguém cadastra usando o email de outra pessoa.
- **Política de retenção** para contas abandonadas.
- **LGPD**: com usuários reais, você vira controlador de dados pessoais. Isso traz obrigações
  legais, não só técnicas.

## Verificando depois de publicar

Cabeçalhos:

```bash
curl -sI https://estudo.lastweek.com.br | grep -iE "content-security|strict-transport|x-frame|x-content"
```

O banco não deve estar exposto:

```bash
ss -tlnp | grep 3306
```

Deve aparecer só `127.0.0.1:3306`. Se aparecer `0.0.0.0:3306`, **pare e corrija antes de seguir**.

E teste o isolamento na prática: crie uma segunda conta, marque algo diferente nela e confirme
que uma não enxerga o progresso da outra. Depois apague a conta de teste.
