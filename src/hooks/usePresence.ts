import { useEffect } from 'react'
import { usePresenceStore } from '@/stores/presenceStore'

/**
 * Hook personalizado para gestionar presencia en una sesión
 * Automáticamente inicializa y limpia presencia al montar/desmontar
 */
export function usePresence(
  userId: string | undefined,
  sessionId: string | undefined,
  displayName: string | undefined
) {
  const { startPresence, subscribePresence, clearPresence, presenceMap } = usePresenceStore()

  useEffect(() => {
    if (!userId || !sessionId || !displayName) return

    // Iniciar presencia del usuario actual
    const cleanupPresence = startPresence(userId, sessionId, displayName)
    
    // Suscribirse a presencia de todos
    const cleanupSubscription = subscribePresence(sessionId)

    // Cleanup al desmontar
    return () => {
      cleanupPresence()
      cleanupSubscription()
      clearPresence()
    }
  }, [userId, sessionId, displayName, startPresence, subscribePresence, clearPresence])

  return presenceMap
}

/**
 * Hook para verificar si un usuario específico está online
 */
export function useIsUserOnline(userId: string | undefined): boolean {
  const presenceMap = usePresenceStore((state) => state.presenceMap)
  
  if (!userId || !presenceMap[userId]) return false
  
  return presenceMap[userId].online
}

/**
 * Hook para obtener el conteo de usuarios online
 */
export function useOnlineCount(): number {
  const presenceMap = usePresenceStore((state) => state.presenceMap)
  
  return Object.values(presenceMap).filter(p => p.online).length
}
