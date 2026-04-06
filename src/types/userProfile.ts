import { z } from 'zod'

/**
 * Tipos para perfiles de usuario con CRUD completo
 */

// ============================================
// PERFIL DE USUARIO
// ============================================

export const UserProfile = z.object({
  id: z.string(), // UID de Firebase Auth
  email: z.string().email(),
  displayName: z.string().min(2).max(50),
  
  // Información adicional
  avatar: z.string().url().nullable().default(null),
  bio: z.string().max(500).nullable().default(null),
  favoriteClass: z.enum(['fighter', 'rogue', 'ranger', 'cleric', 'barbarian', 'wizard']).nullable().default(null),
  
  // Estadísticas
  gamesPlayed: z.number().int().min(0).default(0),
  gamesWon: z.number().int().min(0).default(0),
  totalPlayTime: z.number().int().min(0).default(0), // minutos
  
  // Preferencias
  theme: z.enum(['dark', 'light', 'system']).default('dark'),
  notifications: z.boolean().default(true),
  publicProfile: z.boolean().default(true),
  
  // Metadata
  createdAt: z.number(),
  updatedAt: z.number(),
  lastLoginAt: z.number(),
})

export type UserProfile = z.infer<typeof UserProfile>

// ============================================
// CREAR PERFIL
// ============================================

export const CreateUserProfileInput = UserProfile.omit({
  id: true,
  gamesPlayed: true,
  gamesWon: true,
  totalPlayTime: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
})

export type CreateUserProfileInput = z.infer<typeof CreateUserProfileInput>

// ============================================
// ACTUALIZAR PERFIL
// ============================================

export const UpdateUserProfileInput = UserProfile.partial().omit({
  id: true,
  email: true,
  createdAt: true,
})

export type UpdateUserProfileInput = z.infer<typeof UpdateUserProfileInput>

// ============================================
// ESTADÍSTICAS DE PERFIL
// ============================================

export interface ProfileStats {
  totalGames: number
  winRate: number // 0-100
  averagePlayTime: number // minutos
  favoriteCharacter: string | null
  totalCharacters: number
  totalSessions: number
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Calcular estadísticas del perfil
 */
export function calculateProfileStats(profile: UserProfile): ProfileStats {
  const winRate = profile.gamesPlayed > 0 
    ? (profile.gamesWon / profile.gamesPlayed) * 100 
    : 0

  const averagePlayTime = profile.gamesPlayed > 0
    ? profile.totalPlayTime / profile.gamesPlayed
    : 0

  return {
    totalGames: profile.gamesPlayed,
    winRate: Math.round(winRate * 10) / 10,
    averagePlayTime: Math.round(averagePlayTime),
    favoriteCharacter: null, // Se puede calcular desde characterStore
    totalCharacters: 0, // Se calcula desde characterStore
    totalSessions: 0, // Se calcula desde sessionStore
  }
}

/**
 * Crear perfil por defecto
 */
export function createDefaultProfile(
  uid: string,
  email: string,
  displayName: string
): UserProfile {
  const now = Date.now()

  return {
    id: uid,
    email,
    displayName,
    avatar: null,
    bio: null,
    favoriteClass: null,
    gamesPlayed: 0,
    gamesWon: 0,
    totalPlayTime: 0,
    theme: 'dark',
    notifications: true,
    publicProfile: true,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
  }
}
