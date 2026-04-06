import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useSessionStore } from '@/stores/sessionStore'
import { X, Loader2, Hash } from 'lucide-react'

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
      await joinSession(
        {
          code: code.toUpperCase(),
          displayName: user.displayName,
        },
        user.uid
      )
      
      // Buscar la sesión por código para obtener el ID
      // (joinSession no retorna el ID, así que lo hacemos después)
      // Alternativa: modificar joinSession para que retorne sessionId
      
      // Por ahora, navegamos al lobby y dejamos que el usuario vea sus salas
      navigate('/lobby')
      onClose()
      
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Error al unirse')
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold">Unirse a Sala</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Código de sala */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Código de Sala
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-mono text-lg tracking-widest"
                maxLength={6}
                autoFocus
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Ingresa el código de 6 caracteres que te compartió el anfitrión
            </p>
          </div>

          {/* Nombre actual */}
          <div className="p-4 bg-muted/30 border border-border rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">
              Te unirás como:
            </p>
            <p className="font-semibold">{user?.displayName}</p>
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
              disabled={loading || code.length !== 6}
              className="flex-1 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uniéndose...
                </>
              ) : (
                'Unirse'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
