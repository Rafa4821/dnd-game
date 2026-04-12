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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Contenedor con efecto 3D */}
      <div className="relative group w-full max-w-5xl h-[95vh]">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-30 group-hover:opacity-40 transition duration-500" />
        <div className="relative w-full h-full bg-slate-900/95 backdrop-blur-sm border-2 border-red-900/50 rounded-3xl shadow-2xl shadow-red-900/30 flex flex-col overflow-hidden">
          {/* Header con steps */}
          <div className="relative border-b border-red-900/30 bg-gradient-to-r from-red-950/50 to-rose-950/30 p-6 sm:p-8 flex-shrink-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600/20 to-rose-700/20 flex items-center justify-center border-2 border-red-500/40">
                  <ChevronRight className="w-8 h-8 text-red-400" />
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Crear Personaje</h2>
            </div>
          
            {/* Progress bar premium */}
            <div className="flex items-center gap-3">
              <div className={`flex-1 h-3 rounded-full transition-all duration-500 relative overflow-hidden ${
                step === 'selection' ? 'bg-gradient-to-r from-red-600 to-rose-700' : 'bg-gradient-to-r from-red-600 to-rose-700'
              }`}>
                {step === 'selection' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                )}
              </div>
              <div className={`flex-1 h-3 rounded-full transition-all duration-500 relative overflow-hidden ${
                step === 'customization' || step === 'review' ? 'bg-gradient-to-r from-purple-600 to-pink-700' : 'bg-slate-700/50'
              }`}>
                {step === 'customization' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                )}
              </div>
              <div className={`flex-1 h-3 rounded-full transition-all duration-500 relative overflow-hidden ${
                step === 'review' ? 'bg-gradient-to-r from-green-600 to-emerald-700' : 'bg-slate-700/50'
              }`}>
                {step === 'review' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                )}
              </div>
            </div>
            
            <div className="flex justify-between mt-3 text-sm sm:text-base">
              <span className={`font-bold transition-colors ${
                step === 'selection' ? 'text-red-300' : 'text-gray-500'
              }`}>
                1. Selección
              </span>
              <span className={`font-bold transition-colors ${
                step === 'customization' ? 'text-purple-300' : 'text-gray-500'
              }`}>
                2. Personalización
              </span>
              <span className={`font-bold transition-colors ${
                step === 'review' ? 'text-green-300' : 'text-gray-500'
              }`}>
                3. Revisión
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 min-h-0">
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
              customizations={customizations || {}}
            />
          )}
          </div>

          {/* Footer con botones */}
          <div className="relative border-t border-red-900/30 bg-slate-900/80 backdrop-blur-sm p-6 flex justify-between">
            <button
              onClick={onCancel}
              className="px-8 py-3 border-2 border-slate-700/50 rounded-xl hover:border-slate-600 hover:bg-slate-800/50 transition-all text-gray-300 font-bold text-lg"
            >
              Cancelar
            </button>
          
          <div className="flex gap-3">
              {step !== 'selection' && (
                <button
                  onClick={handleBack}
                  className="px-8 py-3 border-2 border-purple-500/30 rounded-xl hover:border-purple-500/60 hover:bg-purple-950/30 transition-all text-gray-200 font-bold text-lg flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Atrás
                </button>
              )}
            
              {step !== 'review' ? (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 rounded-xl blur opacity-75 group-hover:opacity-100 animate-pulse" />
                  <button
                    onClick={handleNext}
                    disabled={!selectedPregenId || (step === 'customization' && !characterName.trim())}
                    className="relative px-8 py-3 bg-gradient-to-r from-red-600 to-rose-700 text-white font-bold text-lg rounded-xl hover:from-red-500 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-800 transition-all flex items-center gap-3 shadow-xl shadow-red-900/50 border-2 border-red-400/50 disabled:border-slate-700"
                  >
                    Siguiente
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 rounded-xl blur opacity-75 group-hover:opacity-100 animate-pulse" />
                  <button
                    onClick={handleComplete}
                    className="relative px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold text-lg rounded-xl hover:from-green-500 hover:to-emerald-600 transition-all flex items-center gap-3 shadow-xl shadow-green-900/50 border-2 border-green-400/50"
                  >
                    <Check className="w-5 h-5" />
                    Crear Personaje
                  </button>
                </div>
              )}
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
