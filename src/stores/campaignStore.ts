import { create } from 'zustand'
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { CampaignNode, CampaignProgress, LogEntry } from '@/types/campaign'
import { getNodeById, getStartNode } from '@/data/nodes'

interface CampaignState {
  currentNode: CampaignNode | null
  progress: CampaignProgress | null
  loading: boolean
  error: string | null
  
  // Actions
  initializeCampaign: (sessionId: string) => Promise<void>
  loadProgress: (sessionId: string) => Promise<void>
  navigateToNode: (nodeId: string) => Promise<void>
  makeDecision: (optionId: string) => Promise<void>
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => Promise<void>
  updateFlags: (flags: Record<string, boolean>) => Promise<void>
  updateVariables: (variables: Record<string, number>) => Promise<void>
  resetCampaign: (sessionId: string) => Promise<void>
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
  currentNode: null,
  progress: null,
  loading: false,
  error: null,

  // Inicializar campaña nueva
  initializeCampaign: async (sessionId) => {
    try {
      set({ loading: true, error: null })
      
      const startNode = getStartNode()
      const now = Date.now()
      
      const initialProgress: CampaignProgress = {
        sessionId,
        currentNodeId: startNode.id,
        visitedNodes: [startNode.id],
        flags: {},
        variables: {
          darkness: 0,
          bloodDebt: 0,
          act: 1,
          partySize: 1,
        },
        logs: [],
        createdAt: now,
        updatedAt: now,
      }
      
      // Guardar en Firestore (subcollection)
      await setDoc(
        doc(db, 'sessions', sessionId, 'campaign', 'progress'),
        initialProgress
      )
      
      // IMPORTANTE: Sincronizar currentNodeId en el documento raíz
      console.log('🔄 Sincronizando currentNodeId en session.campaign:', startNode.id)
      await updateDoc(
        doc(db, 'sessions', sessionId),
        {
          'campaign.currentNodeId': startNode.id,
          updatedAt: Date.now(),
        }
      )
      
      set({
        currentNode: startNode,
        progress: initialProgress,
        loading: false,
      })
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al inicializar campaña'
      set({ error: errorMessage, loading: false })
      console.error('Error initializing campaign:', error)
      throw error
    }
  },

  // Cargar progreso existente
  loadProgress: async (sessionId) => {
    try {
      set({ loading: true, error: null })
      
      const docRef = doc(db, 'sessions', sessionId, 'campaign', 'progress')
      const docSnap = await getDoc(docRef)
      
      if (!docSnap.exists()) {
        // Si no existe, inicializar
        await get().initializeCampaign(sessionId)
        return
      }
      
      const data: Record<string, unknown> = docSnap.data()
      const progress: CampaignProgress = {
        ...data,
        createdAt: data.createdAt instanceof Timestamp 
          ? data.createdAt.toMillis() 
          : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp 
          ? data.updatedAt.toMillis() 
          : data.updatedAt,
      } as CampaignProgress
      
      const currentNode = getNodeById(progress.currentNodeId)
      
      // IMPORTANTE: Sincronizar currentNodeId en el documento raíz si está desincronizado
      console.log('🔄 Verificando sincronización de currentNodeId:', progress.currentNodeId)
      try {
        await updateDoc(
          doc(db, 'sessions', sessionId),
          {
            'campaign.currentNodeId': progress.currentNodeId,
            updatedAt: Date.now(),
          }
        )
        console.log('✅ currentNodeId sincronizado en session.campaign')
      } catch (syncError) {
        console.warn('⚠️ Error sincronizando currentNodeId (no crítico):', syncError)
      }
      
      set({
        currentNode: currentNode || null,
        progress,
        loading: false,
      })
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar progreso'
      set({ error: errorMessage, loading: false })
      console.error('Error loading progress:', error)
      throw error
    }
  },

  // Navegar a un nodo específico
  navigateToNode: async (nodeId) => {
    try {
      const progress = get().progress
      if (!progress) throw new Error('No hay progreso cargado')
      
      const node = getNodeById(nodeId)
      if (!node) throw new Error(`Nodo ${nodeId} no encontrado`)
      
      // Actualizar progreso
      const updatedProgress: CampaignProgress = {
        ...progress,
        currentNodeId: nodeId,
        visitedNodes: [...progress.visitedNodes, nodeId],
        updatedAt: Date.now(),
      }
      
      // Aplicar cambios de flags y variables del nodo
      if (node.setsFlags) {
        updatedProgress.flags = {
          ...updatedProgress.flags,
          ...node.setsFlags,
        }
      }
      
      if (node.modifiesVariables) {
        updatedProgress.variables = {
          ...updatedProgress.variables,
        }
        for (const [key, value] of Object.entries(node.modifiesVariables)) {
          updatedProgress.variables[key] = (updatedProgress.variables[key] || 0) + value
        }
      }
      
      // Guardar en Firestore (subcollection progress)
      await updateDoc(
        doc(db, 'sessions', progress.sessionId, 'campaign', 'progress'),
        updatedProgress as Record<string, unknown>
      )
      
      // IMPORTANTE: También actualizar campaign.currentNodeId en el documento raíz de session
      // para mantener sincronizado con el sistema de votación
      console.log('🔄 Navegando: sincronizando currentNodeId en session.campaign:', nodeId)
      try {
        await updateDoc(
          doc(db, 'sessions', progress.sessionId),
          {
            'campaign.currentNodeId': nodeId,
            updatedAt: Date.now(),
          }
        )
        console.log('✅ currentNodeId actualizado en session.campaign')
      } catch (syncError) {
        console.error('❌ Error sincronizando currentNodeId:', syncError)
        throw syncError
      }
      
      set({
        currentNode: node,
        progress: updatedProgress,
      })
      
      // Agregar log de navegación
      await get().addLog({
        nodeId,
        type: 'narrative',
        content: `Llegáis a: ${node.title}`,
      })
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al navegar'
      set({ error: errorMessage })
      console.error('Error navigating to node:', error)
      throw error
    }
  },

