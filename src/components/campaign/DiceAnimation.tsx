import { useEffect, useState } from 'react'
import { Dices } from 'lucide-react'

interface DiceAnimationProps {
  onComplete: () => void
}

export function DiceAnimation({ onComplete }: DiceAnimationProps) {
  const [rolling, setRolling] = useState(true)
  const [result, setResult] = useState<number>(1)

  useEffect(() => {
    // Animación de rodar dado
    const rollInterval = setInterval(() => {
      setResult(Math.floor(Math.random() * 6) + 1)
    }, 100)

    // Detener después de 3 segundos
    const stopTimeout = setTimeout(() => {
      clearInterval(rollInterval)
      setResult(Math.floor(Math.random() * 6) + 1)
      setRolling(false)
      onComplete()
    }, 3000)

    return () => {
      clearInterval(rollInterval)
      clearTimeout(stopTimeout)
    }
  }, [onComplete])

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Dado animado */}
      <div className={`relative ${rolling ? 'animate-bounce' : ''}`}>
        <div 
          className={`w-24 h-24 rounded-xl bg-gradient-to-br from-red-500 to-red-700 shadow-2xl flex items-center justify-center transform transition-transform ${
            rolling ? 'rotate-[360deg]' : ''
          }`}
          style={{
            transition: rolling ? 'transform 0.1s linear' : 'transform 0.5s ease-out',
          }}
        >
          {/* Puntos del dado */}
          <div className="grid grid-cols-3 gap-2 p-4">
            {[...Array(9)].map((_, i) => {
              const showDot = 
                (result === 1 && i === 4) ||
                (result === 2 && (i === 0 || i === 8)) ||
                (result === 3 && (i === 0 || i === 4 || i === 8)) ||
                (result === 4 && (i === 0 || i === 2 || i === 6 || i === 8)) ||
                (result === 5 && (i === 0 || i === 2 || i === 4 || i === 6 || i === 8)) ||
                (result === 6 && (i === 0 || i === 2 || i === 3 || i === 5 || i === 6 || i === 8))
              
              return (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    showDot ? 'bg-white' : 'bg-transparent'
                  }`}
                />
              )
            })}
          </div>
        </div>

        {/* Sombra del dado */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/20 rounded-full blur-md" />
      </div>

      {/* Texto */}
      <div className="mt-8 text-center">
        <Dices className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
        <p className="text-lg font-semibold text-gray-300">
          {rolling ? 'Tirando el dado...' : `Resultado: ${result}`}
        </p>
      </div>
    </div>
  )
}
