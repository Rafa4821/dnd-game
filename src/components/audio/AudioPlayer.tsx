import { useEffect, useMemo } from 'react'
import { useAudioStore } from '@/stores/audioStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Volume2, VolumeX, Play, Pause } from 'lucide-react'
import type { AssetManifest } from '@/types/assets'

interface AudioPlayerProps {
  manifestId: string
  autoPlay?: boolean
}

/**
 * Reproductor de audio para nodos de campaña
 * Carga y reproduce assets según el manifiesto del nodo
 */
export function AudioPlayer({ manifestId, autoPlay = true }: AudioPlayerProps) {
  const {
    currentAmbient,
    currentVolume,
    isPlaying,
    playAmbient,
    stopAmbient,
    setVolume,
  } = useAudioStore()

  // Aquí cargarías el manifiesto desde una fuente de datos
  // Por ahora usamos un manifiesto de ejemplo
  const manifest: AssetManifest = useMemo(() => ({
    nodeId: manifestId,
    ambientLoops: ['ambient_storm', 'ambient_crypt'],
    stingers: ['stinger_danger', 'stinger_discovery'],
    sfx: ['sfx_door_creak', 'sfx_chains'],
    voiceLines: {
      narrator: ['narrator_intro'],
      npcs: ['npc_mara_greeting'],
    },
    autoPlay: autoPlay,
    fadeIn: 2000,
    fadeOut: 2000,
  }), [manifestId, autoPlay])

  // Auto-reproducir ambiente al cargar
  useEffect(() => {
    if (!manifest) return
    
    // Auto-play ambient si está configurado
    if (manifest.autoPlay && manifest.ambientLoops && manifest.ambientLoops.length > 0) {
      const firstAmbient = manifest.ambientLoops[0]
      playAmbient(firstAmbient, currentVolume, manifest.fadeIn)
    }
    
    return () => {
      stopAmbient(manifest.fadeOut)
    }
  }, [manifest, currentVolume, playAmbient, stopAmbient, manifestId])

  const togglePlayPause = () => {
    if (isPlaying && currentAmbient) {
      stopAmbient()
    } else if (manifest.ambientLoops && manifest.ambientLoops.length > 0) {
      playAmbient(manifest.ambientLoops[0])
    }
  }

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0] / 100)
  }

  const toggleMute = () => {
    if (currentVolume > 0) {
      setVolume(0)
    } else {
      setVolume(0.7)
    }
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg z-50 bg-card/95 backdrop-blur">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlayPause}
            className="h-10 w-10"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          {/* Información actual */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {currentAmbient ? 'Ambiente activo' : 'Sin audio'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {currentAmbient || 'Presiona play'}
            </p>
          </div>

          {/* Mute */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-8 w-8"
          >
            {currentVolume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Slider de volumen */}
        <div className="mt-3 flex items-center gap-2">
          <Volume2 className="h-3 w-3 text-muted-foreground" />
          <Slider
            value={[currentVolume * 100]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-8 text-right">
            {Math.round(currentVolume * 100)}%
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
