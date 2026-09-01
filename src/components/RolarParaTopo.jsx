import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// ---------------------------------------------------------------------------
// Rolar para o topo ao trocar de tela
// ---------------------------------------------------------------------------
// Numa SPA o navegador nao recarrega a pagina, entao ele nao mexe no scroll:
// voce sai da Trilha rolado la embaixo, clica num exercicio, e a tela nova
// abre no meio — como se faltasse conteudo em cima.
//
// Ficou visivel quando os micro-exercicios chegaram: o botao "praticar" mora
// no fim da lista de topicos, ou seja, sempre longe do topo. Todo clique ali
// caia no meio do enunciado.
// ---------------------------------------------------------------------------

export default function RolarParaTopo() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
