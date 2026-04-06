import { useState } from 'react'
import { roll, type DiceRoll } from '@/lib/dice'
import { Dices, TrendingUp, TrendingDown, Zap } from 'lucide-react'

interface DiceRollerProps {
  onRoll?: (result: DiceRoll) => void
  defaultFormula?: string
  showHistory?: boolean
}

export function DiceRoller({ 
  onRoll, 
  defaultFormula = '1d20',
  showHistory = true 
}: DiceRollerProps) {
  const [formula, setFormula] = useState(defaultFormula)
  const [history, setHistory] = useState<DiceRoll[]>([])
  const [currentRoll, setCurrentRoll] = useState<DiceRoll | null>(null)
  const [error, setError] = useState('')

  const handleRoll = () => {
    try {
      setError('')
      const result = roll(formula)
      setCurrentRoll(result)
      setHistory(prev => [result, ...prev].slice(0, 10)) // Mantener últimos 10
      
      if (onRoll) {
        onRoll(result)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al tirar')
    }
  }

  const quickRolls = [
    { label: 'd20', formula: '1d20' },
    { label: 'd12', formula: '1d12' },
    { label: 'd10', formula: '1d10' },
    { label: 'd8', formula: '1d8' },
    { label: 'd6', formula: '1d6' },
    { label: 'd4', formula: '1d4' },
  ]

  return (
    <div className="space-y-4">
      {/* Input y botón */}
      <div className="flex gap-2">
        <input
          type="text"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRoll()}
          placeholder="Ej: 1d20+5, 2d6, 1d20adv"
          className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleRoll}
          className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Dices className="w-4 h-4" />
          Tirar
        </button>
      </div>

      {/* Quick rolls */}
      <div className="flex gap-2 flex-wrap">
        {quickRolls.map((qr) => (
          <button
            key={qr.formula}
            onClick={() => {
              setFormula(qr.formula)
              setError('')
            }}
            className="px-3 py-1 text-sm border border-border rounded hover:bg-accent transition-colors"
          >
            {qr.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Resultado actual */}
      {currentRoll && (
        <div className={`p-6 border-2 rounded-lg ${
          currentRoll.criticalHit 
            ? 'border-green-500 bg-green-500/10' 
            : currentRoll.criticalFail
            ? 'border-red-500 bg-red-500/10'
            : 'border-primary bg-primary/5'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground font-mono">
              {currentRoll.formula}
              {currentRoll.advantage === 'advantage' && (
                <TrendingUp className="inline w-4 h-4 ml-2 text-green-500" />
              )}
              {currentRoll.advantage === 'disadvantage' && (
                <TrendingDown className="inline w-4 h-4 ml-2 text-red-500" />
              )}
            </span>
            {currentRoll.criticalHit && (
              <span className="flex items-center gap-1 text-sm font-medium text-green-500">
                <Zap className="w-4 h-4" />
                ¡Crítico!
              </span>
            )}
            {currentRoll.criticalFail && (
              <span className="text-sm font-medium text-red-500">
                Pifia
              </span>
            )}
          </div>
          
          <div className="flex items-baseline gap-3">
            <div className="text-5xl font-bold">{currentRoll.total}</div>
            <div className="text-lg text-muted-foreground">
              {currentRoll.rolls.length > 1 && (
                <span className="font-mono">
                  [{currentRoll.rolls.join(', ')}]
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Historial */}
      {showHistory && history.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Historial</h4>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {history.map((h, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm"
              >
                <span className="font-mono text-muted-foreground">{h.formula}</span>
                <span className="font-bold">{h.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
