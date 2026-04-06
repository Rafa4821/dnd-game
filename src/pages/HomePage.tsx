import { Link } from 'react-router-dom'
import { Moon, Sword, Users, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gothic-theme">
      <div className="max-w-4xl w-full space-y-8 text-center">
        {/* Logo/Título */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <Moon className="w-20 h-20 text-primary animate-pulse" />
          </div>
          <h1 className="text-6xl font-bold tracking-tight text-foreground">
            Sangrebruma
          </h1>
          <p className="text-xl text-muted-foreground">
            Una campaña gótica de D&D sin DM para 2-6 jugadores
          </p>
        </div>

        {/* Características */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="p-6 border border-border rounded-lg bg-card">
            <Sword className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Combate Táctico</h3>
            <p className="text-sm text-muted-foreground">
              Sistema por turnos con grid, estados y IA de monstruos sin LLM
            </p>
          </div>
          
          <div className="p-6 border border-border rounded-lg bg-card">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Multiplayer Realtime</h3>
            <p className="text-sm text-muted-foreground">
              Sincronización instantánea con Firebase para 2-6 jugadores
            </p>
          </div>
          
          <div className="p-6 border border-border rounded-lg bg-card">
            <Moon className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Historia Ramificada</h3>
            <p className="text-sm text-muted-foreground">
              16 nodos con decisiones que afectan el valle y 3 finales distintos
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105"
          >
            Comenzar Aventura
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Estado del proyecto */}
        <div className="pt-8 space-y-4">
          <div className="inline-block px-4 py-2 bg-secondary rounded-full">
            <p className="text-sm font-medium">
              🚧 Proyecto en construcción - Paquete 0: Setup completado
            </p>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-1">
            <p>✅ React + Vite + TypeScript</p>
            <p>✅ TailwindCSS + shadcn/ui</p>
            <p>✅ Firebase configurado</p>
            <p>✅ Sistema de autenticación anónima</p>
            <p>⏳ Modelo de datos y salas multiplayer</p>
          </div>
        </div>
      </div>
    </div>
  )
}
