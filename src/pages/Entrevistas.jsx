import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import {
  ETAPAS_PROCESSO,
  PERGUNTAS,
  CATEGORIAS,
  CHECKLIST_PRE_ENTREVISTA,
  METODO_STAR,
} from '../data/interview'
import { Bar, Callout, Empty } from '../components/ui'

/* ------------------------------------------------------------------ etapas */

function Processo() {
  const [aberta, setAberta] = useState(ETAPAS_PROCESSO[0].id)
  return (
    <>
      <Callout titulo="Como funciona um processo seletivo de dev junior">
        Nem toda empresa faz todas as etapas, mas a ordem costuma ser esta. Saber o que cada etapa avalia muda
        completamente a forma como voce se prepara.
      </Callout>

      <div style={{ marginTop: 16 }}>
        {ETAPAS_PROCESSO.map((e, i) => {
          const aberto = aberta === e.id
          return (
            <div className="acc" key={e.id}>
              <div className="acc-head" onClick={() => setAberta(aberto ? null : e.id)}>
                <div className="num" style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', fontSize: 12.5, fontWeight: 700, color: 'var(--text-2)' }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 640 }}>{e.nome}</div>
                  <div className="small muted">
                    {e.duracao} · {e.quemConduz}
                  </div>
                </div>
                <span className="muted small">{aberto ? '▲' : '▼'}</span>
              </div>
              {aberto && (
                <div className="acc-body">
                  <h4 style={{ margin: '14px 0 6px', fontSize: 13.5, color: 'var(--text-2)' }}>O que avaliam</h4>
                  <ul className="lista-simples">
                    {e.oQueAvaliam.map((x, k) => (
                      <li key={k}>{x}</li>
                    ))}
                  </ul>
                  <h4 style={{ margin: '16px 0 6px', fontSize: 13.5, color: 'var(--text-2)' }}>Como se preparar</h4>
                  <ul className="lista-simples lista-ok">
                    {e.comoSePreparar.map((x, k) => (
                      <li key={k}>{x}</li>
                    ))}
                  </ul>
                  <div className="callout danger" style={{ marginTop: 16 }}>
                    <b>Erro que elimina</b>
                    {e.erroFatal}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

/* --------------------------------------------------------------- perguntas */

function BancoPerguntas() {
  const { estado, toggleEntrevista } = useApp()
  const [cat, setCat] = useState('todas')
  const [modoFlash, setModoFlash] = useState(false)
  const [reveladas, setReveladas] = useState({})

  const lista = useMemo(
    () => PERGUNTAS.filter((p) => cat === 'todas' || p.categoria === cat),
    [cat]
  )
  const dominadas = lista.filter((p) => estado.entrevistas[p.id]).length
  const pct = lista.length ? Math.round((dominadas / lista.length) * 100) : 0

  return (
    <>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="spread" style={{ marginBottom: 10 }}>
          <div>
            <div className="card-title">Banco de perguntas</div>
            <div className="card-sub">
              Marque como dominada so quando conseguir responder em voz alta, sem ler.
            </div>
          </div>
          <div className="row">
            <span className="small muted">
              {dominadas}/{lista.length}
            </span>
            <button className={`btn sm${modoFlash ? ' primary' : ''}`} onClick={() => { setModoFlash((v) => !v); setReveladas({}) }}>
              🎴 Modo flashcard
            </button>
          </div>
        </div>
        <Bar pct={pct} />
      </div>

      <div className="tabs" style={{ marginBottom: 14 }}>
        <button className={`tab${cat === 'todas' ? ' active' : ''}`} onClick={() => setCat('todas')}>
          Todas ({PERGUNTAS.length})
        </button>
        {Object.entries(CATEGORIAS).map(([id, c]) => {
          const n = PERGUNTAS.filter((p) => p.categoria === id).length
          return (
            <button key={id} className={`tab${cat === id ? ' active' : ''}`} onClick={() => setCat(id)}>
              {c.nome} ({n})
            </button>
          )
        })}
      </div>

      {lista.length === 0 && <Empty titulo="Nenhuma pergunta nessa categoria" />}

      {lista.map((p) => {
        const dominada = !!estado.entrevistas[p.id]
        const revelada = !modoFlash || reveladas[p.id]
        const c = CATEGORIAS[p.categoria]
        return (
          <div className="card" key={p.id} style={{ borderColor: dominada ? 'rgba(34,197,94,.3)' : 'var(--border-soft)' }}>
            <div className="row" style={{ gap: 8, marginBottom: 8 }}>
              <span className="chip" style={{ borderColor: c.cor, color: c.cor }}>{c.nome}</span>
              {dominada && <span className="chip ok">✓ dominada</span>}
            </div>
            <h3 style={{ marginBottom: 10 }}>{p.pergunta}</h3>

            {!revelada ? (
              <button className="btn sm" onClick={() => setReveladas((r) => ({ ...r, [p.id]: true }))}>
                Responda em voz alta primeiro, depois clique para conferir →
              </button>
            ) : (
              <>
                <div className="callout" style={{ marginBottom: 12 }}>
                  <b>Como estruturar a resposta</b>
                  {p.comoResponder}
                </div>
                <div className="exemplo bom">
                  <span className="exemplo-tag">Resposta modelo</span>
                  {p.respostaModelo}
                </div>
                {p.armadilha && (
                  <div className="callout danger" style={{ marginTop: 12 }}>
                    <b>Armadilha</b>
                    {p.armadilha}
                  </div>
                )}
              </>
            )}

            <div className="btn-row" style={{ marginTop: 14 }}>
              <button className={`btn sm${dominada ? ' primary' : ''}`} onClick={() => toggleEntrevista(p.id)}>
                {dominada ? '✓ Dominada' : 'Marcar como dominada'}
              </button>
            </div>
          </div>
        )
      })}
    </>
  )
}

/* -------------------------------------------------------------------- star */

function Star() {
  return (
    <>
      <div className="card">
        <div className="card-title">{METODO_STAR.nome}</div>
        <div className="card-sub" style={{ marginBottom: 16 }}>{METODO_STAR.descricao}</div>
        <div className="grid grid-4">
          {METODO_STAR.passos.map((p) => (
            <div key={p.letra} className="stat">
              <div className="stat-value" style={{ fontSize: 30, color: 'var(--accent)' }}>{p.letra}</div>
              <div style={{ fontWeight: 640, marginTop: 2 }}>{p.nome}</div>
              <div className="stat-hint">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Exemplo aplicado</div>
        <p className="small muted" style={{ marginTop: 6 }}>
          <b>Pergunta:</b> {METODO_STAR.exemplo.pergunta}
        </p>
        <div className="exemplo bom">
          <span className="exemplo-tag">Resposta em STAR</span>
          {METODO_STAR.exemplo.resposta}
        </div>
      </div>

      <Callout tipo="warn" titulo="Prepare as suas 5 historias">
        Escreva agora, em um documento, 5 situacoes reais da sua vida (profissional ou de projeto) no formato STAR:
        (1) um problema dificil que voce resolveu, (2) um erro que voce cometeu, (3) um conflito com alguem,
        (4) algo que voce aprendeu do zero e rapido, (5) uma entrega sob prazo apertado. Com essas 5 historias
        voce responde 90% das perguntas comportamentais.
      </Callout>
    </>
  )
}

/* --------------------------------------------------------------- checklist */

function Checklist() {
  const { estado, toggleChecklist } = useApp()
  const grupos = ['1 dia antes', '1h antes', '15 min antes', 'na hora', 'depois']
  const feitos = CHECKLIST_PRE_ENTREVISTA.filter((c) => estado.checklist[c.id]).length
  const pct = Math.round((feitos / CHECKLIST_PRE_ENTREVISTA.length) * 100)

  return (
    <>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="spread" style={{ marginBottom: 10 }}>
          <div className="card-title">Checklist da entrevista</div>
          <span className="small muted">
            {feitos}/{CHECKLIST_PRE_ENTREVISTA.length}
          </span>
        </div>
        <Bar pct={pct} />
        <div className="small muted" style={{ marginTop: 10 }}>
          Desmarque tudo depois de cada entrevista para reutilizar na proxima.
        </div>
      </div>

      {grupos.map((g) => {
        const itens = CHECKLIST_PRE_ENTREVISTA.filter((c) => c.quando === g)
        if (!itens.length) return null
        return (
          <div className="card" key={g}>
            <div className="card-title" style={{ marginBottom: 8, textTransform: 'capitalize' }}>{g}</div>
            <ul className="topicos">
              {itens.map((c) => {
                const ok = !!estado.checklist[c.id]
                return (
                  <li key={c.id} className={`topico${ok ? ' feito' : ''}`} onClick={() => toggleChecklist(c.id)}>
                    <input type="checkbox" checked={ok} readOnly />
                    <span>{c.texto}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </>
  )
}

/* -------------------------------------------------------------------- page */

const ABAS = [
  { id: 'processo', nome: 'O processo seletivo', comp: Processo },
  { id: 'perguntas', nome: 'Banco de perguntas', comp: BancoPerguntas },
  { id: 'star', nome: 'Metodo STAR', comp: Star },
  { id: 'checklist', nome: 'Checklist', comp: Checklist },
]

export default function Entrevistas() {
  const [aba, setAba] = useState('processo')
  const Comp = ABAS.find((a) => a.id === aba).comp

  return (
    <>
      <div className="page-head">
        <h1>Entrevistas</h1>
        <div className="sub">
          Preparacao completa: como funciona cada etapa, banco de perguntas com resposta modelo, metodo STAR para
          perguntas comportamentais e checklist do dia.
        </div>
      </div>

      <div className="tabs">
        {ABAS.map((a) => (
          <button key={a.id} className={`tab${aba === a.id ? ' active' : ''}`} onClick={() => setAba(a.id)}>
            {a.nome}
          </button>
        ))}
      </div>

      <Comp />
    </>
  )
}
