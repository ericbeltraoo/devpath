import { autenticar, assinar, cookieDeSessao } from './_lib/auth.js'
import { rota, soMetodo } from './_lib/responder.js'

export default rota(async (req, res) => {
  if (!soMetodo(req, res, 'POST')) return

  const { senha } = req.body || {}
  await autenticar(senha, req)

  res.setHeader('Set-Cookie', cookieDeSessao(assinar()))
  res.json({ ok: true })
})
