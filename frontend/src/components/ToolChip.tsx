import { useState } from 'react'
import { ChevronDown, BookOpen, Cpu } from 'lucide-react'

interface ToolChipProps {
  tool: string
  detail: string
}

const TOOL_CONFIG: Record<string, { icon: typeof BookOpen; color: string; bg: string }> = {
  books: { icon: BookOpen, color: 'text-[var(--accent)]', bg: 'bg-[var(--accent-subtle)]' },
  stockfish: { icon: Cpu, color: 'text-[var(--success)]', bg: 'bg-[var(--success-subtle)]' },
}

export default function ToolChip({ tool, detail }: ToolChipProps) {
  const [expanded, setExpanded] = useState(false)
  const config = TOOL_CONFIG[tool] || {
    icon: Cpu,
    color: 'text-[var(--text-secondary)]',
    bg: 'bg-[var(--bg-elevated)]',
  }
  const Icon = config.icon

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-3 py-2 bg-[var(--bg-sidebar)] hover:bg-[var(--bg-elevated)] transition-colors duration-fast"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center ${config.bg}`}
            aria-hidden="true"
          >
            <Icon size={11} strokeWidth={2} className={config.color} />
          </div>
          <span className="text-[12px] font-medium text-[var(--text-secondary)]">
            {tool}
          </span>
          <span className="text-[10px] text-[var(--text-muted)]" aria-hidden="true">·</span>
          <span className="text-[11px] text-[var(--text-muted)] truncate max-w-[240px]">
            {expanded ? '' : detail.length > 40 ? detail.slice(0, 40) + '…' : detail}
          </span>
        </div>
        <ChevronDown
          size={12}
          strokeWidth={1.5}
          className={`text-[var(--text-muted)] transition-transform duration-fast shrink-0 ${
            expanded ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>
      {expanded && (
        <div className="px-3 py-2.5 bg-[var(--bg-input)] border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] font-mono leading-relaxed">
          {detail}
        </div>
      )}
    </div>
  )
}
