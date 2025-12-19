import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import RadarPage from './pages/RadarPage'
import CalendarPage from './pages/CalendarPage'
import TodosPage from './pages/TodosPage'
import './index.css'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

const AppWrapper: React.FC = () => {
  if (clientId) {
    return (
      <GoogleOAuthProvider clientId={clientId}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RadarPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/todos" element={<TodosPage />} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    )
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RadarPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/todos" element={<TodosPage />} />
      </Routes>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
)
