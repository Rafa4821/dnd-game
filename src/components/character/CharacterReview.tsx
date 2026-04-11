import { getPregenById } from '@/data/pregens'
import { Check } from 'lucide-react'

interface CharacterReviewProps {
  pregenId: string
  name: string
  customizations: Record<string, unknown>
}

export function CharacterReview({ pregenId, name }: CharacterReviewProps) {
  const pregen = getPregenById(pregenId)

  if (!pregen) return null

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Check className="w-6 h-6 text-green-500" />
          <h3 className="text-xl font-semibold">Personaje Listo</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Revisa los detalles finales de tu personaje antes de unirte a la aventura.
        </p>
      </div>

      {/* Card de personaje */}
      <div className="border-2 border-primary rounded-lg overflow-hidden bg-card">
        {/* Header */}
        <div className="bg-primary/10 p-6 border-b border-primary/20">
          <h4 className="text-2xl font-bold mb-1">{name || pregen.name}</h4>
          <p className="text-muted-foreground capitalize">
            {pregen.class} • Nivel {pregen.level}
          </p>
        </div>

        {/* Stats grid */}
        <div className="p-6 space-y-6">
          {/* Stats principales */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="text-3xl font-bold text-primary">{pregen.maxHp}</div>
              <div className="text-sm text-muted-foreground mt-1">Puntos de Golpe</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="text-3xl font-bold text-primary">{pregen.ac}</div>
              <div className="text-sm text-muted-foreground mt-1">Clase de Armadura</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="text-3xl font-bold text-primary">+{pregen.proficiencyBonus}</div>
              <div className="text-sm text-muted-foreground mt-1">Competencia</div>
            </div>
          </div>

          {/* Habilidades */}
          <div>
            <h5 className="font-semibold mb-3">Puntuaciones de Habilidad</h5>
            <div className="grid grid-cols-6 gap-3">
              {Object.entries(pregen.abilities).map(([ability, score]) => (
                <div key={ability} className="p-3 bg-muted/30 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground uppercase mb-1">{ability}</div>
                  <div className="text-xl font-bold">{score}</div>
                  <div className="text-xs text-muted-foreground">
                    {score >= 10 ? '+' : ''}{Math.floor((score - 10) / 2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rasgos */}
          <div>
            <h5 className="font-semibold mb-3">Rasgos y Habilidades</h5>
            <div className="space-y-2">
              {pregen.traits.map((trait) => (
                <div key={trait.id} className="p-3 bg-muted/30 rounded-lg">
                  <div className="font-medium text-sm mb-1">{trait.name}</div>
                  <div className="text-xs text-muted-foreground">{trait.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Habilidades especiales */}
          {pregen.specialAbilities.length > 0 && (
            <div>
              <h5 className="font-semibold mb-3">Habilidades Especiales</h5>
              <div className="space-y-2">
                {pregen.specialAbilities.map((ability) => (
                  <div key={ability.id} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-sm">{ability.name}</div>
                      {ability.maxUses && (
                        <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                          {ability.uses}/{ability.maxUses} usos
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{ability.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Equipamiento */}
          <div>
            <h5 className="font-semibold mb-3">Equipamiento Inicial</h5>
            <div className="grid grid-cols-2 gap-2">
              {pregen.inventory.map((item) => (
                <div key={item.id} className="p-2 bg-muted/30 rounded text-sm">
                  <div className="font-medium">{item.name}</div>
                  {item.quantity > 1 && (
                    <div className="text-xs text-muted-foreground">x{item.quantity}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm">
        <p className="text-yellow-600 dark:text-yellow-400">
          ⚠️ <strong>Importante:</strong> Una vez creado, el personaje no podrá cambiarse.
          Asegúrate de que todo esté correcto antes de continuar.
        </p>
      </div>
    </div>
  )
}
