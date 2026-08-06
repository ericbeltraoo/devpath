import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { TRILHAS, getTrilha, todosModulos, horasTrilha } from '../data/tracks'
import { progressoModulo } from '../lib/planner'
import { Bar, ChipCurso } from '../components/ui'

function Modulo({ modulo, aberto }) {
  const { estado, toggleTopico, marcarModulo, setNota } = useApp()
  const p = progressoModulo(modulo, estado.topicos)
  const [notaAberta, setNotaAberta] = useState(false)

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
            onClick={() => marcarModulo(modulo, p.pct !== 100)}
            title={p.pct === 100 ? 'Desmarcar tudo' : 'Marcar tudo'}
          >
            {p.pct === 100 ? 'Desmarcar' : 'Marcar tudo'}
          </button>
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <Bar pct={p.pct} thin />
      </div>

      <ul className="topicos">
        {modulo.topicos.map((t, i) => {
          const feito = !!estado.topicos[`${modulo.id}:${i}`]
          return (
            <li key={i} className={`topico${feito ? ' feito' : ''}`} onClick={() => toggleTopico(modulo.id, i)}>
              <input type="checkbox" checked={feito} readOnly />
              <span>{t}</span>
            </li>
          )
        })}
      </ul>

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
  const { estado } = useApp()
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
          Cada topico e um item marcavel. Marque so o que voce consegue explicar para outra pessoa — nao o que voce
          apenas assistiu.
        </div>
      </div>

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
