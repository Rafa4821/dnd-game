import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useSessionStore } from '@/stores/sessionStore'
import { X, Loader2, Hash, Sparkles, User } from 'lucide-react'

interface JoinSessionDialogProps {
  open: boolean
  onClose: () => void
}

export function JoinSessionDialog({ open, onClose }: JoinSessionDialogProps) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { joinSession, loading, error } = useSessionStore()
  
  const [code, setCode] = useState('')
  const [localError, setLocalError] = useState('')

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.displayName) {
      setLocalError('Debes tener un nombre de usuario')
      return
    }

    if (code.length !== 6) {
      setLocalError('El código debe tener 6 caracteres')
      return
    }

    try {
      const sessionId = await joinSession(
        {
          code: code.toUpperCase(),
          displayName: user.displayName,
        },
        user.uid
      )
      
      // Navegar directamente a la sesión
      navigate(`/session/${sessionId}`)
      onClose()
      
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Error al unirse')
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Contenedor con efecto 3D */}
      <div className="relative group w-full max-w-lg">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-40 group-hover:opacity-60 transition duration-500" />
        <div className="relative w-full bg-slate-900/95 backdrop-blur-sm border-2 border-purple-900/50 rounded-3xl shadow-2xl shadow-purple-900/30 overflow-hidden">
          {/* Header con gradiente */}
          <div className="relative p-8 border-b border-purple-900/30 bg-gradient-to-r from-purple-950/50 to-pink-950/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                  <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center border-2 border-purple-500/30">
                    <Hash className="w-7 h-7 text-purple-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Unirse a Sala</h2>
                  <p className="text-sm text-gray-400 mt-1">Ingresa el código de invitación</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-purple-950/50 rounded-xl transition-all border border-purple-900/30 hover:border-purple-700/50"
              >
                <X className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* Contenido */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Código de sala con diseño premium */}
            <div className="space-y-4">
              <label className="block text-lg font-bold text-white">
                🔑 Código de Sala
              </label>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-300" />
                <div className="relative">
                  <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-400 z-10" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="ABC123"
                    className="relative w-full pl-16 pr-6 py-5 bg-slate-800/90 backdrop-blur-sm border-2 border-purple-700/50 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all text-white placeholder:text-gray-500 font-mono text-2xl tracking-[0.3em] text-center font-bold"
                    maxLength={6}
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-blue-950/30 border border-blue-600/30 rounded-xl">
                <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-200 font-medium">
                  Ingresa el código de 6 caracteres que te compartió el anfitrión de la partida
                </p>
              </div>
              {/* Indicador visual de caracteres */}
              <div className="flex justify-center gap-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i < code.length
                        ? 'bg-purple-500 shadow-lg shadow-purple-500/50'
                        : 'bg-slate-700/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Nombre actual con diseño mejorado */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500" />
              <div className="relative p-5 bg-slate-800/80 backdrop-blur-sm border-2 border-amber-900/50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-500/20 blur-lg rounded-full" />
                    <User className="w-6 h-6 text-amber-400 relative" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">
                      Te unirás como:
                    </p>
                    <p className="text-xl font-bold text-white">{user?.displayName}</p>
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
                <div className={`absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl blur transition duration-500 ${
                  code.length === 6 ? 'opacity-75 group-hover:opacity-100 animate-pulse' : 'opacity-0'
                }`} />
                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="relative w-full py-4 bg-gradient-to-r from-purple-600 to-pink-700 text-white font-bold text-lg rounded-xl hover:from-purple-500 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-purple-900/50 border-2 border-purple-400/50 disabled:border-slate-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Uniéndose a la sala...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      Unirse
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
