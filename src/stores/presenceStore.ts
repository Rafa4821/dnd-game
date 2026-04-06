import { create } from 'zustand'
import type { PresenceData } from '@/lib/presence'
import { initializePresence, subscribeToPresence, startPresenceHeartbeat } from '@/lib/presence'

interface PresenceState {
  presenceMap: Record<string, PresenceData>
  
  // Actions
  startPresence: (userId: string, sessionId: string, displayName: string) => () => void
  subscribePresence: (sessionId: string) => () => void
  clearPresence: () => void
}

export const usePresenceStore = create<PresenceState>((set) => ({
  presenceMap: {},

  // Iniciar presencia del usuario actual
  startPresence: (userId, sessionId, displayName) => {
    const cleanup1 = initializePresence(userId, sessionId, displayName)
    const cleanup2 = startPresenceHeartbeat(userId, sessionId)
    
    // Retornar función de limpieza combinada
    return () => {
      cleanup1()
      cleanup2()
    }
  },

  // Suscribirse a presencia de todos los usuarios en la sesión
  subscribePresence: (sessionId) => {
    const unsubscribe = subscribeToPresence(sessionId, (presenceMap) => {
      set({ presenceMap })
    })
    
    return unsubscribe
  },

  // Limpiar estado
  clearPresence: () => {
    set({ presenceMap: {} })
  },
}))
