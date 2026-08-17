import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Plano from './pages/Plano'
import Roadmap from './pages/Roadmap'
import Exercicios from './pages/Exercicios'
import Desafios from './pages/Desafios'
import Revisao from './pages/Revisao'
import Pomodoro from './pages/Pomodoro'
import Entrevistas from './pages/Entrevistas'
import Linkedin from './pages/Linkedin'
import Avaliador from './pages/Avaliador'
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
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plano" element={<Plano />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/revisao" element={<Revisao />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/exercicios" element={<Exercicios />} />
          <Route path="/desafios" element={<Desafios />} />
          <Route path="/entrevistas" element={<Entrevistas />} />
          <Route path="/linkedin" element={<Linkedin />} />
          <Route path="/avaliador" element={<Avaliador />} />
          <Route path="/config" element={<Config />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
