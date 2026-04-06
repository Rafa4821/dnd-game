import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { CreateSessionDialog } from '@/components/lobby/CreateSessionDialog'
import { JoinSessionDialog } from '@/components/lobby/JoinSessionDialog'
import { Moon, LogOut, Plus, Users } from 'lucide-react'

export default function LobbyPage() {
  const { user, signOut } = useAuthStore()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showJoinDialog, setShowJoinDialog] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen gothic-theme">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Sangrebruma</h1>
              <p className="text-sm text-muted-foreground">
                Bienvenido, {user?.displayName || 'Cazador'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = '/profile'}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <Users className="w-4 h-4" />
              Mi Perfil
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Acciones principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Crear sala */}
            <button 
              onClick={() => setShowCreateDialog(true)}
              className="group relative p-8 border-2 border-border rounded-xl hover:border-primary transition-all bg-card overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    Crear Nueva Sala
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Inicia una nueva campaña y invita a tus amigos
                  </p>
                </div>
              </div>
            </button>

            {/* Unirse a sala */}
            <button 
              onClick={() => setShowJoinDialog(true)}
              className="group relative p-8 border-2 border-border rounded-xl hover:border-primary transition-all bg-card overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    Unirse a Sala
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ingresa el código de una partida existente
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Estado de desarrollo */}
          <div className="p-6 border border-border rounded-lg bg-muted/30">
            <h3 className="text-lg font-semibold mb-3">Estado del Desarrollo</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span>React + Vite + TypeScript configurado</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span>Firebase Auth anónimo funcionando</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span>Sistema de salas multiplayer</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">⏳</span>
                <span>Creación de personajes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">⏳</span>
                <span>Motor de dados y combate</span>
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
