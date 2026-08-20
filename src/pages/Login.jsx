import { useEffect, useMemo, useRef, useState } from 'react'
import { entrar, criarConta, traduzirErro, recuperacaoDisponivel } from '../lib/api'
import { avaliarSenha, calcularEspera, formatarEspera, MIN_CARACTERES, TENTATIVAS_LIVRES } from '../lib/senha'

const MODOS = {
  entrar: { titulo: 'Entrar', acao: 'Entrar', alt: 'Ainda nao tem conta? Criar uma' },
  criar: { titulo: 'Criar conta', acao: 'Criar conta', alt: 'Ja tem conta? Entrar' },
  // 'recuperar' so volta quando houver servidor SMTP configurado.
  recuperar: { titulo: 'Recuperar senha', acao: 'Enviar link', alt: 'Voltar para o login' },
}

// Guardado no navegador para que recarregar a pagina nao zere o bloqueio.
const CHAVE_TENTATIVAS = 'devpath:auth-tentativas'

function lerTentativas() {
  try {
    const t = JSON.parse(localStorage.getItem(CHAVE_TENTATIVAS) || '{}')
    return { falhas: Number(t.falhas) || 0, liberaEm: Number(t.liberaEm) || 0 }
  } catch {
    return { falhas: 0, liberaEm: 0 }
  }
}

/** Problema de conectividade, nao credencial errada. */
function ehFalhaDeRede(erro) {
  const m = (erro?.message || '').toLowerCase()
  return (
    !navigator.onLine ||
    m.includes('failed to fetch') ||
    m.includes('networkerror') ||
    m.includes('network request failed') ||
    m.includes('timeout') ||
    (erro?.status >= 500 && erro?.status <= 599)
  )
}

function gravarTentativas(t) {
  try {
    localStorage.setItem(CHAVE_TENTATIVAS, JSON.stringify(t))
  } catch {
    /* modo privado pode bloquear; o backoff do servidor continua valendo */
  }
}

function MedidorSenha({ senha, email }) {
  const r = useMemo(() => avaliarSenha(senha, email), [senha, email])
  if (!senha) return null

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 99,
              background: i < r.pontos ? r.nivel.cor : 'var(--surface-2)',
              transition: 'background .2s',
            }}
          />
        ))}
      </div>
      <div className="small" style={{ color: r.nivel.cor, fontWeight: 600 }}>
        {r.nivel.rotulo}
      </div>
      {r.problemas.length > 0 && (
        <ul className="lista-simples" style={{ marginTop: 6, gap: 3 }}>
          {r.problemas.map((p, i) => (
            <li key={i} style={{ fontSize: 12.3 }}>
              {p}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function Login() {
  const [modo, setModo] = useState('entrar')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  const [aviso, setAviso] = useState(null)

  const [tentativas, setTentativas] = useState(lerTentativas)
  const [agora, setAgora] = useState(() => Date.now())
  const intervalo = useRef(null)

  const segundosRestantes = Math.max(0, Math.ceil((tentativas.liberaEm - agora) / 1000))
  const bloqueado = segundosRestantes > 0

  // Relogio de 1s apenas enquanto ha bloqueio ativo
  useEffect(() => {
    if (!bloqueado) {
      clearInterval(intervalo.current)
      return
    }
    intervalo.current = setInterval(() => setAgora(Date.now()), 1000)
    return () => clearInterval(intervalo.current)
  }, [bloqueado])

  const forca = useMemo(() => avaliarSenha(senha, email), [senha, email])
  const podeEnviar =
    !carregando && !bloqueado && (modo !== 'criar' || forca.aceitavel)

  function registrarFalha() {
    const falhas = tentativas.falhas + 1
    const espera = calcularEspera(falhas)
    const novo = { falhas, liberaEm: espera > 0 ? Date.now() + espera * 1000 : 0 }
    setTentativas(novo)
    setAgora(Date.now())
    gravarTentativas(novo)
  }

  function limparFalhas() {
    const novo = { falhas: 0, liberaEm: 0 }
    setTentativas(novo)
    gravarTentativas(novo)
  }

  async function enviar(e) {
    e.preventDefault()
    if (!podeEnviar) return

    setErro(null)
    setAviso(null)
    setCarregando(true)

    try {
      if (modo === 'entrar') {
        try {
          await entrar(email, senha)
        } catch (err) {
          // Falha de rede/servidor NAO conta como tentativa errada de senha —
          // senao uma oscilacao de internet tranca voce do lado de fora.
          if (!ehFalhaDeRede(err)) registrarFalha()
          throw err
        }
        limparFalhas()
      } else if (modo === 'criar') {
        await criarConta(email, senha)
        // Sem confirmacao por email neste servidor, a conta ja nasce ativa.
        setAviso('Conta criada. Agora entre com o email e a senha que voce acabou de cadastrar.')
        setSenha('')
        setModo('entrar')
      } else {
        // Sem servidor SMTP configurado, prometer email seria mentira.
        setAviso(
          'A recuperacao por email ainda nao esta ativa neste servidor. ' +
            'Para redefinir a senha, e preciso faze-lo direto no banco.'
        )
      }
    } catch (err) {
      setErro(traduzirErro(err))
    } finally {
      setCarregando(false)
    }
  }

  function trocarModo(novo) {
    setErro(null)
    setAviso(null)
    setSenha('')
    setModo(novo)
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

        <form className="card" onSubmit={enviar} noValidate>
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
          {bloqueado && (
            <div className="callout warn" style={{ marginBottom: 14 }}>
              <b>Muitas tentativas</b>
              Aguarde {formatarEspera(segundosRestantes)} antes de tentar de novo. Se esqueceu a senha, use a
              recuperacao — e mais rapido que adivinhar.
            </div>
          )}
          {!bloqueado && tentativas.falhas > 0 && tentativas.falhas < TENTATIVAS_LIVRES && modo === 'entrar' && (
            <div className="small muted" style={{ marginBottom: 12 }}>
              {TENTATIVAS_LIVRES - tentativas.falhas} tentativa(s) antes do bloqueio temporario.
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              disabled={bloqueado}
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
                placeholder={modo === 'criar' ? `pelo menos ${MIN_CARACTERES} caracteres` : 'sua senha'}
                disabled={bloqueado}
                required
              />
              {modo === 'criar' && (
                <>
                  <MedidorSenha senha={senha} email={email} />
                  <span className="help" style={{ marginTop: 6 }}>
                    Use uma senha exclusiva deste site. O ideal e gerar e guardar em um gerenciador de senhas.
                  </span>
                </>
              )}
            </div>
          )}

          <button className="btn primary" type="submit" disabled={!podeEnviar} style={{ width: '100%', marginTop: 4 }}>
            {carregando ? 'Aguarde...' : bloqueado ? `Bloqueado (${formatarEspera(segundosRestantes)})` : m.acao}
          </button>

          <div className="center" style={{ marginTop: 16 }}>
            <button type="button" className="btn ghost sm" onClick={() => trocarModo(modo === 'entrar' ? 'criar' : 'entrar')}>
              {m.alt}
            </button>
          </div>

          {modo === 'entrar' && recuperacaoDisponivel && (
            <div className="center">
              <button type="button" className="btn ghost sm" onClick={() => trocarModo('recuperar')}>
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
