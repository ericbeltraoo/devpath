import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { TODOS_EXERCICIOS } from '../data/exercicios'
import { normalizarRegistro } from '../lib/cronometro'

// ---------------------------------------------------------------------------
// Hoje
// ---------------------------------------------------------------------------
// Esta tela responde UMA pergunta: o que eu faco agora?
//
// O painel antigo respondia oito. Tinha previsao de conclusao para 2027,
// percentual por trilha, contador de entrevistas e nota do LinkedIn. Nada
// disso ajuda a comecar a estudar — e comecar e a parte dificil.
// ---------------------------------------------------------------------------

function Cartao({ etiqueta, cor, titulo, children, acao }) {
  return (
    <section className="card" style={{ borderColor: cor, marginBottom: 14 }}>
      <div className="small" style={{ color: cor, fontWeight: 700, letterSpacing: '.08em', marginBottom: 6 }}>
        {etiqueta}
      </div>
      <h2 style={{ fontSize: 19, lineHeight: 1.3, marginBottom: 8 }}>{titulo}</h2>
      {children}
      {acao && <div style={{ marginTop: 14 }}>{acao}</div>}
    </section>
  )
}

export default function Hoje() {
  const { estado, fila, registrarRevisao, plano } = useApp()

  const nome = estado.perfil.nome
  // `fila` e um objeto, nao array. `pendentes` = vencidas + as de hoje,
  // e cada item ja vem com o contexto do topico embutido.
  const todas = fila.pendentes
  const pendentes = todas.slice(0, 5)

  // Exercicio em andamento vence tudo: terminar o que comecou vale mais que
  // comecar mais um.
  const emAndamento = TODOS_EXERCICIOS.find(
    (e) => normalizarRegistro(estado.exercicios[e.id])?.status === 'fazendo'
  )

  const proximoModulo = plano.proximo?.modulo
  const proximoExercicio = proximoModulo
    ? TODOS_EXERCICIOS.find(
        (e) => e.moduloId === proximoModulo.id &&
               normalizarRegistro(estado.exercicios[e.id])?.status !== 'feito'
      )
    : null

  return (
    <>
      <div className="page-head">
        <h1>Bom te ver{nome ? `, ${nome}` : ''}.</h1>
        <div className="sub">
          Uma coisa de cada vez, na ordem: revisar primeiro, conteudo novo depois.
        </div>
      </div>

      {/* ---------------------------------------------------- 1. revisao */}
      {pendentes.length > 0 ? (
        <Cartao
          etiqueta="PRIMEIRO — REVISAO"
          cor="var(--warn)"
          titulo={`${todas.length} ${todas.length === 1 ? 'topico pede' : 'topicos pedem'} revisao`}
        >
          <p className="small muted" style={{ marginBottom: 12 }}>
            Revisao atrasada e divida, e ela cobra juros: o assunto que voce nao revisar hoje
            volta como buraco de base num exercicio de daqui a tres semanas.
          </p>

          {pendentes.map((r) => (
            <div key={r.chave} className="linha-revisao">
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 560 }}>{r.texto}</div>
                <div className="small muted">{r.moduloTitulo}</div>
              </div>
              <div className="btn-row" style={{ margin: 0, flexShrink: 0 }}>
                <button className="btn sm" onClick={() => registrarRevisao(r.chave, true)}>Lembrei</button>
                <button className="btn sm ghost" onClick={() => registrarRevisao(r.chave, false)}>Esqueci</button>
              </div>
            </div>
          ))}

          {todas.length > pendentes.length && (
            <div className="small muted" style={{ marginTop: 10 }}>
              Mais {todas.length - pendentes.length} na fila. Cinco por vez ja e o bastante.
            </div>
          )}
        </Cartao>
      ) : (
        <Cartao etiqueta="REVISAO" cor="var(--ok)" titulo="Fila zerada">
          <p className="small muted">Nada atrasado. Pode avancar com a consciencia limpa.</p>
        </Cartao>
      )}

      {/* -------------------------------------------------- 2. exercicio */}
      {emAndamento ? (
        <Cartao
          etiqueta="VOCE COMECOU E NAO TERMINOU"
          cor="var(--accent)"
          titulo={emAndamento.titulo}
          acao={<Link className="btn primary" to={`/ex/${emAndamento.id}`}>Voltar para ele →</Link>}
        >
          <p className="small muted">
            {emAndamento.contexto} · {emAndamento.tempo}
          </p>
        </Cartao>
      ) : proximoExercicio ? (
        <Cartao
          etiqueta="DEPOIS — EXERCICIO"
          cor="var(--accent)"
          titulo={proximoExercicio.titulo}
          acao={<Link className="btn primary" to={`/ex/${proximoExercicio.id}`}>Comecar →</Link>}
        >
          <p className="small muted">
            {proximoExercicio.contexto} · {proximoExercicio.tempo}
          </p>
        </Cartao>
      ) : proximoModulo ? (
        <Cartao
          etiqueta="DEPOIS — ESTUDO"
          cor="var(--accent)"
          titulo={proximoModulo.titulo}
          acao={<Link className="btn primary" to="/trilha">Ver na trilha →</Link>}
        >
          <p className="small muted">
            Exercicios deste modulo ainda nao foram escritos. Estude os topicos e marque na trilha.
          </p>
        </Cartao>
      ) : null}
    </>
  )
}
