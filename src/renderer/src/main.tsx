import 'react-toastify/dist/ReactToastify.css'
import './assets/main.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ToastContainer } from 'react-toastify'
import SettingsProvider from './contexts/settings/provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <App />
      <ToastContainer
        position="bottom-right"
        hideProgressBar
        newestOnTop
        closeButton={false}
        limit={3}
      />
    </SettingsProvider>
  </StrictMode>
)
