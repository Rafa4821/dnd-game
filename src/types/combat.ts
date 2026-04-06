import { z } from 'zod'

/**
 * Tipos para el sistema de combate táctico por turnos
 * Paquete 7: Runtime de combate
 */

// ============================================
// COMBATIENTES
// ============================================

export const CombatantType = z.enum(['player', 'enemy'])
export type CombatantType = z.infer<typeof CombatantType>

export const Combatant = z.object({
  id: z.string(),
  type: CombatantType,
  name: z.string(),
  hp: z.number(),
  maxHp: z.number(),
  ac: z.number(),
  initiative: z.number(),
  
  // Para jugadores, referencia al personaje
  characterId: z.string().nullable(),
  
  // Para enemigos
  enemyData: z.object({
    attackBonus: z.number(),
    damage: z.string(), // ej: "1d8+2"
    cr: z.number(),
  }).nullable(),
  
  // Estado
  conditions: z.array(z.string()).default([]),
  isDead: z.boolean().default(false),
  hasActed: z.boolean().default(false),
})
export type Combatant = z.infer<typeof Combatant>

// ============================================
// ACCIONES DE COMBATE
// ============================================

export const CombatActionType = z.enum([
  'attack',
  'dash',
  'disengage',
  'dodge',
  'help',
  'hide',
  'ready',
  'search',
  'use_object',
])
export type CombatActionType = z.infer<typeof CombatActionType>

export const CombatAction = z.object({
  type: CombatActionType,
  actorId: z.string(),
  targetId: z.string().nullable(),
  result: z.object({
    hit: z.boolean().optional(),
    damage: z.number().optional(),
    critical: z.boolean().optional(),
    description: z.string(),
  }),
  timestamp: z.number(),
})
export type CombatAction = z.infer<typeof CombatAction>

// ============================================
// ENCUENTROS
// ============================================

export const Enemy = z.object({
  id: z.string(),
  name: z.string(),
  hp: z.number(),
  ac: z.number(),
  attackBonus: z.number(),
  damage: z.string(),
  cr: z.number(),
  count: z.number().default(1),
})
export type Enemy = z.infer<typeof Enemy>

export const Encounter = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  enemies: z.array(Enemy),
  difficulty: z.enum(['easy', 'medium', 'hard', 'deadly']),
})
export type Encounter = z.infer<typeof Encounter>

// ============================================
// ESTADO DE COMBATE
// ============================================

export const CombatState = z.object({
  encounterId: z.string(),
  sessionId: z.string(),
  combatants: z.array(Combatant),
  turnOrder: z.array(z.string()), // IDs en orden de iniciativa
  currentTurnIndex: z.number(),
  round: z.number(),
  actions: z.array(CombatAction),
  isActive: z.boolean(),
  startedAt: z.number(),
  endedAt: z.number().nullable(),
})
export type CombatState = z.infer<typeof CombatState>

// ============================================
// UTILIDADES
// ============================================

/**
 * Obtener el combatiente actual
 */
export function getCurrentCombatant(state: CombatState): Combatant | null {
  const currentId = state.turnOrder[state.currentTurnIndex]
  return state.combatants.find(c => c.id === currentId) || null
}

/**
 * Verificar si el combate ha terminado
 */
export function isCombatOver(state: CombatState): { over: boolean; victory: boolean } {
  const playersAlive = state.combatants.filter(c => c.type === 'player' && !c.isDead).length
  const enemiesAlive = state.combatants.filter(c => c.type === 'enemy' && !c.isDead).length
  
  if (playersAlive === 0) {
    return { over: true, victory: false } // Derrota
  }
  
  if (enemiesAlive === 0) {
    return { over: true, victory: true } // Victoria
  }
  
  return { over: false, victory: false }
}

/**
 * Calcular modificador de habilidad
 */
export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

/**
 * Determinar siguiente turno (skip muertos)
 */
export function getNextTurnIndex(state: CombatState): number {
  let nextIndex = (state.currentTurnIndex + 1) % state.turnOrder.length
  let iterations = 0
  
  // Buscar siguiente combatiente vivo
  while (iterations < state.turnOrder.length) {
    const nextId = state.turnOrder[nextIndex]
    const combatant = state.combatants.find(c => c.id === nextId)
    
    if (combatant && !combatant.isDead) {
      return nextIndex
    }
    
    nextIndex = (nextIndex + 1) % state.turnOrder.length
    iterations++
  }
  
  // Si todos están muertos (no debería pasar), retornar index actual
  return state.currentTurnIndex
}
