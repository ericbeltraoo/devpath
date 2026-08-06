import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { OBJETIVOS } from '../lib/planner'
import { TRILHAS } from '../data/tracks'

const RITMOS = [
  { h: 6, rotulo: '6h/semana', desc: 'Pouco tempo — 1h por dia util' },
  { h: 12, rotulo: '12h/semana', desc: 'Equilibrado — trabalho + estudo' },
  { h: 20, rotulo: '20h/semana', desc: 'Intenso — noites e fins de semana' },
  { h: 35, rotulo: '35h/semana', desc: 'Dedicacao integral' },
]

export default function Onboarding() {
  const { estado, setPerfil, concluirOnboarding, marcarModulo, nuvemAtiva } = useApp()
  const [passo, setPasso] = useState(0)
  const [jaSei, setJaSei] = useState({})

  const p = estado.perfil

  // Modulos que fazem sentido oferecer como "ja sei" (fundamentos de Java e base)
  const modulosIniciais = TRILHAS.filter((t) => ['base', 'java'].includes(t.id))
    .flatMap((t) => t.fases.slice(0, 2).flatMap((f) => f.modulos.map((m) => ({ ...m, trilha: t.nome }))))

  function finalizar() {
    Object.entries(jaSei).forEach(([id, v]) => {
      if (!v) return
      const mod = modulosIniciais.find((m) => m.id === id)
      if (mod) marcarModulo(mod, true)
    })
    concluirOnboarding()
  }

  return (
    <div className="onboard-wrap">
      <div className="onboard">
        <div className="center" style={{ marginBottom: 26 }}>
          <div
            className="brand-logo"
            style={{ width: 52, height: 52, fontSize: 22, margin: '0 auto 14px' }}
          >
            &lt;/&gt;
          </div>
          <h1>DevPath</h1>
          <p className="muted" style={{ marginTop: 6 }}>
            Vamos montar o seu roteiro ate a primeira vaga de desenvolvedor junior.
          </p>
        </div>

        <div className="card">
          {passo === 0 && (
            <>
              <h2 style={{ marginBottom: 4 }}>1. Quem e voce</h2>
              <p className="small muted">
                {nuvemAtiva
                  ? 'Seu progresso fica salvo na sua conta e acompanha voce em qualquer computador.'
                  : 'Tudo fica salvo neste navegador.'}
              </p>
              <div className="sep" />
              <div className="field">
                <label>Seu nome</label>
                <input
                  type="text"
                  value={p.nome}
                  onChange={(e) => setPerfil({ nome: e.target.value })}
                  placeholder="Como voce quer ser chamado"
                />
              </div>
              <div className="field">
                <label>Data de inicio do plano</label>
                <input
                  type="date"
                  value={p.dataInicio}
                  onChange={(e) => setPerfil({ dataInicio: e.target.value })}
                />
                <span className="help">Use hoje, ou a data em que voce comecou a estudar de verdade.</span>
              </div>
              <div className="btn-row" style={{ justifyContent: 'flex-end' }}>
                <button className="btn primary" onClick={() => setPasso(1)}>
                  Continuar →
                </button>
              </div>
            </>
          )}

          {passo === 1 && (
            <>
              <h2 style={{ marginBottom: 4 }}>2. Qual e o seu objetivo</h2>
              <p className="small muted">
                Isso define a ORDEM das fases. Voce pode mudar depois em Configuracoes.
              </p>
              <div className="sep" />
              <div className="grid" style={{ gap: 10 }}>
                {Object.entries(OBJETIVOS).map(([id, o]) => (
                  <button
                    key={id}
                    onClick={() => setPerfil({ objetivo: id })}
                    className="card"
                    style={{
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderColor: p.objetivo === id ? 'var(--accent)' : 'var(--border-soft)',
                      background: p.objetivo === id ? 'var(--accent-soft)' : 'var(--surface)',
                      color: 'var(--text)',
                      padding: 14,
                    }}
                  >
                    <div className="card-title">
                      <span>{o.icone}</span> {o.nome}
                    </div>
                    <div className="card-sub">{o.desc}</div>
                  </button>
                ))}
              </div>
              <div className="btn-row" style={{ justifyContent: 'space-between', marginTop: 16 }}>
                <button className="btn ghost" onClick={() => setPasso(0)}>← Voltar</button>
                <button className="btn primary" onClick={() => setPasso(2)}>Continuar →</button>
              </div>
            </>
          )}

          {passo === 2 && (
            <>
              <h2 style={{ marginBottom: 4 }}>3. Quanto tempo voce tem por semana</h2>
              <p className="small muted">
                Seja honesto. Um plano que voce nao consegue seguir e pior que nenhum plano.
              </p>
              <div className="sep" />
              <div className="grid" style={{ gap: 10 }}>
                {RITMOS.map((r) => (
                  <button
                    key={r.h}
                    onClick={() => setPerfil({ horasSemana: r.h })}
                    className="card"
                    style={{
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderColor: p.horasSemana === r.h ? 'var(--accent)' : 'var(--border-soft)',
                      background: p.horasSemana === r.h ? 'var(--accent-soft)' : 'var(--surface)',
                      color: 'var(--text)',
                      padding: 13,
                    }}
                  >
                    <div className="card-title">{r.rotulo}</div>
                    <div className="card-sub">{r.desc}</div>
                  </button>
                ))}
              </div>
              <div className="field" style={{ marginTop: 14 }}>
                <label>Ou defina exatamente</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={p.horasSemana}
                  onChange={(e) => setPerfil({ horasSemana: Number(e.target.value) })}
                />
              </div>
              <div className="btn-row" style={{ justifyContent: 'space-between' }}>
                <button className="btn ghost" onClick={() => setPasso(1)}>← Voltar</button>
                <button className="btn primary" onClick={() => setPasso(3)}>Continuar →</button>
              </div>
            </>
          )}

          {passo === 3 && (
            <>
              <h2 style={{ marginBottom: 4 }}>4. O que voce ja domina</h2>
              <p className="small muted">
                Marque o que ja estudou. O plano pula essas partes e recalcula o prazo. Na duvida, deixe
                desmarcado — revisar e barato, buraco de base e caro.
              </p>
              <div className="sep" />
              <div style={{ maxHeight: 320, overflowY: 'auto', paddingRight: 4 }}>
                {modulosIniciais.map((m) => (
                  <label key={m.id} className="topico" style={{ alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={!!jaSei[m.id]}
                      onChange={(e) => setJaSei((s) => ({ ...s, [m.id]: e.target.checked }))}
                    />
                    <span>
                      {m.titulo}
                      <span className="muted small"> · {m.trilha}</span>
                    </span>
                  </label>
                ))}
              </div>
              <div className="callout" style={{ marginTop: 14 }}>
                <b>Dica</b>
                Voce esta em "Calculos com data e hora" no curso do Nelio Alves. Entao marque os modulos de
                sintaxe, controle, arrays e strings — e deixe <b>Data e hora (java.time)</b> desmarcado: ele
                sera o seu proximo passo no plano.
              </div>
              <div className="btn-row" style={{ justifyContent: 'space-between', marginTop: 16 }}>
                <button className="btn ghost" onClick={() => setPasso(2)}>← Voltar</button>
                <button className="btn primary" onClick={finalizar}>Gerar meu plano →</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
