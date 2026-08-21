import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { decorrido, relogio, duracaoCurta, minutosEstimados, normalizarRegistro } from '../lib/cronometro'

/**
 * Cronometro de um exercicio. O mesmo componente serve o Roadmap e a aba
 * Exercicios — duas telas com dois cronometros diferentes acabariam
 * discordando sobre o mesmo exercicio.
 *
 * O tempo nao vive aqui: o estado guarda { ms, iniciadoEm } e este componente
 * so redesenha. Por isso trocar de aba, recarregar a pagina ou abrir o mesmo
 * exercicio nas duas telas continua mostrando o mesmo numero.
 */
export default function CronometroExercicio({ id, estimativa }) {
  const { estado, iniciarCronometro, pausarCronometro, concluirCronometro, zerarCronometro } = useApp()
  const registro = normalizarRegistro(estado.exercicios[id])
  const rodando = !!registro?.iniciadoEm

  // Redesenho local so enquanto anda. O valor exibido vem sempre do relogio,
  // nunca de um contador acumulado aqui — o tick pode atrasar, a conta nao.
  const [, redesenhar] = useState(0)
  useEffect(() => {
    if (!rodando) return
    const t = setInterval(() => redesenhar((n) => n + 1), 500)
    return () => clearInterval(t)
  }, [rodando])

  const ms = decorrido(registro)
  const feito = registro?.status === 'feito'
  const temTempo = ms > 0

  const estimado = minutosEstimados(estimativa)
  const gastoMin = ms / 60000
  const estourou = estimado != null && gastoMin > estimado * 1.5

  return (
    <div
      style={{
        marginTop: 14,
        padding: 12,
        borderRadius: 'var(--r-sm)',
        border: `1px solid ${rodando ? 'var(--accent)' : 'var(--border-soft)'}`,
        background: rodando ? 'rgba(99,102,241,.07)' : 'var(--surface-2)',
      }}
    >
      <div className="spread" style={{ gap: 12, flexWrap: 'wrap' }}>
        <div className="row" style={{ gap: 10, alignItems: 'baseline' }}>
          <span
            style={{
              fontSize: 26,
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em',
              color: rodando ? 'var(--accent)' : temTempo ? 'var(--text)' : 'var(--text-3)',
            }}
          >
            {relogio(ms)}
          </span>
          <span className="small muted">
            {rodando ? 'contando' : temTempo ? (feito ? 'tempo final' : 'pausado') : 'nao iniciado'}
          </span>
        </div>

        <div className="btn-row" style={{ margin: 0 }}>
          {rodando ? (
            <button className="btn sm" onClick={() => pausarCronometro(id)}>⏸ Pausar</button>
          ) : (
            <button className="btn sm primary" onClick={() => iniciarCronometro(id)}>
              {temTempo ? '▶ Retomar' : '▶ Iniciar'}
            </button>
          )}
          {(rodando || temTempo) && !feito && (
            <button className="btn sm" onClick={() => concluirCronometro(id)}>⏹ Parar e concluir</button>
          )}
          {temTempo && (
            <button
              className="btn sm ghost"
              title="Apaga o tempo registrado deste exercicio"
              onClick={() => zerarCronometro(id)}
            >
              ↺ Zerar
            </button>
          )}
        </div>
      </div>

      {feito && temTempo && (
        <div className="small" style={{ marginTop: 9, color: estourou ? 'var(--warn)' : 'var(--text-2)' }}>
          Voce levou <b>{duracaoCurta(ms)}</b>
          {estimado != null && ` · estimativa: ${duracaoCurta(estimado * 60000)}`}
          {estourou && ' — bem acima do previsto. Isso costuma ser buraco de base, nao lentidao.'}
        </div>
      )}

      {!feito && (
        <div className="small muted" style={{ marginTop: 9 }}>
          O tempo fica salvo ao pausar e ao concluir, e acompanha voce em qualquer dispositivo.
        </div>
      )}
    </div>
  )
}
