import { z } from 'zod'

/**
 * Esquema Zod para validar datos de sesión
 * Basado en el documento PAQUETES_DE_TRABAJO.md y CAMPAÑA.md
 */

// Estados de la sesión
export const SessionStatus = z.enum([
  'waiting',    // Esperando jugadores
  'ready',      // Todos listos, puede comenzar
  'playing',    // En juego
  'paused',     // Pausada
  'completed',  // Completada
])

export type SessionStatus = z.infer<typeof SessionStatus>

// Personaje mínimo para el lobby
export const PlayerCharacter = z.object({
  id: z.string(),
  name: z.string().min(2).max(30),
  class: z.string(),
  level: z.number().int().min(1).max(20),
  hp: z.number().int().min(0),
  maxHp: z.number().int().min(1),
  ac: z.number().int().min(1),
  ready: z.boolean(),
})

export type PlayerCharacter = z.infer<typeof PlayerCharacter>

// Jugador en sesión
export const SessionPlayer = z.object({
  uid: z.string(),
  displayName: z.string(),
  character: PlayerCharacter.nullable(),
  ready: z.boolean(),
  isOnline: z.boolean(),
  joinedAt: z.number(), // timestamp
})

export type SessionPlayer = z.infer<typeof SessionPlayer>

// Voto de jugador en decisión
export const PlayerVote = z.object({
  playerId: z.string(),
  playerName: z.string(),
  optionId: z.string(),
  timestamp: z.number(),
})

export type PlayerVote = z.infer<typeof PlayerVote>

// Estado de votación activa
export const VotingState = z.object({
  nodeId: z.string(),
  votes: z.record(PlayerVote), // Indexed by playerId
  startedAt: z.number(),
  resolvedAt: z.number().nullable(),
  resolvedOption: z.string().nullable(),
  tiebreaker: z.boolean().default(false), // Si se usó dado para desempate
})

export type VotingState = z.infer<typeof VotingState>

// Configuración de campaña
export const CampaignConfig = z.object({
  id: z.string(),
  name: z.string(),
  currentNodeId: z.string().nullable(),
  flags: z.record(z.boolean()),       // f_village_trust, etc.
  variables: z.record(z.number()),    // darkness, bloodDebt, etc.
  votingState: VotingState.nullable(), // Estado de votación activa
})

export type CampaignConfig = z.infer<typeof CampaignConfig>

// Sesión completa
export const Session = z.object({
  id: z.string(),
  code: z.string().length(6),         // Código de sala (ej: "ABC123")
  ownerId: z.string(),
  ownerName: z.string(),
  
  // Jugadores
  players: z.record(SessionPlayer),   // Indexed by uid
  playerIds: z.array(z.string()),     // Array de UIDs para rules
  maxPlayers: z.number().int().min(2).max(6).default(6),
  
  // Estado
  status: SessionStatus,
  
  // Campaña
  campaign: CampaignConfig,
  
  // Timestamps
  createdAt: z.number(),
  updatedAt: z.number(),
  startedAt: z.number().nullable(),
})

export type Session = z.infer<typeof Session>

// DTO para crear sesión
export const CreateSessionInput = z.object({
  ownerName: z.string().min(2).max(20),
  maxPlayers: z.number().int().min(2).max(6).default(6),
  campaignId: z.string().default('sangrebruma'),
})

export type CreateSessionInput = z.infer<typeof CreateSessionInput>

// DTO para unirse a sesión
export const JoinSessionInput = z.object({
  code: z.string().length(6),
  displayName: z.string().min(2).max(20),
})

export type JoinSessionInput = z.infer<typeof JoinSessionInput>
