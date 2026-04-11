import { create } from 'zustand'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged, 
  User,
  updateProfile,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { createDefaultProfile } from '@/types/userProfile'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  
  // Actions
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateDisplayName: (name: string) => Promise<void>
  initialize: () => () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  // Registrar nuevo usuario
  signUp: async (email: string, password: string, displayName: string) => {
    try {
      set({ loading: true, error: null })
      
      // Crear usuario con email y password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Actualizar perfil con nombre
      await updateProfile(userCredential.user, { displayName })
      
      // Crear perfil en Firestore
      const userProfile = createDefaultProfile(
        userCredential.user.uid,
        email,
        displayName
      )
      
      const profileRef = doc(db, 'profiles', userCredential.user.uid)
      await setDoc(profileRef, userProfile)
      
      // Forzar actualización del estado
      set({ user: auth.currentUser })
    } catch (error: unknown) {
      let errorMessage = 'Error al registrar usuario'
      
      if ((error as { code?: string }).code === 'auth/email-already-in-use') {
        errorMessage = 'Este email ya está registrado. Intenta iniciar sesión.'
      } else if ((error as { code?: string }).code === 'auth/weak-password') {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres'
      } else if ((error as { code?: string }).code === 'auth/invalid-email') {
        errorMessage = 'Email inválido'
      }
      
      set({ error: errorMessage })
      console.error('Error signing up:', error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  // Iniciar sesión con email/password
  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null })
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Verificar si existe perfil, si no, crearlo
      const profileRef = doc(db, 'profiles', userCredential.user.uid)
      const profileSnap = await getDoc(profileRef)
      
      if (!profileSnap.exists()) {
        // Crear perfil si no existe (para usuarios antiguos)
        const userProfile = createDefaultProfile(
          userCredential.user.uid,
          email,
          userCredential.user.displayName || 'Usuario'
        )
        await setDoc(profileRef, userProfile)
      } else {
        // Actualizar último login
        await setDoc(profileRef, {
          lastLoginAt: Date.now()
        }, { merge: true })
      }
    } catch (error: unknown) {
      let errorMessage = 'Error al iniciar sesión'
      
      if ((error as { code?: string }).code === 'auth/user-not-found') {
        errorMessage = 'Usuario no encontrado. ¿Necesitas registrarte?'
      } else if ((error as { code?: string }).code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta'
      } else if ((error as { code?: string }).code === 'auth/invalid-email') {
        errorMessage = 'Email inválido'
      }
      
      set({ error: errorMessage })
      console.error('Error signing in:', error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  // Cerrar sesión
  signOut: async () => {
    try {
      await auth.signOut()
      set({ user: null })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cerrar sesión'
      set({ error: errorMessage })
      console.error('Error signing out:', error)
    }
  },

  // Actualizar nombre de usuario
  updateDisplayName: async (name: string) => {
    try {
      if (!auth.currentUser) throw new Error('No hay usuario autenticado')
      
      await updateProfile(auth.currentUser, { displayName: name })
      
      // Forzar actualización del estado
      set({ user: auth.currentUser })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar nombre'
      set({ error: errorMessage })
      console.error('Error updating profile:', error)
    }
  },

  // Inicializar listener de auth
  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ user, loading: false })
    })

    // Retornar cleanup function
    return unsubscribe
  },
}))
