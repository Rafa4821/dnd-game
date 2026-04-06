import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CombatArena } from '@/components/combat/CombatArena'
import { Swords } from 'lucide-react'

interface CombatNodeProps {
  encounterId: string
  onCombatEnd: () => void
}

export function CombatNode({ encounterId, onCombatEnd }: CombatNodeProps) {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [combatStarted, setCombatStarted] = useState(false)

  const handleStartCombat = () => {
    setCombatStarted(true)
  }

  const handleCombatEnd = (victory: boolean) => {
    console.log(victory ? 'Victoria en combate' : 'Derrota en combate')
    onCombatEnd()
  }

  if (combatStarted && sessionId) {
    return (
      <CombatArena
        sessionId={sessionId}
        encounterId={encounterId}
        onCombatEnd={handleCombatEnd}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="p-6 bg-destructive/10 border-2 border-destructive/20 rounded-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
            <Swords className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">¡Combate!</h3>
            <p className="text-sm text-muted-foreground">
              Encuentro: {encounterId}
            </p>
          </div>
        </div>
        
        <p className="text-sm mb-4">
          Prepárate para la batalla. Tus enemigos no mostrarán piedad.
        </p>

        <button
          onClick={handleStartCombat}
          className="w-full py-3 bg-destructive text-destructive-foreground font-medium rounded-lg hover:bg-destructive/90 transition-colors"
        >
          Iniciar Combate
        </button>
      </div>

      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm">
        <p className="text-yellow-600 dark:text-yellow-400">
          🚧 <strong>Sistema de combate en desarrollo</strong><br />
          El combate completo se implementará en el Paquete 7.
          Por ahora, el combate se resolverá automáticamente.
        </p>
      </div>
    </div>
  )
}
