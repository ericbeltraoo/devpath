import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { microPorId } from '../data/micro'
import { todosModulos, TRILHAS } from '../data/tracks'
import { Texto, Bloco } from '../components/ui'

// ---------------------------------------------------------------------------
// Micro-exercicio
// ---------------------------------------------------------------------------
// Tela irma da de Exercicio, deliberadamente mais curta.
//
// Aqui NAO tem cronometro, NAO tem trava de "ja tentei" e NAO tem explicacao
// em cinco partes. Dez minutos de fixacao nao comportam ritual: o atrito que
// protege um exercicio de uma hora so faz voce desistir de um de dez minutos.
//
// O que sobrou de trava e um clique para ver a solucao — o suficiente para
// voce nao ler a resposta sem querer enquanto le o enunciado.
// ---------------------------------------------------------------------------

/** Nome do topico ao qual este micro-exercicio pertence. */
function nomeDoTopico(moduloId, indice) {
  for (const trilha of TRILHAS) {
    for (const m of todosModulos(trilha)) {
      if (m.id === moduloId) return m.topicos[indice] || null
    }
  }
  return null
}

export default function Micro() {
  const { id } = useParams()
  const [verSolucao, setVerSolucao] = useState(false)

  const ex = microPorId(id)
  if (!ex) return <div className="card">Micro-exercicio nao encontrado.</div>

  const topico = nomeDoTopico(ex.moduloId, ex.topico)

  return (
    <article style={{ maxWidth: 760 }}>
      <Link to="/trilha" className="small muted">← voltar para a trilha</Link>

      <div className="page-head" style={{ marginTop: 10 }}>
        <div className="row" style={{ gap: 8, marginBottom: 10 }}>
          <span className="chip ok">Fixação de tópico</span>
          <span className="chip">⏱ {ex.tempo}</span>
        </div>
        <h1 style={{ fontSize: 26, lineHeight: 1.2, letterSpacing: '-0.02em' }}>{ex.titulo}</h1>
        {topico && <div className="sub">{topico}</div>}
      </div>

      <Bloco titulo="PARA QUE SERVE ESTE EXERCÍCIO" cor="var(--accent)">
        <Texto>{ex.objetivo}</Texto>
      </Bloco>

      <Bloco titulo="O QUE FAZER">
        <Texto>{ex.tarefa}</Texto>
      </Bloco>

      {ex.dica && (
        <Bloco titulo="POR ONDE COMEÇAR">
          <Texto>{ex.dica}</Texto>
        </Bloco>
      )}

      <Bloco titulo="A SAÍDA TEM QUE SER ESTA" cor="var(--ok)">
        <pre className="codigo"><code>{ex.saidaEsperada}</code></pre>
        <p className="small muted" style={{ marginTop: 8 }}>
          Rode o seu código e compare linha por linha. Se bater, está certo.
        </p>
      </Bloco>

      <Bloco titulo="A ARMADILHA" cor="var(--warn)">
        <Texto>{ex.armadilha}</Texto>
      </Bloco>

      <Bloco titulo="SOLUÇÃO">
        {!verSolucao ? (
          <div className="card center" style={{ padding: 22, borderStyle: 'dashed' }}>
            <p className="muted" style={{ maxWidth: 420, margin: '0 auto 14px' }}>
              Tente primeiro, mesmo que trave. São dez minutos — o custo de tentar é baixo, e
              o de ler a resposta antes é você achar que aprendeu.
            </p>
            <button className="btn primary" onClick={() => setVerSolucao(true)}>
              Ver a solução
            </button>
          </div>
        ) : (
          <>
            <pre className="codigo"><code>{ex.solucao.codigo}</code></pre>
            <h3 style={{ fontSize: 13.5, marginTop: 20, marginBottom: 8, color: 'var(--text-2)' }}>
              O que está acontecendo aqui
            </h3>
            <Texto>{ex.solucao.comentario}</Texto>
          </>
        )}
      </Bloco>
    </article>
  )
}
