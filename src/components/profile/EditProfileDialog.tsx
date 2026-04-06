import { useState, useEffect } from 'react'
import { useUserProfileStore } from '@/stores/userProfileStore'
import { X, Save, Loader2, User, Mail, FileText, Image, Palette } from 'lucide-react'
import type { UpdateUserProfileInput } from '@/types/userProfile'

interface EditProfileDialogProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function EditProfileDialog({ isOpen, onClose, userId }: EditProfileDialogProps) {
  const { profile, updateProfile, loading } = useUserProfileStore()
  
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    avatar: '',
    favoriteClass: '',
    theme: 'dark',
    notifications: true,
    publicProfile: true,
  })

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName,
        bio: profile.bio || '',
        avatar: profile.avatar || '',
        favoriteClass: profile.favoriteClass || '',
        theme: profile.theme,
        notifications: profile.notifications,
        publicProfile: profile.publicProfile,
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const updates: UpdateUserProfileInput = {
        displayName: formData.displayName,
        bio: formData.bio || null,
        avatar: formData.avatar || null,
        favoriteClass: formData.favoriteClass as any || null,
        theme: formData.theme as any,
        notifications: formData.notifications,
        publicProfile: formData.publicProfile,
      }

      await updateProfile(userId, updates)
      onClose()
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card">
          <h2 className="text-2xl font-bold">Editar Perfil</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Display Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <User className="w-4 h-4" />
              Nombre de Usuario
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Tu nombre"
              minLength={2}
              maxLength={50}
              required
            />
          </div>

          {/* Email (readonly) */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg cursor-not-allowed opacity-60"
              disabled
            />
            <p className="text-xs text-muted-foreground">
              El email no puede ser modificado
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <FileText className="w-4 h-4" />
              Biografía
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Cuéntanos sobre ti..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.bio.length}/500 caracteres
            </p>
          </div>

          {/* Avatar URL */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Image className="w-4 h-4" />
              URL del Avatar
            </label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/avatar.jpg"
            />
            {formData.avatar && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <img
                  src={formData.avatar}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/64'
                  }}
                />
                <span className="text-sm text-muted-foreground">Vista previa</span>
              </div>
            )}
          </div>

          {/* Favorite Class */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Clase Favorita</label>
            <select
              value={formData.favoriteClass}
              onChange={(e) => setFormData({ ...formData, favoriteClass: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Sin preferencia</option>
              <option value="fighter">Fighter</option>
              <option value="rogue">Rogue</option>
              <option value="ranger">Ranger</option>
              <option value="cleric">Cleric</option>
              <option value="barbarian">Barbarian</option>
              <option value="wizard">Wizard</option>
            </select>
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Palette className="w-4 h-4" />
              Tema
            </label>
            <select
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="dark">Oscuro</option>
              <option value="light">Claro</option>
              <option value="system">Sistema</option>
            </select>
          </div>

          {/* Toggles */}
          <div className="space-y-4 p-4 bg-muted/50 border border-border rounded-lg">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium">Notificaciones</span>
              <input
                type="checkbox"
                checked={formData.notifications}
                onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                className="w-5 h-5 rounded border-border"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium">Perfil Público</span>
              <input
                type="checkbox"
                checked={formData.publicProfile}
                onChange={(e) => setFormData({ ...formData, publicProfile: e.target.checked })}
                className="w-5 h-5 rounded border-border"
              />
            </label>
            <p className="text-xs text-muted-foreground">
              Los perfiles públicos pueden ser vistos por otros jugadores
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              disabled={saving || loading}
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
