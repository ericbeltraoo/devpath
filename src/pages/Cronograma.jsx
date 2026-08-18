import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import {
  DIAS, MATERIAS, getMateria, blocosDoDia, minutosPorDia, minutosPorMateria,
  totalSemanal, realizadoPorDia, realizadoPorMateria, diagnosticar, formatarMin, modeloSugerido,
} from '../lib/cronograma'
import { Bar, Stat, Callout } from '../components/ui'

const HOJE = new Date().getDay()

function FormBloco({ inicial, onSalvar, onCancelar }) {
  const [b, setB] = useState(
    inicial || { dia: HOJE, materia: 'java', minutos: 45, horario: '19:00' }
  )

  return (
    <div className="card" style={{ borderColor: 'var(--accent)' }}>
      <div className="card-title" style={{ marginBottom: 12 }}>
        {inicial ? 'Editar bloco' : 'Novo bloco'}
      </div>
      <div className="row" style={{ gap: 12, alignItems: 'flex-end' }}>
        <div className="field" style={{ marginBottom: 0, minWidth: 130, flex: 1 }}>
          <label>Dia</label>
          <select value={b.dia} onChange={(e) => setB({ ...b, dia: Number(e.target.value) })}>
            {DIAS.map((d) => (
              <option key={d.id} value={d.id}>{d.nome}</option>
            ))}
          </select>
        </div>
        <div className="field" style={{ marginBottom: 0, minWidth: 180, flex: 1.4 }}>
          <label>Matéria</label>
          <select value={b.materia} onChange={(e) => setB({ ...b, materia: e.target.value })}>
            {MATERIAS.map((m) => (
              <option key={m.id} value={m.id}>{m.icone} {m.nome}</option>
            ))}
          </select>
        </div>
        <div className="field" style={{ marginBottom: 0, flex: '1 1 110px', minWidth: 110 }}>
          <label>Minutos</label>
          <input
            type="number" min="5" max="480" step="5"
            value={b.minutos}
            onChange={(e) => setB({ ...b, minutos: Math.max(5, Number(e.target.value) || 5) })}
          />
        </div>
        <div className="field" style={{ marginBottom: 0, flex: '1 1 110px', minWidth: 110 }}>
          <label>Horário</label>
          <input
            type="text" placeholder="19:00" maxLength={5}
            value={b.horario}
            onChange={(e) => setB({ ...b, horario: e.target.value })}
          />
        </div>
      </div>
      <div className="btn-row" style={{ marginTop: 14 }}>
        <button className="btn primary" onClick={() => onSalvar(b)}>Salvar</button>
        <button className="btn ghost" onClick={onCancelar}>Cancelar</button>
      </div>
    </div>
  )
}

