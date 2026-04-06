import Phaser from 'phaser'
import { GRID_CONFIG, ANIMATION_CONFIG } from '../config'
import type { Combatant } from '@/types/combat'

/**
 * Sprite mejorado de combatiente con gráficos procedurales avanzados
 */
export class ImprovedCombatantSprite extends Phaser.GameObjects.Container {
  private combatant: Combatant
  private bodySprite: Phaser.GameObjects.Graphics
  private weaponSprite: Phaser.GameObjects.Graphics
  private shieldSprite: Phaser.GameObjects.Graphics | null = null
  private shadowSprite: Phaser.GameObjects.Graphics
  private healthBar: Phaser.GameObjects.Graphics
  private hpText: Phaser.GameObjects.Text | null = null
  private nameText: Phaser.GameObjects.Text
  private statusIcon: Phaser.GameObjects.Text
  private gridX: number
  private gridY: number
  public isAnimating: boolean = false
  
  // Partículas de ambiente
  private ambientParticles: Phaser.GameObjects.Particles.ParticleEmitter | null = null

  constructor(scene: Phaser.Scene, combatant: Combatant, gridX: number, gridY: number) {
    const worldX = gridX * GRID_CONFIG.TILE_SIZE + GRID_CONFIG.TILE_SIZE / 2
    const worldY = gridY * GRID_CONFIG.TILE_SIZE + GRID_CONFIG.TILE_SIZE / 2
    
    super(scene, worldX, worldY)
    
    this.combatant = combatant
    this.gridX = gridX
    this.gridY = gridY
    
    this.createShadow()
    this.createBody()
    this.createWeapon()
    if (combatant.type === 'player') {
      this.createShield()
    }
    this.createHealthBar()
    this.createNameText()
    this.createStatusIcon()
    this.createAmbientParticles()
    
    scene.add.existing(this)
    this.setDepth(10)
    
    // Animación idle
    this.startIdleAnimation()
  }

  private createShadow(): void {
    this.shadowSprite = this.scene.add.graphics()
    this.shadowSprite.fillStyle(0x000000, 0.3)
    this.shadowSprite.fillEllipse(0, 35, 30, 15)
    this.add(this.shadowSprite)
  }

  private createBody(): void {
    this.bodySprite = this.scene.add.graphics()
    
    const isPlayer = this.combatant.type === 'player'
    const primaryColor = isPlayer ? 0x3a7ca5 : 0xd62828
    const secondaryColor = isPlayer ? 0x2c5f7a : 0xa01f1f
    const accentColor = isPlayer ? 0x06ffa5 : 0xff6b6b
    
    // Cuerpo principal (elipse para simular torso)
    this.bodySprite.fillStyle(primaryColor, 1)
    this.bodySprite.fillEllipse(0, 0, 35, 45)
    
    // Degradado simulado con círculos
    this.bodySprite.fillStyle(secondaryColor, 0.5)
    this.bodySprite.fillEllipse(-5, -5, 30, 35)
    
    // Cabeza
    this.bodySprite.fillStyle(isPlayer ? 0xffd6a5 : 0x8b8b8b, 1)
    this.bodySprite.fillCircle(0, -25, 12)
    
    // Ojos
    this.bodySprite.fillStyle(isPlayer ? 0x000000 : 0xff0000, 1)
    this.bodySprite.fillCircle(-4, -26, 2)
    this.bodySprite.fillCircle(4, -26, 2)
    
    // Detalle de armadura/ropa
    this.bodySprite.lineStyle(2, accentColor, 1)
    this.bodySprite.strokeCircle(0, 0, 18)
    this.bodySprite.strokeCircle(0, 0, 22)
    
    // Símbolo de clase/tipo
    if (isPlayer) {
      // Espada en el pecho
      this.bodySprite.lineStyle(3, 0xffffff, 1)
      this.bodySprite.beginPath()
      this.bodySprite.moveTo(0, -5)
      this.bodySprite.lineTo(0, 10)
      this.bodySprite.strokePath()
      
      // Empuñadura
      this.bodySprite.fillStyle(0xffaa00, 1)
      this.bodySprite.fillRect(-3, -7, 6, 4)
    } else {
      // Calavera en el pecho
      this.bodySprite.fillStyle(0xffffff, 1)
      this.bodySprite.fillCircle(0, 0, 6)
      this.bodySprite.fillCircle(-3, -1, 2)
      this.bodySprite.fillCircle(3, -1, 2)
      this.bodySprite.fillTriangle(0, 2, -2, 5, 2, 5)
    }
    
    // Borde brillante
    this.bodySprite.lineStyle(3, accentColor, 0.8)
    this.bodySprite.strokeEllipse(0, 0, 35, 45)
    
    this.add(this.bodySprite)
  }

