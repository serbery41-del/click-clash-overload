import { useState } from 'react';
import { useGameStore } from '../store';

export default function JoinRoom() {
  const { setPhase, joinRoom } = useGameStore();
  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = () => {
    if (joining) return;
    if (code.length < 4) {
      setError('Enter a valid room code');
      return;
    }
    setJoining(true);
    setError('');
    setTimeout(() => {
      joinRoom(code);
      setJoining(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-main p-6 page-scroll">
      <div className="max-w-sm w-full space-y-6">
        <button onClick={() => setPhase('menu')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>

        <div>
          <h1 className="text-3xl font-black text-white">Join Room</h1>
          <p className="text-white/40 text-sm mt-1">Enter the code from the host</p>
        </div>

        <div className="space-y-2">
          <input
            type="text"
            value={code}
            onKeyDown={e => {
              e.stopPropagation();
              if (e.key === 'Enter') handleJoin();
            }}
            onKeyUp={e => e.stopPropagation()}
            onChange={e => { setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)); setError(''); }}
            placeholder="XXXXXX"
            maxLength={6}
            className="w-full bg-black/50 border-2 border-[#ff0080]/30 rounded-xl px-4 py-5 text-white text-center text-3xl font-mono font-black tracking-[0.4em] placeholder:text-white/20 focus:outline-none focus:border-[#ff0080] focus:shadow-[0_0_30px_rgba(255,0,128,0.3)] transition-all"
          />
          {error && <p className="text-[#ff0080] text-xs text-center font-bold">{error}</p>}
        </div>

        <button
          onClick={handleJoin}
          disabled={joining || code.length < 4}
          className="w-full py-4 bg-gradient-to-r from-[#ff0080] to-[#cc0066] text-white font-bold text-sm rounded-xl hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transform shadow-[0_0_30px_rgba(255,0,128,0.3)]"
        >
          {joining ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Connecting...
            </span>
          ) : 'Join Game'}
        </button>

        <div className="bg-[#a855f7]/10 border border-[#a855f7]/20 rounded-xl p-4 text-center">
          <p className="text-xs text-[#a855f7]/70">
            Ask the host for their 6-character room code
          </p>
        </div>
      </div>
    </div>
  );
}
