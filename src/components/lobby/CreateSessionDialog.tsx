import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useSessionStore } from '@/stores/sessionStore'
import { Users, X, Loader2, Sparkles, Clock, Map } from 'lucide-react'

interface CreateSessionDialogProps {
  open: boolean
  onClose: () => void
}

export function CreateSessionDialog({ open, onClose }: CreateSessionDialogProps) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { createSession, loading, error } = useSessionStore()
  
  const [maxPlayers, setMaxPlayers] = useState(6)
  const [localError, setLocalError] = useState('')

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.displayName) {
      setLocalError('Debes tener un nombre de usuario')
      return
    }

    try {
      const sessionId = await createSession(
        {
          ownerName: user.displayName,
          maxPlayers,
          campaignId: 'sangrebruma',
        },
        user.uid
      )
      
      navigate(`/session/${sessionId}`)
      onClose()
      
    } catch (err) {
      setLocalError('Error al crear la sala')
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Contenedor con efecto 3D */}
      <div className="relative group w-full max-w-lg">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl blur opacity-40 group-hover:opacity-60 transition duration-500" />
        <div className="relative w-full bg-slate-900/95 backdrop-blur-sm border-2 border-red-900/50 rounded-3xl shadow-2xl shadow-red-900/30 overflow-hidden">
          {/* Header con gradiente */}
          <div className="relative p-8 border-b border-red-900/30 bg-gradient-to-r from-red-950/50 to-rose-950/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                  <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-red-500/20 to-rose-600/20 flex items-center justify-center border-2 border-red-500/30">
                    <Sparkles className="w-7 h-7 text-red-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Crear Nueva Sala</h2>
                  <p className="text-sm text-gray-400 mt-1">Configura tu partida de Sangrebruma</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-red-950/50 rounded-xl transition-all border border-red-900/30 hover:border-red-700/50"
              >
                <X className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* Contenido */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Número de jugadores con mejor diseño */}
            <div className="space-y-4">
              <label className="block text-lg font-bold text-white">
                👥 Número máximo de jugadores
              </label>
              <div className="grid grid-cols-5 gap-3">
                {[2, 3, 4, 5, 6].map((num) => {
                  const isSelected = maxPlayers === num
                  const isRecommended = num >= 4
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setMaxPlayers(num)}
                      className={`relative p-4 border-2 rounded-xl font-bold text-xl transition-all transform hover:scale-110 ${
                        isSelected
                          ? 'bg-gradient-to-br from-red-600 to-rose-700 text-white border-red-400 shadow-lg shadow-red-900/50'
                          : 'bg-slate-800/50 text-gray-300 border-slate-700/50 hover:border-red-500/50 hover:bg-slate-800/80'
                      }`}
                    >
                      {num}
                      {isRecommended && !isSelected && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-slate-900" />
                      )}
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center gap-2 p-3 bg-amber-950/30 border border-amber-600/30 rounded-xl">
                <Users className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span className="text-sm text-amber-200 font-medium">Recomendado: 4-6 jugadores para mejor experiencia</span>
              </div>
            </div>

            {/* Info de campaña con diseño mejorado */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500" />
              <div className="relative p-6 bg-slate-800/80 backdrop-blur-sm border-2 border-purple-900/50 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 blur-lg rounded-full" />
                    <Map className="w-6 h-6 text-purple-400 relative" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Campaña: Sangrebruma</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="text-sm text-gray-300">Valle gótico</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-400 rounded-full" />
                    <span className="text-sm text-gray-300">16 nodos narrativos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-rose-400 rounded-full" />
                    <span className="text-sm text-gray-300">3 finales distintos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-gray-300">8-12 horas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Errores con mejor visibilidad */}
            {(error || localError) && (
              <div className="p-4 bg-red-950/50 backdrop-blur-sm border-2 border-red-500/50 rounded-xl animate-in slide-in-from-top-2 duration-300">
                <p className="text-sm text-red-200 font-medium">
                  ⚠️ {localError || error}
                </p>
              </div>
            )}

            {/* Botones con diseño premium */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 border-2 border-slate-700/50 rounded-xl hover:border-slate-600 hover:bg-slate-800/50 transition-all text-gray-300 font-bold text-lg"
              >
                Cancelar
              </button>
              <div className="flex-1 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 rounded-xl blur opacity-75 group-hover:opacity-100 animate-pulse" />
                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-4 bg-gradient-to-r from-red-600 to-rose-700 text-white font-bold text-lg rounded-xl hover:from-red-500 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-900/50 border-2 border-red-400/50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Creando sala...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      Crear Sala
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
