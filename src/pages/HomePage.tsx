import { Link } from 'react-router-dom'
import { Moon, Sword, Users, ArrowRight, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gothic-theme relative overflow-hidden">
      {/* Fondo animado con efecto de niebla */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-red-950/30 opacity-50" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 50%)' }} />
      
      <div className="max-w-6xl w-full space-y-12 text-center relative z-10">
        {/* Logo/Título con efecto 3D */}
        <div className="space-y-6 perspective-1000">
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-red-600 blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <Moon className="w-24 h-24 text-red-500 animate-pulse relative drop-shadow-2xl" style={{ filter: 'drop-shadow(0 0 30px rgba(239, 68, 68, 0.8))' }} />
            </div>
          </div>
          <div className="transform hover:scale-105 transition-transform duration-300">
            <h1 className="text-7xl md:text-8xl font-bold tracking-tight bg-gradient-to-b from-red-200 via-red-300 to-red-600 bg-clip-text text-transparent drop-shadow-2xl" style={{ textShadow: '0 0 40px rgba(239, 68, 68, 0.5)' }}>
              Sangrebruma
            </h1>
          </div>
          <p className="text-2xl font-medium text-gray-200 drop-shadow-lg max-w-2xl mx-auto">
            Una campaña gótica de D&D sin DM para 2-6 jugadores
          </p>
        </div>

        {/* Características con efecto 3D */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500" />
            <div className="relative p-8 bg-slate-900/90 backdrop-blur-sm border-2 border-red-900/50 rounded-2xl transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-900/50 transition-all duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                <Sword className="w-14 h-14 text-red-400 mx-auto mb-6 relative drop-shadow-lg" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Combate Táctico</h3>
              <p className="text-base text-gray-300 leading-relaxed">
                Sistema por turnos con grid, estados y IA de monstruos sin LLM
              </p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500" />
            <div className="relative p-8 bg-slate-900/90 backdrop-blur-sm border-2 border-purple-900/50 rounded-2xl transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/50 transition-all duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                <Users className="w-14 h-14 text-purple-400 mx-auto mb-6 relative drop-shadow-lg" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Multiplayer Realtime</h3>
              <p className="text-base text-gray-300 leading-relaxed">
                Sincronización instantánea con Firebase para 2-6 jugadores
              </p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500" />
            <div className="relative p-8 bg-slate-900/90 backdrop-blur-sm border-2 border-amber-900/50 rounded-2xl transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-900/50 transition-all duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
                <Moon className="w-14 h-14 text-amber-400 mx-auto mb-6 relative drop-shadow-lg" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Historia Ramificada</h3>
              <p className="text-base text-gray-300 leading-relaxed">
                16 nodos con decisiones que afectan el valle y 3 finales distintos
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button con efecto premium */}
        <div className="pt-8">
          <div className="relative inline-block group">
            <div className="absolute -inset-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 animate-pulse" />
            <Link
              to="/auth"
              className="relative inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-red-600 to-rose-700 text-white font-bold text-lg rounded-xl hover:from-red-500 hover:to-rose-600 transition-all transform hover:scale-110 hover:shadow-2xl shadow-red-900/50 border-2 border-red-400/50"
            >
              <Sparkles className="w-6 h-6 animate-pulse" />
              Comenzar Aventura
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
