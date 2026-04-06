/**
 * Motor de dados con crypto.getRandomValues() para garantizar aleatoriedad real
 * Compatible con SRD 5.1
 */

/**
 * Genera un número aleatorio entre min y max (inclusivo)
 * Usa crypto.getRandomValues() para verdadera aleatoriedad
 */
function randomInt(min: number, max: number): number {
  const range = max - min + 1
  const bytesNeeded = Math.ceil(Math.log2(range) / 8)
  const maxValue = Math.pow(256, bytesNeeded)
  const randomBytes = new Uint8Array(bytesNeeded)
  
  let randomValue: number
  
  do {
    crypto.getRandomValues(randomBytes)
    randomValue = 0
    for (let i = 0; i < bytesNeeded; i++) {
      randomValue = randomValue * 256 + randomBytes[i]
    }
  } while (randomValue >= maxValue - (maxValue % range))
  
  return min + (randomValue % range)
}

/**
 * Resultado de una tirada de dados
 */
export interface DiceRoll {
  rolls: number[]
  total: number
  formula: string
  advantage?: 'advantage' | 'disadvantage' | null
  criticalHit?: boolean
  criticalFail?: boolean
}

/**
 * Tirar un dado de N caras
 */
export function rollDie(sides: number): number {
  return randomInt(1, sides)
}

/**
 * Tirar múltiples dados
 */
export function rollDice(count: number, sides: number): number[] {
  const rolls: number[] = []
  for (let i = 0; i < count; i++) {
    rolls.push(rollDie(sides))
  }
  return rolls
}

/**
 * Parser y ejecutor de fórmulas de dados
 * Soporta: "1d20", "2d6+3", "1d20+5", etc.
 */
export function roll(formula: string): DiceRoll {
  // Limpiar espacios
  formula = formula.replace(/\s/g, '')
  
  // Detectar advantage/disadvantage
  let advantage: 'advantage' | 'disadvantage' | null = null
  if (formula.includes('adv')) {
    advantage = 'advantage'
    formula = formula.replace(/adv/gi, '')
  } else if (formula.includes('dis')) {
    advantage = 'disadvantage'
    formula = formula.replace(/dis/gi, '')
  }
  
  // Parse formula: XdY+Z o XdY-Z o XdY
  const match = formula.match(/^(\d+)d(\d+)([+-]\d+)?$/i)
  
  if (!match) {
    throw new Error(`Fórmula inválida: ${formula}`)
  }
  
  const count = parseInt(match[1])
  const sides = parseInt(match[2])
  const modifier = match[3] ? parseInt(match[3]) : 0
  
  let rolls = rollDice(count, sides)
  
  // Manejar advantage/disadvantage (solo para d20)
  if (advantage && sides === 20 && count === 1) {
    const secondRoll = rollDie(20)
    if (advantage === 'advantage') {
      rolls = [Math.max(rolls[0], secondRoll)]
    } else {
      rolls = [Math.min(rolls[0], secondRoll)]
    }
  }
  
  const total = rolls.reduce((sum, r) => sum + r, 0) + modifier
  
  // Detectar críticos (solo d20)
  let criticalHit = false
  let criticalFail = false
  if (sides === 20 && count === 1) {
    criticalHit = rolls[0] === 20
    criticalFail = rolls[0] === 1
  }
  
  return {
    rolls,
    total,
    formula,
    advantage,
    criticalHit,
    criticalFail,
  }
}

/**
 * Roll de ataque con ventaja/desventaja
 */
export function rollAttack(
  modifier: number,
  advantage?: 'advantage' | 'disadvantage'
): DiceRoll {
  let formula = `1d20+${modifier}`
  if (advantage === 'advantage') {
    formula += 'adv'
  } else if (advantage === 'disadvantage') {
    formula += 'dis'
  }
  
  return roll(formula)
}

/**
 * Roll de daño
 */
export function rollDamage(formula: string): DiceRoll {
  return roll(formula)
}

/**
 * Saving throw
 */
export function rollSave(modifier: number): DiceRoll {
  return roll(`1d20+${modifier}`)
}

/**
 * Skill check
 */
export function rollSkill(modifier: number, advantage?: 'advantage' | 'disadvantage'): DiceRoll {
  let formula = `1d20+${modifier}`
  if (advantage === 'advantage') {
    formula += 'adv'
  } else if (advantage === 'disadvantage') {
    formula += 'dis'
  }
  
  return roll(formula)
}

/**
 * Initiative roll
 */
export function rollInitiative(modifier: number): DiceRoll {
  return roll(`1d20+${modifier}`)
}

/**
 * Curación (healing)
 */
export function rollHealing(formula: string): DiceRoll {
  return roll(formula)
}

/**
 * Roll múltiple con keep highest/lowest
 * Útil para stats (4d6 drop lowest)
 */
export function rollMultipleKeep(
  count: number,
  sides: number,
  keep: number,
  keepHighest: boolean = true
): DiceRoll {
  const rolls = rollDice(count, sides)
  const sorted = [...rolls].sort((a, b) => keepHighest ? b - a : a - b)
  const kept = sorted.slice(0, keep)
  const total = kept.reduce((sum, r) => sum + r, 0)
  
  return {
    rolls: kept,
    total,
    formula: `${count}d${sides} keep ${keepHighest ? 'highest' : 'lowest'} ${keep}`,
  }
}

/**
 * Generate ability scores (4d6 drop lowest)
 */
export function generateAbilityScore(): number {
  const result = rollMultipleKeep(4, 6, 3, true)
  return result.total
}

/**
 * Generate full set of ability scores
 */
export function generateAbilityScores(): number[] {
  const scores: number[] = []
  for (let i = 0; i < 6; i++) {
    scores.push(generateAbilityScore())
  }
  return scores
}
