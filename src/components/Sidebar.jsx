import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { usePomodoro } from '../context/PomodoroContext'
import { mmss } from '../lib/pomodoro'
import { Bar } from './ui'

const LINKS = [
  { grupo: 'Foco diario', itens: [
    { to: '/', icone: '📊', texto: 'Painel', end: true },
    { to: '/revisao', icone: '🔁', texto: 'Revisao', badge: 'revisao' },
    { to: '/pomodoro', icone: '⏱️', texto: 'Pomodoro', badge: 'pomodoro' },
  ]},
  { grupo: 'Estudo', itens: [
    { to: '/plano', icone: '🗺️', texto: 'Meu plano' },
    { to: '/roadmap', icone: '📚', texto: 'Roadmap' },
    { to: '/exercicios', icone: '⌨️', texto: 'Exercicios' },
    { to: '/desafios', icone: '🎯', texto: 'Desafios' },
  ]},
  { grupo: 'Carreira', itens: [
    { to: '/entrevistas', icone: '🎤', texto: 'Entrevistas' },
    { to: '/linkedin', icone: '💼', texto: 'LinkedIn' },
    { to: '/avaliador', icone: '📈', texto: 'Avaliador' },
  ]},
  { grupo: 'Sistema', itens: [
    { to: '/config', icone: '⚙️', texto: 'Configuracoes' },
  ]},
]

const ESTADOS_SYNC = {
  ok: { cor: 'var(--ok)', texto: 'Sincronizado' },
  salvando: { cor: 'var(--accent)', texto: 'Salvando...' },
  reenviando: { cor: 'var(--warn)', texto: 'Reenviando...' },
  carregando: { cor: 'var(--accent)', texto: 'Carregando...' },
  migrado: { cor: 'var(--ok)', texto: 'Progresso migrado' },
  erro: { cor: 'var(--danger)', texto: 'Erro ao sincronizar' },
  local: { cor: 'var(--warn)', texto: 'Somente neste navegador' },
}

function StatusSync() {
  const { nuvemAtiva, sincronia, usuario } = useApp()
  const s = ESTADOS_SYNC[sincronia] || ESTADOS_SYNC.local

  return (
    <div className="row" style={{ gap: 7, flexWrap: 'nowrap' }}>
      <span
        style={{
          width: 7, height: 7, borderRadius: '50%', background: s.cor, flexShrink: 0,
          boxShadow: `0 0 0 3px ${s.cor}22`,
        }}
      />
      <span style={{ minWidth: 0 }}>
        {s.texto}
        {nuvemAtiva && usuario && (
          <>
            <br />
            <span style={{ opacity: 0.7, wordBreak: 'break-all' }}>{usuario.email}</span>
          </>
        )}
      </span>
    </div>
  )
}

export default function Sidebar() {
  const { plano, estado, fila } = useApp()
  const { rodando, restante } = usePomodoro()

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">&lt;/&gt;</div>
        <div>
          <div className="brand-name">DevPath</div>
          <div className="brand-sub">rumo a dev junior</div>
        </div>
      </div>

      <div style={{ padding: '0 8px' }}>
        <div className="spread" style={{ marginBottom: 6 }}>
          <span className="small muted">Progresso geral</span>
          <span className="small" style={{ fontWeight: 700 }}>{plano.pct}%</span>
        </div>
        <Bar pct={plano.pct} thin />
        <div className="small muted" style={{ marginTop: 6 }}>
          {Math.round(plano.horasRestantes)}h restantes
        </div>
      </div>

      <nav className="nav">
        {LINKS.map((g) => (
          <div key={g.grupo}>
            <div className="nav-group-title">{g.grupo}</div>
            {g.itens.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">{l.icone}</span>
                <span style={{ flex: 1 }}>{l.texto}</span>
                {l.badge === 'revisao' && fila.pendentes.length > 0 && (
                  <span
                    className="chip"
                    style={{
                      padding: '1px 7px', fontSize: 10.5,
                      background: fila.vencidas.length > 0 ? 'var(--danger)' : 'var(--accent)',
                      color: '#fff', borderColor: 'transparent',
                    }}
                  >
                    {fila.pendentes.length}
                  </span>
                )}
                {l.badge === 'pomodoro' && rodando && (
                  <span className="chip" style={{ padding: '1px 7px', fontSize: 10.5, fontVariantNumeric: 'tabular-nums' }}>
                    {mmss(restante)}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-foot">
        <StatusSync />
        <div style={{ marginTop: 8 }}>
          {estado.perfil.nome ? `${estado.perfil.nome} · ` : ''}
          {plano.objetivo.nome}
        </div>
      </div>
    </aside>
  )
}
