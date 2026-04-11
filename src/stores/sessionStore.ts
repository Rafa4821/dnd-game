import { create } from 'zustand'
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  Timestamp,
  query,
  where,
  getDocs,
  getDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { generateRoomCode } from '@/lib/utils'
import type { Session, CreateSessionInput, JoinSessionInput } from '@/types/session'

interface SessionState {
  currentSession: Session | null
  loading: boolean
  error: string | null
  
  // Actions
  createSession: (input: CreateSessionInput, userId: string) => Promise<string>
  joinSession: (input: JoinSessionInput, userId: string) => Promise<string>
  leaveSession: (userId: string) => Promise<void>
  updatePlayerReady: (userId: string, ready: boolean) => Promise<void>
  startSession: () => Promise<void>
  subscribeToSession: (sessionId: string) => () => void
  clearSession: () => void
  castVote: (optionId: string, playerId: string, playerName: string) => Promise<void>
  initializeVoting: (nodeId: string) => Promise<void>
  resolveVoting: (optionId: string, tiebreaker: boolean) => Promise<void>
  readSession: (sessionId: string) => Promise<Session | null>
  updateSession: (sessionId: string, updates: Partial<Omit<Session, 'id' | 'code' | 'ownerId' | 'createdAt'>>) => Promise<void>
  deleteSession: (sessionId: string) => Promise<void>
}

