/**
 * Sistema de Lore y Arcos Narrativos para Personajes
 * Basado en los arquetipos de Sangrebruma V2
 */

export type ActMilestone = 'act1_start' | 'act1_end' | 'act2_start' | 'act2_end' | 'act3_start' | 'act3_mid' | 'act3_end'
export type UnlockType = 'action' | 'bonus' | 'reaction' | 'passive' | 'consumable' | 'puzzle' | 'narrative' | 'choice'
export type FinalType = 'A' | 'B' | 'C'

/**
 * Unlock/Habilidad que se desbloquea en un hito
 */
export interface CharacterUnlock {
  milestone: ActMilestone
  id: string
  name: string
  description: string
  type: UnlockType
  uses?: number
  maxUses?: number
}

/**
 * Decisión narrativa en un acto
 */
export interface ActDecision {
  act: 1 | 2 | 3
  description: string
  flagsAffected?: string[]
  variablesAffected?: Record<string, number>
}

/**
 * Línea de diálogo condicional
 */
export interface ConditionalDialogue {
  condition: string // descripción de cuándo aparece
  text: string
  requiresTags?: string[]
  requiresFlags?: string[]
  speakerLock?: string // tag requerido para hablar
  speakerBan?: string[] // tags que no pueden hablar
}

/**
 * Bark/Voice Sample para TTS
 */
export interface VoiceBark {
  text: string
  context?: string // cuándo se usa
}

/**
 * Interacción única con puzzle
 */
export interface PuzzleInteraction {
  puzzleId: string
  description: string
  mechanicalEffect: string
}

/**
 * Gancho para cada final
 */
export interface FinalHook {
  finalType: FinalType
  description: string
  outcome: string
}

/**
 * Lore completo de un personaje
 */
export interface CharacterLore {
  // Identidad
  pregenId: string
  fullName: string // "Bárbaro del Páramo", "Cazador del Látigo Consagrado"
  
  // Narrativa
  biography: string
  moralDilemma: string // conflicto personal vinculado a Frankenstein
  prometheusConnection: string // cómo se relaciona con el tema de creación/responsabilidad
  
  // Arco narrativo
  actEvolution: {
    act1: string
    act2: string
    act3: string
  }
  keyDecisions: ActDecision[]
  
  // Crecimiento mecánico
  unlocks: CharacterUnlock[]
  
  // Diálogos
  conditionalDialogues: ConditionalDialogue[]
  dialogueKeys: Record<string, string[]> // npc -> dialogue IDs
  
  // Voz/TTS
  voiceBarks: VoiceBark[]
  voiceTone: string // descripción del tono
  ttsPrompt: string // prompt para el sistema TTS
  
  // Puzzles
  puzzleInteractions: PuzzleInteraction[]
  
  // Finales
  finalHooks: FinalHook[]
}

/**
 * Mapa de lore por pregenId
 */
export const CHARACTER_LORE: Record<string, CharacterLore> = {}
