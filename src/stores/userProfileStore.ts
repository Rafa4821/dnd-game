import { create } from 'zustand'
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { UserProfile, CreateUserProfileInput, UpdateUserProfileInput } from '@/types/userProfile'
import { createDefaultProfile } from '@/types/userProfile'

interface UserProfileStore {
  profile: UserProfile | null
  profiles: Record<string, UserProfile> // Para perfiles públicos
  loading: boolean
  error: string | null

  // CRUD Operations
  createProfile: (input: CreateUserProfileInput) => Promise<UserProfile>
  readProfile: (uid: string) => Promise<UserProfile | null>
  updateProfile: (uid: string, updates: UpdateUserProfileInput) => Promise<void>
  deleteProfile: (uid: string) => Promise<void>
  
  // Métodos auxiliares
  subscribeToProfile: (uid: string) => Unsubscribe
  loadPublicProfiles: () => Promise<void>
  updateStats: (uid: string, stats: { gamesPlayed?: number; gamesWon?: number; totalPlayTime?: number }) => Promise<void>
  updateLastLogin: (uid: string) => Promise<void>
  
  // Búsqueda
  searchProfiles: (searchTerm: string) => Promise<UserProfile[]>
}

export const useUserProfileStore = create<UserProfileStore>((set, get) => ({
  profile: null,
  profiles: {},
  loading: false,
  error: null,

  /**
   * CREATE - Crear nuevo perfil
   */
  createProfile: async (input) => {
    try {
      set({ loading: true, error: null })

      const uid = input.email // Temporal, se reemplaza con UID real
      const profile = createDefaultProfile(uid, input.email, input.displayName)

      // Merge con input
      const finalProfile: UserProfile = {
        ...profile,
        ...input,
        id: uid,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
        lastLoginAt: profile.lastLoginAt,
      }

      // Guardar en Firestore
      const profileRef = doc(db, 'profiles', uid)
      await setDoc(profileRef, finalProfile)

      set({ profile: finalProfile, loading: false })
      return finalProfile
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear perfil'
      set({ error: errorMessage, loading: false })
      console.error('Error creating profile:', error)
      throw error
    }
  },

  /**
   * READ - Leer perfil por UID
   */
  readProfile: async (uid) => {
    try {
      set({ loading: true, error: null })

      const profileRef = doc(db, 'profiles', uid)
      const profileSnap = await getDoc(profileRef)

      if (profileSnap.exists()) {
        const profile = profileSnap.data() as UserProfile
        set({ profile, loading: false })
        return profile
      }

      set({ profile: null, loading: false })
      return null
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al leer perfil'
      set({ error: errorMessage, loading: false })
      console.error('Error reading profile:', error)
      return null
    }
  },

  /**
   * UPDATE - Actualizar perfil
   */
  updateProfile: async (uid, updates) => {
    try {
      set({ loading: true, error: null })

      const profileRef = doc(db, 'profiles', uid)
      
      // Agregar timestamp de actualización
      const finalUpdates = {
        ...updates,
        updatedAt: Date.now(),
      }

      await updateDoc(profileRef, finalUpdates)

      // Actualizar estado local
      const { profile } = get()
      if (profile && profile.id === uid) {
        set({ 
          profile: { ...profile, ...finalUpdates },
          loading: false 
        })
      } else {
        set({ loading: false })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar perfil'
      set({ error: errorMessage, loading: false })
      console.error('Error updating profile:', error)
      throw error
    }
  },

  /**
   * DELETE - Eliminar perfil
   */
  deleteProfile: async (uid) => {
    try {
      set({ loading: true, error: null })

      const profileRef = doc(db, 'profiles', uid)
      await deleteDoc(profileRef)

      // Limpiar estado local si es el perfil actual
      const { profile } = get()
      if (profile && profile.id === uid) {
        set({ profile: null })
      }

      set({ loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar perfil'
      set({ error: errorMessage, loading: false })
      console.error('Error deleting profile:', error)
      throw error
    }
  },

  /**
   * Suscribirse a cambios en tiempo real
   */
  subscribeToProfile: (uid) => {
    const profileRef = doc(db, 'profiles', uid)

    const unsubscribe = onSnapshot(
      profileRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const profile = snapshot.data() as UserProfile
          set({ profile, loading: false })
        } else {
          set({ profile: null, loading: false })
        }
      },
      (error) => {
        console.error('Error in profile subscription:', error)
        set({ error: error.message, loading: false })
      }
    )

    return unsubscribe
  },

  /**
   * Cargar perfiles públicos
   */
  loadPublicProfiles: async () => {
    try {
      set({ loading: true, error: null })

      const profilesRef = collection(db, 'profiles')
      const q = query(profilesRef, where('publicProfile', '==', true))
      const querySnapshot = await getDocs(q)

      const profiles: Record<string, UserProfile> = {}
      querySnapshot.forEach((doc) => {
        const profile = doc.data() as UserProfile
        profiles[profile.id] = profile
      })

      set({ profiles, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar perfiles'
      set({ error: errorMessage, loading: false })
      console.error('Error loading public profiles:', error)
    }
  },

  /**
   * Actualizar estadísticas
   */
  updateStats: async (uid, stats) => {
    try {
      const profileRef = doc(db, 'profiles', uid)
      
      const updates: any = {
        updatedAt: Date.now(),
      }

      if (stats.gamesPlayed !== undefined) {
        updates.gamesPlayed = stats.gamesPlayed
      }
      if (stats.gamesWon !== undefined) {
        updates.gamesWon = stats.gamesWon
      }
      if (stats.totalPlayTime !== undefined) {
        updates.totalPlayTime = stats.totalPlayTime
      }

      await updateDoc(profileRef, updates)

      // Actualizar estado local
      const { profile } = get()
      if (profile && profile.id === uid) {
        set({ 
          profile: { ...profile, ...updates }
        })
      }
    } catch (error) {
      console.error('Error updating stats:', error)
    }
  },

  /**
   * Actualizar último login
   */
  updateLastLogin: async (uid) => {
    try {
      const profileRef = doc(db, 'profiles', uid)
      await updateDoc(profileRef, {
        lastLoginAt: Date.now(),
      })
    } catch (error) {
      console.error('Error updating last login:', error)
    }
  },

  /**
   * Buscar perfiles por nombre o email
   */
  searchProfiles: async (searchTerm) => {
    try {
      set({ loading: true, error: null })

      const profilesRef = collection(db, 'profiles')
      const q = query(
        profilesRef,
        where('publicProfile', '==', true)
      )

      const querySnapshot = await getDocs(q)
      const allProfiles: UserProfile[] = []

      querySnapshot.forEach((doc) => {
        allProfiles.push(doc.data() as UserProfile)
      })

      // Filtrar localmente (Firestore no soporta búsqueda de texto completo)
      const searchLower = searchTerm.toLowerCase()
      const filtered = allProfiles.filter(
        (profile) =>
          profile.displayName.toLowerCase().includes(searchLower) ||
          profile.email.toLowerCase().includes(searchLower)
      )

      set({ loading: false })
      return filtered
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al buscar perfiles'
      set({ error: errorMessage, loading: false })
      console.error('Error searching profiles:', error)
      return []
    }
  },
}))
