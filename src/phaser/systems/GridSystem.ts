import Phaser from 'phaser'
import { GRID_CONFIG } from '../config'

export interface GridCell {
  x: number
  y: number
  worldX: number
  worldY: number
  walkable: boolean
  occupied: boolean
  graphics?: Phaser.GameObjects.Graphics
}

export class GridSystem {
  private grid: GridCell[][] = []
  private gridGraphics: Phaser.GameObjects.Graphics
  private highlightGraphics: Phaser.GameObjects.Graphics

  constructor(_scene: Phaser.Scene, _width: number, _height: number, _tileSize: number) {
    this.gridGraphics = _scene.add.graphics()
    this.highlightGraphics = _scene.add.graphics()
    this.initializeGrid()
    this.drawGrid()
  }

  private initializeGrid(): void {
    const { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT } = GRID_CONFIG

    for (let y = 0; y < GRID_HEIGHT; y++) {
      this.grid[y] = []
      for (let x = 0; x < GRID_WIDTH; x++) {
        this.grid[y][x] = {
          x,
          y,
          worldX: x * TILE_SIZE + TILE_SIZE / 2,
          worldY: y * TILE_SIZE + TILE_SIZE / 2,
          walkable: true,
          occupied: false,
        }
      }
    }
  }

  private drawGrid(): void {
    const { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, TILE_COLORS } = GRID_CONFIG

    this.gridGraphics.clear()
    this.gridGraphics.lineStyle(1, 0x4a5568, 0.3)

    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        // Alternar colores para efecto tablero
        const fillColor = (x + y) % 2 === 0 ? TILE_COLORS.WALKABLE : 0x1e293b
        
        this.gridGraphics.fillStyle(fillColor, 0.8)
        this.gridGraphics.fillRect(
          x * TILE_SIZE,
          y * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE
        )
        this.gridGraphics.strokeRect(
          x * TILE_SIZE,
          y * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE
        )
      }
    }
  }

  getCell(gridX: number, gridY: number): GridCell | null {
    if (gridY >= 0 && gridY < this.grid.length && gridX >= 0 && gridX < this.grid[gridY].length) {
      return this.grid[gridY][gridX]
    }
    return null
  }

  getCellFromWorld(worldX: number, worldY: number): GridCell | null {
    const gridX = Math.floor(worldX / GRID_CONFIG.TILE_SIZE)
    const gridY = Math.floor(worldY / GRID_CONFIG.TILE_SIZE)
    return this.getCell(gridX, gridY)
  }

  highlightMovementRange(centerX: number, centerY: number, range: number): GridCell[] {
    this.clearHighlights()
    const cells: GridCell[] = []

    for (let y = Math.max(0, centerY - range); y <= Math.min(GRID_CONFIG.GRID_HEIGHT - 1, centerY + range); y++) {
      for (let x = Math.max(0, centerX - range); x <= Math.min(GRID_CONFIG.GRID_WIDTH - 1, centerX + range); x++) {
        const distance = Math.abs(x - centerX) + Math.abs(y - centerY)
        if (distance <= range && distance > 0) {
          const cell = this.grid[y][x]
          if (cell.walkable && !cell.occupied) {
            this.highlightCell(x, y, GRID_CONFIG.TILE_COLORS.MOVEMENT_RANGE)
            cells.push(cell)
          }
        }
      }
    }

    return cells
  }

  highlightAttackRange(centerX: number, centerY: number, range: number): GridCell[] {
    this.clearHighlights()
    const cells: GridCell[] = []

    for (let y = Math.max(0, centerY - range); y <= Math.min(GRID_CONFIG.GRID_HEIGHT - 1, centerY + range); y++) {
      for (let x = Math.max(0, centerX - range); x <= Math.min(GRID_CONFIG.GRID_WIDTH - 1, centerX + range); x++) {
        const distance = Math.abs(x - centerX) + Math.abs(y - centerY)
        if (distance <= range && distance > 0) {
          const cell = this.grid[y][x]
          this.highlightCell(x, y, GRID_CONFIG.TILE_COLORS.ATTACK_RANGE, 0.3)
          cells.push(cell)
        }
      }
    }

    return cells
  }

  highlightPath(path: GridCell[]): void {
    path.forEach(_cell => {
      this.highlightCell(_cell.x, _cell.y, GRID_CONFIG.TILE_COLORS.PATH, 0.5)
    })
  }

  private highlightCell(gridX: number, gridY: number, color: number, alpha: number = 0.4): void {
    const { TILE_SIZE } = GRID_CONFIG
    
    this.highlightGraphics.fillStyle(color, alpha)
    this.highlightGraphics.fillRect(
      gridX * TILE_SIZE,
      gridY * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    )
    
    this.highlightGraphics.lineStyle(2, color, 0.8)
    this.highlightGraphics.strokeRect(
      gridX * TILE_SIZE,
      gridY * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    )
  }

  clearHighlights(): void {
    this.highlightGraphics.clear()
  }

  findPath(startX: number, startY: number, endX: number, endY: number): GridCell[] {
    // Implementación simple de A* pathfinding
    const openList: { cell: GridCell; g: number; h: number; f: number; parent: GridCell | null }[] = []
    const closedList: Set<string> = new Set()
    
    const start = this.getCell(startX, startY)!
    const end = this.getCell(endX, endY)!
    
    openList.push({
      cell: start,
      g: 0,
      h: this.heuristic(start, end),
      f: 0,
      parent: null,
    })
    
    while (openList.length > 0) {
      // Obtener nodo con menor f
      openList.sort((a, b) => a.f - b.f)
      const current = openList.shift()!
      
      if (current.cell.x === endX && current.cell.y === endY) {
        return this.reconstructPath(current)
      }
      
      closedList.add(`${current.cell.x},${current.cell.y}`)
      
      // Explorar vecinos
      const neighbors = this.getNeighbors(current.cell.x, current.cell.y)
      
      for (const neighbor of neighbors) {
        const key = `${neighbor.x},${neighbor.y}`
        if (closedList.has(key) || (!neighbor.walkable && !(neighbor.x === endX && neighbor.y === endY))) {
          continue
        }
        
        const g = current.g + 1
        const h = this.heuristic(neighbor, end)
        const f = g + h
        
        const existing = openList.find(n => n.cell.x === neighbor.x && n.cell.y === neighbor.y)
        
        if (!existing) {
          openList.push({ cell: neighbor, g, h, f, parent: current.cell })
        } else if (g < existing.g) {
          existing.g = g
          existing.f = f
          existing.parent = current.cell
        }
      }
    }
    
    return [] // No se encontró camino
  }

  private heuristic(a: GridCell, b: GridCell): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
  }

  private getNeighbors(x: number, y: number): GridCell[] {
    const neighbors: GridCell[] = []
    const directions = [
      { dx: 0, dy: -1 }, // Arriba
      { dx: 1, dy: 0 },  // Derecha
      { dx: 0, dy: 1 },  // Abajo
      { dx: -1, dy: 0 }, // Izquierda
    ]
    
    for (const dir of directions) {
      const cell = this.getCell(x + dir.dx, y + dir.dy)
      if (cell) {
        neighbors.push(cell)
      }
    }
    
    return neighbors
  }

  private reconstructPath(node: { cell: GridCell; parent: GridCell | null }): GridCell[] {
    const path: GridCell[] = []
    let current: { cell: GridCell; parent: GridCell | null } | null = node
    
    while (current && current.parent) {
      path.unshift(current.cell)
      const parent: GridCell = current.parent
      current = { cell: parent, parent: null } // Simplificado para el ejemplo
      
      // En una implementación real, necesitarías rastrear mejor los padres
      if (path.length > 100) break // Prevenir loops infinitos
    }
    
    return path
  }

  setOccupied(gridX: number, gridY: number, occupied: boolean): void {
    const cell = this.getCell(gridX, gridY)
    if (cell) {
      cell.occupied = occupied
    }
  }

  destroy(): void {
    this.gridGraphics.destroy()
    this.highlightGraphics.destroy()
  }
}
