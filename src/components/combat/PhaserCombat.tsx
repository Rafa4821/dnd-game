import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { GAME_CONFIG } from '@/phaser/config'
import { TacticalCombatScene } from '@/phaser/scenes/TacticalCombatScene'
import type { CombatState, CombatActionType } from '@/types/combat'

interface PhaserCombatProps {
  combatState: CombatState
  onAction: (action: CombatActionType, targetId?: string) => void | Promise<void>
  onEndTurn: () => void
}

export function PhaserCombat({ combatState, onAction, onEndTurn }: PhaserCombatProps) {
  const gameRef = useRef<Phaser.Game | null>(null)
  const sceneRef = useRef<TacticalCombatScene | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Inicializar Phaser
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return

    const config = {
      ...GAME_CONFIG,
      parent: containerRef.current,
    }

    gameRef.current = new Phaser.Game(config)

    // Obtener referencia a la escena
    gameRef.current.events.once('ready', () => {
      sceneRef.current = gameRef.current!.scene.getScene('TacticalCombatScene') as TacticalCombatScene
      
      if (sceneRef.current) {
        sceneRef.current.setCallbacks(onAction, onEndTurn)
        sceneRef.current.updateCombatState(combatState)
      }
    })

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
        sceneRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Actualizar estado del combate
  useEffect(() => {
    if (sceneRef.current && combatState) {
      sceneRef.current.updateCombatState(combatState)
      
      // Highlight turno actual
      if (combatState.turnOrder.length > 0) {
        const currentId = combatState.turnOrder[combatState.currentTurnIndex]
        sceneRef.current.highlightCurrentTurn(currentId)
      }
    }
  }, [combatState])

  // Actualizar callbacks cuando cambien
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setCallbacks(onAction, onEndTurn)
    }
  }, [onAction, onEndTurn])

  return (
    <div className="relative w-full h-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] bg-gray-900 rounded-lg overflow-hidden border-2 border-primary/30">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Overlay de información */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/70 p-2 sm:p-4 rounded-lg backdrop-blur-sm border border-primary/30 text-xs sm:text-sm">
        <div className="text-white space-y-2">
          <div className="text-lg font-bold border-b border-primary/30 pb-2">
            Ronda {combatState.round}
          </div>
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span>Jugadores: {combatState.combatants.filter(c => c.type === 'player' && !c.isDead).length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>Enemigos: {combatState.combatants.filter(c => c.type === 'enemy' && !c.isDead).length}</span>
            </div>
          </div>
          
          {/* Turno actual */}
          {combatState.turnOrder.length > 0 && (
            <div className="mt-3 pt-3 border-t border-primary/30">
              <div className="text-xs text-gray-400 mb-1">Turno de:</div>
              <div className="font-semibold text-primary">
                {(() => {
                  const currentId = combatState.turnOrder[combatState.currentTurnIndex]
                  const current = combatState.combatants.find(c => c.id === currentId)
                  return current?.name || 'Desconocido'
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controles */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 px-6 py-3 rounded-full backdrop-blur-sm border border-primary/30">
        <div className="flex items-center gap-4 text-white text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>Click: Seleccionar/Mover</span>
          </div>
          <div className="w-px h-4 bg-white/30"></div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
            <span>Click enemigo: Atacar</span>
          </div>
          <div className="w-px h-4 bg-white/30"></div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">ESPACIO</kbd>
            <span>Terminar turno</span>
          </div>
        </div>
      </div>
    </div>
  )
}
