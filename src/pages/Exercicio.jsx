import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { EXERCICIOS_DATA_HORA } from '../data/exercicios/javaDataHora'
import CronometroExercicio from '../components/CronometroExercicio'
import { normalizarRegistro } from '../lib/cronometro'

const NIVEIS = {
  1: { nome: 'Aquecimento', cor: 'var(--ok)' },
  2: { nome: 'Mercado', cor: 'var(--warn)' },
  3: { nome: 'Entrevista', cor: 'var(--danger)' },
}

/** Quebra em paragrafos e destaca **negrito** e `codigo`. */
function Texto({ children }) {
  return (
    <>
      {String(children).split('\n\n').map((p, i) => (
        <p key={i} className="prosa">
          {p.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((t, j) => {
            if (t.startsWith('**')) return <b key={j}>{t.slice(2, -2)}</b>
            if (t.startsWith('`')) return <code key={j}>{t.slice(1, -1)}</code>
            return t
          })}
        </p>
      ))}
    </>
  )
}

function Bloco({ titulo, cor, children }) {
  return (
    <section style={{ marginTop: 30 }}>
      <h2 style={{ fontSize: 15, letterSpacing: '.02em', color: cor || 'var(--text-2)', marginBottom: 10 }}>
        {titulo}
      </h2>
      {children}
    </section>
  )
}

export default function Exercicio() {
  const { id } = useParams()
  const { estado, marcarTentou } = useApp()
  const [verExplicacao, setVerExplicacao] = useState(false)
  const [verSolucao, setVerSolucao] = useState(false)

  const ex = EXERCICIOS_DATA_HORA.find((e) => e.id === id)
  if (!ex) return <div className="card">Exercicio nao encontrado.</div>

  const registro = normalizarRegistro(estado.exercicios[ex.id])
  const tentou = !!registro?.tentouEm
  const n = NIVEIS[ex.nivel]

  return (
    <article className="leitura">
      <Link to="/exercicios" className="small muted">← Exercícios</Link>

      <header style={{ marginTop: 14 }}>
        <div className="chips" style={{ marginBottom: 10 }}>
          <span className="chip" style={{ borderColor: n.cor, color: n.cor }}>{n.nome}</span>
          <span className="chip">{ex.contexto}</span>
          <span className="chip">⏱ {ex.tempo}</span>
        </div>
        <h1 style={{ fontSize: 30, lineHeight: 1.2, letterSpacing: '-0.02em' }}>{ex.titulo}</h1>
      </header>

      {/* ------------------------------------------------------ 1. o problema */}
      <Bloco titulo="O CENÁRIO">
        <Texto>{ex.cenario}</Texto>
      </Bloco>

      <Bloco titulo="SUA TAREFA">
        <Texto>{ex.tarefa}</Texto>
        <ul className="lista-simples" style={{ marginTop: 12 }}>
          {ex.requisitos.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </Bloco>

      <Bloco titulo="CASOS QUE PRECISAM PASSAR" cor="var(--ok)">
        <div className="tabela-testes">
          {ex.testes.map((t, i) => (
            <div key={i} className="linha-teste">
              <span className="mono small">{t.dado}</span>
              <span className="seta">→</span>
              <span className="mono small" style={{ color: 'var(--ok)' }}>{t.esperado}</span>
            </div>
          ))}
        </div>
        <p className="small muted" style={{ marginTop: 10 }}>
          Escreva estes testes <b>antes</b> de escrever a solução. Se o seu desenho não produz
          essas saídas naturalmente, ele está errado antes da primeira linha.
        </p>
      </Bloco>

      <CronometroExercicio id={ex.id} estimativa={ex.tempo} />

      {/* -------------------------------------------------------- 2. a trava */}
      <div className="divisor-tentativa">
        <span>agora é com você</span>
      </div>

      {!verExplicacao ? (
        <div className="card center" style={{ padding: 26 }}>
          <p className="muted" style={{ marginBottom: 16, maxWidth: 460, margin: '0 auto 16px' }}>
            A explicação está logo abaixo, mas ler antes de tentar produz a sensação de ter
            aprendido sem o aprendizado. Tente primeiro, mesmo que trave.
          </p>
          <button className="btn primary" onClick={() => setVerExplicacao(true)}>
            Mostrar a explicação
          </button>
        </div>
      ) : (
        <>
          <Bloco titulo="O QUE ISTO TESTA DE VERDADE" cor="var(--accent)">
            <Texto>{ex.explicacao.testa}</Texto>
          </Bloco>

          <Bloco titulo="O CONCEITO" cor="var(--accent)">
            <Texto>{ex.explicacao.conceito}</Texto>
          </Bloco>

          <Bloco titulo="A ARMADILHA" cor="var(--warn)">
            <Texto>{ex.explicacao.armadilha}</Texto>
          </Bloco>

          <Bloco titulo="COMO UM SÊNIOR RESOLVE" cor="var(--purple)">
            <Texto>{ex.explicacao.senior}</Texto>
          </Bloco>

          <Bloco titulo="O QUE O ENTREVISTADOR AVALIA" cor="var(--purple)">
            <Texto>{ex.explicacao.entrevistador}</Texto>
          </Bloco>

          {/* ----------------------------------------------- 3. solucao */}
          <Bloco titulo="SOLUÇÃO COMENTADA">
            {!tentou ? (
              <div className="card center" style={{ padding: 26, borderStyle: 'dashed' }}>
                <div style={{ fontSize: 26, marginBottom: 8 }}>🔒</div>
                <p className="muted" style={{ maxWidth: 440, margin: '0 auto 16px' }}>
                  Destranca depois que você tentar. Não é burocracia: ver a solução antes de
                  travar é o que faz o assunto parecer fácil e sumir na semana seguinte.
                </p>
                <button className="btn" onClick={() => marcarTentou(ex.id)}>
                  Já tentei — destrancar
                </button>
              </div>
            ) : !verSolucao ? (
              <button className="btn" onClick={() => setVerSolucao(true)}>Ver a solução</button>
            ) : (
              <>
                <pre className="codigo"><code>{ex.solucao.codigo}</code></pre>

                <h3 style={{ fontSize: 13.5, marginTop: 20, marginBottom: 8, color: 'var(--text-2)' }}>
                  Notas sobre as escolhas
                </h3>
                <ul className="lista-simples">
                  {ex.solucao.notas.map((x, i) => <li key={i}>{x}</li>)}
                </ul>

                {ex.solucao.testeSugerido && (
                  <>
                    <h3 style={{ fontSize: 13.5, marginTop: 20, marginBottom: 8, color: 'var(--ok)' }}>
                      Os testes
                    </h3>
                    <pre className="codigo"><code>{ex.solucao.testeSugerido}</code></pre>
                  </>
                )}
              </>
            )}
          </Bloco>
        </>
      )}
    </article>
  )
}
