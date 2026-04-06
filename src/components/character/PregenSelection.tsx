import { getAllPregens } from '@/data/pregens'
import { Shield, Heart, Swords, Sparkles } from 'lucide-react'

interface PregenSelectionProps {
  selectedId: string | null
  onSelect: (id: string) => void
}

const CLASS_ICONS: Record<string, any> = {
  fighter: Shield,
  rogue: Sparkles,
  ranger: Swords,
  cleric: Heart,
  barbarian: Swords,
}

export function PregenSelection({ selectedId, onSelect }: PregenSelectionProps) {
  const pregens = getAllPregens()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Elige tu Personaje</h3>
        <p className="text-sm text-muted-foreground">
          Selecciona uno de los 6 cazadores preparados para la campaña Sangrebruma.
          Todos están en nivel 3 y optimizados para el combate contra no-muertos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pregens.map((pregen) => {
          const Icon = CLASS_ICONS[pregen.class] || Shield
          const isSelected = selectedId === pregen.pregenId
          
          return (
            <button
              key={pregen.pregenId}
              onClick={() => onSelect(pregen.pregenId!)}
              className={`p-4 border-2 rounded-lg text-left transition-all hover:border-primary ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-accent/50'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{pregen.name}</h4>
                    {isSelected && (
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded">
                        Seleccionado
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground capitalize mb-2">
                    {pregen.class} • Nivel {pregen.level}
                  </p>
                  
                  {/* Stats rápidos */}
                  <div className="flex gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {pregen.maxHp} HP
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {pregen.ac} AC
                    </span>
                  </div>
                  
                  {/* Rasgo destacado */}
                  {pregen.traits[0] && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      💎 {pregen.traits[0].name}
                    </p>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Info adicional */}
      <div className="p-4 bg-muted/30 border border-border rounded-lg text-sm">
        <p className="text-muted-foreground">
          <strong>Nota:</strong> Estos personajes ya están optimizados para la campaña.
          En el siguiente paso podrás personalizar el nombre y pequeños detalles.
        </p>
      </div>
    </div>
  )
}
