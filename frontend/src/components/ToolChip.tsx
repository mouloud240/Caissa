import { useState } from 'react'

interface ToolChipProps {
  tool: string
  detail: string
}

export default function ToolChip({ tool, detail }: ToolChipProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-4 py-2 bg-[#171717] hover:bg-[#202020] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-[#a3a3a3]">
            {tool}...
          </span>
        </div>
        <span
          className="text-[#a3a3a3] text-[10px] transition-transform"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </button>
      {expanded && (
        <div className="p-4 bg-[#090909] text-[11px] text-neutral-500 font-mono">
          {detail}
        </div>
      )}
    </div>
  )
}
