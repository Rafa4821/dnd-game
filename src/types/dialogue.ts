import { z } from 'zod'
import type { CharacterTag } from './tags'

/**
 * Sistema de Diálogos Condicionales - Campaña V2
 * Soporte para speaker locks, opciones por party composition, y diálogos dinámicos
 */

/**
 * Opción de diálogo
 */
export const DialogueOption = z.object({
  id: z.string(),
  text: z.string(),
  
  // Navegación simple
  nextLineId: z.string().optional(),                  // siguiente línea de diálogo
  
  // Condiciones para mostrar esta opción
  requiresPartyTags: z.array(z.string()).optional(),  // party debe tener al menos uno
  requiresAllTags: z.array(z.string()).optional(),    // party debe tener todos
  requiresFlags: z.array(z.string()).optional(),      // flags de campaña
  requiresNoFlags: z.array(z.string()).optional(),    // flags que NO deben existir
  
  // Speaker lock - solo un personaje específico puede elegir
  speakerLockTag: z.string().optional(),              // debe tener este tag
  speakerLockPlayerId: z.string().optional(),         // o ser este jugador
  
  // Checks y consecuencias
  check: z.object({
    skill: z.string(),
    dc: z.number(),
    advantage: z.boolean().optional(),
    disadvantage: z.boolean().optional(),
  }).optional(),
  
  onSuccess: z.object({
    nextDialogueId: z.string().optional(),
    nextNodeId: z.string().optional(),
    setsFlags: z.record(z.boolean()).optional(),
    modifiesVariables: z.record(z.number()).optional(),
    feedback: z.string(),
  }).optional(),
  
  onFailure: z.object({
    nextDialogueId: z.string().optional(),
    nextNodeId: z.string().optional(),
    setsFlags: z.record(z.boolean()).optional(),
    modifiesVariables: z.record(z.number()).optional(),
    feedback: z.string(),
  }).optional(),
  
  // Sin check - acción directa
  action: z.object({
    nextDialogueId: z.string().optional(),
    nextNodeId: z.string().optional(),
    setsFlags: z.record(z.boolean()).optional(),
    modifiesVariables: z.record(z.number()).optional(),
  }).optional(),
})

export type DialogueOption = z.infer<typeof DialogueOption>

/**
 * Línea de diálogo de un NPC
 */
export const DialogueLine = z.object({
  id: z.string(),
  speakerId: z.string(),              // ID del NPC
  speakerName: z.string(),
  text: z.string(),
  
  // Condicionalidad
  showIfTags: z.array(z.string()).optional(),
  showIfFlags: z.array(z.string()).optional(),
  hideIfFlags: z.array(z.string()).optional(),
  
  // Assets de audio
  voiceLineId: z.string().optional(),
  
  // Opciones disponibles tras esta línea
  options: z.array(DialogueOption),
  
  // Fallback si no hay opciones disponibles
  fallbackText: z.string().optional(),
  fallbackNextNodeId: z.string().optional(),
})

export type DialogueLine = z.infer<typeof DialogueLine>

/**
 * Configuración completa de un diálogo
 */
export const DialogueConfig = z.object({
  id: z.string(),
  nodeId: z.string(),
  name: z.string(),
  
  // NPC que habla
  npcId: z.string(),
  npcName: z.string().optional(),
  npcDescription: z.string().optional(),
  npcPortrait: z.string().optional(),
  
  // Árbol de diálogo
  startLineId: z.string(),
  lines: z.array(DialogueLine),
  
  // Acción al completar
  onComplete: z.object({
    nextNodeId: z.string(),
    flags: z.record(z.boolean()).optional(),
    variables: z.record(z.number()).optional(),
  }).optional(),
  
  // Configuración general
  allowMultipleSpeakers: z.boolean().optional(),
  timeoutSeconds: z.number().optional(), // tiempo para responder
  
  // Assets
  ambientAudioId: z.string().optional(),
})

export type DialogueConfig = z.infer<typeof DialogueConfig>

/**
 * Estado de un diálogo en progreso
 */
export const DialogueProgress = z.object({
  dialogueId: z.string(),
  sessionId: z.string(),
  
  currentLineId: z.string(),
  visitedLines: z.array(z.string()),
  
  // Quién está hablando actualmente (si hay speaker lock)
  currentSpeakerId: z.string().nullable(),
  
  // Historial de selecciones
  choices: z.array(z.object({
    lineId: z.string(),
    optionId: z.string(),
    playerId: z.string(),
    timestamp: z.number(),
    checkResult: z.object({
      roll: z.number(),
      dc: z.number(),
      success: z.boolean(),
    }).optional(),
  })),
  
  startedAt: z.number(),
  completedAt: z.number().nullable(),
})

export type DialogueProgress = z.infer<typeof DialogueProgress>

/**
 * NPC predefinidos de la campaña
 */
