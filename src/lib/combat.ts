/**
 * Utilidades de combate basadas en SRD 5.1
 */

import type { Character } from '@/types/character'
import { abilityModifier } from '@/types/character'
import { rollAttack, rollDamage, rollInitiative, type DiceRoll } from './dice'

/**
 * Calcular AC efectivo con condiciones
 */
export function calculateAC(character: Character): number {
  const ac = character.ac
  
  // Aplicar modificadores de condiciones
  if (character.conditions.includes('prone')) {
    // Prone no afecta AC directamente, pero da desventaja a ataques a distancia
  }
  
  return ac
}

/**
 * Calcular modificador de ataque
 */
export function calculateAttackModifier(
  character: Character,
  isRanged: boolean = false
): number {
  const abilityMod = isRanged 
    ? abilityModifier(character.abilities.dex)
    : abilityModifier(character.abilities.str)
  
  return abilityMod + character.proficiencyBonus
}

/**
 * Hacer roll de ataque
 */
export function makeAttack(
  attacker: Character,
  target: Character,
  isRanged: boolean = false,
  advantage?: 'advantage' | 'disadvantage'
): { hit: boolean; roll: DiceRoll; targetAC: number } {
  const attackMod = calculateAttackModifier(attacker, isRanged)
  const roll = rollAttack(attackMod, advantage)
  const targetAC = calculateAC(target)
  
  // Crítico automáticamente acierta
  if (roll.criticalHit) {
    return { hit: true, roll, targetAC }
  }
  
  // Fallo crítico automáticamente falla
  if (roll.criticalFail) {
    return { hit: false, roll, targetAC }
  }
  
  // Comparar con AC
  const hit = roll.total >= targetAC
  
  return { hit, roll, targetAC }
}

/**
 * Calcular daño de ataque
 */
export function calculateDamage(
  baseDamage: string,
  isCritical: boolean = false
): DiceRoll {
  if (isCritical) {
    // En crítico, doblar dados (no modificadores)
    // "1d8+3" se convierte en "2d8+3"
    const match = baseDamage.match(/^(\d+)d(\d+)([+-]\d+)?$/)
    if (match) {
      const count = parseInt(match[1]) * 2
      const sides = match[2]
      const modifier = match[3] || ''
      baseDamage = `${count}d${sides}${modifier}`
    }
  }
  
  return rollDamage(baseDamage)
}

/**
 * Aplicar daño a personaje
 */
export function applyDamage(
  character: Character,
  damage: number
): { newHp: number; isDead: boolean; isUnconscious: boolean } {
  let newHp = character.hp - damage
  
  // Temp HP absorbe daño primero
  if (character.tempHp > 0) {
    const tempDamage = Math.min(damage, character.tempHp)
    damage -= tempDamage
    newHp = character.hp - damage
  }
  
  // Limitar a 0 como mínimo
  newHp = Math.max(0, newHp)
  
  // Check estados
  const isUnconscious = newHp === 0
  const isDead = newHp === 0 && damage >= character.maxHp // Muerte instantánea
  
  return { newHp, isDead, isUnconscious }
}

/**
 * Aplicar curación
 */
export function applyHealing(
  character: Character,
  healing: number
): number {
  const newHp = Math.min(character.hp + healing, character.maxHp)
  return newHp
}

/**
 * Roll de iniciativa para combate
 */
export function rollInitiativeForCharacter(character: Character): DiceRoll {
  const initiativeMod = character.initiative
  return rollInitiative(initiativeMod)
}

/**
 * Calcular DC de salvación
 */
export function calculateSpellDC(character: Character): number {
  // DC = 8 + proficiency + spellcasting ability mod
  // Para simplificar, usamos WIS para clérigos, INT para otros
  const spellcastingMod = character.class === 'cleric'
    ? abilityModifier(character.abilities.wis)
    : abilityModifier(character.abilities.int)
  
  return 8 + character.proficiencyBonus + spellcastingMod
}

/**
 * Check si un personaje tiene ventaja en ataques
 */
export function hasAdvantageOnAttack(
  attacker: Character,
  target: Character
): 'advantage' | 'disadvantage' | null {
  // Prone target da ventaja a melee, desventaja a ranged
  if (target.conditions.includes('prone')) {
    // Simplificación: asumimos melee por defecto
    return 'advantage'
  }
  
  // Invisible attacker tiene ventaja
  if (attacker.conditions.includes('invisible')) {
    return 'advantage'
  }
  
  // Blinded attacker tiene desventaja
  if (attacker.conditions.includes('blinded')) {
    return 'disadvantage'
  }
  
  // Restrained tiene desventaja
  if (attacker.conditions.includes('restrained')) {
    return 'disadvantage'
  }
  
  return null
}

/**
 * Estados de D&D 5e
 */
export const CONDITIONS = {
  blinded: 'Cegado',
  charmed: 'Hechizado',
  deafened: 'Ensordecido',
  frightened: 'Asustado',
  grappled: 'Agarrado',
  incapacitated: 'Incapacitado',
  invisible: 'Invisible',
  paralyzed: 'Paralizado',
  petrified: 'Petrificado',
  poisoned: 'Envenenado',
  prone: 'Derribado',
  restrained: 'Retenido',
  stunned: 'Aturdido',
  unconscious: 'Inconsciente',
}

/**
 * Check si una condición impide acciones
 */
export function canTakeActions(character: Character): boolean {
  const blockingConditions = ['incapacitated', 'paralyzed', 'petrified', 'stunned', 'unconscious']
  return !character.conditions.some(c => blockingConditions.includes(c))
}

/**
 * Check si puede moverse
 */
export function canMove(character: Character): boolean {
  const blockingConditions = ['grappled', 'paralyzed', 'petrified', 'restrained', 'stunned', 'unconscious']
  return !character.conditions.some(c => blockingConditions.includes(c))
}

/**
 * Calcular velocidad efectiva
 */
export function getEffectiveSpeed(character: Character): number {
  if (!canMove(character)) return 0
  
  // Prone reduce velocidad a la mitad
  if (character.conditions.includes('prone')) {
    return Math.floor(character.speed / 2)
  }
  
  return character.speed
}
