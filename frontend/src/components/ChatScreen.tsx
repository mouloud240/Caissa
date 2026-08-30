import { useState, useRef, useEffect } from 'react'
import { SendMessage } from '../../wailsjs/go/main/App'
import { ChessKnight } from 'lucide-react'
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
      textareaRef.current?.focus()
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
        <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[var(--accent-subtle)] flex items-center justify-center mb-4">
                  <ChessKnight size={24} strokeWidth={1.5} className="text-[var(--accent)]" />
                </div>
                <p className="text-[14px] text-[var(--text-primary)] font-medium mb-1">
                  Ask Caissa anything
                </p>
                <p className="text-[12px] text-[var(--text-muted)] max-w-[280px]">
                  Analyze positions, review openings, or get feedback on your games.
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <article key={msg.id} className="flex gap-4" aria-label={`${msg.role} message`}>
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    msg.role === 'agent'
                      ? 'bg-[var(--accent-subtle)]'
                      : 'bg-[var(--bg-elevated)]'
                  }`}
                  aria-hidden="true"
                >
                  <span
                    className={`text-[11px] ${
                      msg.role === 'agent' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {msg.role === 'agent' ? '♞' : '♟'}
                  </span>
                </div>
                <div className="flex-1 space-y-3 min-w-0">
                  <p className="text-[var(--text-primary)] leading-[1.6] text-[14px]">
                    {msg.content}
                  </p>
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div
                      className="flex flex-col border border-[var(--border-subtle)] rounded-lg overflow-hidden"
                      role="list"
                      aria-label="Tool calls"
                    >
                      {msg.toolCalls.map((tc, i) => (
                        <ToolChip key={i} tool={tc.tool} detail={tc.detail} />
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}

            {loading && (
              <article className="flex gap-4" aria-label="Agent thinking" aria-live="polite">
                <div className="w-7 h-7 rounded-lg bg-[var(--accent-subtle)] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[11px] text-[var(--accent)]">♞</span>
                </div>
                <div className="flex-1 flex items-center gap-1.5 pt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-pulse [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-pulse [animation-delay:300ms]" />
                </div>
              </article>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Composer */}
        <div className="px-10 pb-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 focus-within:border-[var(--border-strong)] transition-colors duration-fast">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none py-2 text-[14px] focus:outline-none placeholder:text-[var(--text-muted)] resize-none min-h-[36px] max-h-[120px]"
                placeholder="Message Caissa..."
                aria-label="Message input"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-8 h-8 flex items-center justify-center bg-[var(--accent)] text-black rounded-lg hover:bg-[var(--accent-hover)] active:scale-95 transition-all duration-fast disabled:opacity-25 disabled:cursor-not-allowed text-[13px] font-bold shrink-0"
                aria-label="Send message"
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