  // Tomar decisión en nodo de decisión
  makeDecision: async (optionId) => {
    try {
      const { currentNode, progress } = get()
      if (!currentNode || !progress) throw new Error('No hay nodo actual')
      
      if (currentNode.type !== 'decision') {
        throw new Error('El nodo actual no es de decisión')
      }
      
      const option = currentNode.options?.find(o => o.id === optionId)
      if (!option) throw new Error(`Opción ${optionId} no encontrada`)
      
      console.log('📝 Resolviendo decisión:', optionId)
      
      // Aplicar flags de la opción
      if (option.setsFlags) {
        await get().updateFlags(option.setsFlags)
      }
      
      // Log de decisión
      await get().addLog({
        nodeId: currentNode.id,
        type: 'decision',
        content: `Decisión tomada: ${option.text}`,
        metadata: { optionId, nextNodeId: option.nextNodeId },
      })
      
      // IMPORTANTE: Limpiar votingState antes de navegar al siguiente nodo
      console.log('🧹 Limpiando votingState...')
      await updateDoc(
        doc(db, 'sessions', progress.sessionId),
        {
          'campaign.votingState': null,
          updatedAt: Date.now(),
        }
      )
      
      // Navegar al siguiente nodo
      if (option.nextNodeId) {
        await get().navigateToNode(option.nextNodeId)
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al tomar decisión'
      set({ error: errorMessage })
      console.error('Error making decision:', error)
      throw error
    }
  },

  // Agregar entrada al log
  addLog: async (log) => {
    try {
      const progress = get().progress
      if (!progress) throw new Error('No hay progreso cargado')
      
      const newLog: LogEntry = {
        ...log,
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      }
      
      const updatedProgress: CampaignProgress = {
        ...progress,
        logs: [...progress.logs, newLog],
        updatedAt: Date.now(),
      }
      
      await updateDoc(
        doc(db, 'sessions', progress.sessionId, 'campaign', 'progress'),
        { logs: updatedProgress.logs, updatedAt: updatedProgress.updatedAt }
      )
      
      set({ progress: updatedProgress })
      
    } catch (error) {
      console.error('Error adding log:', error)
    }
  },

  // Actualizar flags
  updateFlags: async (flags) => {
    try {
      const progress = get().progress
      if (!progress) throw new Error('No hay progreso cargado')
      
      const updatedProgress: CampaignProgress = {
        ...progress,
        flags: {
          ...progress.flags,
          ...flags,
        },
        updatedAt: Date.now(),
      }
      
      await updateDoc(
        doc(db, 'sessions', progress.sessionId, 'campaign', 'progress'),
        { flags: updatedProgress.flags, updatedAt: updatedProgress.updatedAt }
      )
      
      set({ progress: updatedProgress })
      
    } catch (error) {
      console.error('Error updating flags:', error)
      throw error
    }
  },

  // Actualizar variables
  updateVariables: async (variables) => {
    try {
      const progress = get().progress
      if (!progress) throw new Error('No hay progreso cargado')
      
      const updatedProgress: CampaignProgress = {
        ...progress,
        variables: {
          ...progress.variables,
          ...variables,
        },
        updatedAt: Date.now(),
      }
      
      await updateDoc(
        doc(db, 'sessions', progress.sessionId, 'campaign', 'progress'),
        { variables: updatedProgress.variables, updatedAt: updatedProgress.updatedAt }
      )
      
      set({ progress: updatedProgress })
      
    } catch (error) {
      console.error('Error updating variables:', error)
      throw error
    }
  },

  /**
   * Reiniciar campaña desde el principio
   */
  resetCampaign: async (sessionId) => {
    try {
      set({ loading: true, error: null })
      
      // Reiniciar es lo mismo que inicializar de nuevo
      await get().initializeCampaign(sessionId)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al reiniciar campaña'
      set({ error: errorMessage, loading: false })
      console.error('Error resetting campaign:', error)
      throw error
    }
  },
}))
