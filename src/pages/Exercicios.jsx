import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { TODOS_EXERCICIOS, NIVEIS } from '../data/exercicios'
import { TRILHAS, todosModulos } from '../data/tracks'
import { normalizarRegistro, decorrido, duracaoCurta } from '../lib/cronometro'
import { Empty } from '../components/ui'

export default function Exercicios() {
  const { estado } = useApp()

  const modulos = {}
  TRILHAS.forEach((t) => todosModulos(t).forEach((m) => { modulos[m.id] = m }))

  // Agrupa por modulo: e assim que voce pensa quando esta estudando
  // ("estou em data e hora"), nao por nivel nem por tag.
  const grupos = {}
  TODOS_EXERCICIOS.forEach((e) => {
    ;(grupos[e.moduloId] ||= []).push(e)
  })

  const feitos = TODOS_EXERCICIOS.filter(
    (e) => normalizarRegistro(estado.exercicios[e.id])?.status === 'feito'
  ).length

  return (
    <>
      <div className="page-head">
        <h1>Exercicios</h1>
        <div className="sub">
          No formato de desafio tecnico: cenario de negocio, casos que precisam passar, e
          explicacao completa depois que voce tentar. {feitos} de {TODOS_EXERCICIOS.length} resolvidos.
        </div>
      </div>

      {Object.keys(grupos).length === 0 ? (
        <Empty titulo="Nenhum exercicio ainda" texto="Os modulos estao sendo escritos." />
      ) : (
        Object.entries(grupos).map(([moduloId, lista]) => (
          <section key={moduloId} style={{ marginBottom: 26 }}>
            <h2 style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 10 }}>
              {modulos[moduloId]?.titulo || moduloId}
            </h2>

            {lista.map((e) => {
              const r = normalizarRegistro(estado.exercicios[e.id])
              const n = NIVEIS[e.nivel]
              const gasto = decorrido(r)
              return (
                <Link key={e.id} to={`/ex/${e.id}`} className="cartao-ex">
                  <span className="chip" style={{ borderColor: n.cor, color: n.cor, flexShrink: 0 }}>
                    {n.nome}
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: 580 }}>{e.titulo}</span>
                    <span className="small muted" style={{ display: 'block' }}>{e.contexto}</span>
                  </span>
                  <span className="chips" style={{ flexShrink: 0 }}>
                    {gasto > 0 && (
                      <span className="chip" style={{ borderColor: 'var(--purple)', color: 'var(--purple)' }}>
                        ⏳ {duracaoCurta(gasto)}
                      </span>
                    )}
                    <span className="chip">⏱ {e.tempo}</span>
                    {r?.status === 'feito' && <span className="chip ok">✓</span>}
                  </span>
                </Link>
              )
            })}
          </section>
        ))
      )}
    </>
  )
}
