# Segurança — checklist antes e depois de publicar

Marque conforme for fazendo. Os itens de **código** já estão prontos; os de **painel** só você pode executar, porque exigem login nas suas contas.

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
- [x] **`X-Robots-Tag: noindex`** — é um sistema pessoal, não precisa aparecer no Google
- [x] **Links externos** com `rel="noreferrer"`
- [x] **Sem `dangerouslySetInnerHTML`** em lugar nenhum — todo texto que você digita é renderizado escapado pelo React
- [x] **Senha nunca sai do formulário** — o Supabase faz o hash; o app nunca vê nem guarda a senha

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
- [ ] Repositório **privado** — não porque tem segredo, mas porque não há motivo para ser público antes de estar pronto para portfólio

## Sobre as dependências

`npm audit` reporta 2 vulnerabilidades altas em `react-router` (GHSA-qwww-vcr4-c8h2, *RSC Mode CSRF Bypass*). Decisão consciente de **manter a versão atual (7.18.2)**:

- O aviso é específico do **modo RSC** (React Server Components com server actions). Este app é uma SPA puramente cliente, com `HashRouter`, sem servidor e sem RSC. O código vulnerável nunca é executado aqui.
- A correção sugerida pelo `npm audit fix --force` é **descer** para a 7.11.0 — que reintroduz o *open redirect levando a XSS* (GHSA-jjmj-jmhj-qwj2), corrigido justamente na 7.18.0. Esse sim é explorável em cliente.

Ou seja: descer de versão deixaria o app **menos** seguro. Quando sair uma versão acima da 8.2.0, atualize e o audit zera.

As vulnerabilidades de `vite`/`esbuild` que existiam antes foram resolvidas na atualização para o Vite 8. Elas afetavam apenas o servidor de desenvolvimento, nunca o site publicado.

## Verificando depois de publicar

Com o site no ar, confira os headers:

```bash
curl -sI https://SEU-SITE.vercel.app | findstr /i "content-security strict-transport x-frame x-content"
```

E teste o RLS na prática: crie uma segunda conta de teste, marque algo diferente nela e confirme que uma não enxerga o progresso da outra. Depois apague a conta de teste em *Authentication → Users*.
