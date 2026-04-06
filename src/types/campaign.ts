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
])

export type NodeType = z.infer<typeof NodeType>

// Opción de decisión
export const DecisionOption = z.object({
  id: z.string(),
  text: z.string(),
  nextNodeId: z.string(),
  requirements: z.array(z.string()).optional(), // flags requeridos
  setsFlags: z.record(z.boolean()).optional(),  // flags que setea
})

export type DecisionOption = z.infer<typeof DecisionOption>

// Check de habilidad
export const SkillCheck = z.object({
  skill: z.string(), // 'perception', 'athletics', etc.
  dc: z.number(),
  successNodeId: z.string(),
  failureNodeId: z.string(),
  groupCheck: z.boolean().default(false), // ¿todos deben pasar?
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
  
  // Efectos
  setsFlags: z.record(z.boolean()).optional(),
  modifiesVariables: z.record(z.number()).optional(),
  
  // Metadata
  act: z.number().int().min(1).max(3).default(1),
  location: z.string().optional(),
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
    metadata: z.any().optional(),
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
  metadata?: any
}

/**
 * Evaluar si un nodo está disponible basado en flags
 */
export function isNodeAvailable(
  node: CampaignNode,
  currentFlags: Record<string, boolean>
): boolean {
  // Si el nodo no tiene opciones, está disponible
  if (!node.options || node.options.length === 0) return true
  
  // Verificar si al menos una opción es válida
  return node.options.some(option => {
    if (!option.requirements) return true
    return option.requirements.every(flag => currentFlags[flag] === true)
  })
}

/**
 * Evaluar requisitos de una opción
 */
export function meetsRequirements(
  requirements: string[] | undefined,
  currentFlags: Record<string, boolean>
): boolean {
  if (!requirements || requirements.length === 0) return true
  return requirements.every(flag => currentFlags[flag] === true)
}
