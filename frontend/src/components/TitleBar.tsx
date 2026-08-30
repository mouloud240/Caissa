import { ChessKnight } from 'lucide-react'

export default function TitleBar() {
  return (
    <header className="h-[52px] flex items-center px-5 bg-[#171717] border-b border-[#262626] shrink-0 select-none">
      <div className="flex items-center gap-8">
        <div className="flex gap-2.5">
          <div className="w-4 h-4 rounded-full bg-[#ff5f57]" />
          <div className="w-4 h-4 rounded-full bg-[#febc2e]" />
          <div className="w-4 h-4 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-3">
          <ChessKnight size={20} strokeWidth={1.5} className="text-[#f59e0b]" />
          <span className="text-[15px] font-medium tracking-tight text-[#a3a3a3]">
            Caissa
          </span>
        </div>
      </div>
    </header>
  )
}
