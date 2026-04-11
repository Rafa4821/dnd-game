import { create } from 'zustand'
import type { AssetMetadata, AudioPlayerState } from '@/types/assets'

/**
 * Store para manejar reproducción de audio en la campaña
 */

interface AudioStore extends AudioPlayerState {
  assets: Record<string, AssetMetadata>
  
  // Acciones
  loadAssets: (assets: Record<string, AssetMetadata>) => void
  playAmbient: (assetId: string, volume?: number, fadeIn?: number) => void
  playStinger: (assetId: string, volume?: number) => void
  playSfx: (assetId: string, volume?: number) => void
  stopAmbient: (fadeOut?: number) => void
  setVolume: (volume: number) => void
  stopAll: () => void
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  // Estado inicial
  currentAmbient: null,
  currentVolume: 0.7,
  isPlaying: false,
  queue: [],
  lastStinger: null,
  lastStingerTime: 0,
  assets: {},

  // Cargar assets disponibles
  loadAssets: (assets) => {
    set({ assets })
  },

  // Reproducir loop de ambiente
  playAmbient: (assetId, volume = 0.7, _fadeIn = 1000) => {
    const { assets, currentAmbient } = get()
    const asset = assets[assetId]
    
    if (!asset || asset.type !== 'ambient_loop') {
      console.error('Asset no encontrado o tipo incorrecto:', assetId)
      return
    }
    
    // Si ya hay un ambiente sonando, hacer fadeOut primero
    if (currentAmbient) {
      get().stopAmbient(1000)
      setTimeout(() => {
        set({
          currentAmbient: assetId,
          currentVolume: volume,
          isPlaying: true,
        })
      }, 1000)
    } else {
      set({
        currentAmbient: assetId,
        currentVolume: volume,
        isPlaying: true,
      })
    }
    
    console.log(`Playing ambient: ${asset.name} at volume ${volume}`)
    // Aquí iría la lógica real de reproducción con Web Audio API o Howler.js
  },

  // Reproducir stinger (golpe musical corto)
  playStinger: (assetId, _volume = 0.8) => {
    const { assets } = get()
    const asset = assets[assetId]
    
    if (!asset || asset.type !== 'stinger') {
      console.error('Asset no encontrado o tipo incorrecto:', assetId)
      return
    }
    
    // Evitar spam de stingers (cooldown de 2 segundos)
    const now = Date.now()
    const { lastStingerTime } = get()
    if (now - lastStingerTime < 2000) {
      return
    }
    
    set({ lastStinger: assetId, lastStingerTime: now })
    
    console.log(`Playing stinger: ${asset.name}`)
    // Reproducción real aquí
  },

  // Reproducir SFX (efecto de sonido)
  playSfx: (assetId, _volume = 0.7) => {
    const { assets } = get()
    const asset = assets[assetId]
    
    if (!asset || asset.type !== 'sfx') {
      console.error('Asset no encontrado o tipo incorrecto:', assetId)
      return
    }
    
    console.log(`Playing SFX: ${asset.name}`)
    // Reproducción real aquí
  },

  // Detener ambiente actual
  stopAmbient: (fadeOut = 1000) => {
    const { currentAmbient } = get()
    
    if (!currentAmbient) return
    
    console.log(`Stopping ambient with ${fadeOut}ms fadeout`)
    
    // Fadeout y luego detener
    setTimeout(() => {
      set({
        currentAmbient: null,
        isPlaying: false,
      })
    }, fadeOut)
  },

  // Cambiar volumen
  setVolume: (volume) => {
    set({ currentVolume: Math.max(0, Math.min(1, volume)) })
  },

  // Detener todo
  stopAll: () => {
    set({
      currentAmbient: null,
      isPlaying: false,
      queue: [],
      lastStinger: null,
    })
  },
}))
