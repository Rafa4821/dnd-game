import type { Encounter } from '@/types/combat'

/**
 * Encuentros de combate para la campaña Sangrebruma
 * Basados en SRD 5.1
 */

export const SANGREBRUMA_ENCOUNTERS: Record<string, Encounter> = {
  'SB-E_CEMETERY1': {
    id: 'SB-E_CEMETERY1',
    name: 'Emboscada en el Cementerio',
    description: 'No-muertos emergen de las tumbas',
    difficulty: 'medium',
    enemies: [
      {
        id: 'zombie_1',
        name: 'Zombi',
        hp: 22,
        ac: 8,
        attackBonus: 3,
        damage: '1d6+1',
        cr: 0.25,
        count: 3,
      },
      {
        id: 'skeleton_1',
        name: 'Esqueleto',
        hp: 13,
        ac: 13,
        attackBonus: 4,
        damage: '1d6+2',
        cr: 0.25,
        count: 2,
      },
    ],
  },

  'SB-E_ABBEY_GUARDS': {
    id: 'SB-E_ABBEY_GUARDS',
    name: 'Guardianes de la Abadía',
    description: 'Sirvientes del vampiro custodian la entrada',
    difficulty: 'hard',
    enemies: [
      {
        id: 'ghoul_1',
        name: 'Ghoul',
        hp: 22,
        ac: 12,
        attackBonus: 4,
        damage: '2d6+2',
        cr: 1,
        count: 2,
      },
      {
        id: 'zombie_2',
        name: 'Zombi Fortificado',
        hp: 30,
        ac: 10,
        attackBonus: 4,
        damage: '1d8+2',
        cr: 0.5,
        count: 3,
      },
    ],
  },

  'SB-E_FINAL_BOSS': {
    id: 'SB-E_FINAL_BOSS',
    name: 'El Noble Vampiro',
    description: 'Enfrentamiento final contra el vampiro y sus guardias de élite',
    difficulty: 'deadly',
    enemies: [
      {
        id: 'vampire_spawn_1',
        name: 'Vástago Vampírico',
        hp: 82,
        ac: 15,
        attackBonus: 6,
        damage: '1d6+3',
        cr: 5,
        count: 1,
      },
      {
        id: 'ghoul_elite',
        name: 'Ghoul de Élite',
        hp: 35,
        ac: 14,
        attackBonus: 5,
        damage: '2d6+3',
        cr: 2,
        count: 2,
      },
    ],
  },

  'SB-E_CRYPT_PATROL': {
    id: 'SB-E_CRYPT_PATROL',
    name: 'Patrulla de las Criptas',
    description: 'Guardias no-muertos en las profundidades',
    difficulty: 'medium',
    enemies: [
      {
        id: 'skeleton_2',
        name: 'Esqueleto Guardián',
        hp: 18,
        ac: 14,
        attackBonus: 5,
        damage: '1d8+3',
        cr: 0.5,
        count: 4,
      },
    ],
  },
}

/**
 * Obtener encuentro por ID
 */
export function getEncounterById(encounterId: string): Encounter | undefined {
  return SANGREBRUMA_ENCOUNTERS[encounterId]
}

/**
 * Obtener todos los encuentros
 */
export function getAllEncounters(): Encounter[] {
  return Object.values(SANGREBRUMA_ENCOUNTERS)
}
