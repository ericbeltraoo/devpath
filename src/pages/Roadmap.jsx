import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { TRILHAS, getTrilha, todosModulos, horasTrilha } from '../data/tracks'
import { progressoModulo } from '../lib/planner'
import { EXERCICIOS_MODULO, NIVEIS_EX, idExercicio } from '../data/exerciciosModulos'
import { Bar, ChipCurso, Callout } from '../components/ui'
import CronometroExercicio from '../components/CronometroExercicio'
import { decorrido, duracaoCurta, normalizarRegistro } from '../lib/cronometro'


function ExerciciosDoModulo({ modulo, modulos }) {
  const { estado, setExercicio } = useApp()
  const [aberto, setAberto] = useState(null)
  const lista = EXERCICIOS_MODULO[modulo.id]
  if (!lista?.length) return null

  const registros = lista.map((_, i) => normalizarRegistro(estado.exercicios[idExercicio(modulo.id, i + 1)]))
  const feitos = registros.filter((r) => r?.status === 'feito').length
  const tempoModulo = registros.reduce((soma, r) => soma + decorrido(r), 0)

  return (
    <div style={{ marginTop: 14 }}>
      <div className="spread" style={{ marginBottom: 8 }}>
        <div className="small" style={{ fontWeight: 650, color: 'var(--text-2)' }}>
          ⌨️ Exercícios deste módulo ({feitos}/{lista.length})
        </div>
        <div className="row" style={{ gap: 6 }}>
          {tempoModulo > 0 && <span className="chip">⏱ {duracaoCurta(tempoModulo)} no total</span>}
          {feitos === lista.length && <span className="chip ok">✓ todos resolvidos</span>}
        </div>
      </div>

      {lista.map((ex) => {
        const id = idExercicio(modulo.id, ex.nivel)
        const registro = normalizarRegistro(estado.exercicios[id])
        const status = registro?.status
        const gasto = decorrido(registro)
        const n = NIVEIS_EX[ex.nivel]
        const estaAberto = aberto === ex.nivel

        // O que este exercicio obriga a puxar de modulos anteriores
        const puxa = (ex.revisa || []).map((mid) => {
          const m = modulos[mid]
          const pct = m ? progressoModulo(m, estado.topicos).pct : 0
          return { id: mid, titulo: m?.titulo || mid, pct, ok: pct >= 80 }
        })

        return (
          <div
            className="acc"
            key={ex.nivel}
            style={{ marginBottom: 6, borderColor: status === 'feito' ? 'rgba(34,197,94,.3)' : 'var(--border-soft)' }}
          >
            <div className="acc-head" style={{ padding: '10px 13px' }} onClick={() => setAberto(estaAberto ? null : ex.nivel)}>
              <span
                className="chip"
                style={{ borderColor: n.cor, color: n.cor, flexShrink: 0 }}
              >
                {ex.nivel}. {n.nome}
              </span>
              <span style={{ flex: 1, fontSize: 13.8, fontWeight: 560, minWidth: 0 }}>{ex.titulo}</span>
              <span className="chip">⏱ {ex.tempo}</span>
              {puxa.length > 0 && (
                <span className="chip" style={{ borderColor: 'var(--purple)', color: 'var(--purple)' }}>
                  🔗 {puxa.length}
                </span>
              )}
              {gasto > 0 && <span className="chip" style={{ borderColor: 'var(--purple)', color: 'var(--purple)' }}>⏳ {duracaoCurta(gasto)} seu</span>}
              {registro?.iniciadoEm && <span className="chip info">contando</span>}
              {status === 'feito' && <span className="chip ok">✓</span>}
              <span className="muted small">{estaAberto ? '▲' : '▼'}</span>
            </div>

            {estaAberto && (
              <div className="acc-body" style={{ padding: '2px 13px 14px' }}>
                <div className="small muted" style={{ marginTop: 12, fontStyle: 'italic' }}>{ex.contexto}</div>
                <p style={{ marginTop: 8, fontSize: 13.8, lineHeight: 1.6 }}>{ex.enunciado}</p>

                {puxa.length > 0 && (
                  <div
                    style={{
                      marginTop: 12, padding: 11, borderRadius: 'var(--r-sm)',
                      background: 'rgba(167,139,250,.07)', border: '1px solid rgba(167,139,250,.25)',
                    }}
                  >
                    <div className="small" style={{ fontWeight: 640, marginBottom: 6 }}>
                      🔗 Você vai precisar reusar
                    </div>
                    {puxa.map((r) => (
                      <div key={r.id} className="spread small" style={{ padding: '3px 0' }}>
                        <span style={{ color: r.ok ? 'var(--text-2)' : 'var(--warn)' }}>
                          {r.ok ? '✓' : '○'} {r.titulo}
                        </span>
                        <span className="muted">{r.pct}%</span>
                      </div>
                    ))}
                  </div>
                )}

                <h4 style={{ margin: '14px 0 6px', fontSize: 13, color: 'var(--text-2)' }}>Requisitos</h4>
                <ul className="lista-simples">
                  {ex.requisitos.map((r, i) => <li key={i}>{r}</li>)}
                </ul>

                <h4 style={{ margin: '14px 0 6px', fontSize: 13, color: 'var(--ok)' }}>Critérios de aceite</h4>
                <ul className="lista-simples lista-ok">
                  {ex.criteriosAceite.map((r, i) => <li key={i}>{r}</li>)}
                </ul>

                {ex.dicas?.length > 0 && <DicasExercicio dicas={ex.dicas} />}

                <CronometroExercicio id={id} estimativa={ex.tempo} />

                <div className="btn-row" style={{ marginTop: 14 }}>
                  <button
                    className={`btn sm${status === 'fazendo' ? ' primary' : ''}`}
                    onClick={() => setExercicio(id, status === 'fazendo' ? null : 'fazendo')}
                  >
                    Estou fazendo
                  </button>
                  <button
                    className={`btn sm${status === 'feito' ? ' primary' : ''}`}
                    onClick={() => setExercicio(id, status === 'feito' ? null : 'feito')}
                  >
                    ✓ Resolvido
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function DicasExercicio({ dicas }) {
  const [ver, setVer] = useState(false)
  return (
    <div style={{ marginTop: 14 }}>
      <button className="btn sm ghost" onClick={() => setVer((v) => !v)}>
        💡 {ver ? 'Esconder dicas' : `Ver dicas (${dicas.length})`}
      </button>
      {ver && (
        <ul className="lista-simples" style={{ marginTop: 8 }}>
          {dicas.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      )}
    </div>
  )
}

function Modulo({ modulo, aberto, modulos }) {
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
            {modulo.marcoAtual && <span className="chip warn">🎓 voce esta aqui · aula {modulo.marcoAtual.aula}</span>}
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

      <ExerciciosDoModulo modulo={modulo} modulos={modulos} />

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

  const modulos = useMemo(() => {
    const mapa = {}
    TRILHAS.forEach((t) => todosModulos(t).forEach((m) => { mapa[m.id] = m }))
    return mapa
  }, [])

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
                  <Modulo key={m.id} modulo={m} aberto={moduloParam === m.id} modulos={modulos} />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}
