type Screen = 'chat' | 'settings'

interface SidebarProps {
  activeScreen: Screen
  onNavigate: (screen: Screen) => void
}

const navItems: { id: Screen; label: string; icon: string }[] = [
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

const sessions = [
  { id: '1', title: 'Fried Liver Analysis' },
  { id: '2', title: 'London System Prep' },
  { id: '3', title: 'Endgame Review' },
]

export default function Sidebar({ activeScreen, onNavigate }: SidebarProps) {
  return (
    <aside className="w-56 bg-[#171717] border-r border-[#333333] flex flex-col shrink-0">
      {/* Nav */}
      <nav className="p-2 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors ${
              activeScreen === item.id
                ? 'bg-[#262626] text-white'
                : 'text-[#a3a3a3] hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        <p className="px-3 mb-2 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
          Sessions
        </p>
        <div className="space-y-0.5">
          {sessions.map((s) => (
            <button
              key={s.id}
              className="w-full text-left px-3 py-2 rounded text-xs text-[#a3a3a3] hover:bg-white/5 hover:text-white transition-colors truncate"
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* User */}
      <div className="p-3 border-t border-[#333333]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#262626] flex items-center justify-center text-[10px] text-[#a3a3a3]">
            M
          </div>
          <div>
            <p className="text-[11px] font-medium text-white">Magnus_Fan</p>
            <p className="text-[10px] text-[#a3a3a3]">2140 Blitz</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
