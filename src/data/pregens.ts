import type { Character } from '@/types/character'

/**
 * Personajes pregenerados de la campaña Sangrebruma
 * Basados en CAMPAÑA.md sección 6
 */

export const PREGENS: Omit<Character, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Cazador de Látigo',
    class: 'fighter',
    level: 3,
    hp: 28,
    maxHp: 28,
    tempHp: 0,
    ac: 17,
    initiative: 1,
    speed: 30,
    abilities: {
      str: 16,
      dex: 12,
      con: 14,
      int: 10,
      wis: 13,
      cha: 8,
    },
    proficiencyBonus: 2,
    savingThrows: ['str', 'con'],
    skills: ['athletics', 'intimidation', 'perception'],
    traits: [
      {
        id: 'fighting_style_defense',
        name: 'Estilo de Combate: Defensa',
        description: '+1 AC mientras uses armadura',
        type: 'passive',
      },
      {
        id: 'second_wind',
        name: 'Segundo Aliento',
        description: 'Acción bonus: recupera 1d10+3 HP (1/descanso corto)',
        type: 'bonus_action',
      },
      {
        id: 'action_surge',
        name: 'Oleada de Acción',
        description: 'Gana una acción adicional en tu turno (1/descanso corto)',
        type: 'action',
      },
    ],
    specialAbilities: [
      {
        id: 'whip_disarm',
        name: 'Desarmar con Látigo',
        description: 'Ataque: tira STR (Atletismo) vs DEX (Acrobacia) del objetivo para desarmar',
        uses: null,
        maxUses: null,
        rechargeOn: null,
      },
    ],
    inventory: [
      { id: 'whip', name: 'Látigo', description: '1d4 cortante, alcance 10 pies', quantity: 1 },
      { id: 'chainmail', name: 'Cota de Mallas', description: 'AC 16', quantity: 1 },
      { id: 'shield', name: 'Escudo', description: '+2 AC', quantity: 1 },
      { id: 'holy_water', name: 'Agua Bendita', description: '2d6 radiante vs no-muertos', quantity: 3 },
    ],
    conditions: [],
    pregen: true,
    pregenId: 'SB-PC_WHIP',
  },
  {
    name: 'Alquimista',
    class: 'rogue',
    level: 3,
    hp: 20,
    maxHp: 20,
    tempHp: 0,
    ac: 14,
    initiative: 3,
    speed: 30,
    abilities: {
      str: 8,
      dex: 16,
      con: 12,
      int: 15,
      wis: 13,
      cha: 10,
    },
    proficiencyBonus: 2,
    savingThrows: ['dex', 'int'],
    skills: ['investigation', 'medicine', 'sleight_of_hand', 'stealth'],
    traits: [
      {
        id: 'sneak_attack',
        name: 'Ataque Furtivo',
        description: '+2d6 daño con ventaja o aliado cercano (1/turno)',
        type: 'passive',
      },
      {
        id: 'cunning_action',
        name: 'Acción Astuta',
        description: 'Bonus: Dash, Disengage o Hide',
        type: 'bonus_action',
      },
    ],
    specialAbilities: [
      {
        id: 'alchemist_fire',
        name: 'Fuego Alquímico',
        description: 'Tira botella: 1d4 fuego + 1d4 fuego/turno (save DC 13 DEX para apagar)',
        uses: 3,
        maxUses: 3,
        rechargeOn: 'long_rest',
      },
      {
        id: 'antitoxin',
        name: 'Antitoxina',
        description: 'Neutraliza venenos durante 1 hora',
        uses: 2,
        maxUses: 2,
        rechargeOn: 'long_rest',
      },
    ],
    inventory: [
      { id: 'rapier', name: 'Estoque', description: '1d8 perforante, Finesse', quantity: 1 },
      { id: 'leather_armor', name: 'Armadura de Cuero', description: 'AC 11 + DEX', quantity: 1 },
      { id: 'thieves_tools', name: 'Herramientas de Ladrón', description: 'Abrir cerraduras', quantity: 1 },
      { id: 'alchemist_supplies', name: 'Suministros de Alquimista', description: 'Crear pociones', quantity: 1 },
    ],
    conditions: [],
    pregen: true,
    pregenId: 'SB-PC_ALCHEM',
  },
  {
    name: 'Dhampir Duelista',
    class: 'ranger',
    level: 3,
    hp: 24,
    maxHp: 24,
    tempHp: 0,
    ac: 15,
    initiative: 3,
    speed: 30,
    abilities: {
      str: 10,
      dex: 16,
      con: 13,
      int: 12,
      wis: 14,
      cha: 10,
    },
    proficiencyBonus: 2,
    savingThrows: ['str', 'dex'],
    skills: ['insight', 'perception', 'stealth', 'survival'],
    traits: [
      {
        id: 'favored_enemy_undead',
        name: 'Enemigo Predilecto: No-Muertos',
        description: 'Ventaja en checks de Supervivencia para rastrear y en checks de Inteligencia para recordar info',
        type: 'passive',
      },
      {
        id: 'vampiric_bite',
        name: 'Mordida Vampírica',
        description: 'Ataque desarmado 1d4 perforante, recupera HP = daño (1/descanso corto)',
        type: 'action',
      },
    ],
    specialAbilities: [
      {
        id: 'hunters_mark',
        name: "Hunter's Mark",
        description: 'Bonus: marca objetivo, +1d6 daño contra él. Dura 1 hora o concentración',
        uses: 2,
        maxUses: 2,
        rechargeOn: 'long_rest',
      },
    ],
    inventory: [
      { id: 'longsword', name: 'Espada Larga', description: '1d8 cortante (1d10 a dos manos)', quantity: 1 },
      { id: 'studded_leather', name: 'Cuero Tachonado', description: 'AC 12 + DEX', quantity: 1 },
      { id: 'longbow', name: 'Arco Largo', description: '1d8 perforante, alcance 150/600', quantity: 1 },
      { id: 'arrows', name: 'Flechas', description: 'Munición', quantity: 20 },
    ],
    conditions: [],
    pregen: true,
    pregenId: 'SB-PC_DHAMPIR',
  },
  {
    name: 'Exorcista',
    class: 'cleric',
    level: 3,
    hp: 22,
    maxHp: 22,
    tempHp: 0,
    ac: 16,
    initiative: 0,
    speed: 30,
    abilities: {
      str: 14,
      dex: 10,
      con: 13,
      int: 12,
      wis: 16,
      cha: 11,
    },
    proficiencyBonus: 2,
    savingThrows: ['wis', 'cha'],
    skills: ['medicine', 'religion', 'persuasion', 'insight'],
    traits: [
      {
        id: 'channel_divinity_turn_undead',
        name: 'Canalizar Divinidad: Rechazar No-Muertos',
        description: 'Acción: no-muertos en 30 pies deben hacer save WIS DC 13 o huir 1 min',
        type: 'action',
      },
    ],
    specialAbilities: [
      {
        id: 'healing_word',
        name: 'Palabra Curativa',
        description: 'Bonus: cura 1d4+3 HP a 60 pies',
        uses: 4,
        maxUses: 4,
        rechargeOn: 'long_rest',
      },
      {
        id: 'bless',
        name: 'Bendición',
        description: '+1d4 a tiradas de ataque y salvaciones para 3 aliados (concentración 1 min)',
        uses: 4,
        maxUses: 4,
        rechargeOn: 'long_rest',
      },
    ],
    inventory: [
      { id: 'mace', name: 'Maza', description: '1d6 contundente', quantity: 1 },
      { id: 'scale_mail', name: 'Cota de Escamas', description: 'AC 14 + DEX (max 2)', quantity: 1 },
      { id: 'shield_wood', name: 'Escudo de Madera', description: '+2 AC', quantity: 1 },
      { id: 'holy_symbol', name: 'Símbolo Sagrado', description: 'Foco de conjuros', quantity: 1 },
    ],
    conditions: [],
    pregen: true,
    pregenId: 'SB-PC_EXORC',
  },
  {
    name: 'Explorador',
    class: 'ranger',
    level: 3,
    hp: 24,
    maxHp: 24,
    tempHp: 0,
    ac: 14,
    initiative: 3,
    speed: 30,
    abilities: {
      str: 12,
      dex: 16,
      con: 13,
      int: 10,
      wis: 15,
      cha: 8,
    },
    proficiencyBonus: 2,
    savingThrows: ['str', 'dex'],
    skills: ['animal_handling', 'nature', 'perception', 'survival'],
    traits: [
      {
        id: 'natural_explorer',
        name: 'Explorador Natural',
        description: 'Ignora terreno difícil, ventaja en iniciativa',
        type: 'passive',
      },
    ],
    specialAbilities: [
      {
        id: 'hunters_mark_ranger',
        name: "Hunter's Mark",
        description: '+1d6 daño contra objetivo marcado',
        uses: 2,
        maxUses: 2,
        rechargeOn: 'long_rest',
      },
    ],
    inventory: [
      { id: 'longbow_2', name: 'Arco Largo', description: '1d8 perforante, alcance 150/600', quantity: 1 },
      { id: 'shortsword', name: 'Espada Corta', description: '1d6 perforante, Finesse', quantity: 1 },
      { id: 'leather_armor_2', name: 'Armadura de Cuero', description: 'AC 11 + DEX', quantity: 1 },
      { id: 'arrows_2', name: 'Flechas', description: 'Munición', quantity: 30 },
    ],
    conditions: [],
    pregen: true,
    pregenId: 'SB-PC_RANGER',
  },
  {
    name: 'Maldito',
    class: 'barbarian',
    level: 3,
    hp: 32,
    maxHp: 32,
    tempHp: 0,
    ac: 14,
    initiative: 2,
    speed: 40,
    abilities: {
      str: 17,
      dex: 14,
      con: 15,
      int: 8,
      wis: 10,
      cha: 12,
    },
    proficiencyBonus: 2,
    savingThrows: ['str', 'con'],
    skills: ['athletics', 'intimidation', 'survival'],
    traits: [
      {
        id: 'rage',
        name: 'Furia',
        description: '+2 daño cuerpo a cuerpo, resistencia B/P/S, ventaja en STR checks/saves (3/día)',
        type: 'bonus_action',
      },
      {
        id: 'reckless_attack',
        name: 'Ataque Temerario',
        description: 'Ventaja en ataques cuerpo a cuerpo, enemigos tienen ventaja contra ti',
        type: 'passive',
      },
    ],
    specialAbilities: [
      {
        id: 'cursed_regeneration',
        name: 'Regeneración Maldita',
        description: 'Al inicio de turno con HP < 50%: recupera 1d4 HP pero ganas 1 nivel de agotamiento temporal',
        uses: null,
        maxUses: null,
        rechargeOn: null,
      },
    ],
    inventory: [
      { id: 'greataxe', name: 'Hacha Grande', description: '1d12 cortante, a dos manos', quantity: 1 },
      { id: 'handaxes', name: 'Hachas de Mano', description: '1d6 cortante, Arrojadiza (20/60)', quantity: 2 },
      { id: 'unarmored', name: 'Sin Armadura', description: 'AC 10 + DEX + CON', quantity: 1 },
    ],
    conditions: [],
    pregen: true,
    pregenId: 'SB-PC_CURSED',
  },
]

/**
 * Buscar pregen por ID
 */
export function getPregenById(id: string) {
  return PREGENS.find(p => p.pregenId === id)
}

/**
 * Obtener todos los pregens
 */
export function getAllPregens() {
  return PREGENS
}
