import { MessageSquare, Settings, Plus } from 'lucide-react'

type Screen = 'chat' | 'settings'

interface SidebarProps {
  activeScreen: Screen
  onNavigate: (screen: Screen) => void
}

const navItems: { id: Screen; label: string; icon: typeof MessageSquare }[] = [
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const sessions = [
  { id: '1', title: 'Fried Liver Analysis' },
  { id: '2', title: 'London System Prep' },
  { id: '3', title: 'Endgame Review' },
]

export default function Sidebar({ activeScreen, onNavigate }: SidebarProps) {
  return (
    <aside className="w-52 bg-[#171717] border-r border-[#262626] flex flex-col shrink-0">
      <nav className="p-1.5 space-y-px">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeScreen === item.id
                  ? 'bg-[#262626] text-white'
                  : 'text-[#a3a3a3] hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={14} strokeWidth={1.5} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="flex-1 overflow-y-auto px-1.5 py-3">
        <div className="flex items-center justify-between px-2 mb-1.5">
          <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
            Sessions
          </p>
          <button className="text-[#a3a3a3] hover:text-white transition-colors">
            <Plus size={12} strokeWidth={1.5} />
          </button>
        </div>
        <div className="space-y-px">
          {sessions.map((s) => (
            <button
              key={s.id}
              className="w-full text-left px-2.5 py-1.5 rounded-md text-[11px] text-[#a3a3a3] hover:bg-white/5 hover:text-white transition-colors truncate"
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <div className="p-2 border-t border-[#262626]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#f59e0b]/10 flex items-center justify-center text-[9px] font-bold text-[#f59e0b]">
            M
          </div>
          <div>
            <p className="text-[10px] font-medium text-white leading-tight">Magnus_Fan</p>
            <p className="text-[9px] text-[#a3a3a3]">2140 Blitz</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
