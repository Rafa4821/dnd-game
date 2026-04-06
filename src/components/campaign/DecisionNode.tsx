import { useState } from 'react'
import type { DecisionOption } from '@/types/campaign'
import { meetsRequirements } from '@/types/campaign'
import { useCampaignStore } from '@/stores/campaignStore'
import { ChevronRight, Lock } from 'lucide-react'

interface DecisionNodeProps {
  options: DecisionOption[]
  onSelect?: (optionId: string) => void
}

export function DecisionNode({ options, onSelect }: DecisionNodeProps) {
  const progress = useCampaignStore((state) => state.progress)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleSelect = (option: DecisionOption) => {
    if (!meetsRequirements(option.requirements, progress?.flags || {})) {
      return
    }
    
    setSelectedOption(option.id)
    if (onSelect) {
      onSelect(option.id)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">¿Qué hacéis?</h3>
      
      <div className="grid gap-3">
        {options.map((option) => {
          const isAvailable = meetsRequirements(option.requirements, progress?.flags || {})
          const isSelected = selectedOption === option.id
          
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              disabled={!isAvailable || selectedOption !== null}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : isAvailable
                  ? 'border-border hover:border-primary hover:bg-accent'
                  : 'border-border/50 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className={`font-medium ${!isAvailable ? 'text-muted-foreground' : ''}`}>
                    {option.text}
                  </p>
                  {!isAvailable && option.requirements && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Lock className="w-4 h-4" />
                      <span>Requiere condiciones especiales</span>
                    </div>
                  )}
                </div>
                
                {isAvailable && !selectedOption && (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
                
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {selectedOption && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Procesando decisión...
          </p>
        </div>
      )}
    </div>
  )
}
