import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useAuthStore } from '../../store/useAuthStore';

export function PlayArena() {
  const [game, setGame] = useState(new Chess());
  const [evaluation] = useState(50); // Fake centipawn eval for UI
  const { user } = useAuthStore();

  function makeAMove(move: any) {
    const gameCopy = new Chess(game.fen());
    try {
      const result = gameCopy.move(move);
      if (result) {
        setGame(gameCopy);
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });
    return move;
  }

  return (
    <div className="flex-1 ml-64 mr-80 flex flex-col justify-center items-center h-screen bg-neutral-900 p-4 md:p-8">
      <div className="flex items-stretch gap-4 max-w-3xl w-full">
        {/* Evaluation Bar */}
        <div className="w-5 bg-neutral-800 rounded-md overflow-hidden flex flex-col-reverse shadow-inner relative ring-1 ring-white/5">
          <div 
            className="w-full bg-white transition-all duration-500" 
            style={{ height: `${evaluation}%` }}
          />
          <div className="absolute top-2 left-0 right-0 text-center text-[10px] font-bold text-neutral-400 z-10">
            +0.8
          </div>
        </div>

        {/* Board Area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Opponent Top Bar */}
          <div className="flex items-center justify-between bg-neutral-800/50 p-3 rounded-xl border border-neutral-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-neutral-700 rounded-lg"></div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-lg">GM_Hikaru</h3>
                  <span className="bg-red-500/20 text-red-500 text-[10px] px-2 py-0.5 rounded font-bold">LIVE</span>
                </div>
                <p className="text-sm font-medium text-cyan-400">Kim Cương I <span className="text-neutral-500 ml-1">· 2840 ELO</span></p>
              </div>
            </div>
            <div className="bg-neutral-900 px-4 py-2 rounded-lg border border-neutral-700 font-outfit text-2xl font-bold tracking-wider text-white">
              04:12
            </div>
          </div>

          {/* Chessboard Container */}
          <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10">
            <Chessboard 
              position={game.fen()} 
              onPieceDrop={onDrop}
              customDarkSquareStyle={{ backgroundColor: '#9b6c47' }} // Wood dark
              customLightSquareStyle={{ backgroundColor: '#e8c99e' }} // Wood light
            />
          </div>

          {/* Player Bottom Bar */}
          <div className="flex items-center justify-between bg-neutral-800 p-3 rounded-xl border border-neutral-700/50 shadow-lg shadow-cyan-500/5 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute left-0 bottom-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-[50px] pointer-events-none" />
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-xl font-bold text-neutral-900">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Bạn ({user?.username || 'Guest'})</h3>
                <p className="text-sm font-medium text-cyan-400">{user?.rank || 'Sắt I'} <span className="text-neutral-500 ml-1">· {user?.elo || 1200} ELO</span></p>
              </div>
            </div>
            <div className="bg-neutral-900 px-4 py-2 rounded-lg border border-red-500/30 font-outfit text-2xl font-bold tracking-wider text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] relative z-10">
              00:42
            </div>
          </div>

          {/* Feedback Badges (Mock) */}
          <div className="flex gap-3 mt-2">
            <div className="flex-1 bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
              <span className="text-red-500 text-sm font-semibold">⚠ SAI LẦM · Nc6 → Nf6</span>
            </div>
            <div className="flex-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 flex items-center gap-2">
              <span className="text-cyan-400 text-sm font-semibold">✨ GỢI Ý: Bxc6</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
