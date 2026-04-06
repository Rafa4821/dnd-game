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
      <div className="p-6 text-center text-muted-foreground">
        <ScrollText className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No hay entradas en el log aún</p>
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
            className="p-3 bg-muted/30 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <Icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm">{log.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
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
