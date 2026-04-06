import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

interface EnhancedDiceAnimationProps {
  sides?: 6 | 20 | 8 | 10 | 12 | 4 // Tipo de dado
  duration?: number // Duración en ms
  onComplete?: (result: number) => void
  autoPlay?: boolean
}

export function EnhancedDiceAnimation({ 
  sides = 6, 
  duration = 2500,
  onComplete,
  autoPlay = true 
}: EnhancedDiceAnimationProps) {
  const [rolling, setRolling] = useState(autoPlay)
  const [result, setResult] = useState<number>(1)
  const [currentNumber, setCurrentNumber] = useState<number>(1)

  useEffect(() => {
    if (!autoPlay) return

    let frameCount = 0
    const totalFrames = duration / 50 // 50ms por frame
    
    // Animación de números cambiando
    const rollInterval = setInterval(() => {
      setCurrentNumber(Math.floor(Math.random() * sides) + 1)
      frameCount++
      
      // Ralentizar gradualmente
      if (frameCount > totalFrames * 0.7) {
        clearInterval(rollInterval)
        // Fase final más lenta
        const slowInterval = setInterval(() => {
          setCurrentNumber(Math.floor(Math.random() * sides) + 1)
        }, 150)
        
        setTimeout(() => {
          clearInterval(slowInterval)
          const finalResult = Math.floor(Math.random() * sides) + 1
          setResult(finalResult)
          setCurrentNumber(finalResult)
          setRolling(false)
          onComplete?.(finalResult)
        }, 800)
      }
    }, 50)

    return () => {
      clearInterval(rollInterval)
    }
  }, [sides, duration, onComplete, autoPlay])

  const getDiceColor = () => {
    switch (sides) {
      case 20: return 'from-purple-500 to-purple-700'
      case 12: return 'from-blue-500 to-blue-700'
      case 10: return 'from-green-500 to-green-700'
      case 8: return 'from-yellow-500 to-yellow-700'
      case 6: return 'from-red-500 to-red-700'
      case 4: return 'from-pink-500 to-pink-700'
      default: return 'from-gray-500 to-gray-700'
    }
  }

  const getDiceShape = () => {
    switch (sides) {
      case 20: return 'rounded-2xl' // Icosaedro
      case 12: return 'rounded-xl' // Dodecaedro
      case 10: return 'rounded-lg rotate-45' // Decaedro
      case 8: return 'rounded-lg' // Octaedro
      case 6: return 'rounded-xl' // Cubo
      case 4: return 'rounded-lg rotate-12' // Tetraedro
      default: return 'rounded-xl'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-6">
      {/* Dado 3D animado */}
      <div className="relative">
        <div 
          className={`
            w-32 h-32 bg-gradient-to-br ${getDiceColor()} ${getDiceShape()}
            shadow-2xl flex items-center justify-center
            transform transition-all duration-100
            ${rolling ? 'animate-bounce' : 'scale-110'}
          `}
          style={{
            transform: rolling 
              ? `rotate3d(1, 1, 1, ${currentNumber * 60}deg) scale(1.1)`
              : 'rotate3d(0, 0, 0, 0deg) scale(1.1)',
            transition: rolling ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Número del dado */}
          <div className="text-6xl font-black text-white drop-shadow-2xl">
            {currentNumber}
          </div>

          {/* Brillo animado */}
          {rolling && (
            <div className="absolute inset-0 bg-white/20 rounded-inherit animate-pulse" />
          )}
        </div>

        {/* Sombra dinámica */}
        <div 
          className={`absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/30 rounded-full blur-xl transition-all ${
            rolling ? 'w-24 h-6' : 'w-28 h-8'
          }`}
        />

        {/* Partículas de brillo */}
        {!rolling && (
          <>
            <Sparkles className="absolute -top-4 -left-4 w-8 h-8 text-yellow-400 animate-pulse" />
            <Sparkles className="absolute -top-4 -right-4 w-6 h-6 text-yellow-300 animate-pulse delay-150" />
            <Sparkles className="absolute -bottom-2 left-0 w-5 h-5 text-yellow-200 animate-pulse delay-300" />
          </>
        )}
      </div>

      {/* Información */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="px-3 py-1 bg-card border border-border rounded-lg text-sm font-mono font-semibold text-gray-300">
            d{sides}
          </span>
        </div>
        
        <p className={`text-xl font-bold transition-all ${
          rolling ? 'text-gray-400' : 'text-primary scale-110'
        }`}>
          {rolling ? 'Tirando...' : `Resultado: ${result}`}
        </p>

        {!rolling && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Listo</span>
          </div>
        )}
      </div>
    </div>
  )
}
