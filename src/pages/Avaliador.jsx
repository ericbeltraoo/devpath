import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { CRITERIOS, avaliar } from '../data/linkedin'
import { Bar, Ring, Callout } from '../components/ui'

const ROTULOS_ESC = ['Nao tenho', 'Fraco', 'Bom', 'Otimo']
const ROTULOS_SN = ['Nao', 'Sim']

export default function Avaliador() {
  const { estado, setLinkedinResposta, registrarNotaLinkedin } = useApp()
  const respostas = estado.linkedin.respostas
  const respondidos = Object.keys(respostas).length

  const r = useMemo(() => avaliar(respostas), [respostas])

  const secoes = [...new Set(CRITERIOS.map((c) => c.secao))]

  return (
    <>
      <div className="page-head">
        <h1>Avaliador de LinkedIn</h1>
        <div className="sub">
          Abra seu perfil em outra aba e responda com honestidade. A nota e ponderada: os campos que mais pesam na
          busca do recrutador (headline, Sobre, projetos) valem mais pontos.
        </div>
      </div>

      {/* ------------------------------------------------------ resultado */}
      <div className="card">
        <div className="row" style={{ gap: 26, alignItems: 'center' }}>
          <Ring pct={r.nota} cor={r.faixa.cor} label={r.nota} sub="de 100" />
          <div style={{ flex: 1, minWidth: 250 }}>
            <div className="row" style={{ gap: 8, marginBottom: 6 }}>
              <h2>{r.faixa.rotulo}</h2>
              <span className="chip" style={{ borderColor: r.faixa.cor, color: r.faixa.cor }}>
                {respondidos}/{CRITERIOS.length} criterios respondidos
              </span>
            </div>
            <p className="small muted">{r.faixa.texto}</p>
            {respondidos < CRITERIOS.length && (
              <p className="small" style={{ color: 'var(--warn)' }}>
                Criterios nao respondidos contam como zero — responda todos para a nota ser real.
              </p>
            )}
            <div className="btn-row" style={{ marginTop: 12 }}>
              <button className="btn sm" onClick={() => registrarNotaLinkedin(r.nota)}>
                📌 Registrar esta nota
              </button>
              <Link className="btn sm ghost" to="/linkedin">
                Ver o tutorial
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------- por secao */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 12 }}>Nota por secao</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {r.secoes.map((s) => (
            <div key={s.nome}>
              <div className="spread small" style={{ marginBottom: 4 }}>
                <span>{s.nome}</span>
                <span style={{ fontWeight: 700, color: s.nota >= 75 ? 'var(--ok)' : s.nota >= 50 ? 'var(--warn)' : 'var(--danger)' }}>
                  {s.nota}%
                </span>
              </div>
              <Bar
                pct={s.nota}
                thin
                cor={s.nota >= 75 ? 'var(--ok)' : s.nota >= 50 ? 'var(--warn)' : 'var(--danger)'}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------ plano de acao */}
      {r.acoes.length > 0 && (
        <div className="card">
          <div className="card-title">Plano de acao priorizado</div>
          <div className="card-sub" style={{ marginBottom: 14 }}>
            Ordenado por ganho real de pontos. Faca de cima para baixo — os 3 primeiros costumam valer mais que os
            15 seguintes juntos.
          </div>
          {r.acoes.slice(0, 10).map((a, i) => (
            <div
              key={a.id}
              style={{
                display: 'flex', gap: 12, padding: '11px 0',
                borderTop: i === 0 ? 'none' : '1px solid var(--border-soft)',
              }}
            >
              <div
                style={{
                  width: 24, height: 24, flexShrink: 0, borderRadius: 6,
                  background: i < 3 ? 'var(--accent)' : 'var(--surface-2)',
                  color: i < 3 ? '#fff' : 'var(--text-3)',
                  display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700,
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{a.pergunta}</div>
                <div className="small muted" style={{ marginTop: 2 }}>{a.dica}</div>
              </div>
              <div className="chip info" style={{ alignSelf: 'flex-start' }}>
                +{Math.round((a.ganho / r.pesoTotal) * 100)} pts
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --------------------------------------------------- historico */}
      {estado.linkedin.historico.length > 1 && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 10 }}>Evolucao</div>
          <div className="row" style={{ gap: 10, alignItems: 'flex-end', height: 90 }}>
            {estado.linkedin.historico.map((h) => (
              <div key={h.data} style={{ textAlign: 'center', flex: 1, maxWidth: 60 }}>
                <div
                  style={{
                    height: `${Math.max(4, h.nota * 0.7)}px`,
                    background: 'var(--accent)',
                    borderRadius: '4px 4px 0 0',
                    marginBottom: 5,
                  }}
                  title={`${h.nota} pontos`}
                />
                <div style={{ fontSize: 11, fontWeight: 700 }}>{h.nota}</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{h.data.slice(5).replace('-', '/')}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Callout tipo="warn" titulo="Responda olhando para o perfil, nao de memoria">
        A maioria das pessoas superestima o proprio perfil. Abra o LinkedIn em outra aba, no modo de visualizacao
        publica, e responda vendo o que um recrutador ve.
      </Callout>

      {/* ----------------------------------------------- questionario */}
      <div style={{ marginTop: 18 }}>
        {secoes.map((secao) => (
          <div className="card" key={secao}>
            <div className="card-title" style={{ marginBottom: 4 }}>{secao}</div>
            <div className="card-sub" style={{ marginBottom: 14 }}>
              Peso total: {CRITERIOS.filter((c) => c.secao === secao).reduce((s, c) => s + c.peso, 0)} pontos
            </div>

            {CRITERIOS.filter((c) => c.secao === secao).map((c) => {
              const valor = respostas[c.id]
              const max = c.tipo === 'sn' ? 1 : 3
              const rotulos = c.tipo === 'sn' ? ROTULOS_SN : ROTULOS_ESC
              return (
                <div key={c.id} style={{ padding: '12px 0', borderTop: '1px solid var(--border-soft)' }}>
                  <div className="spread" style={{ marginBottom: 8, gap: 10 }}>
                    <span style={{ fontSize: 14, flex: 1 }}>{c.pergunta}</span>
                    <span className="chip">peso {c.peso}</span>
                  </div>
                  <div className="escala">
                    {Array.from({ length: max + 1 }, (_, v) => (
                      <button
                        key={v}
                        className={`${valor === v ? 'sel' : ''}${valor === v && v === 0 ? ' neg' : ''}`}
                        onClick={() => setLinkedinResposta(c.id, v)}
                      >
                        {rotulos[v]}
                      </button>
                    ))}
                  </div>
                  {valor !== undefined && valor < max && (
                    <div className="small" style={{ marginTop: 8, color: 'var(--text-3)' }}>
                      💡 {c.dica}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </>
  )
}
