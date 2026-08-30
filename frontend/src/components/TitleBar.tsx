export default function TitleBar() {
  return (
    <header className="h-[38px] flex items-center px-3 bg-[#171717] border-b border-[#333333] shrink-0 select-none">
      <div className="flex items-center gap-6">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium tracking-tight text-[#a3a3a3]">
            Caissa Desktop
          </span>
        </div>
      </div>
    </header>
  )
}
