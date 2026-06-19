import React, { useEffect, useRef } from 'react';
import { Flag, Handshake } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

export function RightPanel() {
  const history = useGameStore(state => state.history);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Thuật toán "cắt khúc": Gộp mảng 1 chiều thành mảng 2 chiều [[Trắng, Đen], [Trắng, Đen]]
  const movePairs = history.reduce((result: string[][], value, index, array) => {
    if (index % 2 === 0) {
      result.push(array.slice(index, index + 2));
    }
    return result;
  }, []);

  // Tự động cuộn xuống cuối cùng mỗi khi có nước đi mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

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
        <div className="flex-1 text-center">TRẮNG</div>
        <div className="flex-1 text-center">ĐEN</div>
      </div>

      {/* PGN History Content */}
      <div 
        ref={scrollRef}
        className="flex-1 p-2 overflow-y-auto custom-scrollbar bg-neutral-900/50"
      >
        {movePairs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-neutral-500 italic">
            Ván cờ chưa bắt đầu...
          </div>
        ) : (
          <table className="w-full text-sm text-left table-fixed">
            <tbody>
              {movePairs.map((pair, index) => (
                <tr 
                  key={index} 
                  className="transition-colors hover:bg-neutral-800/80 group cursor-pointer"
                >
                  {/* Số thứ tự lượt đi */}
                  <td className="w-8 py-2 pl-2 text-neutral-500 font-medium border-r border-neutral-800/50">
                    {index + 1}.
                  </td>
                  {/* Nước đi của quân Trắng */}
                  <td className="w-[45%] py-2 text-center font-bold text-neutral-300 group-hover:text-white">
                    {pair[0]}
                  </td>
                  {/* Nước đi của quân Đen (nếu có) */}
                  <td className="w-[45%] py-2 text-center font-bold text-neutral-300 group-hover:text-white">
                    {pair[1] || ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
