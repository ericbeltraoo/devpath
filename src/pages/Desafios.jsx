import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { DESAFIOS, TIPOS_DESAFIO, NIVEIS_DESAFIO, REGRAS_MENTOR } from '../data/desafios'
import { TRILHAS, todosModulos } from '../data/tracks'
import { progressoModulo } from '../lib/planner'
import { Callout, Empty, Bar } from '../components/ui'

const CORES_NIVEL = { 1: 'ok', 2: 'warn', 3: 'danger' }

function Desafio({ desafio, prontidao }) {
  const { estado, setDesafio } = useApp()
  const [aberto, setAberto] = useState(false)
  const [respostas, setRespostas] = useState({})
  const registro = estado.desafios[desafio.id] || {}

  const respondidasTodas = desafio.perguntasDoMentor.every((_, i) => (respostas[i] || '').trim().length >= 40)
  const liberado = registro.mentorOk || respondidasTodas

  function concluirMentoria() {
    setDesafio(desafio.id, { mentorOk: true, iniciadoEm: new Date().toISOString(), respostasMentor: respostas })
  }

  return (
    <div
      className="acc"
      style={{ borderColor: registro.status === 'feito' ? 'rgba(34,197,94,.3)' : 'var(--border-soft)' }}
    >
      <div className="acc-head" onClick={() => setAberto((v) => !v)}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="row" style={{ gap: 7, marginBottom: 4 }}>
            <span className="chip info">{TIPOS_DESAFIO[desafio.tipo].nome}</span>
            <span className={`chip ${CORES_NIVEL[desafio.nivel]}`}>{NIVEIS_DESAFIO[desafio.nivel]}</span>
            <span className="chip">⏱ {desafio.tempo}</span>
            {!prontidao.pronto && <span className="chip danger">faltam pre-requisitos</span>}
            {registro.status === 'feito' && <span className="chip ok">✓ entregue</span>}
          </div>
          <div style={{ fontWeight: 640 }}>{desafio.titulo}</div>
          <div className="small muted">{desafio.estilo}</div>
        </div>
        <span className="muted small">{aberto ? '▲' : '▼'}</span>
      </div>

      {aberto && (
        <div className="acc-body">
          {!prontidao.pronto && (
            <Callout tipo="warn" titulo="Voce ainda nao tem base para este desafio">
              Faltam módulos: <b>{prontidao.faltando.join(', ')}</b>. Você pode abrir mesmo assim, mas travar aqui
              não vai te ensinar nada — vai só te convencer de que você é ruim. Volte quando a base estiver de pé.
            </Callout>
          )}

          <div className="callout" style={{ margin: '14px 0' }}>
            <b>Contexto</b>
            {desafio.contexto}
          </div>

          <h4 style={{ margin: '16px 0 6px', fontSize: 13.5, color: 'var(--text-2)' }}>Enunciado</h4>
          <p>{desafio.enunciado}</p>

          {desafio.codigo && (
            <pre
              className="mono"
              style={{
                background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
                padding: 14, overflowX: 'auto', fontSize: 12.3, lineHeight: 1.55,
              }}
            >
              {desafio.codigo}
            </pre>
          )}

          <h4 style={{ margin: '16px 0 6px', fontSize: 13.5, color: 'var(--text-2)' }}>Requisitos</h4>
          <ul className="lista-simples">
            {desafio.requisitos.map((r, i) => <li key={i}>{r}</li>)}
          </ul>

          <h4 style={{ margin: '16px 0 6px', fontSize: 13.5, color: 'var(--text-2)' }}>Restricoes</h4>
          <ul className="lista-simples">
            {desafio.restricoes.map((r, i) => <li key={i}>{r}</li>)}
          </ul>

          <h4 style={{ margin: '16px 0 6px', fontSize: 13.5, color: 'var(--text-2)' }}>Rubrica de avaliacao</h4>
          {desafio.oQueAvaliam.map((a) => (
            <div key={a.criterio} style={{ marginBottom: 8 }}>
              <div className="spread small" style={{ marginBottom: 3 }}>
                <span>{a.criterio}</span>
                <span className="muted">{a.peso}%</span>
              </div>
              <Bar pct={a.peso} thin />
            </div>
          ))}

          {/* ---------------------------------------------- portao do mentor */}
          <div
            className="card"
            style={{ marginTop: 20, borderColor: 'var(--purple)', background: 'rgba(167,139,250,.06)' }}
          >
            <div className="card-title">🧠 Antes de abrir a IDE</div>
            <div className="card-sub" style={{ marginBottom: 14 }}>
              Design antes de código. Responda com suas palavras — mínimo 40 caracteres cada. Enquanto não
              responder, as armadilhas e os critérios ficam escondidos. Não é burocracia: se você não sabe
              responder isso, você ainda não entendeu o problema.
            </div>

            {desafio.perguntasDoMentor.map((p, i) => {
              const v = registro.mentorOk ? registro.respostasMentor?.[i] || '' : respostas[i] || ''
              const ok = v.trim().length >= 40
              return (
                <div className="field" key={i}>
                  <label>
                    {i + 1}. {p} {ok && <span style={{ color: 'var(--ok)' }}>✓</span>}
                  </label>
                  <textarea
                    value={v}
                    disabled={registro.mentorOk}
                    onChange={(e) => setRespostas((r) => ({ ...r, [i]: e.target.value }))}
                    placeholder="Sua justificativa..."
                    style={{ minHeight: 60 }}
                  />
                  {!ok && v.length > 0 && (
                    <span className="help" style={{ color: 'var(--warn)' }}>
                      Faltam {40 - v.trim().length} caracteres. Justifique de verdade.
                    </span>
                  )}
                </div>
              )
            })}

            {!registro.mentorOk && (
              <button className="btn primary" disabled={!respondidasTodas} onClick={concluirMentoria}>
                {respondidasTodas ? 'Travar respostas e liberar o desafio' : 'Responda todas para liberar'}
              </button>
            )}
          </div>

          {liberado ? (
            <>
              <h4 style={{ margin: '20px 0 6px', fontSize: 13.5, color: 'var(--danger)' }}>
                Armadilhas que reprovam
              </h4>
              <ul className="lista-simples lista-evite">
                {desafio.armadilhas.map((a, i) => <li key={i}>{a}</li>)}
              </ul>

              <h4 style={{ margin: '16px 0 6px', fontSize: 13.5, color: 'var(--ok)' }}>Criterios de aprovacao</h4>
              <ul className="lista-simples lista-ok">
                {desafio.criteriosAprovacao.map((a, i) => <li key={i}>{a}</li>)}
              </ul>

              <div className="btn-row" style={{ marginTop: 18 }}>
                <button
                  className={`btn sm${registro.status === 'fazendo' ? ' primary' : ''}`}
                  onClick={() => setDesafio(desafio.id, { status: registro.status === 'fazendo' ? null : 'fazendo' })}
                >
                  Estou fazendo
                </button>
                <button
                  className={`btn sm${registro.status === 'feito' ? ' primary' : ''}`}
                  onClick={() =>
                    setDesafio(desafio.id, {
                      status: registro.status === 'feito' ? null : 'feito',
                      entregueEm: new Date().toISOString(),
                    })
                  }
                >
                  ✓ Entregue
                </button>
                <button className="btn sm ghost" onClick={() => setDesafio(desafio.id, null)}>
                  Reabrir mentoria
                </button>
              </div>
            </>
          ) : (
            <div className="small muted center" style={{ marginTop: 18 }}>
              🔒 Armadilhas e critérios de aprovação liberam depois da mentoria.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Desafios() {
  const { estado } = useApp()
  const [tipo, setTipo] = useState('todos')

  const indiceModulos = useMemo(() => {
    const mapa = {}
    TRILHAS.forEach((t) => todosModulos(t).forEach((m) => { mapa[m.id] = m }))
    return mapa
  }, [])

  const lista = useMemo(
    () => DESAFIOS.filter((d) => tipo === 'todos' || d.tipo === tipo),
    [tipo]
  )

  function prontidaoDe(d) {
    const faltando = (d.preRequisitos || [])
      .filter((id) => {
        const m = indiceModulos[id]
        return !m || progressoModulo(m, estado.topicos).pct < 80
      })
      .map((id) => indiceModulos[id]?.titulo || id)
    return { pronto: faltando.length === 0, faltando }
  }

  const feitos = DESAFIOS.filter((d) => estado.desafios[d.id]?.status === 'feito').length

  return (
    <>
      <div className="page-head">
        <h1>Desafios técnicos</h1>
        <div className="sub">
          Desafios no formato, no nível e com a rubrica dos processos seletivos reais de grandes empresas.
        </div>
      </div>

      <Callout tipo="warn" titulo="O que estes desafios são — e o que não são">
        Não são os testes proprietários das empresas. São reconstruções no <b>mesmo formato, nível e rubrica</b>,
        montadas a partir de relatos públicos de candidatos, descrições de vaga e do padrão de mercado. Decorar um
        enunciado específico não serviria de nada — eles mudam. Treinar o formato, sim.
      </Callout>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-title" style={{ marginBottom: 10 }}>Regras da mentoria</div>
        <ul className="lista-simples">
          {REGRAS_MENTOR.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>

      <div className="card">
        <div className="spread" style={{ marginBottom: 10 }}>
          <div className="card-title">Progresso</div>
          <span className="small muted">{feitos} de {DESAFIOS.length} entregues</span>
        </div>
        <Bar pct={(feitos / DESAFIOS.length) * 100} />
      </div>

      <div className="tabs" style={{ marginTop: 16 }}>
        <button className={`tab${tipo === 'todos' ? ' active' : ''}`} onClick={() => setTipo('todos')}>
          Todos ({DESAFIOS.length})
        </button>
        {Object.entries(TIPOS_DESAFIO).map(([id, t]) => {
          const n = DESAFIOS.filter((d) => d.tipo === id).length
          if (n === 0) return null
          return (
            <button key={id} className={`tab${tipo === id ? ' active' : ''}`} onClick={() => setTipo(id)}>
              {t.nome} ({n})
            </button>
          )
        })}
      </div>

      {tipo !== 'todos' && (
        <div className="small muted" style={{ marginBottom: 14 }}>
          {TIPOS_DESAFIO[tipo].desc}
        </div>
      )}

      {lista.length === 0 ? (
        <Empty titulo="Nenhum desafio deste tipo ainda" />
      ) : (
        lista.map((d) => <Desafio key={d.id} desafio={d} prontidao={prontidaoDe(d)} />)
      )}
    </>
  )
}
