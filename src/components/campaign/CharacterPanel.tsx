import { useState } from 'react'
import { useSessionStore } from '@/stores/sessionStore'
import { useAuthStore } from '@/stores/authStore'
import { Heart, Shield, Zap, ChevronDown, ChevronUp, Sword, Sparkles } from 'lucide-react'

export function CharacterPanel() {
  const { currentSession } = useSessionStore()
  const { user: currentUser } = useAuthStore()
  const [expanded, setExpanded] = useState(true)

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
          className="w-full p-3 sm:p-4 md:p-5 bg-gradient-to-r from-red-950/50 to-rose-950/30 border-b border-red-900/30 hover:from-red-950/70 hover:to-rose-950/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 blur-lg rounded-full" />
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-600/20 to-rose-700/20 flex items-center justify-center border-2 border-red-500/40">
                  <Sword className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-lg sm:text-xl font-bold text-white">{character.name}</h3>
                <p className="text-xs sm:text-sm text-gray-400 capitalize">{character.class} • Nv {character.level}</p>
              </div>
            </div>
            {expanded ? (
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            )}
          </div>
        </button>

        {expanded && (
          <div className="p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4">
            {/* HP Bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm font-bold text-red-300 flex items-center gap-1.5 sm:gap-2">
                  <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Puntos de Vida</span>
                  <span className="sm:hidden">HP</span>
                </span>
                <span className="text-base sm:text-lg font-bold text-white">
                  {character.hp} / {character.maxHp}
                </span>
              </div>
              <div className="relative h-3 sm:h-4 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700">
                <div
                  className={`h-full bg-gradient-to-r from-${hpColor}-600 to-${hpColor}-500 transition-all duration-500 relative`}
                  style={{ width: `${hpPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
              </div>
            </div>

            {/* Combat Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="relative group/stat">
                <div className="absolute -inset-0.5 bg-blue-600 rounded-xl blur opacity-0 group-hover/stat:opacity-20 transition" />
                <div className="relative p-2 sm:p-3 bg-slate-800/80 backdrop-blur-sm border-2 border-slate-700/50 rounded-xl text-center">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mx-auto mb-0.5 sm:mb-1" />
                  <div className="text-xl sm:text-2xl font-bold text-white">{character.ac || 10}</div>
                  <div className="text-xs text-gray-400">AC</div>
                </div>
              </div>
              
              <div className="relative group/stat">
                <div className="absolute -inset-0.5 bg-purple-600 rounded-xl blur opacity-0 group-hover/stat:opacity-20 transition" />
                <div className="relative p-2 sm:p-3 bg-slate-800/80 backdrop-blur-sm border-2 border-slate-700/50 rounded-xl text-center">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mx-auto mb-0.5 sm:mb-1" />
                  <div className="text-xl sm:text-2xl font-bold text-white">+{Math.floor((character.level - 1) / 4) + 2}</div>
                  <div className="text-xs text-gray-400">Prof</div>
                </div>
              </div>
              
              <div className="relative group/stat">
                <div className="absolute -inset-0.5 bg-amber-600 rounded-xl blur opacity-0 group-hover/stat:opacity-20 transition" />
                <div className="relative p-2 sm:p-3 bg-slate-800/80 backdrop-blur-sm border-2 border-slate-700/50 rounded-xl text-center">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mx-auto mb-0.5 sm:mb-1" />
                  <div className="text-xl sm:text-2xl font-bold text-white">30</div>
                  <div className="text-xs text-gray-400"><span className="hidden sm:inline">Velocidad</span><span className="sm:hidden">Vel</span></div>
                </div>
              </div>
            </div>

            {/* Info adicional */}
            <div className="p-2.5 sm:p-3 bg-slate-800/60 border border-slate-700/50 rounded-xl">
              <p className="text-xs text-gray-400 text-center leading-relaxed">
                💡 Información completa después de crear personaje
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
