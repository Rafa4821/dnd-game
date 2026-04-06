import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: ReactNode
  requireAuth?: boolean
}

/**
 * Guard que protege rutas basándose en el estado de autenticación
 * - requireAuth=true: Solo usuarios autenticados pueden acceder
 * - requireAuth=false: Solo usuarios NO autenticados (para /login, etc.)
 */
export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user, loading } = useAuthStore()

  // Mostrar loader mientras se verifica auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // Redirigir según el estado de auth y el requisito
  if (requireAuth && !user) {
    return <Navigate to="/auth" replace />
  }

  if (!requireAuth && user) {
    return <Navigate to="/lobby" replace />
  }

  return <>{children}</>
}
