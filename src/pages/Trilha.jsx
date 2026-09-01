import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { TRILHAS, todosModulos } from '../data/tracks'
import { progressoModulo } from '../lib/planner'
import { porModulo } from '../data/exercicios'
import { microPorTopico, microPorModulo } from '../data/micro'
import { DESAFIOS } from '../data/desafios'
import { Bar } from '../components/ui'

// ---------------------------------------------------------------------------
// Trilha
// ---------------------------------------------------------------------------
// O Roadmap antigo era uma arvore de quatro niveis (trilha > fase > modulo >
// topico), toda aberta, com recursos e exercicios embutidos. Dava 426 linhas
// de tela e voce se perdia antes de achar onde estava.
//
// Aqui e uma lista de modulos. Um clique abre os topicos daquele modulo. Mais
// nada.
// ---------------------------------------------------------------------------

function Modulo({ modulo, aberto, alternar }) {
  const { estado, toggleTopico } = useApp()
  const p = progressoModulo(modulo, estado.topicos)
  const exercicios = porModulo(modulo.id)
  const micros = microPorModulo(modulo.id)

  return (
    <div className="acc" style={{ marginBottom: 6 }}>
      <div className="acc-head" onClick={alternar}>
        <span style={{ flex: 1, minWidth: 0, fontWeight: 560 }}>{modulo.titulo}</span>
        <span className="small muted" style={{ flexShrink: 0 }}>{p.feitos}/{modulo.topicos.length}</span>
        {p.pct === 100 && <span className="chip ok">✓</span>}
        {micros.length > 0 && <span className="chip">✎ {micros.length}</span>}
        {exercicios.length > 0 && <span className="chip">⌨️ {exercicios.length}</span>}
        <span className="muted small">{aberto ? '▲' : '▼'}</span>
      </div>

      {aberto && (
        <div className="acc-body" style={{ paddingBottom: 14 }}>
          {modulo.topicos.map((t, i) => {
            const chave = `${modulo.id}:${i}`
            const marcado = !!estado.topicos[chave]
            const micro = microPorTopico(modulo.id, i)

            return (
              <div key={i} className="row" style={{ gap: 8, alignItems: 'center' }}>
                <label className="topico" style={{ flex: 1, minWidth: 0 }}>
                  <input type="checkbox" checked={marcado} onChange={() => toggleTopico(modulo.id, i)} />
                  <span>{t}</span>
                </label>

                {/* O micro-exercicio so aparece DEPOIS de voce marcar o topico.
                    Antes disso ele seria spoiler do que voce ainda vai estudar;
                    depois, e a pergunta "voce entendeu mesmo?". */}
                {micro && marcado && (
                  <Link
                    className="btn sm"
                    to={`/micro/${micro.id}`}
                    title={`${micro.titulo} · ${micro.tempo}`}
                    style={{ flexShrink: 0 }}
                  >
                    ✎ praticar
                  </Link>
                )}
              </div>
            )
          })}

          {micros.length > 0 && (
            <p className="small muted" style={{ marginTop: 10 }}>
              Marque um tópico para liberar o exercício curto dele. São {micros.length} no total
              neste módulo, de dez minutos cada — os três grandes lá embaixo são a prova do
              módulo inteiro, para quando você terminar.
            </p>
          )}

          {modulo.entregavel && (
            <p className="small muted" style={{ marginTop: 12 }}>
              <b>Entregavel:</b> {modulo.entregavel}
            </p>
          )}

          {exercicios.length > 0 && (
            <div className="btn-row" style={{ marginTop: 12 }}>
              {exercicios.map((e) => (
                <Link key={e.id} className="btn sm" to={`/ex/${e.id}`}>{e.titulo}</Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Trilha() {
  const { estado } = useApp()
  const [aberto, setAberto] = useState(null)
  const [trilhaId, setTrilhaId] = useState('java')

  const trilha = TRILHAS.find((t) => t.id === trilhaId) || TRILHAS[0]
  const modulos = todosModulos(trilha)
  const feitos = modulos.filter((m) => progressoModulo(m, estado.topicos).pct === 100).length

  // Projetos de portfolio: nao viram aba propria, moram no fim da trilha.
  // Eles nao tem campo de trilha, entao aparecem so na de Java — que e onde
  // fazem sentido: sao todos desafios de processo seletivo backend.
  const projetos = trilha.id === 'java' ? DESAFIOS : []

  return (
    <>
      <div className="page-head">
        <h1>Trilha</h1>
        <div className="sub">{feitos} de {modulos.length} modulos concluidos.</div>
      </div>

      <div className="btn-row" style={{ marginBottom: 16 }}>
        {TRILHAS.map((t) => (
          <button
            key={t.id}
            className={`btn sm${t.id === trilha.id ? ' primary' : ''}`}
            onClick={() => { setTrilhaId(t.id); setAberto(null) }}
          >
            {t.icone} {t.nome}
          </button>
        ))}
      </div>

      <Bar pct={Math.round((feitos / modulos.length) * 100)} />

      <div style={{ marginTop: 16 }}>
        {modulos.map((m) => (
          <Modulo key={m.id} modulo={m} aberto={aberto === m.id} alternar={() => setAberto(aberto === m.id ? null : m.id)} />
        ))}
      </div>

      {projetos.length > 0 && (
        <section style={{ marginTop: 30 }}>
          <h2 style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 4 }}>
            Projetos de portfolio
          </h2>
          <p className="small muted" style={{ marginBottom: 12 }}>
            Maiores que exercicio, menores que produto. Sao eles que voce mostra numa entrevista.
          </p>
          {projetos.map((d) => (
            <div className="acc" key={d.id} style={{ marginBottom: 6 }}>
              <div className="acc-head">
                <span style={{ flex: 1, fontWeight: 560 }}>{d.titulo}</span>
                {estado.desafios[d.id]?.status === 'feito' && <span className="chip ok">✓</span>}
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  )
}
