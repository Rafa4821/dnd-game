import { useState, useEffect } from 'react'
import type { DecisionOption } from '@/types/campaign'
import { meetsRequirements } from '@/types/campaign'
import { useCampaignStore } from '@/stores/campaignStore'
import { useSessionStore } from '@/stores/sessionStore'
import { useAuthStore } from '@/stores/authStore'
import { ChevronRight, Lock, Users, Timer } from 'lucide-react'
import { DiceAnimation } from '@/components/campaign/DiceAnimation'

interface DecisionNodeProps {
  options: DecisionOption[]
  onSelect?: (optionId: string) => void
}

const PLAYER_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-cyan-500',
]

export function DecisionNode({ options, onSelect }: DecisionNodeProps) {
  const user = useAuthStore((state) => state.user)
  const { currentSession, castVote } = useSessionStore()
  const progress = useCampaignStore((state) => state.progress)
  const [showTiebreaker, setShowTiebreaker] = useState(false)
  const [tiebreakerResult, setTiebreakerResult] = useState<string | null>(null)
  
  const votingState = currentSession?.campaign?.votingState
  const myVote = user?.uid ? votingState?.votes?.[user.uid] : null
  const allPlayers = Object.values(currentSession?.players || {})
  const totalPlayers = allPlayers.length
  const votesCount = Object.keys(votingState?.votes || {}).length
  const allVoted = votesCount === totalPlayers && totalPlayers > 0
  
  // Debug logging
  useEffect(() => {
    console.log('🎮 DecisionNode estado:', {
      votingState,
      myVote,
      totalPlayers,
      votesCount,
      allVoted,
      userId: user?.uid,
    })
  }, [votingState, myVote, totalPlayers, votesCount, allVoted, user?.uid])

  const handleSelect = async (option: DecisionOption) => {
    console.log('👆 Click en opción:', option.text)
    
    if (!meetsRequirements(option.requirements, progress?.flags || {})) {
      console.log('❌ No cumple requisitos')
      return
    }
    
    if (!user?.uid) {
      console.log('❌ No hay usuario')
      return
    }
    
    if (!currentSession) {
      console.log('❌ No hay sesión')
      return
    }
    
    if (myVote) {
      console.log('❌ Ya votaste')
      return
    }
    
    console.log('✅ Registrando voto...')
    // Registrar voto en Firebase
    await castVote(option.id, user.uid, user.displayName || 'Jugador')
  }
  
  // Auto-resolver cuando todos voten
  useEffect(() => {
    if (!allVoted || !votingState || votingState.resolvedOption) return
    
    // Contar votos por opción
    const voteCounts = new Map<string, number>()
    Object.values(votingState.votes).forEach(vote => {
      voteCounts.set(vote.optionId, (voteCounts.get(vote.optionId) || 0) + 1)
    })
    
    const entries = Array.from(voteCounts.entries())
    entries.sort((a, b) => b[1] - a[1])
    
    // Verificar empate
    if (entries.length >= 2 && entries[0][1] === entries[1][1]) {
      // Empate - mostrar animación de dado
      setShowTiebreaker(true)
      
      setTimeout(() => {
        const tiedOptions = entries.filter(e => e[1] === entries[0][1]).map(e => e[0])
        const winner = tiedOptions[Math.floor(Math.random() * tiedOptions.length)]
        setTiebreakerResult(winner)
        
        setTimeout(() => {
          if (onSelect) onSelect(winner)
        }, 2000)
      }, 3000)
    } else {
      // Hay ganador claro
      const winner = entries[0][0]
      setTimeout(() => {
        if (onSelect) onSelect(winner)
      }, 1500)
    }
  }, [allVoted, votingState, onSelect])
  
  // Calcular votos por opción
  const getVotesForOption = (optionId: string) => {
    if (!votingState) return []
    return Object.values(votingState.votes).filter(v => v.optionId === optionId)
  }
  
  // Obtener color de jugador
  const getPlayerColor = (playerId: string) => {
    const index = allPlayers.findIndex(p => p.uid === playerId)
    return PLAYER_COLORS[index % PLAYER_COLORS.length]
  }

  if (showTiebreaker) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-yellow-500">¡Empate!</h3>
          <p className="text-gray-300">El destino decidirá vuestro camino...</p>
          
          <DiceAnimation onComplete={() => {}} />
          
          {tiebreakerResult && (
            <div className="mt-6 p-4 bg-primary/20 border border-primary rounded-lg">
              <p className="text-lg font-semibold">El dado ha decidido:</p>
              <p className="text-xl text-primary mt-2">
                {options.find(o => o.id === tiebreakerResult)?.text}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {/* Header con contador */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <h3 className="text-lg sm:text-xl font-bold text-foreground">¿Qué hacéis?</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-card border border-border rounded-lg">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">
              {votesCount}/{totalPlayers} votos
            </span>
          </div>
          {myVote && (
            <div className="px-3 py-1 bg-green-500/20 text-green-500 text-sm font-semibold rounded-lg">
              ✓ Votaste
            </div>
          )}
        </div>
      </div>
      
      <div className="grid gap-3">
        {options.map((option) => {
          const isAvailable = meetsRequirements(option.requirements, progress?.flags || {})
          const optionVotes = getVotesForOption(option.id)
          const voteCount = optionVotes.length
          const votePercentage = totalPlayers > 0 ? (voteCount / totalPlayers) * 100 : 0
          const hasMyVote = myVote?.optionId === option.id
          
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              disabled={!isAvailable || myVote !== null}
              className={`relative p-3 sm:p-4 border-2 rounded-lg text-left transition-all overflow-hidden ${
                hasMyVote
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                  : isAvailable
                  ? 'border-border bg-card hover:border-primary hover:bg-primary/5'
                  : 'border-border/50 bg-card/50 opacity-50 cursor-not-allowed'
              }`}
            >
              {/* Barra de progreso de votos */}
              {voteCount > 0 && (
                <div 
                  className="absolute inset-0 bg-primary/10 transition-all duration-500"
                  style={{ width: `${votePercentage}%` }}
                />
              )}
              
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className={`font-bold text-base leading-relaxed ${
                    !isAvailable ? 'text-gray-500' : hasMyVote ? 'text-primary' : 'text-gray-100'
                  }`}>
                    {option.text}
                  </p>
                  {!isAvailable && option.requirements && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                      <Lock className="w-4 h-4" />
                      <span>Requiere condiciones especiales</span>
                    </div>
                  )}
                  
                  {/* Avatares de jugadores que votaron */}
                  {voteCount > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-gray-300 font-semibold">
                        {voteCount} {voteCount === 1 ? 'voto' : 'votos'}:
                      </span>
                      <div className="flex -space-x-2">
                        {optionVotes.map((vote) => {
                          const playerColor = getPlayerColor(vote.playerId)
                          return (
                            <div
                              key={vote.playerId}
                              className={`w-7 h-7 rounded-full ${playerColor} flex items-center justify-center text-white text-xs font-bold border-2 border-card`}
                              title={vote.playerName}
                            >
                              {vote.playerName[0].toUpperCase()}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
                
                {isAvailable && !myVote && (
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                )}
                
                {hasMyVote && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <ChevronRight className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Indicador de espera */}
      {!allVoted && votesCount > 0 && (
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-yellow-500 animate-pulse" />
              <p className="text-sm text-gray-300">
                Esperando a {totalPlayers - votesCount} {totalPlayers - votesCount === 1 ? 'jugador' : 'jugadores'}...
              </p>
            </div>
            <div className="flex -space-x-2">
              {allPlayers
                .filter(p => !votingState?.votes[p.uid])
                .map((player) => (
                  <div
                    key={player.uid}
                    className={`w-7 h-7 rounded-full ${PLAYER_COLORS[allPlayers.findIndex(pl => pl.uid === player.uid) % PLAYER_COLORS.length]} opacity-30 flex items-center justify-center text-white text-xs font-bold border-2 border-card`}
                    title={`Esperando a ${player.displayName}`}
                  >
                    {player.displayName[0].toUpperCase()}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Todos votaron - procesando */}
      {allVoted && !votingState?.resolvedOption && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm text-green-500 font-semibold text-center">
            ✓ Todos han votado - Procesando resultado...
          </p>
        </div>
      )}
    </div>
  )
}
