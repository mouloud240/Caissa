import { useState, useEffect } from 'react'
import { GetPersona, SavePersona, GetSettings, SaveSettings } from '../../wailsjs/go/main/App'
import { Settings, FileText } from 'lucide-react'

type SettingsTab = 'general' | 'persona'

interface Settings {
  notifications: boolean
  modelMode: string
  theme: string
}

const TABS: { id: SettingsTab; label: string; icon: typeof Settings }[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'persona', label: 'Persona (SOUL.md)', icon: FileText },
]

export default function SettingsScreen() {
  const [tab, setTab] = useState<SettingsTab>('general')
  const [persona, setPersona] = useState('')
  const [personaSaved, setPersonaSaved] = useState(false)
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    GetPersona().then(setPersona).catch(console.error)
    GetSettings().then(setSettings).catch(console.error)
  }, [])

  async function handleSavePersona() {
    try {
      await SavePersona(persona)
      setPersonaSaved(true)
      setTimeout(() => setPersonaSaved(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleResetPersona() {
    const defaultPersona = `# Caissa Identity Core

NAME: Caissa
VOICE: Encouraging, tactical, witty
ROLE: AI Chess Second & Analyst

## Behavioral Directives
- Use chess terminology naturally
- Focus on psychological aspects of the user's game
- If a move is a 'blunder', call it out but explain why
- Reference classical games when relevant
`
    setPersona(defaultPersona)
  }

  async function handleToggleSetting(key: keyof Settings) {
    if (!settings) return
    const updated = { ...settings, [key]: !settings[key] }
    setSettings(updated)
    await SaveSettings(updated)
  }

  return (
    <div className="flex h-full">
      {/* Tab sidebar */}
      <aside className="w-48 border-r border-[var(--border-subtle)] bg-[var(--bg-sidebar)] p-1.5 space-y-px shrink-0">
        {TABS.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                tab === t.id
                  ? 'bg-[var(--bg-elevated)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              <Icon size={13} strokeWidth={1.5} />
              <span>{t.label}</span>
            </button>
          )
        })}
      </aside>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        {tab === 'general' && settings && (
          <div className="space-y-8 max-w-xl">
            <h2 className="text-lg font-medium">General Settings</h2>
            <div className="space-y-1">
              <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
                <div>
                  <p className="text-[13px] font-medium">Desktop Notifications</p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Notify when analysis is ready
                  </p>
                </div>
                <button
                  onClick={() => handleToggleSetting('notifications')}
                  className={`w-9 h-5 rounded-full relative transition-colors ${
                    settings.notifications ? 'bg-[#f59e0b]' : 'bg-neutral-700'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all ${
                      settings.notifications ? 'left-[18px]' : 'left-[3px]'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
                <div>
                  <p className="text-[13px] font-medium">Model Mode</p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {settings.modelMode === 'fast'
                      ? 'Prioritize speed and cost'
                      : 'Prioritize quality'}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    const updated = {
                      ...settings,
                      modelMode: settings.modelMode === 'fast' ? 'quality' : 'fast',
                    }
                    setSettings(updated)
                    await SaveSettings(updated)
                  }}
                  className={`px-2.5 py-1 rounded-md text-[9px] font-bold transition-colors ${
                    settings.modelMode === 'fast'
                      ? 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20'
                      : 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20'
                  }`}
                >
                  {settings.modelMode === 'fast' ? 'FAST' : 'QUALITY'}
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'persona' && (
          <div className="space-y-5 h-full flex flex-col max-w-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">soul.md</h2>
              <div className="flex gap-1.5">
                <button
                  onClick={handleResetPersona}
                  className="px-2.5 py-1 rounded-md border border-[#333] text-[9px] font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
                >
                  RESET
                </button>
                <button
                  onClick={handleSavePersona}
                  className={`px-2.5 py-1 rounded-md text-[9px] font-bold transition-colors ${
                    personaSaved
                      ? 'bg-[#22c55e] text-white'
                      : 'bg-[#f59e0b] text-black hover:bg-[#d97706]'
                  }`}
                >
                  {personaSaved ? 'SAVED ✓' : 'SAVE'}
                </button>
              </div>
            </div>
            <div className="flex-1 border border-[var(--border-subtle)] rounded-xl overflow-hidden flex flex-col">
              <textarea
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="flex-1 p-5 resize-none focus:outline-none bg-[#090909] text-[#d4d4d4] text-[13px] leading-relaxed"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
