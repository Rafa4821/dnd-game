import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useSessionStore } from '@/stores/sessionStore'
import { useCharacterStore } from '@/stores/characterStore'
import { usePresence } from '@/hooks/usePresence'
import { CharacterWizard } from '@/components/character/CharacterWizard'
import { Moon, Users, Copy, Check, Loader2, LogOut, ArrowLeft } from 'lucide-react'

export default function SessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const { currentSession, loading, subscribeToSession, updatePlayerReady, startSession } = useSessionStore()
  const { createCharacter } = useCharacterStore()
  
  const [copied, setCopied] = useState(false)
  const [showCharacterWizard, setShowCharacterWizard] = useState(false)
  
  // Sistema de presencia
  const presenceMap = usePresence(
    user?.uid,
    sessionId,
    user?.displayName || undefined
  )

  // Suscribirse a la sesión
  useEffect(() => {
    if (!sessionId) {
      navigate('/lobby')
      return
    }

    const unsubscribe = subscribeToSession(sessionId)
    return () => unsubscribe()
  }, [sessionId, subscribeToSession, navigate])

  // Auto-redirigir cuando la campaña inicie
  useEffect(() => {
    if (currentSession?.status === 'playing') {
      console.log('🎮 Campaña iniciada, redirigiendo...')
      navigate(`/campaign/${sessionId}`)
    }
  }, [currentSession?.status, sessionId, navigate])

  // Copiar código al portapapeles
  const handleCopyCode = () => {
    if (currentSession?.code) {
      navigator.clipboard.writeText(currentSession.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Volver al lobby
  const handleBackToLobby = () => {
    navigate('/lobby')
  }

  // Cerrar sesión
  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  // Toggle ready
  const handleToggleReady = async () => {
    if (!user?.uid || !currentSession) return
    
    const currentPlayer = currentSession.players[user.uid]
    if (!currentPlayer) return
    
    await updatePlayerReady(user.uid, !currentPlayer.ready)
  }

  // Iniciar campaña (solo owner)
  const handleStartCampaign = async () => {
    if (!isOwner || !allReady) return
    
    try {
      await startSession()
      // La navegación se hará automáticamente cuando el estado cambie
    } catch (error) {
      console.error('Error starting campaign:', error)
      alert('Error al iniciar la campaña')
    }
  }

  // Crear personaje
  const handleCreateCharacter = async (characterData: { name: string; pregenId: string }) => {
    if (!user?.uid || !currentSession) return
    
    try {
      const character = await createCharacter(
        {
          name: characterData.name,
          pregenId: characterData.pregenId,
          customClass: null,
        },
        user.uid
      )
      
      // Actualizar la sesión con el personaje del jugador
      const { updateDoc } = await import('firebase/firestore')
      const { doc } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')
      
      await updateDoc(doc(db, 'sessions', currentSession.id), {
        [`players.${user.uid}.character`]: {
          id: character.id,
          name: character.name,
          class: character.class,
          level: character.level,
          hp: character.hp,
          maxHp: character.maxHp,
        },
        updatedAt: Date.now(),
      })
      
      setShowCharacterWizard(false)
      console.log('Character created and assigned:', character)
      
    } catch (error) {
      console.error('Error creating character:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gothic-theme">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!currentSession) {
    return (
      <div className="min-h-screen flex items-center justify-center gothic-theme">
        <div className="text-center space-y-4">
          <p className="text-xl text-muted-foreground">Sala no encontrada</p>
          <button
            onClick={() => navigate('/lobby')}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Volver al Lobby
          </button>
        </div>
      </div>
    )
  }

  const isOwner = user?.uid === currentSession?.ownerId
  const playerCount = Object.keys(currentSession?.players || {}).length
  const currentPlayer = user?.uid && currentSession ? currentSession.players[user.uid] : null
  const allReady = currentSession ? Object.values(currentSession.players).every(p => p.ready && p.character) : false

  return (
    <div className="min-h-screen gothic-theme">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToLobby}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
                title="Volver al lobby"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <Moon className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold">Sala de {currentSession.ownerName}</h1>
                  <p className="text-sm text-muted-foreground">
                    {playerCount}/{currentSession.maxPlayers} jugadores
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Código de sala */}
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-2 px-4 py-2 bg-accent border border-border rounded-lg hover:bg-accent/80 transition-colors"
              >
                <span className="font-mono text-lg font-bold">{currentSession.code}</span>
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de jugadores */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6" />
              Jugadores
            </h2>

            <div className="space-y-3">
              {Object.values(currentSession.players).map((player) => (
                <div
                  key={player.uid}
                  className="p-4 bg-card border border-border rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar placeholder */}
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-lg font-bold">
                        {player.displayName[0].toUpperCase()}
                      </span>
                    </div>

                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{player.displayName}</p>
                        {player.uid === currentSession.ownerId && (
                          <span className="px-2 py-0.5 text-xs bg-primary text-primary-foreground font-semibold rounded">
                            Anfitrión
                          </span>
                        )}
                      </div>
                      {player.character ? (
                        <p className="text-sm text-gray-300">
                          {player.character.name} - {player.character.class} Nv. {player.character.level}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">
                          Sin personaje
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="flex items-center gap-3">
                    {presenceMap[player.uid]?.online ? (
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="En línea" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-500" title="Desconectado" />
                    )}
                    
                    {player.ready ? (
                      <span className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded">
                        Listo
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-500 text-gray-900 text-sm font-semibold rounded">
                        Esperando
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel de acciones */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Acciones</h2>

            {/* Estado actual */}
            <div className="p-4 bg-card border border-border rounded-lg space-y-3">
              <h3 className="font-semibold text-foreground">Tu Estado</h3>
              
              {!currentPlayer?.character && (
                <button 
                  onClick={() => setShowCharacterWizard(true)}
                  className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90"
                >
                  Crear Personaje
                </button>
              )}

              {currentPlayer?.character && (
                <button
                  onClick={handleToggleReady}
                  className={`w-full py-3 font-medium rounded-lg transition-colors ${
                    currentPlayer.ready
                      ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {currentPlayer.ready ? 'Cancelar Listo' : 'Marcar como Listo'}
                </button>
              )}
            </div>

            {/* Iniciar partida (solo owner) */}
            {isOwner && (
              <div className="p-4 bg-card border border-border rounded-lg space-y-3">
                <h3 className="font-semibold text-foreground">Control de Partida</h3>
                
                <button
                  disabled={!allReady || loading}
                  onClick={handleStartCampaign}
                  className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Iniciando...' : allReady ? 'Iniciar Campaña' : 'Esperando jugadores...'}
                </button>

                {!allReady && (
                  <p className="text-xs text-gray-400">
                    Todos deben tener personaje y estar listos
                  </p>
                )}
              </div>
            )}

            {/* Info de campaña */}
            <div className="p-4 bg-card border border-border rounded-lg space-y-2">
              <h3 className="font-semibold text-foreground">Campaña: Sangrebruma</h3>
              <div className="text-sm text-gray-300 space-y-1">
                <p>📍 Nodo: {currentSession.campaign.currentNodeId}</p>
                <p>🌑 Oscuridad: {currentSession.campaign.variables.darkness}/6</p>
                <p>🩸 Deuda: {currentSession.campaign.variables.bloodDebt}/3</p>
                <p>📜 Acto: {currentSession.campaign.variables.act}/3</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Character Wizard Modal */}
      {showCharacterWizard && (
        <CharacterWizard
          onComplete={handleCreateCharacter}
          onCancel={() => setShowCharacterWizard(false)}
        />
      )}
    </div>
  )
}
