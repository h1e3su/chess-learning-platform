import { useState, useMemo, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useAuthStore } from '../../store/useAuthStore';
import { useGameStore } from '../../store/useGameStore';

export function PlayArena() {
  // 1. Khởi tạo Bộ não (Logic cờ vua)
  // Dùng useMemo để đảm bảo instance của Chess chỉ được tạo 1 lần duy nhất, 
  // không bị reset khi component re-render.
  const game = useMemo(() => new Chess(), []);

  // 2. Khởi tạo State (Lưu trữ trạng thái FEN để vẽ bàn cờ)
  const [fen, setFen] = useState(game.fen());
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);
  const [evaluation] = useState(50); // Fake centipawn eval for UI
  const { user } = useAuthStore();
  const setHistory = useGameStore(state => state.setHistory);

  // Khởi tạo history lần đầu
  useEffect(() => {
    setHistory(game.history());
  }, [game, setHistory]);

  const checkMatchStatus = () => {
    if (game.isCheckmate()) {
      // Nếu ván trước đó Trắng vừa đi xong (đổi turn sang Đen) mà bị Checkmate -> Trắng thắng
      const winner = game.turn() === 'w' ? 'ĐEN' : 'TRẮNG';
      setGameOverMessage(`CHIẾU BÍ! Chúc mừng quân ${winner} giành chiến thắng.`);
    }
    else if (game.isDraw()) {
      // chess.js tự động tính toán hòa do thiếu quân, lặp lại nước đi (3-fold repetition), hoặc luật 50 nước
      setGameOverMessage("HÒA CỜ! Bất phân thắng bại.");
    }
    else if (game.isStalemate()) {
      setGameOverMessage("HẾT NƯỚC ĐI (STALEMATE)! Ván cờ hòa.");
    }
  };

  // 3. Hàm xử lý sự kiện kéo thả quân cờ
  function onPieceDrop(sourceSquare: string, targetSquare: string, piece: string) {
    try {
      // Yêu cầu Bộ não kiểm tra tính hợp lệ của nước đi
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        // Lấy chữ cái thứ 2 của piece (ví dụ 'wP' -> 'p') làm quân phong cấp
        promotion: piece[1].toLowerCase() ?? 'q',
      });

      // Nếu đi đúng luật, lấy chuỗi FEN mới nhất ép React vẽ lại bàn cờ
      setFen(game.fen());

      // Cập nhật lịch sử nước đi
      setHistory(game.history());

      // Kiểm tra trạng thái trận đấu
      checkMatchStatus();

      return true; // Trả về true để react-chessboard thả quân xuống
    } catch (error) {
      // Bắt lỗi nếu người chơi đi bậy (chess.js throw Error)
      return false;
    }
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
          <div
            className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10"
          >
            <Chessboard
              boardWidth={480}
              position={fen}
              onPieceDrop={onPieceDrop}
              customDarkSquareStyle={{ backgroundColor: '#9b6c47' }} // Wood dark
              customLightSquareStyle={{ backgroundColor: '#e8c99e' }} // Wood light
            />

            {/* Game Over Overlay */}
            {gameOverMessage && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 rounded-xl backdrop-blur-sm">
                <div className="p-6 text-center bg-neutral-800 border border-neutral-600 shadow-2xl rounded-xl">
                  <h3 className="mb-4 text-2xl font-bold text-yellow-400">VÁN ĐẤU KẾT THÚC</h3>
                  <p className="mb-6 text-lg text-white font-semibold">{gameOverMessage}</p>
                  <button
                    onClick={() => {
                      game.reset(); // chess.js xóa bàn cờ
                      setFen(game.fen()); // UI vẽ lại từ đầu
                      setHistory(game.history()); // Xóa lịch sử
                      setGameOverMessage(null); // Ẩn thông báo
                    }}
                    className="px-6 py-2 font-bold text-white transition bg-cyan-600 rounded-lg hover:bg-cyan-500 shadow-lg shadow-cyan-500/30"
                  >
                    Chơi ván mới
                  </button>
                </div>
              </div>
            )}
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
