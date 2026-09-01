import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Sidebar from './components/Sidebar'
import RolarParaTopo from './components/RolarParaTopo'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Hoje from './pages/Hoje'
import Trilha from './pages/Trilha'
import Exercicios from './pages/Exercicios'
import Exercicio from './pages/Exercicio'
import Micro from './pages/Micro'
import Pomodoro from './pages/Pomodoro'
import Cronograma from './pages/Cronograma'
import Config from './pages/Config'

function Carregando({ texto }) {
  return (
    <div className="onboard-wrap">
      <div className="center">
        <div className="brand-logo" style={{ width: 52, height: 52, fontSize: 22, margin: '0 auto 16px' }}>
          &lt;/&gt;
        </div>
        <div className="muted">{texto}</div>
      </div>
    </div>
  )
}

export default function App() {
  const { estado, nuvemAtiva, sessao, authPronta, dadosProntos } = useApp()

  if (nuvemAtiva && !authPronta) return <Carregando texto="Verificando sessao..." />
  if (nuvemAtiva && !sessao) return <Login />
  if (nuvemAtiva && !dadosProntos) return <Carregando texto="Carregando seu progresso..." />

  if (!estado.onboarded) return <Onboarding />

  return (
    <div className="app">
      <RolarParaTopo />
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Hoje />} />
          <Route path="/trilha" element={<Trilha />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/cronograma" element={<Cronograma />} />
          <Route path="/exercicios" element={<Exercicios />} />
          <Route path="/ex/:id" element={<Exercicio />} />
          <Route path="/micro/:id" element={<Micro />} />
          <Route path="/config" element={<Config />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
