import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { AppProvider } from './context/AppContext'
import { PomodoroProvider } from './context/PomodoroContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AppProvider>
        <PomodoroProvider>
          <App />
        </PomodoroProvider>
      </AppProvider>
    </HashRouter>
  </React.StrictMode>
)
