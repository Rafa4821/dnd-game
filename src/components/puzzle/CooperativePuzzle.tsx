import { useEffect } from 'react'
import { usePuzzleStore } from '@/stores/puzzleStore'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react'
import { getPuzzleConfig } from '@/data/puzzles'

interface CooperativePuzzleProps {
  puzzleId: string
  sessionId: string
  onComplete: (success: boolean) => void
  children?: React.ReactNode
}

/**
 * Componente base para puzzles cooperativos
 * Maneja estado compartido, hints y validación
 */
export function CooperativePuzzle({
  puzzleId,
  sessionId,
  onComplete,
  children,
}: CooperativePuzzleProps) {
  const puzzleConfig = getPuzzleConfig(puzzleId)
  const user = useAuthStore(state => state.user)
  const {
    progress,
    loading,
    error,
    initializePuzzle,
    loadProgress,
    requestHint,
    validateSolution,
    reset,
  } = usePuzzleStore()

  useEffect(() => {
    if (!puzzleConfig) return
    
    const init = async () => {
      try {
        // Intentar cargar primero
        const unsubscribe = loadProgress(sessionId, puzzleConfig.id)
        
        // Si no existe, inicializar
        if (!progress) {
          await initializePuzzle(sessionId, puzzleConfig)
        }
        
        return unsubscribe
      } catch (error) {
        console.error('Error loading puzzle:', error)
      }
    }
    
    init()
    
    return () => {
      reset()
    }
  }, [sessionId, puzzleConfig, progress, initializePuzzle, loadProgress, reset])

  useEffect(() => {
    if (progress?.state === 'solved') {
      onComplete(true)
    } else if (progress?.state === 'failed') {
      onComplete(false)
    }
  }, [progress?.state, onComplete])
  
  if (!puzzleConfig) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error: No se encontró la configuración del puzzle "{puzzleId}"
        </AlertDescription>
      </Alert>
    )
  }

  const handleRequestHint = async () => {
    if (!user) return
    const hint = await requestHint(user.uid)
    if (hint) {
      alert(hint) // Mejor: usar toast o modal
    }
  }

  const handleValidate = async () => {
    const isCorrect = await validateSolution()
    if (!isCorrect) {
      alert('Solución incorrecta. Sigue intentando.')
    }
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3">Cargando puzzle...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!progress) {
    return null
  }

  const hintsRemaining = puzzleConfig.hintsAvailable - progress.hintsUsed

  return (
    <div className="space-y-4">
      {/* Header del puzzle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{puzzleConfig.name}</span>
            {progress.state === 'solved' && (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            )}
          </CardTitle>
          <CardDescription>{puzzleConfig.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Intentos: {progress.attemptCount}</span>
              <span>Pistas usadas: {progress.hintsUsed}/{puzzleConfig.hintsAvailable}</span>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRequestHint}
                disabled={hintsRemaining === 0 || progress.state !== 'in_progress'}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Pista ({hintsRemaining})
              </Button>
              
              <Button
                onClick={handleValidate}
                disabled={progress.state !== 'in_progress'}
              >
                Validar Solución
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenido específico del puzzle (children) */}
      <div className="min-h-[400px]">
        {children}
      </div>

      {/* Estado del puzzle */}
      {progress.state === 'solved' && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ¡Puzzle resuelto correctamente!
          </AlertDescription>
        </Alert>
      )}
      
      {progress.state === 'failed' && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Puzzle fallido. El camino continúa por otra ruta.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
