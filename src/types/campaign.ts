import { z } from 'zod'

/**
 * Tipos para el sistema de campaña basado en CAMPAÑA.md
 * Campaña Sangrebruma con 16 nodos y grafo de decisiones
 */

// Tipos de nodo
export const NodeType = z.enum([
  'narrative',  // Narrativa pura
  'decision',   // Elección binaria o múltiple
  'check',      // Skill check o saving throw
  'combat',     // Encuentro de combate
  'rest',       // Descanso corto/largo
  'puzzle',     // Puzzle cooperativo (V2)
  'dialogue',   // Diálogo condicional (V2)
])

export type NodeType = z.infer<typeof NodeType>

// Opción de decisión (V2 mejorado)
export const DecisionOption = z.object({
  id: z.string(),
  text: z.string(),
  nextNodeId: z.string().optional(),
  
  // V2: Requirements como objeto de flags en lugar de array
  requirements: z.union([
    z.array(z.string()),
    z.record(z.boolean()),
  ]).optional(),
  
  setsFlags: z.record(z.boolean()).optional(),
  modifiesVariables: z.record(z.number()).optional(),
  
  // V2: Check inline en opción
  check: z.object({
    skill: z.string(),
    dc: z.number(),
  }).optional(),
})

export type DecisionOption = z.infer<typeof DecisionOption>

// Check de habilidad (V2 mejorado)
export const SkillCheck = z.object({
  skill: z.string(), // 'perception', 'athletics', etc.
  dc: z.number(),
  
  // Mantener compatibilidad con V1
  successNodeId: z.string().optional(),
  failureNodeId: z.string().optional(),
  groupCheck: z.boolean().optional().default(false),
  
  // V2: Resultados más ricos
  onSuccess: z.object({
    description: z.string(),
    nextNodeId: z.string(),
    setsFlags: z.record(z.boolean()).optional(),
    modifiesVariables: z.record(z.number()).optional(),
  }).optional(),
  
  onFailure: z.object({
    description: z.string(),
    nextNodeId: z.string(),
    setsFlags: z.record(z.boolean()).optional(),
    modifiesVariables: z.record(z.number()).optional(),
  }).optional(),
})

export type SkillCheck = z.infer<typeof SkillCheck>

// Nodo de campaña
export const CampaignNode = z.object({
  id: z.string(),
  type: NodeType,
  title: z.string(),
  description: z.string(),
  
  // Para nodos narrativos
  nextNodeId: z.string().nullable(),
  
  // Para nodos de decisión
  options: z.array(DecisionOption).optional(),
  
  // Para nodos de check
  check: SkillCheck.nullable(),
  
  // Para nodos de combate
  encounterId: z.string().nullable(),
  
  // Campaña V2 - Puzzles y diálogos
  puzzleId: z.string().optional(),    // ID del puzzle cooperativo
  dialogueId: z.string().optional(),  // ID del diálogo condicional
  
  // Campaña V2 - Assets multimodales
  assetManifestId: z.string().optional(), // ID del manifiesto de assets
  
  // Efectos
  setsFlags: z.record(z.boolean()).optional(),
  modifiesVariables: z.record(z.number()).optional(),
  
  // Metadata
  act: z.number().int().min(1).max(3).default(1),
  location: z.string().optional(),
  
  // Escalado por número de jugadores
  scaling: z.object({
    minPlayers: z.number().default(2),
    maxPlayers: z.number().default(6),
    modifications: z.record(z.any()).optional(), // Cambios por player count
  }).optional(),
})

export type CampaignNode = z.infer<typeof CampaignNode>

// Estado de progreso de campaña
export const CampaignProgress = z.object({
  sessionId: z.string(),
  currentNodeId: z.string(),
  visitedNodes: z.array(z.string()),
  flags: z.record(z.boolean()),
  variables: z.record(z.number()),
  logs: z.array(z.object({
    id: z.string(),
    timestamp: z.number(),
    nodeId: z.string(),
    type: z.enum(['narrative', 'decision', 'check', 'combat', 'system']),
    content: z.string(),
    metadata: z.record(z.unknown()).optional(),
  })),
  createdAt: z.number(),
  updatedAt: z.number(),
})

export type CampaignProgress = z.infer<typeof CampaignProgress>

// Log entry
export interface LogEntry {
  id: string
  timestamp: number
  nodeId: string
  type: 'narrative' | 'decision' | 'check' | 'combat' | 'system'
  content: string
  metadata?: Record<string, unknown>
}

/**
 * Evaluar si un nodo está disponible basado en flags
 */
/**
 * Evaluar requisitos de una opción
 */
export function meetsRequirements(
  requirements: string[] | Record<string, boolean> | undefined,
  flags: Record<string, boolean>
): boolean {
  if (!requirements) return true
  
  // Si es array de strings (V1)
  if (Array.isArray(requirements)) {
    if (requirements.length === 0) return true
    return requirements.every((flag) => flags[flag] === true)
  }
  
  // Si es objeto (V2)
  return Object.entries(requirements).every(([flag, required]) => {
    if (!required) return true
    return flags[flag] === true
  })
}