export default function Cronograma() {
  const { estado, setCronograma, addBloco, updBloco, delBloco } = useApp()
  const crono = estado.cronograma
  const blocos = crono.blocos
  const [editando, setEditando] = useState(null)
  const [criando, setCriando] = useState(false)

  const porDia = useMemo(() => minutosPorDia(blocos), [blocos])
  const porMateria = useMemo(() => minutosPorMateria(blocos), [blocos])
  const real = useMemo(() => realizadoPorDia(estado.pomodoro.sessoes), [estado.pomodoro.sessoes])
  const realMat = useMemo(() => realizadoPorMateria(estado.pomodoro.sessoes), [estado.pomodoro.sessoes])
  const diag = useMemo(
    () => diagnosticar(crono, estado.perfil, estado.pomodoro.sessoes),
    [crono, estado.perfil, estado.pomodoro.sessoes]
  )

  const semana = totalSemanal(blocos)
  const maxDia = Math.max(60, ...DIAS.map((d) => Math.max(porDia[d.id] || 0, real[d.id] || 0)))
  const metaHoje = porDia[HOJE] || 0
  const feitoHoje = estado.pomodoro.sessoes
    .filter((s) => s.fim.slice(0, 10) === new Date().toISOString().slice(0, 10))
    .reduce((a, s) => a + s.minutos, 0)

  return (
    <>
      <div className="page-head">
        <h1>Cronograma</h1>
        <div className="sub">
          Monte sua semana matéria por matéria, com tempo mínimo por bloco. O <b>realizado</b> não é digitado por
          você — vem das sessões do Pomodoro. Cronograma que só guarda intenção vira decoração.
        </div>
      </div>

      {/* ------------------------------------------------------------ hoje */}
      <div className="card" style={{ borderColor: metaHoje > 0 && feitoHoje >= metaHoje ? 'var(--ok)' : 'var(--border-soft)' }}>
        <div className="spread" style={{ marginBottom: 10 }}>
          <div>
            <div className="card-title">Hoje — {DIAS[HOJE].nome}</div>
            <div className="card-sub">
              {metaHoje === 0
                ? 'Nenhum bloco agendado para hoje.'
                : `Meta de ${formatarMin(metaHoje)} · você já fez ${formatarMin(feitoHoje)}`}
            </div>
          </div>
          {metaHoje > 0 && (
            <span className={`chip ${feitoHoje >= metaHoje ? 'ok' : 'warn'}`}>
              {Math.round((feitoHoje / metaHoje) * 100)}%
            </span>
          )}
        </div>
        {metaHoje > 0 && <Bar pct={(feitoHoje / metaHoje) * 100} cor={feitoHoje >= metaHoje ? 'var(--ok)' : undefined} />}

        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {blocosDoDia(blocos, HOJE).map((b) => {
            const m = getMateria(b.materia)
            return (
              <div key={b.id} className="spread small" style={{ padding: '5px 0' }}>
                <span>
                  <span className="mono muted" style={{ marginRight: 8 }}>{b.horario || '--:--'}</span>
                  <span style={{ color: m.cor }}>{m.icone} {m.nome}</span>
                </span>
                <span className="muted">{formatarMin(b.minutos)}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ------------------------------------------------------- diagnostico */}
      {diag.avisos.map((a, i) => (
        <Callout key={i} tipo={a.tipo === 'info' ? undefined : a.tipo} titulo={a.tipo === 'danger' ? '⚠ Incoerência' : 'Atenção'}>
          {a.texto}
        </Callout>
      ))}

      <div className="grid grid-4" style={{ margin: '16px 0' }}>
        <Stat label="Planejado" value={formatarMin(semana)} hint="por semana" />
        <Stat label="Realizado" value={formatarMin(diag.realTotal || 0)} hint="últimos 7 dias" />
        <Stat
          label="Aderência"
          value={diag.aderencia === null ? '—' : `${diag.aderencia}%`}
          hint="cumprido do planejado"
          cor={diag.aderencia === null ? undefined : diag.aderencia >= 80 ? 'var(--ok)' : diag.aderencia >= 50 ? 'var(--warn)' : 'var(--danger)'}
        />
        <Stat label="Blocos" value={blocos.length} hint="na semana" />
      </div>

      {/* ----------------------------------------------------- grade semanal */}
      <div className="card">
        <div className="spread" style={{ marginBottom: 16 }}>
          <div>
            <div className="card-title">Planejado × realizado</div>
            <div className="card-sub">Barra cheia é o que você agendou; a clara é o que o Pomodoro registrou.</div>
          </div>
          <div className="btn-row">
            <button className="btn sm primary" onClick={() => { setCriando(true); setEditando(null) }}>+ Bloco</button>
            {blocos.length === 0 && (
              <button
                className="btn sm"
                onClick={() => setCronograma({ blocos: modeloSugerido(estado.perfil.horasSemana) })}
              >
                Usar modelo sugerido
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 130 }}>
          {DIAS.map((d) => (
            <div key={d.id} style={{ flex: 1, textAlign: 'center' }}>
              <div className="small muted" style={{ fontSize: 10.5, marginBottom: 4 }}>
                {porDia[d.id] > 0 ? formatarMin(porDia[d.id]) : ''}
              </div>
              <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', justifyContent: 'center', height: 85 }}>
                <div
                  style={{
                    width: 14,
                    height: `${Math.max(2, ((porDia[d.id] || 0) / maxDia) * 85)}px`,
                    background: 'var(--accent)', borderRadius: '3px 3px 0 0',
                  }}
                  title={`planejado: ${formatarMin(porDia[d.id] || 0)}`}
                />
                <div
                  style={{
                    width: 14,
                    height: `${Math.max(2, ((real[d.id] || 0) / maxDia) * 85)}px`,
                    background: 'var(--ok)', opacity: 0.55, borderRadius: '3px 3px 0 0',
                  }}
                  title={`realizado: ${formatarMin(real[d.id] || 0)}`}
                />
              </div>
              <div
                style={{
                  fontSize: 11, marginTop: 6,
                  color: d.id === HOJE ? 'var(--accent-2)' : 'var(--text-3)',
                  fontWeight: d.id === HOJE ? 700 : 500,
                }}
              >
                {d.curto}
              </div>
            </div>
          ))}
        </div>
      </div>

      {(criando || editando) && (
        <FormBloco
          inicial={editando}
          onSalvar={(b) => {
            if (editando) updBloco(b)
            else addBloco(b)
            setCriando(false)
            setEditando(null)
          }}
          onCancelar={() => { setCriando(false); setEditando(null) }}
        />
      )}

      {/* -------------------------------------------------------- por dia */}
      <div className="grid grid-2" style={{ marginTop: 14 }}>
        {DIAS.map((d) => {
          const doDia = blocosDoDia(blocos, d.id)
          return (
            <div
              key={d.id}
              className="card"
              style={{ borderColor: d.id === HOJE ? 'var(--accent)' : 'var(--border-soft)' }}
            >
              <div className="spread" style={{ marginBottom: 10 }}>
                <div className="card-title">
                  {d.nome} {d.id === HOJE && <span className="chip info">hoje</span>}
                </div>
                <span className="small muted">{formatarMin(porDia[d.id] || 0)}</span>
              </div>

              {doDia.length === 0 ? (
                <div className="small muted">Dia livre.</div>
              ) : (
                doDia.map((b) => {
                  const m = getMateria(b.materia)
                  return (
                    <div
                      key={b.id}
                      className="spread"
                      style={{
                        padding: '8px 10px', marginBottom: 5, borderRadius: 'var(--r-sm)',
                        background: 'var(--surface-2)', borderLeft: `3px solid ${m.cor}`,
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div className="small" style={{ fontWeight: 600 }}>
                          {m.icone} {m.nome}
                        </div>
                        <div className="small muted">
                          {b.horario || '--:--'} · {formatarMin(b.minutos)}
                        </div>
                      </div>
                      <div className="btn-row" style={{ gap: 4 }}>
                        <button className="btn sm ghost" onClick={() => { setEditando(b); setCriando(false) }}>✎</button>
                        <button className="btn sm ghost" onClick={() => delBloco(b.id)}>✕</button>
                      </div>
                    </div>
                  )
                })
              )}

              <button
                className="btn sm ghost"
                style={{ width: '100%', marginTop: 6 }}
                onClick={() => { setCriando(true); setEditando({ dia: d.id, materia: 'java', minutos: 45, horario: '19:00' }) }}
              >
                + adicionar em {d.curto}
              </button>
            </div>
          )
        })}
      </div>

      {/* ---------------------------------------------------- por materia */}
      {blocos.length > 0 && (
        <div className="card" style={{ marginTop: 14 }}>
          <div className="card-title" style={{ marginBottom: 4 }}>Distribuição por matéria</div>
          <div className="card-sub" style={{ marginBottom: 14 }}>
            Planejado na semana, e ao lado o que o Pomodoro registrou nos últimos 7 dias.
          </div>
          {Object.entries(porMateria)
            .sort((a, b) => b[1] - a[1])
            .map(([id, min]) => {
              const m = getMateria(id)
              const feito = realMat[id] || 0
              return (
                <div key={id} style={{ marginBottom: 11 }}>
                  <div className="spread small" style={{ marginBottom: 4 }}>
                    <span>{m.icone} {m.nome}</span>
                    <span className="muted">
                      {formatarMin(min)} plan. · {formatarMin(feito)} real.
                    </span>
                  </div>
                  <Bar pct={(min / semana) * 100} thin cor={m.cor} />
                </div>
              )
            })}
        </div>
      )}

      {blocos.length > 0 && (
        <div className="btn-row" style={{ marginTop: 16 }}>
          <button
            className="btn danger"
            onClick={() => { if (confirm('Apagar todos os blocos do cronograma?')) setCronograma({ blocos: [] }) }}
          >
            Limpar cronograma
          </button>
        </div>
      )}
    </>
  )
}
