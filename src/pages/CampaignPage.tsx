import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSessionStore } from '@/stores/sessionStore'
import { useCampaignStore } from '@/stores/campaignStore'
import { NodeDisplay } from '@/components/campaign/NodeDisplay'
import { CampaignLog } from '@/components/campaign/CampaignLog'
import { AudioPlayer } from '@/components/audio/AudioPlayer'
import { CharacterPanel } from '@/components/campaign/CharacterPanel'
import { DiceRoller } from '@/components/campaign/DiceRoller'
import { PartyStatus } from '@/components/campaign/PartyStatus'
import { QuickNotes } from '@/components/campaign/QuickNotes'
import { Moon, BookOpen, ScrollText, ArrowLeft, Sparkles, Flame, Skull, Eye } from 'lucide-react'

export default function CampaignPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { currentSession, initializeVoting } = useSessionStore()
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

  // Inicializar votación cuando aparezca nodo de decisión
  useEffect(() => {
    if (!currentNode || currentNode.type !== 'decision') {
      console.log('⏭️ No es nodo de decisión o no hay nodo')
      return
    }
    
    console.log('🎯 Nodo de decisión detectado:', currentNode.id)
    
    // Solo inicializar si no hay votingState o es de otro nodo
    const votingState = currentSession?.campaign?.votingState
    console.log('📊 Estado de votación actual:', votingState)
    
    if (!votingState || votingState.nodeId !== currentNode.id) {
      console.log('🔄 Inicializando nueva votación...')
      initializeVoting(currentNode.id)
    } else {
      console.log('✅ Votación ya inicializada para este nodo')
    }
  }, [currentNode, currentSession?.campaign?.votingState, initializeVoting])

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
    
    if (nextNodeId) {
      await navigateToNode(nextNodeId)
    }
  }

  const handleCombatEnd = async () => {
    if (currentNode?.nextNodeId) {
      await navigateToNode(currentNode.nextNodeId)
    }
  }

  const handlePuzzleComplete = async (success: boolean) => {
    if (!currentNode) return
    
    // El puzzle ya maneja la navegación internamente vía puzzleStore
    // Aquí solo logeamos el resultado
    console.log(`Puzzle ${success ? 'completado' : 'fallido'}:`, currentNode.id)
  }

  const handleDialogueComplete = async (nextNodeId: string) => {
    if (nextNodeId) {
      await navigateToNode(nextNodeId)
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
          <p className="text-gray-300 font-medium">Cargando campaña...</p>
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-red-950/30 relative">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-red-900/30 bg-slate-900/80 backdrop-blur-md shadow-lg shadow-red-900/20">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/session/${sessionId}`)}
                className="p-2 hover:bg-red-950/50 rounded-xl border border-red-900/30 hover:border-red-600/50 transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                  <Moon className="relative w-10 h-10 text-red-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 via-rose-300 to-red-500 bg-clip-text text-transparent">Sangrebruma</h1>
                  <p className="text-sm text-gray-400 font-mono font-bold">
                    {currentSession?.code || 'Campaña'}
                  </p>
                </div>
              </div>
            </div>

            {/* Variables del juego */}
            <div className="flex items-center gap-4">
              <div className="relative group/var">
                <div className="absolute -inset-0.5 bg-purple-600 rounded-xl blur opacity-20 group-hover/var:opacity-30 transition" />
                <div className="relative flex items-center gap-2 px-4 py-2 bg-slate-800/80 border-2 border-purple-900/50 rounded-xl">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-bold text-white">{progress.variables.darkness}/6</span>
                </div>
              </div>
              <div className="relative group/var">
                <div className="absolute -inset-0.5 bg-red-600 rounded-xl blur opacity-20 group-hover/var:opacity-30 transition" />
                <div className="relative flex items-center gap-2 px-4 py-2 bg-slate-800/80 border-2 border-red-900/50 rounded-xl">
                  <Flame className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-bold text-white">{progress.variables.bloodDebt}/3</span>
                </div>
              </div>
              <div className="relative group/var">
                <div className="absolute -inset-0.5 bg-amber-600 rounded-xl blur opacity-20 group-hover/var:opacity-30 transition" />
                <div className="relative flex items-center gap-2 px-4 py-2 bg-slate-800/80 border-2 border-amber-900/50 rounded-xl">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-white">Acto {progress.variables.act}/3</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowLog(!showLog)}
                className="relative group/btn"
              >
                <div className="absolute -inset-0.5 bg-blue-600 rounded-xl blur opacity-0 group-hover/btn:opacity-50 transition" />
                <div className="relative flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-800 border-2 border-blue-900/50 hover:border-blue-600/50 rounded-xl transition-all">
                  <ScrollText className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-bold text-white">Log</span>
                </div>
              </button>

              <button
                onClick={handleResetCampaign}
                className="relative group/btn"
                title="Reiniciar campaña desde el inicio"
              >
                <div className="absolute -inset-0.5 bg-red-600 rounded-xl blur opacity-0 group-hover/btn:opacity-50 transition" />
                <div className="relative flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-red-950/50 border-2 border-red-900/50 hover:border-red-600/50 rounded-xl transition-all">
                  <Skull className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-bold text-red-300">Reiniciar</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Character Tools */}
          <div className="lg:col-span-3 space-y-6">
            <CharacterPanel />
            <DiceRoller />
          </div>

          {/* Center - Main Narrative */}
          <div className="lg:col-span-6">
            <NodeDisplay
              node={currentNode}
              onContinue={handleContinue}
              onDecision={handleDecision}
              onCheck={handleCheck}
              onCombatEnd={handleCombatEnd}
              onPuzzleComplete={handlePuzzleComplete}
              onDialogueComplete={handleDialogueComplete}
            />
          </div>

          {/* Right Sidebar - Party & Notes */}
          <div className="lg:col-span-3 space-y-6">
            <PartyStatus />
            <QuickNotes />
            {/* Progreso */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-30 group-hover:opacity-40 transition duration-300" />
              <div className="relative bg-slate-900/95 backdrop-blur-sm border-2 border-green-900/50 rounded-2xl overflow-hidden">
                <div className="p-5 bg-gradient-to-r from-green-950/50 to-emerald-950/30 border-b border-green-900/30">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/20 blur-lg rounded-full" />
                      <BookOpen className="relative w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Progreso</h3>
                  </div>
                </div>
                
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-center">
                      <div className="text-3xl font-bold text-green-400">{progress.visitedNodes.length}</div>
                      <div className="text-xs text-gray-400 mt-1">Nodos visitados</div>
                    </div>
                    <div className="p-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-center">
                      <div className="text-3xl font-bold text-amber-400">{progress.variables.act || 1}</div>
                      <div className="text-xs text-gray-400 mt-1">Acto actual</div>
                    </div>
                  </div>

                  {/* Flags activos */}
                  {Object.keys(progress.flags).length > 0 && (
                    <div className="pt-4 border-t border-green-900/30">
                      <p className="text-xs font-bold text-green-300 mb-2">Eventos Desbloqueados</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(progress.flags)
                          .filter(([_, value]) => value)
                          .map(([key]) => (
                            <span
                              key={key}
                              className="px-3 py-1 text-xs font-bold bg-green-600/20 text-green-300 border border-green-600/30 rounded-lg"
                            >
                              {key.replace('F_', '').replace(/_/g, ' ')}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Log (collapsible) */}
            {showLog && (
              <div className="relative group animate-in slide-in-from-right duration-300">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-40 transition duration-300" />
                <div className="relative bg-slate-900/95 backdrop-blur-sm border-2 border-blue-900/50 rounded-2xl overflow-hidden">
                  <div className="p-5 bg-gradient-to-r from-blue-950/50 to-cyan-950/30 border-b border-blue-900/30">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full" />
                        <ScrollText className="relative w-8 h-8 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Log de Eventos</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <CampaignLog />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Audio Player flotante */}
      {currentNode?.assetManifestId && (
        <AudioPlayer manifestId={currentNode.assetManifestId} />
      )}
    </div>
  )
}
