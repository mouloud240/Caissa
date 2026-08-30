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
    <div className="w-80 flex-col bg-[#090909] border-l border-[#262626] overflow-y-auto custom-scrollbar hidden lg:flex">
      <div className="p-6 space-y-8">
        {/* Board */}
        <div className="space-y-3">
          <div
            id="chess-board"
            className="grid grid-cols-8 rounded overflow-hidden border border-[#333333]"
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
          <div className="flex items-center justify-between text-[10px] font-medium text-[#a3a3a3] uppercase tracking-tighter">
            <span>Stockfish 16.1</span>
            <span>+0.42</span>
          </div>
        </div>

        {/* Session context */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
            Session Context
          </h3>
          <div className="p-4 rounded border border-[#262626] bg-[#111111]">
            <p className="text-[11px] font-bold text-neutral-500 uppercase mb-2">
              Learned Patterns
            </p>
            <ul className="text-xs text-neutral-400 space-y-1.5">
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
