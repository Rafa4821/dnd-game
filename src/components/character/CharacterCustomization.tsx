import { getPregenById } from '@/data/pregens'

interface CharacterCustomizationProps {
  pregenId: string
  name: string
  onNameChange: (name: string) => void
  onCustomizationsChange: (customizations: Record<string, unknown>) => void
}

export function CharacterCustomization({
  pregenId,
  name,
  onNameChange,
}: CharacterCustomizationProps) {
  const pregen = getPregenById(pregenId)

  if (!pregen) return null

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Personaliza tu {pregen.name}</h3>
        <p className="text-sm text-muted-foreground">
          Dale un nombre único a tu personaje. Las stats y habilidades ya están optimizadas.
        </p>
      </div>

      {/* Nombre */}
      <div className="space-y-2">
        <label htmlFor="character-name" className="block text-sm font-medium">
          Nombre del Personaje *
        </label>
        <input
          id="character-name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={`Ej: ${pregen.name}, Erik el Cazador, etc.`}
          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          maxLength={30}
          autoFocus
        />
        <p className="text-xs text-muted-foreground">
          {name.length}/30 caracteres
        </p>
      </div>

      {/* Preview de stats */}
      <div className="space-y-4">
        <h4 className="font-semibold">Resumen del Personaje</h4>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Stats principales */}
          <div className="p-4 bg-muted/30 border border-border rounded-lg">
            <h5 className="text-sm font-medium mb-3">Combate</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Puntos de Golpe:</span>
                <span className="font-medium">{pregen.maxHp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Clase de Armadura:</span>
                <span className="font-medium">{pregen.ac}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Velocidad:</span>
                <span className="font-medium">{pregen.speed} pies</span>
              </div>
            </div>
          </div>

          {/* Habilidades */}
          <div className="p-4 bg-muted/30 border border-border rounded-lg">
            <h5 className="text-sm font-medium mb-3">Habilidades</h5>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {Object.entries(pregen.abilities).map(([ability, score]) => (
                <div key={ability} className="text-center">
                  <div className="text-muted-foreground uppercase">{ability}</div>
                  <div className="font-bold text-lg">{score}</div>
                  <div className="text-muted-foreground">
                    ({score >= 10 ? '+' : ''}{Math.floor((score - 10) / 2)})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rasgos */}
        <div className="p-4 bg-muted/30 border border-border rounded-lg">
          <h5 className="text-sm font-medium mb-3">Rasgos Especiales</h5>
          <div className="space-y-2">
            {pregen.traits.map((trait) => (
              <div key={trait.id} className="text-sm">
                <div className="font-medium">{trait.name}</div>
                <div className="text-muted-foreground text-xs">{trait.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventario */}
        <div className="p-4 bg-muted/30 border border-border rounded-lg">
          <h5 className="text-sm font-medium mb-3">Equipamiento</h5>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {pregen.inventory.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <span className="text-muted-foreground">•</span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
