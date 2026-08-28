import { exigirSessao } from './_lib/auth.js'
import { rota, soMetodo } from './_lib/responder.js'

/** Diz se o cookie ainda vale. E o que restaura a sessao ao abrir a pagina. */
export default rota(async (req, res) => {
  if (!soMetodo(req, res, 'GET', 'POST')) return
  exigirSessao(req)
  res.json({ ok: true })
})
