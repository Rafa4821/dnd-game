import { ref, onValue, onDisconnect, set, serverTimestamp } from 'firebase/database'
import { rtdb } from './firebase'

/**
 * Sistema de presencia con Firebase Realtime Database
 * Detecta cuando un jugador se conecta/desconecta usando onDisconnect()
 */

export interface PresenceData {
  online: boolean
  lastSeen: number
  sessionId: string
  displayName: string
}

/**
 * Inicializar presencia para un usuario en una sesión
 * Automáticamente marca como offline cuando se desconecta
 */
export function initializePresence(
  userId: string,
  sessionId: string,
  displayName: string
): () => void {
  const presenceRef = ref(rtdb, `presence/${sessionId}/${userId}`)
  
  // Datos de presencia
  const presenceData: PresenceData = {
    online: true,
    lastSeen: Date.now(),
    sessionId,
    displayName,
  }
  
  // Configurar onDisconnect para marcar como offline
  onDisconnect(presenceRef).set({
    ...presenceData,
    online: false,
    lastSeen: serverTimestamp(),
  })
  
  // Marcar como online
  set(presenceRef, presenceData)
  
  // Cleanup function
  return () => {
    set(presenceRef, {
      ...presenceData,
      online: false,
      lastSeen: Date.now(),
    })
  }
}

/**
 * Suscribirse a cambios de presencia en una sesión
 */
export function subscribeToPresence(
  sessionId: string,
  callback: (presenceMap: Record<string, PresenceData>) => void
): () => void {
  const presenceRef = ref(rtdb, `presence/${sessionId}`)
  
  const unsubscribe = onValue(presenceRef, (snapshot) => {
    const presenceMap: Record<string, PresenceData> = {}
    
    snapshot.forEach((childSnapshot) => {
      const userId = childSnapshot.key
      const data = childSnapshot.val()
      
      if (userId && data) {
        presenceMap[userId] = data
      }
    })
    
    callback(presenceMap)
  })
  
  return unsubscribe
}

/**
 * Heartbeat para mantener la conexión activa
 * Actualiza lastSeen cada 30 segundos
 */
export function startPresenceHeartbeat(
  userId: string,
  sessionId: string
): () => void {
  const presenceRef = ref(rtdb, `presence/${sessionId}/${userId}`)
  
  const interval = setInterval(() => {
    set(ref(rtdb, `presence/${sessionId}/${userId}/lastSeen`), Date.now())
  }, 30000) // 30 segundos
  
  // Cleanup
  return () => {
    clearInterval(interval)
  }
}
