import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Moon, Loader2, Mail, Lock, User } from 'lucide-react'

export default function AuthPage() {
  const navigate = useNavigate()
  const { signUp, signIn, loading, error } = useAuthStore()
  
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    
    // Validaciones
    if (!email.trim()) {
      setLocalError('Por favor ingresa un email')
      return
    }
    
    if (!password.trim() || password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    
    if (isSignUp && (!displayName.trim() || displayName.length < 2)) {
      setLocalError('El nombre debe tener al menos 2 caracteres')
      return
    }

    try {
      if (isSignUp) {
        await signUp(email.trim(), password, displayName.trim())
      } else {
        await signIn(email.trim(), password)
      }
      
      navigate('/lobby')
    } catch (err) {
      // Error ya manejado en el store
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gothic-theme">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Moon className="w-16 h-16 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Sangrebruma</h1>
          <p className="text-muted-foreground">
            {isSignUp ? 'Crea tu cuenta para comenzar' : 'Inicia sesión para continuar'}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                disabled={loading}
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                disabled={loading}
                minLength={6}
              />
            </div>
          </div>

          {/* Nombre (solo al registrarse) */}
          {isSignUp && (
            <div className="space-y-2">
              <label htmlFor="displayName" className="block text-sm font-medium">
                Nombre de jugador
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ej: Thorin"
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  maxLength={20}
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {displayName.length}/20 caracteres
              </p>
            </div>
          )}

          {/* Errores */}
          {(error || localError) && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">
                {localError || error}
              </p>
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isSignUp ? 'Creando cuenta...' : 'Iniciando sesión...'}
              </>
            ) : (
              isSignUp ? 'Crear cuenta' : 'Iniciar sesión'
            )}
          </button>
        </form>

        {/* Toggle entre Login/Registro */}
        <div className="text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setLocalError('')
            }}
            className="text-sm text-primary hover:underline"
            disabled={loading}
          >
            {isSignUp 
              ? '¿Ya tienes cuenta? Inicia sesión' 
              : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>

        {/* Info */}
        <div className="p-4 bg-muted/50 border border-border rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            🔒 Tu progreso se guardará automáticamente. Usa el mismo email 
            para recuperar tus partidas guardadas.
          </p>
        </div>
      </div>
    </div>
  )
}
