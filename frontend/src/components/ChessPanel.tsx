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
    <div className="w-64 flex-col bg-[#0a0a0a] border-l border-[var(--border-subtle)] overflow-y-auto custom-scrollbar hidden lg:flex">
      <div className="p-4 space-y-5">
        {/* Board */}
        <div className="space-y-2">
          <div className="grid grid-cols-8 rounded-lg overflow-hidden border border-[var(--border-subtle)]">
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
                        className={`text-lg ${
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
          <div className="flex items-center justify-between text-[9px] font-medium text-[var(--text-muted)] uppercase tracking-tighter">
            <span>Stockfish 16.1</span>
            <span className="text-[#22c55e]">+0.42</span>
          </div>
        </div>

        {/* Session context */}
        <div className="space-y-3">
          <h3 className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
            Session Context
          </h3>
          <div className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1.5">
              Learned Patterns
            </p>
            <ul className="text-[11px] text-[var(--text-secondary)] space-y-1">
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
