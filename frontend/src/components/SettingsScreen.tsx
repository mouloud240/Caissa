import { useState, useEffect } from 'react'
import { GetPersona, SavePersona, GetSettings, SaveSettings } from '../../wailsjs/go/main/App'

type SettingsTab = 'general' | 'persona'

interface Settings {
  notifications: boolean
  modelMode: string
  theme: string
}

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'persona', label: 'Persona (SOUL.md)' },
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
      <aside className="w-56 border-r border-[#262626] bg-[#111111] p-2 space-y-0.5 shrink-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-all ${
              tab === t.id
                ? 'bg-[#262626] text-white'
                : 'text-[#a3a3a3] hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </aside>

      {/* Content */}
      <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
        {tab === 'general' && settings && (
          <div className="space-y-12">
            <h2 className="text-xl font-medium">General Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-[#262626]">
                <div>
                  <p className="text-sm font-medium">Desktop Notifications</p>
                  <p className="text-xs text-neutral-500">
                    Notify when analysis is ready
                  </p>
                </div>
                <button
                  onClick={() => handleToggleSetting('notifications')}
                  className={`w-10 h-5 rounded-full relative transition-colors ${
                    settings.notifications ? 'bg-[#f59e0b]' : 'bg-neutral-700'
                  }`}
                >
                  <div
                    className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${
                      settings.notifications ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-[#262626]">
                <div>
                  <p className="text-sm font-medium">Model Mode</p>
                  <p className="text-xs text-neutral-500">
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
                  className="px-3 py-1 rounded border border-[#404040] text-[10px] font-bold text-neutral-400 hover:bg-[#262626]"
                >
                  {settings.modelMode === 'fast' ? 'FAST' : 'QUALITY'}
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'persona' && (
          <div className="space-y-8 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">soul.md</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleResetPersona}
                  className="px-3 py-1.5 rounded border border-[#404040] text-[10px] font-bold text-neutral-400 hover:bg-[#262626]"
                >
                  RESET
                </button>
                <button
                  onClick={handleSavePersona}
                  className="px-3 py-1.5 rounded bg-white text-black text-[10px] font-bold hover:bg-neutral-200"
                >
                  {personaSaved ? 'SAVED ✓' : 'SAVE'}
                </button>
              </div>
            </div>
            <div className="flex-1 border border-[#262626] rounded overflow-hidden flex flex-col">
              <textarea
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="flex-1 p-8 resize-none focus:outline-none bg-[#090909] text-[#d4d4d4] font-mono text-sm leading-relaxed"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
