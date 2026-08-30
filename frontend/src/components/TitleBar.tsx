import { ChessKnight } from 'lucide-react'

export default function TitleBar() {
  return (
    <header
      className="h-[44px] flex items-center px-4 bg-[var(--bg-sidebar)] border-b border-[var(--border-subtle)] shrink-0 select-none"
      role="toolbar"
      aria-label="Window controls"
    >
      <div className="flex items-center gap-6">
        <div className="flex gap-2" role="presentation">
          <div className="w-[12px] h-[12px] rounded-full bg-[#ff5f57]" aria-hidden="true" />
          <div className="w-[12px] h-[12px] rounded-full bg-[#febc2e]" aria-hidden="true" />
          <div className="w-[12px] h-[12px] rounded-full bg-[#28c840]" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-2">
          <ChessKnight size={14} strokeWidth={1.5} className="text-[var(--accent)]" aria-hidden="true" />
          <span className="text-[12px] font-medium tracking-tight text-[var(--text-secondary)]">
            Caissa
          </span>
        </div>
      </div>
    </header>
  )
}
