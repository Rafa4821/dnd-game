import { useEffect, useState } from 'react'
import { useDialogueStore } from '@/stores/dialogueStore'
import { useSessionStore } from '@/stores/sessionStore'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import type { DialogueConfig, DialogueOption } from '@/types/dialogue'
import type { CharacterTag } from '@/types/tags'
import { isOptionAvailable, canPlayerSpeak } from '@/types/dialogue'
import { cn } from '@/lib/utils'

interface ConditionalDialogueProps {
  sessionId: string
  dialogueConfig: DialogueConfig
  onComplete: (nextNodeId: string) => void
}

/**
 * Componente para diálogos condicionales con speaker locks
 */
export function ConditionalDialogue({
  sessionId,
  dialogueConfig,
  onComplete,
}: ConditionalDialogueProps) {
  // All hooks must be called unconditionally at the top
  const currentSession = useSessionStore(state => state.currentSession)
  const user = useAuthStore(state => state.user)
  
  const {
    progress,
    currentLine,
    availableOptions,
    loading,
    error,
    initializeDialogue,
    loadProgress,
    makeChoice,
    reset,
  } = useDialogueStore()
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  
  // Inicializar diálogo
  useEffect(() => {
    if (!dialogueConfig) return
    
    if (!progress) {
      initializeDialogue(sessionId, dialogueConfig)
    } else {
      loadProgress(sessionId, dialogueConfig.id)
    }
    
    return () => {
      reset()
    }
  }, [sessionId, dialogueConfig, progress, initializeDialogue, loadProgress, reset])

  // Check si diálogo está completo
  useEffect(() => {
    if (progress?.completedAt) {
      // Determinar siguiente nodo según última elección
      const lastChoice = progress.choices[progress.choices.length - 1]
      const lastOption = currentLine?.options.find(o => o.id === lastChoice?.optionId)
      
      if (lastOption?.action?.nextNodeId) {
        onComplete(lastOption.action.nextNodeId)
      }
    }
  }, [progress?.completedAt, progress?.choices, currentLine?.options, onComplete])
  
  // Si no hay config, no renderizar
  if (!dialogueConfig) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No hay diálogo configurado</p>
        </CardContent>
      </Card>
    )
  }
  
  // Obtener personaje del usuario actual
  const players = currentSession?.players ? Object.values(currentSession.players) : []
  const myPlayer = players.find((p: { uid: string }) => p.uid === user?.uid)
  const myCharacter = myPlayer?.character
  const myCharacterTags = ((myCharacter as Record<string, unknown>)?.tags || []) as CharacterTag[]
  const myCharacterName = (myCharacter as Record<string, unknown>)?.name as string || 'Jugador'
  
  // Obtener todos los tags del party
  const partyTags = (players
    .map((p: { character: Record<string, unknown> | null }) => ((p.character as Record<string, unknown> | null)?.tags || []) as CharacterTag[])
    .flat()) as CharacterTag[]
  
  const flags: Record<string, boolean> = {} // TODO: Obtener flags de campaña

  const handleChoice = async (option: DialogueOption) => {
    if (!user || !currentSession) return
    
    // Verificar si el jugador puede hablar
    if (!canPlayerSpeak(option, myCharacterTags, user.uid)) {
      alert('Tu personaje no puede elegir esta opción. Se requiere un tag específico.')
      return
    }
    
    setSelectedOption(option.id)
    
    try {
      await makeChoice(option.id, user.uid, myCharacterName, myCharacterTags)
      
      // Si la opción completa el diálogo, esperar un momento antes de continuar
      if (option.action?.nextNodeId) {
        const nextId = option.action.nextNodeId
        setTimeout(() => {
          onComplete(nextId)
        }, 2000)
      }
    } catch (error) {
      console.error('Error making choice:', error)
      setSelectedOption(null)
    }
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3">Cargando diálogo...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!currentLine) {
    return null
  }

  // Filtrar opciones disponibles según party tags y flags
  const visibleOptions = availableOptions.filter(option => 
    isOptionAvailable(option, partyTags, flags)
  )

  return (
    <div className="space-y-6">
      {/* NPC hablando */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{dialogueConfig.npcName}</CardTitle>
              {dialogueConfig.npcDescription && (
                <CardContent>{dialogueConfig.npcDescription}</CardContent>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed whitespace-pre-wrap">
            {currentLine.text}
          </p>
        </CardContent>
      </Card>

      {/* Opciones de respuesta */}
      <div className="space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Button className="h-4 w-4" />
          ¿Cómo responder?
        </h3>
        
        {visibleOptions.length === 0 && (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">{currentLine.fallbackText || 'No hay opciones disponibles para tu grupo.'}</p>
            </CardContent>
          </Card>
        )}
        
        {visibleOptions.map(option => {
          const canSpeak = canPlayerSpeak(option, myCharacterTags, user?.uid || '')
          const isLocked = option.speakerLockTag && !canSpeak
          const isSelected = selectedOption === option.id
          
          return (
            <Card
              key={option.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                isLocked && "opacity-50 cursor-not-allowed",
                isSelected && "border-primary bg-primary/10"
              )}
              onClick={() => !isLocked && handleChoice(option)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="font-medium">{option.text}</p>
                    
                    <div className="flex gap-2 mt-2">
                      {option.speakerLockTag && (
                        <Badge variant={canSpeak ? "default" : "secondary"} className="text-xs">
                          {isLocked ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1" />
                              Requiere: {option.speakerLockTag}
                            </>
                          ) : (
                            <>Puedes hablar</>
                          )}
                        </Badge>
                      )}
                      
                      {option.check && (
                        <Badge variant="outline" className="text-xs">
                          Check: {option.check.skill} DC {option.check.dc}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Historial de elecciones */}
      {progress && progress.choices.length > 0 && (
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-sm">Historial del diálogo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              {progress.choices.map((choice, idx) => {
                const line = dialogueConfig.lines.find((l: { id: string }) => l.id === choice.lineId)
                const option = line?.options.find((o: { id: string }) => o.id === choice.optionId)
                const players = currentSession?.players ? Object.values(currentSession.players) : []
                const speaker = players.find((p: { uid?: string }) => p.uid === choice.playerId) as { displayName?: string } | undefined
                
                return (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-medium">{speaker?.displayName || 'Jugador'}:</span>
                    <span>{option?.text}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
