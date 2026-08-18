# Segurança — checklist antes e depois de publicar

Marque conforme for fazendo. Os itens de **código** já estão prontos; os de **painel** só você pode executar, porque exigem login nas suas contas.

> **Decisão de escopo:** o DevPath é um **sistema pessoal, de usuário único**. O cadastro público fica **fechado** depois que você criar sua conta. Isso elimina de uma vez a maior parte da superfície de ataque — sem cadastro aberto não há criação de contas em massa, mineração de emails nem estouro da cota de envio. Se um dia você abrir para outras pessoas, releia a seção "Se abrir para outros usuários" no fim.

## Como a autenticação funciona

Você não guarda senha em lugar nenhum. O fluxo é:

1. O formulário manda email e senha por HTTPS direto para o Supabase Auth
2. O Supabase gera o hash da senha com **bcrypt** e guarda só o hash, num schema (`auth`) que a chave pública não alcança
3. Na volta vem um **JWT de vida curta** mais um refresh token com rotação automática
4. Toda requisição ao banco leva esse JWT, e o Postgres aplica o RLS em cima do `auth.uid()` que vem dentro dele

O app nunca vê, nunca registra e nunca armazena a senha. Não existe "banco de senhas" seu para vazar.

## Entendendo as duas chaves

Isto é a fonte da maioria dos vazamentos em projeto com Supabase:

| Chave | Onde pode aparecer | O que faz |
|---|---|---|
| `anon` / `public` | No navegador, no bundle, no GitHub. **É pública por design.** | Não dá acesso a nada sozinha. Toda requisição ainda passa pelo RLS. |
| `service_role` | **Somente em servidor.** Nunca no frontend, nunca no `.env` deste projeto. | **Ignora o RLS por completo.** Quem tem essa chave lê e apaga os dados de todo mundo. |

Se a chave `anon` vazar, não aconteceu nada — ela é servida para qualquer visitante de qualquer forma. Se a `service_role` vazar, o banco inteiro está comprometido. Este projeto nunca usa a segunda.

## Código — já feito

- [x] **RLS ligado** com policies `auth.uid() = user_id` em SELECT, INSERT, UPDATE e DELETE — a regra vive no banco, não no frontend
- [x] **Papel `anon` sem permissão** na tabela (defesa em profundidade, caso uma policy futura saia errada)
- [x] **Trigger de validação**: limite de 500 KB por usuário, `dados` obrigatoriamente objeto JSON, `atualizado_em` carimbado pelo servidor
- [x] **`.env` no `.gitignore`** (com exceção explícita para o `.env.example`)
- [x] **Headers HTTP** em `vercel.json`: CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, Permissions-Policy
- [x] **CSP em `<meta>`** no `index.html` como rede de segurança para hosts sem cabeçalhos próprios (GitHub Pages). Cobre script, style, img e connect; **não** cobre `frame-ancestors` nem HSTS, que só funcionam como cabeçalho HTTP
- [x] **`X-Robots-Tag: noindex`** — é um sistema pessoal, não precisa aparecer no Google
- [x] **Links externos** com `rel="noreferrer"`
- [x] **Sem `dangerouslySetInnerHTML`** em lugar nenhum — todo texto que você digita é renderizado escapado pelo React
- [x] **Senha nunca sai do formulário** — o Supabase faz o hash; o app nunca vê nem guarda a senha
- [x] **Política de senha** — mínimo 10 caracteres, 3 dos 4 tipos de caractere, bloqueio de senhas comuns, de sequências (`1234`, `qwerty`), de repetições e de senha contendo o próprio email. Medidor visual de força, e o botão de criar conta só habilita quando passa
- [x] **Backoff exponencial no login** — 3 tentativas livres, depois 10s → 20s → 40s → 1min20 → 2min40, teto de 5min. Persiste no navegador, então recarregar a página não zera. Falha de **rede** não conta como tentativa errada
- [x] **Mensagens sem enumeração de usuários** — login errado e cadastro duplicado devolvem textos que não revelam se aquele email tem conta. É assim que se evita que alguém descubra emails válidos antes de tentar força bruta
- [x] **Limite de 60 gravações por minuto por usuário**, aplicado em trigger no banco (janela deslizante na própria linha). O cliente não consegue burlar: o contador é recalculado no servidor e ignora o que vem do navegador
- [x] **Reenvio com espera exponencial** quando a gravação falha — até 5 tentativas antes de reportar erro, então queda de rede ou limite de taxa não perde o seu progresso
- [x] **Detecção de configuração quebrada** — se o `.env` tiver BOM (o PowerShell grava assim com `-Encoding utf8`) ou só uma das duas variáveis, o app avisa na tela e no console em vez de cair em modo local silenciosamente
- [x] **Alerta se a chave for `service_role`** — o app grita no console se detectar a chave errada

## Painel — você precisa fazer

### Supabase

