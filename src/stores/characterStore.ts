import { create } from 'zustand'
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  query,
  where,
  getDocs,
  Timestamp,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Character, CreateCharacterInput } from '@/types/character'
import { getPregenById } from '@/data/pregens'

interface CharacterState {
  characters: Record<string, Character>
  loading: boolean
  error: string | null
  
  // CRUD Operations
  createCharacter: (input: CreateCharacterInput, userId: string) => Promise<Character>
  readCharacter: (characterId: string) => Promise<Character | null>
  updateCharacter: (characterId: string, updates: Partial<Character>) => Promise<void>
  deleteCharacter: (characterId: string) => Promise<void>
  loadCharacter: (character: Character) => void
  getUserCharacters: (userId: string) => Promise<Character[]>
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  characters: {},
  loading: false,
  error: null,

  // Crear personaje nuevo
  createCharacter: async (input, userId) => {
    try {
      set({ loading: true, error: null })
      
      const characterId = doc(collection(db, 'characters')).id
      const now = Date.now()
      
      let characterData: Omit<Character, 'id'>
      
      if (input.pregenId) {
        // Usar pregen
        const pregen = getPregenById(input.pregenId)
        if (!pregen) {
          throw new Error('Pregen no encontrado')
        }
        
        characterData = {
          ...pregen,
          name: input.name,
          ownerId: userId,
          hp: pregen.maxHp, // Empezar con HP completo
          createdAt: now,
          updatedAt: now,
        }
      } else {
        // TODO: Implementar creación custom
        throw new Error('Creación custom no implementada aún')
      }
      
      const character: Character = {
        id: characterId,
        ...characterData,
      }
      
      // Guardar en Firestore
      await setDoc(doc(db, 'characters', characterId), characterData)
      
      // Actualizar estado local
      set((state) => ({
        characters: {
          ...state.characters,
          [characterId]: character,
        },
        loading: false,
      }))
      
      return character
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear personaje'
      set({ error: errorMessage, loading: false })
      console.error('Error creating character:', error)
      throw error
    }
  },

  // Obtener personaje por ID
  readCharacter: async (characterId) => {
    try {
      const cached = get().characters[characterId]
      if (cached) return cached
      
      const docSnap = await getDoc(doc(db, 'characters', characterId))
      
      if (!docSnap.exists()) {
        return null
      }
      
      const data = docSnap.data()
      const character: Character = {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp 
          ? data.createdAt.toMillis() 
          : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp 
          ? data.updatedAt.toMillis() 
          : data.updatedAt,
      } as Character
      
      // Cachear
      set((state) => ({
        characters: {
          ...state.characters,
          [characterId]: character,
        },
      }))
      
      return character
      
    } catch (error) {
      console.error('Error getting character:', error)
      return null
    }
  },

  // Obtener todos los personajes de un usuario
  getUserCharacters: async (userId) => {
    try {
      set({ loading: true, error: null })
      
      const q = query(
        collection(db, 'characters'),
        where('ownerId', '==', userId)
      )
      
      const snapshot = await getDocs(q)
      const characters: Character[] = []
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        characters.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp 
            ? data.createdAt.toMillis() 
            : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp 
            ? data.updatedAt.toMillis() 
            : data.updatedAt,
        } as Character)
      })
      
      // Actualizar cache
      const charactersMap: Record<string, Character> = {}
      characters.forEach(c => {
        charactersMap[c.id] = c
      })
      
      set({
        characters: charactersMap,
        loading: false,
      })
      
      return characters
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar personajes'
      set({ error: errorMessage, loading: false })
      console.error('Error getting user characters:', error)
      throw error
    }
  },

  // Actualizar personaje
  updateCharacter: async (characterId, updates) => {
    try {
      const now = Date.now()
      const updatesWithTimestamp = {
        ...updates,
        updatedAt: now,
      }
      
      await setDoc(
        doc(db, 'characters', characterId),
        updatesWithTimestamp,
        { merge: true }
      )
      
      // Actualizar cache local
      set((state) => {
        const character = state.characters[characterId]
        if (!character) return state
        
        return {
          characters: {
            ...state.characters,
            [characterId]: {
              ...character,
              ...updatesWithTimestamp,
            },
          },
        }
      })
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar personaje'
      set({ error: errorMessage })
      console.error('Error updating character:', error)
      throw error
    }
  },

  // Cargar personaje en cache
  loadCharacter: (character) => {
    set((state) => ({
      characters: {
        ...state.characters,
        [character.id]: character,
      },
    }))
  },
}))
