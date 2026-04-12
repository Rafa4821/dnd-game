import { useState } from 'react'
import { useSessionStore } from '@/stores/sessionStore'
import { Heart, Shield, Zap, ChevronDown, ChevronUp, Sword, Package, Sparkles } from 'lucide-react'

export function CharacterPanel() {
  const { currentSession, currentUser } = useSessionStore()
  const [expanded, setExpanded] = useState(true)
  const [showInventory, setShowInventory] = useState(false)
  const [showAbilities, setShowAbilities] = useState(false)

  const myPlayer = currentUser?.uid ? currentSession?.players[currentUser.uid] : null
  const character = myPlayer?.character

  if (!character) {
    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur opacity-20" />
        <div className="relative p-6 bg-slate-900/90 backdrop-blur-sm border-2 border-amber-900/50 rounded-2xl text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-amber-400" />
          <p className="text-amber-200 font-medium">No tienes personaje asignado</p>
        </div>
      </div>
    )
  }

  const hpPercentage = (character.hp / character.maxHp) * 100
  const hpColor = hpPercentage > 50 ? 'green' : hpPercentage > 25 ? 'yellow' : 'red'

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl blur opacity-30 group-hover:opacity-40 transition duration-300" />
      <div className="relative bg-slate-900/95 backdrop-blur-sm border-2 border-red-900/50 rounded-2xl overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full p-5 bg-gradient-to-r from-red-950/50 to-rose-950/30 border-b border-red-900/30 hover:from-red-950/70 hover:to-rose-950/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 blur-lg rounded-full" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/20 to-rose-700/20 flex items-center justify-center border-2 border-red-500/40">
                  <Sword className="w-6 h-6 text-red-400" />
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white">{character.name}</h3>
                <p className="text-sm text-gray-400 capitalize">{character.class} • Nv {character.level}</p>
              </div>
            </div>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {expanded && (
          <div className="p-5 space-y-4">
            {/* HP Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-red-300 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Puntos de Vida
                </span>
                <span className="text-lg font-bold text-white">
                  {character.hp} / {character.maxHp}
                </span>
              </div>
              <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700">
                <div
                  className={`h-full bg-gradient-to-r from-${hpColor}-600 to-${hpColor}-500 transition-all duration-500 relative`}
                  style={{ width: `${hpPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
              </div>
            </div>

            {/* Combat Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="relative group/stat">
                <div className="absolute -inset-0.5 bg-blue-600 rounded-xl blur opacity-0 group-hover/stat:opacity-20 transition" />
                <div className="relative p-3 bg-slate-800/80 backdrop-blur-sm border-2 border-slate-700/50 rounded-xl text-center">
                  <Shield className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-white">{character.ac || 10}</div>
                  <div className="text-xs text-gray-400">AC</div>
                </div>
              </div>
              
              <div className="relative group/stat">
                <div className="absolute -inset-0.5 bg-purple-600 rounded-xl blur opacity-0 group-hover/stat:opacity-20 transition" />
                <div className="relative p-3 bg-slate-800/80 backdrop-blur-sm border-2 border-slate-700/50 rounded-xl text-center">
                  <Sparkles className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-white">+{Math.floor((character.level - 1) / 4) + 2}</div>
                  <div className="text-xs text-gray-400">Prof</div>
                </div>
              </div>
              
              <div className="relative group/stat">
                <div className="absolute -inset-0.5 bg-amber-600 rounded-xl blur opacity-0 group-hover/stat:opacity-20 transition" />
                <div className="relative p-3 bg-slate-800/80 backdrop-blur-sm border-2 border-slate-700/50 rounded-xl text-center">
                  <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-white">30</div>
                  <div className="text-xs text-gray-400">Velocidad</div>
                </div>
              </div>
            </div>

            {/* Abilities Toggle */}
            <button
              onClick={() => setShowAbilities(!showAbilities)}
              className="w-full p-3 bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50 rounded-xl transition-all flex items-center justify-between"
            >
              <span className="text-sm font-bold text-purple-300">⚔️ Habilidades</span>
              {showAbilities ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {showAbilities && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                {character.specialAbilities?.slice(0, 3).map((ability) => (
                  <div key={ability.id} className="p-3 bg-slate-800/60 border border-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-amber-300">{ability.name}</span>
                      {ability.maxUses && (
                        <span className="text-xs px-2 py-1 bg-amber-600/20 text-amber-300 rounded font-bold">
                          {ability.uses}/{ability.maxUses}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{ability.description}</p>
                  </div>
                )) || (
                  <p className="text-xs text-gray-500 text-center py-2">Sin habilidades especiales</p>
                )}
              </div>
            )}

            {/* Inventory Toggle */}
            <button
              onClick={() => setShowInventory(!showInventory)}
              className="w-full p-3 bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50 rounded-xl transition-all flex items-center justify-between"
            >
              <span className="text-sm font-bold text-green-300 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Inventario
              </span>
              {showInventory ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {showInventory && (
              <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-300">
                {character.inventory?.slice(0, 6).map((item) => (
                  <div key={item.id} className="p-2 bg-slate-800/60 border border-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{item.name}</span>
                      {item.quantity > 1 && (
                        <span className="text-xs px-1.5 py-0.5 bg-green-600/20 text-green-300 rounded font-bold">
                          x{item.quantity}
                        </span>
                      )}
                    </div>
                  </div>
                )) || (
                  <p className="col-span-2 text-xs text-gray-500 text-center py-2">Inventario vacío</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
