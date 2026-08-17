import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { usePomodoro, FASES } from '../context/PomodoroContext'
import {
  mmss, formatarMinutos, tocarAlarme,
  permissaoNotificacao, pedirPermissaoNotificacao, suporteNotificacao,
} from '../lib/pomodoro'
import { TRILHAS, todosModulos } from '../data/tracks'
import { Stat, Callout } from '../components/ui'

function Relogio() {
  const { fase, rodando, restante, ciclo, progresso, iniciar, pausar, zerar, pular, trocarFase } = usePomodoro()
  const { estado } = useApp()
  const f = FASES[fase]
  const tam = 260
  const stroke = 12
  const r = (tam - stroke) / 2
  const c = 2 * Math.PI * r

  return (
    <div className="card center" style={{ padding: '30px 20px' }}>
      <div className="chips" style={{ justifyContent: 'center', marginBottom: 18 }}>
        {Object.entries(FASES).map(([id, x]) => (
          <button
            key={id}
            className={`chip${fase === id ? ' info' : ''}`}
            style={{
              cursor: 'pointer',
              borderColor: fase === id ? x.cor : undefined,
              color: fase === id ? x.cor : undefined,
            }}
            onClick={() => trocarFase(id)}
          >
            {x.rotulo}
          </button>
        ))}
      </div>

      <div style={{ position: 'relative', width: tam, height: tam, margin: '0 auto' }}>
        <svg className="ring" width={tam} height={tam}>
          <circle cx={tam / 2} cy={tam / 2} r={r} stroke="var(--surface-2)" strokeWidth={stroke} fill="none" />
          <circle
            cx={tam / 2} cy={tam / 2} r={r}
            stroke={f.cor} strokeWidth={stroke} fill="none" strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c - (progresso / 100) * c}
            style={{ transition: 'stroke-dashoffset .3s linear' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeContent: 'center' }}>
          <div style={{ fontSize: 58, fontWeight: 700, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
            {mmss(restante)}
          </div>
          <div className="small muted center" style={{ marginTop: -6 }}>
            {f.rotulo} · ciclo {ciclo} de {estado.pomodoro.config.ciclosAteLonga}
          </div>
        </div>
      </div>

      <div className="btn-row" style={{ justifyContent: 'center', marginTop: 22 }}>
        {!rodando ? (
          <button className="btn primary" onClick={iniciar} style={{ minWidth: 130 }}>
            ▶ Iniciar
          </button>
        ) : (
          <button className="btn" onClick={pausar} style={{ minWidth: 130 }}>
            ⏸ Pausar
          </button>
        )}
        <button className="btn ghost" onClick={zerar}>↺ Zerar</button>
        <button className="btn ghost" onClick={pular}>⏭ Pular fase</button>
      </div>
    </div>
  )
}

function SeletorDeFoco() {
  const { plano } = useApp()
  const { moduloFoco, setModuloFoco } = usePomodoro()

  const modulos = useMemo(
    () => TRILHAS.flatMap((t) => todosModulos(t).map((m) => ({ id: m.id, titulo: m.titulo, trilha: t.nome, icone: t.icone }))),
    []
  )

  const sugerido = plano.proximo?.modulo

  return (
    <div className="card">
      <div className="card-title" style={{ marginBottom: 4 }}>No que voce vai focar</div>
      <div className="card-sub" style={{ marginBottom: 12 }}>
        Cada bloco de foco concluido e contabilizado neste modulo. E assim que o painel sabe onde seu tempo
        realmente foi — nao onde voce achou que foi.
      </div>

      <select value={moduloFoco || ''} onChange={(e) => setModuloFoco(e.target.value || null)}>
        <option value="">— Sem modulo especifico —</option>
        {modulos.map((m) => (
          <option key={m.id} value={m.id}>
            {m.icone} {m.titulo} ({m.trilha})
          </option>
        ))}
      </select>

      {sugerido && moduloFoco !== sugerido.id && (
        <div className="small" style={{ marginTop: 10 }}>
          Seu proximo passo no plano e <b>{sugerido.titulo}</b>.{' '}
          <button className="btn ghost sm" onClick={() => setModuloFoco(sugerido.id)}>
            Focar nele
          </button>
        </div>
      )}
    </div>
  )
}

function Configuracoes() {
  const { estado, setPomodoroConfig } = useApp()
  const c = estado.pomodoro.config
  const [permissao, setPermissao] = useState(permissaoNotificacao())

  const campos = [
    { k: 'foco', rotulo: 'Foco (min)', min: 1, max: 180 },
    { k: 'pausaCurta', rotulo: 'Pausa curta (min)', min: 1, max: 60 },
    { k: 'pausaLonga', rotulo: 'Pausa longa (min)', min: 1, max: 120 },
    { k: 'ciclosAteLonga', rotulo: 'Ciclos ate a pausa longa', min: 1, max: 12 },
  ]

  async function ativarNotificacao() {
    const p = await pedirPermissaoNotificacao()
    setPermissao(p)
    if (p === 'granted') setPomodoroConfig({ notificacao: true })
  }

  return (
    <div className="card">
      <div className="card-title" style={{ marginBottom: 14 }}>Configuracoes</div>

      <div className="grid grid-4">
        {campos.map((f) => (
          <div className="field" key={f.k} style={{ marginBottom: 0 }}>
            <label>{f.rotulo}</label>
            <input
              type="number"
              min={f.min}
              max={f.max}
              value={c[f.k]}
              onChange={(e) => {
                const v = Number(e.target.value)
                if (Number.isFinite(v)) setPomodoroConfig({ [f.k]: Math.min(f.max, Math.max(f.min, v)) })
              }}
            />
          </div>
        ))}
      </div>

      <div className="sep" />

      <div className="btn-row" style={{ marginBottom: 14 }}>
        {[
          { rotulo: 'Classico 25/5', v: { foco: 25, pausaCurta: 5, pausaLonga: 15, ciclosAteLonga: 4 } },
          { rotulo: 'Longo 50/10', v: { foco: 50, pausaCurta: 10, pausaLonga: 30, ciclosAteLonga: 3 } },
          { rotulo: 'Curto 15/3', v: { foco: 15, pausaCurta: 3, pausaLonga: 10, ciclosAteLonga: 4 } },
          { rotulo: 'Deep work 90/20', v: { foco: 90, pausaCurta: 20, pausaLonga: 30, ciclosAteLonga: 2 } },
        ].map((p) => (
          <button key={p.rotulo} className="btn sm" onClick={() => setPomodoroConfig(p.v)}>
            {p.rotulo}
          </button>
        ))}
      </div>

      <label className="topico" style={{ alignItems: 'center' }}>
        <input type="checkbox" checked={c.autoIniciar} onChange={(e) => setPomodoroConfig({ autoIniciar: e.target.checked })} />
        <span>Iniciar a proxima fase automaticamente</span>
      </label>

      <label className="topico" style={{ alignItems: 'center' }}>
        <input type="checkbox" checked={c.som} onChange={(e) => setPomodoroConfig({ som: e.target.checked })} />
        <span>Alarme sonoro no fim de cada fase</span>
      </label>

      {c.som && (
        <div className="row" style={{ gap: 12, padding: '8px 8px 4px' }}>
          <span className="small muted" style={{ width: 60 }}>Volume</span>
          <input
            type="range" min="0.05" max="1" step="0.05" value={c.volume}
            onChange={(e) => setPomodoroConfig({ volume: Number(e.target.value) })}
            style={{ flex: 1, accentColor: 'var(--accent)' }}
          />
          <button className="btn sm ghost" onClick={() => tocarAlarme('foco', c.volume)}>🔊 Testar</button>
        </div>
      )}

      <label className="topico" style={{ alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={c.notificacao && permissao === 'granted'}
          disabled={permissao === 'denied' || permissao === 'unsupported'}
          onChange={(e) => {
            if (e.target.checked && permissao !== 'granted') ativarNotificacao()
            else setPomodoroConfig({ notificacao: e.target.checked })
          }}
        />
        <span>Notificacao do sistema (aparece mesmo com a aba em segundo plano)</span>
      </label>

      {suporteNotificacao() && permissao === 'default' && (
        <div style={{ paddingLeft: 8, marginTop: 6 }}>
          <button className="btn sm" onClick={ativarNotificacao}>Permitir notificacoes</button>
        </div>
      )}
      {permissao === 'denied' && (
        <Callout tipo="warn" titulo="Notificacoes bloqueadas">
          Voce negou a permissao para este site. Libere no cadeado da barra de enderecos e recarregue a pagina.
          O alarme sonoro continua funcionando.
        </Callout>
      )}
      {permissao === 'unsupported' && (
        <div className="small muted" style={{ paddingLeft: 8 }}>
          Este navegador nao suporta notificacoes do sistema. O alarme sonoro cobre.
        </div>
      )}
    </div>
  )
}

function Estatisticas() {
  const { estado } = useApp()
  const sessoes = estado.pomodoro.sessoes

  const dados = useMemo(() => {
    const hoje = new Date().toISOString().slice(0, 10)
    const seteDias = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10)

    const doDia = sessoes.filter((s) => s.fim.slice(0, 10) === hoje)
    const daSemana = sessoes.filter((s) => s.fim.slice(0, 10) >= seteDias)

    const porDia = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
      porDia[d] = 0
    }
    for (const s of daSemana) {
      const d = s.fim.slice(0, 10)
      if (d in porDia) porDia[d] += s.minutos
    }

    const porModulo = {}
    for (const s of sessoes) {
      const k = s.moduloId || '—'
      porModulo[k] = (porModulo[k] || 0) + s.minutos
    }

    return {
      blocosHoje: doDia.length,
      minutosHoje: doDia.reduce((a, s) => a + s.minutos, 0),
      minutosSemana: daSemana.reduce((a, s) => a + s.minutos, 0),
      totalBlocos: sessoes.length,
      porDia: Object.entries(porDia),
      porModulo: Object.entries(porModulo).sort((a, b) => b[1] - a[1]).slice(0, 5),
    }
  }, [sessoes])

  const maximo = Math.max(60, ...dados.porDia.map(([, v]) => v))
  const nomeModulo = useMemo(() => {
    const mapa = {}
    TRILHAS.forEach((t) => todosModulos(t).forEach((m) => { mapa[m.id] = m.titulo }))
    return mapa
  }, [])

  return (
    <>
      <div className="grid grid-4">
        <Stat label="Blocos hoje" value={dados.blocosHoje} hint={formatarMinutos(dados.minutosHoje)} />
        <Stat label="Esta semana" value={formatarMinutos(dados.minutosSemana)} hint="tempo em foco" />
        <Stat label="Total" value={dados.totalBlocos} hint="blocos concluidos" />
        <Stat
          label="Media diaria"
          value={formatarMinutos(dados.minutosSemana / 7)}
          hint="ultimos 7 dias"
        />
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 16 }}>Ultimos 7 dias</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 120 }}>
          {dados.porDia.map(([dia, min]) => (
            <div key={dia} style={{ flex: 1, textAlign: 'center' }}>
              <div className="small muted" style={{ fontSize: 10.5, marginBottom: 4 }}>
                {min > 0 ? formatarMinutos(min) : ''}
              </div>
              <div
                style={{
                  height: `${Math.max(3, (min / maximo) * 90)}px`,
                  background: min > 0 ? 'var(--accent)' : 'var(--surface-2)',
                  borderRadius: '4px 4px 0 0',
                }}
                title={`${dia}: ${formatarMinutos(min)}`}
              />
              <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginTop: 5 }}>
                {dia.slice(8)}/{dia.slice(5, 7)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {dados.porModulo.length > 0 && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 12 }}>Onde seu tempo foi</div>
          {dados.porModulo.map(([id, min]) => (
            <div key={id} className="spread small" style={{ padding: '6px 0' }}>
              <span>{id === '—' ? 'Sem modulo definido' : nomeModulo[id] || id}</span>
              <span className="muted">{formatarMinutos(min)}</span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default function Pomodoro() {
  const p = usePomodoro()

  // Aviso de saida enquanto um bloco de foco esta rodando
  useEffect(() => {
    if (!p.rodando || p.fase !== 'foco') return
    const aviso = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', aviso)
    return () => window.removeEventListener('beforeunload', aviso)
  }, [p.rodando, p.fase])

  return (
    <>
      <div className="page-head">
        <h1>Pomodoro</h1>
        <div className="sub">
          Blocos de foco com pausa obrigatoria. A regra e simples: durante o bloco, uma coisa so. Se voce trocar
          de aba, o bloco nao conta — e voce sabe disso, ninguem precisa fiscalizar.
        </div>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <Relogio />
        <div>
          <SeletorDeFoco />
          <Configuracoes />
        </div>
      </div>

      <div className="sep" />
      <h2 style={{ marginBottom: 14 }}>Seu desempenho</h2>
      <Estatisticas />
    </>
  )
}
