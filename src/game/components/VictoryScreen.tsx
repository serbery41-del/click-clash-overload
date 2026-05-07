import { useEffect, useRef } from 'react';
import { useGameStore } from '../store';
import { formatNumber } from '../gameData';
import { CursorIcon } from '../skins';

export default function VictoryScreen() {
  const { players, winnerId, myId, resetGame, settings, timeElapsed } = useGameStore();
  const confettiDone = useRef(false);

  const winner = players.find(p => p.id === winnerId);
  const sorted = [...players].sort((a, b) => b.total - a.total);
  const isHumanWin = winnerId === myId;
  const human = players.find(p => p.id === myId);

  useEffect(() => {
    if (!confettiDone.current && isHumanWin) {
      confettiDone.current = true;
      import('canvas-confetti').then(mod => {
        const fire = mod.default;
        const end = Date.now() + 3000;
        const colors = ['#00ffff', '#ff0080', '#ffffff'];
        const frame = () => {
          fire({ particleCount: 4, angle: 60, spread: 65, origin: { x: 0, y: 0.7 }, colors });
          fire({ particleCount: 4, angle: 120, spread: 65, origin: { x: 1, y: 0.7 }, colors });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
      });
    }
  }, [isHumanWin]);

  if (!winner) return null;

  return (
    <div className="min-h-screen bg-main flex items-center justify-center p-4 page-scroll">
      <div className="max-w-md w-full space-y-6 py-8">
        {/* Winner */}
        <div className="text-center space-y-4">
          <h1 className={`text-5xl font-black ${isHumanWin ? 'text-[#00ffff]' : 'text-white'}`}>
            {isHumanWin ? 'VICTORY!' : `${winner.name} Wins`}
          </h1>
          <div className={`w-28 h-28 rounded-2xl mx-auto flex items-center justify-center ${isHumanWin ? 'bg-gradient-to-br from-[#00ffff]/30 to-[#ff0080]/30 glow-pulse' : 'bg-white/10'}`}>
            <CursorIcon skinId={winner.skinId} size={72} />
          </div>
          <p className="text-white/50 text-sm">
            {settings.goalType === 'timedSprint'
              ? `Highest after ${Math.floor(timeElapsed / 60)}m ${Math.floor(timeElapsed % 60)}s`
              : `Reached ${formatNumber(settings.targetValue)}`}
          </p>
        </div>

        {/* Standings */}
        <div className="bg-white/5 border border-[#00ffff]/20 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="text-xs font-bold text-[#00ffff] uppercase tracking-wider">Final Standings</h2>
          </div>
          {sorted.map((p, i) => (
            <div key={p.id} className={`flex items-center gap-3 px-4 py-3 ${i < sorted.length - 1 ? 'border-b border-white/5' : ''} ${p.id === myId ? 'bg-[#00ffff]/10' : ''}`}>
              <div className={`w-7 text-sm font-black text-center ${i === 0 ? 'text-[#00ffff]' : i === 1 ? 'text-white' : i === 2 ? 'text-[#ff0080]' : 'text-white/40'}`}>
                {i + 1}
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 shrink-0">
                <CursorIcon skinId={p.skinId} size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white">{p.name}</div>
                <div className="text-[10px] text-white/40">{p.totalClicks} clicks</div>
              </div>
              <div className="font-mono text-sm font-bold text-[#00ffff]">{formatNumber(p.total)}</div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#00ffff]/10 border border-[#00ffff]/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-[#00ffff]">{human?.totalClicks || 0}</div>
            <div className="text-white/40 text-xs uppercase font-bold">Your Clicks</div>
          </div>
          <div className="bg-[#ff0080]/10 border border-[#ff0080]/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-[#ff0080]">{human?.sabotagesDealt || 0}</div>
            <div className="text-white/40 text-xs uppercase font-bold">Sabotages</div>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="w-full py-4 bg-gradient-to-r from-[#00ffff] via-[#00dddd] to-[#ff0080] text-black font-black text-lg rounded-xl hover:brightness-110 transition-all active:scale-[0.98] transform shadow-[0_0_30px_rgba(0,255,255,0.3)]"
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
}
