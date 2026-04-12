import { useState } from 'react'
import { getAllPregens } from '@/data/pregens'
import { CHARACTER_LORE_DATA } from '@/data/characterLore'
import { Shield, Heart, Swords, Sparkles, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'

interface PregenSelectionProps {
  selectedId: string | null
  onSelect: (id: string) => void
}

const CLASS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  fighter: Shield,
  rogue: Sparkles,
  ranger: Swords,
  cleric: Heart,
  barbarian: Swords,
}

export function PregenSelection({ selectedId, onSelect }: PregenSelectionProps) {
  const pregens = getAllPregens()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-white">Elige tu Cazador</h3>
        <p className="text-base text-gray-300 leading-relaxed">
          Selecciona uno de los 13 cazadores preparados para la campaña Sangrebruma.
          Todos están en nivel 3 y optimizados para el combate contra no-muertos.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pregens.map((pregen) => {
          const Icon = CLASS_ICONS[pregen.class] || Shield
          const isSelected = selectedId === pregen.pregenId
          const isExpanded = expandedId === pregen.pregenId
          const lore = CHARACTER_LORE_DATA[pregen.pregenId || '']
          
          return (
            <div
              key={pregen.pregenId}
              className={`relative group transition-all ${
                isSelected ? 'scale-[1.02]' : ''
              }`}
            >
              {/* Glow effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300 ${
                isSelected ? 'from-red-600 to-rose-600 opacity-40' : 'from-purple-600 to-pink-600'
              }`} />
              
              <div className={`relative bg-slate-800/90 backdrop-blur-sm border-2 rounded-2xl transition-all ${
                isSelected
                  ? 'border-red-600/60 shadow-lg shadow-red-900/30'
                  : 'border-slate-700/50 hover:border-purple-600/50'
              }`}>
                {/* Header - Clickable para seleccionar */}
                <button
                  onClick={() => onSelect(pregen.pregenId!)}
                  className="w-full p-5 text-left"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon con glow */}
                    <div className="relative">
                      <div className={`absolute inset-0 blur-lg rounded-lg ${
                        isSelected ? 'bg-red-500/30' : 'bg-purple-500/20'
                      }`} />
                      <div className={`relative w-16 h-16 rounded-xl flex items-center justify-center border-2 ${
                        isSelected 
                          ? 'bg-gradient-to-br from-red-600/20 to-rose-700/20 border-red-500/40' 
                          : 'bg-slate-700/50 border-slate-600/50'
                      }`}>
                        <Icon className={`w-8 h-8 ${
                          isSelected ? 'text-red-400' : 'text-purple-400'
                        }`} />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-xl font-bold text-white">{pregen.name}</h4>
                        {isSelected && (
                          <span className="px-3 py-1 bg-gradient-to-r from-red-600 to-rose-700 text-white text-xs font-bold rounded-lg shadow-lg">
                            ✓ Seleccionado
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-400 capitalize mb-3 font-medium">
                        {pregen.class} • Nivel {pregen.level}
                      </p>
                      
                      {/* Stats en cards */}
                      <div className="flex gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded-lg border border-slate-600/50">
                          <Heart className="w-4 h-4 text-red-400" />
                          <span className="text-sm font-bold text-white">{pregen.maxHp}</span>
                          <span className="text-xs text-gray-400">HP</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded-lg border border-slate-600/50">
                          <Shield className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-bold text-white">{pregen.ac}</span>
                          <span className="text-xs text-gray-400">AC</span>
                        </div>
                      </div>
                      
                      {/* Rasgo destacado */}
                      {pregen.traits[0] && (
                        <div className="mt-3 p-2 bg-amber-950/30 border border-amber-600/30 rounded-lg">
                          <p className="text-xs text-amber-300 font-medium">
                            💎 {pregen.traits[0].name}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </button>

                {/* Botón expandir biografía */}
                {lore && (
                  <div className="px-5 pb-3">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : pregen.pregenId!)}
                      className="w-full flex items-center justify-between px-4 py-2 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg border border-slate-600/50 transition-all group/bio"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-gray-300">Historia del Personaje</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400 group-hover/bio:text-white transition-colors" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 group-hover/bio:text-white transition-colors" />
                      )}
                    </button>
                  </div>
                )}

                {/* Biografía expandida */}
                {isExpanded && lore && (
                  <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300">
                    <div className="p-4 bg-slate-900/80 backdrop-blur-sm rounded-xl border border-purple-900/30 space-y-3">
                      <div>
                        <h5 className="text-sm font-bold text-purple-300 mb-1">Biografía</h5>
                        <p className="text-sm text-gray-300 leading-relaxed">{lore.biography}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-red-300 mb-1">Dilema Moral</h5>
                        <p className="text-sm text-gray-300 leading-relaxed">{lore.moralDilemma}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-amber-300 mb-1">Conexión con Prometeo</h5>
                        <p className="text-sm text-gray-300 leading-relaxed">{lore.prometheusConnection}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Info adicional */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
        <div className="relative p-5 bg-slate-800/80 backdrop-blur-sm border-2 border-blue-900/50 rounded-xl">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-200 font-medium">
                <strong className="text-blue-100">💡 Nota:</strong> Estos personajes ya están optimizados para la campaña.
                En el siguiente paso podrás personalizar el nombre y ajustar las estadísticas base.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
