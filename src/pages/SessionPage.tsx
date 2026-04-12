import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useSessionStore } from '@/stores/sessionStore'
import { useCharacterStore } from '@/stores/characterStore'
import { usePresence } from '@/hooks/usePresence'
import { CharacterWizard } from '@/components/character/CharacterWizard'
import { Moon, Users, Copy, Check, Loader2, LogOut, ArrowLeft, BookOpen, Skull, Sparkles, Shield, Swords, Heart, Zap } from 'lucide-react'

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
  const handleCreateCharacter = async (characterData: { name: string; pregenId: string | null; customizations?: Record<string, unknown> | null }) => {
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
    <div className="min-h-screen gothic-theme relative overflow-hidden">
      {/* Fondo animado */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-red-950/30 opacity-50" />
      <div className="fixed inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 50%)' }} />
      
      {/* Header */}
      <header className="relative z-10 border-b border-red-900/30 bg-slate-900/80 backdrop-blur-md shadow-lg shadow-red-900/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToLobby}
                className="p-2 hover:bg-red-950/50 rounded-xl transition-all border border-red-900/30 hover:border-red-700/50"
                title="Volver al lobby"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-sm border-2 border-red-500/30 rounded-xl hover:border-red-500/60 hover:bg-red-950/30 transition-all text-gray-200 font-medium"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4 text-red-400" />
              </button>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-red-600 blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <Moon className="w-10 h-10 text-red-500 animate-pulse relative" style={{ filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.8))' }} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-red-200 to-red-500 bg-clip-text text-transparent">Sala de {currentSession.ownerName}</h1>
                  <p className="text-sm text-gray-300 font-medium">
                    {playerCount}/{currentSession.maxPlayers} jugadores
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Código de sala premium */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl blur opacity-40 group-hover:opacity-60 transition duration-300" />
                <button
                  onClick={handleCopyCode}
                  className="relative flex items-center gap-3 px-5 py-3 bg-slate-800/90 backdrop-blur-sm border-2 border-amber-600/50 rounded-xl hover:border-amber-500 transition-all"
                >
                  <span className="font-mono text-xl font-bold text-amber-300">{currentSession.code}</span>
                  {copied ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-amber-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Sinopsis de la Campaña */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500" />
            <div className="relative bg-slate-900/90 backdrop-blur-sm border-2 border-purple-900/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                  <BookOpen className="w-8 h-8 text-purple-400 relative" />
                </div>
                <h2 className="text-3xl font-bold text-white">La Leyenda de Sangrebruma</h2>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 text-lg leading-relaxed mb-4">
                  En el corazón de las montañas olvidadas yace el <span className="text-red-400 font-bold">Valle de Sangrebruma</span>, un lugar donde la niebla escarlata nunca se disipa y las sombras cobran vida propia. Hace siglos, un pacto oscuro fue sellado aquí entre mortales desesperados y entidades que habitan más allá del velo.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed mb-4">
                  Ahora, la <span className="text-purple-400 font-bold">corrupción</span> se extiende desde el corazón del valle, y criaturas de pesadilla acechan en cada rincón. Los habitantes viven en un terror constante, atrapados entre la locura y la muerte.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Vuestro grupo ha sido llamado al valle. Tal vez buscáis redención, riquezas, o simplemente respuestas. Pero tened cuidado: cada decisión que toméis, cada vida que salvéis o sacrifiquéis, <span className="text-amber-400 font-bold">determinará el destino final del valle</span> y de vuestras almas.
                </p>
              </div>
            </div>
          </div>

          {/* Bestiario de Monstruos */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500" />
            <div className="relative bg-slate-900/90 backdrop-blur-sm border-2 border-red-900/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                  <Skull className="w-8 h-8 text-red-400 relative" />
                </div>
                <h2 className="text-3xl font-bold text-white">Bestiario de Sangrebruma</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Hombre Lobo */}
                <div className="relative group/card">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl blur opacity-20 group-hover/card:opacity-40 transition duration-300" />
                  <div className="relative p-6 bg-slate-800/80 backdrop-blur-sm border-2 border-amber-900/50 rounded-2xl hover:border-amber-700/70 transition-all">
                    <div className="text-6xl mb-4 text-center filter drop-shadow-lg">🐺</div>
                    <h3 className="text-xl font-bold text-amber-300 mb-2">Hombre Lobo</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p className="flex items-center gap-2"><Heart className="w-4 h-4 text-red-400" /> HP: 45-60</p>
                      <p className="flex items-center gap-2"><Swords className="w-4 h-4 text-orange-400" /> Daño: Alto</p>
                      <p className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" /> Velocidad: Muy Alta</p>
                    </div>
                    <p className="mt-3 text-xs text-gray-400 italic">
                      Bestias malditas que acechan en la niebla. Vulnerables a la plata.
                    </p>
                  </div>
                </div>

                {/* Vampiro */}
                <div className="relative group/card">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl blur opacity-20 group-hover/card:opacity-40 transition duration-300" />
                  <div className="relative p-6 bg-slate-800/80 backdrop-blur-sm border-2 border-red-900/50 rounded-2xl hover:border-red-700/70 transition-all">
                    <div className="text-6xl mb-4 text-center filter drop-shadow-lg">🧛</div>
                    <h3 className="text-xl font-bold text-red-300 mb-2">Vampiro</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p className="flex items-center gap-2"><Heart className="w-4 h-4 text-red-400" /> HP: 60-80</p>
                      <p className="flex items-center gap-2"><Swords className="w-4 h-4 text-orange-400" /> Daño: Medio</p>
                      <p className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" /> Regeneración</p>
                    </div>
                    <p className="mt-3 text-xs text-gray-400 italic">
                      Nobles corrompidos. Débiles al sol y al fuego sagrado.
                    </p>
                  </div>
                </div>

                {/* Espectro */}
                <div className="relative group/card">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl blur opacity-20 group-hover/card:opacity-40 transition duration-300" />
                  <div className="relative p-6 bg-slate-800/80 backdrop-blur-sm border-2 border-cyan-900/50 rounded-2xl hover:border-cyan-700/70 transition-all">
                    <div className="text-6xl mb-4 text-center filter drop-shadow-lg">👻</div>
                    <h3 className="text-xl font-bold text-cyan-300 mb-2">Espectro</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p className="flex items-center gap-2"><Heart className="w-4 h-4 text-red-400" /> HP: 30-40</p>
                      <p className="flex items-center gap-2"><Swords className="w-4 h-4 text-orange-400" /> Daño: Medio</p>
                      <p className="flex items-center gap-2"><Shield className="w-4 h-4 text-blue-400" /> Inmune a físico</p>
                    </div>
                    <p className="mt-3 text-xs text-gray-400 italic">
                      Almas en pena. Solo dañables con magia o armas benditas.
                    </p>
                  </div>
                </div>

                {/* Necrófago */}
                <div className="relative group/card">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl blur opacity-20 group-hover/card:opacity-40 transition duration-300" />
                  <div className="relative p-6 bg-slate-800/80 backdrop-blur-sm border-2 border-green-900/50 rounded-2xl hover:border-green-700/70 transition-all">
                    <div className="text-6xl mb-4 text-center filter drop-shadow-lg">🧟</div>
                    <h3 className="text-xl font-bold text-green-300 mb-2">Necrófago</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p className="flex items-center gap-2"><Heart className="w-4 h-4 text-red-400" /> HP: 25-35</p>
                      <p className="flex items-center gap-2"><Swords className="w-4 h-4 text-orange-400" /> Daño: Bajo</p>
                      <p className="flex items-center gap-2"><Users className="w-4 h-4 text-purple-400" /> Grupos grandes</p>
                    </div>
                    <p className="mt-3 text-xs text-gray-400 italic">
                      Muertos hambrientos. Lentos pero numerosos.
                    </p>
                  </div>
                </div>

                {/* Bruja */}
                <div className="relative group/card">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover/card:opacity-40 transition duration-300" />
                  <div className="relative p-6 bg-slate-800/80 backdrop-blur-sm border-2 border-purple-900/50 rounded-2xl hover:border-purple-700/70 transition-all">
                    <div className="text-6xl mb-4 text-center filter drop-shadow-lg">🧙‍♀️</div>
                    <h3 className="text-xl font-bold text-purple-300 mb-2">Bruja del Bosque</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p className="flex items-center gap-2"><Heart className="w-4 h-4 text-red-400" /> HP: 50-70</p>
                      <p className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-pink-400" /> Magia: Alta</p>
                      <p className="flex items-center gap-2"><Skull className="w-4 h-4 text-purple-400" /> Maldiciones</p>
                    </div>
                    <p className="mt-3 text-xs text-gray-400 italic">
                      Hechiceras corruptas. Controlan venenos y maldiciones.
                    </p>
                  </div>
                </div>

                {/* Señor Oscuro */}
                <div className="relative group/card">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-slate-600 to-gray-600 rounded-2xl blur opacity-30 group-hover/card:opacity-50 transition duration-300" />
                  <div className="relative p-6 bg-slate-800/90 backdrop-blur-sm border-2 border-slate-700/70 rounded-2xl hover:border-slate-600 transition-all ring-2 ring-red-500/30">
                    <div className="text-6xl mb-4 text-center filter drop-shadow-2xl">👑</div>
                    <h3 className="text-xl font-bold text-slate-200 mb-2 flex items-center gap-2">
                      Señor del Valle
                      <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-bold">BOSS</span>
                    </h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p className="flex items-center gap-2"><Heart className="w-4 h-4 text-red-400" /> HP: 100+</p>
                      <p className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-pink-400" /> Poderes únicos</p>
                      <p className="flex items-center gap-2"><Shield className="w-4 h-4 text-blue-400" /> Muy resistente</p>
                    </div>
                    <p className="mt-3 text-xs text-gray-400 italic">
                      El origen de la corrupción. Enfrentamiento final.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid principal con jugadores y acciones */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
