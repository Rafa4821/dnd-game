import { useState } from 'react'
import { usePuzzleStore } from '@/stores/puzzleStore'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RotateCw, Lock, Unlock } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * La Rueda de Ceniza - Puzzle Cooperativo Principal
 * Anillos concéntricos que deben alinearse según pistas
 */

interface WheelPuzzleContentProps {
  rings: {
    id: string
    symbols: string[]
    currentPosition: number
    controllerId: string | null
    locked: boolean
  }[]
}

export function WheelPuzzle({ rings }: WheelPuzzleContentProps) {
  const user = useAuthStore(state => state.user)
  const { makeMove, progress } = usePuzzleStore()
  const [rotating, setRotating] = useState<string | null>(null)

  const handleRotate = async (ringId: string, direction: 'left' | 'right') => {
    if (!user || !progress) return
    
    const ring = rings.find(r => r.id === ringId)
    if (!ring) return
    
    // Solo el controlador del anillo puede rotarlo
    if (ring.controllerId && ring.controllerId !== user.uid) {
      alert('Este anillo es controlado por otro jugador')
      return
    }
    
    if (ring.locked) {
      alert('Este anillo está bloqueado')
      return
    }
    
    setRotating(ringId)
    
    try {
      const symbolCount = ring.symbols.length
      const newPosition = direction === 'right' 
        ? (ring.currentPosition + 1) % symbolCount
        : (ring.currentPosition - 1 + symbolCount) % symbolCount
      
      await makeMove(ringId, 'rotate', newPosition, user.uid)
      
      setTimeout(() => setRotating(null), 500)
    } catch (error) {
      console.error('Error rotating ring:', error)
      setRotating(null)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      {/* Visualización de la rueda */}
      <div className="relative w-full max-w-2xl aspect-square">
        {rings.map((ring, index) => {
          const size = 100 - (index * 15) // Tamaño decreciente
          const isControlledByMe = ring.controllerId === user?.uid
          
          return (
            <div
              key={ring.id}
              className={cn(
                "absolute inset-0 m-auto rounded-full border-4 flex items-center justify-center transition-all duration-500",
                rotating === ring.id && "animate-pulse",
                isControlledByMe && "border-primary",
                !isControlledByMe && ring.controllerId && "border-muted",
                ring.locked && "border-destructive"
              )}
              style={{
                width: `${size}%`,
                height: `${size}%`,
                transform: `rotate(${ring.currentPosition * (360 / ring.symbols.length)}deg)`,
              }}
            >
              {/* Símbolos en el anillo */}
              {ring.symbols.map((symbol, idx) => {
                const angle = (idx * 360) / ring.symbols.length
                const isActive = idx === 0 // El símbolo "activo" está arriba
                
                return (
                  <div
                    key={idx}
                    className={cn(
                      "absolute text-2xl font-bold transition-all",
                      isActive && "text-primary scale-125"
                    )}
                    style={{
                      transform: `rotate(${angle}deg) translateY(-${size / 2.5}%) rotate(-${angle}deg) rotate(-${ring.currentPosition * (360 / ring.symbols.length)}deg)`,
                    }}
                  >
                    {symbol}
                  </div>
                )
              })}
              
              {/* Indicador de control */}
              {ring.controllerId && (
                <div className="absolute top-2 right-2">
                  {ring.locked ? (
                    <Lock className="h-4 w-4 text-destructive" />
                  ) : (
                    <Unlock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              )}
            </div>
          )
        })}
        
        {/* Centro de la rueda */}
        <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-card border-2 border-border flex items-center justify-center">
          <span className="text-xs font-bold">RUEDA</span>
        </div>
      </div>

      {/* Controles por anillo */}
      <div className="w-full max-w-2xl space-y-2">
        {rings.map((ring, index) => {
          const isControlledByMe = ring.controllerId === user?.uid
          const canControl = !ring.controllerId || isControlledByMe
          
          return (
            <Card key={ring.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      Anillo {index + 1}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {ring.symbols[ring.currentPosition]}
                    </span>
                    {ring.locked && (
                      <span className="text-xs text-destructive flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Bloqueado
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRotate(ring.id, 'left')}
                      disabled={!canControl || ring.locked || rotating === ring.id}
                    >
                      <RotateCw className="h-4 w-4 rotate-180" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRotate(ring.id, 'right')}
                      disabled={!canControl || ring.locked || rotating === ring.id}
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pistas visuales */}
      <Card className="w-full max-w-2xl bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm text-center text-muted-foreground">
            Coordina con tu grupo para alinear todos los símbolos correctamente.
            Cada jugador controla un anillo diferente.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Wrapper que conecta WheelPuzzle con CooperativePuzzle
 */
export function WheelPuzzleWrapper({ sessionId: _sessionId, onComplete: _onComplete }: {
  sessionId: string
  onComplete: (success: boolean) => void
}) {
  const { progress } = usePuzzleStore()
  
  // Convertir progress a formato para WheelPuzzle
  const rings = progress?.currentElements.map((el, _idx) => ({
    id: el.id,
    symbols: ['☽', '☀', '⚔', '🗝'], // Símbolos de ejemplo
    currentPosition: el.position || 0,
    controllerId: el.ownerId,
    locked: el.locked,
  })) || []
  
  return (
    <div>
      {rings.length > 0 && <WheelPuzzle rings={rings} />}
    </div>
  )
}
