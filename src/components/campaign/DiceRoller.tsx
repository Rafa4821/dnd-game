import { useState } from 'react'
import { Dices, Plus, Minus, Sparkles } from 'lucide-react'

type DiceType = 4 | 6 | 8 | 10 | 12 | 20 | 100

interface DiceResult {
  id: string
  type: DiceType
  roll: number
  timestamp: number
}

export function DiceRoller() {
  const [results, setResults] = useState<DiceResult[]>([])
  const [modifier, setModifier] = useState(0)
  const [rolling, setRolling] = useState(false)

  const rollDice = (type: DiceType) => {
    setRolling(true)
    
    setTimeout(() => {
      const roll = Math.floor(Math.random() * type) + 1
      const newResult: DiceResult = {
        id: Date.now().toString(),
        type,
        roll,
        timestamp: Date.now(),
      }
      
      setResults(prev => [newResult, ...prev].slice(0, 10))
      setRolling(false)
    }, 300)
  }

  const diceTypes: DiceType[] = [4, 6, 8, 10, 12, 20, 100]
  const lastResult = results[0]
  const total = lastResult ? lastResult.roll + modifier : 0

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-40 transition duration-300" />
      <div className="relative bg-slate-900/95 backdrop-blur-sm border-2 border-purple-900/50 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-3 sm:p-4 md:p-5 bg-gradient-to-r from-purple-950/50 to-pink-950/30 border-b border-purple-900/30">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-lg rounded-full" />
              <Dices className={`relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-400 ${rolling ? 'animate-spin' : ''}`} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Dados</h3>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4">
          {/* Result Display */}
          {lastResult && (
            <div className="relative group/result">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-20 group-hover/result:opacity-30 transition" />
              <div className="relative p-3 sm:p-4 bg-slate-800/80 backdrop-blur-sm border-2 border-green-900/50 rounded-xl text-center">
                <div className="text-xs sm:text-sm text-green-300 font-bold mb-1">Último resultado</div>
                <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                  <div className="text-3xl sm:text-4xl font-bold text-white">{lastResult.roll}</div>
                  {modifier !== 0 && (
                    <>
                      <span className="text-xl sm:text-2xl text-gray-400">{modifier > 0 ? '+' : ''}{modifier}</span>
                      <span className="text-xl sm:text-2xl text-gray-400">=</span>
                      <div className="text-3xl sm:text-4xl font-bold text-green-400">{total}</div>
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1 sm:mt-2">d{lastResult.type}</div>
              </div>
            </div>
          )}

          {/* Modifier */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-bold text-purple-300">Modificador:</span>
            <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
              <button
                onClick={() => setModifier(prev => prev - 1)}
                className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-all"
              >
                <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
              </button>
              <div className="flex-1 text-center">
                <span className="text-xl sm:text-2xl font-bold text-white">{modifier > 0 ? '+' : ''}{modifier}</span>
              </div>
              <button
                onClick={() => setModifier(prev => prev + 1)}
                className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-all"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
              </button>
            </div>
          </div>

          {/* Dice Buttons */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {diceTypes.map((type) => (
              <button
                key={type}
                onClick={() => rollDice(type)}
                disabled={rolling}
                className="relative group/dice p-2 sm:p-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20 hover:from-purple-600/40 hover:to-pink-600/40 border-2 border-purple-500/30 hover:border-purple-500/60 rounded-lg sm:rounded-xl transition-all disabled:opacity-50"
              >
                <div className="absolute -inset-0.5 bg-purple-500 rounded-lg sm:rounded-xl blur opacity-0 group-hover/dice:opacity-20 transition" />
                <div className="relative text-center">
                  <Dices className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-0.5 sm:mb-1 text-purple-400" />
                  <div className="text-xs font-bold text-white">d{type}</div>
                </div>
              </button>
            ))}
          </div>

          {/* History */}
          {results.length > 1 && (
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">Historial</span>
                <button
                  onClick={() => setResults([])}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Limpiar
                </button>
              </div>
              <div className="space-y-1 max-h-24 sm:max-h-32 overflow-y-auto">
                {results.slice(1, 6).map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg text-xs"
                  >
                    <span className="text-gray-400">d{result.type}</span>
                    <span className="font-bold text-white">{result.roll}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Roll */}
          <div className="pt-4 border-t border-slate-700/50">
            <button
              onClick={() => rollDice(20)}
              disabled={rolling}
              className="relative group/d20 w-full"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl blur opacity-50 group-hover/d20:opacity-75 transition" />
              <div className="relative px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-700 rounded-xl flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-white" />
                <span className="font-bold text-white">Tirada Rápida d20</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
