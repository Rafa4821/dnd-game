import Phaser from 'phaser'
import { GridSystem } from '../systems/GridSystem'
import { EffectsSystem } from '../systems/EffectsSystem'
import { ImprovedCombatantSprite } from '../entities/ImprovedCombatantSprite'
import type { CombatState, Combatant } from '@/types/combat'
import { GRID_CONFIG } from '../config'

export class TacticalCombatScene extends Phaser.Scene {
  private gridSystem!: GridSystem
  private effectsSystem!: EffectsSystem
  private combatantSprites: Map<string, ImprovedCombatantSprite> = new Map()
  private selectedCombatant: ImprovedCombatantSprite | null = null
  private selectionIndicator: Phaser.GameObjects.Graphics | null = null
  
  // Estado del combate (inyectado externamente)
  private combatState: CombatState | null = null
  private onActionCallback: ((action: string, targetId?: string) => void) | null = null
  private onEndTurnCallback: (() => void) | null = null

  constructor() {
    super({ key: 'TacticalCombatScene' })
  }

  init(): void {
    // Crear textura blanca para partículas
    if (!this.textures.exists('white')) {
      const graphics = this.add.graphics()
      graphics.fillStyle(0xffffff, 1)
      graphics.fillCircle(4, 4, 4)
      graphics.generateTexture('white', 8, 8)
      graphics.destroy()
    }
  }

  create(): void {
    // Inicializar sistemas
    this.gridSystem = new GridSystem(this, GRID_CONFIG.GRID_WIDTH, GRID_CONFIG.GRID_HEIGHT, GRID_CONFIG.TILE_SIZE)
    this.effectsSystem = new EffectsSystem(this)
    
    // UI de información
    this.createUI()
    
    // Input de mouse
    this.input.on('pointerdown', this.handleClick, this)
    this.input.on('pointermove', this.handlePointerMove, this)
  }

  private createUI(): void {
    // Fondo semitransparente para el panel de UI
    const panel = this.add.graphics()
    panel.fillStyle(0x000000, 0.7)
    panel.fillRoundedRect(10, 10, 300, 120, 8)
    panel.setDepth(100)
    panel.setScrollFactor(0)
    
    // Texto de instrucciones
    const instructions = this.add.text(20, 20, 'Combate Táctico', {
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold',
    })
    instructions.setDepth(101)
    instructions.setScrollFactor(0)
    
    const helpText = this.add.text(20, 50, 
      'Click: Seleccionar/Mover\n' +
      'Click enemigo: Atacar\n' +
      'Espacio: Terminar turno', 
      {
        fontSize: '12px',
        color: '#cccccc',
      }
    )
    helpText.setDepth(101)
    helpText.setScrollFactor(0)
    
    // Tecla Espacio para terminar turno
    this.input.keyboard?.on('keydown-SPACE', () => {
      if (this.onEndTurnCallback) {
        this.onEndTurnCallback()
      }
    })
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    const cell = this.gridSystem.getCellFromWorld(pointer.worldX, pointer.worldY)
    if (cell) {
      // Highlight celda bajo cursor
      // (Opcional: agregar efecto hover)
    }
  }

  private handleClick(pointer: Phaser.Input.Pointer): void {
    const cell = this.gridSystem.getCellFromWorld(pointer.worldX, pointer.worldY)
    if (!cell) return
    
    // Buscar si hay un combatiente en esta celda
    const clickedSprite = Array.from(this.combatantSprites.values()).find(sprite => {
      const pos = sprite.getGridPosition()
      return pos.x === cell.x && pos.y === cell.y
    })
    
    if (clickedSprite) {
      const combatant = clickedSprite.getCombatant()
      
      if (this.selectedCombatant && this.selectedCombatant !== clickedSprite) {
        // Ataque
        if (combatant.type === 'enemy' && this.onActionCallback) {
          this.onActionCallback('attack', combatant.id)
        }
      } else {
        // Seleccionar
        this.selectCombatant(clickedSprite)
      }
    } else if (this.selectedCombatant && !cell.occupied) {
      // Mover
      this.moveSelectedCombatant(cell.x, cell.y)
    }
  }

  private selectCombatant(sprite: ImprovedCombatantSprite): void {
    // Deseleccionar anterior
    if (this.selectedCombatant) {
      this.selectedCombatant.highlight(false)
    }
    
    this.selectedCombatant = sprite
    sprite.highlight(true)
    
    // Mostrar rango de movimiento
    const pos = sprite.getGridPosition()
    const movementRange = 3 // Simplificado
    this.gridSystem.highlightMovementRange(pos.x, pos.y, movementRange)
    
    // Indicador de selección
    if (this.selectionIndicator) {
      this.selectionIndicator.destroy()
    }
    this.selectionIndicator = this.effectsSystem.createSelectionIndicator(pos.x, pos.y)
  }

