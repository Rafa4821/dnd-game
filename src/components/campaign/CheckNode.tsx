import { useState } from 'react'
import type { SkillCheck } from '@/types/campaign'
import { useCharacterStore } from '@/stores/characterStore'
import { rollSkill, type DiceRoll } from '@/lib/dice'
import { Dices, TrendingUp, TrendingDown } from 'lucide-react'

interface CheckNodeProps {
  check: SkillCheck
  onResult?: (success: boolean) => void
}

const SKILL_ABILITIES: Record<string, string> = {
  athletics: 'str',
  acrobatics: 'dex',
  sleight_of_hand: 'dex',
  stealth: 'dex',
  arcana: 'int',
  history: 'int',
  investigation: 'int',
  nature: 'int',
  religion: 'int',
  animal_handling: 'wis',
  insight: 'wis',
  medicine: 'wis',
  perception: 'wis',
  survival: 'wis',
  deception: 'cha',
  intimidation: 'cha',
  performance: 'cha',
  persuasion: 'cha',
}

export function CheckNode({ check, onResult }: CheckNodeProps) {
  const characters = useCharacterStore((state) => state.characters)
  const [rolling, setRolling] = useState(false)
  const [results, setResults] = useState<{ characterId: string; result: DiceRoll; success: boolean }[]>([])
  const [finalResult, setFinalResult] = useState<boolean | null>(null)

  const handleRoll = async () => {
    setRolling(true)
    
    // Simular delay para animación
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const rollResults: { characterId: string; result: DiceRoll; success: boolean }[] = []
    
    // Cada personaje tira
    for (const char of Object.values(characters)) {
      // Calcular modificador
      const ability = SKILL_ABILITIES[check.skill] || 'wis'
      const abilityScore = char.abilities[ability as keyof typeof char.abilities]
      const abilityMod = Math.floor((abilityScore - 10) / 2)
      
      // Verificar si tiene proficiencia en la skill
      const proficient = char.skills.includes(check.skill)
      const modifier = abilityMod + (proficient ? char.proficiencyBonus : 0)
      
      // Roll
      const result = rollSkill(modifier)
      const success = result.total >= check.dc
      
      rollResults.push({
        characterId: char.id,
        result,
        success,
      })
    }
    
    setResults(rollResults)
    
    // Determinar resultado final
    const finalSuccess = check.groupCheck
      ? rollResults.every(r => r.success) // Todos deben pasar
      : rollResults.some(r => r.success)  // Al menos uno debe pasar
    
    setFinalResult(finalSuccess)
    setRolling(false)
    
    if (onResult) {
      // Delay para que el usuario vea el resultado
      setTimeout(() => {
        onResult(finalSuccess)
      }, 2000)
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted/30 border border-border rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold capitalize">
            {check.skill.replace('_', ' ')} Check
          </h3>
          <span className="px-3 py-1 bg-primary/20 text-primary font-bold rounded">
            DC {check.dc}
          </span>
        </div>
        
        {check.groupCheck && (
          <p className="text-sm text-muted-foreground">
            🎯 Check de grupo: Todos deben pasar
          </p>
        )}
      </div>

      {/* Botón de tirada */}
      {results.length === 0 && (
        <button
          onClick={handleRoll}
          disabled={rolling}
          className="w-full py-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {rolling ? (
            <>
              <Dices className="w-5 h-5 animate-spin" />
              Tirando...
            </>
          ) : (
            <>
              <Dices className="w-5 h-5" />
              Tirar {check.skill.replace('_', ' ')}
            </>
          )}
        </button>
      )}

      {/* Resultados */}
      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((r) => {
            const char = characters[r.characterId]
            if (!char) return null
            
            return (
              <div 
                key={r.characterId}
                className={`p-4 border-2 rounded-lg ${
                  r.success 
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-red-500 bg-red-500/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{char.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">{r.result.total}</span>
                    {r.success ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {r.success ? '✓ Éxito' : '✗ Fallo'} (requiere {check.dc})
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Resultado final */}
      {finalResult !== null && (
        <div className={`p-6 border-2 rounded-lg text-center ${
          finalResult
            ? 'border-green-500 bg-green-500/10'
            : 'border-red-500 bg-red-500/10'
        }`}>
          <div className="text-3xl font-bold mb-2">
            {finalResult ? '✓ Éxito del Grupo' : '✗ Fallo del Grupo'}
          </div>
          <p className="text-sm text-muted-foreground">
            {finalResult ? 'El grupo supera el desafío' : 'El grupo no logra superarlo'}
          </p>
        </div>
      )}
    </div>
  )
}
