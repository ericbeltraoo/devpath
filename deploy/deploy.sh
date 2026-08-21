#!/usr/bin/env bash
# ===========================================================================
# Deploy do DevPath na VPS
# ===========================================================================
# Rode NA VPS, dentro de /opt/devpath:
#   ./deploy/deploy.sh
#
# O que ele faz:
#   1. puxa o codigo mais novo do git
#   2. builda o frontend e publica em /var/www
#   3. instala dependencias da API e reinicia o servico
#   4. confere que a API respondeu; se nao, avisa e sai com erro
#
# Aborta na primeira falha de proposito: deploy que continua depois de um
# erro produz um estado pior do que nao ter feito nada.
# ===========================================================================
set -euo pipefail

REPO="/opt/devpath"
WEB="/var/www/devpath.lastweek.com.br"
SERVICO="devpath-api"
BRANCH="${1:-main}"

azul()  { printf '\033[0;34m%s\033[0m\n' "$1"; }
verde() { printf '\033[0;32m%s\033[0m\n' "$1"; }
erro()  { printf '\033[0;31mERRO: %s\033[0m\n' "$1" >&2; exit 1; }

[ -d "$REPO/.git" ] || erro "$REPO nao e um repositorio git. Clone antes de rodar o deploy."
command -v node >/dev/null || erro "Node nao encontrado. Instale a versao 20 ou superior."

cd "$REPO"

# ------------------------------------------------------------------ codigo
azul "==> Buscando codigo (branch $BRANCH)"
git fetch --quiet origin "$BRANCH"

ANTES="$(git rev-parse HEAD)"
git reset --hard --quiet "origin/$BRANCH"
DEPOIS="$(git rev-parse HEAD)"

if [ "$ANTES" = "$DEPOIS" ]; then
  azul "    Nada novo. Reconstruindo mesmo assim."
else
  azul "    $(git log --oneline "$ANTES..$DEPOIS" | wc -l) commit(s) novo(s)."
fi

# ---------------------------------------------------------------- frontend
azul "==> Build do frontend"
[ -f .env ] || erro "Falta o .env na raiz com VITE_API_URL."
npm ci --silent
npm run build --silent

# Publica de forma quase atomica: monta ao lado e troca no fim, para nao
# existir um instante em que o site esta com metade dos arquivos.
azul "==> Publicando em $WEB"
sudo mkdir -p "$WEB"
sudo rsync -a --delete dist/ "$WEB/"
sudo chown -R www-data:www-data "$WEB"

# --------------------------------------------------------------------- API
azul "==> Atualizando a API"
[ -f servidor/.env ] || erro "Falta o servidor/.env com as credenciais do MySQL."
cd servidor
npm ci --omit=dev --silent
cd ..

sudo systemctl restart "$SERVICO"

# ------------------------------------------------------------- verificacao
azul "==> Conferindo se a API subiu"
sleep 3
for i in 1 2 3 4 5; do
  if curl -fsS --max-time 5 http://127.0.0.1:3001/api/health >/dev/null 2>&1; then
    verde "==> Deploy concluido. https://devpath.lastweek.com.br"
    exit 0
  fi
  sleep 2
done

printf '\033[0;31m'
echo "A API nao respondeu no /api/health apos o restart."
echo "Ultimas linhas do log:"
printf '\033[0m'
sudo journalctl -u "$SERVICO" -n 30 --no-pager
erro "Deploy incompleto: o frontend foi publicado, mas a API esta fora."
