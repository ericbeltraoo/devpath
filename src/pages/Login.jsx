import { useState } from 'react'
import { supabase, traduzirErro } from '../lib/supabase'

const MODOS = {
  entrar: { titulo: 'Entrar', acao: 'Entrar', alt: 'Ainda nao tem conta? Criar uma' },
  criar: { titulo: 'Criar conta', acao: 'Criar conta', alt: 'Ja tem conta? Entrar' },
  recuperar: { titulo: 'Recuperar senha', acao: 'Enviar link de recuperacao', alt: 'Voltar para o login' },
}

export default function Login() {
  const [modo, setModo] = useState('entrar')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  const [aviso, setAviso] = useState(null)

  async function enviar(e) {
    e.preventDefault()
    setErro(null)
    setAviso(null)
    setCarregando(true)

    try {
      if (modo === 'entrar') {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
        if (error) throw error
      } else if (modo === 'criar') {
        const { data, error } = await supabase.auth.signUp({ email, password: senha })
        if (error) throw error
        if (data.user && !data.session) {
          setAviso('Conta criada. Confirme o email que enviamos (veja tambem o spam) e depois entre.')
          setModo('entrar')
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + window.location.pathname,
        })
        if (error) throw error
        setAviso('Se existir uma conta com esse email, o link de recuperacao chegou na caixa de entrada.')
      }
    } catch (err) {
      setErro(traduzirErro(err))
    } finally {
      setCarregando(false)
    }
  }

  const m = MODOS[modo]

  return (
    <div className="onboard-wrap">
      <div className="onboard" style={{ maxWidth: 420 }}>
        <div className="center" style={{ marginBottom: 26 }}>
          <div className="brand-logo" style={{ width: 52, height: 52, fontSize: 22, margin: '0 auto 14px' }}>
            &lt;/&gt;
          </div>
          <h1>DevPath</h1>
          <p className="muted" style={{ marginTop: 6 }}>
            Entre para acessar seu progresso de qualquer computador.
          </p>
        </div>

        <form className="card" onSubmit={enviar}>
          <h2 style={{ marginBottom: 16 }}>{m.titulo}</h2>

          {erro && (
            <div className="callout danger" style={{ marginBottom: 14 }}>
              {erro}
            </div>
          )}
          {aviso && (
            <div className="callout ok" style={{ marginBottom: 14 }}>
              {aviso}
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              required
            />
          </div>

          {modo !== 'recuperar' && (
            <div className="field">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                autoComplete={modo === 'criar' ? 'new-password' : 'current-password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="minimo 6 caracteres"
                minLength={6}
                required
              />
              {modo === 'criar' && (
                <span className="help">Use uma senha que voce nao usa em nenhum outro lugar.</span>
              )}
            </div>
          )}

          <button className="btn primary" type="submit" disabled={carregando} style={{ width: '100%', marginTop: 4 }}>
            {carregando ? 'Aguarde...' : m.acao}
          </button>

          <div className="center" style={{ marginTop: 16 }}>
            <button
              type="button"
              className="btn ghost sm"
              onClick={() => {
                setErro(null)
                setAviso(null)
                setModo(modo === 'entrar' ? 'criar' : 'entrar')
              }}
            >
              {m.alt}
            </button>
          </div>

          {modo === 'entrar' && (
            <div className="center">
              <button
                type="button"
                className="btn ghost sm"
                onClick={() => {
                  setErro(null)
                  setAviso(null)
                  setModo('recuperar')
                }}
              >
                Esqueci minha senha
              </button>
            </div>
          )}
        </form>

        <p className="small muted center" style={{ marginTop: 16 }}>
          Se voce ja usava o DevPath neste navegador, o progresso salvo aqui e enviado automaticamente para a sua
          conta no primeiro login.
        </p>
      </div>
    </div>
  )
}
