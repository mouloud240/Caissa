import { useState } from 'react'
import { ChevronDown, BookOpen, Cpu } from 'lucide-react'

interface ToolChipProps {
  tool: string
  detail: string
}

const TOOL_CONFIG: Record<string, { icon: typeof BookOpen; color: string; bg: string }> = {
  books: { icon: BookOpen, color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/10' },
  stockfish: { icon: Cpu, color: 'text-[#22c55e]', bg: 'bg-[#22c55e]/10' },
}

export default function ToolChip({ tool, detail }: ToolChipProps) {
  const [expanded, setExpanded] = useState(false)
  const config = TOOL_CONFIG[tool] || { icon: Cpu, color: 'text-[var(--text-secondary)]', bg: 'bg-[var(--bg-elevated)]' }
  const Icon = config.icon

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-3 py-2 bg-[var(--bg-sidebar)] hover:bg-[var(--bg-elevated)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded flex items-center justify-center ${config.bg}`}>
            <Icon size={10} strokeWidth={2} className={config.color} />
          </div>
          <span className="text-[11px] font-medium text-[var(--text-secondary)]">
            {tool}
          </span>
          <span className="text-[9px] text-[var(--text-muted)]">•</span>
          <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[200px]">
            {expanded ? '' : detail.slice(0, 40) + (detail.length > 40 ? '...' : '')}
          </span>
        </div>
        <ChevronDown
          size={11}
          strokeWidth={1.5}
          className={`text-[var(--text-muted)] transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      {expanded && (
        <div className="px-3 py-2.5 bg-[#090909] border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-secondary)] font-mono leading-relaxed">
          {detail}
        </div>
      )}
    </div>
  )
}
