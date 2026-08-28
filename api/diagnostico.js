import { candidatosDeUrl, consultar, NOMES, variaveisDeBancoVisiveis, conexaoEmUso, detalheErro } from './_lib/db.js'

// ---------------------------------------------------------------------------
// Diagnostico de configuracao
// ---------------------------------------------------------------------------
// Um 500 generico na tela de login pode ser: banco inacessivel, tabela que
// nao existe, JWT_SECRET curto ou SENHA_HASH ausente. Sem isto, descobrir
// qual significa cacar log de funcao no painel.
//
// NAO devolve o valor de nenhuma variavel. So diz se existe e se tem a cara
// certa — tamanho, prefixo. E o suficiente para achar o erro e insuficiente
// para vazar segredo.
// ---------------------------------------------------------------------------

export default async function handler(req, res) {
  const r = {
    // Qual codigo esta rodando de fato. Sem isto nao da para distinguir
    // "o conserto nao funcionou" de "o conserto nem chegou no ar" — e a
    // segunda hipotese e comum: URL de deployment aponta para sempre para
    // aquele deploy, e "Redeploy" reconstroi o MESMO commit.
    versao: {
      commit: (process.env.VERCEL_GIT_COMMIT_SHA || 'desconhecido').slice(0, 7),
      mensagem: (process.env.VERCEL_GIT_COMMIT_MESSAGE || '').split(String.fromCharCode(10))[0] || null,
      ambiente: process.env.VERCEL_ENV || 'desconhecido',
      url: process.env.VERCEL_URL || null,
    },
    banco: {
      variavelEncontrada: false,
      conecta: false,
      tabelas: [],
      erro: null,
      // Nomes que existem no ambiente e nomes que o codigo procura. Com os
      // dois lado a lado da para ver na hora se o problema e ausencia ou
      // nome diferente. Valores nunca aparecem.
      variaveisPresentes: variaveisDeBancoVisiveis(),
      nomesAceitos: NOMES,
    },
    senha: { definida: false, pareceHashBcrypt: false },
    token: { definido: false, tamanhoSuficiente: false },
    pronto: false,
  }

  // ---- banco
  const candidatos = candidatosDeUrl()
  r.banco.variavelEncontrada = candidatos.length > 0
  // Quais nomes tem URL com cara de Postgres. Nomes, nunca valores.
  r.banco.candidatos = candidatos.map((c) => c.nome)

  if (candidatos.length) {
    try {
      const linhas = await consultar(
        `SELECT table_name FROM information_schema.tables
          WHERE table_schema = 'public' ORDER BY table_name`
      )
      r.banco.conecta = true
      r.banco.tabelas = linhas.map((l) => l.table_name)
      r.banco.conexaoEmUso = conexaoEmUso()   // qual das candidatas respondeu
    } catch (e) {
      r.banco.erro = detalheErro(e)   // sem a connection string dentro
    }
  }

  // ---- senha
  const hash = process.env.SENHA_HASH
  r.senha.definida = Boolean(hash)
  // Um hash bcrypt tem 60 caracteres e comeca com $2a$, $2b$ ou $2y$.
  // O engano mais comum e colar a SENHA no lugar do hash.
  r.senha.pareceHashBcrypt = Boolean(hash && /^\$2[aby]\$\d\d\$/.test(hash) && hash.length === 60)

  // ---- token
  const seg = process.env.JWT_SECRET
  r.token.definido = Boolean(seg)
  r.token.tamanhoSuficiente = Boolean(seg && seg.length >= 32)

  const temTabelas = r.banco.tabelas.includes('progresso') && r.banco.tabelas.includes('tentativas')
  r.pronto = r.banco.conecta && temTabelas && r.senha.pareceHashBcrypt && r.token.tamanhoSuficiente

  r.oQueFalta = []
  if (!r.banco.variavelEncontrada) {
    r.oQueFalta.push(
      r.banco.variaveisPresentes.length
        ? `Ha variaveis de banco (${r.banco.variaveisPresentes.join(', ')}), mas nenhuma com URL Postgres valida. Confira o valor.`
        : 'Nenhuma variavel de banco no ambiente. Adicione DATABASE_URL e REDEPLOY — variavel nova nao entra em deploy antigo.'
    )
  }
  else if (!r.banco.conecta) r.oQueFalta.push('A connection string existe mas nao conecta. Veja banco.erro.')
  else if (!temTabelas) r.oQueFalta.push('Conectou, mas faltam as tabelas. Rode: node preparar-banco.mjs "<url>"')
  if (!r.senha.definida) r.oQueFalta.push('SENHA_HASH ausente.')
  else if (!r.senha.pareceHashBcrypt) r.oQueFalta.push('SENHA_HASH nao parece um hash bcrypt. Voce colou a senha em vez do hash?')
  if (!r.token.definido) r.oQueFalta.push('JWT_SECRET ausente.')
  else if (!r.token.tamanhoSuficiente) r.oQueFalta.push('JWT_SECRET tem menos de 32 caracteres.')

  res.status(200).json(r)
}
