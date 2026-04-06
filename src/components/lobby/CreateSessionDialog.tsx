import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useSessionStore } from '@/stores/sessionStore'
import { Users, X, Loader2 } from 'lucide-react'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold">Crear Nueva Sala</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Número de jugadores */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Número máximo de jugadores
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMaxPlayers(num)}
                  className={`p-3 border rounded-lg font-semibold transition-all ${
                    maxPlayers === num
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Recomendado: 4-6 jugadores para mejor experiencia</span>
            </div>
          </div>

          {/* Info de campaña */}
          <div className="p-4 bg-muted/30 border border-border rounded-lg">
            <h3 className="font-semibold mb-2">Campaña: Sangrebruma</h3>
            <p className="text-sm text-muted-foreground">
              Valle gótico, 16 nodos narrativos, 3 finales. Duración estimada: 8-12 horas.
            </p>
          </div>

          {/* Errores */}
          {(error || localError) && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">
                {localError || error}
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Sala'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
