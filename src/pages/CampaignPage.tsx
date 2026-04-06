import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSessionStore } from '@/stores/sessionStore'
import { useCampaignStore } from '@/stores/campaignStore'
import { NodeDisplay } from '@/components/campaign/NodeDisplay'
import { CampaignLog } from '@/components/campaign/CampaignLog'
import { Moon, BookOpen, ScrollText, ArrowLeft } from 'lucide-react'

export default function CampaignPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { currentSession } = useSessionStore()
  const { 
    currentNode, 
    progress, 
    loading, 
    loadProgress, 
    navigateToNode, 
    makeDecision,
    resetCampaign,
  } = useCampaignStore()
  
  const [showLog, setShowLog] = useState(false)

  // Cargar progreso de campaña
  useEffect(() => {
    if (!sessionId) {
      navigate('/lobby')
      return
    }

    loadProgress(sessionId)
  }, [sessionId, loadProgress, navigate])

  const handleContinue = () => {
    if (currentNode?.nextNodeId) {
      navigateToNode(currentNode.nextNodeId)
    }
  }

  const handleDecision = async (optionId: string) => {
    await makeDecision(optionId)
  }

  const handleCheck = async (success: boolean) => {
    if (!currentNode?.check) return
    
    const nextNodeId = success 
      ? currentNode.check.successNodeId 
      : currentNode.check.failureNodeId
    
    await navigateToNode(nextNodeId)
  }

  const handleCombatEnd = async () => {
    if (currentNode?.nextNodeId) {
      await navigateToNode(currentNode.nextNodeId)
    }
  }

  const handleResetCampaign = async () => {
    if (!sessionId) return
    
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres reiniciar la campaña? Se perderá todo el progreso.'
    )
    
    if (confirmed) {
      await resetCampaign(sessionId)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gothic-theme">
        <div className="text-center">
          <Moon className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando campaña...</p>
        </div>
      </div>
    )
  }

  if (!currentNode || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center gothic-theme">
        <div className="text-center space-y-4">
          <p className="text-xl">No se pudo cargar la campaña</p>
          <button
            onClick={() => navigate(`/session/${sessionId}`)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Volver a la sesión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gothic-theme">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/session/${sessionId}`)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <Moon className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold">Sangrebruma</h1>
                  <p className="text-sm text-muted-foreground">
                    {currentSession?.code || 'Campaña'}
                  </p>
                </div>
              </div>
            </div>

            {/* Variables del juego */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">🌑 Oscuridad:</span>
                <span className="font-bold">{progress.variables.darkness || 0}/6</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">🩸 Deuda:</span>
                <span className="font-bold">{progress.variables.bloodDebt || 0}/3</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">📜 Acto:</span>
                <span className="font-bold">{progress.variables.act || 1}/3</span>
              </div>
              
              <button
                onClick={() => setShowLog(!showLog)}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <ScrollText className="w-4 h-4" />
                Log
              </button>

              <button
                onClick={handleResetCampaign}
                className="flex items-center gap-2 px-3 py-2 border border-destructive/50 text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                title="Reiniciar campaña desde el inicio"
              >
                <Moon className="w-4 h-4" />
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Nodo principal */}
          <div className="lg:col-span-2">
            <NodeDisplay
              node={currentNode}
              onContinue={handleContinue}
              onDecision={handleDecision}
              onCheck={handleCheck}
              onCombatEnd={handleCombatEnd}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progreso */}
            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Progreso</h3>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nodos visitados:</span>
                  <span className="font-medium">{progress.visitedNodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Acto actual:</span>
                  <span className="font-medium">{progress.variables.act || 1}/3</span>
                </div>
              </div>

              {/* Flags activos */}
              {Object.keys(progress.flags).length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Flags activos:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(progress.flags)
                      .filter(([_, value]) => value)
                      .map(([key]) => (
                        <span
                          key={key}
                          className="px-2 py-1 text-xs bg-primary/10 text-primary rounded"
                        >
                          {key.replace('f_', '').replace(/_/g, ' ')}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Log (collapsible) */}
            {showLog && (
              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <ScrollText className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Log de Eventos</h3>
                </div>
                <CampaignLog />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