  private createWeapon(): void {
    this.weaponSprite = this.scene.add.graphics()
    
    const isPlayer = this.combatant.type === 'player'
    
    if (isPlayer) {
      // Espada
      this.weaponSprite.lineStyle(4, 0xc0c0c0, 1)
      this.weaponSprite.beginPath()
      this.weaponSprite.moveTo(25, -10)
      this.weaponSprite.lineTo(25, 15)
      this.weaponSprite.strokePath()
      
      // Hoja brillante
      this.weaponSprite.lineStyle(2, 0xffffff, 0.8)
      this.weaponSprite.beginPath()
      this.weaponSprite.moveTo(23, -8)
      this.weaponSprite.lineTo(23, 13)
      this.weaponSprite.strokePath()
      
      // Empuñadura
      this.weaponSprite.fillStyle(0x8b4513, 1)
      this.weaponSprite.fillRect(22, 15, 6, 10)
      
      // Guarda
      this.weaponSprite.fillStyle(0xffaa00, 1)
      this.weaponSprite.fillRect(18, 13, 14, 3)
    } else {
      // Garra/Arma enemiga
      this.weaponSprite.fillStyle(0x8b0000, 1)
      this.weaponSprite.fillTriangle(25, 0, 20, 15, 30, 15)
      
      // Detalles
      this.weaponSprite.lineStyle(2, 0xff0000, 1)
      this.weaponSprite.beginPath()
      this.weaponSprite.moveTo(25, 0)
      this.weaponSprite.lineTo(25, 15)
      this.weaponSprite.strokePath()
    }
    
    this.add(this.weaponSprite)
  }

  private createShield(): void {
    this.shieldSprite = this.scene.add.graphics()
    
    // Escudo
    this.shieldSprite.fillStyle(0x4a5568, 1)
    this.shieldSprite.fillCircle(-25, 0, 12)
    
    // Borde dorado
    this.shieldSprite.lineStyle(2, 0xffaa00, 1)
    this.shieldSprite.strokeCircle(-25, 0, 12)
    
    // Cruz en el escudo
    this.shieldSprite.lineStyle(3, 0xffffff, 1)
    this.shieldSprite.beginPath()
    this.shieldSprite.moveTo(-25, -8)
    this.shieldSprite.lineTo(-25, 8)
    this.shieldSprite.moveTo(-33, 0)
    this.shieldSprite.lineTo(-17, 0)
    this.shieldSprite.strokePath()
    
    this.add(this.shieldSprite)
  }

  private createHealthBar(): void {
    this.healthBar = this.scene.add.graphics()
    this.updateHealthBar()
    this.add(this.healthBar)
  }

  private updateHealthBar(): void {
    this.healthBar.clear()
    
    const barWidth = 60
    const barHeight = 8
    const x = -barWidth / 2
    const y = 40
    
    // Fondo oscuro
    this.healthBar.fillStyle(0x000000, 0.7)
    this.healthBar.fillRoundedRect(x - 2, y - 2, barWidth + 4, barHeight + 4, 3)
    
    // HP actual
    const hpPercent = Math.max(0, this.combatant.hp / this.combatant.maxHp)
    const hpColor = hpPercent > 0.6 ? 0x00ff00 : hpPercent > 0.3 ? 0xffaa00 : 0xff0000
    
    this.healthBar.fillStyle(hpColor, 1)
    this.healthBar.fillRoundedRect(x, y, barWidth * hpPercent, barHeight, 2)
    
    // Borde brillante
    this.healthBar.lineStyle(2, 0xffffff, 0.8)
    this.healthBar.strokeRoundedRect(x, y, barWidth, barHeight, 2)
    
    // Texto de HP (agregado al container, no al graphics)
    const hpText = `${this.combatant.hp}/${this.combatant.maxHp}`
    if (this.hpText) {
      this.hpText.setText(hpText)
    } else {
      this.hpText = this.scene.add.text(0, y + barHeight / 2, hpText, {
        fontSize: '10px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
        fontStyle: 'bold',
      })
      this.hpText.setOrigin(0.5)
      this.add(this.hpText)
    }
  }

  private createNameText(): void {
    this.nameText = this.scene.add.text(0, -45, this.combatant.name, {
      fontSize: '14px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center',
      fontStyle: 'bold',
    })
    this.nameText.setOrigin(0.5)
    this.add(this.nameText)
  }

