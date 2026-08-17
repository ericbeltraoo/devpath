import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useApp } from './AppContext'
import { tocarAlarme, notificar, mmss, liberarAudio } from '../lib/pomodoro'

const Ctx = createContext(null)

export const FASES = {
  foco: { rotulo: 'Foco', cor: 'var(--accent)', campo: 'foco' },
  pausaCurta: { rotulo: 'Pausa curta', cor: 'var(--ok)', campo: 'pausaCurta' },
  pausaLonga: { rotulo: 'Pausa longa', cor: 'var(--purple)', campo: 'pausaLonga' },
}

export function PomodoroProvider({ children }) {
  const { estado, registrarSessaoPomodoro } = useApp()
  const config = estado.pomodoro.config

  const [fase, setFase] = useState('foco')
  const [rodando, setRodando] = useState(false)
  const [restante, setRestante] = useState(config.foco * 60)
  const [ciclo, setCiclo] = useState(1)
  const [moduloFoco, setModuloFoco] = useState(null)

  // Guardamos o INSTANTE do fim, nao um contador decrescente. Um setInterval
  // de 1s acumula erro e a aba em segundo plano tem o timer estrangulado pelo
  // navegador — calcular a partir do relogio elimina os dois problemas.
  const fimEm = useRef(null)
  const tick = useRef(null)
  const configRef = useRef(config)
  configRef.current = config

  const duracaoDaFase = useCallback(
    (qual) => (configRef.current[FASES[qual].campo] || 1) * 60,
    []
  )

  // Se o tempo da fase atual mudar nas configuracoes com o timer parado,
  // o mostrador acompanha em vez de ficar exibindo o valor antigo.
  useEffect(() => {
    if (!rodando) setRestante(duracaoDaFase(fase))
  }, [config.foco, config.pausaCurta, config.pausaLonga, fase, rodando, duracaoDaFase])

  const proximaFase = useCallback(
    (faseAtual, cicloAtual) => {
      if (faseAtual !== 'foco') return { fase: 'foco', ciclo: faseAtual === 'pausaLonga' ? 1 : cicloAtual }
      const ate = configRef.current.ciclosAteLonga || 4
      if (cicloAtual >= ate) return { fase: 'pausaLonga', ciclo: cicloAtual }
      return { fase: 'pausaCurta', ciclo: cicloAtual }
    },
    []
  )

  const concluirFase = useCallback(() => {
    const c = configRef.current
    const minutos = duracaoDaFase(fase) / 60

    if (fase === 'foco') {
      registrarSessaoPomodoro({
        fim: new Date().toISOString(),
        minutos,
        tipo: 'foco',
        moduloId: moduloFoco || null,
      })
    }

    if (c.som) tocarAlarme(fase === 'foco' ? 'foco' : 'pausa', c.volume)
    if (c.notificacao) {
      notificar(
        fase === 'foco' ? 'Fim do bloco de foco' : 'Fim da pausa',
        fase === 'foco'
          ? `${minutos} minutos concluidos. Levante, beba agua, olhe pra longe.`
          : 'Hora de voltar. Abra o material antes de abrir qualquer outra aba.'
      )
    }

    const prox = proximaFase(fase, ciclo)
    const novoCiclo = fase === 'foco' ? ciclo : prox.fase === 'foco' ? Math.min(ciclo + 1, 99) : ciclo

    setFase(prox.fase)
    setCiclo(prox.fase === 'foco' && fase !== 'foco' ? (ciclo >= (c.ciclosAteLonga || 4) ? 1 : ciclo + 1) : novoCiclo)

    const dur = (c[FASES[prox.fase].campo] || 1) * 60
    setRestante(dur)

    if (c.autoIniciar) {
      fimEm.current = Date.now() + dur * 1000
      setRodando(true)
    } else {
      fimEm.current = null
      setRodando(false)
    }
  }, [fase, ciclo, moduloFoco, duracaoDaFase, proximaFase, registrarSessaoPomodoro])

  // Relogio
  useEffect(() => {
    if (!rodando) {
      clearInterval(tick.current)
      return
    }
    if (fimEm.current == null) fimEm.current = Date.now() + restante * 1000

    tick.current = setInterval(() => {
      const falta = Math.round((fimEm.current - Date.now()) / 1000)
      if (falta <= 0) {
        clearInterval(tick.current)
        setRestante(0)
        concluirFase()
      } else {
        setRestante(falta)
      }
    }, 250)

    return () => clearInterval(tick.current)
  }, [rodando, concluirFase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Contagem no titulo da aba, para você ver o tempo sem trocar de janela
  useEffect(() => {
    const base = 'DevPath — Trilha até Engenheiro de Software Júnior'
    document.title = rodando ? `${mmss(restante)} · ${FASES[fase].rotulo} — DevPath` : base
    return () => {
      document.title = base
    }
  }, [rodando, restante, fase])

  const iniciar = useCallback(() => {
    liberarAudio() // precisa acontecer dentro de um gesto do usuario
    fimEm.current = Date.now() + restante * 1000
    setRodando(true)
  }, [restante])

  const pausar = useCallback(() => {
    setRodando(false)
    fimEm.current = null
  }, [])

  const zerar = useCallback(() => {
    setRodando(false)
    fimEm.current = null
    setRestante(duracaoDaFase(fase))
  }, [fase, duracaoDaFase])

  const pular = useCallback(() => {
    setRodando(false)
    fimEm.current = null
    const prox = proximaFase(fase, ciclo)
    setFase(prox.fase)
    setRestante(duracaoDaFase(prox.fase))
  }, [fase, ciclo, proximaFase, duracaoDaFase])

  const trocarFase = useCallback(
    (nova) => {
      setRodando(false)
      fimEm.current = null
      setFase(nova)
      setRestante(duracaoDaFase(nova))
    },
    [duracaoDaFase]
  )

  const total = duracaoDaFase(fase)
  const progresso = total === 0 ? 0 : ((total - restante) / total) * 100

  const valor = useMemo(
    () => ({
      fase, rodando, restante, ciclo, progresso, total,
      moduloFoco, setModuloFoco,
      iniciar, pausar, zerar, pular, trocarFase,
      config,
    }),
    [fase, rodando, restante, ciclo, progresso, total, moduloFoco, iniciar, pausar, zerar, pular, trocarFase, config]
  )

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function usePomodoro() {
  const c = useContext(Ctx)
  if (!c) throw new Error('usePomodoro precisa estar dentro de <PomodoroProvider>')
  return c
}
