import Phaser from 'phaser'
import { GRID_CONFIG } from '../config'

export class EffectsSystem {
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  createProjectile(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    type: 'arrow' | 'magic' | 'axe' = 'arrow'
  ): Promise<void> {
    return new Promise((resolve) => {
      const projectile = this.scene.add.graphics()
      
      switch (type) {
        case 'arrow':
          projectile.fillStyle(0xffaa00, 1)
          projectile.fillCircle(0, 0, 4)
          projectile.lineStyle(2, 0x8b4513, 1)
          projectile.lineBetween(-8, 0, 0, 0)
          break
        case 'magic':
          projectile.fillStyle(0x9d4edd, 1)
          projectile.fillCircle(0, 0, 8)
          projectile.lineStyle(3, 0xff006e, 0.8)
          projectile.strokeCircle(0, 0, 12)
          break
        case 'axe':
          projectile.fillStyle(0x606060, 1)
          projectile.fillRect(-6, -6, 12, 12)
          break
      }
      
      projectile.setPosition(startX, startY)
      projectile.setDepth(15)
      
      // Trail de partículas
      const particles = this.scene.add.particles(0, 0, 'white', {
        speed: { min: -50, max: 50 },
        scale: { start: 0.3, end: 0 },
        blendMode: 'ADD',
        lifespan: 300,
        tint: type === 'magic' ? 0x9d4edd : 0xffaa00,
      })
      
      particles.startFollow(projectile)
      
      // Calcular ángulo
      const angle = Phaser.Math.Angle.Between(startX, startY, endX, endY)
      projectile.setRotation(angle)
      
      this.scene.tweens.add({
        targets: projectile,
        x: endX,
        y: endY,
        duration: 300,
        ease: 'Power2',
        onComplete: () => {
          this.createImpactEffect(endX, endY, type)
          projectile.destroy()
          particles.destroy()
          resolve()
        },
      })
      
      // Rotación para el hacha
      if (type === 'axe') {
        this.scene.tweens.add({
          targets: projectile,
          angle: 360,
          duration: 300,
          ease: 'Linear',
        })
      }
    })
  }

