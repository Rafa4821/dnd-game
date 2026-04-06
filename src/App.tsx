import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/auth/AuthProvider'
import { AuthGuard } from './components/auth/AuthGuard'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import LobbyPage from './pages/LobbyPage'
import SessionPage from './pages/SessionPage'
import CampaignPage from './pages/CampaignPage'
import ProfilePage from './pages/ProfilePage'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Ruta de autenticación (solo para usuarios no autenticados) */}
          <Route 
            path="/auth" 
            element={
              <AuthGuard requireAuth={false}>
                <AuthPage />
              </AuthGuard>
            } 
          />
          
          {/* Rutas protegidas (requieren autenticación) */}
          <Route 
            path="/lobby" 
            element={
              <AuthGuard requireAuth={true}>
                <LobbyPage />
              </AuthGuard>
            } 
          />
          
          <Route 
            path="/session/:sessionId" 
            element={
              <AuthGuard requireAuth={true}>
                <SessionPage />
              </AuthGuard>
            } 
          />
          <Route
            path="/campaign/:sessionId"
            element={
              <AuthGuard>
                <CampaignPage />
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <ProfilePage />
              </AuthGuard>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
