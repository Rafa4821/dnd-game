import { useSessionStore } from '@/stores/sessionStore'
import { Users, Heart, Shield, Skull, Crown } from 'lucide-react'

export function PartyStatus() {
  const { currentSession } = useSessionStore()
  
  const players = currentSession ? Object.values(currentSession.players) : []
  const playersWithCharacters = players.filter(p => p.character)
  
  if (playersWithCharacters.length === 0) {
    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20" />
        <div className="relative p-6 bg-slate-900/90 backdrop-blur-sm border-2 border-blue-900/50 rounded-2xl text-center">
          <Users className="w-12 h-12 mx-auto mb-3 text-blue-400" />
          <p className="text-blue-200 font-medium">Esperando jugadores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-40 transition duration-300" />
      <div className="relative bg-slate-900/95 backdrop-blur-sm border-2 border-blue-900/50 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-3 sm:p-4 md:p-5 bg-gradient-to-r from-blue-950/50 to-cyan-950/30 border-b border-blue-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full" />
                <Users className="relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Grupo</h3>
            </div>
            <div className="px-2 sm:px-3 py-1 bg-blue-600/20 border border-blue-600/30 rounded-lg">
              <span className="text-xs sm:text-sm font-bold text-blue-300">{playersWithCharacters.length} <span className="hidden sm:inline">jugadores</span></span>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3">
          {playersWithCharacters.map((player) => {
            const character = player.character!
            const hpPercentage = (character.hp / character.maxHp) * 100
            const isOwner = player.uid === currentSession?.ownerId
            const isDead = character.hp <= 0
            
            let statusColor = 'green'
            if (isDead) statusColor = 'red'
            else if (hpPercentage <= 25) statusColor = 'red'
            else if (hpPercentage <= 50) statusColor = 'yellow'

            return (
              <div
                key={player.uid}
                className={`relative group/player transition-all ${
                  isDead ? 'opacity-60' : ''
                }`}
              >
                <div className={`absolute -inset-0.5 bg-${statusColor}-600 rounded-xl blur opacity-10 group-hover/player:opacity-20 transition`} />
                <div className={`relative p-2 sm:p-3 bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl ${
                  isDead 
                    ? 'border-red-900/50' 
                    : `border-slate-700/50 hover:border-${statusColor}-500/30`
                } transition-all`}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Character Icon */}
                    <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${
                      isDead
                        ? 'from-red-900/30 to-gray-900/30'
                        : 'from-blue-600/20 to-cyan-600/20'
                    } flex items-center justify-center border-2 ${
                      isDead ? 'border-red-600/30' : 'border-blue-500/30'
                    }`}>
                      {isDead ? (
                        <Skull className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                      ) : (
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                        <span className="text-sm sm:text-base font-bold text-white truncate">{character.name}</span>
                        {isOwner && (
                          <Crown className="w-3 h-3 text-amber-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-400">
                        <span className="capitalize truncate">{character.class}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">Nv {character.level}</span>
                      </div>
                    </div>

                    {/* HP */}
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 mb-0.5 sm:mb-1">
                        <Heart className={`w-3 h-3 text-${statusColor}-400`} />
                        <span className={`text-xs sm:text-sm font-bold text-${statusColor}-300`}>
                          {character.hp}/{character.maxHp}
                        </span>
                      </div>
                      <div className="w-16 sm:w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-${statusColor}-500 transition-all duration-300`}
                          style={{ width: `${Math.max(0, hpPercentage)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {isDead && (
                    <div className="mt-2 pt-2 border-t border-red-900/30">
                      <p className="text-xs text-red-400 font-medium text-center">💀 Inconsciente</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Group Stats Summary */}
        <div className="p-3 sm:p-4 bg-slate-800/50 border-t border-blue-900/30">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-sm">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-400">
                {playersWithCharacters.filter(p => p.character!.hp > 0).length}
              </div>
              <div className="text-xs text-gray-400">Activos</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-400">
                {Math.round(
                  playersWithCharacters.reduce((sum, p) => sum + (p.character!.hp / p.character!.maxHp), 0) / 
                  playersWithCharacters.length * 100
                )}%
              </div>
              <div className="text-xs text-gray-400">Salud Promedio</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
