import { z } from 'zod'

/**
 * Sistema de Assets Multimodales - Campaña V2
 * Para audio, imágenes y otros recursos multimedia
 */

// Tipos de assets
export const AssetType = z.enum([
  'ambient_loop',   // Loops de ambiente (30-90s)
  'stinger',        // Golpes cortos (2-6s)
  'sfx',            // Efectos de sonido
  'voice_narrator', // Narrador TTS
  'voice_npc',      // NPCs
  'voice_bark',     // Barks de monstruos
  'image',          // Imágenes conceptuales
])

export type AssetType = z.infer<typeof AssetType>

/**
 * Metadata de un asset
 */
export const AssetMetadata = z.object({
  id: z.string(),
  type: AssetType,
  name: z.string(),
  description: z.string().optional(),
  
  // URLs y referencias
  storageUrl: z.string().optional(), // Firebase Storage URL
  localPath: z.string().optional(),  // Path local para desarrollo
  
  // Propiedades de audio
  duration: z.number().optional(), // en segundos
  loopable: z.boolean().default(false),
  volume: z.number().min(0).max(1).default(0.7),
  
  // Tags para búsqueda/filtrado
  moodTags: z.array(z.string()).optional(), // ['dark', 'tense', 'mysterious']
  nodeIds: z.array(z.string()).optional(),   // nodos donde se usa
  
  // TTS específico
  ttsText: z.string().optional(),     // texto para TTS
  ttsVoice: z.string().optional(),    // ID de voz
  ttsPrompt: z.string().optional(),   // prompt para generación
  
  // Metadata adicional
  createdAt: z.number(),
  updatedAt: z.number(),
})

export type AssetMetadata = z.infer<typeof AssetMetadata>

/**
 * Manifiesto de assets para un nodo
 */
export const AssetManifest = z.object({
  nodeId: z.string(),
  
  // Audio
  ambientLoops: z.array(z.string()).optional(),     // IDs de assets
  stingers: z.array(z.string()).optional(),
  sfx: z.array(z.string()).optional(),
  voiceLines: z.object({
    narrator: z.array(z.string()).optional(),
    npcs: z.array(z.string()).optional(),
    monsters: z.array(z.string()).optional(),
    party: z.array(z.string()).optional(),
  }).optional(),
  
  // Imágenes
  images: z.array(z.string()).optional(),
  
  // Configuración de reproducción
  autoPlay: z.boolean().default(true),
  fadeIn: z.number().default(1000),   // ms
  fadeOut: z.number().default(1000),  // ms
})

export type AssetManifest = z.infer<typeof AssetManifest>

/**
 * Prompts para generación de assets
 */
export interface AssetPrompt {
  type: AssetType
  category: string
  prompt: string
  examples?: string[]
  settings?: {
    voice?: string
    style?: string
    mood?: string
  }
}

/**
 * Biblioteca de prompts por categoría
 */
export const ASSET_PROMPTS: Record<string, AssetPrompt> = {
  // Narrador
  narrator_gothic: {
    type: 'voice_narrator',
    category: 'narrador',
    prompt: 'Voz narrador(a) latino neutral, tono gótico íntimo, ritmo medio, articulación clara, sin español castellano. Pausas dramáticas breves. No exagerar.',
    settings: {
      voice: 'es-MX-Neural',
      style: 'narrative',
      mood: 'dark',
    },
  },
  
  // NPCs
  npc_posada_mara: {
    type: 'voice_npc',
    category: 'npc',
    prompt: 'Voz mujer 35-55, áspera, protectora, humor seco. Latam neutral. Menos teatral, más real.',
    settings: {
      voice: 'es-AR-Neural',
      mood: 'protective',
    },
  },
  
  npc_sepulturero: {
    type: 'voice_npc',
    category: 'npc',
    prompt: 'Voz hombre mayor, seca, cansada, humor negro. Habla lento, sin énfasis dramático.',
    settings: {
      voice: 'es-ES-Neural',
      mood: 'weary',
    },
  },
  
  // Monstruos
  monster_werewolf: {
    type: 'voice_bark',
    category: 'monster',
    prompt: 'Aullido de hombre lobo, cercano, con eco en bosque mojado, 2-3 segundos.',
  },
  
  monster_skeleton: {
    type: 'voice_bark',
    category: 'monster',
    prompt: 'Crujido de huesos y pasos secos, 1-2 segundos, sin reverb excesiva.',
  },
  
  // Ambiente
  ambient_storm: {
    type: 'ambient_loop',
    category: 'ambiente',
    prompt: 'Tormenta + viento + crujidos de madera, 60s loop, sin picos de volumen.',
    settings: {
      mood: 'stormy',
    },
  },
  
  ambient_crypt: {
    type: 'ambient_loop',
    category: 'ambiente',
    prompt: 'Goteo + viento subterráneo + whisper bed, 60-90s loop, tono bajo y constante.',
    settings: {
      mood: 'eerie',
    },
  },
  
  // SFX
  sfx_door_creak: {
    type: 'sfx',
    category: 'accion',
    prompt: 'Puerta antigua que cruje al abrirse, madera húmeda, 2-3 segundos.',
  },
  
  sfx_chains: {
    type: 'sfx',
    category: 'accion',
    prompt: 'Cadenas metálicas arrastrándose, sonido pesado, 1-2 segundos.',
  },
}

/**
 * Estado del reproductor de audio
 */
export interface AudioPlayerState {
  currentAmbient: string | null
  currentVolume: number
  isPlaying: boolean
  queue: string[]
  lastStinger: string | null
  lastStingerTime: number
}

/**
 * Configuración de reproducción
 */
export interface PlaybackConfig {
  assetId: string
  volume?: number
  loop?: boolean
  fadeIn?: number
  fadeOut?: number
  delay?: number
  stopPrevious?: boolean
}

/**
 * Generar prompts de imagen para concept art
 */
export const IMAGE_PROMPTS = {
  village_fog: 'Gothic village in thick fog, lanterns, wet cobblestone, cinematic, concept art, high detail, dark fantasy',
  laboratory: 'Galvanic laboratory with copper coils, glass jars, lightning arc, gothic architecture, concept art, moody lighting',
  castle_night: 'Dark gothic castle at night, red mist, spires, ominous, concept art, dramatic lighting',
  cemetery: 'Abandoned cemetery with crooked tombstones, fog, dead trees, gothic, concept art',
  library_bones: 'Library with curved bone shelves, ancient books, eerie light, gothic architecture, concept art',
}

/**
 * Validar URL de Storage
 */
export function isValidStorageUrl(url: string): boolean {
  return url.startsWith('https://firebasestorage.googleapis.com/') ||
         url.startsWith('gs://') ||
         url.startsWith('http://localhost')
}

/**
 * Obtener tipo de archivo de una URL
 */
export function getFileType(url: string): 'audio' | 'image' | 'unknown' {
  const audioExts = ['.mp3', '.wav', '.ogg', '.m4a']
  const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
  
  const lowerUrl = url.toLowerCase()
  
  if (audioExts.some(ext => lowerUrl.endsWith(ext))) return 'audio'
  if (imageExts.some(ext => lowerUrl.endsWith(ext))) return 'image'
  
  return 'unknown'
}
