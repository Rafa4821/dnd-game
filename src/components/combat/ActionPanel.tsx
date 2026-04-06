import { Sword, Wind, ShieldOff, Eye, HandHelping, Search } from 'lucide-react'
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Acciones</h3>
        {hasActed && (
          <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-500 rounded">
            Ya actuaste
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((action) => (
          <button
            key={action.type}
            onClick={() => onAction(action.type)}
            disabled={disabled || hasActed}
            className="group relative p-4 text-left border border-border rounded-lg hover:border-primary hover:bg-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:bg-transparent"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded group-hover:bg-primary/20 transition-colors">
                {action.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{action.label}</div>
                {action.requiresTarget && (
                  <div className="text-xs text-muted-foreground">
                    Selecciona objetivo
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {action.description}
            </p>
          </button>
        ))}
      </div>

      {hasActed && (
        <div className="p-3 bg-muted/50 border border-border rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            💡 Ya realizaste tu acción. Haz clic en "Terminar Turno" cuando estés listo.
          </p>
        </div>
      )}
    </div>
  )
}
