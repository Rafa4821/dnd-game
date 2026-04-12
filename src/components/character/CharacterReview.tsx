import { getPregenById } from '@/data/pregens'
import { CHARACTER_LORE_DATA } from '@/data/characterLore'
import { Check, Sparkles, Shield, Heart, Swords, BookOpen, AlertTriangle } from 'lucide-react'

interface CharacterReviewProps {
  pregenId: string
  name: string
  customizations: Record<string, unknown>
}

export function CharacterReview({ pregenId, name, customizations }: CharacterReviewProps) {
  const pregen = getPregenById(pregenId)
  const lore = CHARACTER_LORE_DATA[pregenId]
  const abilities = (customizations.abilities as Record<string, number>) || pregen?.abilities

  if (!pregen) return null

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/30 blur-xl rounded-full" />
            <Check className="w-10 h-10 text-green-400 relative" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white">Personaje Listo</h3>
            <p className="text-base text-gray-300">
              Revisa los detalles finales antes de unirte a la aventura.
            </p>
          </div>
        </div>
      </div>

      {/* Card de personaje premium */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur opacity-30 group-hover:opacity-40 transition duration-500" />
        <div className="relative bg-slate-900/95 backdrop-blur-sm border-2 border-green-900/50 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header con gradiente */}
          <div className="relative p-8 bg-gradient-to-r from-green-950/50 to-emerald-950/30 border-b border-green-900/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-green-600/20 to-emerald-700/20 flex items-center justify-center border-2 border-green-500/40">
                  <Swords className="w-10 h-10 text-green-400" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-4xl font-bold text-white mb-2">{name || pregen.name}</h4>
                <p className="text-lg text-gray-300 capitalize font-medium">
                  {pregen.class} • Nivel {pregen.level}
                </p>
              </div>
            </div>
            
            {/* Biografía corta */}
            {lore && (
              <div className="mt-4 p-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-green-900/30">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300 leading-relaxed">{lore.biography}</p>
                </div>
              </div>
            )}
          </div>

          {/* Stats grid */}
          <div className="p-8 space-y-8">
            {/* Stats principales con cards premium */}
            <div>
              <h5 className="text-lg font-bold text-white mb-4">📊 Estadísticas de Combate</h5>
              <div className="grid grid-cols-3 gap-5">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
                  <div className="relative p-6 bg-slate-800/80 backdrop-blur-sm border-2 border-red-900/50 rounded-2xl text-center">
                    <Heart className="w-10 h-10 text-red-400 mx-auto mb-3" />
                    <div className="text-4xl font-bold text-white mb-2">{pregen.maxHp}</div>
                    <div className="text-sm text-gray-400 font-medium">Puntos de Golpe</div>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
                  <div className="relative p-6 bg-slate-800/80 backdrop-blur-sm border-2 border-blue-900/50 rounded-2xl text-center">
                    <Shield className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                    <div className="text-4xl font-bold text-white mb-2">{pregen.ac}</div>
                    <div className="text-sm text-gray-400 font-medium">Clase de Armadura</div>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
                  <div className="relative p-6 bg-slate-800/80 backdrop-blur-sm border-2 border-purple-900/50 rounded-2xl text-center">
                    <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                    <div className="text-4xl font-bold text-white mb-2">+{pregen.proficiencyBonus}</div>
                    <div className="text-sm text-gray-400 font-medium">Competencia</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Habilidades con colores */}
            <div>
              <h5 className="text-lg font-bold text-white mb-4">⚔️ Puntuaciones de Habilidad</h5>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {abilities && Object.entries(abilities).map(([ability, score]) => {
                  const abilityColors: Record<string, string> = {
                    str: 'red',
                    dex: 'green',
                    con: 'orange',
                    int: 'blue',
                    wis: 'purple',
                    cha: 'pink',
                  }
                  const color = abilityColors[ability] || 'gray'
                  const modifier = Math.floor((Number(score) - 10) / 2)
                  
                  return (
                    <div key={ability} className="relative group">
                      <div className={`absolute -inset-0.5 bg-${color}-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300`} />
                      <div className="relative p-4 bg-slate-800/80 backdrop-blur-sm border-2 border-slate-700/50 rounded-xl text-center">
                        <div className={`text-xs font-bold text-${color}-400 uppercase mb-2`}>{ability}</div>
                        <div className="text-2xl font-bold text-white mb-1">{score}</div>
                        <div className="text-xs text-gray-400 font-medium">
                          ({modifier >= 0 ? '+' : ''}{modifier})
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Rasgos premium */}
            <div>
              <h5 className="text-lg font-bold text-white mb-4">✨ Rasgos y Habilidades</h5>
              <div className="space-y-3">
                {pregen.traits.map((trait) => (
                  <div key={trait.id} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-300" />
                    <div className="relative p-4 bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50">
                      <div className="font-bold text-base text-purple-300 mb-2">{trait.name}</div>
                      <div className="text-sm text-gray-400 leading-relaxed">{trait.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Habilidades especiales premium */}
            {pregen.specialAbilities.length > 0 && (
              <div>
                <h5 className="text-lg font-bold text-white mb-4">🎯 Habilidades Especiales</h5>
                <div className="space-y-3">
                  {pregen.specialAbilities.map((ability) => (
                    <div key={ability.id} className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-300" />
                      <div className="relative p-4 bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold text-base text-amber-300">{ability.name}</div>
                          {ability.maxUses && (
                            <span className="text-xs px-3 py-1 bg-amber-600/20 text-amber-300 rounded-lg font-bold border border-amber-600/30">
                              {ability.uses}/{ability.maxUses} usos
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400 leading-relaxed">{ability.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Equipamiento premium */}
            <div>
              <h5 className="text-lg font-bold text-white mb-4">🎒 Equipamiento Inicial</h5>
              <div className="grid grid-cols-2 gap-3">
                {pregen.inventory.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-300" />
                    <div className="relative p-3 bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{item.name}</span>
                        {item.quantity > 1 && (
                          <span className="text-xs px-2 py-1 bg-green-600/20 text-green-300 rounded font-bold">x{item.quantity}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning premium */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
        <div className="relative p-6 bg-slate-800/80 backdrop-blur-sm border-2 border-yellow-900/50 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/20 blur-lg rounded-full" />
              <AlertTriangle className="w-8 h-8 text-yellow-400 relative" />
            </div>
            <div>
              <p className="text-base text-yellow-200 font-medium">
                <strong className="text-yellow-100">⚠️ Importante:</strong> Una vez creado, el personaje no podrá cambiarse.
                Asegúrate de que todo esté correcto antes de continuar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
