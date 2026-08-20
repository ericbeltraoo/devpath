import { useMemo, useState } from 'react'
import { analisar, GRAVIDADE } from '../lib/correcao'
import { CORRECOES } from '../data/exercicios/correcoes'
import { executarTestes, execucaoDisponivel } from '../lib/executor'
import { Callout } from './ui'

// ---------------------------------------------------------------------------
// Correcao em tres camadas, nesta ordem de proposito:
//
//   1. VOCE se avalia primeiro, sem ver nada
//   2. Analise estatica (gratis, offline) — erros mecanicos
//   3. Testes executados de verdade — comportamento
//
// A camada 1 existe para o resultado nao virar muleta. A diferenca entre o que
// voce achou que cumpriu e o que o checador encontrou e onde esta o aprendizado.
// ---------------------------------------------------------------------------

export default function CorrigirExercicio({ exercicio, idEx }) {
  const config = CORRECOES[idEx]
  const [codigo, setCodigo] = useState('')
  const [etapa, setEtapa] = useState('codigo') // codigo -> autoavaliacao -> resultado
  const [autoaval, setAutoaval] = useState({})
  const [estatica, setEstatica] = useState(null)
  const [execucao, setExecucao] = useState(null)
  const [rodando, setRodando] = useState(false)
  const [erroExec, setErroExec] = useState(null)

  const criterios = exercicio.criteriosAceite || []
  const todosRespondidos = criterios.every((_, i) => autoaval[i] !== undefined)

  const podeAnalisar = codigo.trim().length >= 20

  function analisarAgora() {
    const r = analisar(codigo, { ...exercicio, checagens: config?.checagens })
    setEstatica(r)
    setEtapa('resultado')
  }

  async function rodarTestes() {
    if (!config?.testes) return
    setRodando(true)
    setErroExec(null)
    try {
      setExecucao(await executarTestes(codigo, config.testes, config.imports))
    } catch (e) {
      setErroExec(e.message)
    } finally {
      setRodando(false)
    }
  }

  function recomecar() {
    setEtapa('codigo')
    setAutoaval({})
    setEstatica(null)
    setExecucao(null)
    setErroExec(null)
  }

  // Onde voce se enganou: disse que cumpriu, mas o checador discorda.
  const divergencias = useMemo(() => {
    if (!estatica || !execucao?.resumo) return []
    const falhou = execucao.testes?.filter((t) => !t.ok) || []
    return Object.entries(autoaval)
      .filter(([, v]) => v === true)
      .map(([i]) => criterios[Number(i)])
      .filter(Boolean)
      .slice(0, falhou.length > 0 ? undefined : 0)
  }, [estatica, execucao, autoaval, criterios])

  return (
    <div
      className="card"
      style={{ marginTop: 14, borderColor: 'rgba(79,142,247,.35)', background: 'rgba(79,142,247,.05)' }}
    >
      <div className="card-title">🔍 Corrigir</div>
      <div className="card-sub" style={{ marginBottom: 14 }}>
        Cole o código, avalie você mesmo, e só então veja o que o checador encontrou.
      </div>

      {config?.assinatura && (
        <>
          <div className="small" style={{ fontWeight: 640, marginBottom: 6 }}>
            Contrato esperado (para os testes conseguirem chamar seu código)
          </div>
          <pre
            className="mono"
            style={{
              background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
              padding: 12, overflowX: 'auto', fontSize: 12, lineHeight: 1.55, marginBottom: 14,
            }}
          >
            {config.assinatura}
          </pre>
        </>
      )}

      {/* ------------------------------------------------------ 1. codigo */}
      {etapa === 'codigo' && (
        <>
          <textarea
            className="mono"
            style={{ minHeight: 220, fontSize: 12.5, lineHeight: 1.5 }}
            placeholder="Cole aqui o seu código Java..."
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
          <div className="btn-row" style={{ marginTop: 12 }}>
            <button className="btn primary" disabled={!podeAnalisar} onClick={() => setEtapa('autoavaliacao')}>
              {podeAnalisar ? 'Continuar →' : 'Cole o código para continuar'}
            </button>
          </div>
        </>
      )}

      {/* ----------------------------------------------- 2. autoavaliacao */}
      {etapa === 'autoavaliacao' && (
        <>
          <Callout titulo="Antes de ver o resultado">
            Marque, para cada critério, se o seu código cumpre. Responda de cabeça, sem reabrir o código —
            a diferença entre o que você acha e o que é verdade é exatamente o que este exercício mede.
          </Callout>

          <div style={{ marginTop: 14 }}>
            {criterios.map((c, i) => (
              <div key={i} className="spread" style={{ padding: '9px 0', borderTop: i ? '1px solid var(--border-soft)' : 'none', gap: 12 }}>
                <span className="small" style={{ flex: 1 }}>{c}</span>
                <div className="btn-row" style={{ gap: 4, flexWrap: 'nowrap' }}>
                  <button
                    className={`btn sm${autoaval[i] === true ? ' primary' : ''}`}
                    onClick={() => setAutoaval((a) => ({ ...a, [i]: true }))}
                  >
                    Cumpre
                  </button>
                  <button
                    className={`btn sm${autoaval[i] === false ? ' danger' : ''}`}
                    onClick={() => setAutoaval((a) => ({ ...a, [i]: false }))}
                  >
                    Não
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="btn-row" style={{ marginTop: 14 }}>
            <button className="btn primary" disabled={!todosRespondidos} onClick={analisarAgora}>
              {todosRespondidos ? 'Ver o resultado' : 'Responda todos os critérios'}
            </button>
            <button className="btn ghost" onClick={() => setEtapa('codigo')}>← Voltar ao código</button>
          </div>
        </>
      )}

      {/* --------------------------------------------------- 3. resultado */}
      {etapa === 'resultado' && estatica && (
        <>
          <div className="small" style={{ fontWeight: 640, marginBottom: 8 }}>Análise estática</div>

          {estatica.achados.length === 0 ? (
            <Callout tipo="ok" titulo="Nenhum erro mecânico encontrado">
              Isso <b>não</b> quer dizer que o exercício está certo — quer dizer que não achei os erros que dá
              para detectar lendo o texto do código. Design e comportamento são as outras duas camadas.
            </Callout>
          ) : (
            estatica.achados.map((a) => (
              <div
                key={a.id}
                style={{
                  padding: '10px 12px', marginBottom: 6, borderRadius: 'var(--r-sm)',
                  background: 'var(--surface-2)', borderLeft: `3px solid ${GRAVIDADE[a.gravidade].cor}`,
                }}
              >
                <div className="spread" style={{ marginBottom: 3 }}>
                  <span className="small" style={{ fontWeight: 640 }}>{a.titulo}</span>
                  <span className="chip" style={{ borderColor: GRAVIDADE[a.gravidade].cor, color: GRAVIDADE[a.gravidade].cor }}>
                    {GRAVIDADE[a.gravidade].rotulo}
                  </span>
                </div>
                <div className="small muted">{a.porque}</div>
              </div>
            ))
          )}

          {estatica.metricas && (
            <div className="small muted" style={{ marginTop: 10 }}>
              {estatica.metricas.linhas} linhas
              {estatica.metricas.linhasMain != null && ` · main com ${estatica.metricas.linhasMain}`}
              {estatica.metricas.maiorMetodo && ` · maior método: ${estatica.metricas.maiorMetodo.nome} (${estatica.metricas.maiorMetodo.linhas})`}
            </div>
          )}

          {/* --------------------------------------------- testes reais */}
          <div className="sep" />
          <div className="small" style={{ fontWeight: 640, marginBottom: 8 }}>Testes executados</div>

          {!config?.testes ? (
            <Callout tipo="warn" titulo="Este exercício não tem testes automáticos">
              Os critérios dele são de design — "regra no lugar certo", "adicionar um tipo novo não exige mudar
              o existente". Isso não é verificável por teste. Escreva os testes você mesmo no seu projeto, ou
              me traga o código para revisão.
            </Callout>
          ) : !execucaoDisponivel ? (
            <Callout tipo="warn" titulo="Execução indisponível em modo local">
              Os testes rodam pela API do sistema. No modo local (sem servidor) só a análise estática funciona.
            </Callout>
          ) : (
            <>
              {!execucao && !erroExec && (
                <button className="btn primary" onClick={rodarTestes} disabled={rodando}>
                  {rodando ? 'Compilando e executando...' : '▶ Rodar os testes'}
                </button>
              )}

              {erroExec && <Callout tipo="danger" titulo="Não foi possível executar">{erroExec}</Callout>}

              {execucao && !execucao.compilou && (
                <>
                  <Callout tipo="danger" titulo="Não compilou">
                    Antes de qualquer teste, o código precisa compilar. Leia a primeira linha do erro — ela
                    costuma bastar.
                  </Callout>
                  <pre
                    className="mono"
                    style={{
                      background: 'var(--bg-2)', border: '1px solid rgba(239,68,68,.3)',
                      borderRadius: 'var(--r-sm)', padding: 12, overflowX: 'auto',
                      fontSize: 11.5, marginTop: 8, maxHeight: 220,
                    }}
                  >
                    {execucao.erroCompilacao}
                  </pre>
                </>
              )}

              {execucao?.compilou && (
                <>
                  {execucao.erroGeral && (
                    <Callout tipo="danger" titulo="Exceção durante os testes">{execucao.erroGeral}</Callout>
                  )}
                  {execucao.testes?.map((t, i) => (
                    <div key={i} className="spread small" style={{ padding: '6px 0', borderTop: i ? '1px solid var(--border-soft)' : 'none' }}>
                      <span style={{ color: t.ok ? 'var(--ok)' : 'var(--danger)' }}>
                        {t.ok ? '✓' : '✕'} {t.nome}
                      </span>
                      {t.detalhe && <span className="muted mono" style={{ fontSize: 11 }}>{t.detalhe}</span>}
                    </div>
                  ))}
                  {execucao.resumo && (
                    <div
                      className="small"
                      style={{
                        marginTop: 10, fontWeight: 650,
                        color: execucao.resumo.falhou === 0 ? 'var(--ok)' : 'var(--danger)',
                      }}
                    >
                      {execucao.resumo.passou} passaram · {execucao.resumo.falhou} falharam
                      {execucao.restantes != null && (
                        <span className="muted" style={{ fontWeight: 400 }}> · {execucao.restantes} execuções restantes nesta hora</span>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ------------------------------------------ o que sobra pra voce */}
          <div className="sep" />
          <Callout tipo="warn" titulo="O que nenhum checador vê">
            Design. Se a regra está na camada certa, se adicionar um tipo novo exige mexer no que já funciona,
            se os nomes revelam a intenção. Passar nos testes com código ruim é possível — e é exatamente o que
            reprova no code review de uma vaga.
          </Callout>

          <div className="btn-row" style={{ marginTop: 14 }}>
            <button className="btn ghost" onClick={recomecar}>Corrigir de novo</button>
          </div>
        </>
      )}
    </div>
  )
}
