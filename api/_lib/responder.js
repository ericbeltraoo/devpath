import { ErroAuth } from './auth.js'

/** Envolve o handler: JSON na saida, erro tratado, stack so no log. */
export const rota = (fn) => async (req, res) => {
  try {
    await fn(req, res)
  } catch (e) {
    if (e instanceof ErroAuth) {
      return res.status(e.status).json({ erro: e.message, codigo: e.codigo })
    }
    console.error('[erro]', e)
    res.status(500).json({ erro: 'Erro interno.', codigo: 'interno' })
  }
}

export function soMetodo(req, res, ...metodos) {
  if (!metodos.includes(req.method)) {
    res.setHeader('Allow', metodos.join(', '))
    res.status(405).json({ erro: 'Metodo nao permitido.', codigo: 'metodo' })
    return false
  }
  return true
}
