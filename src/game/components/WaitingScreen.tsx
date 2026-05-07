import { useGameStore } from '../store';
import { CursorIcon } from '../skins';
import * as mp from '../multiplayer';

export default function WaitingScreen() {
  const { settings, players, selectedSkin, playerName, resetGame, myId } = useGameStore();

  return (
    <div className="min-h-screen bg-main flex items-center justify-center p-6 page-scroll relative">
      <button onClick={resetGame} className="fixed top-6 left-6 z-50 text-white/40 hover:text-white text-sm transition-colors flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M15 19l-7-7 7-7" /></svg>
        Leave
      </button>

      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <div className="w-20 h-20 rounded-2xl mx-auto bg-gradient-to-br from-[#00ffff]/30 to-[#ff0080]/30 flex items-center justify-center glow-pulse">
            <CursorIcon skinId={selectedSkin} size={48} />
          </div>
          <h1 className="text-2xl font-black text-white">{playerName || 'Player'}</h1>
        </div>

        <div className="bg-gradient-to-r from-[#00ffff]/10 to-[#ff0080]/10 border border-[#00ffff]/30 rounded-2xl p-6">
          <div className="text-xs text-[#00ffff] uppercase tracking-wider font-bold mb-2">Room Code</div>
          <div className="text-4xl font-mono font-black text-white tracking-wider">{settings.roomCode}</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3 text-white/60">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm">Waiting for host to start...</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-white/40 uppercase tracking-wider font-bold mb-3">Players in Room ({players.length})</div>
          <div className="flex flex-wrap justify-center gap-2">
            {players.map(p => (
              <div key={p.id} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                <CursorIcon skinId={p.skinId} size={18} />
                <span className="text-white text-sm font-medium">{p.name}</span>
                {p.isHost && <span className="text-[#00ffff] text-[10px] font-bold">HOST</span>}
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/30 text-xs">
          The host is configuring the match. It will start automatically.
        </p>
        <div className="text-[9px] text-white/20 font-mono space-y-0.5">
          <div>Your ID: {myId}</div>
          <div>Channel: cc{settings.roomCode}</div>
          <div>Messages received: {mp.getMsgCount()}</div>
          <div>Both tabs must be on the same URL for sync to work</div>
        </div>
      </div>
    </div>
  );
}
