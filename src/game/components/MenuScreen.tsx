import { useEffect } from 'react';
import { useGameStore } from '../store';
import { CursorIcon, applyCursor, resetCursor } from '../skins';

export default function MenuScreen() {
  const { setPhase, playerName, setPlayerName, selectedSkin, createRoom, cursorEnabled } = useGameStore();

  useEffect(() => {
    if (cursorEnabled) {
      applyCursor(selectedSkin);
    } else {
      resetCursor();
    }
  }, [cursorEnabled, selectedSkin]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-main p-6 page-scroll">
      <div className="max-w-sm w-full space-y-7">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-[#00ffff] to-[#ff0080] shadow-lg glow-pulse mb-2">
            <CursorIcon skinId={selectedSkin} size={56} />
          </div>
          <h1 className="text-5xl font-black tracking-tight">
            <span className="text-[#00ffff]">Clicker</span>
            <span className="text-[#ff0080]">Clash</span>
          </h1>
          <p className="text-white/50 text-sm">Competitive clicking</p>
        </div>

        {/* Name input */}
        <div className="space-y-2">
          <label className="text-xs text-[#00ffff] font-medium uppercase tracking-wider">Your Name</label>
          <input
            type="text"
            value={playerName}
            onChange={e => setPlayerName(e.target.value.slice(0, 16))}
            placeholder="Enter your name"
            maxLength={16}
            className="w-full bg-black/50 border-2 border-[#00ffff]/30 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#00ffff] focus:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all"
          />
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={createRoom}
            className="w-full py-4 bg-gradient-to-r from-[#00ffff] to-[#00cccc] text-black font-bold text-sm rounded-xl hover:brightness-110 transition-all active:scale-[0.98] transform shadow-[0_0_30px_rgba(0,255,255,0.4)] shimmer"
          >
            Create Room
          </button>
          <button
            onClick={() => setPhase('joinRoom')}
            className="w-full py-4 bg-gradient-to-r from-[#ff0080] to-[#cc0066] text-white font-bold text-sm rounded-xl hover:brightness-110 transition-all active:scale-[0.98] transform shadow-[0_0_30px_rgba(255,0,128,0.3)]"
          >
            Join Room
          </button>
          <button
            onClick={() => setPhase('skins')}
            className="w-full py-3.5 bg-white/5 border-2 border-white/20 text-white font-semibold text-sm rounded-xl hover:bg-white/10 hover:border-white/40 transition-all active:scale-[0.98] transform flex items-center justify-center gap-2"
          >
            <CursorIcon skinId={selectedSkin} size={18} />
            Cursor Skins
          </button>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-[#00ffff]/10 border border-[#00ffff]/30 rounded-xl p-4 text-center">
            <div className="text-[#00ffff] font-bold text-sm">Full Control</div>
            <div className="text-white/40 text-xs mt-1">Host customizes everything</div>
          </div>
          <div className="bg-[#ff0080]/10 border border-[#ff0080]/30 rounded-xl p-4 text-center">
            <div className="text-[#ff0080] font-bold text-sm">Sabotages</div>
            <div className="text-white/40 text-xs mt-1">Attack your rivals</div>
          </div>
        </div>

        {/* Device switch */}
        <button
          onClick={() => useGameStore.setState({ phase: 'deviceSelect' })}
          className="w-full text-center text-xs text-white/30 hover:text-white/60 transition-colors py-2"
        >
          Change input device
        </button>
      </div>
    </div>
  );
}
