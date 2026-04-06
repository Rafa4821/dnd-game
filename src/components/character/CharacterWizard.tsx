import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { PregenSelection } from './PregenSelection'
import { CharacterCustomization } from './CharacterCustomization'
import { CharacterReview } from './CharacterReview'

interface CharacterData {
  pregenId: string | null
  name: string
  customizations: Record<string, unknown> | null
}

interface CharacterWizardProps {
  onComplete: (characterData: CharacterData) => void
  onCancel: () => void
}

type WizardStep = 'selection' | 'customization' | 'review'

export function CharacterWizard({ onComplete, onCancel }: CharacterWizardProps) {
  const [step, setStep] = useState<WizardStep>('selection')
  const [selectedPregenId, setSelectedPregenId] = useState<string | null>(null)
  const [characterName, setCharacterName] = useState('')
  const [customizations, setCustomizations] = useState<Record<string, unknown> | null>(null)

  const handlePregenSelect = (pregenId: string) => {
    setSelectedPregenId(pregenId)
  }

  const handleNext = () => {
    if (step === 'selection' && selectedPregenId) {
      setStep('customization')
    } else if (step === 'customization') {
      setStep('review')
    }
  }

  const handleBack = () => {
    if (step === 'customization') {
      setStep('selection')
    } else if (step === 'review') {
      setStep('customization')
    }
  }

  const handleComplete = () => {
    onComplete({
      pregenId: selectedPregenId,
      name: characterName,
      customizations,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[95vh] bg-card border border-border rounded-lg sm:rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header con steps */}
        <div className="border-b border-border bg-card/50 p-4 sm:p-6 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Crear Personaje</h2>
          
          {/* Progress */}
          <div className="flex items-center gap-2">
            <div className={`flex-1 h-2 rounded-full transition-colors ${
              step === 'selection' ? 'bg-primary' : 'bg-primary'
            }`} />
            <div className={`flex-1 h-2 rounded-full transition-colors ${
              step === 'customization' || step === 'review' ? 'bg-primary' : 'bg-muted'
            }`} />
            <div className={`flex-1 h-2 rounded-full transition-colors ${
              step === 'review' ? 'bg-primary' : 'bg-muted'
            }`} />
          </div>
          
          <div className="flex justify-between mt-2 text-sm">
            <span className={step === 'selection' ? 'text-primary font-bold' : 'text-gray-400 font-medium'}>
              1. Selección
            </span>
            <span className={step === 'customization' ? 'text-primary font-bold' : 'text-gray-400 font-medium'}>
              2. Personalización
            </span>
            <span className={step === 'review' ? 'text-primary font-bold' : 'text-gray-400 font-medium'}>
              3. Revisión
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {step === 'selection' && (
            <PregenSelection
              selectedId={selectedPregenId}
              onSelect={handlePregenSelect}
            />
          )}
          
          {step === 'customization' && selectedPregenId && (
            <CharacterCustomization
              pregenId={selectedPregenId}
              name={characterName}
              onNameChange={setCharacterName}
              onCustomizationsChange={setCustomizations}
            />
          )}
          
          {step === 'review' && selectedPregenId && (
            <CharacterReview
              pregenId={selectedPregenId}
              name={characterName}
              customizations={customizations}
            />
          )}
        </div>

        {/* Footer con botones */}
        <div className="border-t border-border bg-card/50 p-6 flex justify-between">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            Cancelar
          </button>
          
          <div className="flex gap-3">
            {step !== 'selection' && (
              <button
                onClick={handleBack}
                className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Atrás
              </button>
            )}
            
            {step !== 'review' ? (
              <button
                onClick={handleNext}
                disabled={!selectedPregenId || (step === 'customization' && !characterName.trim())}
                className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Crear Personaje
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
