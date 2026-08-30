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
    <aside
      className="w-[260px] bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] flex flex-col shrink-0"
      role="navigation"
      aria-label="Main navigation"
    >
      <nav className="p-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeScreen === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-fast ${
                isActive
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
              }`}
            >
              <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="flex-1 overflow-y-auto px-2 py-4 custom-scrollbar">
        <div className="flex items-center justify-between px-2 mb-2">
          <h2 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Sessions
          </h2>
          <button
            className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors duration-fast"
            aria-label="New session"
          >
            <Plus size={14} strokeWidth={1.5} />
          </button>
        </div>
        <ul className="space-y-0.5" role="list">
          {sessions.map((s) => (
            <li key={s.id}>
              <button
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-[12px] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors duration-fast truncate"
              >
                {s.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-3 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] flex items-center justify-center text-[11px] font-bold text-[var(--accent)]"
            aria-hidden="true"
          >
            M
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-[var(--text-primary)] truncate">
              Magnus_Fan
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">2140 Rapid</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
