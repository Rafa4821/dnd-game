import { Heart, Shield, Skull, Zap } from 'lucide-react'
import type { Combatant } from '@/types/combat'

interface CombatantCardProps {
  combatant: Combatant
  isCurrentTurn: boolean
  isTargetable: boolean
  onSelect?: () => void
}

export function CombatantCard({ 
  combatant, 
  isCurrentTurn, 
  isTargetable,
  onSelect 
}: CombatantCardProps) {
  const hpPercentage = (combatant.hp / combatant.maxHp) * 100
  
  const getHpColor = () => {
    if (hpPercentage > 60) return 'bg-green-500'
    if (hpPercentage > 30) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all
        ${combatant.isDead ? 'opacity-50 grayscale' : ''}
        ${isCurrentTurn ? 'border-primary bg-primary/10 ring-2 ring-primary' : 'border-border bg-card'}
        ${isTargetable && !combatant.isDead ? 'cursor-pointer hover:border-primary hover:bg-accent' : ''}
      `}
      onClick={isTargetable && !combatant.isDead ? onSelect : undefined}
    >
      {/* Indicador de turno actual */}
      {isCurrentTurn && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
          <Zap className="w-3 h-3 inline mr-1" />
          TURNO
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg flex items-center gap-2">
            {combatant.name}
            {combatant.isDead && <Skull className="w-4 h-4 text-destructive" />}
          </h3>
          <p className="text-xs text-muted-foreground">
            {combatant.type === 'player' ? 'Jugador' : 'Enemigo'}
          </p>
        </div>

        {/* AC */}
        <div className="flex items-center gap-1 px-2 py-1 bg-accent rounded">
          <Shield className="w-4 h-4" />
          <span className="font-bold text-sm">{combatant.ac}</span>
        </div>
      </div>

      {/* HP Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="font-medium">HP</span>
          </div>
          <span className="font-mono font-bold">
            {combatant.hp}/{combatant.maxHp}
          </span>
        </div>
        
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${getHpColor()}`}
            style={{ width: `${Math.max(0, hpPercentage)}%` }}
          />
        </div>
      </div>

      {/* Initiative */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Iniciativa</span>
        <span className="font-mono font-bold">{combatant.initiative}</span>
      </div>

      {/* Conditions */}
      {combatant.conditions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {combatant.conditions.map((condition, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-500 rounded"
            >
              {condition}
            </span>
          ))}
        </div>
      )}

      {/* Acted indicator */}
      {combatant.hasActed && !combatant.isDead && (
        <div className="mt-2 text-xs text-muted-foreground italic">
          ✓ Ya actuó este turno
        </div>
      )}
    </div>
  )
}
