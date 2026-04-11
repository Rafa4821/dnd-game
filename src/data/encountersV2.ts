import type { Encounter } from '@/types/combat'
import { BESTIARY } from './bestiary'

/**
 * Encuentros de Campaña V2
 * 24 encuentros escalables usando el bestiario expandido
 * Basados en Campaña v2.md
 */

export const ENCOUNTERS_V2: Record<string, Encounter> = {
  // ============================================
  // ACTO 1 - CEMENTERIO Y BOSQUE (E01-E08)
  // ============================================
  
  'E01': {
    id: 'E01',
    name: 'Plaga en el Granero',
    description: 'Enjambre de ratas infectadas por la niebla carmesí',
    difficulty: 'easy',
    enemies: [BESTIARY['EN-01']], // 8 Ratas de Cripta
  },
  
  'E02': {
    id: 'E02',
    name: 'Cementerio de San Vid - Primera Ola',
    description: 'Esqueletos y murciélagos emergen de las tumbas',
    difficulty: 'medium',
    enemies: [
      BESTIARY['EN-04'], // 4 Esqueletos
      BESTIARY['EN-03'], // 6 Murciélagos Ceniza
    ],
  },
  
  'E03': {
    id: 'E03',
    name: 'Cripta Profunda',
    description: 'Monjes huecos protegen un sarcófago antiguo',
    difficulty: 'medium',
    enemies: [
      BESTIARY['EN-05'], // 2 Monjes Huecos
      BESTIARY['EN-04'], // 4 Esqueletos
    ],
  },
  
  'E04': {
    id: 'E04',
    name: 'Patrulla del Lobo Blanco',
    description: 'Manada de lobos corrompidos patrulla el bosque',
    difficulty: 'medium',
    enemies: [
      BESTIARY['EN-06'], // 3 Lobos
    ],
  },
  
  'E05': {
    id: 'E05',
    name: 'Emboscada Vampírica',
    description: 'Un neófito vampírico ataca desde las sombras',
    difficulty: 'hard',
    enemies: [
      BESTIARY['EN-07'], // 1 Neófito Vampírico
      BESTIARY['EN-03'], // 6 Murciélagos Ceniza (refuerzos)
    ],
  },
  
  'E06': {
    id: 'E06',
    name: 'Puente de los Colgados - Guardianes',
    description: 'Ahogados de soga custodian el puente',
    difficulty: 'hard',
    enemies: [
      BESTIARY['EN-09'], // 2 Ahogados de Soga
    ],
  },
  
  'E07': {
    id: 'E07',
    name: 'Entrada a Catacumbas',
    description: 'Ghouls hambrientos acechan en la oscuridad',
    difficulty: 'medium',
    enemies: [
      BESTIARY['EN-11'], // 3 Ghouls
    ],
  },
  
  'E08': {
    id: 'E08',
    name: 'Guardián del Puente',
    description: 'El Guardián de Cuerda bloquea el paso',
    difficulty: 'hard',
    enemies: [
      BESTIARY['EN-10'], // 1 Guardián de Cuerda (Elite)
      BESTIARY['EN-09'], // 2 Ahogados de Soga
    ],
  },
  
  // ============================================
  // ACTO 2 - ABADÍA Y LABORATORIO (E09-E16)
  // ============================================
  
  'E09': {
    id: 'E09',
    name: 'Pasillos de la Abadía',
    description: 'Esqueletos y monjes huecos patrullan',
    difficulty: 'medium',
    enemies: [
      BESTIARY['EN-05'], // 2 Monjes Huecos
      BESTIARY['EN-04'], // 4 Esqueletos
    ],
  },
  
  'E10': {
    id: 'E10',
    name: 'Biblioteca de Hueso - Custodios',
    description: 'Bibliotecarios de hueso protegen el conocimiento prohibido',
    difficulty: 'hard',
    enemies: [
      BESTIARY['EN-12'], // 2 Bibliotecarios de Hueso
      BESTIARY['EN-05'], // 2 Monjes Huecos
    ],
  },
  
  'E11': {
    id: 'E11',
    name: 'Taller Galvánico - Defensas',
    description: 'Autómatas cobrizos defienden el laboratorio',
    difficulty: 'hard',
    enemies: [
      BESTIARY['EN-13'], // 1 Autómata Cobrizo
      BESTIARY['EN-04'], // 4 Esqueletos
    ],
  },
  
  'E12': {
    id: 'E12',
    name: 'Laboratorio - La Criatura',
    description: 'El Prometeo de Hierro se despierta',
    difficulty: 'deadly',
    enemies: [
      BESTIARY['BOSS-01'], // La Criatura (BOSS)
    ],
  },
  
  'E13': {
    id: 'E13',
    name: 'Torre del Reloj - Oleada 1',
    description: 'Primera oleada: lobos y murciélagos',
    difficulty: 'medium',
    enemies: [
      BESTIARY['EN-06'], // 3 Lobos
      BESTIARY['EN-03'], // 6 Murciélagos
    ],
  },
  
  'E14': {
    id: 'E14',
    name: 'Torre del Reloj - Oleada 2',
    description: 'Segunda oleada: ghouls y neófito',
    difficulty: 'hard',
    enemies: [
      BESTIARY['EN-11'], // 3 Ghouls
      BESTIARY['EN-07'], // 1 Neófito Vampírico
    ],
  },
  
  'E15': {
    id: 'E15',
    name: 'Torre del Reloj - Alfa',
    description: 'El Hombre Lobo Alfa desciende',
    difficulty: 'deadly',
    enemies: [
      BESTIARY['BOSS-02'], // Alfa de Sangrebruma (BOSS)
    ],
  },
  
  'E16': {
    id: 'E16',
    name: 'Catacumbas Profundas',
    description: 'Ghouls y ahogados infestan las catacumbas',
    difficulty: 'hard',
    enemies: [
      BESTIARY['EN-11'], // 3 Ghouls
      BESTIARY['EN-09'], // 2 Ahogados de Soga
    ],
  },
  
  // ============================================
  // ACTO 3 - CASTILLO DEL CONDE (E17-E24)
  // ============================================
  
  'E17': {
    id: 'E17',
    name: 'Patio del Castillo - Oleada 1',
    description: 'Guardias del Conde y gárgolas',
    difficulty: 'hard',
    enemies: [
      BESTIARY['EN-16'], // 4 Guardias del Conde
      BESTIARY['EN-15'], // 2 Gárgolas
    ],
  },
  
  'E18': {
    id: 'E18',
    name: 'Patio del Castillo - Oleada 2',
    description: 'Refuerzos: neófitos y lobos',
    difficulty: 'hard',
    enemies: [
      BESTIARY['EN-07'], // 1 Neófito Vampírico
      BESTIARY['EN-06'], // 3 Lobos
      BESTIARY['EN-16'], // 4 Guardias
    ],
  },
  
  'E19': {
    id: 'E19',
    name: 'Prisiones del Castillo',
    description: 'Carcelero espectral y prisioneros no-muertos',
    difficulty: 'hard',
    enemies: [
      BESTIARY['EN-17'], // 1 Carcelero Espectral
      BESTIARY['EN-11'], // 3 Ghouls
    ],
  },
  
  'E20': {
    id: 'E20',
    name: 'Cripta Real',
    description: 'Acólitos de sangre realizan un ritual',
    difficulty: 'hard',
    enemies: [
      BESTIARY['EN-18'], // 3 Acólitos de Sangre
      BESTIARY['EN-04'], // 4 Esqueletos
    ],
  },
  
  'E21': {
    id: 'E21',
    name: 'Salón de Mármol Negro - Guardias',
    description: 'Elite del Conde custodia el salón',
    difficulty: 'hard',
    enemies: [
      BESTIARY['EN-16'], // 4 Guardias del Conde
      BESTIARY['EN-07'], // 1 Neófito Vampírico
    ],
  },
  
  'E22': {
    id: 'E22',
    name: 'Trono de Sangre - El Conde',
    description: 'Enfrentamiento final con el Conde de Sangrebruma',
    difficulty: 'deadly',
    enemies: [
      BESTIARY['BOSS-03'], // Conde de Sangrebruma (BOSS)
    ],
  },
  
  'E23': {
    id: 'E23',
    name: 'Observatorio - Horror Cósmico',
    description: 'Encuentro opcional: el Astro-Horror',
    difficulty: 'deadly',
    enemies: [
      BESTIARY['EN-19'], // Astro-Horror
    ],
  },
  
  'E24': {
    id: 'E24',
    name: 'Escape del Castillo',
    description: 'Horda final mientras el castillo colapsa',
    difficulty: 'hard',
    enemies: [
      BESTIARY['EN-04'], // 4 Esqueletos
      BESTIARY['EN-11'], // 3 Ghouls
      BESTIARY['EN-06'], // 3 Lobos
    ],
  },
}

/**
 * Buscar encuentro por ID
 */
export function getEncounterById(id: string): Encounter | undefined {
  return ENCOUNTERS_V2[id]
}

/**
 * Filtrar encuentros por dificultad
 */
export function getEncountersByDifficulty(difficulty: 'easy' | 'medium' | 'hard' | 'deadly'): Encounter[] {
  return Object.values(ENCOUNTERS_V2).filter(enc => enc.difficulty === difficulty)
}

/**
 * Obtener encuentros de un acto específico
 */
export function getEncountersByAct(act: 1 | 2 | 3): Encounter[] {
  const ranges = {
    1: ['E01', 'E02', 'E03', 'E04', 'E05', 'E06', 'E07', 'E08'],
    2: ['E09', 'E10', 'E11', 'E12', 'E13', 'E14', 'E15', 'E16'],
    3: ['E17', 'E18', 'E19', 'E20', 'E21', 'E22', 'E23', 'E24'],
  }
  
  return ranges[act]
    .map(id => ENCOUNTERS_V2[id])
    .filter(Boolean)
}
