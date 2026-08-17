import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { TRILHAS, getTrilha, todosModulos, horasTrilha } from '../data/tracks'
import { progressoModulo } from '../lib/planner'
import { Bar, ChipCurso, Callout } from '../components/ui'

function Modulo({ modulo, aberto }) {
  const { estado, toggleTopico, marcarModulo, setNota, bloqueio } = useApp()
  const p = progressoModulo(modulo, estado.topicos)
  const [notaAberta, setNotaAberta] = useState(false)
  const [licaoAberta, setLicaoAberta] = useState(null)

  // Com a fila de revisao estourada, so e permitido DESMARCAR (corrigir um
  // engano) — marcar topico novo fica travado ate a fila baixar.
  const travado = Boolean(bloqueio)

  return (
    <div className={`modulo${modulo.marcoAtual ? ' marco' : ''}`} id={modulo.id} ref={aberto ? (el) => el?.scrollIntoView({ block: 'center' }) : undefined}>
      <div className="modulo-head">
        <div style={{ flex: 1 }}>
          <div className="row" style={{ gap: 8 }}>
            <span className="modulo-titulo">{modulo.titulo}</span>
            <ChipCurso curso={modulo.curso} />
            {modulo.marcoAtual && <span className="chip warn">seu ponto no curso</span>}
            {p.pct === 100 && <span className="chip ok">✓</span>}
          </div>
          <div className="small muted" style={{ marginTop: 2 }}>
            {modulo.horas}h estimadas · {p.feitos}/{p.total} topicos
          </div>
        </div>
        <div className="modulo-meta">
          <button
            className="btn sm ghost"
            disabled={travado && p.pct !== 100}
            onClick={() => marcarModulo(modulo, p.pct !== 100)}
            title={travado && p.pct !== 100 ? 'Travado: derrube a fila de revisao' : p.pct === 100 ? 'Desmarcar tudo' : 'Marcar tudo'}
          >
            {p.pct === 100 ? 'Desmarcar' : travado ? '🔒 Travado' : 'Marcar tudo'}
          </button>
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <Bar pct={p.pct} thin />
      </div>

      <ul className="topicos">
        {modulo.topicos.map((t, i) => {
          const feito = !!estado.topicos[`${modulo.id}:${i}`]
          const proibido = travado && !feito
          return (
            <li
              key={i}
              className={`topico${feito ? ' feito' : ''}`}
              style={proibido ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
              title={proibido ? 'Travado ate voce derrubar a fila de revisao' : undefined}
              onClick={() => !proibido && toggleTopico(modulo.id, i)}
            >
              <input type="checkbox" checked={feito} readOnly disabled={proibido} />
              <span>{t}</span>
            </li>
          )
        })}
      </ul>

      {modulo.licoes?.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div className="small" style={{ fontWeight: 650, color: 'var(--text-2)', marginBottom: 8 }}>
            📖 Lições deste módulo ({modulo.licoes.length})
          </div>
          {modulo.licoes.map((l, i) => {
            const aberta = licaoAberta === i
            return (
              <div className="acc" key={i} style={{ marginBottom: 6 }}>
                <div className="acc-head" style={{ padding: '10px 13px' }} onClick={() => setLicaoAberta(aberta ? null : i)}>
                  <span style={{ flex: 1, fontSize: 13.8, fontWeight: 560 }}>{l.titulo}</span>
                  <span className="muted small">{aberta ? '▲' : '▼'}</span>
                </div>
                {aberta && (
                  <div className="acc-body" style={{ padding: '2px 13px 14px' }}>
                    <p style={{ marginTop: 12, fontSize: 13.8, lineHeight: 1.65 }}>{l.explicacao}</p>

                    {l.codigo && (
                      <pre
                        className="mono"
                        style={{
                          background: 'var(--bg-2)', border: '1px solid var(--border)',
                          borderRadius: 'var(--r-sm)', padding: 13, overflowX: 'auto',
                          fontSize: 12.2, lineHeight: 1.6, margin: '10px 0',
                        }}
                      >
                        {l.codigo}
                      </pre>
                    )}

                    {l.erroComum && (
                      <div className="callout danger" style={{ marginTop: 10 }}>
                        <b>Erro comum</b>
                        {l.erroComum}
                      </div>
                    )}

                    {l.pergunta && (
                      <div className="callout" style={{ marginTop: 10 }}>
                        <b>Responda antes de seguir</b>
                        {l.pergunta}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {modulo.entregavel && (
        <div className="entregavel">
          <b>Entregavel: </b>
          {modulo.entregavel}
        </div>
      )}

      {modulo.recursos?.length > 0 && (
        <div className="recursos">
          {modulo.recursos.map((r) => (
            <a key={r.url} className="recurso" href={r.url} target="_blank" rel="noreferrer">
              <span>{r.tipo === 'doc' ? '📄' : r.tipo === 'curso' ? '🎓' : r.tipo === 'pratica' ? '⌨️' : r.tipo === 'ferramenta' ? '🔧' : '🔗'}</span>
              {r.titulo}
            </a>
          ))}
        </div>
      )}

      <div style={{ marginTop: 10 }}>
        <button className="btn sm ghost" onClick={() => setNotaAberta((v) => !v)}>
          📝 {estado.notas[modulo.id] ? 'Ver minhas anotacoes' : 'Anotar'}
        </button>
        {notaAberta && (
          <textarea
            style={{ marginTop: 8 }}
            placeholder="O que voce entendeu, o que travou, links uteis, duvidas para revisar depois..."
            value={estado.notas[modulo.id] || ''}
            onChange={(e) => setNota(modulo.id, e.target.value)}
          />
        )}
      </div>
    </div>
  )
}

export default function Roadmap() {
  const { estado, bloqueio } = useApp()
  const [params, setParams] = useSearchParams()
  const trilhaId = params.get('trilha') || 'java'
  const faseParam = params.get('fase')
  const moduloParam = params.get('modulo')

  const trilha = getTrilha(trilhaId) || TRILHAS[0]
  const [abertas, setAbertas] = useState(() => new Set(faseParam ? [faseParam] : [trilha.fases[0]?.id]))

  useEffect(() => {
    if (faseParam) setAbertas((s) => new Set([...s, faseParam]))
    if (moduloParam) {
      const f = trilha.fases.find((x) => x.modulos.some((m) => m.id === moduloParam))
      if (f) setAbertas((s) => new Set([...s, f.id]))
    }
  }, [faseParam, moduloParam, trilha])

  const resumo = useMemo(() => {
    const mods = todosModulos(trilha)
    const total = mods.reduce((s, m) => s + m.topicos.length, 0)
    const feitos = mods.reduce((s, m) => s + progressoModulo(m, estado.topicos).feitos, 0)
    return { total, feitos, pct: total ? Math.round((feitos / total) * 100) : 0, horas: horasTrilha(trilha) }
  }, [trilha, estado.topicos])

  function toggleFase(id) {
    setAbertas((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  return (
    <>
      <div className="page-head">
        <h1>Roadmap</h1>
        <div className="sub">
          Cada tópico é um item marcável. Marque só o que você consegue explicar para outra pessoa — não o que você
          apenas assistiu. Ao marcar, o tópico entra automaticamente na fila de revisão espaçada.
        </div>
      </div>

      {bloqueio && (
        <Callout tipo="danger" titulo="🔒 Conteúdo novo travado">
          {bloqueio.mensagem}{' '}
          <Link to="/revisao" style={{ fontWeight: 600 }}>Ir para a revisão →</Link>
        </Callout>
      )}

      <div className="tabs">
        {TRILHAS.map((t) => (
          <button
            key={t.id}
            className={`tab${t.id === trilha.id ? ' active' : ''}`}
            onClick={() => setParams({ trilha: t.id })}
          >
            {t.icone} {t.nome}
          </button>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 16, borderLeft: `3px solid ${trilha.cor}` }}>
        <div className="spread" style={{ marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div className="card-title">
              {trilha.icone} {trilha.nome}
              <span className="chip">{trilha.area}</span>
            </div>
            <div className="card-sub" style={{ marginTop: 4 }}>{trilha.resumo}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{resumo.pct}%</div>
            <div className="small muted">
              {resumo.feitos}/{resumo.total} topicos · {resumo.horas}h
            </div>
          </div>
        </div>
        <Bar pct={resumo.pct} cor={trilha.cor} />
      </div>

      {trilha.fases.map((fase, i) => {
        const mods = fase.modulos
        const total = mods.reduce((s, m) => s + m.topicos.length, 0)
        const feitos = mods.reduce((s, m) => s + progressoModulo(m, estado.topicos).feitos, 0)
        const pct = total ? Math.round((feitos / total) * 100) : 0
        const aberta = abertas.has(fase.id)

        return (
          <div className="fase" key={fase.id}>
            <div className={`fase-head${pct === 100 ? ' done' : ''}`} onClick={() => toggleFase(fase.id)}>
              <div className="num">{pct === 100 ? '✓' : i + 1}</div>
              <div className="fase-info">
                <div className="fase-nome">{fase.nome}</div>
                <div className="fase-obj">{fase.objetivo}</div>
              </div>
              <div style={{ width: 120, flexShrink: 0 }}>
                <div className="spread small muted" style={{ marginBottom: 4 }}>
                  <span>{mods.length} mod.</span>
                  <span>{pct}%</span>
                </div>
                <Bar pct={pct} cor={trilha.cor} thin />
              </div>
              <span className="muted" style={{ fontSize: 12 }}>{aberta ? '▲' : '▼'}</span>
            </div>

            {aberta && (
              <div className="fase-body">
                {mods.map((m) => (
                  <Modulo key={m.id} modulo={m} aberto={moduloParam === m.id} />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}