- [ ] **Authentication → Providers → Email**: manter *Confirm email* **ligado**. Sem isso alguém cadastra com o email de outra pessoa.
- [ ] **Authentication → Policies / Password**: ativar *Leaked password protection* (compara com a base do HaveIBeenPwned) e exigir mínimo de 8 caracteres.
- [ ] **Authentication → URL Configuration**: colocar a URL da Vercel em *Site URL* e em *Redirect URLs*. Sem isso o link de recuperação de senha aponta para `localhost`.
- [ ] **Fechar o cadastro público** — veja a ordem correta abaixo.
- [ ] **Account → Security**: ativar MFA na sua conta Supabase.

> ### ⚠️ Ordem importa: crie sua conta ANTES de fechar o cadastro
>
> O DevPath é seu sistema pessoal, mas com cadastro aberto qualquer pessoa que descobrir a URL pode criar conta nele. Isso não expõe seus dados (o RLS garante isso), mas enche seu projeto de usuários e consome a cota do plano gratuito.
>
> 1. Publique o site
> 2. Crie a **sua** conta e confirme o email
> 3. Confirme que o login funciona e que seu progresso migrou
> 4. **Só então** vá em *Authentication → Sign In / Providers* e desative *Allow new users to sign up*
>
> Se inverter a ordem, você fica trancado do lado de fora e vai precisar criar o usuário na mão pelo painel.

### Vercel e GitHub

- [ ] Variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` cadastradas em *Environment Variables* (não commitadas)
- [ ] MFA ativado nas duas contas
- [ ] Repositório **público** (exigência do GitHub Pages gratuito). Sem problema de segurança: a chave anon é pública por design e o RLS protege os dados. Mas confira dois pontos:
  - [ ] Nenhum `.env` commitado (`git ls-files | grep env` deve mostrar só `.env.example`)
  - [ ] Email de commit privado: *GitHub → Settings → Emails → Keep my email addresses private*

## Sobre as dependências

`npm audit` reporta 2 vulnerabilidades altas em `react-router` (GHSA-qwww-vcr4-c8h2, *RSC Mode CSRF Bypass*). Decisão consciente de **manter a versão atual (7.18.2)**:

- O aviso é específico do **modo RSC** (React Server Components com server actions). Este app é uma SPA puramente cliente, com `HashRouter`, sem servidor e sem RSC. O código vulnerável nunca é executado aqui.
- A correção sugerida pelo `npm audit fix --force` é **descer** para a 7.11.0 — que reintroduz o *open redirect levando a XSS* (GHSA-jjmj-jmhj-qwj2), corrigido justamente na 7.18.0. Esse sim é explorável em cliente.

Ou seja: descer de versão deixaria o app **menos** seguro. Quando sair uma versão acima da 8.2.0, atualize e o audit zera.

As vulnerabilidades de `vite`/`esbuild` que existiam antes foram resolvidas na atualização para o Vite 8. Elas afetavam apenas o servidor de desenvolvimento, nunca o site publicado.

## Limites de taxa: quem protege o quê

Existem três camadas, e é importante saber que só uma delas é segurança de verdade:

| Camada | Onde roda | Vale como segurança? |
|---|---|---|
| Backoff do formulário de login | Navegador | **Não.** Um atacante chama a API direto e ignora nossa tela. Serve para você não se trancar sozinho e para travar quem tenta na marra pela interface. |
| Rate limit do Supabase Auth | Servidor | **Sim.** Limita tentativas de login, cadastro e envio de email por IP. É o que realmente barra força bruta. |
| Limite de 60 gravações/min | Banco (trigger) | **Sim.** Impede que uma sessão comprometida ou um script queime sua cota gravando em loop. |

Ajuste a segunda camada em **Authentication → Rate Limits** no painel do Supabase. Os padrões já são razoáveis; com o cadastro fechado, ficam folgados.

## Se abrir para outros usuários

Nada disto é necessário enquanto o sistema for só seu. Se um dia abrir o cadastro:

- **CAPTCHA** (Cloudflare Turnstile) nas telas de login e cadastro — o Supabase tem suporte nativo em *Authentication → Attack Protection*. É a maior barreira contra cadastro automatizado. Vai exigir liberar `challenges.cloudflare.com` na CSP do `vercel.json`.
- **SMTP próprio** (Resend, SendGrid, Amazon SES) — o servidor de email embutido do Supabase tem limite baixo e não serve para produção.
- **Apertar os rate limits** de cadastro e de envio de email.
- **Política de retenção**: decidir o que acontece com contas que nunca confirmaram o email.

## Verificando depois de publicar

Com o site no ar, confira os headers:

```bash
curl -sI https://SEU-SITE.vercel.app | findstr /i "content-security strict-transport x-frame x-content"
```

E teste o RLS na prática: crie uma segunda conta de teste, marque algo diferente nela e confirme que uma não enxerga o progresso da outra. Depois apague a conta de teste em *Authentication → Users*.