  private async moveSelectedCombatant(gridX: number, gridY: number): Promise<void> {
    if (!this.selectedCombatant) return
    
    const currentPos = this.selectedCombatant.getGridPosition()
    
    // Pathfinding
    const path = this.gridSystem.findPath(currentPos.x, currentPos.y, gridX, gridY)
    
    if (path.length === 0) return
    
    // Highlight path
    this.gridSystem.highlightPath(path)
    
    // Actualizar ocupación del grid
    this.gridSystem.setOccupied(currentPos.x, currentPos.y, false)
    
    // Mover sprite mejorado
    await this.selectedCombatant.moveToGrid(gridX, gridY)
    
    // Nueva ocupación
    this.gridSystem.setOccupied(gridX, gridY, true)
    
    this.gridSystem.clearHighlights()
  }

  // API pública para actualizar desde React
  public updateCombatState(state: CombatState): void {
    this.combatState = state
    this.syncSprites()
  }

  public setCallbacks(
    onAction: (action: string, targetId?: string) => void,
    onEndTurn: () => void
  ): void {
    this.onActionCallback = onAction
    this.onEndTurnCallback = onEndTurn
  }

  private syncSprites(): void {
    if (!this.combatState) return
    
    // Actualizar sprites existentes y crear nuevos
    this.combatState.combatants.forEach((combatant, index) => {
      let sprite = this.combatantSprites.get(combatant.id)
      
      if (!sprite) {
        // Crear nuevo sprite mejorado
        const gridX = this.getInitialPosition(combatant, index).x
        const gridY = this.getInitialPosition(combatant, index).y
        
        sprite = new ImprovedCombatantSprite(this, combatant, gridX, gridY)
        this.combatantSprites.set(combatant.id, sprite)
        this.gridSystem.setOccupied(gridX, gridY, true)
      } else {
        // Actualizar sprite existente
        sprite.updateCombatant(combatant)
      }
    })
    
    // Remover sprites de combatientes muertos/no existentes
    const currentIds = new Set(this.combatState.combatants.map(c => c.id))
    this.combatantSprites.forEach((sprite, id) => {
      if (!currentIds.has(id)) {
        const pos = sprite.getGridPosition()
        this.gridSystem.setOccupied(pos.x, pos.y, false)
        sprite.destroy()
        this.combatantSprites.delete(id)
      }
    })
  }

  private getInitialPosition(combatant: Combatant, index: number): { x: number; y: number } {
    // Posicionamiento inicial: jugadores a la izquierda, enemigos a la derecha
    if (combatant.type === 'player') {
      const row = Math.floor(index / 2)
      const col = index % 2
      return {
        x: 1 + col,
        y: 3 + row,
      }
    } else {
      const enemyIndex = index - this.combatState!.combatants.filter(c => c.type === 'player').length
      const row = Math.floor(enemyIndex / 2)
      const col = enemyIndex % 2
      return {
        x: GRID_CONFIG.GRID_WIDTH - 3 + col,
        y: 3 + row,
      }
    }
  }

  public async playAttack(attackerId: string, targetId: string, damage: number): Promise<void> {
    const attackerSprite = this.combatantSprites.get(attackerId)
    const targetSprite = this.combatantSprites.get(targetId)
    
    if (!attackerSprite || !targetSprite) return
    
    const attackerPos = attackerSprite.getGridPosition()
    const targetPos = targetSprite.getGridPosition()
    
    // Animación de ataque
    await attackerSprite.playAttackAnimation(targetPos.x, targetPos.y)
    
    // Proyectil
    const attackerWorld = {
      x: attackerPos.x * GRID_CONFIG.TILE_SIZE + GRID_CONFIG.TILE_SIZE / 2,
      y: attackerPos.y * GRID_CONFIG.TILE_SIZE + GRID_CONFIG.TILE_SIZE / 2,
    }
    const targetWorld = {
      x: targetPos.x * GRID_CONFIG.TILE_SIZE + GRID_CONFIG.TILE_SIZE / 2,
      y: targetPos.y * GRID_CONFIG.TILE_SIZE + GRID_CONFIG.TILE_SIZE / 2,
    }
    
    await this.effectsSystem.createProjectile(
      attackerWorld.x,
      attackerWorld.y,
      targetWorld.x,
      targetWorld.y,
      'arrow'
    )
    
    // Daño
    await targetSprite.playDamageAnimation(damage)
    this.effectsSystem.screenShake(5, 200)
  }

  public async playAOEAttack(centerX: number, centerY: number, radius: number): Promise<void> {
    const worldX = centerX * GRID_CONFIG.TILE_SIZE + GRID_CONFIG.TILE_SIZE / 2
    const worldY = centerY * GRID_CONFIG.TILE_SIZE + GRID_CONFIG.TILE_SIZE / 2
    
    await this.effectsSystem.createAOEEffect(worldX, worldY, radius * GRID_CONFIG.TILE_SIZE, 0xff6b6b)
    this.effectsSystem.screenShake(10, 300)
  }

  public highlightCurrentTurn(combatantId: string): void {
    // Limpiar highlights anteriores
    this.combatantSprites.forEach(sprite => sprite.highlight(false))
    
    // Highlight actual
    const sprite = this.combatantSprites.get(combatantId)
    if (sprite) {
      sprite.highlight(true)
      
      // Auto-seleccionar si es jugador
      const combatant = sprite.getCombatant()
      if (combatant.type === 'player') {
        this.selectCombatant(sprite)
      }
    }
  }

  update(_time: number, _delta: number): void {
    // Update loop (si es necesario)
  }
}
