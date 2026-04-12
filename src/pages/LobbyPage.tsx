import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { CreateSessionDialog } from '@/components/lobby/CreateSessionDialog'
import { JoinSessionDialog } from '@/components/lobby/JoinSessionDialog'
import { Moon, LogOut, Plus, Users, BookOpen, Lightbulb, Sparkles, Scroll, Sword, Heart, Shield } from 'lucide-react'

export default function LobbyPage() {
  const { user, signOut } = useAuthStore()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showJoinDialog, setShowJoinDialog] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen gothic-theme relative overflow-hidden">
      {/* Fondo animado */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-red-950/30 opacity-50" />
      <div className="fixed inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 50%)' }} />
      
      {/* Header */}
      <header className="relative z-10 border-b border-red-900/30 bg-slate-900/80 backdrop-blur-md shadow-lg shadow-red-900/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-red-600 blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <Moon className="w-10 h-10 text-red-500 animate-pulse relative" style={{ filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.8))' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-200 to-red-500 bg-clip-text text-transparent">Sangrebruma</h1>
              <p className="text-sm text-gray-300 font-medium">
                Bienvenido, {user?.displayName || 'Cazador'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = '/profile'}
              className="flex items-center gap-2 px-4 py-2 text-sm border-2 border-purple-500/30 rounded-xl hover:border-purple-500/60 hover:bg-purple-950/30 transition-all text-gray-200 font-medium"
            >
              <Users className="w-4 h-4 text-purple-400" />
              Mi Perfil
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm border-2 border-red-500/30 rounded-xl hover:border-red-500/60 hover:bg-red-950/30 transition-all text-gray-200 font-medium"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Acciones principales con efectos 3D */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Crear sala */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500" />
              <button 
                onClick={() => setShowCreateDialog(true)}
                className="relative w-full p-10 bg-slate-900/90 backdrop-blur-sm border-2 border-red-900/50 rounded-2xl transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-900/50 transition-all duration-300"
              >
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-rose-600/20 flex items-center justify-center mx-auto border-2 border-red-500/30">
                      <Plus className="w-10 h-10 text-red-400" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-3 text-white">
                      Crear Nueva Sala
                    </h3>
                    <p className="text-base text-gray-300 leading-relaxed">
                      Inicia una nueva campaña y invita a tus amigos
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Unirse a sala */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500" />
              <button 
                onClick={() => setShowJoinDialog(true)}
                className="relative w-full p-10 bg-slate-900/90 backdrop-blur-sm border-2 border-purple-900/50 rounded-2xl transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/50 transition-all duration-300"
              >
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center mx-auto border-2 border-purple-500/30">
                      <Users className="w-10 h-10 text-purple-400" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-3 text-white">
                      Unirse a Sala
                    </h3>
                    <p className="text-base text-gray-300 leading-relaxed">
                      Ingresa el código de una partida existente
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Guía Rápida para Nuevos Jugadores */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500" />
            <div className="relative bg-slate-900/90 backdrop-blur-sm border-2 border-amber-900/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
                  <Lightbulb className="w-8 h-8 text-amber-400 relative" />
                </div>
                <h2 className="text-3xl font-bold text-white">Guía Rápida</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50">
                  <div className="flex items-start gap-3 mb-3">
                    <Sword className="w-6 h-6 text-red-400 flex-shrink-0" />
                    <h3 className="text-lg font-bold text-white">Combate</h3>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Turnos por iniciativa. Usa tus habilidades estratégicamente y posiciona a tu personaje en el grid.
                  </p>
                </div>
                
                <div className="p-5 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50">
                  <div className="flex items-start gap-3 mb-3">
                    <BookOpen className="w-6 h-6 text-purple-400 flex-shrink-0" />
                    <h3 className="text-lg font-bold text-white">Decisiones</h3>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Tus elecciones importan. La campaña se ramifica en 3 finales diferentes según tus acciones.
                  </p>
                </div>
                
                <div className="p-5 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50">
                  <div className="flex items-start gap-3 mb-3">
                    <Users className="w-6 h-6 text-amber-400 flex-shrink-0" />
                    <h3 className="text-lg font-bold text-white">Cooperación</h3>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Trabaja en equipo. Algunos puzzles y desafíos requieren coordinación entre jugadores.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Glosario de Términos */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500" />
            <div className="relative bg-slate-900/90 backdrop-blur-sm border-2 border-blue-900/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                  <Scroll className="w-8 h-8 text-blue-400 relative" />
                </div>
                <h2 className="text-3xl font-bold text-white">Glosario</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                  <h4 className="text-base font-bold text-blue-300 mb-2">HP (Puntos de Vida)</h4>
                  <p className="text-sm text-gray-300">Tu salud. Cuando llega a 0, tu personaje cae inconsciente.</p>
                </div>
                
                <div className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                  <h4 className="text-base font-bold text-purple-300 mb-2">Iniciativa</h4>
                  <p className="text-sm text-gray-300">Determina el orden de los turnos en combate.</p>
                </div>
                
                <div className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                  <h4 className="text-base font-bold text-red-300 mb-2">Corrupción</h4>
                  <p className="text-sm text-gray-300">Recurso narrativo que afecta el final de la campaña.</p>
                </div>
                
                <div className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                  <h4 className="text-base font-bold text-amber-300 mb-2">Tags</h4>
                  <p className="text-sm text-gray-300">Habilidades especiales de tu personaje que desbloquean opciones únicas.</p>
                </div>
                
                <div className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                  <h4 className="text-base font-bold text-green-300 mb-2">Grid de Combate</h4>
                  <p className="text-sm text-gray-300">Tablero táctico donde se desarrollan las batallas.</p>
                </div>
                
                <div className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                  <h4 className="text-base font-bold text-pink-300 mb-2">Checks/Tiradas</h4>
                  <p className="text-sm text-gray-300">Pruebas de habilidad que determinan si una acción tiene éxito.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips de Campaña */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500" />
            <div className="relative bg-slate-900/90 backdrop-blur-sm border-2 border-green-900/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                  <Sparkles className="w-8 h-8 text-green-400 relative" />
                </div>
                <h2 className="text-3xl font-bold text-white">Consejos para Sangrebruma</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                  <Shield className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Gestiona tus recursos</h4>
                    <p className="text-sm text-gray-300">No uses todas tus habilidades en el primer combate. El valle es largo y peligroso.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                  <Heart className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Descansa estratégicamente</h4>
                    <p className="text-sm text-gray-300">Los descansos recuperan HP y habilidades, pero también avanzan el tiempo de la campaña.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                  <BookOpen className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Lee las pistas</h4>
                    <p className="text-sm text-gray-300">Los NPCs y el ambiente dan información valiosa. Presta atención a los detalles.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                  <Users className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Diversifica tu grupo</h4>
                    <p className="text-sm text-gray-300">Equipos balanceados (tanque, daño, soporte) tienen más opciones en diálogos y combates.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Debug info (solo dev) */}
          {import.meta.env.DEV && (
            <div className="p-4 bg-card border border-border rounded-lg text-xs font-mono">
              <p className="text-muted-foreground mb-2">Debug Info:</p>
              <p>User ID: {user?.uid}</p>
              <p>Display Name: {user?.displayName}</p>
              <p>Anonymous: {user?.isAnonymous ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>
      </main>

      {/* Diálogos */}
      <CreateSessionDialog 
        open={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)} 
      />
      <JoinSessionDialog 
        open={showJoinDialog} 
        onClose={() => setShowJoinDialog(false)} 
      />
    </div>
  )
}
