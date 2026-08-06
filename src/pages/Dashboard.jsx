import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { TRILHAS, todosModulos } from '../data/tracks'
import { EXERCICIOS } from '../data/exercises'
import { PERGUNTAS } from '../data/interview'
import { CRITERIOS, avaliar } from '../data/linkedin'
import { formatarData, progressoModulo } from '../lib/planner'
import { Bar, Ring, Stat } from '../components/ui'

export default function Dashboard() {
  const { estado, plano } = useApp()
  const nome = estado.perfil.nome

  const exFeitos = Object.values(estado.exercicios).filter((v) => v === 'feito').length
  const perguntasOk = Object.keys(estado.entrevistas).length
  const respondidoLinkedin = Object.keys(estado.linkedin.respostas).length
  const notaLinkedin = respondidoLinkedin > 0 ? avaliar(estado.linkedin.respostas).nota : null

  const proximo = plano.proximo

  return (
    <>
      <div className="page-head">
        <h1>{nome ? `Bom te ver, ${nome}.` : 'Painel'}</h1>
        <div className="sub">
          Objetivo: <b>{plano.objetivo.nome}</b> · ritmo de {plano.horasSemana}h por semana.
        </div>
      </div>

      {/* -------------------------------------------------- resumo geral */}
      <div className="card">
        <div className="row" style={{ gap: 24, alignItems: 'center' }}>
          <Ring pct={plano.pct} sub="concluido" />
          <div style={{ flex: 1, minWidth: 240 }}>
            <h2 style={{ marginBottom: 8 }}>Trilha ate dev junior</h2>
            <p className="small muted" style={{ marginBottom: 12 }}>
              {Math.round(plano.horasFeitas)}h de {Math.round(plano.horasTotal)}h de estudo focado.
              Faltam <b style={{ color: 'var(--text)' }}>{Math.round(plano.horasRestantes)}h</b>.
            </p>
            <Bar pct={plano.pct} />
            <div className="row small muted" style={{ marginTop: 12, gap: 18 }}>
              <span>
                📅 <b style={{ color: 'var(--text-2)' }}>{plano.semanas}</b> semanas restantes (~{plano.meses} meses)
              </span>
              <span>
                🏁 Previsao: <b style={{ color: 'var(--text-2)' }}>{formatarData(plano.dataConclusao)}</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------- proximo passo */}
      {proximo && (
        <div className="card" style={{ borderColor: 'var(--accent)', background: 'linear-gradient(180deg, var(--accent-soft), var(--surface) 60%)' }}>
          <div className="spread">
            <div style={{ minWidth: 260, flex: 1 }}>
              <div className="chip info" style={{ marginBottom: 8 }}>PROXIMO PASSO</div>
              <h2>{proximo.modulo.titulo}</h2>
              <p className="small muted" style={{ marginTop: 4 }}>
                {proximo.bloco.trilha.icone} {proximo.bloco.trilha.nome} · {proximo.bloco.fase.nome} ·{' '}
                {proximo.modulo.horas}h estimadas
              </p>
              <p className="small" style={{ marginTop: 10 }}>
                <b>Entregavel:</b> {proximo.modulo.entregavel}
              </p>
            </div>
            <Link className="btn primary" to={`/roadmap?trilha=${proximo.bloco.trilha.id}&modulo=${proximo.modulo.id}`}>
              Ir para o modulo →
            </Link>
          </div>
          <div style={{ marginTop: 14 }}>
            <div className="spread small muted" style={{ marginBottom: 5 }}>
              <span>
                {proximo.modulo.progresso.feitos} de {proximo.modulo.progresso.total} topicos
              </span>
              <span>{proximo.modulo.progresso.pct}%</span>
            </div>
            <Bar pct={proximo.modulo.progresso.pct} thin />
          </div>
        </div>
      )}

      {/* --------------------------------------------------------- stats */}
      <div className="grid grid-4" style={{ marginTop: 14 }}>
        <Stat label="Exercicios" value={`${exFeitos}/${EXERCICIOS.length}`} hint="resolvidos" />
        <Stat label="Entrevista" value={`${perguntasOk}/${PERGUNTAS.length}`} hint="respostas dominadas" />
        <Stat
          label="LinkedIn"
          value={notaLinkedin === null ? '—' : `${notaLinkedin}`}
          hint={notaLinkedin === null ? 'nao avaliado' : `de 100 · ${respondidoLinkedin}/${CRITERIOS.length} criterios`}
          cor={notaLinkedin === null ? undefined : notaLinkedin >= 75 ? 'var(--ok)' : notaLinkedin >= 55 ? 'var(--warn)' : 'var(--danger)'}
        />
        <Stat label="Horas/semana" value={plano.horasSemana} hint="ritmo definido" />
      </div>

      {/* ---------------------------------------------- foco das semanas */}
      <div className="card" style={{ marginTop: 14 }}>
        <div className="spread" style={{ marginBottom: 14 }}>
          <div>
            <div className="card-title">Suas proximas 3 fases</div>
            <div className="card-sub">Na ordem certa, ja descontando o que voce concluiu.</div>
          </div>
          <Link className="btn sm" to="/plano">Ver plano completo</Link>
        </div>
        <div className="timeline">
          {plano.blocos
            .filter((b) => !b.concluida)
            .slice(0, 3)
            .map((b, i) => (
              <div key={b.faseId} className={`tl-item${i === 0 ? ' now' : ''}`}>
                <div className="spread">
                  <div>
                    <div style={{ fontWeight: 620 }}>
                      {b.trilha.icone} {b.fase.nome}
                    </div>
                    <div className="small muted">{b.fase.objetivo}</div>
                  </div>
                  <div className="chip">
                    Semana {b.semanaInicio}–{b.semanaFim}
                  </div>
                </div>
              </div>
            ))}
          {plano.blocos.every((b) => b.concluida) && (
            <div className="tl-item done">
              <b>Roadmap concluido.</b> Hora de focar em candidaturas e entrevistas.
            </div>
          )}
        </div>
      </div>

      {/* -------------------------------------------- progresso por trilha */}
      <div className="grid grid-2" style={{ marginTop: 14 }}>
        {TRILHAS.map((t) => {
          const mods = todosModulos(t)
          const totalTop = mods.reduce((s, m) => s + m.topicos.length, 0)
          const feitosTop = mods.reduce((s, m) => s + progressoModulo(m, estado.topicos).feitos, 0)
          const pct = totalTop === 0 ? 0 : Math.round((feitosTop / totalTop) * 100)
          return (
            <Link key={t.id} to={`/roadmap?trilha=${t.id}`} className="card" style={{ color: 'inherit', display: 'block' }}>
              <div className="spread" style={{ marginBottom: 10 }}>
                <div className="card-title">
                  <span>{t.icone}</span> {t.nome}
                </div>
                <span className="chip" style={{ borderColor: t.cor, color: t.cor }}>{pct}%</span>
              </div>
              <Bar pct={pct} cor={t.cor} thin />
              <div className="small muted" style={{ marginTop: 8 }}>
                {feitosTop} de {totalTop} topicos · {mods.length} modulos
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
