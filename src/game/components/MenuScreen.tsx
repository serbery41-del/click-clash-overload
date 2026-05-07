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
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-[#a855f7] to-[#ff0080] shadow-lg glow-pulse mb-2">
            <CursorIcon skinId={selectedSkin} size={56} />
          </div>
          <h1 className="text-5xl font-black tracking-tight">
            <span className="text-[#a855f7]">Clicker</span>
            <span className="text-[#ff0080]">Clash</span>
          </h1>
          <p className="text-white/50 text-sm">Competitive clicking</p>
        </div>

        {/* Name input */}
        <div className="space-y-2">
          <label className="text-xs text-[#a855f7] font-medium uppercase tracking-wider">Your Name</label>
          <input
            type="text"
            value={playerName}
            onChange={e => setPlayerName(e.target.value.slice(0, 16))}
            placeholder="Enter your name"
            maxLength={16}
            className="w-full bg-black/50 border-2 border-[#a855f7]/30 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#a855f7] focus:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all"
          />
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={createRoom}
            className="w-full py-4 bg-gradient-to-r from-[#a855f7] to-[#9333ea] text-black font-bold text-sm rounded-xl hover:brightness-110 transition-all active:scale-[0.98] transform shadow-[0_0_30px_rgba(168,85,247,0.4)] shimmer"
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
          <div className="bg-[#a855f7]/10 border border-[#a855f7]/30 rounded-xl p-4 text-center">
            <div className="text-[#a855f7] font-bold text-sm">Full Control</div>
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
