import { useCampaignStore } from '@/stores/campaignStore'
import { ScrollText, MessageCircle, CheckCircle, Swords, Cog } from 'lucide-react'
import type { LogEntry } from '@/types/campaign'

const LOG_ICONS = {
  narrative: ScrollText,
  decision: MessageCircle,
  check: CheckCircle,
  combat: Swords,
  system: Cog,
}

export function CampaignLog() {
  const progress = useCampaignStore((state) => state.progress)

  if (!progress || progress.logs.length === 0) {
    return (
      <div className="p-6 text-center text-gray-400">
        <ScrollText className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p className="font-medium">No hay entradas en el log aún</p>
      </div>
    )
  }

  // Mostrar últimos 20 logs
  const recentLogs = [...progress.logs].reverse().slice(0, 20)

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {recentLogs.map((log: LogEntry) => {
        const Icon = LOG_ICONS[log.type]
        const date = new Date(log.timestamp)
        
        return (
          <div 
            key={log.id}
            className="p-3 bg-card border border-border rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-all"
          >
            <div className="flex items-start gap-3">
              <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 leading-relaxed">{log.content}</p>
                <p className="text-xs text-gray-500 mt-1 font-mono">
                  {date.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
