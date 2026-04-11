import type { PuzzleConfig } from '@/types/puzzle'

/**
 * Puzzles predefinidos de la campaña
 */

export const PUZZLES: Record<string, PuzzleConfig> = {
  // N03 - La Rueda de Ceniza
  puzzle_rueda_ceniza: {
    id: 'puzzle_rueda_ceniza',
    nodeId: 'N03',
    type: 'wheel',
    name: 'La Rueda de Ceniza',
    description: 'Tres anillos concéntricos con símbolos grabados. El mapa muestra la secuencia: Luna exterior, Sol centro, Espada interior.',
    minPlayers: 2,
    maxPlayers: 6,
    elements: [
      { id: 'ring_outer', type: 'ring', value: 0, ownerId: null, position: 0, locked: false },
      { id: 'ring_middle', type: 'ring', value: 0, ownerId: null, position: 0, locked: false },
      { id: 'ring_inner', type: 'ring', value: 0, ownerId: null, position: 0, locked: false },
    ],
    solution: [2, 1, 3], // Luna=2, Sol=1, Espada=3
    hintsAvailable: 3,
    hints: [
      'Los símbolos deben formar una línea vertical...',
      'El mapa muestra tres símbolos en orden',
      'Luna arriba, Sol en medio, Espada abajo',
    ],
    onSuccess: {
      nextNodeId: 'N05',
      flags: { F_PUZZLE_RUEDA_RESUELTO: true },
    },
    onFailure: {
      nextNodeId: 'N04',
      flags: { F_PUZZLE_RUEDA_FALLADO: true },
    },
  },

  // Puzzle de ejemplo para otros nodos
  puzzle_coro_campanas: {
    id: 'puzzle_coro_campanas',
    nodeId: 'N12',
    type: 'sequence',
    name: 'El Coro de Campanas',
    description: 'Cinco campanas de bronce cuelgan del campanario. Deben sonar en el orden correcto.',
    minPlayers: 2,
    maxPlayers: 6,
    elements: [
      { id: 'bell_1', type: 'button', value: 0, ownerId: null, position: 0, locked: false },
      { id: 'bell_2', type: 'button', value: 0, ownerId: null, position: 1, locked: false },
      { id: 'bell_3', type: 'button', value: 0, ownerId: null, position: 2, locked: false },
      { id: 'bell_4', type: 'button', value: 0, ownerId: null, position: 3, locked: false },
      { id: 'bell_5', type: 'button', value: 0, ownerId: null, position: 4, locked: false },
    ],
    solution: [3, 1, 4, 2, 5], // Secuencia específica
    hintsAvailable: 2,
    hints: [
      'Las grietas en las campanas forman números...',
      'La secuencia empieza en la campana central',
    ],
    onSuccess: {
      nextNodeId: 'N13',
      flags: { F_CAMPANAS_RESUELTO: true },
    },
    onFailure: {
      nextNodeId: 'N12_COMBAT',
    },
  },
}

/**
 * Obtener configuración de puzzle por ID
 */
export function getPuzzleConfig(puzzleId: string): PuzzleConfig | undefined {
  return PUZZLES[puzzleId]
}
