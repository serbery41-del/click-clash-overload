import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '../store';
import { SHOP_ITEMS, SABOTAGE_ABILITIES, getItemCost, formatNumber, getSabotageCost } from '../gameData';
import { CursorIcon, CursorMini, applyCursor, resetCursor } from '../skins';
import type { PlayerState, ShopItem } from '../types';

interface ClickParticle { id: number; x: number; y: number; value: number }

export default function GameScreen() {
  const store = useGameStore();
  const { players, myId, settings, feed, timeRemaining, winnerId, sabotageCooldowns, deviceMode, selectedSkin, foxyActive, cursorEnabled, goldenFreddyActive, activeChaos, chaosEndsAt, cheatLockedUntil } = store;
  const lastTick = useRef(Date.now());
  const [particles, setParticles] = useState<ClickParticle[]>([]);
  const [cpm, setCpm] = useState(0);
  const clickTs = useRef<number[]>([]);
  const [shaking, setShaking] = useState(false);
  const [tab, setTab] = useState<'shop' | 'sabotage'>('shop');
  const [shopCat, setShopCat] = useState<'click' | 'auto' | 'invest' | 'special'>('click');
  const [target, setTarget] = useState<string | null>(null);
  const pid = useRef(0);
  const human = players.find(p => p.id === myId);
  const sorted = [...players].sort((a, b) => b.total - a.total);

  // Apply cursor on mount if enabled
  useEffect(() => {
    if (cursorEnabled) {
      applyCursor(selectedSkin);
    }
    return () => resetCursor();
  }, [cursorEnabled, selectedSkin]);

  // Game tick
  useEffect(() => {
    if (winnerId) return;
    const iv = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTick.current) / 1000;
      lastTick.current = now;
      store.tick(delta);
    }, 50);
    return () => clearInterval(iv);
  }, [winnerId]);

  // CPM
  useEffect(() => {
    const iv = setInterval(() => {
      const now = Date.now();
      clickTs.current = clickTs.current.filter(t => now - t < 60000);
      setCpm(clickTs.current.length);
    }, 500);
    return () => clearInterval(iv);
  }, []);

  const doClick = useCallback(() => {
    if (winnerId) return;
    clickTs.current.push(Date.now());
    store.handleClick();
    setShaking(true);
    setTimeout(() => setShaking(false), 120);
  }, [winnerId]);

  // Keyboard (PC only)
  useEffect(() => {
    if (deviceMode !== 'pc') return;
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        doClick();
      }
      if (e.key === '1') setShopCat('click');
      if (e.key === '2') setShopCat('auto');
      if (e.key === '3') setShopCat('invest');
      if (e.key === '4') setShopCat('special');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [deviceMode, doClick]);

  const handlePointer = useCallback((e: React.PointerEvent) => {
    doClick();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = pid.current++;
    const val = (human?.clickPower ?? 1) * (human?.multiplier ?? 1);
    setParticles(prev => [...prev.slice(-8), { id, x, y, value: val }]);
    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 550);
  }, [doClick, human?.clickPower, human?.multiplier]);

  if (!human) return null;

  const isSmoked = human.activeSabotages.some(s => s.type === 'smokeBomb' && s.endsAt > Date.now());
  const isStunned = human.activeSabotages.some(s => s.type === 'stunLock' && s.endsAt > Date.now());
  const hasInflation = human.activeSabotages.some(s => s.type === 'inflationSpike' && s.endsAt > Date.now());
  const isFrozen = human.activeSabotages.some(s => s.type === 'frozenGear' && s.endsAt > Date.now());
  const rivals = players.filter(p => p.id !== myId);
  const isPhone = deviceMode === 'phone';

  return (
    <div className={`h-screen flex ${isPhone ? 'flex-col' : 'flex-row'} bg-main text-white overflow-hidden relative`}>
      
      {/* FOXY JUMPSCARE OVERLAY */}
      {foxyActive && (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center animate-pulse" style={{ animation: 'none' }}>
          <div className="relative animate-bounce" style={{ animation: 'foxyShake 0.1s infinite' }}>
            {/* Foxy SVG */}
            <svg width="400" height="400" viewBox="0 0 100 100" className="drop-shadow-[0_0_50px_rgba(255,0,0,0.8)]">
              {/* Head */}
              <ellipse cx="50" cy="45" rx="35" ry="30" fill="#8B2500"/>
              {/* Snout */}
              <ellipse cx="50" cy="58" rx="18" ry="12" fill="#CD853F"/>
              {/* Eyes */}
              <ellipse cx="35" cy="40" rx="10" ry="12" fill="#FFD700"/>
              <ellipse cx="65" cy="40" rx="10" ry="12" fill="#FFD700"/>
              {/* Pupils - menacing */}
              <ellipse cx="35" cy="40" rx="4" ry="8" fill="#000"/>
              <ellipse cx="65" cy="40" rx="4" ry="8" fill="#000"/>
              {/* Red glow in eyes */}
              <circle cx="35" cy="38" r="2" fill="#ff0000"/>
              <circle cx="65" cy="38" r="2" fill="#ff0000"/>
              {/* Mouth - open with teeth */}
              <path d="M32 62 Q50 80 68 62" fill="#000" stroke="#8B2500" strokeWidth="2"/>
              {/* Teeth */}
              <path d="M35 62 L38 70 L41 62" fill="white"/>
              <path d="M45 62 L48 72 L51 62" fill="white"/>
              <path d="M55 62 L58 72 L61 62" fill="white"/>
              <path d="M59 62 L62 70 L65 62" fill="white"/>
              {/* Ears */}
              <polygon points="20,25 25,5 35,25" fill="#8B2500"/>
              <polygon points="80,25 75,5 65,25" fill="#8B2500"/>
              {/* Inner ears */}
              <polygon points="23,23 26,10 32,23" fill="#CD853F"/>
              <polygon points="77,23 74,10 68,23" fill="#CD853F"/>
              {/* Eyepatch */}
              <ellipse cx="65" cy="40" rx="12" ry="14" fill="none" stroke="#333" strokeWidth="3"/>
              <line x1="77" y1="35" x2="90" y2="25" stroke="#333" strokeWidth="2"/>
              {/* Hook hand */}
              <path d="M85 75 Q95 85 90 95" fill="none" stroke="#888" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="85" cy="75" r="5" fill="#8B2500"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-red-600 text-6xl font-black animate-pulse drop-shadow-[0_0_20px_red]" style={{ textShadow: '0 0 30px red, 0 0 60px red' }}>
                !!!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* GOLDEN FREDDY chaos overlay */}
      {goldenFreddyActive && (
        <div className="fixed inset-0 z-[9998] bg-black flex items-center justify-center" style={{ animation: 'foxyShake 0.08s infinite' }}>
          <svg width="500" height="500" viewBox="0 0 100 100" className="drop-shadow-[0_0_60px_rgba(255,215,0,0.9)]">
            <ellipse cx="50" cy="48" rx="36" ry="32" fill="#DAA520"/>
            <ellipse cx="50" cy="60" rx="20" ry="13" fill="#B8860B"/>
            <ellipse cx="34" cy="42" rx="11" ry="13" fill="#000"/>
            <ellipse cx="66" cy="42" rx="11" ry="13" fill="#000"/>
            <circle cx="34" cy="42" r="3" fill="#fff"/>
            <circle cx="66" cy="42" r="3" fill="#fff"/>
            <path d="M30 65 Q50 85 70 65 Z" fill="#000"/>
            <path d="M34 65 L37 75 L40 65 M44 65 L47 78 L50 65 M54 65 L57 78 L60 65 M60 65 L63 75 L66 65" stroke="#fff" strokeWidth="1.5" fill="white"/>
            <polygon points="18,28 26,8 36,28" fill="#DAA520"/>
            <polygon points="82,28 74,8 64,28" fill="#DAA520"/>
            <rect x="46" y="20" width="8" height="6" fill="#000"/>
            <circle cx="50" cy="23" r="1.5" fill="#FFD700"/>
          </svg>
          <div className="absolute bottom-20 text-yellow-400 text-5xl font-black tracking-widest" style={{ textShadow: '0 0 30px gold' }}>
            IT'S ME.
          </div>
        </div>
      )}

      {/* CHAOS event banner */}
      {activeChaos && chaosEndsAt > Date.now() && !goldenFreddyActive && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[80] bg-gradient-to-r from-yellow-500/90 to-red-500/90 px-6 py-2 rounded-full border-2 border-yellow-300 font-black text-black uppercase tracking-wider text-sm animate-pulse">
          ⚡ {activeChaos === 'doubleClick' ? 'DOUBLE CLICK' : activeChaos === 'priceCrash' ? 'PRICE CRASH -30%' : activeChaos === 'autoBoost' ? 'AUTO OVERDRIVE' : activeChaos === 'frenzy' ? 'CLICK FRENZY' : activeChaos === 'blackout' ? 'BLACKOUT' : activeChaos === 'taxStorm' ? 'TAX STORM' : 'CHAOS'}
        </div>
      )}

      {/* BLACKOUT chaos overlay */}
      {activeChaos === 'blackout' && chaosEndsAt > Date.now() && (
        <div className="fixed inset-0 z-[70] bg-black/95 pointer-events-none" />
      )}

      {/* ANTI-CHEAT LOCK overlay */}
      {cheatLockedUntil > Date.now() && (
        <div className="fixed inset-0 z-[90] bg-red-900/80 backdrop-blur flex flex-col items-center justify-center pointer-events-none">
          <div className="text-red-300 text-3xl font-black mb-2">⚠ ANTI-CHEAT TRIGGERED ⚠</div>
          <div className="text-white text-xl font-mono">Frozen for {Math.ceil((cheatLockedUntil - Date.now()) / 1000)}s</div>
          <div className="text-red-200 text-sm mt-3">Clicking faster than {settings.antiCheatCpsThreshold} CPS is not allowed</div>
        </div>
      )}

      {/* Room Code - Top Right */}
      <div className="absolute top-3 right-3 z-50 bg-black/80 border border-[#a855f7]/40 rounded-lg px-3 py-1.5 backdrop-blur-sm">
        <div className="text-[8px] text-[#a855f7] uppercase tracking-wider">Room</div>
        <div className="text-sm font-mono font-black text-white tracking-wider">{settings.roomCode}</div>
      </div>

      {/* ── LEFT / TOP: Click Zone ── */}
      <div className={`flex flex-col ${isPhone ? 'flex-1 min-h-0' : 'flex-1'}`}>
        {/* Top bar */}
        {settings.showLeaderboard && (
          <div className="shrink-0 border-b border-[#a855f7]/20 bg-black/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 px-3 py-2 overflow-x-auto pr-24">
              <div className="shrink-0 text-sm font-mono font-bold mr-2">
                {settings.goalType === 'timedSprint' ? (
                  <span className="text-[#ff0080]">{fmtTime(timeRemaining)}</span>
                ) : (
                  <span className="text-[#a855f7]">{formatNumber(settings.targetValue)}</span>
                )}
              </div>
              {sorted.map((p, i) => (
                <div key={p.id} className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                  p.id === myId 
                    ? 'bg-gradient-to-r from-[#a855f7]/20 to-[#ff0080]/20 border border-[#a855f7]/40' 
                    : 'bg-white/5'
                }`}>
                  <span className={`font-mono text-[10px] font-black ${i === 0 ? 'text-[#a855f7]' : i === 1 ? 'text-white' : i === 2 ? 'text-[#ff0080]' : 'text-white/40'}`}>
                    {i + 1}
                  </span>
                  <CursorMini skinId={p.skinId} size={14} />
                  <span className="font-medium truncate max-w-[50px]">{p.name}</span>
                  <span className="font-mono text-[10px] text-[#a855f7]">{formatNumber(p.total)}</span>
                </div>
              ))}
            </div>
            {settings.goalType === 'firstToValue' && (
              <div className="px-3 pb-2 space-y-1">
                {sorted.slice(0, 4).map((p) => {
                  const pct = Math.min((p.total / settings.targetValue) * 100, 100);
                  return (
                    <div key={p.id} className="flex items-center gap-1.5">
                      <CursorMini skinId={p.skinId} size={10} />
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300 ease-out" 
                          style={{ 
                            width: `${pct}%`, 
                            background: p.id === myId ? 'linear-gradient(90deg, #a855f7, #ff0080)' : p.color
                          }} 
                        />
                      </div>
                      <span className="text-[9px] font-mono text-white/50 w-8 text-right">{pct.toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Click area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative min-h-0">
          {/* Stats */}
          <div className="flex gap-6 mb-5 flex-wrap justify-center">
            <StatBlock label="Total" value={formatNumber(human.total)} color="text-white" />
            <StatBlock label="Click" value={formatNumber(human.clickPower * human.multiplier)} color="text-[#a855f7]" />
            <StatBlock label="Auto" value={formatNumber(human.cps * human.multiplier * (isFrozen ? 0 : 1))} color="text-[#ff0080]" />
            {human.investRate > 0 && <StatBlock label="Invest" value={`${(human.investRate * 100).toFixed(2)}%/s`} color="text-green-400" />}
            {!isPhone && <StatBlock label="CPM" value={String(cpm)} color="text-white/60" />}
          </div>

          {/* Active debuffs */}
          {human.activeSabotages.filter(s => s.endsAt > Date.now()).length > 0 && (
            <div className="mb-3 flex gap-2 flex-wrap justify-center">
              {human.activeSabotages.filter(s => s.endsAt > Date.now() && s.type !== 'foxy').map(s => {
                const sab = SABOTAGE_ABILITIES.find(a => a.id === s.type);
                const rem = Math.max(0, Math.ceil((s.endsAt - Date.now()) / 1000));
                return (
                  <div key={s.id} className="px-3 py-1.5 bg-[#ff0080]/20 border border-[#ff0080]/40 rounded-lg text-xs text-[#ff0080] font-bold subtle-pulse">
                    {sab?.name} · {rem}s
                  </div>
                );
              })}
            </div>
          )}

          {/* Button */}
          <div className="relative">
            <button
              onPointerDown={handlePointer}
              disabled={isStunned}
              className={`
                relative rounded-full transition-transform duration-75 select-none cursor-pointer
                active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed
                bg-gradient-to-br from-[#a855f7] via-[#9333ea] to-[#ff0080] text-black font-black
                glow-pulse
                ${isPhone ? 'w-40 h-40' : 'w-52 h-52'}
                ${shaking ? 'scale-95' : ''}
              `}
              style={{ touchAction: 'manipulation' }}
            >
              <span className="relative z-10 flex flex-col items-center justify-center">
                <CursorIcon skinId={selectedSkin} size={isPhone ? 56 : 72} />
                {isStunned && <span className="text-sm mt-2 text-black/70">LOCKED</span>}
              </span>
              <div className="absolute inset-0 rounded-full border-4 border-white/30 pulse-ring" />
              {particles.map(p => (
                <span key={p.id} className="click-num absolute text-base font-black text-[#a855f7] z-20 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" style={{ left: p.x, top: p.y }}>
                  +{formatNumber(p.value)}
                </span>
              ))}
            </button>
            {isSmoked && (
              <div className="absolute inset-0 rounded-full bg-black/90 backdrop-blur flex items-center justify-center pointer-events-none z-30">
                <span className="text-[#ff0080] text-lg font-bold subtle-pulse">OBSCURED</span>
              </div>
            )}
          </div>

          {human.multiplier > 1 && (
            <div className="mt-4 text-sm text-[#a855f7] font-mono font-bold bg-[#a855f7]/10 px-4 py-2 rounded-full border border-[#a855f7]/30">
              {human.multiplier.toFixed(2)}x MULTIPLIER
            </div>
          )}

          {!isPhone && (
            <div className="mt-4 text-[10px] text-white/30 space-x-4">
              <span>[Space] Click</span>
              <span>[1-4] Shop</span>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT / BOTTOM: Shop panel ── */}
      <div className={`${isPhone ? 'h-[50%] border-t' : 'w-80 lg:w-96 border-l'} border-[#a855f7]/20 flex flex-col bg-black/50 backdrop-blur-sm shrink-0`}>
        {/* Tab bar */}
        <div className="flex shrink-0 border-b border-white/10">
          <button onClick={() => setTab('shop')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition ${tab === 'shop' ? 'text-[#a855f7] border-b-2 border-[#a855f7]' : 'text-white/40 hover:text-white/60'}`}>
            Shop
          </button>
          {settings.sabotagesEnabled && (
            <button onClick={() => setTab('sabotage')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition ${tab === 'sabotage' ? 'text-[#ff0080] border-b-2 border-[#ff0080]' : 'text-white/40 hover:text-white/60'}`}>
              Sabotage
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto page-scroll min-h-0">
          {tab === 'shop' && (
            <div>
              <div className="flex border-b border-white/5 px-1 sticky top-0 bg-black/90 z-10 backdrop-blur-sm">
                {([
                  { key: 'click' as const, label: 'Click', color: 'text-[#a855f7]' },
                  { key: 'auto' as const, label: 'Auto', color: 'text-[#ff0080]' },
                  { key: 'invest' as const, label: 'Invest', color: 'text-green-400' },
                  { key: 'special' as const, label: 'Mix', color: 'text-yellow-400' },
                ]).map((c, i) => (
                  <button key={c.key} onClick={() => setShopCat(c.key)} className={`flex-1 py-2.5 text-[11px] font-bold uppercase transition ${shopCat === c.key ? c.color : 'text-white/30 hover:text-white/50'}`}>
                    {c.label}
                    {!isPhone && <span className="text-white/20 ml-1">{i + 1}</span>}
                  </button>
                ))}
              </div>
              <ShopList player={human} category={shopCat} hasInflation={hasInflation} settings={settings} players={players} />
            </div>
          )}
          {tab === 'sabotage' && (
            <SabotagePanel player={human} rivals={rivals} target={target} setTarget={setTarget} cooldowns={sabotageCooldowns} settings={settings} />
          )}
        </div>

        {/* Feed */}
        {settings.showFeed && (
          <div className="border-t border-white/10 max-h-20 overflow-y-auto page-scroll px-3 py-1.5 shrink-0 bg-black/50">
            {feed.slice(0, 6).map(f => (
              <div key={f.id} className={`feed-slide text-[10px] py-0.5 truncate ${
                f.type === 'sabotage' ? 'text-[#ff0080]' : f.type === 'purchase' ? 'text-[#a855f7]' : 'text-white/40'
              }`}>{f.message}</div>
            ))}
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes foxyShake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-10px, 5px) rotate(-5deg); }
          50% { transform: translate(10px, -5px) rotate(5deg); }
          75% { transform: translate(-5px, 10px) rotate(-3deg); }
        }
      `}</style>
    </div>
  );
}

function ShopList({ player, category, hasInflation, settings, players }: {
  player: PlayerState; category: ShopItem['category']; hasInflation: boolean; settings: any; players: PlayerState[]
}) {
  const buyItem = useGameStore(s => s.buyItem);
  let discount = 1;
  if (settings.catchUpMechanic && players.length > 1) {
    const leader = Math.max(...players.map((p: PlayerState) => p.total));
    if (player.total < leader * 0.5 && leader > 100) discount = 1 - (settings.catchUpPercent / 100);
  }
  const items = SHOP_ITEMS.filter(i => i.category === category).sort((a, b) => a.baseCost - b.baseCost);
  const growthMod = settings.costGrowthRate / 100;
  
  const catColors: Record<string, string> = {
    click: 'from-[#a855f7]/20 to-[#a855f7]/5',
    auto: 'from-[#ff0080]/20 to-[#ff0080]/5',
    invest: 'from-green-500/20 to-green-500/5',
    special: 'from-yellow-500/20 to-yellow-500/5',
  };

  return (
    <div className="p-2 space-y-1.5">
      {category === 'invest' && (
        <div className="px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-green-400 text-center mb-2">
          Investments earn % of your total per second!
        </div>
      )}
      {hasInflation && (
        <div className="px-3 py-2 bg-[#ff0080]/20 border border-[#ff0080]/30 rounded-lg text-xs text-[#ff0080] text-center font-bold subtle-pulse">
          PRICE SURGE - Costs doubled!
        </div>
      )}
      {discount < 1 && (
        <div className="px-3 py-2 bg-[#a855f7]/20 border border-[#a855f7]/30 rounded-lg text-xs text-[#a855f7] text-center font-bold">
          CATCH-UP: -{settings.catchUpPercent}% costs
        </div>
      )}
      {items.map(item => {
        const owned = player.itemsOwned[item.id] || 0;
        let cost = Math.floor(getItemCost(item, owned, growthMod) * discount);
        if (hasInflation) cost *= 2;
        const can = player.total >= cost;
        return (
          <button
            key={item.id}
            onClick={() => buyItem(item.id)}
            disabled={!can}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
              can ? `bg-gradient-to-r ${catColors[category]} hover:brightness-125 border border-white/10` : 'bg-white/[0.02] border border-white/5 opacity-30'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-black text-white shrink-0">
              T{item.tier}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white truncate">{item.name}</span>
                {owned > 0 && <span className="text-[10px] text-[#a855f7] ml-1 shrink-0">x{owned}</span>}
              </div>
              <div className="text-[10px] text-white/40">{item.description}</div>
            </div>
            <div className={`text-sm font-mono font-bold shrink-0 ${can ? 'text-[#a855f7]' : 'text-white/30'}`}>
              {formatNumber(cost)}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function SabotagePanel({ player, rivals, target, setTarget, cooldowns, settings }: {
  player: PlayerState; rivals: PlayerState[]; target: string | null; setTarget: (id: string | null) => void; cooldowns: Record<string, number>; settings: any
}) {
  const useSabotage = useGameStore(s => s.useSabotage);
  return (
    <div className="p-3 space-y-4">
      <div>
        <div className="text-[10px] text-[#ff0080] uppercase tracking-wider font-bold mb-2">Select Target</div>
        <div className="grid grid-cols-2 gap-2">
          {rivals.map(r => (
            <button key={r.id} onClick={() => setTarget(target === r.id ? null : r.id)}
              className={`p-3 rounded-xl border-2 text-xs transition-all ${target === r.id ? 'border-[#ff0080] bg-[#ff0080]/15' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
            >
              <div className="flex items-center gap-2">
                <CursorMini skinId={r.skinId} size={18} />
                <span className="font-bold text-white truncate">{r.name}</span>
              </div>
              <div className="text-[#a855f7] font-mono text-[10px] mt-1">{formatNumber(r.total)}</div>
            </button>
          ))}
        </div>
        {rivals.length === 0 && (
          <div className="text-center text-white/30 text-xs py-4">No other players</div>
        )}
      </div>
      <div>
        <div className="text-[10px] text-[#ff0080] uppercase tracking-wider font-bold mb-2">Abilities</div>
        {SABOTAGE_ABILITIES.map(sab => {
          const onCd = (cooldowns[sab.id] || 0) > Date.now();
          const cdRem = onCd ? Math.ceil(((cooldowns[sab.id] || 0) - Date.now()) / 1000) : 0;
          const cost = getSabotageCost(sab, settings);
          const can = player.total >= cost && !onCd && target !== null;
          const isFoxy = sab.id === 'foxy';
          
          return (
            <button key={sab.id} onClick={() => target && useSabotage(sab.id, target)} disabled={!can}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-2 text-left transition-all ${
                isFoxy 
                  ? (can ? 'bg-red-900/40 hover:bg-red-800/50 border-2 border-red-500/60 animate-pulse' : 'bg-red-900/10 border border-red-900/30 opacity-30')
                  : (can ? 'bg-[#ff0080]/10 hover:bg-[#ff0080]/20 border border-[#ff0080]/30' : 'bg-white/[0.02] border border-white/5 opacity-30')
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isFoxy ? 'bg-red-600/40' : 'bg-[#ff0080]/20'}`}>
                {isFoxy ? (
                  <span className="text-lg">🦊</span>
                ) : (
                  <svg className="w-4 h-4 text-[#ff0080]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-bold ${isFoxy ? 'text-red-400' : 'text-white'}`}>{sab.name}</div>
                <div className={`text-[10px] ${isFoxy ? 'text-red-300/60' : 'text-white/40'}`}>{sab.description}</div>
                {onCd && <div className="text-[10px] text-[#ff0080] mt-0.5 font-bold">Cooldown: {cdRem}s</div>}
              </div>
              <div className={`text-sm font-mono font-bold shrink-0 ${player.total >= cost ? (isFoxy ? 'text-red-400' : 'text-[#ff0080]') : 'text-white/30'}`}>
                {formatNumber(cost)}
              </div>
            </button>
          );
        })}
        {!target && rivals.length > 0 && <div className="text-center text-white/30 text-xs py-2">Select a target first</div>}
      </div>
    </div>
  );
}

function StatBlock({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-lg md:text-xl font-black font-mono ${color}`}>{value}</div>
      <div className="text-[9px] text-white/40 uppercase tracking-wider font-bold">{label}</div>
    </div>
  );
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}
