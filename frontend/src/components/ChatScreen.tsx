import { useState, useRef, useEffect } from 'react'
import { SendMessage } from '../../wailsjs/go/main/App'
import ToolChip from './ToolChip'
import ChessPanel from './ChessPanel'

interface Message {
  id: string
  role: 'agent' | 'user'
  content: string
  toolCalls?: { tool: string; detail: string }[]
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'agent',
    content: "I've reviewed your recent games. You're losing 15% more ELO than average in the Fried Liver Attack. Should we look at the Main Line theory or try a specialized practice drill?",
    toolCalls: [
      { tool: 'books', detail: 'Fetching: Italian Game, Knight Attack (C57)... 14 master games found.' },
    ],
  },
  {
    id: '2',
    role: 'user',
    content: "Let's analyze the game against mouloud. I think I played d5 too early?",
  },
]

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const resp = await SendMessage('1', text)
      const agentMsg: Message = {
        id: crypto.randomUUID(),
        role: 'agent',
        content: resp.message,
        toolCalls: resp.toolCalls,
      }
      setMessages((prev) => [...prev, agentMsg])
    } catch (err) {
      const errMsg: Message = {
        id: crypto.randomUUID(),
        role: 'agent',
        content: `Error: ${err}`,
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full">
      {/* Chat column */}
      <div className="flex-1 flex flex-col h-full border-r border-[var(--border-subtle)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
          <div className="max-w-2xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-4">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                  msg.role === 'agent' ? 'bg-[#f59e0b]/10' : 'bg-[var(--bg-elevated)]'
                }`}>
                  <span className={`text-[9px] ${msg.role === 'agent' ? 'text-[#f59e0b]' : 'text-[var(--text-muted)]'}`}>
                    {msg.role === 'agent' ? '♞' : '♟'}
                  </span>
                </div>
                <div className="flex-1 space-y-2.5">
                  <p className="text-[var(--text-primary)] leading-relaxed text-[13px]">
                    {msg.content}
                  </p>
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="flex flex-col border border-[var(--border-subtle)] rounded-lg overflow-hidden">
                      {msg.toolCalls.map((tc, i) => (
                        <ToolChip key={i} tool={tc.tool} detail={tc.detail} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-4">
                <div className="w-5 h-5 rounded-md bg-[#f59e0b]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[9px] text-[#f59e0b]">♞</span>
                </div>
                <div className="flex-1">
                  <p className="text-[var(--text-muted)] text-[13px] animate-pulse">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Composer */}
        <div className="px-6 pb-5">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 focus-within:border-[var(--text-muted)] transition-colors">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none py-2.5 text-[13px] focus:outline-none placeholder:text-[var(--text-muted)] resize-none"
                placeholder="Message Caissa..."
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-6 h-6 flex items-center justify-center bg-[#f59e0b] text-black rounded-lg hover:bg-[#d97706] transition-colors disabled:opacity-30 text-xs font-bold"
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <ChessPanel />
    </div>
  )
}
