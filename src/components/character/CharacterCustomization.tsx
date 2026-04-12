import { useState, useEffect } from 'react'
import { getPregenById } from '@/data/pregens'
import { Plus, Minus, Sparkles, Shield, Heart, Zap } from 'lucide-react'

interface CharacterCustomizationProps {
  pregenId: string
  name: string
  onNameChange: (name: string) => void
  onCustomizationsChange: (customizations: Record<string, unknown>) => void
}

type AbilityScores = {
  str: number
  dex: number
  con: number
  int: number
  wis: number
  cha: number
}

export function CharacterCustomization({
  pregenId,
  name,
  onNameChange,
  onCustomizationsChange,
}: CharacterCustomizationProps) {
  const pregen = getPregenById(pregenId)
  
  const [abilities, setAbilities] = useState<AbilityScores>({
    str: pregen?.abilities.str || 10,
    dex: pregen?.abilities.dex || 10,
    con: pregen?.abilities.con || 10,
    int: pregen?.abilities.int || 10,
    wis: pregen?.abilities.wis || 10,
    cha: pregen?.abilities.cha || 10,
  })
  
  const [pointsRemaining, setPointsRemaining] = useState(0)
  
  useEffect(() => {
    if (pregen) {
      const totalOriginal = Object.values(pregen.abilities).reduce((sum, val) => sum + val, 0)
      const totalCurrent = Object.values(abilities).reduce((sum, val) => sum + val, 0)
      setPointsRemaining(totalOriginal - totalCurrent)
    }
  }, [abilities, pregen])
  
  useEffect(() => {
    onCustomizationsChange({ abilities })
  }, [abilities, onCustomizationsChange])
  
  const handleAbilityChange = (ability: keyof AbilityScores, delta: number) => {
    const newValue = abilities[ability] + delta
    if (newValue >= 3 && newValue <= 20) {
      setAbilities(prev => ({ ...prev, [ability]: newValue }))
    }
  }
  
  const calculateModifier = (score: number) => {
    return Math.floor((score - 10) / 2)
  }

  if (!pregen) return null
  
  const abilityLabels: Record<keyof AbilityScores, string> = {
    str: 'FUE',
    dex: 'DES',
    con: 'CON',
    int: 'INT',
    wis: 'SAB',
    cha: 'CAR',
  }
  
  const abilityColors: Record<keyof AbilityScores, string> = {
    str: 'red',
    dex: 'green',
    con: 'orange',
    int: 'blue',
    wis: 'purple',
    cha: 'pink',
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-white">Personaliza tu {pregen.name}</h3>
        <p className="text-base text-gray-300">
          Dale un nombre único y ajusta las estadísticas base de tu personaje.
        </p>
      </div>

      {/* Nombre */}
      <div className="space-y-3">
        <label htmlFor="character-name" className="block text-lg font-bold text-white">
          📝 Nombre del Personaje *
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl blur opacity-20 group-focus-within:opacity-40 transition duration-300" />
          <input
            id="character-name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={`Ej: ${pregen.name}, Erik el Cazador, etc.`}
            className="relative w-full px-5 py-4 bg-slate-800/90 backdrop-blur-sm border-2 border-red-700/50 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all text-white placeholder:text-gray-500 text-lg font-medium"
            maxLength={30}
            autoFocus
          />
        </div>
        <p className="text-sm text-gray-400">
          {name.length}/30 caracteres
        </p>
      </div>

      {/* Editor de Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-white">⚔️ Estadísticas Base</h4>
          <div className={`px-4 py-2 rounded-lg font-bold ${
            pointsRemaining === 0 
              ? 'bg-green-950/30 border border-green-600/30 text-green-300' 
              : pointsRemaining > 0
              ? 'bg-amber-950/30 border border-amber-600/30 text-amber-300'
              : 'bg-red-950/30 border border-red-600/30 text-red-300'
          }`}>
            Puntos: {pointsRemaining > 0 ? '+' : ''}{pointsRemaining}
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {(Object.keys(abilities) as Array<keyof AbilityScores>).map((ability) => {
            const color = abilityColors[ability]
            const score = abilities[ability]
            const modifier = calculateModifier(score)
            
            return (
              <div key={ability} className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-br from-${color}-600 to-${color}-700 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300`} />
                <div className="relative p-4 bg-slate-800/80 backdrop-blur-sm border-2 border-slate-700/50 rounded-xl">
                  <div className="text-center mb-3">
                    <div className={`text-xs font-bold text-${color}-400 uppercase mb-1`}>
                      {abilityLabels[ability]}
                    </div>
                    <div className="text-3xl font-bold text-white">{score}</div>
                    <div className="text-sm text-gray-400 font-medium">
                      ({modifier >= 0 ? '+' : ''}{modifier})
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAbilityChange(ability, -1)}
                      disabled={score <= 3}
                      className="flex-1 p-2 bg-slate-700/50 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all border border-slate-600/50"
                    >
                      <Minus className="w-4 h-4 mx-auto text-red-400" />
                    </button>
                    <button
                      onClick={() => handleAbilityChange(ability, 1)}
                      disabled={score >= 20 || pointsRemaining <= 0}
                      className="flex-1 p-2 bg-slate-700/50 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all border border-slate-600/50"
                    >
                      <Plus className="w-4 h-4 mx-auto text-green-400" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="p-4 bg-blue-950/30 border border-blue-600/30 rounded-xl">
          <p className="text-sm text-blue-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Consejo:</strong> Ajusta las estadísticas según tu estilo de juego.
              El total de puntos debe permanecer igual al original.
            </span>
          </p>
        </div>
      </div>

      {/* Preview de combate */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-white">🛡️ Resumen de Combate</h4>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
            <div className="relative p-5 bg-slate-800/80 backdrop-blur-sm border-2 border-red-900/50 rounded-xl text-center">
              <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{pregen.maxHp}</div>
              <div className="text-sm text-gray-400">Puntos de Vida</div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
            <div className="relative p-5 bg-slate-800/80 backdrop-blur-sm border-2 border-blue-900/50 rounded-xl text-center">
              <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{pregen.ac}</div>
              <div className="text-sm text-gray-400">Clase de Armadura</div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
            <div className="relative p-5 bg-slate-800/80 backdrop-blur-sm border-2 border-amber-900/50 rounded-xl text-center">
              <Zap className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{pregen.speed}</div>
              <div className="text-sm text-gray-400">Velocidad (pies)</div>
            </div>
          </div>
        </div>

        {/* Rasgos */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
          <div className="relative p-5 bg-slate-800/80 backdrop-blur-sm border-2 border-purple-900/50 rounded-xl">
            <h5 className="text-base font-bold text-purple-300 mb-3">✨ Rasgos Especiales</h5>
            <div className="space-y-3">
              {pregen.traits.slice(0, 3).map((trait) => (
                <div key={trait.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <div className="font-bold text-sm text-white mb-1">{trait.name}</div>
                  <div className="text-xs text-gray-400">{trait.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inventario */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
          <div className="relative p-5 bg-slate-800/80 backdrop-blur-sm border-2 border-green-900/50 rounded-xl">
            <h5 className="text-base font-bold text-green-300 mb-3">🎒 Equipamiento Inicial</h5>
            <div className="grid grid-cols-2 gap-3">
              {pregen.inventory.slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <span className="text-green-400">•</span>
                  <span className="text-sm text-white font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
