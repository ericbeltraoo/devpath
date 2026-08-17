import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { RESULTADOS, INTERVALOS, NIVEL_MAXIMO, estatisticasRevisao, hoje } from '../lib/revisao'
import { Bar, Stat, Callout, Empty } from '../components/ui'

function Cartao({ item, onResponder }) {
  const [revelado, setRevelado] = useState(false)
  const atraso = item.proxima < hoje()
  const dias = atraso
    ? Math.round((new Date(hoje()) - new Date(item.proxima)) / 86400000)
    : 0

  return (
    <div className="card" style={{ borderColor: atraso ? 'rgba(239,68,68,.35)' : 'var(--accent)' }}>
      <div className="row" style={{ gap: 7, marginBottom: 12 }}>
        <span className="chip" style={{ borderColor: item.trilhaCor, color: item.trilhaCor }}>
          {item.trilhaIcone} {item.trilhaNome}
        </span>
        <span className="chip">{item.moduloTitulo}</span>
        <span className="chip">nivel {item.nivel + 1}/{NIVEL_MAXIMO + 1}</span>
        {atraso && <span className="chip danger">{dias}d atrasada</span>}
      </div>

      <div style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.4, marginBottom: 6 }}>{item.texto}</div>

      <div className="callout" style={{ marginTop: 14 }}>
        <b>Explique em voz alta, agora</b>
        Fale como se estivesse ensinando outra pessoa. Sem olhar material, sem abrir a IDE. Se voce nao consegue
        explicar, voce nao sabe — reconhecer isso agora e o objetivo do exercicio, nao o fracasso dele.
      </div>

      {!revelado ? (
        <button className="btn primary" style={{ marginTop: 16, width: '100%' }} onClick={() => setRevelado(true)}>
          Ja expliquei — avaliar minha resposta
        </button>
      ) : (
        <>
          <div className="small muted" style={{ marginTop: 16, marginBottom: 8 }}>
            Seja honesto. Marcar "expliquei sem hesitar" no que voce meio que lembrou so faz o sistema parar de te
            mostrar justamente o que voce mais precisa ver.
          </div>
          <div className="grid grid-3" style={{ gap: 8 }}>
            {Object.entries(RESULTADOS).map(([id, r]) => (
              <button
                key={id}
                className="btn"
                style={{ borderColor: r.cor, color: r.cor, flexDirection: 'column', padding: '12px 8px', gap: 2 }}
                onClick={() => onResponder(item.chave, id)}
              >
                <span style={{ fontSize: 18 }}>{r.icone}</span>
                <span style={{ fontSize: 12.5 }}>{r.rotulo}</span>
                <span style={{ fontSize: 10.5, opacity: 0.7 }}>
                  {id === 'esqueci'
                    ? 'volta pra 1 dia'
                    : `volta em ${INTERVALOS[Math.min(NIVEL_MAXIMO, item.nivel + r.delta)]}d`}
                </span>
              </button>
            ))}
          </div>
          <div className="center" style={{ marginTop: 10 }}>
            <Link className="btn ghost sm" to={`/roadmap?trilha=${item.trilhaId}&modulo=${item.moduloId}`}>
              Abrir o material deste topico
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default function Revisao() {
  const { fila, estado, registrarRevisao, bloqueio } = useApp()
  const [indice, setIndice] = useState(0)
  const [feitasAgora, setFeitasAgora] = useState(0)

  const pendentes = fila.pendentes
  const atual = pendentes[Math.min(indice, pendentes.length - 1)]
  const stats = useMemo(() => estatisticasRevisao(estado.revisoes), [estado.revisoes])

  function responder(chave, resultado) {
    registrarRevisao(chave, resultado)
    setFeitasAgora((n) => n + 1)
    setIndice(0) // a fila encolhe sozinha; voltamos para o topo
  }

  return (
    <>
      <div className="page-head">
        <h1>Revisão</h1>
        <div className="sub">
          Você não esquece por falta de organização — esquece porque memória decai. A única coisa que achata essa
          curva é <b>recuperar a informação do zero</b>, com esforço, pouco antes de esquecer. Por isso aqui você
          explica primeiro e confere depois; ler de novo não funciona.
        </div>
      </div>

      {bloqueio && (
        <Callout tipo="danger" titulo="Conteúdo novo travado">
          {bloqueio.mensagem}
        </Callout>
      )}

      <div className="grid grid-4" style={{ margin: '16px 0' }}>
        <Stat
          label="Na fila hoje"
          value={pendentes.length}
          hint={`${fila.vencidas.length} atrasada(s)`}
          cor={fila.vencidas.length > 0 ? 'var(--danger)' : undefined}
        />
        <Stat label="Feitas agora" value={feitasAgora} hint="nesta sessão" />
        <Stat label="Em memória" value={stats.total} hint="tópicos agendados" />
        <Stat
          label="Taxa de acerto"
          value={stats.taxaAcerto === null ? '—' : `${stats.taxaAcerto}%`}
          hint="histórico"
          cor={stats.taxaAcerto === null ? undefined : stats.taxaAcerto >= 80 ? 'var(--ok)' : 'var(--warn)'}
        />
      </div>

      {pendentes.length === 0 ? (
        <>
          <Empty
            icone="✅"
            titulo="Nenhuma revisão pendente"
            texto={
              stats.total === 0
                ? 'Conclua tópicos no roadmap — cada um entra automaticamente na fila de revisão.'
                : 'Fila zerada. Agora sim você pode avançar em conteúdo novo com a consciência limpa.'
            }
          />
          {fila.futuras.length > 0 && (
            <div className="card">
              <div className="card-title" style={{ marginBottom: 12 }}>Próximas revisões</div>
              {fila.futuras.slice(0, 8).map((f) => (
                <div key={f.chave} className="spread small" style={{ padding: '6px 0' }}>
                  <span style={{ color: 'var(--text-2)' }}>{f.texto}</span>
                  <span className="muted" style={{ whiteSpace: 'nowrap' }}>
                    {f.proxima.split('-').reverse().join('/')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="spread small muted" style={{ marginBottom: 6 }}>
            <span>Fila de hoje</span>
            <span>{pendentes.length} restante(s)</span>
          </div>
          <Bar pct={(feitasAgora / (feitasAgora + pendentes.length)) * 100} thin />
          <div style={{ marginTop: 14 }}>
            <Cartao key={atual.chave} item={atual} onResponder={responder} />
          </div>
          {pendentes.length > 1 && (
            <div className="center">
              <button className="btn ghost sm" onClick={() => setIndice((i) => (i + 1) % pendentes.length)}>
                Pular este por enquanto →
              </button>
            </div>
          )}
        </>
      )}

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-title" style={{ marginBottom: 4 }}>Distribuição por nível de domínio</div>
        <div className="card-sub" style={{ marginBottom: 14 }}>
          Cada acerto empurra o tópico para o próximo intervalo: {INTERVALOS.join(' → ')} dias. Um "não lembrava"
          derruba para o começo.
        </div>
        {stats.porNivel.map((qtd, i) => (
          <div key={i} style={{ marginBottom: 9 }}>
            <div className="spread small" style={{ marginBottom: 3 }}>
              <span>
                Nível {i + 1} · revisa a cada {INTERVALOS[i]}d
              </span>
              <span className="muted">{qtd}</span>
            </div>
            <Bar
              pct={stats.total ? (qtd / stats.total) * 100 : 0}
              thin
              cor={i === 0 ? 'var(--danger)' : i >= NIVEL_MAXIMO - 1 ? 'var(--ok)' : 'var(--warn)'}
            />
          </div>
        ))}
      </div>
    </>
  )
}
