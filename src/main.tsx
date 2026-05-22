import React from 'react'

import ReactDOM from 'react-dom/client'

import App from './App'
import './index.css'
import { initSentry } from './lib/sentry'
import { reportWebVitals } from './utils/reportWebVitals'

// Inicializar Sentry apenas em produção
if (import.meta.env.PROD) {
  initSentry()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Reportar Core Web Vitals
if (import.meta.env.PROD) {
  reportWebVitals()
}