export const useSessionStore = create<SessionState>((set, get) => ({
  currentSession: null,
  loading: false,
  error: null,

  // Crear nueva sesión
  createSession: async (input, userId) => {
    try {
      set({ loading: true, error: null })
      
      // Generar código único de sala
      let code = generateRoomCode()
      let attempts = 0
      const maxAttempts = 10
      
      // Verificar que el código no exista
      while (attempts < maxAttempts) {
        const q = query(
          collection(db, 'sessions'),
          where('code', '==', code)
        )
        const snapshot = await getDocs(q)
        
        if (snapshot.empty) break
        code = generateRoomCode()
        attempts++
      }
      
      if (attempts === maxAttempts) {
        throw new Error('No se pudo generar un código único')
      }
      
      const sessionId = doc(collection(db, 'sessions')).id
      const now = Date.now()
      
      const sessionData = {
        code,
        ownerId: userId,
        ownerName: input.ownerName,
        players: {
          [userId]: {
            uid: userId,
            displayName: input.ownerName,
            character: null,
            ready: false,
            isOnline: true,
            joinedAt: now,
          },
        },
        playerIds: [userId],
        maxPlayers: input.maxPlayers,
        status: 'waiting',
        campaign: {
          id: input.campaignId,
          name: 'Sangrebruma',
          currentNodeId: 'SB-N_START',
          flags: {},
          variables: {
            darkness: 0,
            bloodDebt: 0,
            act: 1,
            partySize: 1,
          },
          votingState: null,
        },
        id: sessionId,
        createdAt: now,
        updatedAt: now,
        startedAt: null,
      }
      
      await setDoc(doc(db, 'sessions', sessionId), sessionData)
      
      set({ loading: false })
      return sessionId
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear sesión'
      set({ error: errorMessage, loading: false })
      console.error('Error creating session:', error)
      throw error
    }
  },

  // Unirse a sesión existente
  joinSession: async (input, userId) => {
    try {
      set({ loading: true, error: null })
      
      // Buscar sesión por código
      const q = query(
        collection(db, 'sessions'),
        where('code', '==', input.code.toUpperCase())
      )
      const snapshot = await getDocs(q)
      
      if (snapshot.empty) {
        throw new Error('Sala no encontrada')
      }
      
      const sessionDoc = snapshot.docs[0]
      const session = sessionDoc.data() as Session
      
      // Validaciones
      if (session.status !== 'waiting') {
        throw new Error('La sala ya comenzó o está completa')
      }
      
      if (session.playerIds.includes(userId)) {
        throw new Error('Ya estás en esta sala')
      }
      
      if (session.playerIds.length >= session.maxPlayers) {
        throw new Error('La sala está llena')
      }
      
      // Agregar jugador
      const now = Date.now()
      const sessionId = sessionDoc.id
      await updateDoc(doc(db, 'sessions', sessionId), {
        [`players.${userId}`]: {
          uid: userId,
          displayName: input.displayName,
          character: null,
          ready: false,
          isOnline: true,
          joinedAt: now,
        },
        playerIds: [...session.playerIds, userId],
        'campaign.variables.partySize': session.playerIds.length + 1,
        updatedAt: now,
      })
      
      console.log('Successfully joined session:', sessionId)
      set({ loading: false })
      
      return sessionId
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al unirse'
      set({ error: errorMessage, loading: false })
      console.error('Error joining session:', error)
      throw error
    }
  },

  // Salir de sesión
  leaveSession: async (userId) => {
    try {
      const session = get().currentSession
      if (!session) return
      
      const playerIds = session.playerIds.filter(id => id !== userId)
      
      // Si el owner se va, eliminar la sesión (o transferir ownership)
      if (session.ownerId === userId && playerIds.length === 0) {
        // TODO: Eliminar sesión completa
        set({ currentSession: null })
        return
      }
      
      // Remover jugador
      await updateDoc(doc(db, 'sessions', session.id), {
        [`players.${userId}`]: null,
        playerIds,
        'campaign.variables.partySize': playerIds.length,
        updatedAt: Date.now(),
      })
      
      set({ currentSession: null })
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al salir'
      set({ error: errorMessage })
      console.error('Error leaving session:', error)
    }
  },

  // Actualizar estado "listo"
  updatePlayerReady: async (userId, ready) => {
    try {
      const session = get().currentSession
      if (!session) return
      
      await updateDoc(doc(db, 'sessions', session.id), {
        [`players.${userId}.ready`]: ready,
        updatedAt: Date.now(),
      })
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar'
      set({ error: errorMessage })
      console.error('Error updating ready:', error)
    }
  },

  // Iniciar sesión
  startSession: async () => {
    try {
      const session = get().currentSession
      if (!session) return
      
      // Validar que todos tengan personaje y estén listos
      const allReady = Object.values(session.players).every(
        p => p.character !== null && p.ready
      )
      
      if (!allReady) {
        throw new Error('Todos los jugadores deben tener personaje y estar listos')
      }
      
      await updateDoc(doc(db, 'sessions', session.id), {
        status: 'playing',
        startedAt: Date.now(),
        updatedAt: Date.now(),
      })
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar'
      set({ error: errorMessage })
      console.error('Error starting session:', error)
      throw error
    }
  },

  /**
   * READ - Leer sesión por ID
   */
  readSession: async (sessionId) => {
    try {
      set({ loading: true, error: null })
      
      const sessionRef = doc(db, 'sessions', sessionId)
      const sessionSnap = await getDoc(sessionRef)
      
      if (sessionSnap.exists()) {
        const session = sessionSnap.data() as Session
        set({ currentSession: session, loading: false })
        return session
      }
      
      set({ loading: false })
      return null
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al leer sesión'
      set({ error: errorMessage, loading: false })
      console.error('Error reading session:', error)
      return null
    }
  },

  /**
   * UPDATE - Actualizar sesión
   */
  updateSession: async (sessionId, updates) => {
    try {
      set({ loading: true, error: null })
      
      const sessionRef = doc(db, 'sessions', sessionId)
      await updateDoc(sessionRef, {
        ...updates,
        updatedAt: Date.now(),
      })
      
      set({ loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar sesión'
      set({ error: errorMessage, loading: false })
      console.error('Error updating session:', error)
      throw error
    }
  },

  /**
   * DELETE - Eliminar sesión
   */
  deleteSession: async (sessionId) => {
    try {
      set({ loading: true, error: null })
      
      const sessionRef = doc(db, 'sessions', sessionId)
      await deleteDoc(sessionRef)
      
      set({ currentSession: null, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar sesión'
      set({ error: errorMessage, loading: false })
      console.error('Error deleting session:', error)
      throw error
    }
  },

  // Suscribirse a cambios de sesión
  subscribeToSession: (sessionId) => {
    const unsubscribe = onSnapshot(
      doc(db, 'sessions', sessionId),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data()
          
          console.log('🔄 Firebase snapshot actualizado:')
          console.log('  - votingState:', JSON.stringify(data.campaign?.votingState, null, 2))
          console.log('  - campaign:', JSON.stringify(data.campaign, null, 2))
          
          const session: Session = {
            id: snapshot.id,
            ...data,
            // Convertir Timestamps a números
            createdAt: data.createdAt instanceof Timestamp 
              ? data.createdAt.toMillis() 
              : data.createdAt,
            updatedAt: data.updatedAt instanceof Timestamp 
              ? data.updatedAt.toMillis() 
              : data.updatedAt,
            startedAt: data.startedAt instanceof Timestamp 
              ? data.startedAt.toMillis() 
              : data.startedAt,
          } as Session
          
          console.log('✅ Sesión actualizada en store:')
          console.log('  - votingState:', JSON.stringify(session.campaign?.votingState, null, 2))
          
          set({ currentSession: session, loading: false })
        } else {
          set({ currentSession: null, loading: false })
        }
      },
      (error) => {
        console.error('Error in session subscription:', error)
        set({ error: error.message, loading: false })
      }
    )
    
    return unsubscribe
  },

  // Limpiar sesión actual
  clearSession: () => {
    set({ currentSession: null, error: null })
  },

  // Inicializar votación para un nodo de decisión
  initializeVoting: async (nodeId) => {
    try {
      const session = get().currentSession
      if (!session) {
        console.log('❌ No session found')
        return
      }

      console.log('🗳️ Inicializando votación para nodo:', nodeId)
      console.log('📋 Session ID:', session.id)

      const votingState = {
        nodeId,
        votes: {},
        startedAt: Date.now(),
        resolvedAt: null,
        resolvedOption: null,
        tiebreaker: false,
      }

      console.log('📦 Datos a guardar:', votingState)

      const docRef = doc(db, 'sessions', session.id)
      
      // Actualizar todo el objeto campaign con el nuevo votingState
      const updatedCampaign = {
        ...session.campaign,
        votingState: votingState,
      }
      
      console.log('📦 Campaign actualizado:', JSON.stringify(updatedCampaign, null, 2))
      
      // Actualizar store local INMEDIATAMENTE (optimistic update)
      set({ 
        currentSession: {
          ...session,
          campaign: updatedCampaign,
          updatedAt: Date.now(),
        }
      })
      console.log('✅ Store local actualizado (optimistic)')
      
      // Guardar en Firebase (el snapshot lo re-sincronizará)
      await setDoc(docRef, {
        campaign: updatedCampaign,
        updatedAt: Date.now(),
      }, { merge: true })

      console.log('✅ SetDoc en Firebase completado')
    } catch (error) {
      console.error('❌ Error initializing voting:', error)
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: error && typeof error === 'object' && 'code' in error ? error.code : undefined,
        stack: error instanceof Error ? error.stack : undefined,
      })
      throw error
    }
  },

  // Registrar voto de jugador
  castVote: async (optionId, playerId, playerName) => {
    try {
      const session = get().currentSession
      if (!session) {
        console.log('❌ No session found')
        return
      }
      
      if (!session.campaign?.votingState) {
        console.log('❌ No voting state found, initializing...')
        return
      }

      console.log('🗳️ Registrando voto:', { playerId, playerName, optionId })

      const vote = {
        playerId,
        playerName,
        optionId,
        timestamp: Date.now(),
      }
      
      // Actualizar el campaign completo con el nuevo voto
      const updatedCampaign = {
        ...session.campaign,
        votingState: {
          ...session.campaign.votingState!,
          votes: {
            ...session.campaign.votingState!.votes,
            [playerId]: vote,
          },
        },
      }

      // Optimistic update: actualizar store local inmediatamente
      set({ 
        currentSession: {
          ...session,
          campaign: updatedCampaign,
          updatedAt: Date.now(),
        }
      })
      console.log('✅ Voto registrado en store local (optimistic)')

      await updateDoc(doc(db, 'sessions', session.id), {
        campaign: updatedCampaign,
        updatedAt: Date.now(),
      })

      console.log('✅ Voto registrado exitosamente')
    } catch (error) {
      console.error('❌ Error casting vote:', error)
      throw error
    }
  },

  // Resolver votación
  resolveVoting: async (optionId, tiebreaker = false) => {
    try {
      const session = get().currentSession
      if (!session) return

      await updateDoc(doc(db, 'sessions', session.id), {
        'campaign.votingState.resolvedAt': Date.now(),
        'campaign.votingState.resolvedOption': optionId,
        'campaign.votingState.tiebreaker': tiebreaker,
        updatedAt: Date.now(),
      })
    } catch (error) {
      console.error('Error resolving voting:', error)
    }
  },
}))
