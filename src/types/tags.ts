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
] as const

// Tags de Características Sociales
export const SOCIAL_TAGS = [
  'tag_intimidante',
  'tag_erudito',
  'tag_mediador',
  'tag_sigilo',
  'tag_fe',
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
  
  // Social
  tag_intimidante: 'Presencia amenazadora y dominante',
  tag_erudito: 'Amplio conocimiento de lore y arcanos',
  tag_mediador: 'Hábil en negociación y persuasión',
  tag_sigilo: 'Experto en ocultarse y moverse en silencio',
  tag_fe: 'Conexión profunda con lo divino',
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
