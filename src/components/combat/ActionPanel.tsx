import { Sword, Wind, ShieldOff, Eye, HandHelping, Search, Sparkles } from 'lucide-react'
import type { CombatActionType } from '@/types/combat'

interface ActionPanelProps {
  onAction: (actionType: CombatActionType) => void
  disabled: boolean
  hasActed: boolean
}

const ACTIONS: Array<{
  type: CombatActionType
  label: string
  icon: React.ReactNode
  description: string
  requiresTarget: boolean
}> = [
  {
    type: 'attack',
    label: 'Atacar',
    icon: <Sword className="w-5 h-5" />,
    description: 'Ataque cuerpo a cuerpo o a distancia',
    requiresTarget: true,
  },
  {
    type: 'dash',
    label: 'Correr',
    icon: <Wind className="w-5 h-5" />,
    description: 'Doblar movimiento este turno',
    requiresTarget: false,
  },
  {
    type: 'disengage',
    label: 'Desvincularse',
    icon: <ShieldOff className="w-5 h-5" />,
    description: 'Moverse sin ataques de oportunidad',
    requiresTarget: false,
  },
  {
    type: 'dodge',
    label: 'Esquivar',
    icon: <Eye className="w-5 h-5" />,
    description: 'Ventaja en tiradas de salvación',
    requiresTarget: false,
  },
  {
    type: 'help',
    label: 'Ayudar',
    icon: <HandHelping className="w-5 h-5" />,
    description: 'Dar ventaja a un aliado',
    requiresTarget: false,
  },
  {
    type: 'search',
    label: 'Buscar',
    icon: <Search className="w-5 h-5" />,
    description: 'Buscar algo oculto',
    requiresTarget: false,
  },
]

export function ActionPanel({ onAction, disabled, hasActed }: ActionPanelProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-primary/10 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Acciones
          </h3>
          {hasActed && (
            <span className="px-3 py-1 text-xs bg-yellow-500 text-black font-semibold rounded-full">
              ✓ Ya actuaste
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">

        <div className="grid grid-cols-2 gap-3">
          {ACTIONS.map((action) => (
            <button
              key={action.type}
              onClick={() => onAction(action.type)}
              disabled={disabled || hasActed}
              className="group relative p-3 text-left border-2 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed border-border hover:border-primary hover:bg-primary/5 hover:scale-105 active:scale-95"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                  {action.icon}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-foreground">{action.label}</div>
                  {action.requiresTarget && (
                    <div className="text-[10px] text-yellow-500 font-medium">
                      🎯 Req. objetivo
                    </div>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-gray-400 leading-tight">
                {action.description}
              </p>
            </button>
          ))}
        </div>

        {hasActed && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-500 text-center font-medium">
              💡 Ya realizaste tu acción. Haz clic en "Terminar Turno" cuando estés listo.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
