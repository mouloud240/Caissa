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
      <div className="flex-1 flex flex-col h-full border-r border-[#262626]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-10">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-6">
                <div className="w-6 h-6 rounded-sm bg-neutral-800 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-[10px] text-neutral-400">
                    {msg.role === 'agent' ? '♞' : '♟'}
                  </span>
                </div>
                <div className="flex-1 space-y-4">
                  <p className="text-neutral-300 leading-relaxed text-sm">
                    {msg.content}
                  </p>
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="flex flex-col border border-[#262626] rounded overflow-hidden">
                      {msg.toolCalls.map((tc, i) => (
                        <ToolChip key={i} tool={tc.tool} detail={tc.detail} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-6">
                <div className="w-6 h-6 rounded-sm bg-neutral-800 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-[10px] text-neutral-400">♞</span>
                </div>
                <div className="flex-1">
                  <p className="text-neutral-500 text-sm animate-pulse">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Composer */}
        <div className="p-8">
          <div className="max-w-3xl mx-auto relative">
            <div className="flex items-center gap-3 bg-[#171717] border border-[#262626] rounded-lg p-1 px-3 focus-within:border-neutral-500 transition-colors">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none py-3 text-sm focus:outline-none placeholder:text-neutral-600 resize-none"
                placeholder="Message Caissa..."
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-7 h-7 flex items-center justify-center bg-white text-black rounded hover:bg-neutral-200 transition-colors disabled:opacity-30"
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
