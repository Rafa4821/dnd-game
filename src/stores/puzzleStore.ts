import { create } from 'zustand'
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { PuzzleProgress, PuzzleConfig } from '@/types/puzzle'

/**
 * Store para gestionar puzzles cooperativos en tiempo real
 */

interface PuzzleState {
  currentPuzzle: PuzzleConfig | null
  progress: PuzzleProgress | null
  loading: boolean
  error: string | null
  
  // Acciones
  initializePuzzle: (sessionId: string, puzzleConfig: PuzzleConfig) => Promise<void>
  loadProgress: (sessionId: string, puzzleId: string) => void
  makeMove: (elementId: string, action: string, value: unknown, playerId: string) => Promise<void>
  requestHint: (playerId: string) => Promise<string | null>
  validateSolution: () => Promise<boolean>
  completePuzzle: (success: boolean) => Promise<void>
  reset: () => void
}

export const usePuzzleStore = create<PuzzleState>((set, get) => ({
  currentPuzzle: null,
  progress: null,
  loading: false,
  error: null,

  // Inicializar puzzle nuevo
  initializePuzzle: async (sessionId, puzzleConfig) => {
    try {
      set({ loading: true, error: null })
      
      const now = Date.now()
      
      // Distribuir elementos entre jugadores (simplificado - asume elementos ya asignados)
      const initialProgress: PuzzleProgress = {
        puzzleId: puzzleConfig.id,
        sessionId,
        state: 'in_progress',
        currentElements: puzzleConfig.elements,
        attemptCount: 0,
        hintsUsed: 0,
        playerMoves: [],
        startedAt: now,
        solvedAt: null,
      }
      
      // Guardar en Firestore
      await setDoc(
        doc(db, 'sessions', sessionId, 'puzzles', puzzleConfig.id),
        initialProgress
      )
      
      set({
        currentPuzzle: puzzleConfig,
        progress: initialProgress,
        loading: false,
      })
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al inicializar puzzle'
      set({ error: errorMessage, loading: false })
      console.error('Error initializing puzzle:', error)
      throw error
    }
  },

  // Cargar progreso existente y escuchar cambios
  loadProgress: (sessionId, puzzleId) => {
    set({ loading: true, error: null })
    
    const unsubscribe = onSnapshot(
      doc(db, 'sessions', sessionId, 'puzzles', puzzleId),
      (snapshot) => {
        if (snapshot.exists()) {
          const progress = snapshot.data() as PuzzleProgress
          set({ progress, loading: false })
        } else {
          set({ error: 'Puzzle no encontrado', loading: false })
        }
      },
      (error) => {
        console.error('Error loading puzzle progress:', error)
        set({ error: error.message, loading: false })
      }
    )
    
    // Cleanup se maneja externamente (useEffect)
    return unsubscribe
  },

  // Realizar un movimiento en el puzzle
  makeMove: async (elementId, action, value: unknown, playerId) => {
    const { progress, currentPuzzle } = get()
    
    if (!progress || !currentPuzzle) {
      throw new Error('No hay puzzle activo')
    }
    
    try {
      // Registrar el movimiento
      const move = {
        playerId,
        elementId,
        action,
        value,
        timestamp: Date.now(),
      }
      
      // Actualizar elemento afectado
      const updatedElements = progress.currentElements.map(el => {
        if (el.id === elementId) {
          return { ...el, value, position: value }
        }
        return el
      })
      
      // Actualizar en Firestore
      await updateDoc(
        doc(db, 'sessions', progress.sessionId, 'puzzles', progress.puzzleId),
        {
          currentElements: updatedElements,
          playerMoves: [...progress.playerMoves, move],
          attemptCount: progress.attemptCount + 1,
        }
      )
      
    } catch (error) {
      console.error('Error making move:', error)
      throw error
    }
  },

  // Solicitar hint
  requestHint: async (_playerId) => {
    const { progress, currentPuzzle } = get()
    
    if (!progress || !currentPuzzle) {
      return null
    }
    
    if (progress.hintsUsed >= currentPuzzle.hintsAvailable) {
      return 'No quedan pistas disponibles'
    }
    
    try {
      // Incrementar hints usados
      await updateDoc(
        doc(db, 'sessions', progress.sessionId, 'puzzles', progress.puzzleId),
        {
          hintsUsed: progress.hintsUsed + 1,
        }
      )
      
      // Generar hint basado en nivel
      const hintLevel = progress.hintsUsed
      const hints = [
        'Observa los símbolos en el orden correcto',
        'Cada jugador controla un anillo. Deben coordinarse',
        'La solución está en el patrón que encontraron antes',
      ]
      
      return hints[Math.min(hintLevel, hints.length - 1)]
      
    } catch (error) {
      console.error('Error requesting hint:', error)
      return null
    }
  },

  // Validar si la solución es correcta
  validateSolution: async () => {
    const { progress, currentPuzzle } = get()
    
    if (!progress || !currentPuzzle) {
      return false
    }
    
    try {
      // Validación simple: comparar valores actuales con solución
      const isCorrect = JSON.stringify(progress.currentElements.map(el => el.value)) === 
                       JSON.stringify(currentPuzzle.solution)
      
      if (isCorrect) {
        await get().completePuzzle(true)
      }
      
      return isCorrect
      
    } catch (error) {
      console.error('Error validating solution:', error)
      return false
    }
  },

  // Completar puzzle
  completePuzzle: async (success) => {
    const { progress } = get()
    
    if (!progress) return
    
    try {
      await updateDoc(
        doc(db, 'sessions', progress.sessionId, 'puzzles', progress.puzzleId),
        {
          state: success ? 'solved' : 'failed',
          solvedAt: Date.now(),
        }
      )
      
    } catch (error) {
      console.error('Error completing puzzle:', error)
      throw error
    }
  },

  // Reset
  reset: () => {
    set({
      currentPuzzle: null,
      progress: null,
      loading: false,
      error: null,
    })
  },
}))
