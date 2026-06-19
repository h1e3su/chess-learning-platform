import React from 'react';
import { Flag, Handshake } from 'lucide-react';

export function RightPanel() {
  return (
    <aside className="w-80 fixed h-screen right-0 bg-neutral-900 border-l border-neutral-800 flex flex-col z-10">
      {/* Tabs */}
      <div className="flex border-b border-neutral-800">
        <button className="flex-1 py-4 text-sm font-bold text-cyan-400 border-b-2 border-cyan-400">
          LỊCH SỬ
        </button>
        <button className="flex-1 py-4 text-sm font-bold text-neutral-500 hover:text-neutral-300 transition-colors">
          PHÂN TÍCH AI
        </button>
      </div>

      {/* Move History Table Header */}
      <div className="flex px-4 py-3 border-b border-neutral-800/50 text-xs font-bold text-neutral-500 tracking-wider">
        <div className="w-8">#</div>
        <div className="flex-1">TRẮNG</div>
        <div className="flex-1">ĐEN</div>
      </div>

      {/* PGN History Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-neutral-900/50">
        {/* Row 1 */}
        <div className="flex items-center px-2 py-2 hover:bg-neutral-800/50 rounded transition-colors group cursor-pointer">
          <div className="w-8 text-neutral-500 text-sm">1.</div>
          <div className="flex-1 font-semibold text-neutral-200 group-hover:text-white">e4</div>
          <div className="flex-1 font-semibold text-neutral-200 group-hover:text-white">e5</div>
        </div>
        {/* Row 2 */}
        <div className="flex items-center px-2 py-2 hover:bg-neutral-800/50 rounded transition-colors group cursor-pointer">
          <div className="w-8 text-neutral-500 text-sm">2.</div>
          <div className="flex-1 font-semibold text-neutral-200 group-hover:text-white">Nf3</div>
          <div className="flex-1 font-semibold text-neutral-200 group-hover:text-white">Nc6</div>
        </div>
        {/* Row 3 */}
        <div className="flex items-center px-2 py-2 hover:bg-neutral-800/50 rounded transition-colors group cursor-pointer">
          <div className="w-8 text-neutral-500 text-sm">3.</div>
          <div className="flex-1 font-semibold text-neutral-200 group-hover:text-white">Bb5</div>
          <div className="flex-1 font-semibold text-emerald-400">a6</div>
        </div>
        {/* Row 4 (Current) */}
        <div className="flex items-center px-2 py-2 bg-neutral-800/80 rounded border border-neutral-700/50 cursor-pointer">
          <div className="w-8 text-neutral-400 text-sm font-medium">4.</div>
          <div className="flex-1 font-bold text-white">Ba4</div>
          <div className="flex-1 font-bold text-red-500 flex items-center gap-1">
            Nf6 <span className="text-xs">??</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-900 flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 font-bold rounded-lg transition-colors">
          <Flag className="w-4 h-4" />
          ĐẦU HÀNG
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-cyan-500 hover:bg-cyan-400 text-neutral-900 font-bold rounded-lg transition-transform transform hover:-translate-y-0.5 shadow-lg shadow-cyan-500/20">
          <Handshake className="w-5 h-5" />
          CẦU HÒA
        </button>
      </div>
    </aside>
  );
}
