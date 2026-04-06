import { create } from 'zustand'
import { doc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { rollDice } from '@/lib/dice'
import type { 
  CombatState, 
  Combatant, 
  CombatAction,
  CombatActionType,
} from '@/types/combat'
import type { Character } from '@/types/character'
import { 
  getCurrentCombatant, 
  isCombatOver, 
  getNextTurnIndex,
} from '@/types/combat'
import { getEncounterById } from '@/data/encounters'

interface CombatStore {
  combat: CombatState | null
  loading: boolean
  error: string | null
  
  // Actions
  initializeCombat: (
    sessionId: string, 
    encounterId: string, 
    playerCharacters: Character[]
  ) => Promise<void>
  loadCombat: (sessionId: string) => void
  performAction: (actionType: CombatActionType, targetId?: string) => Promise<void>
  endTurn: () => Promise<void>
  endCombat: (victory: boolean) => Promise<void>
  executeEnemyAI: () => Promise<void>
  subscribeToCombat: (sessionId: string) => Unsubscribe
}

export const useCombatStore = create<CombatStore>((set, get) => ({
  combat: null,
  loading: false,
  error: null,

  /**
   * Inicializar nuevo combate
   */
  initializeCombat: async (sessionId, encounterId, playerCharacters) => {
    try {
      console.log('🎲 [CombatStore] Iniciando initializeCombat...', { sessionId, encounterId })
      set({ loading: true, error: null })
      
      console.log('🔍 [CombatStore] Buscando encounter:', encounterId)
      const encounter = getEncounterById(encounterId)
      if (!encounter) {
        throw new Error(`Encounter ${encounterId} not found`)
      }
      console.log('✅ [CombatStore] Encounter encontrado:', encounter)

      console.log('👥 [CombatStore] Creando combatientes de jugadores...', playerCharacters)
      // Crear combatientes de jugadores
      const playerCombatants: Combatant[] = playerCharacters.map((char) => ({
        id: `player_${char.id}`,
        type: 'player' as const,
        name: char.name,
        hp: char.hp,
        maxHp: char.hp,
        ac: char.ac,
        initiative: rollDice(1, 20)[0] + 2, // +2 dex mod genérico
        characterId: char.id,
        enemyData: null,
        conditions: [],
        isDead: false,
        hasActed: false,
      }))
      console.log('✅ [CombatStore] Combatientes jugadores creados:', playerCombatants)

      // Crear combatientes enemigos
      const enemyCombatants: Combatant[] = []
      encounter.enemies.forEach(enemyTemplate => {
        for (let i = 0; i < enemyTemplate.count; i++) {
          enemyCombatants.push({
            id: `${enemyTemplate.id}_${i}`,
            type: 'enemy' as const,
            name: `${enemyTemplate.name} ${i + 1}`,
            hp: enemyTemplate.hp,
            maxHp: enemyTemplate.hp,
            ac: enemyTemplate.ac,
            initiative: rollDice(1, 20)[0] + 1, // +1 dex mod genérico
            characterId: null,
            enemyData: {
              attackBonus: enemyTemplate.attackBonus,
              damage: enemyTemplate.damage,
              cr: enemyTemplate.cr,
            },
            conditions: [],
            isDead: false,
            hasActed: false,
          })
        }
      })

      // Combinar y ordenar por iniciativa
      const allCombatants = [...playerCombatants, ...enemyCombatants]
      allCombatants.sort((a, b) => b.initiative - a.initiative)

      const turnOrder = allCombatants.map(c => c.id)

      const combatState: CombatState = {
        encounterId,
        sessionId,
        combatants: allCombatants,
        turnOrder,
        currentTurnIndex: 0,
        round: 1,
        actions: [],
        isActive: true,
        startedAt: Date.now(),
        endedAt: null,
      }

      console.log('✅ [CombatStore] Estado de combate creado:', combatState)

      // Actualizar estado local PRIMERO para que la UI se actualice inmediatamente
      set({ combat: combatState, loading: false })
      console.log('✅ [CombatStore] Estado local actualizado')

      // Guardar en Firestore en background (sin bloquear)
      console.log('💾 [CombatStore] Guardando en Firestore...')
      const combatRef = doc(db, 'sessions', sessionId, 'combat', 'current')
      setDoc(combatRef, combatState)
        .then(() => {
          console.log('✅ [CombatStore] Guardado en Firestore exitoso')
        })
        .catch((error) => {
          console.error('⚠️ [CombatStore] Error al guardar en Firestore (no crítico):', error)
          // No lanzar error - el combate funciona localmente
        })
      
      console.log('🎉 [CombatStore] Combate inicializado completamente')
    } catch (error) {
      console.error('❌ [CombatStore] Error al inicializar combate:', error)
      if (error instanceof Error) {
        console.error('❌ [CombatStore] Stack trace:', error.stack)
      }
      const errorMessage = error instanceof Error ? error.message : 'Error al inicializar combate'
      set({ error: errorMessage, loading: false })
    }
  },

  /**
   * Cargar combate existente
   */
  loadCombat: (sessionId) => {
    const unsubscribe = get().subscribeToCombat(sessionId)
    return () => unsubscribe()
  },

  /**
   * Realizar acción de combate
   */
  performAction: async (actionType, targetId) => {
    const { combat } = get()
    if (!combat || !combat.isActive) return

    try {
      const actor = getCurrentCombatant(combat)
      if (!actor || actor.hasActed) return

      let action: CombatAction

      switch (actionType) {
        case 'attack': {
          if (!targetId) throw new Error('Target required for attack')
          
          const target = combat.combatants.find(c => c.id === targetId)
          if (!target) throw new Error('Target not found')

          const attackBonus = actor.enemyData?.attackBonus || 5 // Default para jugadores
          const naturalRoll = rollDice(1, 20)[0]
          const critical = naturalRoll === 20
          const attackRoll = naturalRoll + attackBonus
          const hit = attackRoll >= target.ac || critical
          
          let damage = 0
          
          if (hit) {
            const baseDamage = rollDice(1, 8)[0] + 3 // Simplificado: 1d8+3
            damage = critical ? baseDamage * 2 : baseDamage
            
            // Aplicar daño
            const newHp = Math.max(0, target.hp - damage)
            const isDead = newHp === 0
            
            combat.combatants = combat.combatants.map(c =>
              c.id === targetId ? { ...c, hp: newHp, isDead } : c
            )
          }

          action = {
            type: 'attack',
            actorId: actor.id,
            targetId,
            result: {
              hit,
              damage,
              critical,
              description: hit
                ? `${actor.name} ataca a ${target.name} y ${critical ? '¡CRÍTICO! ' : ''}inflige ${damage} de daño`
                : `${actor.name} ataca a ${target.name} pero falla`,
            },
            timestamp: Date.now(),
          }
          break
        }

        case 'dodge': {
          action = {
            type: 'dodge',
            actorId: actor.id,
            targetId: null,
            result: {
              description: `${actor.name} se pone en posición defensiva (ventaja en tiradas de salvación)`,
            },
            timestamp: Date.now(),
          }
          break
        }

        case 'dash': {
          action = {
            type: 'dash',
            actorId: actor.id,
            targetId: null,
            result: {
              description: `${actor.name} corre (movimiento doble este turno)`,
            },
            timestamp: Date.now(),
          }
          break
        }

        case 'disengage': {
          action = {
            type: 'disengage',
            actorId: actor.id,
            targetId: null,
            result: {
              description: `${actor.name} se desvincula (movimiento sin ataques de oportunidad)`,
            },
            timestamp: Date.now(),
          }
          break
        }

        case 'help': {
          action = {
            type: 'help',
            actorId: actor.id,
            targetId: targetId || null,
            result: {
              description: targetId
                ? `${actor.name} ayuda a un aliado (ventaja en siguiente ataque)`
                : `${actor.name} prepara ayuda`,
            },
            timestamp: Date.now(),
          }
          break
        }

        default: {
          action = {
            type: actionType,
            actorId: actor.id,
            targetId: null,
            result: {
              description: `${actor.name} realiza ${actionType}`,
            },
            timestamp: Date.now(),
          }
        }
      }

      // Marcar como actuado
      combat.combatants = combat.combatants.map(c =>
        c.id === actor.id ? { ...c, hasActed: true } : c
      )

      // Agregar acción al log
      combat.actions.push(action)

      // Guardar en Firestore
      const combatRef = doc(db, 'sessions', combat.sessionId, 'combat', 'current')
      await setDoc(combatRef, combat)

      set({ combat })
    } catch (error) {
      console.error('Error performing action:', error)
    }
  },

  /**
   * Terminar turno actual
   */
  endTurn: async () => {
    const { combat } = get()
    if (!combat || !combat.isActive) return

    try {
      // Verificar si combate terminó
      const { over, victory } = isCombatOver(combat)
      if (over) {
        await get().endCombat(victory)
        return
      }

      // Siguiente turno
      const nextIndex = getNextTurnIndex(combat)
      const newRound = nextIndex <= combat.currentTurnIndex ? combat.round + 1 : combat.round

      // Reset hasActed para el siguiente combatiente
      combat.combatants = combat.combatants.map(c => ({ ...c, hasActed: false }))
      combat.currentTurnIndex = nextIndex
      combat.round = newRound

      // Guardar
      const combatRef = doc(db, 'sessions', combat.sessionId, 'combat', 'current')
      await setDoc(combatRef, combat)

      set({ combat })

      // Si es turno de enemigo, ejecutar IA
      const current = getCurrentCombatant(combat)
      if (current?.type === 'enemy') {
        setTimeout(() => get().executeEnemyAI(), 1000)
      }
    } catch (error) {
      console.error('Error ending turn:', error)
    }
  },

  /**
   * IA básica para enemigos
   */
  executeEnemyAI: async () => {
    const { combat } = get()
    if (!combat) return

    const actor = getCurrentCombatant(combat)
    if (!actor || actor.type !== 'enemy') return

    // Estrategia simple: atacar al jugador con menos HP
    const alivePlayers = combat.combatants.filter(c => c.type === 'player' && !c.isDead)
    if (alivePlayers.length === 0) return

    const target = alivePlayers.reduce((lowest, current) =>
      current.hp < lowest.hp ? current : lowest
    )

    await get().performAction('attack', target.id)
    
    // Auto end turn después de actuar
    setTimeout(() => get().endTurn(), 1500)
  },

  /**
   * Terminar combate
   */
  endCombat: async () => {
    const { combat } = get()
    if (!combat) return

    try {
      combat.isActive = false
      combat.endedAt = Date.now()

      const combatRef = doc(db, 'sessions', combat.sessionId, 'combat', 'current')
      await setDoc(combatRef, combat)

      set({ combat })
    } catch (error) {
      console.error('Error ending combat:', error)
    }
  },

  /**
   * Suscribirse a actualizaciones de combate
   */
  subscribeToCombat: (sessionId) => {
    const combatRef = doc(db, 'sessions', sessionId, 'combat', 'current')
    
    const unsubscribe = onSnapshot(
      combatRef,
      (snapshot) => {
        if (snapshot.exists()) {
          set({ combat: snapshot.data() as CombatState, loading: false })
        } else {
          set({ combat: null, loading: false })
        }
      },
      (error) => {
        console.error('Error subscribing to combat:', error)
        set({ error: error.message, loading: false })
      }
    )

    return unsubscribe
  },
}))