  private createStatusIcon(): void {
    this.statusIcon = this.scene.add.text(30, -30, '', {
      fontSize: '16px',
    })
    this.statusIcon.setOrigin(0.5)
    this.add(this.statusIcon)
  }

  private createAmbientParticles(): void {
    const isPlayer = this.combatant.type === 'player'
    const particleColor = isPlayer ? 0x06ffa5 : 0xff0000
    
    this.ambientParticles = this.scene.add.particles(0, 0, 'white', {
      speed: { min: 10, max: 30 },
      scale: { start: 0.2, end: 0 },
      blendMode: 'ADD',
      lifespan: 1000,
      frequency: 500,
      tint: particleColor,
      alpha: { start: 0.5, end: 0 },
      emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 25), quantity: 1 },
    })
    
    this.ambientParticles.startFollow(this)
  }

  private startIdleAnimation(): void {
    // Respiración sutil
    this.scene.tweens.add({
      targets: this.bodySprite,
      scaleY: 1.05,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
    
    // Arma flotante
    this.scene.tweens.add({
      targets: this.weaponSprite,
      y: 3,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
    
    // Brillo de los ojos (solo enemigos)
    if (this.combatant.type === 'enemy') {
      this.scene.tweens.add({
        targets: { alpha: 1 },
        alpha: 0.3,
        duration: 800,
        yoyo: true,
        repeat: -1,
        onUpdate: () => {
          // Redibujar ojos con alpha variable
          // (simplificado - en producción usaríamos sprites separados)
        },
      })
    }
  }

  async moveToGrid(gridX: number, gridY: number): Promise<void> {
    this.isAnimating = true
    
    const worldX = gridX * GRID_CONFIG.TILE_SIZE + GRID_CONFIG.TILE_SIZE / 2
    const worldY = gridY * GRID_CONFIG.TILE_SIZE + GRID_CONFIG.TILE_SIZE / 2
    
    // Trail de movimiento
    const trail = this.scene.add.particles(this.x, this.y, 'white', {
      speed: { min: 20, max: 50 },
      scale: { start: 0.3, end: 0 },
      blendMode: 'ADD',
      lifespan: 500,
      tint: this.combatant.type === 'player' ? 0x3a7ca5 : 0xd62828,
      follow: this,
      quantity: 2,
      frequency: 50,
    })
    
    return new Promise((resolve) => {
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
          trail.stop()
          setTimeout(() => trail.destroy(), 500)
          resolve()
        },
      })
      
      // Salto durante el movimiento
      this.scene.tweens.add({
        targets: [this.bodySprite, this.weaponSprite, this.shieldSprite, this.nameText, this.healthBar],
        y: '-=20',
        duration: ANIMATION_CONFIG.MOVE_DURATION / 2,
        yoyo: true,
        ease: 'Quad.easeOut',
      })
      
      // Rotación del arma
      this.scene.tweens.add({
        targets: this.weaponSprite,
        angle: 360,
        duration: ANIMATION_CONFIG.MOVE_DURATION,
        ease: 'Linear',
      })
    })
  }

  async playAttackAnimation(targetX: number, targetY: number): Promise<void> {
    this.isAnimating = true
    
    const originalX = this.x
    const originalY = this.y
    const targetWorldX = targetX * GRID_CONFIG.TILE_SIZE + GRID_CONFIG.TILE_SIZE / 2
    const targetWorldY = targetY * GRID_CONFIG.TILE_SIZE + GRID_CONFIG.TILE_SIZE / 2
    
    const dx = targetWorldX - originalX
    const dy = targetWorldY - originalY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const moveDistance = Math.min(distance * 0.4, 50)
    const moveX = originalX + (dx / distance) * moveDistance
    const moveY = originalY + (dy / distance) * moveDistance
    
    // Efectos de preparación
    const chargeParticles = this.scene.add.particles(this.x, this.y, 'white', {
      speed: { min: -50, max: -20 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 300,
      tint: 0xffaa00,
      quantity: 10,
    })
    
    return new Promise((resolve) => {
      // Fase 1: Preparación
      this.scene.tweens.add({
        targets: this,
        x: originalX - (dx / distance) * 10,
        y: originalY - (dy / distance) * 10,
        duration: 150,
        ease: 'Back.easeIn',
        onComplete: () => {
          chargeParticles.stop()
          
          // Fase 2: Ataque rápido
          this.scene.tweens.add({
            targets: this,
            x: moveX,
            y: moveY,
            duration: 200,
            ease: 'Power3.easeOut',
            yoyo: true,
            onComplete: () => {
              this.isAnimating = false
              setTimeout(() => chargeParticles.destroy(), 500)
              resolve()
            },
          })
          
          // Slash visual del arma
          this.scene.tweens.add({
            targets: this.weaponSprite,
            angle: 180,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 200,
            yoyo: true,
            ease: 'Power2',
          })
        },
      })
    })
  }

  async playDamageAnimation(damage: number): Promise<void> {
    // Flash rojo intenso
    const overlay = this.scene.add.graphics()
    overlay.fillStyle(0xff0000, 0.7)
    overlay.fillCircle(0, 0, 40)
    this.add(overlay)
    
    this.scene.tweens.add({
      targets: overlay,
      alpha: 0,
      duration: 300,
      onComplete: () => overlay.destroy(),
    })
    
    // Shake violento
    const originalX = this.x
    const shakeIntensity = 8
    
    for (let i = 0; i < 5; i++) {
      this.scene.tweens.add({
        targets: this,
        x: originalX + (i % 2 === 0 ? shakeIntensity : -shakeIntensity),
        duration: 40,
        delay: i * 40,
        onComplete: () => {
          if (i === 4) this.x = originalX
        },
      })
    }
    
    // Texto flotante de daño mejorado
    const damageText = this.scene.add.text(0, -30, `-${damage}`, {
      fontSize: '24px',
      color: '#ff0000',
      stroke: '#000000',
      strokeThickness: 5,
      fontStyle: 'bold',
    })
    damageText.setOrigin(0.5)
    this.add(damageText)
    
    // Partículas de sangre/impacto
    const impactParticles = this.scene.add.particles(0, 0, 'white', {
      speed: { min: 100, max: 200 },
      scale: { start: 0.6, end: 0 },
      blendMode: 'NORMAL',
      lifespan: 400,
      tint: 0xff0000,
      quantity: 15,
    })
    impactParticles.explode(15, 0, 0)
    
    this.scene.tweens.add({
      targets: damageText,
      y: -70,
      alpha: 0,
      scale: 1.5,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        damageText.destroy()
        impactParticles.destroy()
      },
    })
  }

  updateCombatant(combatant: Combatant): void {
    this.combatant = combatant
    this.updateHealthBar()
    
    // Actualizar icono de estado
    if (combatant.conditions.length > 0) {
      this.statusIcon.setText('🔥') // Ejemplo: condición de quemadura
    } else {
      this.statusIcon.setText('')
    }
    
    if (combatant.isDead) {
      this.playDeathAnimation()
    }
  }

  private async playDeathAnimation(): Promise<void> {
    // Desactivar partículas ambientales
    if (this.ambientParticles) {
      this.ambientParticles.stop()
    }
    
    // Explosión de partículas
    const deathParticles = this.scene.add.particles(this.x, this.y, 'white', {
      speed: { min: 50, max: 150 },
      scale: { start: 0.8, end: 0 },
      blendMode: 'ADD',
      lifespan: 800,
      tint: this.combatant.type === 'player' ? 0x3a7ca5 : 0xff0000,
      quantity: 30,
    })
    deathParticles.explode(30, this.x, this.y)
    
    // Caída y desvanecimiento
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      y: this.y + 20,
      scaleX: 0.5,
      scaleY: 0.5,
      angle: this.combatant.type === 'player' ? -90 : 90,
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        this.setVisible(false)
        setTimeout(() => deathParticles.destroy(), 1000)
      },
    })
  }

  highlight(enabled: boolean): void {
    if (enabled) {
      this.setScale(1.15)
      this.setDepth(25)
      
      // Glow effect
      const glow = this.scene.add.graphics()
      glow.lineStyle(4, 0xffaa00, 0.8)
      glow.strokeCircle(0, 0, 35)
      this.addAt(glow, 0)
      
      this.scene.tweens.add({
        targets: glow,
        alpha: 0.3,
        duration: 600,
        yoyo: true,
        repeat: -1,
      })
    } else {
      this.setScale(1)
      this.setDepth(10)
      
      // Remove glow
      const glow = this.getAt(0)
      if (glow instanceof Phaser.GameObjects.Graphics) {
        this.scene.tweens.killTweensOf(glow)
        glow.destroy()
      }
    }
  }

  getGridPosition(): { x: number; y: number } {
    return { x: this.gridX, y: this.gridY }
  }

  getCombatant(): Combatant {
    return this.combatant
  }

  destroy(fromScene?: boolean): void {
    if (this.ambientParticles) {
      this.ambientParticles.destroy()
    }
    super.destroy(fromScene)
  }
}
