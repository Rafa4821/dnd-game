import { create } from 'zustand'
import { doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { DialogueConfig, DialogueLine, DialogueProgress, DialogueOption } from '@/types/dialogue'
import type { CharacterTag } from '@/types/tags'

/**
 * Store para manejar diálogos condicionales cooperativos
 */

interface DialogueState {
  currentDialogue: DialogueConfig | null
  progress: DialogueProgress | null
  currentLine: DialogueLine | null
  availableOptions: DialogueOption[]
  loading: boolean
  error: string | null
  
  // Acciones
  initializeDialogue: (sessionId: string, dialogueConfig: DialogueConfig) => Promise<void>
  loadProgress: (sessionId: string, dialogueId: string) => void
  makeChoice: (optionId: string, playerId: string, playerName: string, playerTags: CharacterTag[]) => Promise<void>
  reset: () => void
}

export const useDialogueStore = create<DialogueState>((set, get) => ({
  currentDialogue: null,
  progress: null,
  currentLine: null,
  availableOptions: [],
  loading: false,
  error: null,

  // Inicializar diálogo nuevo
  initializeDialogue: async (sessionId, dialogueConfig) => {
    try {
      set({ loading: true, error: null })
      
      const now = Date.now()
      const startLine = dialogueConfig.lines.find(l => l.id === dialogueConfig.startLineId)
      
      if (!startLine) {
        throw new Error('Start line not found')
      }
      
      const initialProgress: DialogueProgress = {
        dialogueId: dialogueConfig.id,
        sessionId,
        currentLineId: dialogueConfig.startLineId,
        visitedLines: [dialogueConfig.startLineId],
        currentSpeakerId: null,
        choices: [],
        startedAt: now,
        completedAt: null,
      }
      
      // Guardar en Firestore
      await setDoc(
        doc(db, 'sessions', sessionId, 'dialogues', dialogueConfig.id),
        initialProgress
      )
      
      set({
        currentDialogue: dialogueConfig,
        progress: initialProgress,
        currentLine: startLine,
        availableOptions: startLine.options,
        loading: false,
      })
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al inicializar diálogo'
      set({ error: errorMessage, loading: false })
      console.error('Error initializing dialogue:', error)
      throw error
    }
  },

  // Cargar progreso y escuchar cambios
  loadProgress: (sessionId, dialogueId) => {
    set({ loading: true, error: null })
    
    const unsubscribe = onSnapshot(
      doc(db, 'sessions', sessionId, 'dialogues', dialogueId),
      (snapshot) => {
        if (snapshot.exists()) {
          const progress = snapshot.data() as DialogueProgress
          const { currentDialogue } = get()
          
          if (currentDialogue) {
            const currentLine = currentDialogue.lines.find(l => l.id === progress.currentLineId)
            set({
              progress,
              currentLine: currentLine || null,
              availableOptions: currentLine?.options || [],
              loading: false,
            })
          }
        } else {
          set({ error: 'Diálogo no encontrado', loading: false })
        }
      },
      (error) => {
        console.error('Error loading dialogue progress:', error)
        set({ error: error.message, loading: false })
      }
    )
    
    return unsubscribe
  },

  // Hacer una elección en el diálogo
  makeChoice: async (optionId, playerId, _playerName, _playerTags) => {
    const { progress, currentLine, currentDialogue } = get()
    
    if (!progress || !currentLine || !currentDialogue) {
      throw new Error('No hay diálogo activo')
    }
    
    const option = currentLine.options.find(o => o.id === optionId)
    if (!option) {
      throw new Error('Opción no encontrada')
    }
    
    try {
      // Registrar la elección
      const choice = {
        lineId: currentLine.id,
        optionId,
        playerId,
        timestamp: Date.now(),
      }
      
      const updatedChoices = [...progress.choices, choice]
      const updatedVisitedLines = [...progress.visitedLines]
      
      // Determinar siguiente línea
      let nextLineId = null
      let completedAt = null
      
      if (option.action?.nextDialogueId) {
        nextLineId = option.action.nextDialogueId
        updatedVisitedLines.push(nextLineId)
      } else if (option.action?.nextNodeId) {
        // Diálogo completo - se maneja en el componente
        completedAt = Date.now()
      }
      
      // Actualizar en Firestore
      await updateDoc(
        doc(db, 'sessions', progress.sessionId, 'dialogues', progress.dialogueId),
        {
          currentLineId: nextLineId || progress.currentLineId,
          visitedLines: updatedVisitedLines,
          choices: updatedChoices,
          currentSpeakerId: playerId,
          completedAt,
        }
      )
      
    } catch (error) {
      console.error('Error making choice:', error)
      throw error
    }
  },

  // Reset
  reset: () => {
    set({
      currentDialogue: null,
      progress: null,
      currentLine: null,
      availableOptions: [],
      loading: false,
      error: null,
    })
  },
}))
