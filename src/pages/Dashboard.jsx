import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { TRILHAS, todosModulos } from '../data/tracks'
import { EXERCICIOS } from '../data/exercises'
import { PERGUNTAS } from '../data/interview'
import { CRITERIOS, avaliar } from '../data/linkedin'
import { formatarData, progressoModulo } from '../lib/planner'
import { DESAFIOS } from '../data/desafios'
import { estatisticasRevisao } from '../lib/revisao'
import { usePomodoro } from '../context/PomodoroContext'
import { formatarMinutos, mmss } from '../lib/pomodoro'
import { Bar, Ring, Stat, Callout } from '../components/ui'

export default function Dashboard() {
  const { estado, plano, fila, bloqueio } = useApp()
  const { rodando, restante, fase } = usePomodoro()
  const nome = estado.perfil.nome

  const exFeitos = Object.values(estado.exercicios).filter((v) => v === 'feito').length
  const perguntasOk = Object.keys(estado.entrevistas).length
  const respondidoLinkedin = Object.keys(estado.linkedin.respostas).length
  const notaLinkedin = respondidoLinkedin > 0 ? avaliar(estado.linkedin.respostas).nota : null

  const proximo = plano.proximo
  const statsRevisao = estatisticasRevisao(estado.revisoes)
  const desafiosFeitos = DESAFIOS.filter((d) => estado.desafios[d.id]?.status === 'feito').length

  const hoje = new Date().toISOString().slice(0, 10)
  const focoHoje = estado.pomodoro.sessoes
    .filter((s) => s.fim.slice(0, 10) === hoje)
    .reduce((a, s) => a + s.minutos, 0)

  return (
    <>
      <div className="page-head">
        <h1>{nome ? `Bom te ver, ${nome}.` : 'Painel'}</h1>
        <div className="sub">
          Objetivo: <b>{plano.objetivo.nome}</b> · ritmo de {plano.horasSemana}h por semana.
        </div>
      </div>

      {bloqueio && (
        <Callout tipo="danger" titulo="🔒 Conteúdo novo travado">
          {bloqueio.mensagem}{' '}
          <Link to="/revisao" style={{ fontWeight: 600 }}>Derrubar a fila →</Link>
        </Callout>
      )}

      {/* ------------------------------------------------------------ hoje */}
      <div className="card" style={{ marginTop: bloqueio ? 14 : 0 }}>
        <div className="card-title" style={{ marginBottom: 4 }}>Seu dia</div>
        <div className="card-sub" style={{ marginBottom: 14 }}>
          A ordem importa: revisar primeiro, conteúdo novo depois. Revisão pendente é dívida — ela cobra juros.
        </div>

        <div className="grid grid-3">
          <Link
            to="/revisao"
            className="card"
            style={{
              color: 'inherit', display: 'block', padding: 14,
              borderColor: fila.vencidas.length > 0 ? 'var(--danger)' : fila.pendentes.length > 0 ? 'var(--accent)' : 'var(--border-soft)',
            }}
          >
            <div className="spread" style={{ marginBottom: 6 }}>
              <span className="small" style={{ fontWeight: 650 }}>🔁 Revisão</span>
              {fila.vencidas.length > 0 && <span className="chip danger">{fila.vencidas.length} atrasada(s)</span>}
            </div>
            <div style={{ fontSize: 26, fontWeight: 700 }}>{fila.pendentes.length}</div>
            <div className="small muted">
              {fila.pendentes.length === 0 ? 'fila zerada — pode avançar' : 'tópicos esperando'}
            </div>
          </Link>

          <Link to="/pomodoro" className="card" style={{ color: 'inherit', display: 'block', padding: 14 }}>
            <div className="spread" style={{ marginBottom: 6 }}>
              <span className="small" style={{ fontWeight: 650 }}>⏱️ Foco hoje</span>
              {rodando && <span className="chip info">{mmss(restante)}</span>}
            </div>
            <div style={{ fontSize: 26, fontWeight: 700 }}>{formatarMinutos(focoHoje)}</div>
            <div className="small muted">
              {rodando ? `em ${fase === 'foco' ? 'bloco de foco' : 'pausa'}` : 'cronômetro parado'}
            </div>
          </Link>

          <Link to="/desafios" className="card" style={{ color: 'inherit', display: 'block', padding: 14 }}>
            <div className="spread" style={{ marginBottom: 6 }}>
              <span className="small" style={{ fontWeight: 650 }}>🎯 Desafios</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700 }}>
              {desafiosFeitos}<span className="muted" style={{ fontSize: 15 }}>/{DESAFIOS.length}</span>
            </div>
            <div className="small muted">entregues</div>
          </Link>
        </div>

        {statsRevisao.total > 0 && (
          <div style={{ marginTop: 14 }}>
            <div className="spread small muted" style={{ marginBottom: 5 }}>
              <span>Retenção: {statsRevisao.dominados} de {statsRevisao.total} tópicos consolidados</span>
              <span>{statsRevisao.fracos} ainda frágeis</span>
            </div>
            <Bar pct={(statsRevisao.dominados / statsRevisao.total) * 100} thin cor="var(--ok)" />
          </div>
        )}
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
