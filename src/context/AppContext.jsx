import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { carregar, salvar, normalizar, temProgresso, ESTADO_INICIAL } from '../lib/storage'
import { gerarPlano } from '../lib/planner'
import { agendarPrimeira, reagendar, filaDeRevisao, avaliarBloqueio } from '../lib/revisao'
import { aplicarSincronizacao } from '../lib/sincronizarCurso'
import { TRILHAS, todosModulos } from '../data/tracks'
import { normalizarRegistro, bancar, decorrido, REGISTRO_VAZIO, INTERVALO_BANCO } from '../lib/cronometro'
import {
  nuvemAtiva, carregarNuvem, salvarNuvem, renovarSessao,
  sair as sairDaApi, definirCallbackDeslogar,
} from '../lib/api'

const Ctx = createContext(null)

const ATRASO_SALVAR = 1200 // ms de espera antes de mandar para a nuvem
const MAX_TENTATIVAS = 5 // reenvios com espera exponencial antes de desistir

export function AppProvider({ children }) {
  const [estado, setEstado] = useState(carregar)

  // ---------------------------------------------------------------- sessao
  const [sessao, setSessao] = useState(null)
  const [authPronta, setAuthPronta] = useState(!nuvemAtiva)
  const [dadosProntos, setDadosProntos] = useState(!nuvemAtiva)
  const [sincronia, setSincronia] = useState(nuvemAtiva ? 'carregando' : 'local')
  const [erroSync, setErroSync] = useState(null)
  const [ultimoSync, setUltimoSync] = useState(null)

  const usuarioCarregado = useRef(null)
  const pularSalvamento = useRef(false)
  const timer = useRef(null)

  const userId = sessao?.user?.id ?? null

  // Restaura a sessao no carregamento. O refresh token vive num cookie
  // httpOnly, entao o JavaScript nao le nada — so pede a renovacao e recebe
  // um access token novo se o cookie ainda for valido.
  useEffect(() => {
    if (!nuvemAtiva) return
    let vivo = true

    definirCallbackDeslogar(() => {
      setSessao(null)
      setDadosProntos(false)
    })

    renovarSessao().then((usuario) => {
      if (!vivo) return
      setSessao(usuario ? { user: usuario } : null)
      setAuthPronta(true)
    })

    // Renova antes do access token de 15 min expirar, para nao interromper
    // o uso no meio de uma sessao longa de estudo.
    const timer = setInterval(() => {
      renovarSessao().then((u) => {
        if (vivo && u) setSessao({ user: u })
      })
    }, 12 * 60 * 1000)

    return () => {
      vivo = false
      clearInterval(timer)
    }
  }, [])

  // Carrega o progresso da nuvem quando o usuario entra
  useEffect(() => {
    if (!nuvemAtiva) return

    if (!userId) {
      usuarioCarregado.current = null
      setDadosProntos(false)
      setSincronia('carregando')
      return
    }

    if (usuarioCarregado.current === userId) return
    usuarioCarregado.current = userId

    let vivo = true
    setSincronia('carregando')
    setErroSync(null)

    ;(async () => {
      try {
        const nuvem = await carregarNuvem()
        if (!vivo) return

        const local = carregar()

        if (nuvem && temProgresso(nuvem.dados)) {
          // A nuvem e a fonte da verdade.
          pularSalvamento.current = true
          setEstado(normalizar(nuvem.dados))
          setUltimoSync(nuvem.atualizadoEm)
          setSincronia('ok')
        } else if (temProgresso(local)) {
          // Primeira vez nesta conta e ha progresso neste navegador: migra.
          setEstado(local)
          await salvarNuvem(local)
          if (!vivo) return
          setUltimoSync(new Date().toISOString())
          setSincronia('migrado')
        } else {
          // Conta nova e navegador limpo.
          pularSalvamento.current = true
          setEstado({ ...ESTADO_INICIAL, perfil: { ...ESTADO_INICIAL.perfil } })
          setSincronia('ok')
        }

        if (vivo) setDadosProntos(true)
      } catch (e) {
        if (!vivo) return
        console.error('Falha ao carregar da nuvem:', e)
        setErroSync(e.message || 'Falha ao carregar')
        setSincronia('erro')
        setDadosProntos(true) // deixa usar offline com o cache local
      }
    })()

    return () => {
      vivo = false
    }
  }, [userId])

  // Salva: sempre no localStorage (cache/backup) e, com atraso, na nuvem
  useEffect(() => {
    salvar(estado)

    if (!nuvemAtiva || !userId || !dadosProntos) return

    if (pularSalvamento.current) {
      pularSalvamento.current = false
      return
    }

    setSincronia('salvando')
    clearTimeout(timer.current)

    // Tenta gravar; se falhar (rede caiu, limite de taxa, servidor fora),
    // reagenda com espera exponencial em vez de desistir na primeira.
    const tentar = async (tentativa) => {
      try {
        await salvarNuvem(estado)
        setUltimoSync(new Date().toISOString())
        setSincronia('ok')
        setErroSync(null)
      } catch (e) {
        if (tentativa >= MAX_TENTATIVAS) {
          console.error('Falha ao salvar na nuvem:', e)
          setErroSync(e.message || 'Falha ao salvar')
          setSincronia('erro')
          return
        }
        const espera = Math.min(2 ** tentativa * 1000, 30000)
        setSincronia('reenviando')
        timer.current = setTimeout(() => tentar(tentativa + 1), espera)
      }
    }

    timer.current = setTimeout(() => tentar(0), ATRASO_SALVAR)

    return () => clearTimeout(timer.current)
  }, [estado, userId, dadosProntos])

  // ------------------------------------------------------------- comandos

  const sincronizarAgora = useCallback(async () => {
    if (!nuvemAtiva || !userId) return
    setSincronia('salvando')
    try {
      await salvarNuvem(estado)
      setUltimoSync(new Date().toISOString())
      setSincronia('ok')
      setErroSync(null)
    } catch (e) {
      setErroSync(e.message)
      setSincronia('erro')
    }
  }, [estado, userId])

  const baixarDaNuvem = useCallback(async () => {
    if (!nuvemAtiva || !userId) return
    setSincronia('carregando')
    try {
      const nuvem = await carregarNuvem()
      if (nuvem) {
        pularSalvamento.current = true
        setEstado(normalizar(nuvem.dados))
        setUltimoSync(nuvem.atualizadoEm)
      }
      setSincronia('ok')
    } catch (e) {
      setErroSync(e.message)
      setSincronia('erro')
    }
  }, [userId])

  const sair = useCallback(async () => {
    if (!nuvemAtiva) return
    clearTimeout(timer.current)
    try {
      await salvarNuvem(estado)
    } catch {
      /* se falhar, o cache local ainda tem tudo */
    }
    await sairDaApi()
    setSessao(null)
    usuarioCarregado.current = null
    setEstado({ ...ESTADO_INICIAL, perfil: { ...ESTADO_INICIAL.perfil } })
    setDadosProntos(false)
  }, [estado, userId])

  const api = useMemo(() => {
    return {
      estado,
      setEstado,

      setPerfil: (parcial) => setEstado((e) => ({ ...e, perfil: { ...e.perfil, ...parcial } })),

      concluirOnboarding: () => setEstado((e) => ({ ...e, onboarded: true })),

      // Concluir um topico agenda automaticamente a primeira revisao.
      // Desmarcar remove o agendamento — nao faz sentido revisar o que voce
      // declarou que nao aprendeu.
      toggleTopico: (moduloId, indice) =>
        setEstado((e) => {
          const chave = `${moduloId}:${indice}`
          const topicos = { ...e.topicos }
          const revisoes = { ...e.revisoes }

          if (topicos[chave]) {
            delete topicos[chave]
            delete revisoes[chave]
          } else {
            topicos[chave] = new Date().toISOString()
            if (!revisoes[chave]) revisoes[chave] = agendarPrimeira()
          }
          return { ...e, topicos, revisoes }
        }),

      marcarModulo: (modulo, valor) =>
        setEstado((e) => {
          const topicos = { ...e.topicos }
          const revisoes = { ...e.revisoes }
          modulo.topicos.forEach((_, i) => {
            const chave = `${modulo.id}:${i}`
            if (valor) {
              topicos[chave] = new Date().toISOString()
              if (!revisoes[chave]) revisoes[chave] = agendarPrimeira()
            } else {
              delete topicos[chave]
              delete revisoes[chave]
            }
          })
          return { ...e, topicos, revisoes }
        }),

      registrarRevisao: (chave, resultado) =>
        setEstado((e) => ({
          ...e,
          revisoes: { ...e.revisoes, [chave]: reagendar(e.revisoes[chave], resultado) },
        })),

      // Marca de uma vez tudo que vem antes da aula atual do curso, com as
      // revisoes escalonadas para nao travar o roadmap no dia seguinte.
      sincronizarComCurso: (plano) =>
        setEstado((e) => {
          const { topicos, revisoes } = aplicarSincronizacao(plano, e.topicos, e.revisoes)
          return { ...e, topicos, revisoes, cursoSincronizado: { secao: plano.secao, aula: plano.aula, em: new Date().toISOString() } }
        }),

      setCronograma: (parcial) =>
        setEstado((e) => ({ ...e, cronograma: { ...e.cronograma, ...parcial } })),

      addBloco: (bloco) =>
        setEstado((e) => ({
          ...e,
          cronograma: {
            ...e.cronograma,
            blocos: [...e.cronograma.blocos, { ...bloco, id: 'bl-' + Math.random().toString(36).slice(2, 9) }],
          },
        })),

      updBloco: (bloco) =>
        setEstado((e) => ({
          ...e,
          cronograma: {
            ...e.cronograma,
            blocos: bloco.id
              ? e.cronograma.blocos.map((b) => (b.id === bloco.id ? { ...b, ...bloco } : b))
              : [...e.cronograma.blocos, { ...bloco, id: 'bl-' + Math.random().toString(36).slice(2, 9) }],
          },
        })),

      delBloco: (id) =>
        setEstado((e) => ({
          ...e,
          cronograma: { ...e.cronograma, blocos: e.cronograma.blocos.filter((b) => b.id !== id) },
        })),

      setBloqueio: (parcial) =>
        setEstado((e) => ({ ...e, bloqueio: { ...e.bloqueio, ...parcial } })),

      setPomodoroConfig: (parcial) =>
        setEstado((e) => ({
          ...e,
          pomodoro: { ...e.pomodoro, config: { ...e.pomodoro.config, ...parcial } },
        })),

      registrarSessaoPomodoro: (sessao) =>
        setEstado((e) => ({
          ...e,
          pomodoro: { ...e.pomodoro, sessoes: [...e.pomodoro.sessoes, sessao].slice(-400) },
        })),

      setDesafio: (id, parcial) =>
        setEstado((e) => {
          const desafios = { ...e.desafios }
          if (parcial === null) delete desafios[id]
          else desafios[id] = { ...(desafios[id] || {}), ...parcial }
          return { ...e, desafios }
        }),

      setNota: (moduloId, texto) => setEstado((e) => ({ ...e, notas: { ...e.notas, [moduloId]: texto } })),

      // Mudar o status NAO mexe no tempo cronometrado: desmarcar "resolvido"
      // por engano nao pode apagar quanto voce levou. So `zerarCronometro`
      // apaga tempo, e ele existe exatamente para isso.
      setExercicio: (id, status) =>
        setEstado((e) => {
          const exercicios = { ...e.exercicios }
          const r = normalizarRegistro(exercicios[id]) || { ...REGISTRO_VAZIO }
          const atualizado = {
            ...bancar(r), // sair de "fazendo" com o cronometro ligado consolida o tempo
            status: status || null,
            concluidoEm: status === 'feito' ? new Date().toISOString() : null,
          }
          if (!atualizado.status && atualizado.ms === 0) delete exercicios[id]
          else exercicios[id] = atualizado
          return { ...e, exercicios }
        }),

      // Um cronometro por vez. Dois exercicios contando junto produziriam
      // numeros que voce nao gastou de verdade.
      iniciarCronometro: (id) =>
        setEstado((e) => {
          const agora = Date.now()
          const exercicios = {}
          for (const [k, v] of Object.entries(e.exercicios)) {
            const r = normalizarRegistro(v)
            exercicios[k] = k === id ? r : bancar(r, agora)
          }
          const alvo = normalizarRegistro(exercicios[id]) || { ...REGISTRO_VAZIO }
          exercicios[id] = {
            ...alvo,
            status: alvo.status === 'feito' ? 'feito' : 'fazendo',
            iniciadoEm: alvo.iniciadoEm || agora,
          }
          return { ...e, exercicios }
        }),

      pausarCronometro: (id) =>
        setEstado((e) => {
          const r = normalizarRegistro(e.exercicios[id])
          if (!r?.iniciadoEm) return e
          return { ...e, exercicios: { ...e.exercicios, [id]: bancar(r) } }
        }),

      // Parar = consolidar o tempo e marcar como resolvido, gravando a data.
      concluirCronometro: (id) =>
        setEstado((e) => {
          const r = normalizarRegistro(e.exercicios[id]) || { ...REGISTRO_VAZIO }
          return {
            ...e,
            exercicios: {
              ...e.exercicios,
              [id]: { ...bancar(r), status: 'feito', concluidoEm: new Date().toISOString() },
            },
          }
        }),

      // Destranca a solucao comentada. Fica gravado: e um compromisso com
      // voce mesmo, nao um clique qualquer.
      marcarTentou: (id) =>
        setEstado((e) => {
          const r = normalizarRegistro(e.exercicios[id]) || { ...REGISTRO_VAZIO }
          if (r.tentouEm) return e
          return {
            ...e,
            exercicios: {
              ...e.exercicios,
              [id]: { ...r, status: r.status || 'fazendo', tentouEm: new Date().toISOString() },
            },
          }
        }),

      zerarCronometro: (id) =>
        setEstado((e) => {
          const r = normalizarRegistro(e.exercicios[id])
          if (!r) return e
          const exercicios = { ...e.exercicios }
          if (!r.status) delete exercicios[id]
          else exercicios[id] = { ...r, ms: 0, iniciadoEm: null }
          return { ...e, exercicios }
        }),

      toggleChecklist: (id) =>
        setEstado((e) => {
          const checklist = { ...e.checklist }
          if (checklist[id]) delete checklist[id]
          else checklist[id] = true
          return { ...e, checklist }
        }),

      toggleEntrevista: (id) =>
        setEstado((e) => {
          const entrevistas = { ...e.entrevistas }
          if (entrevistas[id]) delete entrevistas[id]
          else entrevistas[id] = true
          return { ...e, entrevistas }
        }),

      setLinkedinResposta: (criterioId, valor) =>
        setEstado((e) => ({
          ...e,
          linkedin: { ...e.linkedin, respostas: { ...e.linkedin.respostas, [criterioId]: valor } },
        })),

      registrarNotaLinkedin: (nota) =>
        setEstado((e) => ({
          ...e,
          linkedin: {
            ...e.linkedin,
            historico: [
              ...e.linkedin.historico.filter((h) => h.data !== new Date().toISOString().slice(0, 10)),
              { data: new Date().toISOString().slice(0, 10), nota },
            ].slice(-30),
          },
        })),

      resetar: () => setEstado({ ...ESTADO_INICIAL, perfil: { ...ESTADO_INICIAL.perfil } }),
    }
  }, [estado])

  // Consolida periodicamente o cronometro de exercicio que estiver rodando.
  //
  // Sem isto, fechar a aba no meio de um exercicio deixaria `iniciadoEm`
  // pendurado, e o app so descobriria o abandono na proxima abertura — sem
  // saber quando voce parou de verdade. Consolidando de minuto em minuto, o
  // pior caso perde 1 minuto de tempo real em vez de inventar uma noite
  // inteira. Tambem serve de rede: se o navegador fechar, o tempo ja foi.
  const temCronometro = Object.values(estado.exercicios).some((r) => r?.iniciadoEm)

  useEffect(() => {
    if (!temCronometro) return

    const consolidar = () =>
      setEstado((e) => {
        const agora = Date.now()
        let mudou = false
        const exercicios = { ...e.exercicios }
        for (const [k, v] of Object.entries(exercicios)) {
          if (!v?.iniciadoEm) continue
          exercicios[k] = { ...v, ms: decorrido(v, agora), iniciadoEm: agora }
          mudou = true
        }
        return mudou ? { ...e, exercicios } : e
      })

    const t = setInterval(consolidar, INTERVALO_BANCO)
    const aoEsconder = () => document.visibilityState === 'hidden' && consolidar()
    document.addEventListener('visibilitychange', aoEsconder)

    return () => {
      clearInterval(t)
      document.removeEventListener('visibilitychange', aoEsconder)
    }
  }, [temCronometro])

  const plano = useMemo(() => gerarPlano(estado.perfil, estado.topicos), [estado.perfil, estado.topicos])

  // Indice "moduloId:indice" -> contexto do topico, para a tela de revisao
  const indiceTopicos = useMemo(() => {
    const mapa = {}
    for (const trilha of TRILHAS) {
      for (const m of todosModulos(trilha)) {
        m.topicos.forEach((texto, i) => {
          mapa[`${m.id}:${i}`] = {
            texto,
            moduloId: m.id,
            moduloTitulo: m.titulo,
            faseNome: m.faseNome,
            trilhaId: trilha.id,
            trilhaNome: trilha.nome,
            trilhaIcone: trilha.icone,
            trilhaCor: trilha.cor,
          }
        })
      }
    }
    return mapa
  }, [])

  const fila = useMemo(() => filaDeRevisao(estado.revisoes, indiceTopicos), [estado.revisoes, indiceTopicos])
  const bloqueio = useMemo(() => avaliarBloqueio(fila, estado.bloqueio), [fila, estado.bloqueio])

  const valor = {
    ...api,
    plano,
    fila,
    bloqueio,
    indiceTopicos,
    // nuvem
    nuvemAtiva,
    sessao,
    usuario: sessao?.user ?? null,
    authPronta,
    dadosProntos,
    sincronia,
    erroSync,
    ultimoSync,
    sincronizarAgora,
    baixarDaNuvem,
    sair,
  }

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp precisa estar dentro de <AppProvider>')
  return ctx
}