export interface NPCDefinition {
  id: string
  name: string
  description: string
  portrait?: string
  voicePrompt?: string
  personality: string[]
  
  // Tags que el NPC reconoce/prefiere
  preferredTags?: CharacterTag[]
  
  // Diálogos asociados
  dialogueIds: string[]
}

/**
 * NPCs de Sangrebruma V2
 */
export const SANGREBRUMA_NPCS: NPCDefinition[] = [
  {
    id: 'npc_mara',
    name: 'Mara Carbón',
    description: 'Posadera del Ajo Negro, protectora y desconfiada',
    voicePrompt: 'Voz mujer 35-55, áspera, protectora, humor seco',
    personality: ['protective', 'suspicious', 'pragmatic'],
    preferredTags: ['tag_exorcista', 'tag_nigromante'],
    dialogueIds: ['dialogue_posada_01'],
  },
  {
    id: 'npc_sepulturero',
    name: 'El Sepulturero',
    description: 'Cuidador del Cementerio de San Vid, cínico y directo',
    voicePrompt: 'Voz hombre mayor, seca, cansada, humor negro',
    personality: ['cynical', 'direct', 'fatalistic'],
    preferredTags: ['tag_barbaro'], // Solo habla con bárbaro
    dialogueIds: ['dialogue_cemetery_01'],
  },
  {
    id: 'npc_bibliotecario',
    name: 'Bibliotecario Sin Pupilas',
    description: 'Guardián de la Biblioteca de Hueso, voz suave sin emoción',
    voicePrompt: 'Voz neutra, suave, sin inflexión emocional, inquietante',
    personality: ['detached', 'knowledgeable', 'mysterious'],
    preferredTags: ['tag_erudito', 'tag_nigromante'],
    dialogueIds: ['dialogue_library_01'],
  },
  {
    id: 'npc_conde',
    name: 'Conde de Sangrebruma',
    description: 'Vampiro noble, carismático y manipulador',
    voicePrompt: 'Voz masculina aristocrática, seductora, controlada',
    personality: ['charismatic', 'manipulative', 'arrogant'],
    dialogueIds: ['dialogue_salon_01', 'dialogue_trono_01'],
  },
  {
    id: 'npc_criatura',
    name: 'La Criatura',
    description: 'El Prometeo de Hierro, confundido y atormentado',
    voicePrompt: 'Voz humana rota, mezclada con sonidos metálicos y chispas',
    personality: ['confused', 'tragic', 'questioning'],
    preferredTags: ['tag_medico', 'tag_alquimista', 'tag_barbaro'],
    dialogueIds: ['dialogue_laboratorio_01'],
  },
]

/**
 * Validar si una opción está disponible para el party
 */
export function isOptionAvailable(
  option: DialogueOption,
  partyTags: CharacterTag[],
  flags: Record<string, boolean>
): boolean {
  // Check party tags
  if (option.requiresPartyTags && option.requiresPartyTags.length > 0) {
    const hasAnyTag = option.requiresPartyTags.some(tag => partyTags.includes(tag as CharacterTag))
    if (!hasAnyTag) return false
  }
  
  if (option.requiresAllTags && option.requiresAllTags.length > 0) {
    const hasAllTags = option.requiresAllTags.every(tag => partyTags.includes(tag as CharacterTag))
    if (!hasAllTags) return false
  }
  
  // Check flags
  if (option.requiresFlags && option.requiresFlags.length > 0) {
    const hasAllFlags = option.requiresFlags.every(flag => flags[flag] === true)
    if (!hasAllFlags) return false
  }
  
  if (option.requiresNoFlags && option.requiresNoFlags.length > 0) {
    const hasAnyFlag = option.requiresNoFlags.some(flag => flags[flag] === true)
    if (hasAnyFlag) return false
  }
  
  return true
}

/**
 * Validar si un jugador puede hablar (speaker lock)
 */
export function canPlayerSpeak(
  option: DialogueOption,
  playerTags: CharacterTag[],
  playerId: string
): boolean {
  // Si hay speaker lock por tag
  if (option.speakerLockTag) {
    return playerTags.includes(option.speakerLockTag as CharacterTag)
  }
  
  // Si hay speaker lock por ID
  if (option.speakerLockPlayerId) {
    return playerId === option.speakerLockPlayerId
  }
  
  // Sin lock - cualquiera puede hablar
  return true
}

/**
 * Obtener el hablante apropiado del party
 */
export function getAppropiateSpeaker(
  option: DialogueOption,
  partyMembers: { id: string; tags: CharacterTag[]; name: string }[]
): { id: string; name: string } | null {
  if (!option.speakerLockTag) {
    return null // Cualquiera puede hablar
  }
  
  // Buscar primer jugador con el tag requerido
  const speaker = partyMembers.find(member => 
    member.tags.includes(option.speakerLockTag as CharacterTag)
  )
  
  return speaker ? { id: speaker.id, name: speaker.name } : null
}
