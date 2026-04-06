import Phaser from 'phaser'
import { GRID_CONFIG, ANIMATION_CONFIG } from '../config'
import type { Combatant } from '@/types/combat'

export class CombatantSprite extends Phaser.GameObjects.Container {
  private combatant: Combatant
  private sprite: Phaser.GameObjects.Graphics
  private healthBar: Phaser.GameObjects.Graphics
  private nameText: Phaser.GameObjects.Text
  private gridX: number
  private gridY: number
  public isAnimating: boolean = false

  constructor(scene: Phaser.Scene, combatant: Combatant, gridX: number, gridY: number) {
    const worldX = gridX * GRID_CONFIG.TILE_SIZE + GRID_CONFIG.TILE_SIZE / 2
    const worldY = gridY * GRID_CONFIG.TILE_SIZE + GRID_CONFIG.TILE_SIZE / 2
    
    super(scene, worldX, worldY)
    
    this.combatant = combatant
    this.gridX = gridX
    this.gridY = gridY
    
    this.createSprite()
    this.createHealthBar()
    this.createNameText()
    
    scene.add.existing(this)
    this.setDepth(10)
  }

  private createSprite(): void {
    this.sprite = this.scene.add.graphics()
    
    const isPlayer = this.combatant.type === 'player'
    const baseColor = isPlayer ? 0x3a7ca5 : 0xd62828
    const size = 40
    
    // Dibuja círculo para el cuerpo
    this.sprite.fillStyle(baseColor, 1)
    this.sprite.fillCircle(0, 0, size / 2)
    
    // Borde
    this.sprite.lineStyle(3, isPlayer ? 0x06ffa5 : 0x8b0000, 1)
    this.sprite.strokeCircle(0, 0, size / 2)
    
    // Icono de clase (simplificado)
    if (isPlayer) {
      // Espada para jugadores
      this.sprite.lineStyle(3, 0xffffff, 1)
      this.sprite.strokePath([
        new Phaser.Geom.Point(-8, 8),
        new Phaser.Geom.Point(8, -8),
      ])
    } else {
      // Calavera simple para enemigos
      this.sprite.fillStyle(0xffffff, 1)
      this.sprite.fillCircle(0, -3, 6)
      this.sprite.fillCircle(-5, -3, 3)
      this.sprite.fillCircle(5, -3, 3)
    }
    
    this.add(this.sprite)
    
    // Efecto de pulso
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  private createHealthBar(): void {
    this.healthBar = this.scene.add.graphics()
    this.updateHealthBar()
    this.add(this.healthBar)
  }

  private updateHealthBar(): void {
    this.healthBar.clear()
    
    const barWidth = 50
    const barHeight = 6
    const x = -barWidth / 2
    const y = 30
    
    // Fondo
    this.healthBar.fillStyle(0x000000, 0.5)
    this.healthBar.fillRect(x, y, barWidth, barHeight)
    
    // HP actual
    const hpPercent = this.combatant.hp / this.combatant.maxHp
    const hpColor = hpPercent > 0.5 ? 0x00ff00 : hpPercent > 0.25 ? 0xffff00 : 0xff0000
    
    this.healthBar.fillStyle(hpColor, 1)
    this.healthBar.fillRect(x, y, barWidth * hpPercent, barHeight)
    
    // Borde
    this.healthBar.lineStyle(1, 0xffffff, 0.8)
    this.healthBar.strokeRect(x, y, barWidth, barHeight)
  }

  private createNameText(): void {
    this.nameText = this.scene.add.text(0, -35, this.combatant.name, {
      fontSize: '12px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center',
    })
    this.nameText.setOrigin(0.5)
    this.add(this.nameText)
  }

  async moveTo(gridX: number, gridY: number): Promise<void> {
    this.isAnimating = true
    
    const worldX = gridX * GRID_CONFIG.TILE_SIZE + GRID_CONFIG.TILE_SIZE / 2
    const worldY = gridY * GRID_CONFIG.TILE_SIZE + GRID_CONFIG.TILE_SIZE / 2
    
    return new Promise((resolve) => {
      // Efecto de salto durante el movimiento
      this.scene.tweens.add({
        targets: this,
        x: worldX,
        y: worldY,
        duration: ANIMATION_CONFIG.MOVE_DURATION,
        ease: 'Power2',
        onComplete: () => {
          this.gridX = gridX
          this.gridY = gridY
          this.isAnimating = false
          resolve()
        },
      })
      
      // Animación de salto
      this.scene.tweens.add({
        targets: this.sprite,
        y: -15,
        duration: ANIMATION_CONFIG.MOVE_DURATION / 2,
        yoyo: true,
        ease: 'Quad.easeOut',
      })
    })
  }

  async playAttackAnimation(targetX: number, targetY: number): Promise<void> {
    this.isAnimating = true
    
    const originalX = this.x
    const originalY = this.y
    const targetWorldX = targetX * GRID_CONFIG.TILE_SIZE + GRID_CONFIG.TILE_SIZE / 2
    const targetWorldY = targetY * GRID_CONFIG.TILE_SIZE + GRID_CONFIG.TILE_SIZE / 2
    
    // Movimiento hacia el objetivo
    const dx = targetWorldX - originalX
    const dy = targetWorldY - originalY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const moveDistance = Math.min(distance * 0.3, 40)
    const moveX = originalX + (dx / distance) * moveDistance
    const moveY = originalY + (dy / distance) * moveDistance
    
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this,
        x: moveX,
        y: moveY,
        duration: ANIMATION_CONFIG.ATTACK_DURATION / 2,
        ease: 'Back.easeOut',
        yoyo: true,
        onComplete: () => {
          this.isAnimating = false
          resolve()
        },
      })
      
      // Rotación durante el ataque
      this.scene.tweens.add({
        targets: this.sprite,
        angle: 45,
        duration: ANIMATION_CONFIG.ATTACK_DURATION / 2,
        yoyo: true,
        ease: 'Power2',
      })
    })
  }

  async playDamageAnimation(damage: number): Promise<void> {
    // Flash rojo
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 2,
    })
    
    // Shake
    const originalX = this.x
    this.scene.tweens.add({
      targets: this,
      x: originalX + 5,
      duration: 50,
      yoyo: true,
      repeat: 3,
    })
    
    // Texto flotante de daño
    const damageText = this.scene.add.text(0, -20, `-${damage}`, {
      fontSize: '20px',
      color: '#ff0000',
      stroke: '#000000',
      strokeThickness: 4,
      fontStyle: 'bold',
    })
    damageText.setOrigin(0.5)
    this.add(damageText)
    
    this.scene.tweens.add({
      targets: damageText,
      y: -60,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => damageText.destroy(),
    })
  }

  updateCombatant(combatant: Combatant): void {
    this.combatant = combatant
    this.updateHealthBar()
    
    if (combatant.isDead) {
      this.playDeathAnimation()
    }
  }

  private async playDeathAnimation(): Promise<void> {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 0,
      scaleY: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        this.setVisible(false)
      },
    })
  }

  highlight(enabled: boolean): void {
    if (enabled) {
      this.sprite.setScale(1.2)
      this.setDepth(20)
    } else {
      this.sprite.setScale(1)
      this.setDepth(10)
    }
  }

  getGridPosition(): { x: number; y: number } {
    return { x: this.gridX, y: this.gridY }
  }

  getCombatant(): Combatant {
    return this.combatant
  }
}
