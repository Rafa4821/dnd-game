import type { CampaignNode } from '@/types/campaign'
import { Book, Swords, CheckCircle, MessageCircle, Moon } from 'lucide-react'
import { DecisionNode } from './DecisionNode'
import { CheckNode } from './CheckNode'
import { CombatNode } from './CombatNode'

interface NodeDisplayProps {
  node: CampaignNode
  onContinue?: () => void
  onDecision?: (optionId: string) => void
  onCheck?: (success: boolean) => void
  onCombatEnd?: () => void
}

const NODE_ICONS = {
  narrative: Book,
  decision: MessageCircle,
  check: CheckCircle,
  combat: Swords,
  rest: Moon,
}

export function NodeDisplay({ 
  node, 
  onContinue, 
  onDecision,
  onCheck,
  onCombatEnd 
}: NodeDisplayProps) {
  const Icon = NODE_ICONS[node.type]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl sm:text-2xl font-bold">{node.title}</h2>
            <span className="px-2 py-1 text-xs bg-secondary rounded">
              Acto {node.act}
            </span>
          </div>
          {node.location && (
            <p className="text-sm text-gray-300 font-medium">
              📍 {node.location}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="prose prose-invert max-w-none">
        <div className="p-4 sm:p-6 bg-card border-2 border-border rounded-lg whitespace-pre-wrap shadow-lg">
          <p className="text-base leading-relaxed text-gray-200">
            {node.description}
          </p>
        </div>
      </div>

      {/* Node-specific content */}
      {node.type === 'narrative' && (
        <div className="flex justify-end">
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Continuar →
          </button>
        </div>
      )}

      {node.type === 'decision' && node.options && (
        <DecisionNode options={node.options} onSelect={onDecision} />
      )}

      {node.type === 'check' && node.check && (
        <CheckNode check={node.check} onResult={onCheck} />
      )}

      {node.type === 'combat' && onCombatEnd && (
        <CombatNode encounterId={node.encounterId!} onCombatEnd={onCombatEnd} />
      )}
    </div>
  )
}
