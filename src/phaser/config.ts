import Phaser from 'phaser'
import { TacticalCombatScene } from './scenes/TacticalCombatScene'

export const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1200,
  height: 800,
  parent: 'phaser-container',
  backgroundColor: '#1a1a2e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [TacticalCombatScene],
}

export const GRID_CONFIG = {
  TILE_SIZE: 64,
  GRID_WIDTH: 12,
  GRID_HEIGHT: 10,
  TILE_COLORS: {
    WALKABLE: 0x2a4858,
    MOVEMENT_RANGE: 0x3a7ca5,
    ATTACK_RANGE: 0xd62828,
    SELECTED: 0xf77f00,
    PATH: 0x06ffa5,
  },
}

export const ANIMATION_CONFIG = {
  MOVE_DURATION: 400,
  ATTACK_DURATION: 300,
  DAMAGE_DURATION: 200,
  PARTICLE_LIFESPAN: 1000,
}
