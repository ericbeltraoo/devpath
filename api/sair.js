import { cookieVazio } from './_lib/auth.js'
import { rota, soMetodo } from './_lib/responder.js'

export default rota(async (req, res) => {
  if (!soMetodo(req, res, 'POST')) return
  res.setHeader('Set-Cookie', cookieVazio())
  res.status(204).end()
})
