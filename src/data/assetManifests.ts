import type { AssetManifest } from '@/types/assets'

/**
 * Manifiestos de assets por nodo
 * Define qué audio/assets se reproducen en cada nodo de la campaña
 */

export const ASSET_MANIFESTS: Record<string, AssetManifest> = {
  // ACTO 1
  manifest_n01: {
    nodeId: 'N01',
    ambientLoops: ['ambient_foggy_valley'],
    stingers: ['stinger_arrival'],
    voiceLines: {
      narrator: ['narrator_n01_intro'],
    },
    autoPlay: true,
    fadeIn: 3000,
    fadeOut: 2000,
  },

  manifest_n02: {
    nodeId: 'N02',
    ambientLoops: ['ambient_inn_fireplace'],
    voiceLines: {
      narrator: ['narrator_n02_inn'],
      npcs: ['npc_mara_greeting', 'npc_mara_warning'],
    },
    autoPlay: true,
    fadeIn: 2000,
    fadeOut: 2000,
  },

  // ACTO 2
  manifest_n12: {
    nodeId: 'N12',
    ambientLoops: ['ambient_storm', 'ambient_wind_howl'],
    stingers: ['stinger_alpha_howl'],
    sfx: ['sfx_thunder', 'sfx_clock_chime'],
    voiceLines: {
      narrator: ['narrator_n12_tower'],
    },
    autoPlay: true,
    fadeIn: 2000,
    fadeOut: 1000,
  },

  // ACTO 3
  manifest_n15: {
    nodeId: 'N15',
    ambientLoops: ['ambient_battle_tense'],
    stingers: ['stinger_boss_alpha'],
    sfx: ['sfx_werewolf_howl', 'sfx_growl'],
    voiceLines: {
      monsters: ['bark_alpha_greeting', 'bark_alpha_rage'],
    },
    autoPlay: true,
    fadeIn: 1000,
    fadeOut: 2000,
  },

  manifest_n17: {
    nodeId: 'N17',
    ambientLoops: ['ambient_throne_room'],
    stingers: ['stinger_count_entrance'],
    voiceLines: {
      narrator: ['narrator_n17_throne'],
      npcs: ['npc_count_greeting', 'npc_count_challenge'],
    },
    autoPlay: true,
    fadeIn: 3000,
    fadeOut: 2000,
  },

  manifest_n18: {
    nodeId: 'N18',
    ambientLoops: ['ambient_dawn', 'ambient_peaceful_valley'],
    stingers: ['stinger_victory', 'stinger_epilogue'],
    voiceLines: {
      narrator: ['narrator_n18_epilogue'],
      npcs: ['npc_mara_gratitude'],
    },
    autoPlay: true,
    fadeIn: 4000,
    fadeOut: 3000,
  },
}

/**
 * Obtener manifiesto por ID de nodo
 */
export function getAssetManifest(nodeId: string): AssetManifest | undefined {
  return ASSET_MANIFESTS[`manifest_${nodeId.toLowerCase()}`]
}

/**
 * Asset metadata de ejemplo (en producción vendría de Storage)
 */
export const SAMPLE_ASSETS = {
  ambient_foggy_valley: {
    id: 'ambient_foggy_valley',
    type: 'ambient_loop' as const,
    name: 'Valle Neblinoso',
    description: 'Ambiente de valle con niebla y viento suave',
    duration: 60,
    loopable: true,
    volume: 0.6,
    moodTags: ['dark', 'mysterious', 'tense'],
    ttsPrompt: 'N/A - Audio generado',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  
  ambient_inn_fireplace: {
    id: 'ambient_inn_fireplace',
    type: 'ambient_loop' as const,
    name: 'Posada con Chimenea',
    description: 'Interior de posada con fuego crepitando',
    duration: 45,
    loopable: true,
    volume: 0.5,
    moodTags: ['warm', 'safe', 'cozy'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  
  stinger_alpha_howl: {
    id: 'stinger_alpha_howl',
    type: 'stinger' as const,
    name: 'Aullido del Alfa',
    description: 'Aullido dramático que anuncia al jefe',
    duration: 4,
    loopable: false,
    volume: 0.9,
    moodTags: ['dramatic', 'danger', 'boss'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  
  npc_mara_greeting: {
    id: 'npc_mara_greeting',
    type: 'voice_npc' as const,
    name: 'Mara: Saludo',
    description: 'Mara Carbón da la bienvenida',
    ttsText: '¿Cazadores? Llevan meses sin llegar.',
    ttsVoice: 'es-AR-Neural',
    ttsPrompt: 'Voz mujer 35-55, áspera, protectora, humor seco',
    duration: 3,
    volume: 0.8,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
}