  private createImpactEffect(x: number, y: number, type: string): void {
    const particles = this.scene.add.particles(x, y, 'white', {
      speed: { min: 100, max: 200 },
      scale: { start: 0.6, end: 0 },
      blendMode: 'ADD',
      lifespan: 400,
      quantity: type === 'magic' ? 20 : 10,
      tint: type === 'magic' ? [0x9d4edd, 0xff006e, 0x3a0ca3] : [0xff0000, 0xffaa00, 0xffffff],
    })
    
    this.scene.time.delayedCall(400, () => particles.destroy())
    
    // Flash de impacto
    const flash = this.scene.add.graphics()
    flash.fillStyle(0xffffff, 0.8)
    flash.fillCircle(x, y, 20)
    flash.setDepth(16)
    
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      scaleX: 2,
      scaleY: 2,
      duration: 200,
      onComplete: () => flash.destroy(),
    })
  }

  createAOEEffect(centerX: number, centerY: number, radius: number, color: number = 0xff6b6b): Promise<void> {
    return new Promise((resolve) => {
      const aoe = this.scene.add.graphics()
      aoe.setPosition(centerX, centerY)
      aoe.setDepth(5)
      aoe.setAlpha(0)
      
      // Círculo de advertencia
      this.scene.tweens.add({
        targets: aoe,
        alpha: 0.5,
        duration: 500,
        yoyo: true,
        repeat: 1,
      })
      
      // Dibuja círculo que crece
      let currentRadius = 0
      const tween = this.scene.tweens.add({
        targets: { r: currentRadius },
        r: radius,
        duration: 1000,
        ease: 'Power2',
        onUpdate: (tween) => {
          const r = tween.targets[0] as { r: number }
          aoe.clear()
          aoe.fillStyle(color, 0.3)
          aoe.fillCircle(0, 0, r.r)
          aoe.lineStyle(3, color, 0.8)
          aoe.strokeCircle(0, 0, r.r)
        },
        onComplete: () => {
          // Explosión de partículas
          const particles = this.scene.add.particles(centerX, centerY, 'white', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.8, end: 0 },
            blendMode: 'ADD',
            lifespan: 600,
            quantity: 30,
            tint: [color, 0xffffff],
            emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, radius), quantity: 30 },
          })
          
          this.scene.time.delayedCall(600, () => {
            particles.destroy()
            aoe.destroy()
            resolve()
          })
        },
      })
    })
  }

  createHealEffect(x: number, y: number): void {
    const particles = this.scene.add.particles(x, y, 'white', {
      speed: { min: 20, max: 60 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 800,
      gravityY: -50,
      tint: [0x06ffa5, 0x90ee90, 0x00ff00],
      quantity: 2,
      frequency: 50,
    })
    
    this.scene.time.delayedCall(1000, () => particles.destroy())
    
    // Texto flotante
    const healText = this.scene.add.text(x, y - 30, '+HP', {
      fontSize: '18px',
      color: '#00ff00',
      stroke: '#000000',
      strokeThickness: 4,
      fontStyle: 'bold',
    })
    healText.setOrigin(0.5)
    
    this.scene.tweens.add({
      targets: healText,
      y: y - 70,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => healText.destroy(),
    })
  }

  createBuffEffect(x: number, y: number, type: 'attack' | 'defense'): void {
    const color = type === 'attack' ? 0xff0000 : 0x3a7ca5
    
    // Anillo que crece
    const ring = this.scene.add.graphics()
    ring.setPosition(x, y)
    ring.setDepth(15)
    
    this.scene.tweens.add({
      targets: { r: 10 },
      r: 40,
      duration: 500,
      ease: 'Power2',
      onUpdate: (tween) => {
        const r = tween.targets[0] as { r: number }
        ring.clear()
        ring.lineStyle(3, color, 1 - (r.r / 40))
        ring.strokeCircle(0, 0, r.r)
      },
      onComplete: () => ring.destroy(),
    })
    
    // Partículas ascendentes
    const particles = this.scene.add.particles(x, y, 'white', {
      speed: { min: 30, max: 60 },
      scale: { start: 0.4, end: 0 },
      blendMode: 'ADD',
      lifespan: 1000,
      gravityY: -100,
      tint: color,
      quantity: 1,
      frequency: 100,
    })
    
    this.scene.time.delayedCall(1000, () => particles.destroy())
  }

  createSelectionIndicator(x: number, y: number): Phaser.GameObjects.Graphics {
    const indicator = this.scene.add.graphics()
    const { TILE_SIZE } = GRID_CONFIG
    
    indicator.setPosition(x * TILE_SIZE, y * TILE_SIZE)
    indicator.setDepth(8)
    
    const drawIndicator = (alpha: number) => {
      indicator.clear()
      indicator.lineStyle(3, 0xf77f00, alpha)
      indicator.strokeRect(2, 2, TILE_SIZE - 4, TILE_SIZE - 4)
      
      // Esquinas destacadas
      const corner = 10
      indicator.lineStyle(4, 0xffffff, alpha)
      indicator.moveTo(2, 2)
      indicator.lineTo(2 + corner, 2)
      indicator.moveTo(2, 2)
      indicator.lineTo(2, 2 + corner)
      
      indicator.moveTo(TILE_SIZE - 2, 2)
      indicator.lineTo(TILE_SIZE - 2 - corner, 2)
      indicator.moveTo(TILE_SIZE - 2, 2)
      indicator.lineTo(TILE_SIZE - 2, 2 + corner)
      
      indicator.strokePath()
    }
    
    drawIndicator(1)
    
    // Animación de pulso
    this.scene.tweens.add({
      targets: { alpha: 1 },
      alpha: 0.3,
      duration: 600,
      yoyo: true,
      repeat: -1,
      onUpdate: (tween) => {
        const alpha = (tween.targets[0] as { alpha: number }).alpha
        drawIndicator(alpha)
      },
    })
    
    return indicator
  }

  screenShake(intensity: number = 10, duration: number = 200): void {
    this.scene.cameras.main.shake(duration, intensity / 1000)
  }

  flashScreen(color: number = 0xffffff, duration: number = 100): void {
    this.scene.cameras.main.flash(duration, ...this.hexToRgb(color))
  }

  private hexToRgb(hex: number): [number, number, number] {
    return [
      (hex >> 16) & 255,
      (hex >> 8) & 255,
      hex & 255,
    ]
  }
}
