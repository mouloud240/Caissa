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

  function handleResetPersona() {
    setPersona(`# Caissa Identity Core

NAME: Caissa
VOICE: Analytical, calm, precise
ROLE: AI Chess Second & Analyst

## Behavioral Directives
- Use chess terminology naturally
- Focus on psychological aspects of the user's game
- If a move is a 'blunder', call it out but explain why
- Reference classical games when relevant
`)
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
      <nav
        className="w-[220px] border-r border-[var(--border-subtle)] bg-[var(--bg-sidebar)] p-2 space-y-0.5 shrink-0"
        aria-label="Settings sections"
      >
        {TABS.map((t) => {
          const Icon = t.icon
          const isActive = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-colors duration-fast ${
                isActive
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
              }`}
            >
              <Icon size={14} strokeWidth={1.5} aria-hidden="true" />
              <span>{t.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Content */}
      <main className="flex-1 p-10 overflow-y-auto custom-scrollbar">
        {tab === 'general' && settings && (
          <div className="space-y-8 max-w-lg">
            <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
              General
            </h2>
            <div className="space-y-0">
              {/* Notifications */}
              <div className="flex items-center justify-between py-4 border-b border-[var(--border-subtle)]">
                <div>
                  <p className="text-[14px] font-medium text-[var(--text-primary)]">
                    Desktop Notifications
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Notify when analysis is ready
                  </p>
                </div>
                <button
                  onClick={() => handleToggleSetting('notifications')}
                  className={`w-[40px] h-[22px] rounded-full relative transition-colors duration-fast ${
                    settings.notifications ? 'bg-[var(--accent)]' : 'bg-[var(--bg-elevated)]'
                  }`}
                  role="switch"
                  aria-checked={settings.notifications}
                  aria-label="Desktop notifications"
                >
                  <div
                    className={`w-[16px] h-[16px] bg-white rounded-full absolute top-[3px] transition-transform duration-fast ${
                      settings.notifications ? 'translate-x-[20px]' : 'translate-x-[3px]'
                    }`}
                  />
                </button>
              </div>

              {/* Model Mode */}
              <div className="flex items-center justify-between py-4 border-b border-[var(--border-subtle)]">
                <div>
                  <p className="text-[14px] font-medium text-[var(--text-primary)]">
                    Model Mode
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    {settings.modelMode === 'fast'
                      ? 'Prioritize speed and cost'
                      : 'Prioritize analysis depth'}
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
                  className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-wide transition-colors duration-fast ${
                    settings.modelMode === 'fast'
                      ? 'bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/15'
                      : 'bg-[var(--accent-red-subtle)] text-[var(--accent-red)] border border-[var(--accent-red)]/15'
                  }`}
                  aria-label={`Model mode: ${settings.modelMode}. Click to switch.`}
                >
                  {settings.modelMode === 'fast' ? 'FAST' : 'DEEP'}
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'persona' && (
          <div className="space-y-5 h-full flex flex-col max-w-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                soul.md
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleResetPersona}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors duration-fast"
                >
                  RESET
                </button>
                <button
                  onClick={handleSavePersona}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors duration-fast ${
                    personaSaved
                      ? 'bg-[var(--success)] text-white'
                      : 'bg-[var(--accent)] text-black hover:bg-[var(--accent-hover)]'
                  }`}
                >
                  {personaSaved ? 'SAVED ✓' : 'SAVE'}
                </button>
              </div>
            </div>
            <div className="flex-1 border border-[var(--border-subtle)] rounded-lg overflow-hidden flex flex-col min-h-[300px]">
              <textarea
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="flex-1 p-5 resize-none focus:outline-none bg-[var(--bg-input)] text-[var(--text-primary)] text-[13px] leading-relaxed placeholder:text-[var(--text-muted)]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                aria-label="SOUL.md editor"
                spellCheck={false}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
