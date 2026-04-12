import type { CampaignNode } from '@/types/campaign'
import { Book, Swords, CheckCircle, MessageCircle, Moon, Puzzle, Users, Sparkles, ChevronRight } from 'lucide-react'
import { DecisionNode } from './DecisionNode'
import { CheckNode } from './CheckNode'
import { CombatNode } from './CombatNode'
import { CooperativePuzzle } from '@/components/puzzle/CooperativePuzzle'
import { ConditionalDialogue } from './ConditionalDialogue'
import { getDialogueConfig } from '@/data/dialogues'

interface NodeDisplayProps {
  node: CampaignNode
  onContinue?: () => void
  onDecision?: (optionId: string) => void
  onCheck?: (success: boolean) => void
  onCombatEnd?: () => void
  onPuzzleComplete?: (success: boolean) => void
  onDialogueComplete?: (nextNodeId: string) => void
}

const NODE_ICONS = {
  narrative: Book,
  decision: MessageCircle,
  check: CheckCircle,
  combat: Swords,
  rest: Moon,
  puzzle: Puzzle,
  dialogue: Users,
}

export function NodeDisplay({ 
  node, 
  onContinue, 
  onDecision,
  onCheck,
  onCombatEnd,
  onPuzzleComplete,
  onDialogueComplete
}: NodeDisplayProps) {
  const Icon = NODE_ICONS[node.type]

  const nodeColors = {
    narrative: { from: 'purple', to: 'pink', icon: 'purple' },
    decision: { from: 'amber', to: 'orange', icon: 'amber' },
    check: { from: 'blue', to: 'cyan', icon: 'blue' },
    combat: { from: 'red', to: 'rose', icon: 'red' },
    rest: { from: 'green', to: 'emerald', icon: 'green' },
    puzzle: { from: 'indigo', to: 'purple', icon: 'indigo' },
    dialogue: { from: 'pink', to: 'rose', icon: 'pink' },
  }

  const colors = nodeColors[node.type]

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <div className="relative group">
        <div className={`absolute -inset-1 bg-gradient-to-r from-${colors.from}-600 to-${colors.to}-600 rounded-3xl blur opacity-30 group-hover:opacity-40 transition duration-500`} />
        <div className="relative bg-slate-900/95 backdrop-blur-sm border-2 border-red-900/50 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className={`p-6 sm:p-8 bg-gradient-to-r from-${colors.from}-950/50 to-${colors.to}-950/30 border-b border-${colors.from}-900/30`}>
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className={`absolute inset-0 bg-${colors.icon}-500/20 blur-xl rounded-full`} />
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br from-${colors.icon}-600/20 to-${colors.icon}-700/20 flex items-center justify-center border-2 border-${colors.icon}-500/40`}>
                  <Icon className={`w-8 h-8 text-${colors.icon}-400`} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">{node.title}</h2>
                  <div className="px-3 py-1 bg-amber-600/20 border border-amber-600/30 rounded-lg">
                    <span className="text-sm font-bold text-amber-300">Acto {node.act}</span>
                  </div>
                </div>
                {node.location && (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <p className="text-base text-purple-300 font-bold">
                      {node.location}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description - Narrative Text */}
          <div className="p-6 sm:p-8">
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-purple-600 rounded-full" />
                <p className="text-lg leading-relaxed text-gray-200 whitespace-pre-wrap pl-4">
                  {node.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Node-specific content */}
      {node.type === 'narrative' && (
        <div className="flex justify-end">
          <div className="relative group/btn">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl blur opacity-75 group-hover/btn:opacity-100 animate-pulse" />
            <button
              onClick={onContinue}
              className="relative px-8 py-4 bg-gradient-to-r from-red-600 to-rose-700 text-white font-bold text-lg rounded-xl hover:from-red-500 hover:to-rose-600 transition-all flex items-center gap-3 shadow-xl shadow-red-900/50 border-2 border-red-400/50"
            >
              Continuar
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {node.type === 'decision' && node.options && (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
          <div className="relative bg-slate-900/80 backdrop-blur-sm border-2 border-amber-900/50 rounded-2xl p-6">
            <DecisionNode options={node.options} onSelect={onDecision} />
          </div>
        </div>
      )}

      {node.type === 'check' && node.check && (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
          <div className="relative bg-slate-900/80 backdrop-blur-sm border-2 border-blue-900/50 rounded-2xl p-6">
            <CheckNode check={node.check} onResult={onCheck} />
          </div>
        </div>
      )}

      {node.type === 'combat' && onCombatEnd && (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl blur opacity-30 group-hover:opacity-40 transition duration-300" />
          <div className="relative bg-slate-900/80 backdrop-blur-sm border-2 border-red-900/50 rounded-2xl p-6">
            <CombatNode encounterId={node.encounterId!} onCombatEnd={onCombatEnd} />
          </div>
        </div>
      )}

      {node.type === 'puzzle' && node.puzzleId && onPuzzleComplete && (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
          <div className="relative bg-slate-900/80 backdrop-blur-sm border-2 border-indigo-900/50 rounded-2xl p-6">
            <CooperativePuzzle
              puzzleId={node.puzzleId}
              sessionId={node.id}
              onComplete={onPuzzleComplete}
            />
          </div>
        </div>
      )}

      {node.type === 'dialogue' && node.dialogueId && onDialogueComplete && (() => {
        const dialogueConfig = getDialogueConfig(node.dialogueId)
        if (!dialogueConfig) return null
        
        return (
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
            <div className="relative bg-slate-900/80 backdrop-blur-sm border-2 border-pink-900/50 rounded-2xl p-6">
              <ConditionalDialogue
                dialogueConfig={dialogueConfig}
                sessionId={node.id}
                onComplete={onDialogueComplete}
              />
            </div>
          </div>
        )
      })()}
    </div>
  )
}
