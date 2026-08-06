import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { carregar, salvar, normalizar, temProgresso, ESTADO_INICIAL } from '../lib/storage'
import { gerarPlano } from '../lib/planner'
import { nuvemAtiva, supabase, carregarNuvem, salvarNuvem } from '../lib/supabase'

const Ctx = createContext(null)

const ATRASO_SALVAR = 1200 // ms de espera antes de mandar para a nuvem

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

  // Observa a sessao do Supabase
  useEffect(() => {
    if (!nuvemAtiva) return

    let vivo = true

    supabase.auth.getSession().then(({ data }) => {
      if (!vivo) return
      setSessao(data.session ?? null)
      setAuthPronta(true)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSessao(novaSessao ?? null)
      setAuthPronta(true)
    })

    return () => {
      vivo = false
      sub.subscription.unsubscribe()
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
        const nuvem = await carregarNuvem(userId)
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
          await salvarNuvem(userId, local)
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
    timer.current = setTimeout(async () => {
      try {
        await salvarNuvem(userId, estado)
        setUltimoSync(new Date().toISOString())
        setSincronia('ok')
        setErroSync(null)
      } catch (e) {
        console.error('Falha ao salvar na nuvem:', e)
        setErroSync(e.message || 'Falha ao salvar')
        setSincronia('erro')
      }
    }, ATRASO_SALVAR)

    return () => clearTimeout(timer.current)
  }, [estado, userId, dadosProntos])

  // ------------------------------------------------------------- comandos

  const sincronizarAgora = useCallback(async () => {
    if (!nuvemAtiva || !userId) return
    setSincronia('salvando')
    try {
      await salvarNuvem(userId, estado)
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
      const nuvem = await carregarNuvem(userId)
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
      await salvarNuvem(userId, estado)
    } catch {
      /* se falhar, o cache local ainda tem tudo */
    }
    await supabase.auth.signOut()
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

      toggleTopico: (moduloId, indice) =>
        setEstado((e) => {
          const chave = `${moduloId}:${indice}`
          const topicos = { ...e.topicos }
          if (topicos[chave]) delete topicos[chave]
          else topicos[chave] = new Date().toISOString()
          return { ...e, topicos }
        }),

      marcarModulo: (modulo, valor) =>
        setEstado((e) => {
          const topicos = { ...e.topicos }
          modulo.topicos.forEach((_, i) => {
            const chave = `${modulo.id}:${i}`
            if (valor) topicos[chave] = new Date().toISOString()
            else delete topicos[chave]
          })
          return { ...e, topicos }
        }),

      setNota: (moduloId, texto) => setEstado((e) => ({ ...e, notas: { ...e.notas, [moduloId]: texto } })),

      setExercicio: (id, status) =>
        setEstado((e) => {
          const exercicios = { ...e.exercicios }
          if (!status) delete exercicios[id]
          else exercicios[id] = status
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

  const plano = useMemo(() => gerarPlano(estado.perfil, estado.topicos), [estado.perfil, estado.topicos])

  const valor = {
    ...api,
    plano,
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
