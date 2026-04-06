import { Heart, Shield, Zap, Skull, Crown } from 'lucide-react'
import type { Combatant } from '@/types/combat'

interface CombatHUDProps {
  combatants: Combatant[]
  currentTurnId: string | null
  round: number
}

export function CombatHUD({ combatants, currentTurnId, round }: CombatHUDProps) {
  const players = combatants.filter(c => c.type === 'player')
  const enemies = combatants.filter(c => c.type === 'enemy')

  const renderCombatant = (combatant: Combatant) => {
    const hpPercent = (combatant.hp / combatant.maxHp) * 100
    const isCurrentTurn = combatant.id === currentTurnId
    const isPlayer = combatant.type === 'player'

    return (
      <div
        key={combatant.id}
        className={`relative p-3 rounded-lg border-2 transition-all ${
          isCurrentTurn
            ? 'border-yellow-500 bg-yellow-500/10 shadow-lg shadow-yellow-500/20'
            : combatant.isDead
            ? 'border-gray-600 bg-gray-900/50 opacity-50'
            : isPlayer
            ? 'border-green-500/30 bg-green-500/5'
            : 'border-red-500/30 bg-red-500/5'
        }`}
      >
        {/* Current turn indicator */}
        {isCurrentTurn && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
            <Crown className="w-3 h-3 text-black" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              combatant.isDead ? 'bg-gray-500' : isPlayer ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className={`font-semibold text-sm ${
              combatant.isDead ? 'text-gray-500 line-through' : 'text-foreground'
            }`}>
              {combatant.name}
            </span>
          </div>
          
          {combatant.hasActed && !combatant.isDead && (
            <span className="text-[10px] px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full font-medium">
              Actuó
            </span>
          )}
        </div>

        {/* HP Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-gray-400">
              <Heart className="w-3 h-3" />
              <span className="font-medium">HP</span>
            </span>
            <span className={`font-bold ${
              hpPercent > 50 ? 'text-green-500' : hpPercent > 25 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {combatant.hp}/{combatant.maxHp}
            </span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                hpPercent > 50 ? 'bg-green-500' : hpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.max(0, hpPercent)}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-400">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>AC {combatant.ac}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span>Init {combatant.initiative > 0 ? '+' : ''}{combatant.initiative}</span>
          </div>
        </div>

        {/* Death indicator */}
        {combatant.isDead && (
          <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
            <Skull className="w-8 h-8 text-gray-500" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-primary/10 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Estado del Combate
          </h3>
          <span className="text-sm font-semibold text-gray-300 px-3 py-1 bg-card border border-border rounded-lg">
            Ronda {round}
          </span>
        </div>
      </div>

      {/* Combatants */}
      <div className="p-4 space-y-4">
        {/* Players section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Jugadores ({players.filter(p => !p.isDead).length}/{players.length})
            </h4>
          </div>
          <div className="space-y-2">
            {players.map((c) => renderCombatant(c))}
          </div>
        </div>

        {/* Enemies section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Enemigos ({enemies.filter(e => !e.isDead).length}/{enemies.length})
            </h4>
          </div>
          <div className="space-y-2">
            {enemies.map((c) => renderCombatant(c))}
          </div>
        </div>
      </div>
    </div>
  )
}
