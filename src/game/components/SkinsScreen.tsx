import { useState, useEffect } from 'react';
import { useGameStore } from '../store';
import { SKINS, CursorIcon, applyCursor, resetCursor } from '../skins';
import type { SkinId } from '../types';

export default function SkinsScreen() {
  const { setPhase, selectedSkin, setSkin, secretUnlocked, unlockSecret, cursorEnabled, setCursorEnabled } = useGameStore();
  const [secretCode, setSecretCode] = useState('');
  const [showSecret, setShowSecret] = useState(false);

  const handleSecretCheck = (code: string) => {
    setSecretCode(code);
    const c = code.toLowerCase();
    if (c === 'tux' || c === 'linux' || c === 'penguin') {
      unlockSecret();
      setShowSecret(false);
      setSkin('tux');
    } else if (c === 'windows' || c === 'win11' || c === 'microsoft') {
      unlockSecret();
      setShowSecret(false);
      setSkin('win11');
    }
  };

  // Preview cursor when hovering skins
  useEffect(() => {
    if (cursorEnabled) {
      applyCursor(selectedSkin);
    } else {
      resetCursor();
    }
  }, [cursorEnabled, selectedSkin]);

  const availableSkins = SKINS.filter(s => !s.secret || secretUnlocked);

  return (
    <div className="min-h-screen bg-main p-6 page-scroll">
      <div className="max-w-md mx-auto space-y-6 py-4">
        <button onClick={() => setPhase('menu')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>

        <div>
          <h1 className="text-3xl font-black text-white">Cursor Skins</h1>
          <p className="text-white/40 text-sm mt-1">Choose your style</p>
        </div>

        {/* System Cursor Toggle */}
        <div className="bg-gradient-to-r from-[#a855f7]/10 to-[#ff0080]/10 border border-[#a855f7]/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-sm">Change System Cursor</div>
              <div className="text-white/40 text-xs mt-0.5">Your actual mouse cursor will change</div>
            </div>
            <button
              onClick={() => setCursorEnabled(!cursorEnabled)}
              className={`w-14 h-8 rounded-full transition-colors relative ${cursorEnabled ? 'bg-[#a855f7]' : 'bg-white/20'}`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full shadow transition-all ${cursorEnabled ? 'translate-x-7 bg-black' : 'translate-x-1 bg-white/60'}`} />
            </button>
          </div>
          {cursorEnabled && (
            <div className="mt-2 text-[10px] text-[#a855f7]/70 bg-[#a855f7]/10 rounded-lg px-2 py-1">
              Note: Cursor change works in browser. For .exe apps, cursor changes require system permissions.
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {availableSkins.map(skin => {
            const isSelected = selectedSkin === skin.id;
            const isTux = skin.id === 'tux';
            return (
              <button
                key={skin.id}
                onClick={() => setSkin(skin.id as SkinId)}
                onMouseEnter={() => cursorEnabled && applyCursor(skin.id as SkinId)}
                onMouseLeave={() => cursorEnabled && applyCursor(selectedSkin)}
                className={`relative p-5 rounded-2xl border-2 transition-all duration-200 ${
                  isSelected
                    ? isTux 
                      ? 'border-yellow-500 bg-yellow-500/15 shadow-[0_0_25px_rgba(245,166,35,0.3)]'
                      : 'border-[#a855f7] bg-[#a855f7]/15 shadow-[0_0_25px_rgba(168,85,247,0.3)]'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {isSelected && (
                  <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center ${isTux ? 'bg-yellow-500' : 'bg-[#a855f7]'}`}>
                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${isTux ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30' : 'bg-gradient-to-br from-[#a855f7]/20 to-[#ff0080]/20'}`}>
                    <CursorIcon skinId={skin.id as SkinId} size={40} />
                  </div>
                  <div className="text-center">
                    <div className={`font-bold text-sm ${isTux ? 'text-yellow-400' : 'text-white'}`}>{skin.name}</div>
                    <div className="text-white/40 text-xs mt-0.5">{skin.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {!secretUnlocked && (
          <div className="mt-6">
            {!showSecret ? (
              <button onClick={() => setShowSecret(true)} className="w-full py-3 text-white/20 hover:text-white/40 text-xs transition-colors">
                Have a secret code?
              </button>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <input
                  type="text"
                  value={secretCode}
                  onChange={e => handleSecretCheck(e.target.value)}
                  placeholder="Enter secret code..."
                  className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#a855f7] transition-colors"
                />
                <p className="text-white/30 text-xs text-center">Hint: A famous open-source mascot 🐧</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-gradient-to-r from-[#a855f7]/10 to-[#ff0080]/10 border border-[#a855f7]/30 rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#a855f7]/30 to-[#ff0080]/30 flex items-center justify-center">
              <CursorIcon skinId={selectedSkin} size={56} />
            </div>
            <div>
              <div className="text-xs text-[#a855f7] uppercase tracking-wider font-bold">Selected</div>
              <div className="text-2xl font-black text-white">{SKINS.find(s => s.id === selectedSkin)?.name}</div>
              {selectedSkin === 'tux' && <div className="text-yellow-400 text-xs font-bold mt-1">🐧 Linux Penguin!</div>}
            </div>
          </div>
        </div>

        <button
          onClick={() => setPhase('menu')}
          className="w-full py-4 bg-gradient-to-r from-[#a855f7] to-[#9333ea] text-black font-bold text-sm rounded-xl hover:brightness-110 transition-all active:scale-[0.98] transform shadow-[0_0_30px_rgba(168,85,247,0.3)]"
        >
          Done
        </button>
      </div>
    </div>
  );
}
