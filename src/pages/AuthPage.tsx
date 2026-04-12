import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Moon, Loader2, Mail, Lock, User, Sparkles, Shield } from 'lucide-react'

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
    <div className="min-h-screen flex items-center justify-center p-4 gothic-theme relative overflow-hidden">
      {/* Fondo animado con efecto de niebla */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-red-950/30 opacity-50" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 50%)' }} />
      
      <div className="w-full max-w-md space-y-6 sm:space-y-8 relative z-10 px-4 sm:px-0">
        {/* Logo con efecto 3D */}
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-red-600 blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <Moon className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 animate-pulse relative drop-shadow-2xl" style={{ filter: 'drop-shadow(0 0 30px rgba(239, 68, 68, 0.8))' }} />
            </div>
          </div>
          <div className="transform hover:scale-105 transition-transform duration-300">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-b from-red-200 via-red-300 to-red-600 bg-clip-text text-transparent drop-shadow-2xl" style={{ textShadow: '0 0 40px rgba(239, 68, 68, 0.5)' }}>
              Sangrebruma
            </h1>
            <p className="text-lg sm:text-xl font-medium text-gray-200 drop-shadow-lg">
              {isSignUp ? 'Crea tu cuenta' : 'Inicia sesión'}
            </p>
          </div>
        </div>

        {/* Formulario con glassmorphism */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 relative bg-slate-900/90 backdrop-blur-sm border-2 border-red-900/50 rounded-3xl p-8 shadow-2xl">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-white">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-slate-800/90 border-2 border-slate-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all text-sm sm:text-base"
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-bold text-white">
                Contraseña
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-slate-800/90 border-2 border-slate-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all text-sm sm:text-base"
                  disabled={loading}
                  minLength={6}
                />
              </div>
            </div>

            {/* Nombre (solo al registrarse) */}
            {isSignUp && (
              <div className="space-y-4 sm:space-y-5">
                <label htmlFor="displayName" className="block text-sm font-bold text-white">
                  Nombre de jugador
                </label>
                <div className="relative group">
                  <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ej: Thorin"
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-slate-800/90 border-2 border-slate-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition-all text-sm sm:text-base"
                    maxLength={20}
                    disabled={loading}
                  />
                </div>
                <p className="text-sm text-gray-300 font-medium">
                  {displayName.length}/20 caracteres
                </p>
              </div>
            )}

            {/* Errores con mejor visibilidad */}
            {(error || localError) && (
              <div className="p-4 bg-red-950/50 backdrop-blur-sm border-2 border-red-500/50 rounded-xl">
                <p className="text-sm text-red-200 font-medium">
                  ⚠️ {localError || error}
                </p>
              </div>
            )}

            {/* Botón con efecto premium */}
            <div className="relative group/btn">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl blur opacity-75 group-hover/btn:opacity-100 animate-pulse" />
              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-rose-700 text-white font-bold text-base sm:text-lg rounded-xl hover:from-red-500 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-900/50 border-2 border-red-400/50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    {isSignUp ? 'Creando cuenta...' : 'Iniciando sesión...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Toggle entre Login/Registro */}
        <div className="text-center pt-3 sm:pt-4">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-gray-300 hover:text-red-300 transition-colors font-medium text-sm sm:text-base"
          >
            {isSignUp 
              ? '¿Ya tienes cuenta? Inicia sesión' 
              : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>

        {/* Info con glassmorphism */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500" />
          <div className="relative p-6 sm:p-8 bg-slate-900/90 backdrop-blur-sm border-2 border-red-900/50 rounded-2xl shadow-2xl shadow-red-900/30">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-200 font-medium leading-relaxed">
                Tu progreso se guardará automáticamente. Usa el mismo email para recuperar tus partidas guardadas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
