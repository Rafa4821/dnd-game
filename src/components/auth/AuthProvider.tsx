import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'

interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * Proveedor de autenticación que inicializa el listener de Firebase Auth
 * Debe envolver toda la aplicación para mantener el estado de auth sincronizado
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    // Inicializar listener y obtener cleanup function
    const unsubscribe = initialize()
    
    // Cleanup al desmontar
    return () => unsubscribe()
  }, [initialize])

  return <>{children}</>
}
