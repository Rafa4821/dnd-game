import { z } from 'zod'
// CharacterTag import removed - not used yet

/**
 * Tipos para Puzzles Cooperativos - Campaña V2
 * Puzzles escalables 2-6 jugadores con anti-estancamiento
 */

// Tipos de puzzle
export const PuzzleType = z.enum([
  'wheel',      // La Rueda de Ceniza (dial/anillos)
  'sequence',   // Secuencias (campanas, circuito)
  'audio',      // Eco de nombres (susurros)
  'visual',     // Vitrales, símbolos
  'lock',       // Llaves y cerraduras
])

export type PuzzleType = z.infer<typeof PuzzleType>

// Estado de un puzzle
export const PuzzleState = z.enum([
  'not_started',
  'in_progress',
  'solved',
  'failed',
  'hint_available',
])

export type PuzzleState = z.infer<typeof PuzzleState>

/**
 * Elemento de un puzzle (pieza/fragmento)
 */
export const PuzzleElement = z.object({
  id: z.string(),
  type: z.string(), // 'ring', 'symbol', 'key', 'note', etc.
  value: z.any(),   // número, símbolo, audio URL, etc.
  ownerId: z.string().nullable(), // qué jugador controla este elemento
  position: z.number().optional(),
  locked: z.boolean().default(false),
})

export type PuzzleElement = z.infer<typeof PuzzleElement>

/**
 * Configuración de un puzzle
 */
export const PuzzleConfig = z.object({
  id: z.string(),
  nodeId: z.string(),
  type: PuzzleType,
  name: z.string(),
  description: z.string(),
  
  // Configuración por número de jugadores
  minPlayers: z.number().min(1).default(2),
  maxPlayers: z.number().max(6).default(6),
  
  // Elementos del puzzle
  elements: z.array(PuzzleElement),
  solution: z.any(), // estructura de la solución correcta
  
  // Anti-estancamiento
  maxAttempts: z.number().optional(),
  hintsAvailable: z.number().default(3),
  hints: z.array(z.string()).optional(), // Lista de pistas textuales
  hintCost: z.object({
    type: z.enum(['corruption', 'time', 'resource']),
    value: z.number(),
  }).optional(),
  
  // Condiciones
  requiredTags: z.array(z.string()).optional(),
  requiredFlags: z.array(z.string()).optional(),
  
  // Recompensas
  onSuccess: z.object({
    flags: z.record(z.boolean()).optional(),
    variables: z.record(z.number()).optional(),
    nextNodeId: z.string(),
    rewards: z.array(z.string()).optional(),
  }),
  
  onFailure: z.object({
    flags: z.record(z.boolean()).optional(),
    variables: z.record(z.number()).optional(),
    nextNodeId: z.string().optional(),
    penalty: z.string().optional(),
  }),
})

export type PuzzleConfig = z.infer<typeof PuzzleConfig>

/**
 * Estado actual de un puzzle en progreso
 */
export const PuzzleProgress = z.object({
  puzzleId: z.string(),
  sessionId: z.string(),
  state: PuzzleState,
  
  // Estado de elementos
  currentElements: z.array(PuzzleElement),
  
  // Progreso
  attemptCount: z.number().default(0),
  hintsUsed: z.number().default(0),
  playerMoves: z.array(z.object({
    playerId: z.string(),
    elementId: z.string(),
    action: z.string(),
    value: z.any(),
    timestamp: z.number(),
  })),
  
  // Timestamps
  startedAt: z.number(),
  solvedAt: z.number().nullable(),
})

export type PuzzleProgress = z.infer<typeof PuzzleProgress>

/**
 * Configuración específica para La Rueda de Ceniza
 */
export interface WheelPuzzleConfig {
  rings: {
    id: string
    type: 'symbol' | 'number' | 'rune'
    positions: string[] // valores posibles
    correctPosition: number
    controllerId: string | null // jugador que controla este anillo
  }[]
  alignmentRequired: boolean // ¿todos deben estar alineados simultáneamente?
  rotationLocked: boolean // ¿hay turnos/restricciones?
}

/**
 * Configuración para puzzle de secuencia (campanas, circuito)
 */
export interface SequencePuzzleConfig {
  sequence: {
    id: string
    value: string | number
    playerId: string | null // quién tiene este fragmento
    audioUrl?: string // si es audio
    visualHint?: string
  }[]
  correctOrder: string[]
  timing?: {
    windowMs: number // ventana de tiempo para ejecutar
    sequential: boolean // ¿debe ser en orden?
  }
}

/**
 * Distribución de elementos por número de jugadores
 */
export function distributeElements(
  totalElements: number,
  playerCount: number
): number[] {
  const elementsPerPlayer = Math.floor(totalElements / playerCount)
  const remainder = totalElements % playerCount
  
  const distribution: number[] = []
  for (let i = 0; i < playerCount; i++) {
    distribution.push(elementsPerPlayer + (i < remainder ? 1 : 0))
  }
  
  return distribution
}

/**
 * Validar si una solución es correcta
 */
export function validateSolution(
  currentElements: PuzzleElement[],
  solution: unknown,
  puzzleType: PuzzleType,
  _puzzleConfig: PuzzleConfig
): boolean {
  switch (puzzleType) {
    case 'wheel': {
      // Verificar alineación de anillos
      const wheelSolution = solution as number[]
      return currentElements.every((el, idx) => {
        if (el.type === 'ring' && typeof wheelSolution[idx] === 'number') {
          return el.position === wheelSolution[idx]
        }
        return false
      })
    }
    
    case 'sequence': {
      const currentOrder = currentElements.map(el => el.id)
      return JSON.stringify(currentOrder) === JSON.stringify(solution)
    }
    
    case 'lock': {
      // Verificar empareamiento correcto
      const lockSolution = solution as Record<string, unknown>
      return currentElements.every(el => {
        return lockSolution[el.id] === el.value
      })
    }
    
    default:
      return false
  }
}

/**
 * Generar hint basado en estado actual
 */
export function generateHint(
  config: PuzzleConfig,
  hintLevel: number
): string {
  const hints: Record<PuzzleType, string[]> = {
    wheel: [
      'Los símbolos deben formar una línea...',
      'El anillo exterior marca el inicio',
      'La pista está en el cementerio',
    ],
    sequence: [
      'Escucha el patrón que se repite',
      'El orden importa más que la velocidad',
      'Compara lo que cada uno escucha',
    ],
    audio: [
      'La palabra verdadera se repite',
      'Dos jugadores escuchan lo mismo',
      'Ignora las palabras únicas',
    ],
    visual: [
      'La luz revela lo oculto',
      'Cada panel ilumina una parte',
      'Deben girar juntos',
    ],
    lock: [
      'Cada llave tiene su cerradura',
      'Los símbolos deben coincidir',
      'No todas las llaves se usan',
    ],
  }
  
  const puzzleHints = hints[config.type] || []
  return puzzleHints[Math.min(hintLevel, puzzleHints.length - 1)] || 'Sin más pistas disponibles'
}
