import { useEffect, useRef } from 'react'
import { Swords, Shield, Heart, Skull, TrendingUp, Activity, AlertTriangle } from 'lucide-react'
import type { CombatAction } from '@/types/combat'

interface CombatLogProps {
  actions: CombatAction[]
  maxHeight?: string
}

const ACTION_ICONS = {
  attack: Swords,
  dash: TrendingUp,
  disengage: Shield,
  dodge: Shield,
  help: Heart,
  hide: Activity,
  ready: AlertTriangle,
  search: Activity,
  use_object: Activity,
}

export function CombatLog({ actions, maxHeight = '500px' }: CombatLogProps) {
  const logEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll al final cuando llegue nueva acción
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [actions.length])

  if (actions.length === 0) {
    return (
      <div className="p-6 bg-card border border-border rounded-lg">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Swords className="w-8 h-8 text-primary/50" />
          </div>
          <p className="text-gray-400 italic">
            El combate acaba de comenzar...
          </p>
          <p className="text-xs text-gray-500">
            Las acciones aparecerán aquí
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-primary/10 border-b border-border">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Log de Combate
        </h3>
      </div>

      {/* Log entries */}
      <div 
        className="overflow-y-auto p-4 space-y-3"
        style={{ maxHeight }}
      >
        {actions.map((action, index) => {
          const Icon = ACTION_ICONS[action.type]
          const isAttack = action.type === 'attack'
          const hit = action.result.hit
          const critical = action.result.critical
          const damage = action.result.damage

          return (
            <div
              key={`${action.actorId}-${action.timestamp}-${index}`}
              className={`p-3 rounded-lg border transition-all animate-in slide-in-from-bottom-2 ${
                isAttack && hit
                  ? critical
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                  : isAttack && !hit
                  ? 'bg-gray-500/10 border-gray-500/30'
                  : 'bg-blue-500/10 border-blue-500/30'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isAttack && hit
                    ? critical
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                    : isAttack && !hit
                    ? 'bg-gray-500'
                    : 'bg-blue-500'
                }`}>
                  {isAttack && hit && damage !== undefined && damage > 0 ? (
                    <Skull className="w-4 h-4 text-white" />
                  ) : isAttack && !hit ? (
                    <Shield className="w-4 h-4 text-white" />
                  ) : (
                    <Icon className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium leading-relaxed">
                    {action.result.description}
                  </p>
                  
                  {/* Damage info */}
                  {isAttack && damage !== undefined && (
                    <div className="mt-2 flex items-center gap-3 text-xs">
                      {hit ? (
                        <>
                          <span className={`font-bold ${
                            critical ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                            {damage} de daño
                          </span>
                          {critical && (
                            <span className="px-2 py-0.5 bg-yellow-500 text-black font-bold rounded-full text-[10px] uppercase tracking-wide">
                              ¡Crítico!
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400 font-medium">
                          Falló
                        </span>
                      )}
                    </div>
                  )}

                  {/* Timestamp */}
                  <p className="mt-1 text-[10px] text-gray-500">
                    {new Date(action.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={logEndRef} />
      </div>

      {/* Footer con contador */}
      <div className="px-4 py-2 bg-card border-t border-border">
        <p className="text-xs text-gray-500 text-center">
          {actions.length} {actions.length === 1 ? 'acción' : 'acciones'} registradas
        </p>
      </div>
    </div>
  )
}
