import { z } from 'zod'

/**
 * Esquemas de personaje basados en SRD 5.1 y CAMPAÑA.md
 */

// Habilidades (ability scores)
export const AbilityScores = z.object({
  str: z.number().int().min(3).max(20),
  dex: z.number().int().min(3).max(20),
  con: z.number().int().min(3).max(20),
  int: z.number().int().min(3).max(20),
  wis: z.number().int().min(3).max(20),
  cha: z.number().int().min(3).max(20),
})

export type AbilityScores = z.infer<typeof AbilityScores>

// Clases disponibles
export const CharacterClass = z.enum([
  'fighter',    // Cazador de Látigo
  'rogue',      // Alquimista
  'ranger',     // Dhampir Duelista
  'cleric',     // Exorcista
  'ranger',     // Explorador
  'barbarian',  // Maldito
])

export type CharacterClass = z.infer<typeof CharacterClass>

// Rasgo de personaje
export const CharacterTrait = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.enum(['passive', 'action', 'reaction', 'bonus_action']),
})

export type CharacterTrait = z.infer<typeof CharacterTrait>

// Habilidad especial
export const SpecialAbility = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  uses: z.number().int().min(0).nullable(), // null = ilimitado
  maxUses: z.number().int().min(0).nullable(),
  rechargeOn: z.enum(['short_rest', 'long_rest', 'turn']).nullable(),
})

export type SpecialAbility = z.infer<typeof SpecialAbility>

// Inventario
export const InventoryItem = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  quantity: z.number().int().min(0),
})

export type InventoryItem = z.infer<typeof InventoryItem>

// Personaje completo
export const Character = z.object({
  id: z.string(),
  ownerId: z.string(),
  
  // Info básica
  name: z.string().min(2).max(30),
  class: CharacterClass,
  level: z.number().int().min(1).max(20).default(3),
  
  // Stats de combate
  hp: z.number().int().min(0),
  maxHp: z.number().int().min(1),
  tempHp: z.number().int().min(0).default(0),
  ac: z.number().int().min(1),
  initiative: z.number().int(),
  speed: z.number().int().default(30),
  
  // Habilidades
  abilities: AbilityScores,
  
  // Competencias
  proficiencyBonus: z.number().int().min(2).default(2),
  savingThrows: z.array(z.string()), // ['str', 'con']
  skills: z.array(z.string()),        // ['athletics', 'perception']
  
  // Rasgos y habilidades
  traits: z.array(CharacterTrait),
  specialAbilities: z.array(SpecialAbility),
  
  // Inventario
  inventory: z.array(InventoryItem),
  
  // Estados
  conditions: z.array(z.string()).default([]), // ['poisoned', 'frightened']
  
  // Metadata
  pregen: z.boolean().default(false), // ¿Es un pregen de la campaña?
  pregenId: z.string().nullable(),     // ID del pregen (SB-PC_WHIP, etc.)
  
  createdAt: z.number(),
  updatedAt: z.number(),
})

export type Character = z.infer<typeof Character>

// DTO para crear personaje
export const CreateCharacterInput = z.object({
  name: z.string().min(2).max(30),
  pregenId: z.string().nullable(), // Si usa un pregen
  customClass: CharacterClass.nullable(), // Si crea custom
})

export type CreateCharacterInput = z.infer<typeof CreateCharacterInput>

/**
 * Calcular modificador de habilidad según SRD 5.1
 */
export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

/**
 * Calcular bono de competencia por nivel
 */
export function proficiencyBonusByLevel(level: number): number {
  return Math.ceil(level / 4) + 1
}
