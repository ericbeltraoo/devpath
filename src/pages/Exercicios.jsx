import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { EXERCICIOS, NIVEIS, TIPOS } from '../data/exercises'
import { TRILHAS, getTrilha } from '../data/tracks'
import { Empty, Bar } from '../components/ui'

const CORES_NIVEL = { 1: 'ok', 2: 'warn', 3: 'danger' }

function Exercicio({ ex }) {
  const { estado, setExercicio } = useApp()
  const [aberto, setAberto] = useState(false)
  const [dicasVisiveis, setDicasVisiveis] = useState(false)
  const status = estado.exercicios[ex.id]
  const trilha = getTrilha(ex.trilha)

  return (
    <div className="acc" style={{ borderColor: status === 'feito' ? 'rgba(34,197,94,.3)' : 'var(--border-soft)' }}>
      <div className="acc-head" onClick={() => setAberto((v) => !v)}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="row" style={{ gap: 7, marginBottom: 3 }}>
            <span className="chip" style={{ borderColor: trilha?.cor, color: trilha?.cor }}>
              {trilha?.icone} {trilha?.nome}
            </span>
            <span className={`chip ${CORES_NIVEL[ex.nivel]}`}>{NIVEIS[ex.nivel]}</span>
            <span className="chip">{TIPOS[ex.tipo]}</span>
            <span className="chip">⏱ {ex.tempo}</span>
            {status === 'feito' && <span className="chip ok">✓ resolvido</span>}
            {status === 'fazendo' && <span className="chip info">em andamento</span>}
          </div>
          <div style={{ fontWeight: 620 }}>{ex.titulo}</div>
        </div>
        <span className="muted small">{aberto ? '▲' : '▼'}</span>
      </div>

      {aberto && (
        <div className="acc-body">
          <p style={{ marginTop: 10 }}>{ex.enunciado}</p>

          <h4 style={{ marginTop: 16, marginBottom: 6, fontSize: 13.5, color: 'var(--text-2)' }}>Requisitos</h4>
          <ul className="lista-simples">
            {ex.requisitos.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>

          <h4 style={{ marginTop: 16, marginBottom: 6, fontSize: 13.5, color: 'var(--text-2)' }}>
            Criterios de aceite
          </h4>
          <ul className="lista-simples lista-ok">
            {ex.criteriosAceite.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>

          {ex.dicas?.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <button className="btn sm ghost" onClick={() => setDicasVisiveis((v) => !v)}>
                💡 {dicasVisiveis ? 'Esconder dicas' : `Ver dicas (${ex.dicas.length})`}
              </button>
              {dicasVisiveis && (
                <ul className="lista-simples" style={{ marginTop: 10 }}>
                  {ex.dicas.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="chips" style={{ marginTop: 16 }}>
            {ex.tags.map((t) => (
              <span key={t} className="chip">#{t}</span>
            ))}
          </div>

          <div className="btn-row" style={{ marginTop: 16 }}>
            <button
              className={`btn sm${status === 'fazendo' ? ' primary' : ''}`}
              onClick={() => setExercicio(ex.id, status === 'fazendo' ? null : 'fazendo')}
            >
              Estou fazendo
            </button>
            <button
              className={`btn sm${status === 'feito' ? ' primary' : ''}`}
              onClick={() => setExercicio(ex.id, status === 'feito' ? null : 'feito')}
            >
              ✓ Resolvido
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Exercicios() {
  const { estado } = useApp()
  const [trilha, setTrilha] = useState('todas')
  const [nivel, setNivel] = useState('todos')
  const [status, setStatus] = useState('todos')

  const lista = useMemo(
    () =>
      EXERCICIOS.filter((e) => {
        if (trilha !== 'todas' && e.trilha !== trilha) return false
        if (nivel !== 'todos' && String(e.nivel) !== nivel) return false
        const s = estado.exercicios[e.id]
        if (status === 'pendentes' && s === 'feito') return false
        if (status === 'feitos' && s !== 'feito') return false
        return true
      }),
    [trilha, nivel, status, estado.exercicios]
  )

  const feitos = EXERCICIOS.filter((e) => estado.exercicios[e.id] === 'feito').length
  const pct = Math.round((feitos / EXERCICIOS.length) * 100)

  return (
    <>
      <div className="page-head">
        <h1>Exercicios</h1>
        <div className="sub">
          Exercicios no formato que o mercado usa: enunciado, requisitos e criterios de aceite. Resolva primeiro,
          e so depois abra as dicas — a dica antes da tentativa nao ensina nada.
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="spread" style={{ marginBottom: 10 }}>
          <div className="card-title">Progresso</div>
          <span className="small muted">
            {feitos} de {EXERCICIOS.length} resolvidos
          </span>
        </div>
        <Bar pct={pct} />
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row" style={{ gap: 12 }}>
          <div className="field" style={{ marginBottom: 0, minWidth: 180, flex: 1 }}>
            <label>Trilha</label>
            <select value={trilha} onChange={(e) => setTrilha(e.target.value)}>
              <option value="todas">Todas</option>
              {TRILHAS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.icone} {t.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0, minWidth: 150 }}>
            <label>Nivel</label>
            <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="1">Iniciante</option>
              <option value="2">Intermediario</option>
              <option value="3">Avancado</option>
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0, minWidth: 150 }}>
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="pendentes">Pendentes</option>
              <option value="feitos">Resolvidos</option>
            </select>
          </div>
        </div>
      </div>

      {lista.length === 0 ? (
        <Empty titulo="Nenhum exercicio com esses filtros" texto="Ajuste os filtros acima." />
      ) : (
        lista.map((ex) => <Exercicio key={ex.id} ex={ex} />)
      )}
    </>
  )
}
