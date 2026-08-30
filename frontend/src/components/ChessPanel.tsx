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
    <div className="w-80 flex-col bg-[#0a0a0a] border-l border-[var(--border-subtle)] overflow-y-auto custom-scrollbar hidden lg:flex">
      <div className="p-6 space-y-7">
        {/* Board */}
        <div className="space-y-3">
          <div className="grid grid-cols-8 rounded-xl overflow-hidden border border-[var(--border-subtle)]">
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
                        className={`text-xl ${
                          piece === piece.toUpperCase() ? 'text-white' : 'text-[#1a1a1a]'
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
          <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-tighter">
            <span>Stockfish 16.1</span>
            <span className="text-[#22c55e]">+0.42</span>
          </div>
        </div>

        {/* Session context */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
            Session Context
          </h3>
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <p className="text-[12px] font-bold text-[var(--text-muted)] uppercase mb-2">
              Learned Patterns
            </p>
            <ul className="text-[13px] text-[var(--text-secondary)] space-y-1.5">
              <li>• Dislikes closed structures</li>
              <li>• Weak against London System</li>
              <li>• Strong tactical vision (+2300)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
