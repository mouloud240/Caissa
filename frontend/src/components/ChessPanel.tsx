const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const PIECES: Record<string, string> = {
  r: '♜', n: '♞', b: '♝', q: '♛', k: '♚', p: '♟',
  R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔', P: '♙',
}

const STARTING_POS = [
  ['r','n','b','q','k','b','n','r'],
  ['p','p','p','p','p','p','p','p'],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['P','P','P','P','P','P','P','P'],
  ['R','N','B','Q','K','B','N','R'],
]

export default function ChessPanel() {
  return (
    <aside
      className="w-[280px] flex-col bg-[var(--bg-sidebar)] border-l border-[var(--border-subtle)] overflow-y-auto custom-scrollbar hidden lg:flex"
      aria-label="Chess board and session context"
    >
      <div className="p-5 space-y-6">
        {/* Board */}
        <div className="space-y-2">
          <div
            className="grid grid-cols-8 rounded-lg overflow-hidden border border-[var(--border-subtle)]"
            role="img"
            aria-label="Chess board starting position"
          >
            {STARTING_POS.map((row, r) =>
              row.map((piece, c) => {
                const isLight = (r + c) % 2 === 0
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`aspect-square flex items-center justify-center ${
                      isLight ? 'bg-[#eeeed2]' : 'bg-[#769656]'
                    }`}
                  >
                    {piece && (
                      <span
                        className={`text-[16px] leading-none ${
                          piece === piece.toUpperCase()
                            ? 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]'
                            : 'text-[#1a1a1a] drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]'
                        }`}
                      >
                        {PIECES[piece]}
                      </span>
                    )}
                  </div>
                )
              })
            )}
          </div>
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[10px] font-medium text-[var(--text-muted)]">
              Stockfish 16.1
            </span>
            <span className="text-[10px] font-semibold text-[var(--success)]">
              +0.42
            </span>
          </div>
        </div>

        {/* Session context */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Session Context
          </h3>
          <div className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Learned Patterns
            </p>
            <ul className="space-y-1.5" role="list">
              <li className="text-[12px] text-[var(--text-secondary)] flex items-start gap-1.5">
                <span className="text-[var(--accent)] mt-0.5 shrink-0" aria-hidden="true">·</span>
                Dislikes closed structures
              </li>
              <li className="text-[12px] text-[var(--text-secondary)] flex items-start gap-1.5">
                <span className="text-[var(--accent-red)] mt-0.5 shrink-0" aria-hidden="true">·</span>
                Weak against London System
              </li>
              <li className="text-[12px] text-[var(--text-secondary)] flex items-start gap-1.5">
                <span className="text-[var(--success)] mt-0.5 shrink-0" aria-hidden="true">·</span>
                Strong tactical vision (+2300)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  )
}
