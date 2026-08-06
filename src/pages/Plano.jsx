import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { formatarData, OBJETIVOS } from '../lib/planner'
import { Bar, Stat, Callout, ChipCurso } from '../components/ui'

export default function Plano() {
  const { plano, estado, setPerfil } = useApp()

  return (
    <>
      <div className="page-head">
        <h1>Meu plano</h1>
        <div className="sub">
          O roteiro completo na ordem pedagogica correta — nao na ordem das trilhas. Banco de dados vem antes de
          Spring, algoritmo vem antes de framework, deploy vem no fim. O calculo de prazo usa o seu ritmo e desconta
          o que voce ja marcou como concluido.
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <Stat label="Objetivo" value={plano.objetivo.icone} hint={plano.objetivo.nome} />
        <Stat label="Restante" value={`${Math.round(plano.horasRestantes)}h`} hint={`de ${Math.round(plano.horasTotal)}h totais`} />
        <Stat label="Duracao" value={`${plano.semanas} sem`} hint={`~${plano.meses} meses a ${plano.horasSemana}h/sem`} />
        <Stat label="Previsao" value={formatarData(plano.dataConclusao).slice(0, 5)} hint={formatarData(plano.dataConclusao)} />
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row" style={{ gap: 16 }}>
          <div className="field" style={{ marginBottom: 0, flex: 1, minWidth: 210 }}>
            <label>Objetivo</label>
            <select value={estado.perfil.objetivo} onChange={(e) => setPerfil({ objetivo: e.target.value })}>
              {Object.entries(OBJETIVOS).map(([id, o]) => (
                <option key={id} value={id}>
                  {o.icone} {o.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0, width: 150 }}>
            <label>Horas por semana</label>
            <input
              type="number"
              min="1"
              max="60"
              value={estado.perfil.horasSemana}
              onChange={(e) => setPerfil({ horasSemana: Number(e.target.value) })}
            />
          </div>
          <div className="field" style={{ marginBottom: 0, width: 170 }}>
            <label>Inicio</label>
            <input
              type="date"
              value={estado.perfil.dataInicio}
              onChange={(e) => setPerfil({ dataInicio: e.target.value })}
            />
          </div>
        </div>
        <div className="small muted" style={{ marginTop: 10 }}>
          Mudou algo aqui? O cronograma inteiro recalcula na hora.
        </div>
      </div>

      <Callout titulo="Como ler este cronograma">
        As datas sao uma projecao a partir do seu ritmo, nao um prazo rigido. Se atrasar uma semana, nao refaca o
        plano — apenas continue. O que quebra o progresso e parar, nao atrasar.
      </Callout>

      <div style={{ marginTop: 18 }}>
        {plano.blocos.map((b, i) => {
          const primeiraPendente = plano.blocos.findIndex((x) => !x.concluida) === i
          return (
            <div
              key={b.faseId}
              className="card"
              style={{
                marginBottom: 12,
                opacity: b.concluida ? 0.62 : 1,
                borderColor: primeiraPendente ? 'var(--accent)' : 'var(--border-soft)',
              }}
            >
              <div className="spread" style={{ marginBottom: 12 }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div className="row" style={{ gap: 8, marginBottom: 3 }}>
                    <span className="chip" style={{ borderColor: b.trilha.cor, color: b.trilha.cor }}>
                      {b.trilha.icone} {b.trilha.nome}
                    </span>
                    {b.concluida && <span className="chip ok">✓ concluida</span>}
                    {primeiraPendente && <span className="chip info">voce esta aqui</span>}
                  </div>
                  <h3>
                    {i + 1}. {b.fase.nome}
                  </h3>
                  <div className="small muted">{b.fase.objetivo}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {!b.concluida && (
                    <>
                      <div style={{ fontWeight: 700 }}>
                        Semana {b.semanaInicio}
                        {b.semanaFim !== b.semanaInicio ? `–${b.semanaFim}` : ''}
                      </div>
                      <div className="small muted">
                        {formatarData(b.dataInicio)} → {formatarData(b.dataFim)}
                      </div>
                    </>
                  )}
                  <div className="small muted">{Math.round(b.horasRestantes)}h restantes</div>
                </div>
              </div>

              <Bar pct={b.pct} cor={b.trilha.cor} thin />

              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {b.modulos.map((m) => (
                  <div key={m.id} className="spread small" style={{ gap: 10 }}>
                    <span style={{ color: m.progresso.pct === 100 ? 'var(--text-3)' : 'var(--text-2)' }}>
                      {m.progresso.pct === 100 ? '✓' : '○'} {m.titulo}
                      {m.curso && (
                        <span style={{ marginLeft: 8 }}>
                          <ChipCurso curso={m.curso} compacto />
                        </span>
                      )}
                      {m.marcoAtual && <span className="chip warn" style={{ marginLeft: 8 }}>seu ponto no curso</span>}
                    </span>
                    <span className="muted" style={{ whiteSpace: 'nowrap' }}>
                      {m.progresso.feitos}/{m.progresso.total} · {m.horas}h
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 12 }}>
                <Link className="btn sm" to={`/roadmap?trilha=${b.trilha.id}&fase=${b.faseId}`}>
                  Abrir no roadmap →
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
