import { useState } from 'react'
import { entrar, traduzirErro } from '../lib/api'
import { useApp } from '../context/AppContext'

// ---------------------------------------------------------------------------
// Entrada
// ---------------------------------------------------------------------------
// Uma senha. Nao ha email, cadastro, forca de senha nem recuperacao — o
// sistema tem um dono, e a senha vive como hash numa variavel de ambiente do
// servidor.
//
// A tela anterior tinha 276 linhas: dois modos, medidor de forca, validacao
// de politica e backoff com contador. Aquilo existia para proteger um cadastro
// publico que nao existe mais. Codigo que defende algo inexistente nao e
// seguranca extra, e superficie extra.
// ---------------------------------------------------------------------------

export default function Login() {
  const { setSessao } = useApp()
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    if (!senha || enviando) return

    setEnviando(true)
    setErro(null)
    try {
      const usuario = await entrar(senha)
      setSessao({ user: usuario })
    } catch (err) {
      setErro(traduzirErro(err))
      setSenha('')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="onboard-wrap">
      <form className="card" style={{ width: '100%', maxWidth: 380 }} onSubmit={enviar}>
        <div className="center" style={{ marginBottom: 22 }}>
          <div className="brand-logo" style={{ width: 46, height: 46, fontSize: 20, margin: '0 auto 12px' }}>
            &lt;/&gt;
          </div>
          <h1 style={{ fontSize: 21 }}>DevPath</h1>
          <p className="small muted" style={{ marginTop: 4 }}>
            Seu progresso, em qualquer computador.
          </p>
        </div>

        <div className="field">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            autoFocus
            autoComplete="current-password"
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        {erro && (
          <div className="callout danger" style={{ marginBottom: 14 }}>
            {erro}
          </div>
        )}

        <button className="btn primary" style={{ width: '100%' }} disabled={!senha || enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
