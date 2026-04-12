import { z } from 'zod'

/**
 * Sistema de Tags para Campaña V2
 * Los tags se usan para:
 * - Opciones de diálogo específicas
 * - Speaker locks (NPCs que solo hablan con ciertos roles)
 * - Puzzles cooperativos que asignan piezas por jugador
 * - Habilidades especiales en combate
 */

// Tags de Clase/Rol
export const CLASS_TAGS = [
  'tag_barbaro',
  'tag_nigromante',
  'tag_exorcista',
  'tag_alquimista',
  'tag_cazador_látigo',
  'tag_tirador',
  'tag_medico',
  'tag_control',
  'tag_lider',
  'tag_dhampir',
  'tag_maldito',
  'tag_duelista',
  'tag_explorador',
  'tag_rastreador',
] as const

// Tags de Características Sociales
export const SOCIAL_TAGS = [
  'tag_intimidante',
  'tag_erudito',
  'tag_mediador',
  'tag_sigilo',
  'tag_fe',
  'tag_metodico',
  'tag_trickster',
  'tag_llaves',
  'tag_circuito',
  'tag_espejos',
  'tag_trauma',
  'tag_empatia',
  'tag_bosque',
  'tag_practico',
  'tag_memoria',
  'tag_frontline',
  'tag_invitacion',
  'tag_sombra',
  'tag_maldicion',
  'tag_luna',
  'tag_protector',
  'tag_tank',
  'tag_support',
  'tag_utility',
  'tag_ranged',
  'tag_frio',
  'tag_anti_licantropos',
] as const

// Todos los tags disponibles
export const ALL_TAGS = [...CLASS_TAGS, ...SOCIAL_TAGS] as const

export type CharacterTag = typeof ALL_TAGS[number]

/**
 * Schema de validación para tags
 */
export const CharacterTagSchema = z.enum(ALL_TAGS)

/**
 * Verificar si un jugador/party tiene un tag específico
 */
export function hasTag(tags: CharacterTag[], requiredTag: CharacterTag): boolean {
  return tags.includes(requiredTag)
}

/**
 * Verificar si el party tiene al menos uno de los tags requeridos
 */
export function hasAnyTag(tags: CharacterTag[], requiredTags: CharacterTag[]): boolean {
  return requiredTags.some(tag => tags.includes(tag))
}

/**
 * Verificar si el party tiene todos los tags requeridos
 */
export function hasAllTags(tags: CharacterTag[], requiredTags: CharacterTag[]): boolean {
  return requiredTags.every(tag => tags.includes(tag))
}

/**
 * Obtener todos los tags únicos de un party
 */
export function getPartyTags(partyCharacterTags: CharacterTag[][]): CharacterTag[] {
  const allTags = partyCharacterTags.flat()
  return Array.from(new Set(allTags))
}

/**
 * Descripción de cada tag (para UI/tooltips)
 */
export const TAG_DESCRIPTIONS: Record<CharacterTag, string> = {
  // Clase/Rol
  tag_barbaro: 'Guerrero feroz con fuerza sobrehumana',
  tag_nigromante: 'Maestro de los muertos y la magia oscura',
  tag_exorcista: 'Cazador de no-muertos con poder divino',
  tag_alquimista: 'Creador de pociones y explosivos',
  tag_cazador_látigo: 'Especialista en látigo consagrado',
  tag_tirador: 'Maestro del combate a distancia',
  tag_medico: 'Sanador y conocedor de anatomía',
  tag_control: 'Manipulador de magia y mentes',
  tag_lider: 'Inspirador nato del grupo',
  tag_dhampir: 'Ser entre dos mundos, humano y vampiro',
  tag_maldito: 'Transformado por experimento maldito',
  tag_duelista: 'Maestro del combate cuerpo a cuerpo elegante',
  tag_explorador: 'Guía experto de rutas y terrenos',
  tag_rastreador: 'Seguidor de huellas y rastros',
  
  // Social
  tag_intimidante: 'Presencia amenazadora y dominante',
  tag_erudito: 'Amplio conocimiento de lore y arcanos',
  tag_mediador: 'Hábil en negociación y persuasión',
  tag_sigilo: 'Experto en ocultarse y moverse en silencio',
  tag_fe: 'Conexión profunda con lo divino',
  tag_metodico: 'Enfoque ordenado y sistemático',
  tag_trickster: 'Astuto y engañoso',
  tag_llaves: 'Experto en cerraduras y mecanismos',
  tag_circuito: 'Conocedor de sistemas galvánicos',
  tag_espejos: 'Conectado con reflejos y verdades ocultas',
  tag_trauma: 'Marcado por experiencias dolorosas',
  tag_empatia: 'Profunda comprensión de otros',
  tag_bosque: 'En sintonía con la naturaleza salvaje',
  tag_practico: 'Soluciones directas y eficientes',
  tag_memoria: 'Guardián de historias olvidadas',
  tag_frontline: 'Primera línea de combate',
  tag_invitacion: 'Responde a protocolos vampíricos',
  tag_sombra: 'Maestro de la oscuridad',
  tag_maldicion: 'Afectado por maldición',
  tag_luna: 'Influenciado por ciclos lunares',
  tag_protector: 'Defensor de aliados',
  tag_tank: 'Absorbe daño por el grupo',
  tag_support: 'Apoya y potencia aliados',
  tag_utility: 'Versatilidad táctica',
  tag_ranged: 'Especialista en combate a distancia',
  tag_frio: 'Calculador y distante',
  tag_anti_licantropos: 'Especializado contra licántropos',
}

/**
 * Mapeo de clases a tags por defecto
 */
export const CLASS_TO_TAGS: Record<string, CharacterTag[]> = {
  fighter: ['tag_cazador_látigo', 'tag_intimidante'],
  barbarian: ['tag_barbaro', 'tag_intimidante'],
  rogue: ['tag_alquimista', 'tag_sigilo'],
  ranger: ['tag_tirador'],
  cleric: ['tag_exorcista', 'tag_fe', 'tag_mediador'],
  wizard: ['tag_nigromante', 'tag_erudito'],
  paladin: ['tag_lider', 'tag_fe'],
}
