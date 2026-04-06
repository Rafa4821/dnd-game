import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useUserProfileStore } from '@/stores/userProfileStore'
import { useCharacterStore } from '@/stores/characterStore'
import { EditProfileDialog } from '@/components/profile/EditProfileDialog'
import { 
  User, 
  Mail, 
  Calendar, 
  Trophy, 
  Clock, 
  Swords,
  Users,
  Edit,
  ArrowLeft,
  Trash2,
  Loader2,
} from 'lucide-react'
import { calculateProfileStats } from '@/types/userProfile'

export default function ProfilePage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const { profile, loading, subscribeToProfile, deleteProfile } = useUserProfileStore()
  const { characters } = useCharacterStore()

  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

    // Suscribirse a cambios en tiempo real
    const unsubscribe = subscribeToProfile(user.uid)
    return () => unsubscribe()
  }, [user, subscribeToProfile, navigate])

  const handleDeleteAccount = async () => {
    if (!user) return

    setDeleting(true)
    try {
      await deleteProfile(user.uid)
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error deleting account:', error)
      setDeleting(false)
    }
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  const stats = calculateProfileStats(profile)
  const userCharacters = Object.values(characters).filter(c => c.ownerId === user?.uid)

  return (
    <div className="min-h-screen gothic-theme">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/lobby')}
            className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Lobby
          </button>

          <button
            onClick={() => setShowEditDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Editar Perfil
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Profile Header */}
          <div className="p-8 bg-card border border-border rounded-xl">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.displayName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/128'
                    }}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center border-4 border-primary">
                    <User className="w-16 h-16 text-primary" />
                  </div>
                )}
                {profile.publicProfile && (
                  <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    Público
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{profile.displayName}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        Miembro desde {new Date(profile.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {profile.bio && (
                  <p className="text-muted-foreground max-w-2xl">{profile.bio}</p>
                )}

                {profile.favoriteClass && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                    <Swords className="w-4 h-4" />
                    Clase favorita: {profile.favoriteClass}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-card border border-border rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Partidas Jugadas</p>
                  <p className="text-3xl font-bold">{stats.totalGames}</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Victorias</p>
                  <p className="text-3xl font-bold">{profile.gamesWon}</p>
                  {stats.totalGames > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {stats.winRate}% win rate
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Tiempo Jugado</p>
                  <p className="text-3xl font-bold">
                    {Math.floor(profile.totalPlayTime / 60)}h
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {profile.totalPlayTime % 60}m
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Personajes</p>
                  <p className="text-3xl font-bold">{userCharacters.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Characters */}
          {userCharacters.length > 0 && (
            <div className="p-6 bg-card border border-border rounded-xl">
              <h2 className="text-2xl font-bold mb-6">Mis Personajes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userCharacters.map((character) => (
                  <div
                    key={character.id}
                    className="p-4 bg-muted/50 border border-border rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold">{character.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {character.class} • Nivel {character.level}
                        </p>
                      </div>
                      <Swords className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">HP:</span>{' '}
                        <span className="font-mono">{character.hp}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">AC:</span>{' '}
                        <span className="font-mono">{character.ac}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preferences */}
          <div className="p-6 bg-card border border-border rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Preferencias</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="font-medium">Tema</span>
                <span className="text-muted-foreground capitalize">{profile.theme}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="font-medium">Notificaciones</span>
                <span className="text-muted-foreground">
                  {profile.notifications ? 'Activadas' : 'Desactivadas'}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="font-medium">Perfil Público</span>
                <span className="text-muted-foreground">
                  {profile.publicProfile ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-6 bg-destructive/10 border-2 border-destructive/20 rounded-xl">
            <h2 className="text-2xl font-bold text-destructive mb-4">Zona de Peligro</h2>
            <p className="text-muted-foreground mb-6">
              Eliminar tu cuenta es permanente y no se puede deshacer. Todos tus personajes y
              progreso se perderán.
            </p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-destructive text-destructive rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar Cuenta
              </button>
            ) : (
              <div className="space-y-4">
                <p className="font-semibold text-destructive">
                  ¿Estás seguro? Esta acción no se puede deshacer.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                    disabled={deleting}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Sí, Eliminar Mi Cuenta
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Dialog */}
      {user && (
        <EditProfileDialog
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          userId={user.uid}
        />
      )}
    </div>
  )
}
