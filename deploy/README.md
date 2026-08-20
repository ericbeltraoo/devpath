# Deploy — estudo.lastweek.com.br

VPS Hostinger com Nginx e MySQL, compartilhada com o `lastweek.com.br`.
Nada aqui toca na configuração do outro projeto: são `server_block` separados
por `server_name` e um banco novo.

## Arquitetura

```
Navegador
    │  https://estudo.lastweek.com.br
    ▼
  Nginx ──── /            → arquivos estáticos em /var/www/estudo.lastweek.com.br
        └─── /api/*       → proxy para 127.0.0.1:3001
                                  │
                          API Node (systemd)
                                  │
                              MySQL local
```

A API escuta **apenas em 127.0.0.1**. Quem fala com a internet é o Nginx.

Frontend e API no **mesmo domínio** — decisão deliberada: assim o cookie do
refresh token é *first-party* e sobrevive ao bloqueio de cookies de terceiros
que os navegadores aplicam por padrão.

---

## 1. Preparar a VPS

Conecte por SSH e confira o que existe:

```bash
nginx -v; node -v; mysql --version; free -h; df -h /
```

Se não houver Node 20+:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs
```

Crie o usuário do serviço (sem shell, sem home — ele só roda a API):

```bash
sudo useradd --system --no-create-home --shell /usr/sbin/nologin devpath
```

## 2. Banco

```bash
sudo mysql < /opt/devpath/servidor/schema.sql
```

> ⚠️ Antes de rodar, edite a última seção do `schema.sql` e troque
> `TROQUE_ESTA_SENHA` pela senha real do usuário `devpath_app`.

O `schema.sql` cria o banco, as 4 tabelas, o evento de limpeza e um usuário
**sem permissão de DROP nem ALTER** — se a API for comprometida, o atacante
não destrói o schema.

## 3. Código

```bash
sudo mkdir -p /opt/devpath && sudo chown $USER:$USER /opt/devpath
git clone https://github.com/SEU-USUARIO/devpath.git /opt/devpath
cd /opt/devpath
```

**`/opt/devpath/.env`** (frontend, lido no build):

```
VITE_API_URL=https://estudo.lastweek.com.br
```

**`/opt/devpath/servidor/.env`** (API):

```bash
cp servidor/.env.example servidor/.env
openssl rand -base64 48   # cole em JWT_SECRET
nano servidor/.env        # preencha DB_PASSWORD e JWT_SECRET
sudo chown devpath:devpath servidor/.env && sudo chmod 600 servidor/.env
```

> O `chmod 600` importa: sem ele, qualquer usuário da máquina lê a senha do
> banco e o segredo do JWT.

## 4. Serviço

```bash
sudo cp deploy/devpath-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now devpath-api
sudo systemctl status devpath-api
```

Log: `sudo journalctl -u devpath-api -f`

## 5. DNS

No painel do domínio, crie um registro **A** para `estudo` apontando para o IP
da VPS. Confirme antes de seguir — o certbot falha se o DNS não propagou:

```bash
dig +short estudo.lastweek.com.br
```

## 6. Nginx e HTTPS

```bash
sudo cp deploy/nginx-estudo.conf /etc/nginx/sites-available/estudo.lastweek.com.br
sudo ln -s /etc/nginx/sites-available/estudo.lastweek.com.br /etc/nginx/sites-enabled/
```

Comente o bloco `listen 443` (o certificado ainda não existe), depois:

```bash
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d estudo.lastweek.com.br
```

Descomente o bloco 443, `sudo nginx -t && sudo systemctl reload nginx`.

## 7. Primeiro deploy

```bash
cd /opt/devpath && ./deploy/deploy.sh
```

O script builda, publica, reinicia a API e **confere o `/api/health`**. Se a
API não responder, ele mostra o log e sai com erro — deploy que continua
depois de falhar deixa um estado pior do que não ter feito nada.

## 8. Sua conta, e depois fechar a porta

Com `CADASTRO_ABERTO=true` no `servidor/.env`:

1. Abra `https://estudo.lastweek.com.br`
2. Crie sua conta
3. Confirme que o login funciona e que o progresso sincroniza

**Só então:**

```bash
sudo sed -i 's/CADASTRO_ABERTO=true/CADASTRO_ABERTO=false/' /opt/devpath/servidor/.env
sudo systemctl restart devpath-api
```

Invertendo a ordem, você fica trancado do lado de fora.

---

## Deploys seguintes

```bash
cd /opt/devpath && ./deploy/deploy.sh
```

## Verificação pós-deploy

```bash
curl -sI https://estudo.lastweek.com.br | grep -iE "strict-transport|content-security|x-frame"
curl -s https://estudo.lastweek.com.br/api/health
```

E o teste que realmente importa: crie uma **segunda conta**, marque coisas
diferentes nela, e confirme que uma não enxerga o progresso da outra. Depois
apague a conta de teste:

```sql
DELETE FROM usuarios WHERE email = 'teste@exemplo.com';
```

## O que ainda não existe

**Recuperação de senha por email.** Exige servidor SMTP, que a VPS não tem
configurado. A tela de "esqueci minha senha" está escondida em vez de
oferecer um botão que não faz nada. Para redefinir hoje, é no banco:

```sql
-- gere o hash antes: node -e "console.log(require('bcryptjs').hashSync('NovaSenha',12))"
UPDATE usuarios SET senha_hash = '<hash>' WHERE email = 'seu@email.com';
```

**Backup automático do MySQL.** Configure um cron com `mysqldump` — e
restaure pelo menos uma vez para confirmar que o backup presta.

## Trocar por Spring Boot depois

Quando você concluir a fase de Spring Boot do roadmap, a API Node pode ser
substituída sem tocar no frontend: basta manter o mesmo contrato.

| Método | Rota | Corpo |
|---|---|---|
| POST | `/api/auth/cadastrar` | `{ email, senha, nome }` |
| POST | `/api/auth/login` | `{ email, senha }` → `{ accessToken, usuario }` + cookie |
| POST | `/api/auth/refresh` | cookie → `{ accessToken, usuario }` |
| POST | `/api/auth/logout` | cookie |
| GET | `/api/progresso` | → `{ dados, atualizadoEm }` |
| PUT | `/api/progresso` | `{ dados }` |

Trocar o `proxy_pass` do Nginx para a porta do Spring é o único ajuste de
infraestrutura. Esse é o projeto de portfólio de que falamos.
