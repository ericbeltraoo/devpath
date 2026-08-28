import { exigirSessao } from './_lib/auth.js'
import { consultar } from './_lib/db.js'
import { rota, soMetodo } from './_lib/responder.js'

const LIMITE = 512 * 1024 // 500 KB

export default rota(async (req, res) => {
  if (!soMetodo(req, res, 'GET', 'PUT')) return
  exigirSessao(req)

  if (req.method === 'GET') {
    const linhas = await consultar('SELECT dados, atualizado_em FROM progresso WHERE id = 1')
    if (!linhas.length) return res.json({ dados: null, atualizadoEm: null })
    return res.json({ dados: linhas[0].dados, atualizadoEm: linhas[0].atualizado_em })
  }

  const dados = req.body?.dados
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    return res.status(400).json({ erro: 'O campo dados precisa ser um objeto.', codigo: 'payload_invalido' })
  }

  const json = JSON.stringify(dados)
  if (Buffer.byteLength(json, 'utf8') > LIMITE) {
    return res.status(413).json({ erro: 'Progresso acima de 500 KB.', codigo: 'muito_grande' })
  }

  // Uma linha so, id fixo. UPSERT para nao precisar saber se ja existe.
  await consultar(
    `INSERT INTO progresso (id, dados, atualizado_em) VALUES (1, $1, NOW())
     ON CONFLICT (id) DO UPDATE SET dados = EXCLUDED.dados, atualizado_em = NOW()`,
    [json]
  )
  res.json({ atualizadoEm: new Date().toISOString() })
})
