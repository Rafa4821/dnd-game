import { useEffect, useState } from 'react'
import { useSessionStore } from '@/stores/sessionStore'
import { useCombatStore } from '@/stores/combatStore'
import { PhaserCombat } from './PhaserCombat'
import { CombatantCard } from './CombatantCard'
import { ActionPanel } from './ActionPanel'
import { Swords, SkipForward, Trophy, Skull, Loader2, Gamepad2 } from 'lucide-react'
import type { CombatActionType } from '@/types/combat'
import { getCurrentCombatant } from '@/types/combat'

interface CombatArenaProps {
  sessionId: string
  encounterId: string
  onCombatEnd: (victory: boolean) => void
}

export function CombatArena({ sessionId, encounterId, onCombatEnd }: CombatArenaProps) {
  const { currentSession } = useSessionStore()
  const { combat, loading, initializeCombat, loadCombat, performAction, endTurn, executeEnemyAI } = useCombatStore()
  
  const [selectedAction, setSelectedAction] = useState<CombatActionType | null>(null)
  const [combatEnded, setCombatEnded] = useState(false)
  const [tacticalView, setTacticalView] = useState(true)
  const [initialized, setInitialized] = useState(false)

  // Inicializar combate con personajes de la sesión
  useEffect(() => {
    // Evitar re-inicialización si ya se inicializó
    if (initialized) return
    
    const initialize = async () => {
      if (!combat && currentSession) {
        try {
          console.log('🎮 Iniciando combate...', { sessionId, encounterId })
          
          // Obtener personajes desde la sesión
          const playerCharacters = Object.values(currentSession.players)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((player: any) => player.character !== null)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((player: any) => ({
              id: player.character!.id,
              name: player.character!.name,
              class: player.character!.class,
              level: player.character!.level,
              hp: player.character!.hp,
              maxHp: player.character!.maxHp,
              tempHp: 0,
              ac: 10 + Math.floor((player.character!.level - 1) / 4),
              initiative: 0,
              speed: 30,
              strength: 10,
              dexterity: 10,
              constitution: 10,
              intelligence: 10,
              wisdom: 10,
              charisma: 10,
              proficiencyBonus: Math.floor((player.character!.level - 1) / 4) + 2,
              conditions: [],
              ownerId: player.uid,
              pregenId: null,
              customClass: null,
              inventory: [],
              spells: [],
              features: [],
              skills: [],
              savingThrows: [],
              abilities: {
                str: 10,
                dex: 10,
                con: 10,
                int: 10,
                wis: 10,
                cha: 10,
              },
              traits: [],
              specialAbilities: [],
              pregen: false,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            }))
          
          // Solo inicializar si hay personajes
          if (playerCharacters.length > 0) {
            await initializeCombat(sessionId, encounterId, playerCharacters)
            console.log('✅ Combate inicializado exitosamente')
            setInitialized(true)
          } else {
            console.error('❌ No se encontraron personajes en la sesión')
            alert('Error: No se encontraron personajes en la sesión. Asegúrate de haber creado un personaje.')
          }
        } catch (error) {
          console.error('❌ Error al inicializar combate:', error)
          alert(`Error al inicializar combate: ${error instanceof Error ? error.message : 'Error desconocido'}`)
        }
      } else if (combat) {
        console.log('🔄 [CombatArena] Combate ya existe, cargando...')
        loadCombat(sessionId)
        setInitialized(true)
      } else if (!currentSession) {
        console.error('❌ No hay sesión activa')
        alert('Error: No hay sesión activa. Por favor, regresa y selecciona una sesión.')
      }
    }
    
    initialize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, encounterId, currentSession])

  // Ejecutar IA enemiga automáticamente cuando es su turno
  useEffect(() => {
    if (!combat || !combat.isActive) return

    const currentCombatant = getCurrentCombatant(combat)
    
    // Si es turno de enemigo y no ha actuado, ejecutar IA
    if (currentCombatant?.type === 'enemy' && !currentCombatant.hasActed) {
      const timer = setTimeout(() => {
        executeEnemyAI()
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [combat, combat?.currentTurnIndex, executeEnemyAI])

  // Verificar si combate terminó
  useEffect(() => {
    if (!combat || !combat.isActive || combatEnded) return

    // Delay de 1 segundo para evitar falsos positivos al inicializar
    const checkTimer = setTimeout(() => {
      const playersAlive = combat.combatants.filter(c => c.type === 'player' && !c.isDead).length
      const enemiesAlive = combat.combatants.filter(c => c.type === 'enemy' && !c.isDead).length

      if (playersAlive === 0 || enemiesAlive === 0) {
        const victory = enemiesAlive === 0
        setCombatEnded(true)
        
        setTimeout(() => {
          onCombatEnd(victory)
        }, 3000)
      }
    }, 1000)

    return () => clearTimeout(checkTimer)
  }, [combat, combatEnded, onCombatEnd])

  const handleAction = (actionType: CombatActionType) => {
    if (actionType === 'attack') {
      setSelectedAction('attack')
    } else {
      performAction(actionType)
      setSelectedAction(null)
    }
  }

  const handleTargetSelect = (targetId: string) => {
    if (selectedAction === 'attack') {
      performAction('attack', targetId)
      setSelectedAction(null)
    }
  }

  const handleEndTurn = () => {
    setSelectedAction(null)
    endTurn()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3">Inicializando combate...</span>
        <p className="text-xs text-muted-foreground">Si esto tarda mucho, revisa la consola (F12)</p>
      </div>
    )
  }

  if (!combat) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-4">
          <p className="text-lg text-destructive">Error: No se pudo inicializar el combate.</p>
          <p className="text-sm text-muted-foreground">Revisa la consola (F12) para más detalles.</p>
        </div>
      </div>
    )
  }

  const currentCombatant = getCurrentCombatant(combat)
  const isPlayerTurn = currentCombatant?.type === 'player'
  const playersAlive = combat.combatants.filter(c => c.type === 'player' && !c.isDead).length
  const enemiesAlive = combat.combatants.filter(c => c.type === 'enemy' && !c.isDead).length

  // Pantalla de victoria/derrota
  if (combatEnded) {
    const victory = enemiesAlive === 0

    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-6 max-w-md">
          {victory ? (
            <>
              <Trophy className="w-24 h-24 text-yellow-500 mx-auto animate-bounce" />
              <h2 className="text-4xl font-bold">¡Victoria!</h2>
              <p className="text-lg text-muted-foreground">
                Habéis derrotado a los enemigos. El grupo está a salvo... por ahora.
              </p>
            </>
          ) : (
            <>
              <Skull className="w-24 h-24 text-destructive mx-auto" />
              <h2 className="text-4xl font-bold">Derrota</h2>
              <p className="text-lg text-muted-foreground">
                El grupo ha caído en batalla. La oscuridad prevalece...
              </p>
            </>
          )}
          <p className="text-sm text-muted-foreground">
            Continuando automáticamente...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Swords className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-xl font-bold">Combate Activo</h2>
              <p className="text-sm text-muted-foreground">
                Ronda {combat.round} • {isPlayerTurn ? 'Turno de jugador' : 'Turno de enemigo'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Jugadores:</span>
                <span className="font-bold text-green-500">{playersAlive}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Enemigos:</span>
                <span className="font-bold text-red-500">{enemiesAlive}</span>
              </div>
            </div>
            
            {/* Toggle Vista Táctica */}
            <button
              onClick={() => setTacticalView(!tacticalView)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                tacticalView 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'border-border hover:bg-accent'
              }`}
              title={tacticalView ? 'Cambiar a vista de cartas' : 'Cambiar a vista táctica 2D'}
            >
              <Gamepad2 className="w-4 h-4" />
              <span className="text-sm font-medium">
                {tacticalView ? 'Vista Táctica 2D' : 'Vista Cartas'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Vista Táctica 2D con Phaser */}
      {tacticalView && (
        <div className="min-h-[600px]">
          <PhaserCombat
            combatState={combat}
            onAction={performAction}
            onEndTurn={handleEndTurn}
          />
        </div>
      )}

      {/* Vista de Cartas (Original) */}
      {!tacticalView && (
        <>
          {/* Mensaje de selección de objetivo */}
          {selectedAction === 'attack' && (
            <div className="p-4 bg-primary/10 border-2 border-primary rounded-lg animate-pulse">
              <p className="text-center font-semibold">
                ⚔️ Selecciona un enemigo para atacar
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jugadores */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            Jugadores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {combat.combatants
              .filter(c => c.type === 'player')
              .map(combatant => (
                <CombatantCard
                  key={combatant.id}
                  combatant={combatant}
                  isCurrentTurn={currentCombatant?.id === combatant.id}
                  isTargetable={false}
                />
              ))}
          </div>

          {/* Enemigos */}
          <h3 className="font-bold text-lg flex items-center gap-2 mt-8">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            Enemigos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {combat.combatants
              .filter(c => c.type === 'enemy')
              .map(combatant => (
                <CombatantCard
                  key={combatant.id}
                  combatant={combatant}
                  isCurrentTurn={currentCombatant?.id === combatant.id}
                  isTargetable={selectedAction === 'attack' && isPlayerTurn}
                  onSelect={() => handleTargetSelect(combatant.id)}
                />
              ))}
          </div>
        </div>

        {/* Panel de acciones */}
        <div className="space-y-4">
          {isPlayerTurn && currentCombatant && (
            <>
              <ActionPanel
                onAction={handleAction}
                disabled={currentCombatant.hasActed}
                hasActed={currentCombatant.hasActed}
              />

              <button
                onClick={handleEndTurn}
                className="w-full py-3 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                <SkipForward className="w-5 h-5" />
                Terminar Turno
              </button>
            </>
          )}

          {!isPlayerTurn && (
            <div className="p-4 bg-muted/50 border border-border rounded-lg">
              <p className="text-center text-muted-foreground">
                🤖 Turno del enemigo...
              </p>
              <div className="mt-2 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            </div>
          )}

          {/* Log de acciones */}
          <div className="p-4 bg-card border border-border rounded-lg max-h-[400px] overflow-y-auto">
            <h4 className="font-semibold mb-3">Log de Combate</h4>
            <div className="space-y-2">
              {combat.actions.slice(-10).reverse().map((action, index) => (
                <div
                  key={index}
                  className="p-2 bg-muted/50 rounded text-sm"
                >
                  <p>{action.result.description}</p>
                  {action.result.damage !== undefined && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Daño: {action.result.damage}
                      {action.result.critical && ' (¡CRÍTICO!)'}
                    </p>
                  )}
                </div>
              ))}
              {combat.actions.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center">
                  El combate acaba de comenzar...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  )
}
